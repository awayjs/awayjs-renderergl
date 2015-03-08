var BlendMode = require("awayjs-core/lib/data/BlendMode");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Event = require("awayjs-core/lib/events/Event");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var TorusVortex = (function () {
    function TorusVortex() {
        Debug.THROW_ERRORS = false;
        this._view = new View(new DefaultRenderer());
        this._view.backgroundColor = 0x000000;
        this._view.camera.x = 130;
        this._view.camera.y = 0;
        this._view.camera.z = 0;
        this._cameraAxis = new Vector3D(0, 0, 1);
        this._view.camera.projection = new PerspectiveProjection(120);
        this._view.camera.projection.near = 0.1;
        this._cube = new PrimitiveCubePrefab(20.0, 20.0, 20.0);
        this._torus = new PrimitiveTorusPrefab(150, 80, 32, 16, true);
        this.loadResources();
    }
    TorusVortex.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest("assets/130909wall_big.png");
        var urlLoader = new URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(Event.COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusVortex.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var imageLoader = event.target;
        this._image = ParserUtils.blobToImage(imageLoader.data);
        this._image.onload = function (event) { return _this.onLoadComplete(event); };
    };
    TorusVortex.prototype.onLoadComplete = function (event) {
        var _this = this;
        var matTx = new BasicMaterial(new ImageTexture(this._image), true, true, false);
        matTx.blendMode = BlendMode.ADD;
        matTx.bothSides = true;
        this._torus.material = matTx;
        this._cube.material = matTx;
        this._mesh = this._torus.getNewObject();
        this._mesh2 = this._cube.getNewObject();
        this._mesh2.x = 130;
        this._mesh2.z = 40;
        this._view.scene.addChild(this._mesh);
        this._view.scene.addChild(this._mesh2);
        this._raf = new RequestAnimationFrame(this.render, this);
        this._raf.start();
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
    };
    TorusVortex.prototype.render = function (dt) {
        if (dt === void 0) { dt = null; }
        this._view.camera.rotate(this._cameraAxis, 1);
        this._mesh.rotationY += 1;
        this._mesh2.rotationX += 0.4;
        this._mesh2.rotationY += 0.4;
        this._view.render();
    };
    TorusVortex.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    return TorusVortex;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL1RvcnVzVm9ydGV4LnRzIl0sIm5hbWVzIjpbIlRvcnVzVm9ydGV4IiwiVG9ydXNWb3J0ZXguY29uc3RydWN0b3IiLCJUb3J1c1ZvcnRleC5sb2FkUmVzb3VyY2VzIiwiVG9ydXNWb3J0ZXguaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c1ZvcnRleC5vbkxvYWRDb21wbGV0ZSIsIlRvcnVzVm9ydGV4LnJlbmRlciIsIlRvcnVzVm9ydGV4Lm9uUmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFNBQVMsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2pFLElBQU8sUUFBUSxXQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sU0FBUyxXQUFlLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxtQkFBbUIsV0FBYSx5Q0FBeUMsQ0FBQyxDQUFDO0FBQ2xGLElBQU8sVUFBVSxXQUFlLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsSUFBTyxLQUFLLFdBQWdCLDhCQUE4QixDQUFDLENBQUM7QUFDNUQsSUFBTyxXQUFXLFdBQWUscUNBQXFDLENBQUMsQ0FBQztBQUN4RSxJQUFPLHFCQUFxQixXQUFZLG1EQUFtRCxDQUFDLENBQUM7QUFDN0YsSUFBTyxZQUFZLFdBQWUsdUNBQXVDLENBQUMsQ0FBQztBQUMzRSxJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFDdkYsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFFM0QsSUFBTyxJQUFJLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFbEUsSUFBTyxhQUFhLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUNoRixJQUFPLG1CQUFtQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFDekYsSUFBTyxvQkFBb0IsV0FBYSxpREFBaUQsQ0FBQyxDQUFDO0FBRTNGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFFN0UsSUFBTSxXQUFXO0lBYWhCQSxTQWJLQSxX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LENBQUNBLENBQUNBO1FBRTlGQSxLQUFLQSxDQUFDQSxTQUFTQSxHQUFHQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNoQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFdkJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLEtBQUtBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUU1QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBVUEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDL0NBLElBQUlBLENBQUNBLE1BQU1BLEdBQVVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBQy9DQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUNwQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFbkJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3RDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtRQUV2Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEscUJBQXFCQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN6REEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFFbEJBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLFVBQUNBLEtBQWFBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEVBQXBCQSxDQUFvQkEsQ0FBQ0E7UUFFMURBLElBQUlBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO0lBQ2pCQSxDQUFDQTtJQUVNSiw0QkFBTUEsR0FBYkEsVUFBY0EsRUFBZ0JBO1FBQWhCSyxrQkFBZ0JBLEdBQWhCQSxTQUFnQkE7UUFHN0JBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBQzlDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsSUFBSUEsR0FBR0EsQ0FBQ0E7UUFDN0JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLElBQUlBLEdBQUdBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtJQUNyQkEsQ0FBQ0E7SUFFTUwsOEJBQVFBLEdBQWZBLFVBQWdCQSxLQUFvQkE7UUFBcEJNLHFCQUFvQkEsR0FBcEJBLFlBQW9CQTtRQUVuQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDakJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBRWpCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDeENBLENBQUNBO0lBQ0ZOLGtCQUFDQTtBQUFEQSxDQTlGQSxBQThGQ0EsSUFBQSIsImZpbGUiOiJvYmplY3QzZC9Ub3J1c1ZvcnRleC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsZW5kTW9kZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZGF0YS9CbGVuZE1vZGVcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBFdmVudFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvRXZlbnRcIik7XG5pbXBvcnQgUGFyc2VyVXRpbHNcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyVXRpbHNcIik7XG5pbXBvcnQgUGVyc3BlY3RpdmVQcm9qZWN0aW9uXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9QZXJzcGVjdGl2ZVByb2plY3Rpb25cIik7XG5pbXBvcnQgSW1hZ2VUZXh0dXJlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9WaWV3XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWxcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvQmFzaWNNYXRlcmlhbFwiKTtcbmltcG9ydCBQcmltaXRpdmVDdWJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCIpO1xuXG5jbGFzcyBUb3J1c1ZvcnRleFxue1xuXHRwcml2YXRlIF92aWV3OlZpZXc7XG5cblx0cHJpdmF0ZSBfY3ViZTpQcmltaXRpdmVDdWJlUHJlZmFiO1xuXHRwcml2YXRlIF90b3J1czpQcmltaXRpdmVUb3J1c1ByZWZhYjtcblx0cHJpdmF0ZSBfbWVzaDpNZXNoO1xuXHRwcml2YXRlIF9tZXNoMjpNZXNoO1xuXG5cdHByaXZhdGUgX3JhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgX2ltYWdlOkhUTUxJbWFnZUVsZW1lbnQ7XG5cdHByaXZhdGUgX2NhbWVyYUF4aXM6VmVjdG9yM0Q7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblxuXHRcdHRoaXMuX3ZpZXcuYmFja2dyb3VuZENvbG9yID0gMHgwMDAwMDA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueCA9IDEzMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS55ID0gMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS56ID0gMDtcblx0XHR0aGlzLl9jYW1lcmFBeGlzID0gbmV3IFZlY3RvcjNEKDAsIDAsIDEpO1xuXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbiA9IG5ldyBQZXJzcGVjdGl2ZVByb2plY3Rpb24oMTIwKTtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uLm5lYXIgPSAwLjE7XG5cblx0XHR0aGlzLl9jdWJlID0gbmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIoMjAuMCwgMjAuMCwgMjAuMCk7XG5cdFx0dGhpcy5fdG9ydXMgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIoMTUwLCA4MCwgMzIsIDE2LCB0cnVlKTtcblxuXHRcdHRoaXMubG9hZFJlc291cmNlcygpO1xuXHR9XG5cblx0cHJpdmF0ZSBsb2FkUmVzb3VyY2VzKClcblx0e1xuXHRcdHZhciB1cmxSZXF1ZXN0OlVSTFJlcXVlc3QgPSBuZXcgVVJMUmVxdWVzdCggXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCIgKTtcblx0XHR2YXIgdXJsTG9hZGVyOlVSTExvYWRlciA9IG5ldyBVUkxMb2FkZXIoKTtcblx0XHR1cmxMb2FkZXIuZGF0YUZvcm1hdCA9IFVSTExvYWRlckRhdGFGb3JtYXQuQkxPQjtcblx0XHR1cmxMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihFdmVudC5DT01QTEVURSwgKGV2ZW50OkV2ZW50KSA9PiB0aGlzLmltYWdlQ29tcGxldGVIYW5kbGVyKGV2ZW50KSk7XG5cdFx0dXJsTG9hZGVyLmxvYWQodXJsUmVxdWVzdCk7XG5cdH1cblxuXHRwcml2YXRlIGltYWdlQ29tcGxldGVIYW5kbGVyKGV2ZW50OkV2ZW50KVxuXHR7XG5cdFx0dmFyIGltYWdlTG9hZGVyOlVSTExvYWRlciA9IDxVUkxMb2FkZXI+IGV2ZW50LnRhcmdldDtcblx0XHR0aGlzLl9pbWFnZSA9IFBhcnNlclV0aWxzLmJsb2JUb0ltYWdlKGltYWdlTG9hZGVyLmRhdGEpO1xuXHRcdHRoaXMuX2ltYWdlLm9ubG9hZCA9IChldmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCk7XG5cdH1cblxuXHRwcml2YXRlIG9uTG9hZENvbXBsZXRlKGV2ZW50KVxuXHR7XG5cdFx0dmFyIG1hdFR4OkJhc2ljTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbChuZXcgSW1hZ2VUZXh0dXJlKHRoaXMuX2ltYWdlKSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuXG5cdFx0bWF0VHguYmxlbmRNb2RlID0gQmxlbmRNb2RlLkFERDtcblx0XHRtYXRUeC5ib3RoU2lkZXMgPSB0cnVlO1xuXG5cdFx0dGhpcy5fdG9ydXMubWF0ZXJpYWwgPSBtYXRUeDtcblx0XHR0aGlzLl9jdWJlLm1hdGVyaWFsID0gbWF0VHg7XG5cblx0XHR0aGlzLl9tZXNoID0gPE1lc2g+IHRoaXMuX3RvcnVzLmdldE5ld09iamVjdCgpO1xuXHRcdHRoaXMuX21lc2gyID0gPE1lc2g+IHRoaXMuX2N1YmUuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0dGhpcy5fbWVzaDIueCA9IDEzMDtcblx0XHR0aGlzLl9tZXNoMi56ID0gNDA7XG5cblx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuX21lc2gpO1xuXHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5fbWVzaDIpO1xuXG5cdFx0dGhpcy5fcmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlciwgdGhpcyk7XG5cdFx0dGhpcy5fcmFmLnN0YXJ0KCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLm9uUmVzaXplKCk7XG5cdH1cblxuXHRwdWJsaWMgcmVuZGVyKGR0Om51bWJlciA9IG51bGwpOnZvaWRcblx0e1xuXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucm90YXRlKHRoaXMuX2NhbWVyYUF4aXMsIDEpO1xuXHRcdHRoaXMuX21lc2gucm90YXRpb25ZICs9IDE7XG5cdFx0dGhpcy5fbWVzaDIucm90YXRpb25YICs9IDAuNDtcblx0XHR0aGlzLl9tZXNoMi5yb3RhdGlvblkgKz0gMC40O1xuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLl92aWV3LnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcueCA9IDA7XG5cblx0XHR0aGlzLl92aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy5fdmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cbn0iXX0=