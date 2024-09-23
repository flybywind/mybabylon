import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Vector3 } from "@babylonjs/core";
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
        const scene = new BABYLON.Scene(engine);

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2.2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
        camera.attachControl(canvas, true);

        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

        const faceColors = [];
        faceColors[0] = BABYLON.Color3.Blue();
        faceColors[1] = BABYLON.Color3.Teal()
        faceColors[2] = BABYLON.Color3.Red();
        faceColors[3] = BABYLON.Color3.Purple();
        faceColors[4] = BABYLON.Color3.Green();
        faceColors[5] = BABYLON.Color3.Yellow();

        const boxParent = BABYLON.MeshBuilder.CreateBox("Box", { faceColors: faceColors });
        const boxChild = BABYLON.MeshBuilder.CreateBox("Box", { size: 0.5, faceColors: faceColors });
        boxChild.setParent(boxParent);

        // child的位置是相对于parent的坐标系移动的
        boxChild.position.x = -1;
        boxChild.position.y = 2;
        boxChild.position.z = 0;
        // comment: child的旋转则比较迷惑。貌似是相对于自身的，但是当绕x旋转到一定角度后（非0，90°这种），y，z的旋转就不是绕着自己了，
        // 变得比较迷惑。类似的，当绕z轴旋转到一定角度后，x，y的旋转效果也不是绕着自己轴了。目前搞不清楚
        boxChild.rotation.x = Math.PI * 0.5;
        boxChild.rotation.y = Math.PI * 0.25;
        boxChild.rotation.z = Math.PI / 4;

        boxParent.position.x = 1;
        boxParent.position.y = 0;
        boxParent.position.z = 0;

        boxParent.rotation.x = 0;
        boxParent.rotation.y = 0;
        boxParent.rotation.z = -Math.PI / 4;

        const boxParentAxes = this.localAxes(2, scene);
        boxParentAxes.parent = boxParent;

        const boxChildAxes = this.localAxes(1, scene);
        boxChildAxes.parent = boxChild;
        this.showAxis(6, scene);

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
    showAxis = (size, scene) => {
        const makeTextPlane = (text, color, size) => {
            const dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
            dynamicTexture.hasAlpha = true;
            dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
            const plane = BABYLON.MeshBuilder.CreatePlane("TextPlane", { size, updatable: true }, scene);
            const material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
            material.backFaceCulling = false;
            material.specularColor = new BABYLON.Color3(0, 0, 0);
            material.diffuseTexture = dynamicTexture;
            plane.material = material;
            // comment: texture -> material -> mesh, 文字算texture，texture要加到material上，material覆盖到mesh上
            return plane;
        };

        const axisX = BABYLON.MeshBuilder.CreateLines("axisX", {
            points: [
                Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
                new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
            ]
        });
        axisX.color = new BABYLON.Color3(1, 0, 0);
        const xChar = makeTextPlane("X", "red", size / 10);
        xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

        const axisY = BABYLON.MeshBuilder.CreateLines("axisY", {
            points: [
                Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
                new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
            ]
        });
        axisY.color = new BABYLON.Color3(0, 1, 0);
        const yChar = makeTextPlane("Y", "green", size / 10);
        yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

        const axisZ = BABYLON.MeshBuilder.CreateLines("axisZ", {
            points: [
                Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
                new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
            ]
        });
        axisZ.color = new BABYLON.Color3(0, 0, 1);
        const zChar = makeTextPlane("Z", "blue", size / 10);
        zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
    };

    /*********************************************************************/

    /*******************************Local Axes****************************/
    localAxes = (size, scene) => {
        const local_axisX = BABYLON.MeshBuilder.CreateLines("local_axisX", {
            points: [
                Vector3.Zero(), new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
                new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
            ]
        }, scene);
        local_axisX.color = new BABYLON.Color3(1, 0, 0);

        const local_axisY = BABYLON.MeshBuilder.CreateLines("local_axisY", {
            points: [
                Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
                new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
            ]
        }, scene);
        local_axisY.color = new BABYLON.Color3(0, 1, 0);

        const local_axisZ = BABYLON.MeshBuilder.CreateLines("local_axisZ", {
            points: [
                Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
                new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
            ]
        }, scene);
        local_axisZ.color = new BABYLON.Color3(0, 0, 1);

        const local_origin = new BABYLON.TransformNode("local_origin");

        local_axisX.parent = local_origin;
        local_axisY.parent = local_origin;
        local_axisZ.parent = local_origin;

        return local_origin;
    }
}
new App();