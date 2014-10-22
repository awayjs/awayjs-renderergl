var View = require("awayjs-core/lib/containers/View");
var HoverController = require("awayjs-core/lib/controllers/HoverController");
var Vector3D = require("awayjs-core/lib/core/geom/Vector3D");
var AssetLibrary = require("awayjs-core/lib/core/library/AssetLibrary");
var AssetType = require("awayjs-core/lib/core/library/AssetType");
var URLRequest = require("awayjs-core/lib/core/net/URLRequest");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var Debug = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var DefaultRenderer = require("awayjs-stagegl/lib/core/render/DefaultRenderer");
var AWDParser = require("awayjs-renderergl/lib/parsers/AWDParser");
var LightsShadowTest = (function () {
    function LightsShadowTest() {
        var _this = this;
        this.lookAtPosition = new Vector3D();
        this._move = false;
        Debug.LOG_PI_ERRORS = true;
        Debug.THROW_ERRORS = false;
        AssetLibrary.enableParser(AWDParser);
        this._token = AssetLibrary.load(new URLRequest('assets/ShadowTest.awd'));
        this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this._view = new View(new DefaultRenderer());
        this._view.camera.projection.far = 5000;
        this._view.camera.y = 100;
        this._timer = new RequestAnimationFrame(this.render, this);
        this._cameraController = new HoverController(this._view.camera, null, 45, 20, 2000, 5);
        document.onmousedown = function (event) { return _this.onMouseDown(event); };
        document.onmouseup = function (event) { return _this.onMouseUp(event); };
        document.onmousemove = function (event) { return _this.onMouseMove(event); };
        document.onmousewheel = function (event) { return _this.onMouseWheel(event); };
        window.onresize = function (event) { return _this.resize(event); };
    }
    LightsShadowTest.prototype.resize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    LightsShadowTest.prototype.render = function (dt) {
        if (this._view.camera)
            this._view.camera.lookAt(this.lookAtPosition);
        if (this._awdMesh)
            this._awdMesh.rotationY += 0.2;
        this._view.render();
    };
    LightsShadowTest.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
    };
    LightsShadowTest.prototype.onResourceComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
        var loader = event.target;
        var numAssets = loader.baseDependency.assets.length;
        for (var i = 0; i < numAssets; ++i) {
            var asset = loader.baseDependency.assets[i];
            switch (asset.assetType) {
                case AssetType.MESH:
                    this._awdMesh = asset;
                    this._view.scene.addChild(this._awdMesh);
                    this.resize();
                    break;
                case AssetType.LIGHT:
                    this._view.scene.addChild(asset);
                    break;
                case AssetType.MATERIAL:
                    break;
            }
        }
        this._timer.start();
    };
    /**
     * Mouse down listener for navigation
     */
    LightsShadowTest.prototype.onMouseDown = function (event) {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    /**
     * Mouse up listener for navigation
     */
    LightsShadowTest.prototype.onMouseUp = function (event) {
        this._move = false;
    };
    LightsShadowTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    /**
     * Mouse wheel listener for navigation
     */
    LightsShadowTest.prototype.onMouseWheel = function (event) {
        this._cameraController.distance -= event.wheelDelta * 2;
        if (this._cameraController.distance < 100)
            this._cameraController.distance = 100;
        else if (this._cameraController.distance > 2000)
            this._cameraController.distance = 2000;
    };
    return LightsShadowTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpZ2h0cy9saWdodHNzaGFkb3d0ZXN0LnRzIl0sIm5hbWVzIjpbIkxpZ2h0c1NoYWRvd1Rlc3QiLCJMaWdodHNTaGFkb3dUZXN0LmNvbnN0cnVjdG9yIiwiTGlnaHRzU2hhZG93VGVzdC5yZXNpemUiLCJMaWdodHNTaGFkb3dUZXN0LnJlbmRlciIsIkxpZ2h0c1NoYWRvd1Rlc3Qub25Bc3NldENvbXBsZXRlIiwiTGlnaHRzU2hhZG93VGVzdC5vblJlc291cmNlQ29tcGxldGUiLCJMaWdodHNTaGFkb3dUZXN0Lm9uTW91c2VEb3duIiwiTGlnaHRzU2hhZG93VGVzdC5vbk1vdXNlVXAiLCJMaWdodHNTaGFkb3dUZXN0Lm9uTW91c2VNb3ZlIiwiTGlnaHRzU2hhZG93VGVzdC5vbk1vdXNlV2hlZWwiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sSUFBSSxXQUFpQixpQ0FBaUMsQ0FBQyxDQUFDO0FBQy9ELElBQU8sZUFBZSxXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFFbkYsSUFBTyxRQUFRLFdBQWdCLG9DQUFvQyxDQUFDLENBQUM7QUFDckUsSUFBTyxZQUFZLFdBQWUsMkNBQTJDLENBQUMsQ0FBQztBQUcvRSxJQUFPLFNBQVMsV0FBZSx3Q0FBd0MsQ0FBQyxDQUFDO0FBRXpFLElBQU8sVUFBVSxXQUFlLHFDQUFxQyxDQUFDLENBQUM7QUFFdkUsSUFBTyxVQUFVLFdBQWUsbUNBQW1DLENBQUMsQ0FBQztBQUNyRSxJQUFPLFdBQVcsV0FBZSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBQzNELElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUV2RixJQUFPLGVBQWUsV0FBYyxnREFBZ0QsQ0FBQyxDQUFDO0FBRXRGLElBQU8sU0FBUyxXQUFlLHlDQUF5QyxDQUFDLENBQUM7QUFFMUUsSUFBTSxnQkFBZ0I7SUFlckJBLFNBZktBLGdCQUFnQkE7UUFBdEJDLGlCQThJQ0E7UUF4SVFBLG1CQUFj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O0lBQ0tBLHVDQUFZQSxHQUFwQkEsVUFBcUJBLEtBQXFCQTtRQUV6Q1MsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxJQUFJQSxLQUFLQSxDQUFDQSxVQUFVQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUV4REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUN6Q0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUMvQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN6Q0EsQ0FBQ0E7SUFDRlQsdUJBQUNBO0FBQURBLENBOUlBLEFBOElDQSxJQUFBIiwiZmlsZSI6ImxpZ2h0cy9MaWdodHNTaGFkb3dUZXN0LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yb2JiYXRlbWFuL1dlYnN0b3JtUHJvamVjdHMvYXdheWpzLXJlbmRlcmVyZ2wvIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgSG92ZXJDb250cm9sbGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29udHJvbGxlcnMvSG92ZXJDb250cm9sbGVyXCIpO1xuaW1wb3J0IExpZ2h0QmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9iYXNlL0xpZ2h0QmFzZVwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRMaWJyYXJ5XCIpO1xuaW1wb3J0IEFzc2V0TG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL2xpYnJhcnkvQXNzZXRMb2FkZXJcIik7XG5pbXBvcnQgQXNzZXRMb2FkZXJUb2tlblx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2NvcmUvbGlicmFyeS9Bc3NldExvYWRlclRva2VuXCIpO1xuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9saWJyYXJ5L0Fzc2V0VHlwZVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvY29yZS9saWJyYXJ5L0lBc3NldFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9jb3JlL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IEFzc2V0RXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9Bc3NldEV2ZW50XCIpO1xuaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9jb3JlL3JlbmRlci9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmltcG9ydCBBV0RQYXJzZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvQVdEUGFyc2VyXCIpO1xuXG5jbGFzcyBMaWdodHNTaGFkb3dUZXN0XG57XG5cblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF90b2tlbjpBc3NldExvYWRlclRva2VuO1xuXHRwcml2YXRlIF90aW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgbG9va0F0UG9zaXRpb246VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QoKTtcblx0cHJpdmF0ZSBfYXdkTWVzaDpNZXNoO1xuXHRwcml2YXRlIF9jYW1lcmFDb250cm9sbGVyOkhvdmVyQ29udHJvbGxlcjtcblx0cHJpdmF0ZSBfbW92ZTpib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX2xhc3RQYW5BbmdsZTpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RUaWx0QW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0TW91c2VYOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWTpudW1iZXI7XG5cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0RGVidWcuTE9HX1BJX0VSUk9SUyA9IHRydWU7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cblx0XHRBc3NldExpYnJhcnkuZW5hYmxlUGFyc2VyKEFXRFBhcnNlcik7XG5cblx0XHR0aGlzLl90b2tlbiA9IEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvU2hhZG93VGVzdC5hd2QnKSk7XG5cblx0XHR0aGlzLl90b2tlbi5hZGRFdmVudExpc3RlbmVyKExvYWRlckV2ZW50LlJFU09VUkNFX0NPTVBMRVRFLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50KSk7XG5cdFx0dGhpcy5fdG9rZW4uYWRkRXZlbnRMaXN0ZW5lcihBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFLCAoZXZlbnQ6QXNzZXRFdmVudCkgPT4gdGhpcy5vbkFzc2V0Q29tcGxldGUoZXZlbnQpKTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24uZmFyID0gNTAwMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS55ID0gMTAwO1xuXG5cdFx0dGhpcy5fdGltZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblxuXHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIgPSBuZXcgSG92ZXJDb250cm9sbGVyKHRoaXMuX3ZpZXcuY2FtZXJhLCBudWxsLCA0NSwgMjAsIDIwMDAsIDUpO1xuXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bihldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZXVwID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZVVwKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNlbW92ZSA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50KTtcblx0XHRkb2N1bWVudC5vbm1vdXNld2hlZWwgPSAoZXZlbnQ6TW91c2VXaGVlbEV2ZW50KSA9PiB0aGlzLm9uTW91c2VXaGVlbChldmVudCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5yZXNpemUoZXZlbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSByZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLl92aWV3LnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcueCA9IDA7XG5cdFx0dGhpcy5fdmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMuX3ZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoZHQ6bnVtYmVyKSAvL2FuaW1hdGUgYmFzZWQgb24gZHQgZm9yIGZpcmVmb3hcblx0e1xuXHRcdGlmICh0aGlzLl92aWV3LmNhbWVyYSlcblx0XHRcdHRoaXMuX3ZpZXcuY2FtZXJhLmxvb2tBdCh0aGlzLmxvb2tBdFBvc2l0aW9uKTtcblxuXHRcdGlmICh0aGlzLl9hd2RNZXNoKVxuXHRcdFx0dGhpcy5fYXdkTWVzaC5yb3RhdGlvblkgKz0gMC4yO1xuXG5cdFx0IHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25Bc3NldENvbXBsZXRlKGV2ZW50OkFzc2V0RXZlbnQpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coJ0Fzc2V0RXZlbnQuQVNTRVRfQ09NUExFVEUnICwgQXNzZXRMaWJyYXJ5LmdldEFzc2V0KGV2ZW50LmFzc2V0Lm5hbWUpKTtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coJ0xvYWRlckV2ZW50LlJFU09VUkNFX0NPTVBMRVRFJyAsIGV2ZW50KTtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cblx0XHR2YXIgbG9hZGVyOkFzc2V0TG9hZGVyID0gPEFzc2V0TG9hZGVyPiBldmVudC50YXJnZXQ7XG5cdFx0dmFyIG51bUFzc2V0czpudW1iZXIgPSBsb2FkZXIuYmFzZURlcGVuZGVuY3kuYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bUFzc2V0czsgKytpKSB7XG5cdFx0XHR2YXIgYXNzZXQ6SUFzc2V0ID0gbG9hZGVyLmJhc2VEZXBlbmRlbmN5LmFzc2V0c1sgaSBdO1xuXG5cdFx0XHRzd2l0Y2ggKGFzc2V0LmFzc2V0VHlwZSkge1xuXHRcdFx0XHRjYXNlIEFzc2V0VHlwZS5NRVNIOlxuXHRcdFx0XHRcdHRoaXMuX2F3ZE1lc2ggPSA8TWVzaD4gYXNzZXQ7XG5cdFx0XHRcdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9hd2RNZXNoKTtcblx0XHRcdFx0XHR0aGlzLnJlc2l6ZSgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXNzZXRUeXBlLkxJR0hUOlxuXHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQoPExpZ2h0QmFzZT4gYXNzZXQpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRcdGNhc2UgQXNzZXRUeXBlLk1BVEVSSUFMOlxuXHRcdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSBkb3duIGxpc3RlbmVyIGZvciBuYXZpZ2F0aW9uXG5cdCAqL1xuXHRwcml2YXRlIG9uTW91c2VEb3duKGV2ZW50KTp2b2lkXG5cdHtcblx0XHR0aGlzLl9sYXN0UGFuQW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlO1xuXHRcdHRoaXMuX2xhc3RUaWx0QW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSB1cCBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQpOnZvaWRcblx0e1xuXHRcdHRoaXMuX21vdmUgPSBmYWxzZTtcblx0fVxuXG5cdHByaXZhdGUgb25Nb3VzZU1vdmUoZXZlbnQpXG5cdHtcblx0XHRpZiAodGhpcy5fbW92ZSkge1xuXHRcdFx0dGhpcy5fY2FtZXJhQ29udHJvbGxlci5wYW5BbmdsZSA9IDAuMyooZXZlbnQuY2xpZW50WCAtIHRoaXMuX2xhc3RNb3VzZVgpICsgdGhpcy5fbGFzdFBhbkFuZ2xlO1xuXHRcdFx0dGhpcy5fY2FtZXJhQ29udHJvbGxlci50aWx0QW5nbGUgPSAwLjMqKGV2ZW50LmNsaWVudFkgLSB0aGlzLl9sYXN0TW91c2VZKSArIHRoaXMuX2xhc3RUaWx0QW5nbGU7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE1vdXNlIHdoZWVsIGxpc3RlbmVyIGZvciBuYXZpZ2F0aW9uXG5cdCAqL1xuXHRwcml2YXRlIG9uTW91c2VXaGVlbChldmVudDpNb3VzZVdoZWVsRXZlbnQpOnZvaWRcblx0e1xuXHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIuZGlzdGFuY2UgLT0gZXZlbnQud2hlZWxEZWx0YSAqIDI7XG5cblx0XHRpZiAodGhpcy5fY2FtZXJhQ29udHJvbGxlci5kaXN0YW5jZSA8IDEwMClcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIuZGlzdGFuY2UgPSAxMDA7XG5cdFx0ZWxzZSBpZiAodGhpcy5fY2FtZXJhQ29udHJvbGxlci5kaXN0YW5jZSA+IDIwMDApXG5cdFx0XHR0aGlzLl9jYW1lcmFDb250cm9sbGVyLmRpc3RhbmNlID0gMjAwMDtcblx0fVxufSJdfQ==