import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
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
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);
        const camera = new BABYLON.ArcRotateCamera("camera",
            -Math.PI / 2, //comment: 即沿着y轴旋转，0是正对x轴
            Math.PI / 2.5,    //comment: 沿着z轴旋转, 0是正对y轴
            15,
            new BABYLON.Vector3(0, 0, 0) //comment:  target position,即用户看向的位置
        );

        camera.attachControl(canvas, true);

        camera.attachControl(canvas, true);
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
        light.intensity = 1.0;

        // comment this line to build village and export the scene
        // this.buildVillage();
        // comment the above line and uncomment the following line to import the scene
        BABYLON.SceneLoader.ImportMesh("", "/assets/meshes/village/", "scene.babylon");

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
    buildVillage = () => {
        const ground = this.buildGround();
        const detached_house = this.buildHouse(1);
        detached_house.rotation.y = -Math.PI / 16;
        detached_house.position.x = -6.8;
        detached_house.position.z = 2.5;

        const semi_house = this.buildHouse(2);
        semi_house.rotation.y = -Math.PI / 16;
        semi_house.position.x = -4.5;
        semi_house.position.z = 3;

        const places = []; //each entry is an array [house type, rotation, x, z]
        places.push([1, -Math.PI / 16, -6.8, 2.5]);
        places.push([1, 15 * Math.PI / 16, -4.1, -1]);
        places.push([1, 5 * Math.PI / 4, 0, -1]);
        places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
        places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
        places.push([1, Math.PI / 1.95, 4.5, -3]);
        places.push([1, Math.PI / 1.9, 4.75, -7]);
        places.push([1, -Math.PI / 3, 6, 4]);
        places.push([2, -Math.PI / 16, -4.5, 3]);
        places.push([2, -Math.PI / 16, -1.5, 4]);
        places.push([2, -Math.PI / 3, 1.5, 6]);
        places.push([2, 15 * Math.PI / 16, -6.4, -1.5]);
        places.push([2, 15 * Math.PI / 16, -2.1, -0.5]);
        places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
        places.push([2, Math.PI / 1.9, 4.75, -1]);
        places.push([2, Math.PI / 1.9, 4.75, -5]);
        places.push([2, -Math.PI / 3, 5.25, 2]);

        //Create instances from the first two that were built
        const houses = [];
        for (let i = 0; i < places.length; i++) {
            if (places[i][0] === 1) {
                houses[i] = detached_house.createInstance("detached" + i);
            }
            else {
                houses[i] = semi_house.createInstance("semi" + i);
            }
            houses[i].rotation.y = places[i][1];
            houses[i].position.x = places[i][2];
            houses[i].position.z = places[i][3];
        }
    }
    buildGround = () => {
        //color
        const groundMat = new BABYLON.StandardMaterial("groundMat");
        groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0);

        const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 15, height: 16 });
        ground.material = groundMat;
    }

    buildHouse = (width) => {
        const box = this.buildBox(width);
        const roof = this.buildRoof(width);

        return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
    }

    buildBox = (width) => {
        //texture
        const boxMat = new BABYLON.StandardMaterial("boxMat-" + width);
        if (width == 2) {
            boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/semihouse.png")
        }
        else {
            boxMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/cubehouse.png");
        }

        //options parameter to set different images on each side
        const faceUV = [];
        if (width == 2) {
            faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
            faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
            faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
            faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
        }
        else {
            faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
            faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
            faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
            faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
        }
        // top 4 and bottom 5 not seen so not set

        /**** World Objects *****/
        const box = BABYLON.MeshBuilder.CreateBox("box", { width: width, faceUV: faceUV, wrap: true });
        box.material = boxMat;
        box.position.y = 0.5;

        return box;
    }

    buildRoof = (width) => {
        //texture
        const roofMat = new BABYLON.StandardMaterial("roofMat");
        roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

        const roof = BABYLON.MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
        roof.material = roofMat;
        roof.scaling.x = 0.75;
        roof.scaling.y = width;
        roof.rotation.z = Math.PI / 2;
        roof.position.y = 1.22;

        return roof;
    }
}
new App();