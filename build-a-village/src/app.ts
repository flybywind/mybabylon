import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Mesh, MeshBuilder, Vector3 } from "@babylonjs/core";
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
        const camera = new BABYLON.ArcRotateCamera("camera",
            -Math.PI / 1.5, //即沿着y轴旋转，0是正对x轴
            Math.PI / 3,    //沿着z轴旋转, 0是正对y轴
            10,
            new BABYLON.Vector3(0, 0, 0) // target position,即用户看向的位置
        );

        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

        const box = MeshBuilder.CreateBox("box", {});
        box.position.y = 0.5;
        const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;

        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);


        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
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
                    this.globalAxes = new BABYLON.AxesViewer(scene, 1);
                    this.axesSwitch(scene, roof);
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
    // showAxesOnClick: (mesh: Mesh)=>void = (mesh: Mesh) => {
    //     mesh.addBehavior
    // }
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