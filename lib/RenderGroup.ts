import {IAssetClass, IAsset, IAbstractionPool, EventDispatcher} from "@awayjs/core";

import {Stage, StageEvent} from "@awayjs/stage";

import {IRenderEntity} from "./base/IRenderEntity";
import {RenderEntity} from "./base/RenderEntity";
import {_IRender_ElementsClass} from "./base/_IRender_ElementsClass";
import {_Render_ElementsBase} from "./base/_Render_ElementsBase";
import { RendererBase } from './RendererBase';
import { PartitionBase, View, ViewEvent, PickGroup } from '@awayjs/view';
import { DefaultRenderer } from './DefaultRenderer';
import { _IRender_MaterialClass } from './base/_IRender_MaterialClass';
import { IMaterialClass } from './base/IMaterialClass';
import { DepthRenderer } from './DepthRenderer';
import { DistanceRenderer } from './DistanceRenderer';
import { IMapper } from './base/IMapper';

interface IRendererPool extends IAbstractionPool
{
	materialClassPool:Object;
}

class DefaultRendererPool implements IRendererPool
{
	public static _materialClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _renderGroup:RenderGroup;

	public get materialClassPool():Object
	{
		return DefaultRendererPool._materialClassPool;
	}

	constructor(renderGroup:RenderGroup)
	{
		this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):DefaultRenderer
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new DefaultRenderer(this._renderGroup, partition, this)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
	
	/**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
    {
        DefaultRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
    }
}

class DepthRendererPool implements IAbstractionPool
{
	public static _materialClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _renderGroup:RenderGroup;

	public get materialClassPool():Object
	{
		return DepthRendererPool._materialClassPool;
	}

	constructor(renderGroup:RenderGroup)
	{
		this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):DefaultRenderer
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new DepthRenderer(this._renderGroup, partition, this)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
	
	/**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
    {
        DepthRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
    }
}

class DistanceRendererPool implements IAbstractionPool
{
	public static _materialClassPool:Object = new Object();

	private _abstractionPool:Object = new Object();
	private _renderGroup:RenderGroup;

	public get materialClassPool():Object
	{
		return DistanceRendererPool._materialClassPool;
	}

	constructor(renderGroup:RenderGroup)
	{
		this._renderGroup = renderGroup;
	}

	/**
	 * //TODO
	 *
	 * @param entity
	 * @returns EntityNode
	 */
	public getAbstraction(partition:PartitionBase):DefaultRenderer
	{
		return (this._abstractionPool[partition.id] || (this._abstractionPool[partition.id] = new DistanceRenderer(this._renderGroup, partition, this)));
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(partition:PartitionBase):void
	{
		delete this._abstractionPool[partition.id];
	}
	
	/**
     *
     * @param imageObjectClass
     */
    public static registerMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
    {
        DistanceRendererPool._materialClassPool[materialClass.assetType] = renderMaterialClass;
    }
}

export enum RendererType
{
	DEFAULT,

	DEPTH,

	DISTANCE
}

/**
 * @class away.pool.RenderGroup
 */
export class RenderGroup extends EventDispatcher implements IAbstractionPool
{
	private static _rendererClass:Object = {
		[RendererType.DEFAULT]:DefaultRendererPool,
		[RendererType.DEPTH]:DepthRendererPool,
		[RendererType.DISTANCE]:DistanceRendererPool,
	}

	private static _defaultInstancePool:Object = new Object();
	private static _depthInstancePool:Object = new Object();
	private static _distanceInstancePool:Object = new Object();

	private static _instancePool:Object = {
		[RendererType.DEFAULT]:RenderGroup._defaultInstancePool,
		[RendererType.DEPTH]:RenderGroup._depthInstancePool,
		[RendererType.DISTANCE]:RenderGroup._distanceInstancePool,
	}

	private static _renderElementsClassPool:Object = new Object();

	public static getInstance(view:View, rendererType:RendererType):RenderGroup
	{
		return this._instancePool[rendererType][view.id] || (this._instancePool[rendererType][view.id] = new RenderGroup(view, rendererType));
	}

	private _onContextUpdateDelegate:(event:StageEvent) => void;
	private _onSizeInvalidateDelegate:(event:ViewEvent) => void;

	private _invalid:boolean;
	private _mappers:Array<IMapper> = new Array<IMapper>();
	private _view:View;
	private _depthRenderGroup:RenderGroup;
	private _distanceRenderGroup:RenderGroup;

