import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, Vector3, Mesh, MeshBuilder } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        //>>> code starts here:
        var camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        var light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        //<<< code ends here

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Alt+I
            if (ev.shiftKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                    if (this.globalAxes) {
                        this.globalAxes.dispose();
                        this.globalAxes = null;
                    }
                    if (this.localAxes.length > 0) {
                        this.localAxes.forEach(axes => {
                            axes.dispose();
                            axes = null;
                        });
                        this.localAxes = [];
                    }
                } else {
                    scene.debugLayer.show();
                    // 全局坐标轴，并在某个mesh上指定局部坐标轴
                    this.globalAxes = new BABYLON.AxesViewer(scene, 1);
                    // this.axesSwitch(scene, sphere);
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
    globalAxes: BABYLON.AxesViewer = null
    localAxes: BABYLON.AxesViewer[] = []
    axesSwitch = (scene: Scene, mesh: Mesh) => {
        var axesLocalViewer = new BABYLON.AxesViewer(scene, 1);
        axesLocalViewer.xAxis.parent = mesh;
        axesLocalViewer.yAxis.parent = mesh;
        axesLocalViewer.zAxis.parent = mesh;

        this.localAxes.push(axesLocalViewer);
        // axesLocalViewer.dispose();
    }
}
new App();