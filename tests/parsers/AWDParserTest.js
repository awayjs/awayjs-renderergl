var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var AssetType = require("awayjs-core/lib/library/AssetType");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Debug = require("awayjs-core/lib/utils/Debug");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var View = require("awayjs-display/lib/containers/View");
var DefaultRenderer = require("awayjs-stagegl/lib/render/DefaultRenderer");
var AWDParser = require("awayjs-renderergl/lib/parsers/AWDParser");
var AWDParserTest = (function () {
    function AWDParserTest() {
        var _this = this;
        Debug.LOG_PI_ERRORS = true;
        Debug.THROW_ERRORS = false;
        AssetLibrary.enableParser(AWDParser);
        this._token = AssetLibrary.load(new URLRequest('assets/suzanne.awd'));
        this._token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this._token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this._view = new View(new DefaultRenderer());
        this._timer = new RequestAnimationFrame(this.render, this);
        window.onresize = function (event) { return _this.resize(event); };
        this._timer.start();
        this.resize();
    }
    AWDParserTest.prototype.resize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    AWDParserTest.prototype.render = function (dt) {
        if (this._suzanne)
            this._suzanne.rotationY += 1;
        this._view.render();
        this._view.camera.z = -2000;
    };
    AWDParserTest.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('events.AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
    };
    AWDParserTest.prototype.onResourceComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('events.LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
        var loader = event.target;
        var numAssets = loader.baseDependency.assets.length;
        for (var i = 0; i < numAssets; ++i) {
            var asset = loader.baseDependency.assets[i];
            switch (asset.assetType) {
                case AssetType.MESH:
                    this._suzanne = asset;
                    this._suzanne.transform.scale = new Vector3D(600, 600, 600);
                    this._view.scene.addChild(this._suzanne);
                    break;
                case AssetType.GEOMETRY:
                    break;
                case AssetType.MATERIAL:
                    break;
            }
        }
    };
    return AWDParserTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlcnMvYXdkcGFyc2VydGVzdC50cyJdLCJuYW1lcyI6WyJBV0RQYXJzZXJUZXN0IiwiQVdEUGFyc2VyVGVzdC5jb25zdHJ1Y3RvciIsIkFXRFBhcnNlclRlc3QucmVzaXplIiwiQVdEUGFyc2VyVGVzdC5yZW5kZXIiLCJBV0RQYXJzZXJUZXN0Lm9uQXNzZXRDb21wbGV0ZSIsIkFXRFBhcnNlclRlc3Qub25SZXNvdXJjZUNvbXBsZXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFVBQVUsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBQ3JFLElBQU8sV0FBVyxXQUFlLG9DQUFvQyxDQUFDLENBQUM7QUFDdkUsSUFBTyxRQUFRLFdBQWdCLCtCQUErQixDQUFDLENBQUM7QUFDaEUsSUFBTyxZQUFZLFdBQWUsc0NBQXNDLENBQUMsQ0FBQztBQUcxRSxJQUFPLFNBQVMsV0FBZSxtQ0FBbUMsQ0FBQyxDQUFDO0FBRXBFLElBQU8sVUFBVSxXQUFlLGdDQUFnQyxDQUFDLENBQUM7QUFDbEUsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFDM0QsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXZGLElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBR2xFLElBQU8sZUFBZSxXQUFjLDJDQUEyQyxDQUFDLENBQUM7QUFHakYsSUFBTyxTQUFTLFdBQWUseUNBQXlDLENBQUMsQ0FBQztBQUUxRSxJQUFNLGFBQWE7SUFRbEJBLFNBUktBLGFBQWFBO1FBQW5CQyxpQkFrRkNBO1FBeEVDQSxLQUFLQSxDQUFDQSxhQUFhQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFM0JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLFNBQVNBLENBQUNBLENBQUVBO1FBRXRDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxV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b250ZW50IjpbImltcG9ydCBBc3NldEV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvQXNzZXRFdmVudFwiKTtcbmltcG9ydCBMb2FkZXJFdmVudFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0xvYWRlckV2ZW50XCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQXNzZXRMaWJyYXJ5XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiKTtcbmltcG9ydCBBc3NldExvYWRlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExvYWRlclwiKTtcbmltcG9ydCBBc3NldExvYWRlclRva2VuXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExvYWRlclRva2VuXCIpO1xuaW1wb3J0IEFzc2V0VHlwZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldFR5cGVcIik7XG5pbXBvcnQgSUFzc2V0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvSUFzc2V0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IERlYnVnXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL0RlYnVnXCIpO1xuaW1wb3J0IFJlcXVlc3RBbmltYXRpb25GcmFtZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpO1xuXG5pbXBvcnQgVmlld1x0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2NvbnRhaW5lcnMvVmlld1wiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcblxuaW1wb3J0IERlZmF1bHRSZW5kZXJlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3JlbmRlci9EZWZhdWx0UmVuZGVyZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVNZXRob2RNYXRlcmlhbFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvbWF0ZXJpYWxzL1RyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcIik7XG5cbmltcG9ydCBBV0RQYXJzZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3BhcnNlcnMvQVdEUGFyc2VyXCIpO1xuXG5jbGFzcyBBV0RQYXJzZXJUZXN0XG57XG5cblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXHRwcml2YXRlIF90b2tlbjpBc3NldExvYWRlclRva2VuO1xuXHRwcml2YXRlIF90aW1lcjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgX3N1emFubmU6TWVzaDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5MT0dfUElfRVJST1JTID0gdHJ1ZTtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdEFzc2V0TGlicmFyeS5lbmFibGVQYXJzZXIoQVdEUGFyc2VyKSA7XG5cblx0XHR0aGlzLl90b2tlbiA9IEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvc3V6YW5uZS5hd2QnKSk7XG5cdFx0dGhpcy5fdG9rZW4uYWRkRXZlbnRMaXN0ZW5lcihMb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURSwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uUmVzb3VyY2VDb21wbGV0ZShldmVudCkpO1xuXHRcdHRoaXMuX3Rva2VuLmFkZEV2ZW50TGlzdGVuZXIoQXNzZXRFdmVudC5BU1NFVF9DT01QTEVURSwgKGV2ZW50OkFzc2V0RXZlbnQpID0+IHRoaXMub25Bc3NldENvbXBsZXRlKGV2ZW50KSk7XG5cblx0XHR0aGlzLl92aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblx0XHR0aGlzLl90aW1lciA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMucmVzaXplKGV2ZW50KTtcblxuXHRcdHRoaXMuX3RpbWVyLnN0YXJ0KCk7XG5cdFx0dGhpcy5yZXNpemUoKTtcblx0fVxuXG5cdHByaXZhdGUgcmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxuXG5cdHByaXZhdGUgcmVuZGVyKGR0Om51bWJlcikgLy9hbmltYXRlIGJhc2VkIG9uIGR0IGZvciBmaXJlZm94XG5cdHtcblx0XHRpZiAodGhpcy5fc3V6YW5uZSlcblx0XHRcdHRoaXMuX3N1emFubmUucm90YXRpb25ZICs9IDE7XG5cblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnogPSAtMjAwMDtcblx0fVxuXG5cdHB1YmxpYyBvbkFzc2V0Q29tcGxldGUoZXZlbnQ6QXNzZXRFdmVudClcblx0e1xuXHRcdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblx0XHRjb25zb2xlLmxvZygnZXZlbnRzLkFzc2V0RXZlbnQuQVNTRVRfQ09NUExFVEUnLCBBc3NldExpYnJhcnkuZ2V0QXNzZXQoZXZlbnQuYXNzZXQubmFtZSkpO1xuXHRcdGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc291cmNlQ29tcGxldGUoZXZlbnQ6TG9hZGVyRXZlbnQpXG5cdHtcblx0XHRjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coJ2V2ZW50cy5Mb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURScgLCBldmVudCk7XG5cdFx0Y29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG5cdFx0dmFyIGxvYWRlcjpBc3NldExvYWRlciA9IDxBc3NldExvYWRlcj4gZXZlbnQudGFyZ2V0O1xuXHRcdHZhciBudW1Bc3NldHM6bnVtYmVyID0gbG9hZGVyLmJhc2VEZXBlbmRlbmN5LmFzc2V0cy5sZW5ndGg7XG5cblx0XHRmb3IodmFyIGk6bnVtYmVyID0gMDsgaSA8IG51bUFzc2V0czsgKytpKSB7XG5cdFx0XHR2YXIgYXNzZXQ6SUFzc2V0ID0gbG9hZGVyLmJhc2VEZXBlbmRlbmN5LmFzc2V0c1tpXTtcblxuXHRcdFx0c3dpdGNoIChhc3NldC5hc3NldFR5cGUpIHtcblx0XHRcdFx0Y2FzZSBBc3NldFR5cGUuTUVTSDpcblxuXHRcdFx0XHRcdHRoaXMuX3N1emFubmUgPSA8TWVzaD4gYXNzZXQ7XG5cdFx0XHRcdFx0dGhpcy5fc3V6YW5uZS50cmFuc2Zvcm0uc2NhbGUgPSBuZXcgVmVjdG9yM0QoNjAwLCA2MDAsIDYwMCk7XG5cblx0XHRcdFx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuX3N1emFubmUpO1xuXG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBc3NldFR5cGUuR0VPTUVUUlk6XG5cdFx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdFx0Y2FzZSBBc3NldFR5cGUuTUFURVJJQUw6XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59Il19