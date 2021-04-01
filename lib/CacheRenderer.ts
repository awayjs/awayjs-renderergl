import { AssetEvent, Box, IAbstractionClass, IAbstractionPool, IAsset, IAssetClass, Rectangle, } from '@awayjs/core';
import { AttributesBuffer, BlendMode, Image2D, ImageSampler } from '@awayjs/stage';
import { BoundsPicker, ContainerNode, INode, IPartitionContainer, PartitionBase } from '@awayjs/view';
import { IMaterial } from './base/IMaterial';
import { ITexture } from './base/ITexture';
import { Style } from './base/Style';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { _Render_RenderableBase } from './base/_Render_RenderableBase';
import { _Render_RendererMaterial } from './base/_Render_RendererMaterial';
import { _Stage_ElementsBase } from './base/_Stage_ElementsBase';
import { TriangleElements, _Stage_TriangleElements } from './elements/TriangleElements';
import { MaterialEvent } from './events/MaterialEvent';
import { RenderableEvent } from './events/RenderableEvent';
import { StyleEvent } from './events/StyleEvent';
import { RendererBase } from './RendererBase';
import { RendererPool, RenderGroup } from './RenderGroup';
import { ImageTexture2D } from './textures/ImageTexture2D';

export class CacheRenderer extends RendererBase implements IMaterial, IAbstractionPool {

	public static assetType: string = '[renderer CacheRenderer]';

	public static materialClassPool: Record<string, _IRender_MaterialClass> = {};

	public static renderGroupPool: Record<string, RenderGroup> = {};

	public static defaultBackground: number = 0x0;

	private _boundsPicker: BoundsPicker;
	private _bounds: Box;
	private _boundsDirty: boolean;
	private _style: Style;
	private _texture: ImageTexture2D;
	private _textures: Array<ITexture> = new Array<ITexture>();
	private _blendMode: string = BlendMode.NORMAL;
	private _onTextureInvalidate: (event: AssetEvent) => void;
	private _onInvalidateProperties: (event: StyleEvent) => void;

	public node: ContainerNode;

	public animateUVs: boolean = false;

	public bothSides: boolean = false;

	public curves: boolean = false;

	public imageRect: boolean = false;

	public useColorTransform: boolean = true;

	public alphaThreshold: number = 0;

	public get assetType(): string {
		return CacheRenderer.assetType;
	}

	public getBounds(): Box {
		if (this._boundsDirty) {
			this._boundsDirty = false;

			this._updateBounds();

			(<Image2D> this._style.image)._setSize(this._bounds.width, this._bounds.height);
		}

		return this._bounds;
	}

	public get blendMode(): string {
		return this._blendMode;
	}

	public set blendMode(value: string) {
		if (this._blendMode == value)
			return;

		this._blendMode = value;

		this.invalidate();
	}

	/**
	 *
	 */
	public get style(): Style {
		return this._style;
	}

	public set style(value: Style) {
		if (this._style == value)
			return;

		if (this._style)
			this._style.removeEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._style = value;

		if (this._style)
			this._style.addEventListener(StyleEvent.INVALIDATE_PROPERTIES, this._onInvalidateProperties);

		this._invalidateStyle();
	}

	/**
	* The 2d texture to use as a bitmap cache.
	*/
	public get texture(): ImageTexture2D {

		//TODO check invalidation of _texture

		return this._texture;
	}

	public get hasValidCache() {
		const container = this.node.container;

		return container.cacheAsBitmap || (container.filters && container.filters.length > 0);
	}

	public set texture(value: ImageTexture2D) {
		if (this._texture == value)
			return;

		if (this._texture)
			this.removeTexture(this._texture);

		this._texture = value;

		if (this._texture)
			this.addTexture(this._texture);

		this.invalidatePasses();
	}

	constructor(partition: PartitionBase, pool: RendererPool) {
		super(partition, pool);

		this.node = partition.rootNode;
		this.node.transformDisabled = true;

		this._onTextureInvalidate = (_event: AssetEvent) => this.invalidate();
		this._onInvalidateProperties = (_event: StyleEvent) => this._invalidateStyle();

		this.style = new Style();

		this.texture = new ImageTexture2D();

		this._boundsPicker = this._renderGroup.pickGroup.getBoundsPicker(this._partition);

		this._updateBounds();

		this._style.image = new Image2D(this._bounds.width, this._bounds.height, false);
		this._style.sampler = new ImageSampler(false, false, false);

		this._view.target = this._style.image;

		this._traverserClass = CacheRenderer;

		const container = this.node.container;

		if (container.scale9Grid) {
			this.node.update9Slice(this._bounds);
		}

	}

	public render(
		enableDepthAndStencil: boolean = true, surfaceSelector: number = 0,
		mipmapSelector: number = 0, maskConfig: number = 0): void {

		if (!this.hasValidCache) {
			return;
		}

		super.render(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);

		const container = this.node.container;
		//@ts-ignore
		const filters = container.filters;
		const image = <Image2D> this.style.image;

		if (filters && filters.length > 0) {
			this._stage.filterManager.applyFilterStack(
				image, image, image.rect, image.rect, filters
			);
		}
	}

