import {AssetEvent, Matrix3D, ProjectionBase} from "@awayjs/core";

import {BlendMode} from "@awayjs/graphics";

import {Skybox} from "@awayjs/scene";

import {ContextGLCompareMode} from "@awayjs/stage";

import {IElementsClassGL} from "../elements/IElementsClassGL";
import {GL_RenderableBase} from "../renderables/GL_RenderableBase";
import {ShaderBase} from "../shaders/ShaderBase";
import {ShaderRegisterCache} from "../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../shaders/ShaderRegisterData";
import {GL_TextureBase} from "../textures/GL_TextureBase";

import {GL_MaterialPassBase} from "./GL_MaterialPassBase";
import {MaterialPool} from "./MaterialPool";

/**
 * GL_SkyboxMaterial forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
export class GL_SkyboxMaterial extends GL_MaterialPassBase
{
	public _skybox:Skybox;
	public _texture:GL_TextureBase;

	constructor(skybox:Skybox, elementsClass:IElementsClassGL, renderPool:MaterialPool)
	{
		super(skybox, elementsClass, renderPool);

		this._skybox = skybox;

		this._shader = new ShaderBase(elementsClass, this, this._stage);

		this._texture = <GL_TextureBase> this._shader.getAbstraction(this._skybox.texture);

		this._pAddPass(this);
	}

	public onClear(event:AssetEvent):void
	{
		super.onClear(event);

		this._texture.onClear(new AssetEvent(AssetEvent.CLEAR, this._skybox.texture));
		this._texture = null;

		this._skybox = null;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateRender():void
	{
		super._pUpdateRender();

		this._pRequiresBlending = (this._material.blendMode != BlendMode.NORMAL);

		this.shader.setBlendMode((this._material.blendMode == BlendMode.NORMAL && this._pRequiresBlending)? BlendMode.LAYER : this._material.blendMode);
	}

	public _iIncludeDependencies(shader:ShaderBase):void
	{
		super._iIncludeDependencies(shader);

		shader.usesPositionFragment = true;
	}

	/**
	 * @inheritDoc
	 */
	public _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return this._texture._iGetFragmentCode(sharedRegisters.shadedTarget, registerCache, sharedRegisters, sharedRegisters.positionVarying);
	}


	public _setRenderState(renderable:GL_RenderableBase, projection:ProjectionBase):void
	{
		super._setRenderState(renderable, projection);

		this._texture._setRenderState(renderable);
	}
	/**
	 * @inheritDoc
	 */
	public _iActivate(projection:ProjectionBase):void
	{
		super._iActivate(projection);

		this._stage.context.setDepthTest(false, ContextGLCompareMode.LESS);

		this._texture.activate(this);
	}
}