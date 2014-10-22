import ISubMesh							= require("awayjs-core/lib/core/base/ISubMesh");
import PickingCollisionVO				= require("awayjs-core/lib/core/pick/PickingCollisionVO");
import RenderablePool					= require("awayjs-core/lib/core/pool/RenderablePool");
import Point							= require("awayjs-core/lib/core/geom/Point");
import Vector3D							= require("awayjs-core/lib/core/geom/Vector3D");
import Billboard						= require("awayjs-core/lib/entities/Billboard");
import Mesh								= require("awayjs-core/lib/entities/Mesh");
import AbstractMethodError				= require("awayjs-core/lib/errors/AbstractMethodError");

import BillboardRenderable				= require("awayjs-stagegl/lib/core/pool/BillboardRenderable");
import RenderableBase					= require("awayjs-stagegl/lib/core/pool/RenderableBase");
import TriangleSubMeshRenderable		= require("awayjs-stagegl/lib/core/pool/TriangleSubMeshRenderable");

/**
 * An abstract base class for all picking collider classes. It should not be instantiated directly.
 *
 * @class away.pick.PickingColliderBase
 */
class PickingColliderBase
{
	private _billboardRenderablePool:RenderablePool;
	private _subMeshRenderablePool:RenderablePool;

	public rayPosition:Vector3D;
	public rayDirection:Vector3D;

	constructor()
	{
		this._billboardRenderablePool = RenderablePool.getPool(BillboardRenderable);
		this._subMeshRenderablePool = RenderablePool.getPool(TriangleSubMeshRenderable);
	}

	public _pPetCollisionNormal(indexData:Array<number> /*uint*/, vertexData:Array<number>, triangleIndex:number):Vector3D // PROTECTED
	{
		var normal:Vector3D = new Vector3D();
		var i0:number = indexData[ triangleIndex ]*3;
		var i1:number = indexData[ triangleIndex + 1 ]*3;
		var i2:number = indexData[ triangleIndex + 2 ]*3;
		var p0:Vector3D = new Vector3D(vertexData[ i0 ], vertexData[ i0 + 1 ], vertexData[ i0 + 2 ]);
		var p1:Vector3D = new Vector3D(vertexData[ i1 ], vertexData[ i1 + 1 ], vertexData[ i1 + 2 ]);
		var p2:Vector3D = new Vector3D(vertexData[ i2 ], vertexData[ i2 + 1 ], vertexData[ i2 + 2 ]);
		var side0:Vector3D = p1.subtract(p0);
		var side1:Vector3D = p2.subtract(p0);
		normal = side0.crossProduct(side1);
		normal.normalize();
		return normal;
	}

	public _pGetCollisionUV(indexData:Array<number> /*uint*/, uvData:Array<number>, triangleIndex:number, v:number, w:number, u:number, uvOffset:number, uvStride:number):Point // PROTECTED
	{
		var uv:Point = new Point();
		var uIndex:number = indexData[ triangleIndex ]*uvStride + uvOffset;
		var uv0:Vector3D = new Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
		uIndex = indexData[ triangleIndex + 1 ]*uvStride + uvOffset;
		var uv1:Vector3D = new Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
		uIndex = indexData[ triangleIndex + 2 ]*uvStride + uvOffset;
		var uv2:Vector3D = new Vector3D(uvData[ uIndex ], uvData[ uIndex + 1 ]);
		uv.x = u*uv0.x + v*uv1.x + w*uv2.x;
		uv.y = u*uv0.y + v*uv1.y + w*uv2.y;
		return uv;
	}

	/**
	 * @inheritDoc
	 */
	public _pTestRenderableCollision(renderable:RenderableBase, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number):boolean
	{
		throw new AbstractMethodError();
	}

	/**
	 * @inheritDoc
	 */
	public setLocalRay(localPosition:Vector3D, localDirection:Vector3D)
	{
		this.rayPosition = localPosition;
		this.rayDirection = localDirection;
	}

	/**
	 * Tests a <code>Billboard</code> object for a collision with the picking ray.
	 *
	 * @param billboard The billboard instance to be tested.
	 * @param pickingCollisionVO The collision object used to store the collision results
	 * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	 * @param findClosest
	 */
	public testBillboardCollision(billboard:Billboard, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number)
	{
		this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
		pickingCollisionVO.materialOwner = null;

		if (this._pTestRenderableCollision(<RenderableBase> this._billboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
			shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

			pickingCollisionVO.materialOwner = billboard;

			return true;
		}

		return false;
	}

	/**
	 * Tests a <code>Mesh</code> object for a collision with the picking ray.
	 *
	 * @param mesh The mesh instance to be tested.
	 * @param pickingCollisionVO The collision object used to store the collision results
	 * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	 * @param findClosest
	 */
	public testMeshCollision(mesh:Mesh, pickingCollisionVO:PickingCollisionVO, shortestCollisionDistance:number, findClosest:boolean):boolean
	{
		this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
		pickingCollisionVO.materialOwner = null;

		var subMesh:ISubMesh;

		var len:number = mesh.subMeshes.length;
		for (var i:number = 0; i < len; ++i) {
			subMesh = mesh.subMeshes[i];

			if (this._pTestRenderableCollision(<RenderableBase> this._subMeshRenderablePool.getItem(subMesh), pickingCollisionVO, shortestCollisionDistance)) {
				shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;

				pickingCollisionVO.materialOwner = subMesh;

				if (!findClosest)
					return true;
			}
		}

		return pickingCollisionVO.materialOwner != null;
	}
}

export = PickingColliderBase;