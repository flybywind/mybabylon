import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene } from "@babylonjs/core";
import * as BABYLON from '@babylonjs/core';
import earcut from 'earcut';
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
        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));
        const car = this.buildCar(scene);
        car.rotation.x = -Math.PI / 2;

        //<<< code ends here

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Alt+I
            if (ev.shiftKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }
    buildCar = (scene: BABYLON.Scene) => {
        //base
        const outline = [
            new BABYLON.Vector3(-0.3, 0, -0.1),
            new BABYLON.Vector3(0.2, 0, -0.1),
        ]

        //curved front
        for (let i = 0; i < 20; i++) {
            outline.push(new BABYLON.Vector3(0.2 * Math.cos(i * Math.PI / 40), 0,
                0.2 * Math.sin(i * Math.PI / 40) - 0.1));
        }

        //top
        outline.push(new BABYLON.Vector3(0, 0, 0.1));
        outline.push(new BABYLON.Vector3(-0.3, 0, 0.1));

        //back formed automatically

        //car face UVs
        const faceUV = [];
        // comment: 注意，这个车现在是侧面朝上。对于extrude形成的cylinder，2是底面，0是顶面。和一般的cylinder相反。1都是侧面
        faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1);
        faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5);
        faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5);
        const carMat = new BABYLON.StandardMaterial("carMat");
        carMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/car.png");
        const car = BABYLON.MeshBuilder.ExtrudePolygon("car", {
            shape: outline, depth: 0.2,
            faceUV: faceUV, wrap: true
        }, scene, earcut);

        //car material
        car.material = carMat;
        // car animation
        const animCar = new BABYLON.Animation("carAnimation", "position.x", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        const carKeys = [];
        carKeys.push({
            frame: 0,
            value: -4
        });

        carKeys.push({
            frame: 150,
            value: 4
        });

        carKeys.push({
            frame: 210,
            value: 4
        });

        animCar.setKeys(carKeys);

        car.animations = [];
        car.animations.push(animCar);

        scene.beginAnimation(car, 0, 210, true);

        //wheel face UVs
        const wheelUV = [];
        wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
        wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
        wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

        //wheel material
        const wheelMat = new BABYLON.StandardMaterial("wheelMat");
        wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

        const wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {
            diameter: 0.125,
            height: 0.05,
            faceUV: wheelUV
        })
        wheelRB.material = wheelMat;
        wheelRB.parent = car;
        wheelRB.position.z = -0.1;
        wheelRB.position.x = -0.2;
        wheelRB.position.y = 0.035;
        //Comment: wheel animation, fps = 30
        const animWheel = new BABYLON.Animation("wheelAnimation", "rotation.y", 30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const wheelKeys = [];

        //At the animation key 0, the value of rotation.y is 0
        wheelKeys.push({
            frame: 0,
            value: 0
        });

        //Comment: At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
        wheelKeys.push({
            frame: 30,
            value: 2 * Math.PI
        });

        //set the keys
        animWheel.setKeys(wheelKeys);

        //Link this animation to the right back wheel
        wheelRB.animations = [];
        wheelRB.animations.push(animWheel);

        const wheelRF = wheelRB.clone("wheelRF");
        wheelRF.position.x = 0.1;

        const wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -0.2 - 0.035;

        const wheelLF = wheelRF.clone("wheelLF");
        wheelLF.position.y = -0.2 - 0.035;

        // BABYLON.SceneLoader.ImportMeshAsync("", "url to model car", "car.babylon").then(() => {
        //     const wheelRB = scene.getMeshByName("wheelRB");
        //     const wheelRF = scene.getMeshByName("wheelRF");
        //     const wheelLB = scene.getMeshByName("wheelLB");
        //     const wheelLF = scene.getMeshByName("wheelLF");

        //     scene.beginAnimation(wheelRB, 0, 30, true);
        //     scene.beginAnimation(wheelRF, 0, 30, true);
        //     scene.beginAnimation(wheelLB, 0, 30, true);
        //     scene.beginAnimation(wheelLF, 0, 30, true);
        // });
        //Begin animation - object to animate, first frame, last frame and loop if true
        scene.beginAnimation(wheelRB, 0, 30, true);
        scene.beginAnimation(wheelRF, 0, 30, true);
        scene.beginAnimation(wheelLB, 0, 30, true);
        scene.beginAnimation(wheelLF, 0, 30, true);

        return car;
    }
}
new App();