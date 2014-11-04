var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var MaterialGLBase = require("awayjs-renderergl/lib/materials/MaterialGLBase");
/**
 * CompiledPass forms an abstract base class for the default compiled pass materials provided by Away3D,
 * using material methods to define their appearance.
 */
var TriangleMaterialBase = (function (_super) {
    __extends(TriangleMaterialBase, _super);
    function TriangleMaterialBase() {
        _super.apply(this, arguments);
    }
    TriangleMaterialBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        var code = "";
        //get the projection coordinates
        var position = (shaderObject.globalPosDependencies > 0) ? sharedRegisters.globalPositionVertex : sharedRegisters.localPosition;
        //reserving vertex constants for projection matrix
        var viewMatrixReg = registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        registerCache.getFreeVertexConstant();
        shaderObject.viewMatrixIndex = viewMatrixReg.index * 4;
        if (shaderObject.projectionDependencies > 0) {
            sharedRegisters.projectionFragment = registerCache.getFreeVarying();
            var temp = registerCache.getFreeVertexVectorTemp();
            code += "m44 " + temp + ", " + position + ", " + viewMatrixReg + "\n" + "mov " + sharedRegisters.projectionFragment + ", " + temp + "\n" + "mov op, " + temp + "\n";
        }
        else {
            code += "m44 op, " + position + ", " + viewMatrixReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    TriangleMaterialBase.prototype._iRenderPass = function (pass, renderable, stage, camera, viewProjection) {
        _super.prototype._iRenderPass.call(this, pass, renderable, stage, camera, viewProjection);
        var shaderObject = pass.shaderObject;
        if (shaderObject.sceneMatrixIndex >= 0) {
            renderable.sourceEntity.getRenderSceneTransform(camera).copyRawDataTo(shaderObject.vertexConstantData, shaderObject.sceneMatrixIndex, true);
            viewProjection.copyRawDataTo(shaderObject.vertexConstantData, shaderObject.viewMatrixIndex, true);
        }
        else {
            var matrix3D = Matrix3DUtils.CALCULATION_MATRIX;
            matrix3D.copyFrom(renderable.sourceEntity.getRenderSceneTransform(camera));
            matrix3D.append(viewProjection);
            matrix3D.copyRawDataTo(shaderObject.vertexConstantData, shaderObject.viewMatrixIndex, true);
        }
        var context = stage.context;
        context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, 0, shaderObject.vertexConstantData, shaderObject.numUsedVertexConstants);
        context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, 0, shaderObject.fragmentConstantData, shaderObject.numUsedFragmentConstants);
        stage.activateBuffer(0, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);
        context.drawTriangles(stage.getIndexBuffer(renderable.getIndexData()), 0, renderable.numTriangles);
    };
    return TriangleMaterialBase;
})(MaterialGLBase);
module.exports = TriangleMaterialBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvdHJpYW5nbGVtYXRlcmlhbGJhc2UudHMiXSwibmFtZXMiOlsiVHJpYW5nbGVNYXRlcmlhbEJhc2UiLCJUcmlhbmdsZU1hdGVyaWFsQmFzZS5jb25zdHJ1Y3RvciIsIlRyaWFuZ2xlTWF0ZXJpYWxCYXNlLl9pR2V0VmVydGV4Q29kZSIsIlRyaWFuZ2xlTWF0ZXJpYWxCYXNlLl9pUmVuZGVyUGFzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxhQUFhLFdBQWMsb0NBQW9DLENBQUMsQ0FBQztBQUd4RSxJQUFPLG1CQUFtQixXQUFhLDZDQUE2QyxDQUFDLENBQUM7QUFJdEYsSUFBTyxvQkFBb0IsV0FBYSw4Q0FBOEMsQ0FBQyxDQUFDO0FBVXhGLElBQU8sY0FBYyxXQUFjLGdEQUFnRCxDQUFDLENBQUM7QUFFckYsQUFJQTs7O0dBREc7SUFDRyxvQkFBb0I7SUFBU0EsVUFBN0JBLG9CQUFvQkEsVUFBdUJBO0lBQWpEQSxTQUFNQSxvQkFBb0JBO1FBQVNDLDhCQUFjQTtJQTBEakRBLENBQUNBO0lBeERPRCw4Q0FBZUEsR0FBdEJBLFVBQXVCQSxZQUE2QkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUxSEUsSUFBSUEsSUFBSUEsR0FBVUEsRUFBRUEsQ0FBQ0E7UUFFckJBLEFBQ0FBLGdDQURnQ0E7WUFDNUJBLFFBQVFBLEdBQXlCQSxDQUFDQSxZQUFZQSxDQUFDQSxxQkFBcUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUVBLGVBQWVBLENBQUNBLG9CQUFvQkEsR0FBR0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFFcEpBLEFBQ0FBLGtEQURrREE7WUFDOUNBLGFBQWFBLEdBQXlCQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ2hGQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ3RDQSxhQUFhQSxDQUFDQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ3RD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QW9CQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxZQUFZQSxDQUFDQSxvQkFBb0JBLEVBQUVBLFlBQVlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0E7UUFFakpBLEtBQUtBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLEVBQUVBLFVBQVVBLENBQUNBLGFBQWFBLENBQUNBLG1CQUFtQkEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsRUFBRUEsVUFBVUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxhQUFhQSxDQUFDQSxFQUFFQSxtQkFBbUJBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQ3pMQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxjQUFjQSxDQUFDQSxVQUFVQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxVQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtJQUNwR0EsQ0FBQ0E7SUFDRkgsMkJBQUNBO0FBQURBLENBMURBLEFBMERDQSxFQTFEa0MsY0FBYyxFQTBEaEQ7QUFFRCxBQUE4QixpQkFBckIsb0JBQW9CLENBQUMiLCJmaWxlIjoibWF0ZXJpYWxzL1RyaWFuZ2xlTWF0ZXJpYWxCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbIu+7v2ltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXhcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL1RyaWFuZ2xlU3ViR2VvbWV0cnlcIik7XG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IENvbnRleHRHTENvbXBhcmVNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMQ29tcGFyZU1vZGVcIik7XG5pbXBvcnQgQ29udGV4dEdMUHJvZ3JhbVR5cGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xQcm9ncmFtVHlwZVwiKTtcbmltcG9ydCBJQ29udGV4dEdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0R0xcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IE1hdGVyaWFsUGFzc0RhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL01hdGVyaWFsUGFzc0RhdGFcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJFbGVtZW50XCIpO1xuaW1wb3J0IE1hdGVyaWFsR0xCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL01hdGVyaWFsR0xCYXNlXCIpO1xuXG4vKipcbiAqIENvbXBpbGVkUGFzcyBmb3JtcyBhbiBhYnN0cmFjdCBiYXNlIGNsYXNzIGZvciB0aGUgZGVmYXVsdCBjb21waWxlZCBwYXNzIG1hdGVyaWFscyBwcm92aWRlZCBieSBBd2F5M0QsXG4gKiB1c2luZyBtYXRlcmlhbCBtZXRob2RzIHRvIGRlZmluZSB0aGVpciBhcHBlYXJhbmNlLlxuICovXG5jbGFzcyBUcmlhbmdsZU1hdGVyaWFsQmFzZSBleHRlbmRzIE1hdGVyaWFsR0xCYXNlXG57XG5cdHB1YmxpYyBfaUdldFZlcnRleENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXG5cdFx0Ly9nZXQgdGhlIHByb2plY3Rpb24gY29vcmRpbmF0ZXNcblx0XHR2YXIgcG9zaXRpb246U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gKHNoYWRlck9iamVjdC5nbG9iYWxQb3NEZXBlbmRlbmNpZXMgPiAwKT8gc2hhcmVkUmVnaXN0ZXJzLmdsb2JhbFBvc2l0aW9uVmVydGV4IDogc2hhcmVkUmVnaXN0ZXJzLmxvY2FsUG9zaXRpb247XG5cblx0XHQvL3Jlc2VydmluZyB2ZXJ0ZXggY29uc3RhbnRzIGZvciBwcm9qZWN0aW9uIG1hdHJpeFxuXHRcdHZhciB2aWV3TWF0cml4UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XG5cdFx0cmVnaXN0ZXJDYWNoZS5nZXRGcmVlVmVydGV4Q29uc3RhbnQoKTtcblx0XHRyZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhDb25zdGFudCgpO1xuXHRcdHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZVZlcnRleENvbnN0YW50KCk7XG5cdFx0c2hhZGVyT2JqZWN0LnZpZXdNYXRyaXhJbmRleCA9IHZpZXdNYXRyaXhSZWcuaW5kZXgqNDtcblxuXHRcdGlmIChzaGFkZXJPYmplY3QucHJvamVjdGlvbkRlcGVuZGVuY2llcyA+IDApIHtcblx0XHRcdHNoYXJlZFJlZ2lzdGVycy5wcm9qZWN0aW9uRnJhZ21lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVWYXJ5aW5nKCk7XG5cdFx0XHR2YXIgdGVtcDpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVWZXJ0ZXhWZWN0b3JUZW1wKCk7XG5cdFx0XHRjb2RlICs9IFwibTQ0IFwiICsgdGVtcCArIFwiLCBcIiArIHBvc2l0aW9uICsgXCIsIFwiICsgdmlld01hdHJpeFJlZyArIFwiXFxuXCIgK1xuXHRcdFx0XHRcIm1vdiBcIiArIHNoYXJlZFJlZ2lzdGVycy5wcm9qZWN0aW9uRnJhZ21lbnQgKyBcIiwgXCIgKyB0ZW1wICsgXCJcXG5cIiArXG5cdFx0XHRcdFwibW92IG9wLCBcIiArIHRlbXAgKyBcIlxcblwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb2RlICs9IFwibTQ0IG9wLCBcIiArIHBvc2l0aW9uICsgXCIsIFwiICsgdmlld01hdHJpeFJlZyArIFwiXFxuXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvZGU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaVJlbmRlclBhc3MocGFzczpNYXRlcmlhbFBhc3NEYXRhLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmlld1Byb2plY3Rpb246TWF0cml4M0QpXG5cdHtcblx0XHRzdXBlci5faVJlbmRlclBhc3MocGFzcywgcmVuZGVyYWJsZSwgc3RhZ2UsIGNhbWVyYSwgdmlld1Byb2plY3Rpb24pO1xuXG5cdFx0dmFyIHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlID0gcGFzcy5zaGFkZXJPYmplY3Q7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LnNjZW5lTWF0cml4SW5kZXggPj0gMCkge1xuXHRcdFx0cmVuZGVyYWJsZS5zb3VyY2VFbnRpdHkuZ2V0UmVuZGVyU2NlbmVUcmFuc2Zvcm0oY2FtZXJhKS5jb3B5UmF3RGF0YVRvKHNoYWRlck9iamVjdC52ZXJ0ZXhDb25zdGFudERhdGEsIHNoYWRlck9iamVjdC5zY2VuZU1hdHJpeEluZGV4LCB0cnVlKTtcblx0XHRcdHZpZXdQcm9qZWN0aW9uLmNvcHlSYXdEYXRhVG8oc2hhZGVyT2JqZWN0LnZlcnRleENvbnN0YW50RGF0YSwgc2hhZGVyT2JqZWN0LnZpZXdNYXRyaXhJbmRleCwgdHJ1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBtYXRyaXgzRDpNYXRyaXgzRCA9IE1hdHJpeDNEVXRpbHMuQ0FMQ1VMQVRJT05fTUFUUklYO1xuXG5cdFx0XHRtYXRyaXgzRC5jb3B5RnJvbShyZW5kZXJhYmxlLnNvdXJjZUVudGl0eS5nZXRSZW5kZXJTY2VuZVRyYW5zZm9ybShjYW1lcmEpKTtcblx0XHRcdG1hdHJpeDNELmFwcGVuZCh2aWV3UHJvamVjdGlvbik7XG5cblx0XHRcdG1hdHJpeDNELmNvcHlSYXdEYXRhVG8oc2hhZGVyT2JqZWN0LnZlcnRleENvbnN0YW50RGF0YSwgc2hhZGVyT2JqZWN0LnZpZXdNYXRyaXhJbmRleCwgdHJ1ZSk7XG5cdFx0fVxuXG5cdFx0dmFyIGNvbnRleHQ6SUNvbnRleHRHTCA9IHN0YWdlLmNvbnRleHQ7XG5cblx0XHRjb250ZXh0LnNldFByb2dyYW1Db25zdGFudHNGcm9tQXJyYXkoQ29udGV4dEdMUHJvZ3JhbVR5cGUuVkVSVEVYLCAwLCBzaGFkZXJPYmplY3QudmVydGV4Q29uc3RhbnREYXRhLCBzaGFkZXJPYmplY3QubnVtVXNlZFZlcnRleENvbnN0YW50cyk7XG5cdFx0Y29udGV4dC5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLkZSQUdNRU5ULCAwLCBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGEsIHNoYWRlck9iamVjdC5udW1Vc2VkRnJhZ21lbnRDb25zdGFudHMpO1xuXG5cdFx0c3RhZ2UuYWN0aXZhdGVCdWZmZXIoMCwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhEYXRhKFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIHJlbmRlcmFibGUuZ2V0VmVydGV4T2Zmc2V0KFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fREFUQSksIFRyaWFuZ2xlU3ViR2VvbWV0cnkuUE9TSVRJT05fRk9STUFUKTtcblx0XHRjb250ZXh0LmRyYXdUcmlhbmdsZXMoc3RhZ2UuZ2V0SW5kZXhCdWZmZXIocmVuZGVyYWJsZS5nZXRJbmRleERhdGEoKSksIDAsIHJlbmRlcmFibGUubnVtVHJpYW5nbGVzKTtcblx0fVxufVxuXG5leHBvcnQgPSBUcmlhbmdsZU1hdGVyaWFsQmFzZTsiXX0=