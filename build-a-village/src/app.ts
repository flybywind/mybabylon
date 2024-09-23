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
            -Math.PI / 1.5, //comment: 即沿着y轴旋转，0是正对x轴
            Math.PI / 3,    //comment: 沿着z轴旋转, 0是正对y轴
            10,
            new BABYLON.Vector3(0, 0, 0) //comment:  target position,即用户看向的位置
        );

        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

        // const box = MeshBuilder.CreateBox("box", {});
        // box.position.y = 0.5;
        // const boxMat = new BABYLON.StandardMaterial("boxMat");
        // boxMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png");
        // box.material = boxMat;

        const boxMat = new BABYLON.StandardMaterial("boxMat");
        boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png")

        //options parameter to set different images on each side
        const faceUV = [];
        faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face, 这些坐标是相对于图片左下角而言的
        faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
        faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
        faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
        const box = MeshBuilder.CreateBox("box", { faceUV: faceUV, wrap: true });
        box.position.y = 0.5;
        box.material = boxMat;
        // top 4 and bottom 5 not seen so not set
        const roof = MeshBuilder.CreateCylinder("roof", {
            diameter: 1.3, height: 1.2,
            tessellation: 3 //comment:  截面为3角的管体，好像只能是整数 
        });
        roof.scaling.x = 0.75;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;
        const roofMat = new BABYLON.StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
        roof.material = roofMat;

        // comment: disposeSource，合并后是否在scene中保留原始mesh，默认丢掉
        //comment:  multiMultiMaterial，是否允许多材质，默认false，true的话会保留原来mesh的材质
        const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);

        const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 }, scene);
        const groundMat = new BABYLON.StandardMaterial("grass", scene);
        groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        ground.material = groundMat;


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