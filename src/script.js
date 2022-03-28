import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //컨트롤 정의하는데 사용
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; //objloader



//objloder

let object

let cameraControls

const controls = {

    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false

};

function loadModel() {
    //traverse()함수는 scene의 child항목들을 반복적으로 검사하는 기능을 수행한다
    object.traverse(function (child) {
        //console.log(child)
        if (child.isMesh) child.material.map = texture;
    });

    // object.position.y = 200;

    //console.log(object.children[0].rotation.x = 4.8, 'object cat')
    //Math.PI 반지름  Math.PI *2 한바퀴
    object.children[0].rotation.x = 4.8
    object.scale.set(0.4, 0.4, 0.4);
    object.position.set(40, 30, 0)
    console.log(object)
    scene.add(object);

}

const manager = new THREE.LoadingManager(loadModel);

// texture

const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load('textures/Cat_diffuse.jpg');

// model

function onProgress(xhr) {

    if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

    }

}

function onError() { }

const objLoader = new OBJLoader(manager);
objLoader.load('models/obj/cat/cat.obj', function (obj) {

    object = obj;

}, onProgress, onError);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
//geometry 뼈대 BoxGeometry 정육면체 (가로, 세로, 깊이)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 })
//TextureLoader
/*const loader = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
    map: loader.load('https://threejs.org/manual/examples/resources/images/wall.jpg'),
})*/

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
cube.scale.set(20, 20, 20);
cube.position.set(0, 0, 0)



/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/** Camera
 * 
*/
//PerspectiveCamera (field of view, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 50, 300); //카메라의 위치 중점에서 위로 10칸 뒤로 20칸 x,y,z
//camera.position.z = -1
const helper = new THREE.CameraHelper(camera);
scene.add(helper);
scene.add(camera)



/**
 * Light
 */
const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity); //target이 있는 방향으로 빛을 쬔다. ㄴ
light.position.set(200, 450, 500);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)

/**
 * bg

const loader = new THREE.TextureLoader();
const bgTexture = loader.load('https://threejs.org/manual/examples/resources/images/daikanyama.jpg');
scene.background = bgTexture; */

//cubeTextureLoader
const loader = new THREE.CubeTextureLoader();
const texture1 = loader.load([
    'afterrain/afterrain_ft.jpg',
    'afterrain/afterrain_bk.jpg',
    'afterrain/afterrain_up.jpg',
    'afterrain/afterrain_dn.jpg',
    'afterrain/afterrain_rt.jpg',
    'afterrain/afterrain_lf.jpg',
]);
scene.background = texture1;

//event 
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

//방향키로 움직이기 
// OrbitControls는 특정 좌표를 중심으로 카메라를 자전 고정된 축을 중심으로 회전함 또는 공전 한 천체(天體)가 다른 천체의 둘레를 주기적으로 도는 일 을 하도록 한다.
cameraControls = new OrbitControls(camera, canvas);
cameraControls.target.set(0, 50, 0);
cameraControls.update();

function onKeyDown(event) {
    console.log(event.code)

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': controls.moveForward = true; break;

        case 'ArrowDown':
        case 'KeyS': controls.moveBackward = true; break;

        case 'ArrowLeft':
        case 'KeyA': controls.moveLeft = true; break;

        case 'ArrowRight':
        case 'KeyD': controls.moveRight = true; break;

        // case 'KeyC': controls.crouch = true; break;
        // case 'Space': controls.jump = true; break;
        // case 'ControlLeft':
        // case 'ControlRight': controls.attack = true; break;

    }

}

function onKeyUp(event) {

    switch (event.code) {

        case 'ArrowUp':
        case 'KeyW': controls.moveForward = false; break;

        case 'ArrowDown':
        case 'KeyS': controls.moveBackward = false; break;

        case 'ArrowLeft':
        case 'KeyA': controls.moveLeft = false; break;

        case 'ArrowRight':
        case 'KeyD': controls.moveRight = false; break;

        // case 'KeyC': controls.crouch = false; break;
        // case 'Space': controls.jump = false; break;
        // case 'ControlLeft':
        // case 'ControlRight': controls.attack = false; break;

    }

}


const axesHelper = new THREE.AxesHelper(5);
axesHelper.setColors(new THREE.Color('red'), new THREE.Color('skyblue'), new THREE.Color('green'))
scene.add(axesHelper);

function render(time) {
    time *= 0.001; //time -> seconds로 변환

    // cube.rotation.x = time;  //time마다 cube가 회전
    //cube.rotation.y = time;
    // object cat이 null이 아닐 때 
    if (object) object.rotation.y = time;
    renderer.render(scene, camera)
    requestAnimationFrame(render);

}
//브라우저에 애니메이션 프레임을 요청하는 함수 인자로 실행할 함수를 전달한다.
//브라우저는 넘겨받은 함수를 실행하고, 페이지에 변화가 있다면 페이지를 다시 렌더링한다. 
requestAnimationFrame(render);
