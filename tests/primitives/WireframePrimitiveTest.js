var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var PrimitivePolygonPrefab = require("awayjs-display/lib/prefabs/PrimitivePolygonPrefab");
var PrimitiveConePrefab = require("awayjs-display/lib/prefabs/PrimitiveConePrefab");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveCylinderPrefab = require("awayjs-display/lib/prefabs/PrimitiveCylinderPrefab");
var PrimitivePlanePrefab = require("awayjs-display/lib/prefabs/PrimitivePlanePrefab");
var PrimitiveSpherePrefab = require("awayjs-display/lib/prefabs/PrimitiveSpherePrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/DefaultRenderer");
var WireframePrimitiveTest = (function () {
    function WireframePrimitiveTest() {
        var _this = this;
        this.meshes = new Array();
        this.radius = 400;
        Debug.LOG_PI_ERRORS = false;
        Debug.THROW_ERRORS = false;
        this.view = new View(new DefaultRenderer());
        this.raf = new RequestAnimationFrame(this.render, this);
        this.view.backgroundColor = 0x222222;
        window.onresize = function (event) { return _this.onResize(event); };
        this.initMeshes();
        this.raf.start();
        this.onResize();
    }
    WireframePrimitiveTest.prototype.initMeshes = function () {
        var primitives = new Array();
        primitives.push(new PrimitivePolygonPrefab());
        primitives.push(new PrimitiveSpherePrefab());
        primitives.push(new PrimitiveSpherePrefab());
        primitives.push(new PrimitiveCylinderPrefab());
        primitives.push(new PrimitivePlanePrefab());
        primitives.push(new PrimitiveConePrefab());
        primitives.push(new PrimitiveCubePrefab());
        var mesh;
        for (var c = 0; c < primitives.length; c++) {
            primitives[c].geometryType = "lineSubGeometry";
            var t = Math.PI * 2 * c / primitives.length;
            mesh = primitives[c].getNewObject();
            mesh.x = Math.cos(t) * this.radius;
            mesh.y = Math.sin(t) * this.radius;
            mesh.z = 0;
            mesh.transform.scale = new Vector3D(2, 2, 2);
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
    };
    WireframePrimitiveTest.prototype.render = function () {
        if (this.meshes)
            for (var c = 0; c < this.meshes.length; c++)
                this.meshes[c].rotationY += 1;
        this.view.render();
    };
    WireframePrimitiveTest.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return WireframePrimitiveTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvd2lyZWZyYW1lcHJpbWl0aXZldGVzdC50cyJdLCJuYW1lcyI6WyJXaXJlZnJhbWVQcmltaXRpdmVUZXN0IiwiV2lyZWZyYW1lUHJpbWl0aXZlVGVzdC5jb25zdHJ1Y3RvciIsIldpcmVmcmFtZVByaW1pdGl2ZVRlc3QuaW5pdE1lc2hlcyIsIldpcmVmcmFtZVByaW1pdGl2ZVRlc3QucmVuZGVyIiwiV2lyZWZyYW1lUHJpbWl0aXZlVGVzdC5vblJlc2l6ZSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNELElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBR2xFLElBQU8sc0JBQXNCLFdBQVksbURBQW1ELENBQUMsQ0FBQztBQUM5RixJQUFPLG1CQUFtQixXQUFhLGdEQUFnRCxDQUFDLENBQUM7QUFDekYsSUFBTyxtQkFBbUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sdUJBQXVCLFdBQVksb0RBQW9ELENBQUMsQ0FBQztBQUNoRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFDM0YsSUFBTyxxQkFBcUIsV0FBWSxrREFBa0QsQ0FBQyxDQUFDO0FBRTVGLElBQU8sZUFBZSxXQUFjLHVDQUF1QyxDQUFDLENBQUM7QUFFN0UsSUFBTSxzQkFBc0I7SUFRM0JBLFNBUktBLHNCQUFzQkE7UUFBNUJDLGlCQTBFQ0E7UUF0RVFBLFdBQU1BLEdBQWVBLElBQUlBLEtBQUtBLEVBQVFBLENBQUNBO1FBRXZDQSxXQUFNQSxHQUFVQSxHQUFHQSxDQUFDQTtRQUkzQkEsS0FBS0EsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDNUJBLEtBQUtBLENBQUNBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTNCQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM1Q0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEscUJBQXFCQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV4REEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFFckNBLE1BQU1BLENBQUNBLFFBQVFBLEdBQUdBLFVBQUNBLEtBQWFBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLEVBQXBCQSxDQUFvQkEsQ0FBQ0E7UUFFMURBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1FBQ2xCQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUNqQkEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7SUFDakJBLENBQUNBO0lBRU9ELDJDQUFVQSxHQUFsQkE7UUFHQ0UsSUFBSUEsVUFBVUEsR0FBOEJBLElBQUlBLEtBQUtBLEVBQXVCQSxDQUFDQTtRQUM3RUEsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsc0JBQXNCQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM5Q0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEscUJBQXFCQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM3Q0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEscUJBQXFCQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM3Q0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsdUJBQXVCQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUMvQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsb0JBQW9CQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUM1Q0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUMzQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsbUJBQW1CQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUUzQ0EsSUFBSUEsSUFBU0EsQ0FBQ0E7UUFFZEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDbkRBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7WUFFL0NBLElBQUlBLENBQUNBLEdBQVVBLElBQUlBLENBQUNBLEVBQUVBLEdBQUNBLENBQUNBLEdBQUNBLENBQUNBLEdBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBO1lBRTdDQSxJQUFJQSxHQUFVQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUMzQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDakNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNYQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxRQUFRQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUU3Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3hCQSxDQUFDQTtJQUdGQSxDQUFDQTtJQUVPRix1Q0FBTUEsR0FBZEE7UUFFQ0csRUFBRUEsQ0FBQUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDZEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBVUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUE7Z0JBQ2pEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUVoQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDcEJBLENBQUNBO0lBRU1ILHlDQUFRQSxHQUFmQSxVQUFnQkEsS0FBb0JBO1FBQXBCSSxxQkFBb0JBLEdBQXBCQSxZQUFvQkE7UUFFbkNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2hCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDcENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQUNGSiw2QkFBQ0E7QUFBREEsQ0ExRUEsQUEwRUNBLElBQUEiLCJmaWxlIjoicHJpbWl0aXZlcy9XaXJlZnJhbWVQcmltaXRpdmVUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgUHJpbWl0aXZlUHJlZmFiQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVByZWZhYkJhc2VcIik7XG5pbXBvcnQgUHJpbWl0aXZlUG9seWdvblByZWZhYlx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVQb2x5Z29uUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUNvbmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDb25lUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN1YmVQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVDdWJlUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZUN5bGluZGVyUHJlZmFiXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVBsYW5lUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlUGxhbmVQcmVmYWJcIik7XG5pbXBvcnQgUHJpbWl0aXZlU3BoZXJlUHJlZmFiXHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVNwaGVyZVByZWZhYlwiKTtcblxuaW1wb3J0IERlZmF1bHRSZW5kZXJlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL0RlZmF1bHRSZW5kZXJlclwiKTtcblxuY2xhc3MgV2lyZWZyYW1lUHJpbWl0aXZlVGVzdFxue1xuXHRwcml2YXRlIHZpZXc6Vmlldztcblx0cHJpdmF0ZSByYWY6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIG1lc2hlczpBcnJheTxNZXNoPiA9IG5ldyBBcnJheTxNZXNoPigpO1xuXG5cdHByaXZhdGUgcmFkaXVzOm51bWJlciA9IDQwMDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTID0gZmFsc2U7XG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXHRcdHRoaXMucmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJlbmRlciwgdGhpcyk7XG5cblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHgyMjIyMjI7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZXZlbnQ6VUlFdmVudCkgPT4gdGhpcy5vblJlc2l6ZShldmVudCk7XG5cblx0XHR0aGlzLmluaXRNZXNoZXMoKTtcblx0XHR0aGlzLnJhZi5zdGFydCgpO1xuXHRcdHRoaXMub25SZXNpemUoKTtcblx0fVxuXG5cdHByaXZhdGUgaW5pdE1lc2hlcygpOnZvaWRcblx0e1xuXG5cdFx0dmFyIHByaW1pdGl2ZXM6QXJyYXk8UHJpbWl0aXZlUHJlZmFiQmFzZT4gPSBuZXcgQXJyYXk8UHJpbWl0aXZlUHJlZmFiQmFzZT4oKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZVBvbHlnb25QcmVmYWIoKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVTcGhlcmVQcmVmYWIoKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVTcGhlcmVQcmVmYWIoKSk7XG5cdFx0cHJpbWl0aXZlcy5wdXNoKG5ldyBQcmltaXRpdmVDeWxpbmRlclByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZVBsYW5lUHJlZmFiKCkpO1xuXHRcdHByaW1pdGl2ZXMucHVzaChuZXcgUHJpbWl0aXZlQ29uZVByZWZhYigpKTtcblx0XHRwcmltaXRpdmVzLnB1c2gobmV3IFByaW1pdGl2ZUN1YmVQcmVmYWIoKSk7XG5cblx0XHR2YXIgbWVzaDpNZXNoO1xuXG5cdFx0Zm9yICh2YXIgYzpudW1iZXIgPSAwOyBjIDwgcHJpbWl0aXZlcy5sZW5ndGg7IGMrKykge1xuXHRcdFx0cHJpbWl0aXZlc1tjXS5nZW9tZXRyeVR5cGUgPSBcImxpbmVTdWJHZW9tZXRyeVwiO1xuXG5cdFx0XHR2YXIgdDpudW1iZXIgPSBNYXRoLlBJKjIqYy9wcmltaXRpdmVzLmxlbmd0aDtcblxuXHRcdFx0bWVzaCA9IDxNZXNoPiBwcmltaXRpdmVzW2NdLmdldE5ld09iamVjdCgpO1xuXHRcdFx0bWVzaC54ID0gTWF0aC5jb3ModCkqdGhpcy5yYWRpdXM7XG5cdFx0XHRtZXNoLnkgPSBNYXRoLnNpbih0KSp0aGlzLnJhZGl1cztcblx0XHRcdG1lc2gueiA9IDA7XG5cdFx0XHRtZXNoLnRyYW5zZm9ybS5zY2FsZSA9IG5ldyBWZWN0b3IzRCgyLCAyLCAyKTtcblxuXHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG1lc2gpO1xuXHRcdFx0dGhpcy5tZXNoZXMucHVzaChtZXNoKTtcblx0XHR9XG5cblxuXHR9XG5cblx0cHJpdmF0ZSByZW5kZXIoKVxuXHR7XG5cdFx0aWYodGhpcy5tZXNoZXMpXG5cdFx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCB0aGlzLm1lc2hlcy5sZW5ndGg7IGMrKylcblx0XHRcdFx0dGhpcy5tZXNoZXNbY10ucm90YXRpb25ZICs9IDE7XG5cblx0XHR0aGlzLnZpZXcucmVuZGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgb25SZXNpemUoZXZlbnQ6VUlFdmVudCA9IG51bGwpXG5cdHtcblx0XHR0aGlzLnZpZXcueSA9IDA7XG5cdFx0dGhpcy52aWV3LnggPSAwO1xuXG5cdFx0dGhpcy52aWV3LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG5cdFx0dGhpcy52aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxufSJdfQ==