var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ContextGLMipFilter = require("awayjs-stagegl/lib/base/ContextGLMipFilter");
var ContextGLTextureFilter = require("awayjs-stagegl/lib/base/ContextGLTextureFilter");
var ContextGLWrapMode = require("awayjs-stagegl/lib/base/ContextGLWrapMode");
var MaterialPassGLBase = require("awayjs-renderergl/lib/passes/MaterialPassGLBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
/**
 * DistanceMapPass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
 * This is used to render omnidirectional shadow maps.
 */
var DistanceMapPass = (function (_super) {
    __extends(DistanceMapPass, _super);
    /**
     * Creates a new DistanceMapPass object.
     *
     * @param material The material to which this pass belongs.
     */
    function DistanceMapPass() {
        _super.call(this);
    }
    /**
     * Initializes the unchanging constant data for this material.
     */
    DistanceMapPass.prototype._iInitConstantData = function (shaderObject) {
        _super.prototype._iInitConstantData.call(this, shaderObject);
        var index = this._fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index + 4] = 1.0 / 255.0;
        data[index + 5] = 1.0 / 255.0;
        data[index + 6] = 1.0 / 255.0;
        data[index + 7] = 0.0;
    };
    DistanceMapPass.prototype._iIncludeDependencies = function (shaderObject) {
        shaderObject.projectionDependencies++;
        shaderObject.viewDirDependencies++;
        if (shaderObject.alphaThreshold > 0)
            shaderObject.uvDependencies++;
        if (shaderObject.viewDirDependencies > 0)
            shaderObject.globalPosDependencies++;
    };
    /**
     * @inheritDoc
     */
    DistanceMapPass.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        var code;
        var targetReg = sharedRegisters.shadedTarget;
        var diffuseInputReg = registerCache.getFreeTextureReg();
        var dataReg1 = registerCache.getFreeFragmentConstant();
        var dataReg2 = registerCache.getFreeFragmentConstant();
        this._fragmentConstantsIndex = dataReg1.index * 4;
        var temp1 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp1, 1);
        var temp2 = registerCache.getFreeFragmentVectorTemp();
        registerCache.addFragmentTempUsages(temp2, 1);
        // squared distance to view
        code = "dp3 " + temp1 + ".z, " + sharedRegisters.viewDirVarying + ".xyz, " + sharedRegisters.viewDirVarying + ".xyz\n" + "mul " + temp1 + ", " + dataReg1 + ", " + temp1 + ".z\n" + "frc " + temp1 + ", " + temp1 + "\n" + "mul " + temp2 + ", " + temp1 + ".yzww, " + dataReg2 + "\n";
        if (shaderObject.alphaThreshold > 0) {
            diffuseInputReg = registerCache.getFreeTextureReg();
            this._texturesIndex = diffuseInputReg.index;
            var albedo = registerCache.getFreeFragmentVectorTemp();
            code += ShaderCompilerHelper.getTex2DSampleCode(albedo, sharedRegisters, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
            var cutOffReg = registerCache.getFreeFragmentConstant();
            code += "sub " + albedo + ".w, " + albedo + ".w, " + cutOffReg + ".x\n" + "kil " + albedo + ".w\n";
        }
        code += "sub " + targetReg + ", " + temp1 + ", " + temp2 + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    DistanceMapPass.prototype._iActivate = function (pass, renderer, camera) {
        _super.prototype._iActivate.call(this, pass, renderer, camera);
        var context = renderer.context;
        var shaderObject = pass.shaderObject;
        var f = camera.projection.far;
        f = 1 / (2 * f * f);
        // sqrt(f*f+f*f) is largest possible distance for any frustum, so we need to divide by it. Rarely a tight fit, but with 32 bits precision, it's enough.
        var index = this._fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = 1.0 * f;
        data[index + 1] = 255.0 * f;
        data[index + 2] = 65025.0 * f;
        data[index + 3] = 16581375.0 * f;
        if (shaderObject.alphaThreshold > 0) {
            context.setSamplerStateAt(this._texturesIndex, shaderObject.repeatTextures ? ContextGLWrapMode.REPEAT : ContextGLWrapMode.CLAMP, shaderObject.useSmoothTextures ? ContextGLTextureFilter.LINEAR : ContextGLTextureFilter.NEAREST, shaderObject.useMipmapping ? ContextGLMipFilter.MIPLINEAR : ContextGLMipFilter.MIPNONE);
            renderer.stage.activateTexture(this._texturesIndex, shaderObject.texture);
            data[index + 8] = pass.shaderObject.alphaThreshold;
        }
    };
    return DistanceMapPass;
})(MaterialPassGLBase);
module.exports = DistanceMapPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvZGlzdGFuY2VtYXBwYXNzLnRzIl0sIm5hbWVzIjpbIkRpc3RhbmNlTWFwUGFzcyIsIkRpc3RhbmNlTWFwUGFzcy5jb25zdHJ1Y3RvciIsIkRpc3RhbmNlTWFwUGFzcy5faUluaXRDb25zdGFudERhdGEiLCJEaXN0YW5jZU1hcFBhc3MuX2lJbmNsdWRlRGVwZW5kZW5jaWVzIiwiRGlzdGFuY2VNYXBQYXNzLl9pR2V0RnJhZ21lbnRDb2RlIiwiRGlzdGFuY2VNYXBQYXNzLl9pQWN0aXZhdGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLElBQU8sa0JBQWtCLFdBQWEsNENBQTRDLENBQUMsQ0FBQztBQUNwRixJQUFPLHNCQUFzQixXQUFZLGdEQUFnRCxDQUFDLENBQUM7QUFDM0YsSUFBTyxpQkFBaUIsV0FBYSwyQ0FBMkMsQ0FBQyxDQUFDO0FBVWxGLElBQU8sa0JBQWtCLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUN6RixJQUFPLG9CQUFvQixXQUFhLGtEQUFrRCxDQUFDLENBQUM7QUFHNUYsQUFJQTs7O0dBREc7SUFDRyxlQUFlO0lBQVNBLFVBQXhCQSxlQUFlQSxVQUEyQkE7SUFLL0NBOzs7O09BSUdBO0lBQ0hBLFNBVktBLGVBQWVBO1FBWW5CQyxpQkFBT0EsQ0FBQ0E7SUFDVEEsQ0FBQ0E7SUFFREQ7O09BRUdBO0lBQ0lBLDRDQUFrQkEsR0FBekJBLFVBQTBCQSxZQUE2QkE7UUFFdERFLGdCQUFLQSxDQUFDQSxrQkFBa0JBLFlBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBRXZDQSxJQUFJQSxLQUFLQSxHQUFVQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBO1FBQ2hEQSxJQUFJQSxJQUFJQSxHQUFpQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQTtRQUMzREEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDNUJBLElBQUlB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R0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsQ0FBQ0E7UUFDcERBLENBQUNBO0lBQ0ZBLENBQUNBO0lBQ0ZMLHNCQUFDQTtBQUFEQSxDQWpIQSxBQWlIQ0EsRUFqSDZCLGtCQUFrQixFQWlIL0M7QUFFRCxBQUF5QixpQkFBaEIsZUFBZSxDQUFDIiwiZmlsZSI6InBhc3Nlcy9EaXN0YW5jZU1hcFBhc3MuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsi77u/aW1wb3J0IE1hdHJpeDNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgTWF0cml4M0RVdGlsc1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RVdGlsc1wiKTtcbmltcG9ydCBUZXh0dXJlMkRCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcblxuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9DYW1lcmFcIik7XG5cbmltcG9ydCBDb250ZXh0R0xNaXBGaWx0ZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xNaXBGaWx0ZXJcIik7XG5pbXBvcnQgQ29udGV4dEdMVGV4dHVyZUZpbHRlclx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xUZXh0dXJlRmlsdGVyXCIpO1xuaW1wb3J0IENvbnRleHRHTFdyYXBNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvQ29udGV4dEdMV3JhcE1vZGVcIik7XG5pbXBvcnQgSUNvbnRleHRHTFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9JQ29udGV4dEdMXCIpO1xuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBNYXRlcmlhbFBhc3NEYXRhXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9NYXRlcmlhbFBhc3NEYXRhXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBNYXRlcmlhbFBhc3NHTEJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL01hdGVyaWFsUGFzc0dMQmFzZVwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcbmltcG9ydCBSZW5kZXJlckJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3JlbmRlci9SZW5kZXJlckJhc2VcIik7XG5cbi8qKlxuICogRGlzdGFuY2VNYXBQYXNzIGlzIGEgcGFzcyB0aGF0IHdyaXRlcyBkaXN0YW5jZSB2YWx1ZXMgdG8gYSBkZXB0aCBtYXAgYXMgYSAzMi1iaXQgdmFsdWUgZXhwbG9kZWQgb3ZlciB0aGUgNCB0ZXh0dXJlIGNoYW5uZWxzLlxuICogVGhpcyBpcyB1c2VkIHRvIHJlbmRlciBvbW5pZGlyZWN0aW9uYWwgc2hhZG93IG1hcHMuXG4gKi9cbmNsYXNzIERpc3RhbmNlTWFwUGFzcyBleHRlbmRzIE1hdGVyaWFsUGFzc0dMQmFzZVxue1xuXHRwcml2YXRlIF9mcmFnbWVudENvbnN0YW50c0luZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfdGV4dHVyZXNJbmRleDpudW1iZXI7XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBuZXcgRGlzdGFuY2VNYXBQYXNzIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsIFRoZSBtYXRlcmlhbCB0byB3aGljaCB0aGlzIHBhc3MgYmVsb25ncy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZXMgdGhlIHVuY2hhbmdpbmcgY29uc3RhbnQgZGF0YSBmb3IgdGhpcyBtYXRlcmlhbC5cblx0ICovXG5cdHB1YmxpYyBfaUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRzdXBlci5faUluaXRDb25zdGFudERhdGEoc2hhZGVyT2JqZWN0KTtcblxuXHRcdHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleCArIDRdID0gMS4wLzI1NS4wO1xuXHRcdGRhdGFbaW5kZXggKyA1XSA9IDEuMC8yNTUuMDtcblx0XHRkYXRhW2luZGV4ICsgNl0gPSAxLjAvMjU1LjA7XG5cdFx0ZGF0YVtpbmRleCArIDddID0gMC4wO1xuXHR9XG5cblx0cHVibGljIF9pSW5jbHVkZURlcGVuZGVuY2llcyhzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdHNoYWRlck9iamVjdC5wcm9qZWN0aW9uRGVwZW5kZW5jaWVzKys7XG5cdFx0c2hhZGVyT2JqZWN0LnZpZXdEaXJEZXBlbmRlbmNpZXMrKztcblxuXHRcdGlmIChzaGFkZXJPYmplY3QuYWxwaGFUaHJlc2hvbGQgPiAwKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnV2RGVwZW5kZW5jaWVzKys7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LnZpZXdEaXJEZXBlbmRlbmNpZXMgPiAwKVxuXHRcdFx0c2hhZGVyT2JqZWN0Lmdsb2JhbFBvc0RlcGVuZGVuY2llcysrO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmc7XG5cdFx0dmFyIHRhcmdldFJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSBzaGFyZWRSZWdpc3RlcnMuc2hhZGVkVGFyZ2V0O1xuXHRcdHZhciBkaWZmdXNlSW5wdXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXHRcdHZhciBkYXRhUmVnMTpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudENvbnN0YW50KCk7XG5cdFx0dmFyIGRhdGFSZWcyOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKVxuXG5cdFx0dGhpcy5fZnJhZ21lbnRDb25zdGFudHNJbmRleCA9IGRhdGFSZWcxLmluZGV4KjQ7XG5cblx0XHR2YXIgdGVtcDE6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRWZWN0b3JUZW1wKCk7XG5cdFx0cmVnaXN0ZXJDYWNoZS5hZGRGcmFnbWVudFRlbXBVc2FnZXModGVtcDEsIDEpO1xuXHRcdHZhciB0ZW1wMjpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdpc3RlckNhY2hlLmdldEZyZWVGcmFnbWVudFZlY3RvclRlbXAoKTtcblx0XHRyZWdpc3RlckNhY2hlLmFkZEZyYWdtZW50VGVtcFVzYWdlcyh0ZW1wMiwgMSk7XG5cblx0XHQvLyBzcXVhcmVkIGRpc3RhbmNlIHRvIHZpZXdcblx0XHRjb2RlID0gXCJkcDMgXCIgKyB0ZW1wMSArIFwiLnosIFwiICsgc2hhcmVkUmVnaXN0ZXJzLnZpZXdEaXJWYXJ5aW5nICsgXCIueHl6LCBcIiArIHNoYXJlZFJlZ2lzdGVycy52aWV3RGlyVmFyeWluZyArIFwiLnh5elxcblwiICtcblx0XHRcdCAgIFwibXVsIFwiICsgdGVtcDEgKyBcIiwgXCIgKyBkYXRhUmVnMSArIFwiLCBcIiArIHRlbXAxICsgXCIuelxcblwiICtcblx0XHRcdCAgIFwiZnJjIFwiICsgdGVtcDEgKyBcIiwgXCIgKyB0ZW1wMSArIFwiXFxuXCIgK1xuXHRcdFx0ICAgXCJtdWwgXCIgKyB0ZW1wMiArIFwiLCBcIiArIHRlbXAxICsgXCIueXp3dywgXCIgKyBkYXRhUmVnMiArIFwiXFxuXCI7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LmFscGhhVGhyZXNob2xkID4gMCkge1xuXHRcdFx0ZGlmZnVzZUlucHV0UmVnID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXG5cdFx0XHR0aGlzLl90ZXh0dXJlc0luZGV4ID0gZGlmZnVzZUlucHV0UmVnLmluZGV4O1xuXG5cdFx0XHR2YXIgYWxiZWRvOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50VmVjdG9yVGVtcCgpO1xuXHRcdFx0Y29kZSArPSBTaGFkZXJDb21waWxlckhlbHBlci5nZXRUZXgyRFNhbXBsZUNvZGUoYWxiZWRvLCBzaGFyZWRSZWdpc3RlcnMsIGRpZmZ1c2VJbnB1dFJlZywgc2hhZGVyT2JqZWN0LnRleHR1cmUsIHNoYWRlck9iamVjdC51c2VTbW9vdGhUZXh0dXJlcywgc2hhZGVyT2JqZWN0LnJlcGVhdFRleHR1cmVzLCBzaGFkZXJPYmplY3QudXNlTWlwbWFwcGluZyk7XG5cblx0XHRcdHZhciBjdXRPZmZSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gcmVnaXN0ZXJDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXG5cdFx0XHRjb2RlICs9IFwic3ViIFwiICsgYWxiZWRvICsgXCIudywgXCIgKyBhbGJlZG8gKyBcIi53LCBcIiArIGN1dE9mZlJlZyArIFwiLnhcXG5cIiArXG5cdFx0XHRcdFwia2lsIFwiICsgYWxiZWRvICsgXCIud1xcblwiO1xuXHRcdH1cblxuXHRcdGNvZGUgKz0gXCJzdWIgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyB0ZW1wMSArIFwiLCBcIiArIHRlbXAyICsgXCJcXG5cIjtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lBY3RpdmF0ZShwYXNzOk1hdGVyaWFsUGFzc0RhdGEsIHJlbmRlcmVyOlJlbmRlcmVyQmFzZSwgY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHN1cGVyLl9pQWN0aXZhdGUocGFzcywgcmVuZGVyZXIsIGNhbWVyYSk7XG5cblx0XHR2YXIgY29udGV4dDpJQ29udGV4dEdMID0gcmVuZGVyZXIuY29udGV4dDtcblx0XHR2YXIgc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UgPSBwYXNzLnNoYWRlck9iamVjdDtcblxuXHRcdHZhciBmOm51bWJlciA9IGNhbWVyYS5wcm9qZWN0aW9uLmZhcjtcblxuXHRcdGYgPSAxLygyKmYqZik7XG5cdFx0Ly8gc3FydChmKmYrZipmKSBpcyBsYXJnZXN0IHBvc3NpYmxlIGRpc3RhbmNlIGZvciBhbnkgZnJ1c3R1bSwgc28gd2UgbmVlZCB0byBkaXZpZGUgYnkgaXQuIFJhcmVseSBhIHRpZ2h0IGZpdCwgYnV0IHdpdGggMzIgYml0cyBwcmVjaXNpb24sIGl0J3MgZW5vdWdoLlxuXHRcdHZhciBpbmRleDpudW1iZXIgPSB0aGlzLl9mcmFnbWVudENvbnN0YW50c0luZGV4O1xuXHRcdHZhciBkYXRhOkFycmF5PG51bWJlcj4gPSBzaGFkZXJPYmplY3QuZnJhZ21lbnRDb25zdGFudERhdGE7XG5cdFx0ZGF0YVtpbmRleF0gPSAxLjAqZjtcblx0XHRkYXRhW2luZGV4ICsgMV0gPSAyNTUuMCpmO1xuXHRcdGRhdGFbaW5kZXggKyAyXSA9IDY1MDI1LjAqZjtcblx0XHRkYXRhW2luZGV4ICsgM10gPSAxNjU4MTM3NS4wKmY7XG5cblx0XHRpZiAoc2hhZGVyT2JqZWN0LmFscGhhVGhyZXNob2xkID4gMCkge1xuXHRcdFx0Y29udGV4dC5zZXRTYW1wbGVyU3RhdGVBdCh0aGlzLl90ZXh0dXJlc0luZGV4LCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXM/IENvbnRleHRHTFdyYXBNb2RlLlJFUEVBVDpDb250ZXh0R0xXcmFwTW9kZS5DTEFNUCwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzPyBDb250ZXh0R0xUZXh0dXJlRmlsdGVyLkxJTkVBUiA6IENvbnRleHRHTFRleHR1cmVGaWx0ZXIuTkVBUkVTVCwgc2hhZGVyT2JqZWN0LnVzZU1pcG1hcHBpbmc/IENvbnRleHRHTE1pcEZpbHRlci5NSVBMSU5FQVIgOiBDb250ZXh0R0xNaXBGaWx0ZXIuTUlQTk9ORSk7XG5cdFx0XHRyZW5kZXJlci5zdGFnZS5hY3RpdmF0ZVRleHR1cmUodGhpcy5fdGV4dHVyZXNJbmRleCwgc2hhZGVyT2JqZWN0LnRleHR1cmUpO1xuXG5cdFx0XHRkYXRhW2luZGV4ICsgOF0gPSBwYXNzLnNoYWRlck9iamVjdC5hbHBoYVRocmVzaG9sZDtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gRGlzdGFuY2VNYXBQYXNzOyJdfQ==