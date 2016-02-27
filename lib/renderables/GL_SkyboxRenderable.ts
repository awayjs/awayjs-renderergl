import AttributesBuffer				= require("awayjs-core/lib/attributes/AttributesBuffer");
import AssetEvent					= require("awayjs-core/lib/events/AssetEvent");
import Matrix3D						= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D						= require("awayjs-core/lib/geom/Vector3D");

import ISurface						= require("awayjs-display/lib/base/ISurface");
import ElementsBase					= require("awayjs-display/lib/graphics/ElementsBase");
import TriangleElements				= require("awayjs-display/lib/graphics/TriangleElements");
import Skybox						= require("awayjs-display/lib/display/Skybox");
import Camera						= require("awayjs-display/lib/display/Camera");

import IContextGL					= require("awayjs-stagegl/lib/base/IContextGL");
import ContextGLProgramType			= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage						= require("awayjs-stagegl/lib/base/Stage");

import RendererBase					= require("awayjs-renderergl/lib/RendererBase");
import ShaderBase					= require("awayjs-renderergl/lib/shaders/ShaderBase");
import ShaderRegisterCache			= require("awayjs-renderergl/lib/shaders/ShaderRegisterCache");
import ShaderRegisterData			= require("awayjs-renderergl/lib/shaders/ShaderRegisterData");
import ShaderRegisterElement		= require("awayjs-renderergl/lib/shaders/ShaderRegisterElement");
import GL_RenderableBase			= require("awayjs-renderergl/lib/renderables/GL_RenderableBase");
import PassBase						= require("awayjs-renderergl/lib/surfaces/passes/PassBase");

/**
 * @class away.pool.GL_SkyboxRenderable
 */
class GL_SkyboxRenderable extends GL_RenderableBase
{
	public static vertexAttributesOffset:number = 1;

	/**
	 *
	 */
	private static _geometry:TriangleElements;

	private _vertexArray:Float32Array;

	/**
	 *
	 */
	private _skybox:Skybox;

	/**
	 * //TODO
	 *
	 * @param pool
	 * @param skybox
	 */
	constructor(skybox:Skybox, renderer:RendererBase)
	{
		super(skybox, skybox, renderer);

		this._skybox = skybox;

		this._vertexArray = new Float32Array([0, 0, 0, 0, 1, 1, 1, 1]);
	}

	/**
	 * //TODO
	 *
	 * @returns {away.base.TriangleElements}
	 * @private
	 */
	public _pGetElements():ElementsBase
	{
		var geometry:TriangleElements = GL_SkyboxRenderable._geometry;

		if (!geometry) {
			geometry = GL_SkyboxRenderable._geometry = new TriangleElements(new AttributesBuffer(11, 4));
			geometry.autoDeriveNormals = false;
			geometry.autoDeriveTangents = false;
			geometry.setIndices(Array<number>(0, 1, 2, 2, 3, 0, 6, 5, 4, 4, 7, 6, 2, 6, 7, 7, 3, 2, 4, 5, 1, 1, 0, 4, 4, 0, 3, 3, 7, 4, 2, 1, 5, 5, 6, 2));
			geometry.setPositions(Array<number>(-1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1));
		}

		return geometry;
	}

	public _pGetSurface():ISurface
	{
		return this._skybox;
	}

	public static _iIncludeDependencies(shader:ShaderBase)
	{

	}

	/**
	 * @inheritDoc
	 */
	public static _iGetVertexCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "mul vt0, va0, vc5\n" +
			"add vt0, vt0, vc4\n" +
			"m44 op, vt0, vc0\n";
	}

	public static _iGetFragmentCode(shader:ShaderBase, registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData):string
	{
		return "";
	}

	/**
	 * @inheritDoc
	 */
	public _setRenderState(pass:PassBase, camera:Camera, viewProjection:Matrix3D)
	{
		super._setRenderState(pass, camera, viewProjection);

		var context:IContextGL = this._stage.context;
		var pos:Vector3D = camera.scenePosition;
		this._vertexArray[0] = pos.x;
		this._vertexArray[1] = pos.y;
		this._vertexArray[2] = pos.z;
		this._vertexArray[4] = this._vertexArray[5] = this._vertexArray[6] = camera.projection.far/Math.sqrt(3);
		context.setProgramConstantsFromMatrix(ContextGLProgramType.VERTEX, 0, viewProjection, true);
		context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 4, this._vertexArray, 2);
	}
}

export = GL_SkyboxRenderable;