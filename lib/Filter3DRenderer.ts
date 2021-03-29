import { Rectangle, ProjectionBase } from '@awayjs/core';

import {
	Image2D,
	ImageSampler,
	_Stage_ImageBase,
	Stage,
	ContextGLDrawMode,
	ContextGLBlendFactor,
	ContextGLVertexBufferFormat,
	IContextGL,
	IIndexBuffer,
	IVertexBuffer,
	RTTEvent,
	RTTBufferManager,
	Filter3DBase,
	Filter3DTaskBase,
} from '@awayjs/stage';

/**
 * @class away.render.Filter3DRenderer
 */
export class Filter3DRenderer {
	private _filters: Array<Filter3DBase>;
	private _tasks: Array<Filter3DTaskBase>;
	private _filterTasksInvalid: boolean;
	private _mainInputTexture: Image2D;
	private _requireDepthRender: boolean;
	private _rttManager: RTTBufferManager;
	private _stage: Stage;
	private _filterSizesInvalid: boolean = true;
	private _onRTTResizeDelegate: (event: RTTEvent) => void;
	private _renderToTextureRect: Rectangle;

	private _sampler: ImageSampler;

	constructor(stage: Stage) {
		this._onRTTResizeDelegate = (event: RTTEvent) => this.onRTTResize(event);

		this._stage = stage;
		this._rttManager = RTTBufferManager.getInstance(stage);
		this._rttManager.addEventListener(RTTEvent.RESIZE, this._onRTTResizeDelegate);

		this._sampler = new ImageSampler(false, false, false);
		this._renderToTextureRect = new Rectangle();
	}

	private onRTTResize(event: RTTEvent): void {
		this._filterSizesInvalid = true;
	}

	public get requireDepthRender(): boolean {
		return this._requireDepthRender;
	}

	public getMainInputTexture(stage: Stage): Image2D {
		if (this._filterTasksInvalid)
			this.updateFilterTasks(stage);

		return this._mainInputTexture;
	}

	public get filters(): Filter3DBase[] {
		return this._filters;
	}

	public get sampler(): ImageSampler {
		return this._sampler;
	}

	public set filters(value: Filter3DBase[]) {
		this._filters = value;

		this._filterTasksInvalid = true;

		this._requireDepthRender = false;

		if (!this._filters)
			return;

		for (let i: number = 0; i < this._filters.length; ++i)
			if (this._filters[i].requireDepthRender)
				this._requireDepthRender = true;

		this._filterSizesInvalid = true;
	}

	public get renderToTextureRect(): Rectangle {
		if (this._filterSizesInvalid)
			this.updateFilterSizes();

		return this._renderToTextureRect;
	}

	private updateFilterTasks(stage: Stage): void {

		if (this._filterSizesInvalid)
			this.updateFilterSizes();

		if (!this._filters) {
			this._tasks = null;
			return;
		}

		this._tasks = new Array<Filter3DTaskBase>();

		const len = this._filters.length - 1;

		let filter: Filter3DBase;

		for (let i: number = 0; i <= len; ++i) {

			// make sure all internal tasks are linked together
			filter = this._filters[i];

			// filter.setRenderTargets(i == len ? null : this._filters[i + 1].getMainInputTexture(stage), stage);

			this._tasks = this._tasks.concat(filter.tasks);

		}

		this._mainInputTexture = null;//this._filters[0].getMainInputTexture(stage);

	}

	public render(stage: Stage, projection: ProjectionBase, depthTexture: Image2D): void {
		let len: number;
		let i: number;
		let task: Filter3DTaskBase;
		let texture: Image2D;
		const context: IContextGL = <IContextGL> stage.context;

		const indexBuffer: IIndexBuffer = this._rttManager.indexBuffer;

		let vertexBuffer: IVertexBuffer = this._rttManager.renderToTextureVertexBuffer;

		if (!this._filters)
			return;

		if (this._filterSizesInvalid)
			this.updateFilterSizes();

		if (this._filterTasksInvalid)
			this.updateFilterTasks(stage);

		len = this._filters.length;

		for (i = 0; i < len; ++i)
			this._filters[i].update(stage, projection);

		len = this._tasks.length;

		if (len > 1) {
			context.setProgram(this._tasks[0].getProgram(stage));
			context.setVertexBufferAt(
				this._tasks[0]._positionIndex,
				vertexBuffer,
				0,
				ContextGLVertexBufferFormat.FLOAT_2);

			/*
			context.setVertexBufferAt(
				1, //this._tasks[0]._uvIndex,
				vertexBuffer,
				8,
				ContextGLVertexBufferFormat.FLOAT_2);*/
		}

		for (i = 0; i < len; ++i) {

			task = this._tasks[i];

			stage.setRenderTarget(task.target);

			context.setProgram(task.getProgram(stage));

			texture = task.target;// getMainInputTexture(stage);

			(texture.getAbstraction<_Stage_ImageBase>(stage))
				.activate(
					0, //task._inputTextureIndex,
					this._sampler);

			if (!task.target) {

				vertexBuffer = this._rttManager.renderToScreenVertexBuffer;
				context.setVertexBufferAt(task._positionIndex, vertexBuffer, 0, ContextGLVertexBufferFormat.FLOAT_2);
				//context.setVertexBufferAt(task._uvIndex, vertexBuffer, 8, ContextGLVertexBufferFormat.FLOAT_2);

			}
			context.clear(0.0, 0.0, 0.0, 0.0);

			task.activate(stage, projection, depthTexture);

			context.setBlendFactors(ContextGLBlendFactor.ONE, ContextGLBlendFactor.ZERO);
			context.drawIndices(ContextGLDrawMode.TRIANGLES, indexBuffer, 0, 6);

			task.deactivate(stage);
		}

		context.setTextureAt(0, null);
		context.setVertexBufferAt(0, null);
		context.setVertexBufferAt(1, null);
	}

	private updateFilterSizes(): void {
		/*
		for (let i: number = 0; i < this._filters.length; ++i) {
			this._filters[i].textureWidth = this._rttManager.textureWidth;
			this._filters[i].textureHeight = this._rttManager.textureHeight;
			this._filters[i].rttManager = this._rttManager;
		}*/

		const scale: number = 1;//this._filters[0].textureScale;

		this._renderToTextureRect.x = this._rttManager.renderToTextureRect.x / scale;
		this._renderToTextureRect.y = this._rttManager.renderToTextureRect.y / scale;
		this._renderToTextureRect.width = this._rttManager.renderToTextureRect.width / scale;
		this._renderToTextureRect.height = this._rttManager.renderToTextureRect.height / scale;

		this._filterSizesInvalid = false;
	}

	public dispose(): void {
		this._rttManager.removeEventListener(RTTEvent.RESIZE, this._onRTTResizeDelegate);
		this._rttManager = null;
		this._stage = null;
	}
}