	public getNumTextures(): number {
		return this._textures.length;
	}

	public getTextureAt(index: number): ITexture {
		return this._textures[index];
	}

	public addTexture(texture: ITexture): void {
		this._textures.push(texture);

		texture.addEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidate);

		this.invalidate();
	}

	public removeTexture(texture: ITexture): void {
		this._textures.splice(this._textures.indexOf(texture), 1);

		texture.removeEventListener(AssetEvent.INVALIDATE, this._onTextureInvalidate);

		this.invalidate();
	}

	public requestAbstraction(asset: IAsset): IAbstractionClass {
		return _Render_Renderer;
	}

	/**
	 * Marks the shader programs for all passes as invalid, so they will be recompiled before the next use.
	 *
	 * @private
	 */
	public invalidatePasses(): void {
		this.dispatchEvent(new MaterialEvent(MaterialEvent.INVALIDATE_PASSES, this));
	}

	/**
	 *
	 */
	public enterNode(node: INode): boolean {
		const enter: boolean = super.enterNode(node);

		if (enter && node.boundsVisible)
			this.applyEntity(node.getBoundsPrimitive(this._renderGroup.pickGroup));

		return enter;
	}

	public onInvalidate(event: AssetEvent): void {
		super.onInvalidate(event);

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_ELEMENTS, this));

		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));

		this.invalidatePasses();

		this._boundsDirty = true;
	}

	public onClear(event: AssetEvent): void {
		super.onClear(event);

		this.texture.clear();
		this.texture = null;

		this.style.image.clear();
		this.style.image = null;
	}

	private _invalidateStyle(): void {
		this.dispatchEvent(new RenderableEvent(RenderableEvent.INVALIDATE_STYLE, this));
	}

	private _updateBounds(): void {
		this._bounds = this._boundsPicker.getBoxBounds(this.node, true, true);

		this._bounds.x = (this._bounds.x - 2) | 0;
		this._bounds.y = (this._bounds.y - 2) | 0;
		this._bounds.width = (this._bounds.width + 4) | 0;
		this._bounds.height = (this._bounds.height + 4) | 0;

		//this._view.width = this._bounds.width;
		//this._view.height = this._bounds.height;
		this._view.projection.ratio = (this._bounds.width / this._bounds.height);
		this._view.projection.originX = -1 - 2 * this._bounds.x / this._bounds.width;
		this._view.projection.originY = -1 - 2 * this._bounds.y / this._bounds.height;
		this._view.projection.scale = 1000 / this._bounds.height;
	}

	public static registerMaterial(renderMaterialClass: _IRender_MaterialClass, materialClass: IAssetClass): void {
		CacheRenderer.materialClassPool[materialClass.assetType] = renderMaterialClass;
	}
}

export class _Render_Renderer extends _Render_RenderableBase {

	public static assetType: string = '[render Renderer]';

	private static _samplerElements: Object = new Object();

	/**
     * //TODO
     *
     * @returns {away.base.TriangleElements}
     */
	protected _getStageElements(): _Stage_ElementsBase {

		const bounds: Box = (<CacheRenderer> this._asset).getBounds();
		const id: string = bounds.toString();

		let elements: TriangleElements = _Render_Renderer._samplerElements[id];

		if (!elements) {
			elements = _Render_Renderer._samplerElements[id] = new TriangleElements(new AttributesBuffer(5, 6));
			elements.setPositions([
				bounds.left, bounds.top, 0,
				bounds.right, bounds.bottom, 0,
				bounds.right, bounds.top, 0,

				bounds.left, bounds.top, 0,
				bounds.left, bounds.bottom, 0,
				bounds.right, bounds.bottom, 0,
			]);
			elements.setUVs([0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]);
		}
		// because bounds is same, not required invalidate buffers
		/*else {
			elements.setPositions(
				[bounds.left, bounds.bottom, 0,
					bounds.right, bounds.bottom, 0,
					bounds.right, bounds.top, 0,
					bounds.left, bounds.top, 0]);
		}*/

		return elements.getAbstraction<_Stage_TriangleElements>(this._stage);
	}

	public executeRender(
		enableDepthAndStencil: boolean = true,
		surfaceSelector: number = 0, mipmapSelector: number = 0, maskConfig: number = 0): void {

		// disable cull, because for render to texture it is bugged
		// this._stage.context.setCulling(ContextGLTriangleFace.NONE);

		super.executeRender(enableDepthAndStencil, surfaceSelector, mipmapSelector, maskConfig);
	}

	protected _getRenderMaterial(): _Render_RendererMaterial {
		return this._asset.getAbstraction<_Render_RendererMaterial>(
			this.renderGroup.getRenderElements(this.stageElements.elements));
	}

	protected _getStyle(): Style {

		return (<CacheRenderer> this._asset).style;
	}
}

CacheRenderer.registerMaterial(_Render_RendererMaterial, CacheRenderer);