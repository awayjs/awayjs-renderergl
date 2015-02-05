var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
var ShaderCompilerHelper = require("awayjs-renderergl/lib/utils/ShaderCompilerHelper");
var RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
/**
 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
 * using material methods to define their appearance.
 */
var BasicMaterialPass = (function (_super) {
    __extends(BasicMaterialPass, _super);
    function BasicMaterialPass(renderObject, renderObjectOwner, renderableClass, stage) {
        _super.call(this, renderObject, renderObjectOwner, renderableClass, stage);
        this._diffuseR = 1;
        this._diffuseG = 1;
        this._diffuseB = 1;
        this._diffuseA = 1;
        this._shader = new ShaderObjectBase(renderableClass, this, this._stage);
    }
    BasicMaterialPass.prototype._iIncludeDependencies = function (shaderObject) {
        _super.prototype._iIncludeDependencies.call(this, shaderObject);
        if (shaderObject.texture != null)
            shaderObject.uvDependencies++;
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iGetFragmentCode = function (shaderObject, regCache, sharedReg) {
        var code = "";
        var targetReg = sharedReg.shadedTarget;
        var diffuseInputReg;
        if (shaderObject.texture != null) {
            diffuseInputReg = regCache.getFreeTextureReg();
            this._texturesIndex = diffuseInputReg.index;
            code += ShaderCompilerHelper.getTex2DSampleCode(targetReg, sharedReg, diffuseInputReg, shaderObject.texture, shaderObject.useSmoothTextures, shaderObject.repeatTextures, shaderObject.useMipmapping);
            if (shaderObject.alphaThreshold > 0) {
                var cutOffReg = regCache.getFreeFragmentConstant();
                this._fragmentConstantsIndex = cutOffReg.index * 4;
                code += "sub " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n" + "kil " + targetReg + ".w\n" + "add " + targetReg + ".w, " + targetReg + ".w, " + cutOffReg + ".x\n";
            }
        }
        else if (shaderObject.colorBufferIndex != -1) {
            code += "mov " + targetReg + ", " + sharedReg.colorVarying + "\n";
        }
        else {
            diffuseInputReg = regCache.getFreeFragmentConstant();
            this._fragmentConstantsIndex = diffuseInputReg.index * 4;
            code += "mov " + targetReg + ", " + diffuseInputReg + "\n";
        }
        return code;
    };
    /**
     * @inheritDoc
     */
    BasicMaterialPass.prototype._iActivate = function (camera) {
        _super.prototype._iActivate.call(this, camera);
        if (this._shader.texture != null) {
            this._stage.activateTexture(this._texturesIndex, this._shader.texture, this._shader.repeatTextures, this._shader.useSmoothTextures, this._shader.useMipmapping);
            if (this._shader.alphaThreshold > 0)
                this._shader.fragmentConstantData[this._fragmentConstantsIndex] = this._shader.alphaThreshold;
        }
        else if (this._shader.colorBufferIndex == -1) {
            var index = this._fragmentConstantsIndex;
            var data = this._shader.fragmentConstantData;
            data[index] = this._diffuseR;
            data[index + 1] = this._diffuseG;
            data[index + 2] = this._diffuseB;
            data[index + 3] = this._diffuseA;
        }
    };
    return BasicMaterialPass;
})(RenderPassBase);
module.exports = BasicMaterialPass;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wYXNzZXMvYmFzaWNtYXRlcmlhbHBhc3MudHMiXSwibmFtZXMiOlsiQmFzaWNNYXRlcmlhbFBhc3MiLCJCYXNpY01hdGVyaWFsUGFzcy5jb25zdHJ1Y3RvciIsIkJhc2ljTWF0ZXJpYWxQYXNzLl9pSW5jbHVkZURlcGVuZGVuY2llcyIsIkJhc2ljTWF0ZXJpYWxQYXNzLl9pR2V0RnJhZ21lbnRDb2RlIiwiQmFzaWNNYXRlcmlhbFBhc3MuX2lBY3RpdmF0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBcUJBLElBQU8sZ0JBQWdCLFdBQWMsb0RBQW9ELENBQUMsQ0FBQztBQUkzRixJQUFPLG9CQUFvQixXQUFhLGtEQUFrRCxDQUFDLENBQUM7QUFFNUYsSUFBTyxjQUFjLFdBQWMsNkNBQTZDLENBQUMsQ0FBQztBQUdsRixBQUlBOzs7R0FERztJQUNHLGlCQUFpQjtJQUFTQSxVQUExQkEsaUJBQWlCQSxVQUF1QkE7SUFVN0NBLFNBVktBLGlCQUFpQkEsQ0FVVkEsWUFBNkJBLEVBQUVBLGlCQUFvQ0EsRUFBRUEsZUFBZ0NBLEVBQUVBLEtBQVdBO1FBRTdIQyxrQkFBTUEsWUFBWUEsRUFBRUEsaUJBQWlCQSxFQUFFQSxlQUFlQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQVZ4REEsY0FBU0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDckJBLGNBQVNBLEdBQVVBLENBQUNBLENBQUNBO1FBQ3JCQSxjQUFTQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUNyQkEsY0FBU0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFTNUJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLGdCQUFnQkEsQ0FBQ0EsZUFBZUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDekVBLENBQUNBO0lBRU1ELGlEQUFxQkEsR0FBNUJBLFVBQTZCQSxZQUE2QkE7UUFFekRFLGdCQUFLQSxDQUFDQSxxQkFBcUJBLFlBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBRTFDQSxFQUFFQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUNoQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7SUFDaENBLENBQUNBO0lBRURGOztPQUVHQTtJQUNJQSw2Q0FBaUJBLEdBQXhCQSxVQUF5QkEsWUFBNkJBLEVBQUVBLFFBQTRCQSxFQUFFQSxTQUE0QkE7UUFFakhHLElBQUlBLElBQUlBLEdBQVVBLEVBQUVBLENBQUNBO1FBQ3JCQSxJQUFJQSxTQUFTQSxHQUF5QkEsU0FBU0EsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFDN0RBLElBQUlBLGVBQXFDQSxDQUFDQTtRQUUxQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbENBLGVBQWVBLEdBQUdBLFFBQVFBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7WUFFL0NBLElBQUlBLENBQUNBLGNBQWNBLEdBQUdBLGVBQWVBLENBQUNBLEtBQUtBLENBQUNBO1lBRTVDQSxJQUFJQSxJQUFJQSxvQkFBb0JBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsU0FBU0EsRUFBRUEsU0FBU0EsRUFBRUEsZUFBZUEsRUFBRUEsWUFBWUEsQ0FBQ0EsT0FBT0EsRUFBRUEsWUFBWUEsQ0FBQ0EsaUJBQWlCQSxFQUFFQSxZQUFZQSxDQUFDQSxjQUFjQSxFQUFFQSxZQUFZQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtZQUV0TUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsY0FBY0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JDQSxJQUFJQSxTQUFTQSxHQUF5QkEsUUFBUUEsQ0FBQ0EsdUJBQXVCQSxFQUFFQSxDQUFDQTtnQkFDekVBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsU0FBU0EsQ0FBQ0EsS0FBS0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRWpEQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUNyTEEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsZ0JBQWdCQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVoREEsSUFBSUEsSUFBSUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsSUFBSUEsR0FBR0EsU0FBU0EsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDbkVBLENBQUNBO1FBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ1BBLGVBQWVBLEdBQUdBLFFBQVFBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7WUFFckRBLElBQUlBLENBQUNBLHVCQUF1QkEsR0FBR0EsZUFBZUEsQ0FBQ0EsS0FBS0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFdkRBLElBQUlBLElBQUlBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLElBQUlBLEdBQUdBLGVBQWVBLEdBQUdBLElBQUlBLENBQUNBO1FBQzVEQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNiQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSUEsc0NBQVVBLEdBQWpCQSxVQUFrQkEsTUFBYUE7UUFFOUJJLGdCQUFLQSxDQUFDQSxVQUFVQSxZQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUV6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbENBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGlCQUFpQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7WUFFaEtBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGNBQWNBLENBQUNBO1FBQ2hHQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hEQSxJQUFJQSxLQUFLQSxHQUFVQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBO1lBQ2hEQSxJQUFJQSxJQUFJQSxHQUFpQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQTtZQUMzREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDbENBLENBQUNBO0lBQ0ZBLENBQUNBO0lBQ0ZKLHdCQUFDQTtBQUFEQSxDQWxGQSxBQWtGQ0EsRUFsRitCLGNBQWMsRUFrRjdDO0FBRUQsQUFBMkIsaUJBQWxCLGlCQUFpQixDQUFDIiwiZmlsZSI6InBhc3Nlcy9CYXNpY01hdGVyaWFsUGFzcy5qcyIsInNvdXJjZVJvb3QiOiIuLi8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmxlbmRNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9iYXNlL0JsZW5kTW9kZVwiKTtcbmltcG9ydCBNYXRyaXhcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXhcIik7XG5pbXBvcnQgTWF0cml4M0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFwiKTtcbmltcG9ydCBNYXRyaXgzRFV0aWxzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9NYXRyaXgzRFV0aWxzXCIpO1xuaW1wb3J0IFRleHR1cmUyREJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9UZXh0dXJlMkRCYXNlXCIpO1xuXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5pbXBvcnQgSVJlbmRlck9iamVjdE93bmVyXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVJlbmRlck9iamVjdE93bmVyXCIpO1xuXG5pbXBvcnQgQ29udGV4dEdMQ29tcGFyZU1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xDb21wYXJlTW9kZVwiKTtcbmltcG9ydCBDb250ZXh0R0xQcm9ncmFtVHlwZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFByb2dyYW1UeXBlXCIpO1xuaW1wb3J0IENvbnRleHRHTE1pcEZpbHRlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTE1pcEZpbHRlclwiKTtcbmltcG9ydCBDb250ZXh0R0xUZXh0dXJlRmlsdGVyXHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0NvbnRleHRHTFRleHR1cmVGaWx0ZXJcIik7XG5pbXBvcnQgQ29udGV4dEdMV3JhcE1vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xXcmFwTW9kZVwiKTtcbmltcG9ydCBJQ29udGV4dEdMXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL0lDb250ZXh0R0xcIik7XG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlQmFzZVwiKTtcbmltcG9ydCBSZW5kZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vUmVuZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBSZW5kZXJPYmplY3RQb29sXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vUmVuZGVyT2JqZWN0UG9vbFwiKTtcbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJEYXRhXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckVsZW1lbnRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBTaGFkZXJDb21waWxlckhlbHBlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi91dGlscy9TaGFkZXJDb21waWxlckhlbHBlclwiKTtcbmltcG9ydCBJUmVuZGVyYWJsZUNsYXNzXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9JUmVuZGVyYWJsZUNsYXNzXCIpO1xuaW1wb3J0IFJlbmRlclBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcGFzc2VzL1JlbmRlclBhc3NCYXNlXCIpO1xuXG5cbi8qKlxuICogQmFzaWNNYXRlcmlhbFBhc3MgZm9ybXMgYW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgdGhlIGRlZmF1bHQgc2hhZGVkIG1hdGVyaWFscyBwcm92aWRlZCBieSBTdGFnZSxcbiAqIHVzaW5nIG1hdGVyaWFsIG1ldGhvZHMgdG8gZGVmaW5lIHRoZWlyIGFwcGVhcmFuY2UuXG4gKi9cbmNsYXNzIEJhc2ljTWF0ZXJpYWxQYXNzIGV4dGVuZHMgUmVuZGVyUGFzc0Jhc2Vcbntcblx0cHJpdmF0ZSBfZGlmZnVzZVI6bnVtYmVyID0gMTtcblx0cHJpdmF0ZSBfZGlmZnVzZUc6bnVtYmVyID0gMTtcblx0cHJpdmF0ZSBfZGlmZnVzZUI6bnVtYmVyID0gMTtcblx0cHJpdmF0ZSBfZGlmZnVzZUE6bnVtYmVyID0gMTtcblxuXHRwcml2YXRlIF9mcmFnbWVudENvbnN0YW50c0luZGV4Om51bWJlcjtcblx0cHJpdmF0ZSBfdGV4dHVyZXNJbmRleDpudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocmVuZGVyT2JqZWN0OlJlbmRlck9iamVjdEJhc2UsIHJlbmRlck9iamVjdE93bmVyOklSZW5kZXJPYmplY3RPd25lciwgcmVuZGVyYWJsZUNsYXNzOklSZW5kZXJhYmxlQ2xhc3MsIHN0YWdlOlN0YWdlKVxuXHR7XG5cdFx0c3VwZXIocmVuZGVyT2JqZWN0LCByZW5kZXJPYmplY3RPd25lciwgcmVuZGVyYWJsZUNsYXNzLCBzdGFnZSk7XG5cblx0XHR0aGlzLl9zaGFkZXIgPSBuZXcgU2hhZGVyT2JqZWN0QmFzZShyZW5kZXJhYmxlQ2xhc3MsIHRoaXMsIHRoaXMuX3N0YWdlKTtcblx0fVxuXG5cdHB1YmxpYyBfaUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UpXG5cdHtcblx0XHRzdXBlci5faUluY2x1ZGVEZXBlbmRlbmNpZXMoc2hhZGVyT2JqZWN0KTtcblxuXHRcdGlmIChzaGFkZXJPYmplY3QudGV4dHVyZSAhPSBudWxsKVxuXHRcdFx0c2hhZGVyT2JqZWN0LnV2RGVwZW5kZW5jaWVzKys7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBfaUdldEZyYWdtZW50Q29kZShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSwgcmVnQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHR2YXIgY29kZTpzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50ID0gc2hhcmVkUmVnLnNoYWRlZFRhcmdldDtcblx0XHR2YXIgZGlmZnVzZUlucHV0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudDtcblxuXHRcdGlmIChzaGFkZXJPYmplY3QudGV4dHVyZSAhPSBudWxsKSB7XG5cdFx0XHRkaWZmdXNlSW5wdXRSZWcgPSByZWdDYWNoZS5nZXRGcmVlVGV4dHVyZVJlZygpO1xuXG5cdFx0XHR0aGlzLl90ZXh0dXJlc0luZGV4ID0gZGlmZnVzZUlucHV0UmVnLmluZGV4O1xuXG5cdFx0XHRjb2RlICs9IFNoYWRlckNvbXBpbGVySGVscGVyLmdldFRleDJEU2FtcGxlQ29kZSh0YXJnZXRSZWcsIHNoYXJlZFJlZywgZGlmZnVzZUlucHV0UmVnLCBzaGFkZXJPYmplY3QudGV4dHVyZSwgc2hhZGVyT2JqZWN0LnVzZVNtb290aFRleHR1cmVzLCBzaGFkZXJPYmplY3QucmVwZWF0VGV4dHVyZXMsIHNoYWRlck9iamVjdC51c2VNaXBtYXBwaW5nKTtcblxuXHRcdFx0aWYgKHNoYWRlck9iamVjdC5hbHBoYVRocmVzaG9sZCA+IDApIHtcblx0XHRcdFx0dmFyIGN1dE9mZlJlZzpTaGFkZXJSZWdpc3RlckVsZW1lbnQgPSByZWdDYWNoZS5nZXRGcmVlRnJhZ21lbnRDb25zdGFudCgpO1xuXHRcdFx0XHR0aGlzLl9mcmFnbWVudENvbnN0YW50c0luZGV4ID0gY3V0T2ZmUmVnLmluZGV4KjQ7XG5cblx0XHRcdFx0Y29kZSArPSBcInN1YiBcIiArIHRhcmdldFJlZyArIFwiLncsIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyBjdXRPZmZSZWcgKyBcIi54XFxuXCIgKyBcImtpbCBcIiArIHRhcmdldFJlZyArIFwiLndcXG5cIiArIFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIudywgXCIgKyB0YXJnZXRSZWcgKyBcIi53LCBcIiArIGN1dE9mZlJlZyArIFwiLnhcXG5cIjtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHNoYWRlck9iamVjdC5jb2xvckJ1ZmZlckluZGV4ICE9IC0xKSB7XG5cblx0XHRcdGNvZGUgKz0gXCJtb3YgXCIgKyB0YXJnZXRSZWcgKyBcIiwgXCIgKyBzaGFyZWRSZWcuY29sb3JWYXJ5aW5nICsgXCJcXG5cIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGlmZnVzZUlucHV0UmVnID0gcmVnQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblxuXHRcdFx0dGhpcy5fZnJhZ21lbnRDb25zdGFudHNJbmRleCA9IGRpZmZ1c2VJbnB1dFJlZy5pbmRleCo0O1xuXG5cdFx0XHRjb2RlICs9IFwibW92IFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgZGlmZnVzZUlucHV0UmVnICsgXCJcXG5cIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29kZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pQWN0aXZhdGUoY2FtZXJhOkNhbWVyYSlcblx0e1xuXHRcdHN1cGVyLl9pQWN0aXZhdGUoY2FtZXJhKTtcblxuXHRcdGlmICh0aGlzLl9zaGFkZXIudGV4dHVyZSAhPSBudWxsKSB7XG5cdFx0XHR0aGlzLl9zdGFnZS5hY3RpdmF0ZVRleHR1cmUodGhpcy5fdGV4dHVyZXNJbmRleCwgdGhpcy5fc2hhZGVyLnRleHR1cmUsIHRoaXMuX3NoYWRlci5yZXBlYXRUZXh0dXJlcywgdGhpcy5fc2hhZGVyLnVzZVNtb290aFRleHR1cmVzLCB0aGlzLl9zaGFkZXIudXNlTWlwbWFwcGluZyk7XG5cblx0XHRcdGlmICh0aGlzLl9zaGFkZXIuYWxwaGFUaHJlc2hvbGQgPiAwKVxuXHRcdFx0XHR0aGlzLl9zaGFkZXIuZnJhZ21lbnRDb25zdGFudERhdGFbdGhpcy5fZnJhZ21lbnRDb25zdGFudHNJbmRleF0gPSB0aGlzLl9zaGFkZXIuYWxwaGFUaHJlc2hvbGQ7XG5cdFx0fSBlbHNlIGlmICh0aGlzLl9zaGFkZXIuY29sb3JCdWZmZXJJbmRleCA9PSAtMSkge1xuXHRcdFx0dmFyIGluZGV4Om51bWJlciA9IHRoaXMuX2ZyYWdtZW50Q29uc3RhbnRzSW5kZXg7XG5cdFx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gdGhpcy5fc2hhZGVyLmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXHRcdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9kaWZmdXNlUjtcblx0XHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX2RpZmZ1c2VHO1xuXHRcdFx0ZGF0YVtpbmRleCArIDJdID0gdGhpcy5fZGlmZnVzZUI7XG5cdFx0XHRkYXRhW2luZGV4ICsgM10gPSB0aGlzLl9kaWZmdXNlQTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0ID0gQmFzaWNNYXRlcmlhbFBhc3M7Il19