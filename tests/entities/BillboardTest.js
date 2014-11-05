var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View = require("awayjs-display/lib/containers/View");
var HoverController = require("awayjs-display/lib/controllers/HoverController");
var AlignmentMode = require("awayjs-display/lib/base/AlignmentMode");
var OrientationMode = require("awayjs-display/lib/base/OrientationMode");
var Billboard = require("awayjs-display/lib/entities/Billboard");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var TriangleBasicMaterial = require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");
var BillboardTest = (function () {
    /**
     * Constructor
     */
    function BillboardTest() {
        this._time = 0;
        this._move = false;
        this.init();
    }
    /**
     * Global initialise function
     */
    BillboardTest.prototype.init = function () {
        this.initEngine();
        this.initListeners();
        this.loadTexture();
    };
    /**
     * Initialise the engine
     */
    BillboardTest.prototype.initEngine = function () {
        this._view = new View(new DefaultRenderer());
        //setup the camera for optimal shadow rendering
        this._view.camera.projection.far = 2100;
        //setup controller to be used on the camera
        this._cameraController = new HoverController(this._view.camera, null, 45, 20, 1000, 10);
    };
    /**
     * Initialise the listeners
     */
    BillboardTest.prototype.initListeners = function () {
        var _this = this;
        document.onmousedown = function (event) { return _this.onMouseDown(event); };
        document.onmouseup = function (event) { return _this.onMouseUp(event); };
        document.onmousemove = function (event) { return _this.onMouseMove(event); };
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
        this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
        this._timer.start();
    };
    /**
     * start loading our texture
     */
    BillboardTest.prototype.loadTexture = function () {
        var _this = this;
        AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        AssetLibrary.load(new URLRequest("assets/130909wall_big.png"));
    };
    /**
     * Navigation and render loop
     */
    BillboardTest.prototype.onEnterFrame = function (dt) {
        this._time += dt;
        this._view.render();
    };
    /**
     * Listener function for resource complete event on asset library
     */
    BillboardTest.prototype.onResourceComplete = function (event) {
        var assets = event.assets;
        var length = assets.length;
        for (var c = 0; c < length; c++) {
            var asset = assets[c];
            switch (event.url) {
                case "assets/130909wall_big.png":
                    var material = new TriangleBasicMaterial();
                    material.texture = AssetLibrary.getAsset(asset.name);
                    var s;
                    s = new Billboard(material);
                    s.pivot = new Vector3D(150, 150, 0);
                    s.width = 300;
                    s.height = 300;
                    //s.rotationX = 45;
                    s.orientationMode = OrientationMode.CAMERA_PLANE;
                    s.alignmentMode = AlignmentMode.PIVOT_POINT;
                    this._view.scene.addChild(s);
                    for (var c = 0; c < 100; c++) {
                        var size = this.getRandom(5, 50);
                        s = new Billboard(material);
                        s.pivot = new Vector3D(size / 2, size / 2, 0);
                        s.width = size;
                        s.height = size;
                        s.orientationMode = OrientationMode.CAMERA_PLANE;
                        s.alignmentMode = AlignmentMode.PIVOT_POINT;
                        s.x = this.getRandom(-400, 400);
                        s.y = this.getRandom(-400, 400);
                        s.z = this.getRandom(-400, 400);
                        this._view.scene.addChild(s);
                    }
                    this._timer.start();
                    break;
            }
        }
    };
    /**
     * Mouse down listener for navigation
     */
    BillboardTest.prototype.onMouseDown = function (event) {
        this._lastPanAngle = this._cameraController.panAngle;
        this._lastTiltAngle = this._cameraController.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    /**
     * Mouse up listener for navigation
     */
    BillboardTest.prototype.onMouseUp = function (event) {
        this._move = false;
    };
    /**
     *
     * @param event
     */
    BillboardTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    /**
     * stage listener for resize events
     */
    BillboardTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    /**
     * Util function - getRandom Number
     */
    BillboardTest.prototype.getRandom = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    return BillboardTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0aWVzL2JpbGxib2FyZHRlc3QudHMiXSwibmFtZXMiOlsiQmlsbGJvYXJkVGVzdCIsIkJpbGxib2FyZFRlc3QuY29uc3RydWN0b3IiLCJCaWxsYm9hcmRUZXN0LmluaXQiLCJCaWxsYm9hcmRUZXN0LmluaXRFbmdpbmUiLCJCaWxsYm9hcmRUZXN0LmluaXRMaXN0ZW5lcnMiLCJCaWxsYm9hcmRUZXN0LmxvYWRUZXh0dXJlIiwiQmlsbGJvYXJkVGVzdC5vbkVudGVyRnJhbWUiLCJCaWxsYm9hcmRUZXN0Lm9uUmVzb3VyY2VDb21wbGV0ZSIsIkJpbGxib2FyZFRlc3Qub25Nb3VzZURvd24iLCJCaWxsYm9hcmRUZXN0Lm9uTW91c2VVcCIsIkJpbGxib2FyZFRlc3Qub25Nb3VzZU1vdmUiLCJCaWxsYm9hcmRUZXN0Lm9uUmVzaXplIiwiQmlsbGJvYXJkVGVzdC5nZXRSYW5kb20iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sUUFBUSxXQUFnQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sWUFBWSxXQUFlLHNDQUFzQyxDQUFDLENBQUM7QUFHMUUsSUFBTyxVQUFVLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUNsRSxJQUFPLFdBQVcsV0FBZSxvQ0FBb0MsQ0FBQyxDQUFDO0FBRXZFLElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUV2RixJQUFPLElBQUksV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUNsRSxJQUFPLGVBQWUsV0FBYyxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3RGLElBQU8sYUFBYSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFDM0UsSUFBTyxlQUFlLFdBQWMseUNBQXlDLENBQUMsQ0FBQztBQUMvRSxJQUFPLFNBQVMsV0FBZSx1Q0FBdUMsQ0FBQyxDQUFDO0FBR3hFLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFDN0UsSUFBTyxxQkFBcUIsV0FBWSx1REFBdUQsQ0FBQyxDQUFDO0FBRWpHLElBQU0sYUFBYTtJ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QSxhQUFhQSxHQUFHQSxhQUFhQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFFNUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUU3QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsR0FBR0EsRUFBRUEsQ0FBQ0EsRUFBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3RDQSxJQUFJQSxJQUFJQSxHQUFVQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTt3QkFDekNBLENBQUNBLEdBQUdBLElBQUlBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUM1QkEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsSUFBSUEsR0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTt3QkFDZkEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0E7d0JBQ2hCQSxDQUFDQSxDQUFDQSxlQUFlQSxHQUFHQSxlQUFlQSxDQUFDQSxZQUFZQSxDQUFDQTt3QkFDakRBLENBQUNBLENBQUNBLGFBQWFBLEdBQUdBLGFBQWFBLENBQUNBLFdBQVdBLENBQUNBO3dCQUMzQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBSUEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFJQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDbENBLENBQUNBLENBQUNBLENBQUNBLEdBQUlBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUdBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNuQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzlCQSxDQUFDQTtvQkFFREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7b0JBQ3BCQSxLQUFLQSxDQUFDQTtZQUNSQSxDQUFDQTtRQUNGQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVEUDs7T0FFR0E7SUFDS0EsbUNBQVdBLEdBQW5CQSxVQUFvQkEsS0FBZ0JBO1FBRW5DUSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBO1FBQ3JEQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFNBQVNBLENBQUNBO1FBQ3ZEQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNqQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO0lBQ25CQSxDQUFDQTtJQUVEUjs7T0FFR0E7SUFDS0EsaUNBQVNBLEdBQWpCQSxVQUFrQkEsS0FBZ0JBO1FBRWpDUyxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFRFQ7OztPQUdHQTtJQUNLQSxtQ0FBV0EsR0FBbkJBLFVBQW9CQSxLQUFnQkE7UUFFbkNVLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQ2hCQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLEdBQUdBLEdBQUdBLEdBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBO1lBQzlGQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFNBQVNBLEdBQUdBLEdBQUdBLEdBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQ2pHQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVEVjs7T0FFR0E7SUFDS0EsZ0NBQVFBLEdBQWhCQSxVQUFpQkEsS0FBb0JBO1FBQXBCVyxxQkFBb0JBLEdBQXBCQSxZQUFvQkE7UUFFcENBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQUVEWDs7T0FFR0E7SUFDS0EsaUNBQVNBLEdBQWpCQSxVQUFrQkEsR0FBVUEsRUFBRUEsR0FBVUE7UUFFdkNZLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQUNGWixvQkFBQ0E7QUFBREEsQ0F0TEEsQUFzTENBLElBQUEiLCJmaWxlIjoiZW50aXRpZXMvQmlsbGJvYXJkVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIuL3Rlc3RzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9JQXNzZXRcIik7XG5pbXBvcnQgVVJMTG9hZGVyXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyXCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IExvYWRlckV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL1RleHR1cmUyREJhc2VcIik7XG5pbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9WaWV3XCIpO1xuaW1wb3J0IEhvdmVyQ29udHJvbGxlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRyb2xsZXJzL0hvdmVyQ29udHJvbGxlclwiKTtcbmltcG9ydCBBbGlnbm1lbnRNb2RlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9BbGlnbm1lbnRNb2RlXCIpO1xuaW1wb3J0IE9yaWVudGF0aW9uTW9kZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvT3JpZW50YXRpb25Nb2RlXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQmlsbGJvYXJkXCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvRGVmYXVsdFJlbmRlcmVyXCIpO1xuaW1wb3J0IFRyaWFuZ2xlQmFzaWNNYXRlcmlhbFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlQmFzaWNNYXRlcmlhbFwiKTtcblxuY2xhc3MgQmlsbGJvYXJkVGVzdFxue1xuXHQvL2VuZ2luZSB2YXJpYWJsZXNcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF9jYW1lcmFDb250cm9sbGVyOkhvdmVyQ29udHJvbGxlcjtcblxuXHQvL25hdmlnYXRpb24gdmFyaWFibGVzXG5cdHByaXZhdGUgX3RpbWVyOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfdGltZTpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9tb3ZlOmJvb2xlYW4gPSBmYWxzZTtcblx0cHJpdmF0ZSBfbGFzdFBhbkFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdFRpbHRBbmdsZTpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVg6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0TW91c2VZOm51bWJlcjtcblxuXHQvKipcblx0ICogQ29uc3RydWN0b3Jcblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdsb2JhbCBpbml0aWFsaXNlIGZ1bmN0aW9uXG5cdCAqL1xuXHRwcml2YXRlIGluaXQoKTp2b2lkXG5cdHtcblx0XHR0aGlzLmluaXRFbmdpbmUoKTtcblx0XHR0aGlzLmluaXRMaXN0ZW5lcnMoKTtcblx0XHR0aGlzLmxvYWRUZXh0dXJlKCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGlzZSB0aGUgZW5naW5lXG5cdCAqL1xuXHRwcml2YXRlIGluaXRFbmdpbmUoKTp2b2lkXG5cdHtcblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblxuXHRcdC8vc2V0dXAgdGhlIGNhbWVyYSBmb3Igb3B0aW1hbCBzaGFkb3cgcmVuZGVyaW5nXG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbi5mYXIgPSAyMTAwO1xuXG5cdFx0Ly9zZXR1cCBjb250cm9sbGVyIHRvIGJlIHVzZWQgb24gdGhlIGNhbWVyYVxuXHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIgPSBuZXcgSG92ZXJDb250cm9sbGVyKHRoaXMuX3ZpZXcuY2FtZXJhLCBudWxsLCA0NSwgMjAsIDEwMDAsIDEwKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXNlIHRoZSBsaXN0ZW5lcnNcblx0ICovXG5cdHByaXZhdGUgaW5pdExpc3RlbmVycygpOnZvaWRcblx0e1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZURvd24oZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2V1cCA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VVcChldmVudCk7XG5cdFx0ZG9jdW1lbnQub25tb3VzZW1vdmUgPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlTW92ZShldmVudCk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXG5cdFx0dGhpcy5fdGltZXIgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMub25FbnRlckZyYW1lLCB0aGlzKTtcblx0XHR0aGlzLl90aW1lci5zdGFydCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIHN0YXJ0IGxvYWRpbmcgb3VyIHRleHR1cmVcblx0ICovXG5cdHByaXZhdGUgbG9hZFRleHR1cmUoKTp2b2lkXG5cdHtcblx0XHRBc3NldExpYnJhcnkuYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uUmVzb3VyY2VDb21wbGV0ZShldmVudCkpO1xuXHRcdEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KFwiYXNzZXRzLzEzMDkwOXdhbGxfYmlnLnBuZ1wiKSk7XG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGlvbiBhbmQgcmVuZGVyIGxvb3Bcblx0ICovXG5cdHByaXZhdGUgb25FbnRlckZyYW1lKGR0Om51bWJlcik6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdGltZSArPSBkdDtcblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHQvKipcblx0ICogTGlzdGVuZXIgZnVuY3Rpb24gZm9yIHJlc291cmNlIGNvbXBsZXRlIGV2ZW50IG9uIGFzc2V0IGxpYnJhcnlcblx0ICovXG5cdHByaXZhdGUgb25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0dmFyIGFzc2V0czpBcnJheTxJQXNzZXQ+ID0gZXZlbnQuYXNzZXRzO1xuXHRcdHZhciBsZW5ndGg6bnVtYmVyID0gYXNzZXRzLmxlbmd0aDtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IGxlbmd0aDsgYyArKykge1xuXHRcdFx0dmFyIGFzc2V0OklBc3NldCA9IGFzc2V0c1tjXTtcblxuXHRcdFx0c3dpdGNoKGV2ZW50LnVybCkge1xuXG5cdFx0XHRcdGNhc2UgXCJhc3NldHMvMTMwOTA5d2FsbF9iaWcucG5nXCI6XG5cblx0XHRcdFx0XHR2YXIgbWF0ZXJpYWw6VHJpYW5nbGVCYXNpY01hdGVyaWFsID0gbmV3IFRyaWFuZ2xlQmFzaWNNYXRlcmlhbCgpO1xuXHRcdFx0XHRcdFx0bWF0ZXJpYWwudGV4dHVyZSA9IDxUZXh0dXJlMkRCYXNlPiBBc3NldExpYnJhcnkuZ2V0QXNzZXQoYXNzZXQubmFtZSk7XG5cblx0XHRcdFx0XHR2YXIgczpCaWxsYm9hcmQ7XG5cdFx0XHRcdFx0XHRzID0gbmV3IEJpbGxib2FyZChtYXRlcmlhbCk7XG5cdFx0XHRcdFx0XHRzLnBpdm90ID0gbmV3IFZlY3RvcjNEKDE1MCwgMTUwLCAwKTtcblx0XHRcdFx0XHRcdHMud2lkdGggPSAzMDA7XG5cdFx0XHRcdFx0XHRzLmhlaWdodCA9IDMwMDtcblx0XHRcdFx0XHRcdC8vcy5yb3RhdGlvblggPSA0NTtcblx0XHRcdFx0XHRzLm9yaWVudGF0aW9uTW9kZSA9IE9yaWVudGF0aW9uTW9kZS5DQU1FUkFfUExBTkU7XG5cdFx0XHRcdFx0cy5hbGlnbm1lbnRNb2RlID0gQWxpZ25tZW50TW9kZS5QSVZPVF9QT0lOVDtcblxuXHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQocyk7XG5cblx0XHRcdFx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCAxMDA7IGMgKyspIHtcblx0XHRcdFx0XHRcdHZhciBzaXplOm51bWJlciA9IHRoaXMuZ2V0UmFuZG9tKDUgLCA1MCk7XG5cdFx0XHRcdFx0XHRzID0gbmV3IEJpbGxib2FyZChtYXRlcmlhbCk7XG5cdFx0XHRcdFx0XHRzLnBpdm90ID0gbmV3IFZlY3RvcjNEKHNpemUvMiwgc2l6ZS8yLCAwKTtcblx0XHRcdFx0XHRcdHMud2lkdGggPSBzaXplO1xuXHRcdFx0XHRcdFx0cy5oZWlnaHQgPSBzaXplO1xuXHRcdFx0XHRcdFx0cy5vcmllbnRhdGlvbk1vZGUgPSBPcmllbnRhdGlvbk1vZGUuQ0FNRVJBX1BMQU5FO1xuXHRcdFx0XHRcdFx0cy5hbGlnbm1lbnRNb2RlID0gQWxpZ25tZW50TW9kZS5QSVZPVF9QT0lOVDtcblx0XHRcdFx0XHRcdFx0cy54ID0gIHRoaXMuZ2V0UmFuZG9tKC00MDAgLCA0MDApO1xuXHRcdFx0XHRcdFx0XHRzLnkgPSAgdGhpcy5nZXRSYW5kb20oLTQwMCAsIDQwMCk7XG5cdFx0XHRcdFx0XHRcdHMueiA9ICB0aGlzLmdldFJhbmRvbSgtNDAwICwgNDAwKTtcblx0XHRcdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQocyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogTW91c2UgZG93biBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlRG93bihldmVudDpNb3VzZUV2ZW50KTp2b2lkXG5cdHtcblx0XHR0aGlzLl9sYXN0UGFuQW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnBhbkFuZ2xlO1xuXHRcdHRoaXMuX2xhc3RUaWx0QW5nbGUgPSB0aGlzLl9jYW1lcmFDb250cm9sbGVyLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBNb3VzZSB1cCBsaXN0ZW5lciBmb3IgbmF2aWdhdGlvblxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlVXAoZXZlbnQ6TW91c2VFdmVudCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fbW92ZSA9IGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqIEBwYXJhbSBldmVudFxuXHQgKi9cblx0cHJpdmF0ZSBvbk1vdXNlTW92ZShldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vdmUpIHtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIucGFuQW5nbGUgPSAwLjMqKGV2ZW50LmNsaWVudFggLSB0aGlzLl9sYXN0TW91c2VYKSArIHRoaXMuX2xhc3RQYW5BbmdsZTtcblx0XHRcdHRoaXMuX2NhbWVyYUNvbnRyb2xsZXIudGlsdEFuZ2xlID0gMC4zKihldmVudC5jbGllbnRZIC0gdGhpcy5fbGFzdE1vdXNlWSkgKyB0aGlzLl9sYXN0VGlsdEFuZ2xlO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBzdGFnZSBsaXN0ZW5lciBmb3IgcmVzaXplIGV2ZW50c1xuXHQgKi9cblx0cHJpdmF0ZSBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbCk6dm9pZFxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsIGZ1bmN0aW9uIC0gZ2V0UmFuZG9tIE51bWJlclxuXHQgKi9cblx0cHJpdmF0ZSBnZXRSYW5kb20obWluOm51bWJlciwgbWF4Om51bWJlcik6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSoobWF4IC0gbWluKSArIG1pbjtcblx0fVxufSJdfQ==