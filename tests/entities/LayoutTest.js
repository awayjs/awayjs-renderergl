var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var CoordinateSystem = require("awayjs-core/lib/projections/CoordinateSystem");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View = require("awayjs-display/lib/View");
var HoverController = require("awayjs-display/lib/controllers/HoverController");
var Billboard = require("awayjs-display/lib/display/Billboard");
var AwayMouseEvent = require("awayjs-display/lib/events/MouseEvent");
var BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var LayoutTest = (function () {
    function LayoutTest() {
        var _this = this;
        this._move = false;
        this._billboards = new Array();
        //listen for a resource complete event
        AssetLibrary.addEventListener(LoaderEvent.LOAD_COMPLETE, function (event) { return _this.onLoadComplete(event); });
        //load an image
        AssetLibrary.load(new URLRequest('assets/256x256.png'));
    }
    /**
     * Listener for load complete event
     *
     * @param event
     */
    LayoutTest.prototype.onLoadComplete = function (event) {
        var _this = this;
        //create the view
        this._view = new View(new DefaultRenderer());
        this._projection = this._view.camera.projection;
        this._projection.coordinateSystem = CoordinateSystem.RIGHT_HANDED;
        this._projection.focalLength = 1000;
        this._projection.preserveFocalLength = true;
        this._projection.originX = 0;
        this._projection.originY = 0;
        //create a bitmap material
        this._bitmapMaterial = new BasicMaterial(event.assets[0]);
        var billboard;
        var numHBillboards = 2;
        var numVBillboards = 2;
        for (var i = 0; i < numHBillboards; i++) {
            for (var j = 0; j < numVBillboards; j++) {
                billboard = new Billboard(this._bitmapMaterial);
                //billboard.width = 50;
                //billboard.height = 50;
                //billboard.pivot = new Vector3D(billboard.billboardWidth/2, billboard.billboardHeight/2, 0);
                billboard.x = j * 300;
                billboard.y = i * 300;
                billboard.z = 0;
                billboard.addEventListener(AwayMouseEvent.MOUSE_MOVE, this.onMouseEvent);
                //billboard.orientationMode = away.base.OrientationMode.CAMERA_PLANE;
                //billboard.alignmentMode = away.base.AlignmentMode.PIVOT_POINT;
                this._billboards.push(billboard);
                //add billboard to the scene
                this._view.scene.addChild(billboard);
            }
        }
        this._hoverControl = new HoverController(this._view.camera, null, 180, 0, 1000);
        document.onmousedown = function (event) { return _this.onMouseDownHandler(event); };
        document.onmouseup = function (event) { return _this.onMouseUpHandler(event); };
        document.onmousemove = function (event) { return _this.onMouseMove(event); };
        window.onresize = function (event) { return _this.onResize(event); };
        //trigger an initial resize for the view
        this.onResize(null);
        //setup the RAF for a render listener
        this._timer = new RequestAnimationFrame(this.render, this);
        this._timer.start();
    };
    LayoutTest.prototype.onMouseEvent = function (event) {
        console.log(event);
    };
    LayoutTest.prototype.onResize = function (event) {
        this._view.x = 0;
        this._view.y = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    LayoutTest.prototype.render = function (dt) {
        for (var i = 0; i < this._billboards.length; i++) {
        }
        this._view.render();
    };
    LayoutTest.prototype.onMouseUpHandler = function (event) {
        this._move = false;
    };
    LayoutTest.prototype.onMouseMove = function (event) {
        if (this._move) {
            this._hoverControl.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
            this._hoverControl.tiltAngle = -0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
        }
    };
    LayoutTest.prototype.onMouseDownHandler = function (event) {
        this._lastPanAngle = this._hoverControl.panAngle;
        this._lastTiltAngle = this._hoverControl.tiltAngle;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._move = true;
    };
    return LayoutTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0aWVzL0xheW91dFRlc3QudHMiXSwibmFtZXMiOlsiTGF5b3V0VGVzdCIsIkxheW91dFRlc3QuY29uc3RydWN0b3IiLCJMYXlvdXRUZXN0Lm9uTG9hZENvbXBsZXRlIiwiTGF5b3V0VGVzdC5vbk1vdXNlRXZlbnQiLCJMYXlvdXRUZXN0Lm9uUmVzaXplIiwiTGF5b3V0VGVzdC5yZW5kZXIiLCJMYXlvdXRUZXN0Lm9uTW91c2VVcEhhbmRsZXIiLCJMYXlvdXRUZXN0Lm9uTW91c2VNb3ZlIiwiTGF5b3V0VGVzdC5vbk1vdXNlRG93bkhhbmRsZXIiXSwibWFwcGluZ3MiOiJBQUVBLElBQU8sWUFBWSxXQUFlLHNDQUFzQyxDQUFDLENBQUM7QUFFMUUsSUFBTyxVQUFVLFdBQWUsZ0NBQWdDLENBQUMsQ0FBQztBQUNsRSxJQUFPLFdBQVcsV0FBZSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3ZFLElBQU8sZ0JBQWdCLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUVyRixJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFFdkYsSUFBTyxJQUFJLFdBQWlCLHlCQUF5QixDQUFDLENBQUM7QUFDdkQsSUFBTyxlQUFlLFdBQWMsZ0RBQWdELENBQUMsQ0FBQztBQUN0RixJQUFPLFNBQVMsV0FBZSxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXZFLElBQU8sY0FBYyxXQUFjLHNDQUFzQyxDQUFDLENBQUM7QUFDM0UsSUFBTyxhQUFhLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQUdoRixJQUFPLGVBQWUsV0FBYyx1Q0FBdUMsQ0FBQyxDQUFDO0FBRTdFLElBQU0sVUFBVTtJQWlCZkEsU0FqQktBLFVBQVVBO1FBQWhCQyxpQkFpSUNBO1FBMUhRQSxVQUFLQSxHQUFXQSxLQUFLQSxDQUFDQTtRQVF0QkEsZ0JBQVdBLEdBQW9CQSxJQUFJQSxLQUFLQSxFQUFhQSxDQUFDQTtRQUk3REEsQUFDQUEsc0NBRHNDQTtRQUN0Q0EsWUFBWUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxXQUFXQSxDQUFDQSxhQUFhQSxFQUFHQSxVQUFDQSxLQUFpQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBMUJBLENBQTBCQSxDQUFDQSxDQUFDQTtRQUU3R0EsQUFDQUEsZUFEZUE7UUFDZkEsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxDQUFFQSxDQUFDQTtJQUMxREEsQ0FBQ0E7SUFFREQ7Ozs7T0FJR0E7SUFDS0EsbUNBQWNBLEdBQXRCQSxVQUF1QkEsS0FBaUJBO1FBQXhDRSxpQkFvRENBO1FBbERBQSxBQUNBQSxpQkFEaUJBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3Q0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBMkJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1FBR3hFQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLGdCQUFnQkEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7UUFDbEVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxtQkFBbUJBLEdBQUdBLElBQUlBLENBQUNBO1FBQzVDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFN0JBLEFBQ0FBLDBCQUQwQkE7UUFDMUJBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLElBQUlBLGFBQWFBLENBQWlCQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUUxRUEsSUFBSUEsU0FBbUJBLENBQUNBO1FBQ3hCQSxJQUFJQSxjQUFjQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUM5QkEsSUFBSUEsY0FBY0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLGNBQWNBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO1lBQ2hEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxjQUFjQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDaERBLFNBQVNBLEdBQUdBLElBQUlBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO2dCQUNoREEsQUFHQUEsdUJBSHVCQTtnQkFDdkJBLHdCQUF3QkE7Z0JBQ3hCQSw2RkFBNkZBO2dCQUM3RkEsU0FBU0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7Z0JBQ3BCQSxTQUFTQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFDQSxHQUFHQSxDQUFDQTtnQkFDcEJBLFNBQVNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoQkEsU0FBU0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxjQUFjQSxDQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtnQkFDekVBLEFBRUFBLHFFQUZxRUE7Z0JBQ3JFQSxnRUFBZ0VBO2dCQUNoRUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pDQSxBQUNBQSw0QkFENEJBO2dCQUM1QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDdENBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLElBQUlBLGVBQWVBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBRWhGQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxVQUFDQSxLQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE5QkEsQ0FBOEJBLENBQUNBO1FBQzVFQSxRQUFRQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFDQSxLQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUE1QkEsQ0FBNEJBLENBQUNBO1FBQ3hFQSxRQUFRQSxDQUFDQSxXQUFXQSxHQUFHQSxVQUFDQSxLQUFnQkEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBdkJBLENBQXVCQSxDQUFDQTtRQUVyRUEsTUFBTUEsQ0FBQ0EsUUFBUUEsR0FBSUEsVUFBQ0EsS0FBYUEsSUFBS0EsT0FBQUEsS0FBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBcEJBLENBQW9CQSxDQUFDQTtRQUUzREEsQUFDQUEsd0NBRHdDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFFcEJBLEFBQ0FBLHFDQURxQ0E7UUFDckNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDM0RBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO0lBQ3JCQSxDQUFDQTtJQUVPRixpQ0FBWUEsR0FBcEJBLFVBQXFCQSxLQUFvQkE7UUFFeENHLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVPSCw2QkFBUUEsR0FBaEJBLFVBQWlCQSxLQUFhQTtRQUU3QkksSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDakJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7SUFDeENBLENBQUNBO0lBRU9KLDJCQUFNQSxHQUFkQSxVQUFlQSxFQUFTQTtRQUV2QkssR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7UUFFMURBLENBQUNBO1FBRURBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBRXJCQSxDQUFDQTtJQUVPTCxxQ0FBZ0JBLEdBQXhCQSxVQUF5QkEsS0FBZ0JBO1FBRXhDTSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtJQUNwQkEsQ0FBQ0E7SUFFT04sZ0NBQVdBLEdBQW5CQSxVQUFvQkEsS0FBZ0JBO1FBRW5DTyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsUUFBUUEsR0FBR0EsR0FBR0EsR0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7WUFDMUZBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBO1FBQzlGQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVPUCx1Q0FBa0JBLEdBQTFCQSxVQUEyQkEsS0FBZ0JBO1FBRTFDUSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxRQUFRQSxDQUFDQTtRQUNqREEsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDbkRBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBO1FBQ2pDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNqQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDbkJBLENBQUNBO0lBQ0ZSLGlCQUFDQTtBQUFEQSxDQWpJQSxBQWlJQ0EsSUFBQSIsImZpbGUiOiJlbnRpdGllcy9MYXlvdXRUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQml0bWFwSW1hZ2UyRFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2ltYWdlL0JpdG1hcEltYWdlMkRcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBBc3NldExpYnJhcnlcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRMaWJyYXJ5XCIpO1xuaW1wb3J0IFVSTExvYWRlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBMb2FkZXJFdmVudFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0xvYWRlckV2ZW50XCIpO1xuaW1wb3J0IENvb3JkaW5hdGVTeXN0ZW1cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wcm9qZWN0aW9ucy9Db29yZGluYXRlU3lzdGVtXCIpO1xuaW1wb3J0IFBlcnNwZWN0aXZlUHJvamVjdGlvblx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcHJvamVjdGlvbnMvUGVyc3BlY3RpdmVQcm9qZWN0aW9uXCIpO1xuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuXG5pbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL1ZpZXdcIik7XG5pbXBvcnQgSG92ZXJDb250cm9sbGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udHJvbGxlcnMvSG92ZXJDb250cm9sbGVyXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZGlzcGxheS9CaWxsYm9hcmRcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Rpc3BsYXkvTWVzaFwiKTtcbmltcG9ydCBBd2F5TW91c2VFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2V2ZW50cy9Nb3VzZUV2ZW50XCIpO1xuaW1wb3J0IEJhc2ljTWF0ZXJpYWxcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvQmFzaWNNYXRlcmlhbFwiKTtcbmltcG9ydCBTaW5nbGUyRFRleHR1cmVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi90ZXh0dXJlcy9TaW5nbGUyRFRleHR1cmVcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9EZWZhdWx0UmVuZGVyZXJcIik7XG5cbmNsYXNzIExheW91dFRlc3Rcbntcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF9wcm9qZWN0aW9uOlBlcnNwZWN0aXZlUHJvamVjdGlvbjtcblx0cHJpdmF0ZSBfdGltZXI6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF9ob3ZlckNvbnRyb2w6SG92ZXJDb250cm9sbGVyO1xuXG5cdHByaXZhdGUgX21vdmU6Ym9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9sYXN0UGFuQW5nbGU6bnVtYmVyO1xuXHRwcml2YXRlIF9sYXN0VGlsdEFuZ2xlOm51bWJlcjtcblx0cHJpdmF0ZSBfbGFzdE1vdXNlWDpudW1iZXI7XG5cdHByaXZhdGUgX2xhc3RNb3VzZVk6bnVtYmVyO1xuXG5cdHByaXZhdGUgX3RleHR1cmU6U2luZ2xlMkRUZXh0dXJlO1xuXHRwcml2YXRlIF9iaXRtYXBNYXRlcmlhbDpCYXNpY01hdGVyaWFsO1xuXHRwcml2YXRlIF9iaWxsYm9hcmRzOkFycmF5PEJpbGxib2FyZD4gPSBuZXcgQXJyYXk8QmlsbGJvYXJkPigpO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdC8vbGlzdGVuIGZvciBhIHJlc291cmNlIGNvbXBsZXRlIGV2ZW50XG5cdFx0QXNzZXRMaWJyYXJ5LmFkZEV2ZW50TGlzdGVuZXIoTG9hZGVyRXZlbnQuTE9BRF9DT01QTEVURSAsIChldmVudDpMb2FkZXJFdmVudCkgPT4gdGhpcy5vbkxvYWRDb21wbGV0ZShldmVudCkpO1xuXG5cdFx0Ly9sb2FkIGFuIGltYWdlXG5cdFx0QXNzZXRMaWJyYXJ5LmxvYWQobmV3IFVSTFJlcXVlc3QoJ2Fzc2V0cy8yNTZ4MjU2LnBuZycpICk7XG5cdH1cblxuXHQvKipcblx0ICogTGlzdGVuZXIgZm9yIGxvYWQgY29tcGxldGUgZXZlbnRcblx0ICpcblx0ICogQHBhcmFtIGV2ZW50XG5cdCAqL1xuXHRwcml2YXRlIG9uTG9hZENvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cdFx0Ly9jcmVhdGUgdGhlIHZpZXdcblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblxuXHRcdHRoaXMuX3Byb2plY3Rpb24gPSA8UGVyc3BlY3RpdmVQcm9qZWN0aW9uPiB0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uO1xuXG5cblx0XHR0aGlzLl9wcm9qZWN0aW9uLmNvb3JkaW5hdGVTeXN0ZW0gPSBDb29yZGluYXRlU3lzdGVtLlJJR0hUX0hBTkRFRDtcblx0XHR0aGlzLl9wcm9qZWN0aW9uLmZvY2FsTGVuZ3RoID0gMTAwMDtcblx0XHR0aGlzLl9wcm9qZWN0aW9uLnByZXNlcnZlRm9jYWxMZW5ndGggPSB0cnVlO1xuXHRcdHRoaXMuX3Byb2plY3Rpb24ub3JpZ2luWCA9IDA7XG5cdFx0dGhpcy5fcHJvamVjdGlvbi5vcmlnaW5ZID0gMDtcblxuXHRcdC8vY3JlYXRlIGEgYml0bWFwIG1hdGVyaWFsXG5cdFx0dGhpcy5fYml0bWFwTWF0ZXJpYWwgPSBuZXcgQmFzaWNNYXRlcmlhbCg8Qml0bWFwSW1hZ2UyRD4gZXZlbnQuYXNzZXRzWzBdKTtcblxuXHRcdHZhciBiaWxsYm9hcmQ6QmlsbGJvYXJkO1xuXHRcdHZhciBudW1IQmlsbGJvYXJkczpudW1iZXIgPSAyO1xuXHRcdHZhciBudW1WQmlsbGJvYXJkczpudW1iZXIgPSAyO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bUhCaWxsYm9hcmRzOyBpKyspIHtcblx0XHRcdGZvciAodmFyIGo6bnVtYmVyID0gMDsgaiA8IG51bVZCaWxsYm9hcmRzOyBqKyspIHtcblx0XHRcdFx0YmlsbGJvYXJkID0gbmV3IEJpbGxib2FyZCh0aGlzLl9iaXRtYXBNYXRlcmlhbCk7XG5cdFx0XHRcdC8vYmlsbGJvYXJkLndpZHRoID0gNTA7XG5cdFx0XHRcdC8vYmlsbGJvYXJkLmhlaWdodCA9IDUwO1xuXHRcdFx0XHQvL2JpbGxib2FyZC5waXZvdCA9IG5ldyBWZWN0b3IzRChiaWxsYm9hcmQuYmlsbGJvYXJkV2lkdGgvMiwgYmlsbGJvYXJkLmJpbGxib2FyZEhlaWdodC8yLCAwKTtcblx0XHRcdFx0YmlsbGJvYXJkLnggPSBqKjMwMDtcblx0XHRcdFx0YmlsbGJvYXJkLnkgPSBpKjMwMDtcblx0XHRcdFx0YmlsbGJvYXJkLnogPSAwO1xuXHRcdFx0XHRiaWxsYm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihBd2F5TW91c2VFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLm9uTW91c2VFdmVudCk7XG5cdFx0XHRcdC8vYmlsbGJvYXJkLm9yaWVudGF0aW9uTW9kZSA9IGF3YXkuYmFzZS5PcmllbnRhdGlvbk1vZGUuQ0FNRVJBX1BMQU5FO1xuXHRcdFx0XHQvL2JpbGxib2FyZC5hbGlnbm1lbnRNb2RlID0gYXdheS5iYXNlLkFsaWdubWVudE1vZGUuUElWT1RfUE9JTlQ7XG5cdFx0XHRcdHRoaXMuX2JpbGxib2FyZHMucHVzaChiaWxsYm9hcmQpO1xuXHRcdFx0XHQvL2FkZCBiaWxsYm9hcmQgdG8gdGhlIHNjZW5lXG5cdFx0XHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQoYmlsbGJvYXJkKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLl9ob3ZlckNvbnRyb2wgPSBuZXcgSG92ZXJDb250cm9sbGVyKHRoaXMuX3ZpZXcuY2FtZXJhLCBudWxsLCAxODAsIDAsIDEwMDApO1xuXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5vbk1vdXNlRG93bkhhbmRsZXIoZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2V1cCA9IChldmVudDpNb3VzZUV2ZW50KSA9PiB0aGlzLm9uTW91c2VVcEhhbmRsZXIoZXZlbnQpO1xuXHRcdGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gKGV2ZW50Ok1vdXNlRXZlbnQpID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplICA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKGV2ZW50KTtcblxuXHRcdC8vdHJpZ2dlciBhbiBpbml0aWFsIHJlc2l6ZSBmb3IgdGhlIHZpZXdcblx0XHR0aGlzLm9uUmVzaXplKG51bGwpO1xuXG5cdFx0Ly9zZXR1cCB0aGUgUkFGIGZvciBhIHJlbmRlciBsaXN0ZW5lclxuXHRcdHRoaXMuX3RpbWVyID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlciwgdGhpcyk7XG5cdFx0dGhpcy5fdGltZXIuc3RhcnQoKTtcblx0fVxuXG5cdHByaXZhdGUgb25Nb3VzZUV2ZW50KGV2ZW50OkF3YXlNb3VzZUV2ZW50KVxuXHR7XG5cdFx0Y29uc29sZS5sb2coZXZlbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBvblJlc2l6ZShldmVudDpVSUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblx0XHR0aGlzLl92aWV3LnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyKGR0Om51bWJlcilcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX2JpbGxib2FyZHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdC8vdGhpcy5fYmlsbGJvYXJkc1tpXS5yb3RhdGlvblogKz0yO1xuXHRcdH1cblxuXHRcdHRoaXMuX3ZpZXcucmVuZGVyKCk7XG5cblx0fVxuXG5cdHByaXZhdGUgb25Nb3VzZVVwSGFuZGxlcihldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0dGhpcy5fbW92ZSA9IGZhbHNlO1xuXHR9XG5cblx0cHJpdmF0ZSBvbk1vdXNlTW92ZShldmVudDpNb3VzZUV2ZW50KVxuXHR7XG5cdFx0aWYgKHRoaXMuX21vdmUpIHtcblx0XHRcdHRoaXMuX2hvdmVyQ29udHJvbC5wYW5BbmdsZSA9IDAuMyooZXZlbnQuY2xpZW50WCAtIHRoaXMuX2xhc3RNb3VzZVgpICsgdGhpcy5fbGFzdFBhbkFuZ2xlO1xuXHRcdFx0dGhpcy5faG92ZXJDb250cm9sLnRpbHRBbmdsZSA9IC0wLjMqKGV2ZW50LmNsaWVudFkgLSB0aGlzLl9sYXN0TW91c2VZKSArIHRoaXMuX2xhc3RUaWx0QW5nbGU7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBvbk1vdXNlRG93bkhhbmRsZXIoZXZlbnQ6TW91c2VFdmVudClcblx0e1xuXHRcdHRoaXMuX2xhc3RQYW5BbmdsZSA9IHRoaXMuX2hvdmVyQ29udHJvbC5wYW5BbmdsZTtcblx0XHR0aGlzLl9sYXN0VGlsdEFuZ2xlID0gdGhpcy5faG92ZXJDb250cm9sLnRpbHRBbmdsZTtcblx0XHR0aGlzLl9sYXN0TW91c2VYID0gZXZlbnQuY2xpZW50WDtcblx0XHR0aGlzLl9sYXN0TW91c2VZID0gZXZlbnQuY2xpZW50WTtcblx0XHR0aGlzLl9tb3ZlID0gdHJ1ZTtcblx0fVxufSJdfQ==