	private _stage:Stage;
	private _pickGroup:PickGroup;
	private _materialClassPool:Object;
	private _materialPools:Object = new Object();
	private _entityPool:Object = new Object();
	private _rendererPool:IRendererPool;

	public get view():View
	{
		return this._view;
	}

	public get depthRenderGroup():RenderGroup
	{
		if (this._depthRenderGroup == null)
			this._depthRenderGroup = RenderGroup.getInstance(new View(null, this._stage), RendererType.DEPTH);

		return this._depthRenderGroup;
	}

	public get distanceRenderGroup():RenderGroup
	{
		if (this._distanceRenderGroup == null)
			this._distanceRenderGroup = RenderGroup.getInstance(new View(null, this._stage), RendererType.DISTANCE);

		return this._distanceRenderGroup;
	}

	public get stage():Stage
	{
		return this._stage;
	}

	public get pickGroup():PickGroup
	{
		return this._pickGroup;
	}

	/**
	 * //TODO
	 *
	 * @param materialClassGL
	 */
	constructor(view:View, rendererType:RendererType)
	{
		super();

		this._view = view;
		this._stage = view.stage;
		this._pickGroup = PickGroup.getInstance(view);
		this._rendererPool = new RenderGroup._rendererClass[rendererType](this);
		this._materialClassPool = this._rendererPool.materialClassPool;

		if (rendererType != RendererType.DEFAULT) //set shadow renderer backgrounds to white
			this._view.backgroundColor = 0xFFFFFF;

		this._onSizeInvalidateDelegate = (event:ViewEvent) => this.onSizeInvalidate(event);
		this._onContextUpdateDelegate = (event:StageEvent) => this.onContextUpdate(event);

		this._stage.addEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._stage.addEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._view.addEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);
	}
	
	/**
	 * Disposes the resources used by the RendererBase.
	 */
	public dispose():void
	{
		this._stage.removeEventListener(StageEvent.CONTEXT_CREATED, this._onContextUpdateDelegate);
		this._stage.removeEventListener(StageEvent.CONTEXT_RECREATED, this._onContextUpdateDelegate);
		this._view.removeEventListener(ViewEvent.INVALIDATE_SIZE, this._onSizeInvalidateDelegate);

		this._view = null;
		this._stage = null;
	}

	public update(partition:PartitionBase):void
	{
		//update mappers
        var len:number = this._mappers.length;
        for (var i:number = 0; i < len; i++)
            this._mappers[i].update(partition, this);
	}

	public invalidate():void
	{
		this._invalid = true;
	}

	public _addMapper(mapper:IMapper)
    {
    	if (this._mappers.indexOf(mapper) != -1)
    		return;

        this._mappers.push(mapper)
    }

    public _removeMapper(mapper:IMapper)
    {
    	var index:number = this._mappers.indexOf(mapper);

    	if (index != -1)
        	this._mappers.splice(index, 1);
	}
	
	/**
	 *
	 */
	public onSizeInvalidate(event:ViewEvent):void
	{
		this.dispatchEvent(event);
	}
	
	/**
	 * Assign the context once retrieved
	 */
	private onContextUpdate(event:StageEvent):void
	{
		this.dispatchEvent(event);
	}


	public getRenderElements(elements:IAsset):_Render_ElementsBase
	{
		return this._materialPools[elements.assetType] || (this._materialPools[elements.assetType] = new (<_IRender_ElementsClass> RenderGroup._renderElementsClassPool[elements.assetType])(this._stage, this._materialClassPool, this));
	}

	public getAbstraction(entity:IRenderEntity):RenderEntity
	{
		return this._entityPool[entity.id] || (this._entityPool[entity.id] = new RenderEntity(this._stage, entity, this));
	}

	public getRenderer(partition:PartitionBase):RendererBase
	{
		return <RendererBase> this._rendererPool.getAbstraction(partition);
	}

	/**
	 *
	 * @param entity
	 */
	public clearAbstraction(entity:IRenderEntity):void
	{
		delete this._entityPool[entity.id];
	}

    /**
     *
     * @param imageObjectClass
     */
    public static registerElements(renderElementsClass:_IRender_ElementsClass, elementsClass:IAssetClass):void
    {
        RenderGroup._renderElementsClassPool[elementsClass.assetType] = renderElementsClass;
	}
	
	public static registerDefaultMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
	{
		DefaultRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}

	public static registerDepthMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
	{
		DepthRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}

	public static registerDistanceMaterial(renderMaterialClass:_IRender_MaterialClass, materialClass:IMaterialClass):void
	{
		DistanceRendererPool.registerMaterial(renderMaterialClass, materialClass);
	}
}