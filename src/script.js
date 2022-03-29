import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //컨트롤 정의하는데 사용
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; //objloader


const playerVelocity = new THREE.Vector3(); //속도 길이 
const playerDirection = new THREE.Vector3(); // 방향 

const keyStates = {};

const clock = new THREE.Clock();


// event 등록 
document.addEventListener('keydown', (event) => { //key 누를 때 

    keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => { //key 놓을 때 

    keyStates[event.code] = false;

});



function getForwardVector() {

    camera.getWorldDirection(playerDirection); //(target: Vector3) 결과 vector3에 복사된다. 
    playerDirection.y = 0;
    //방향만 필요하기 때문에 길이 최소한 하기 
    playerDirection.normalize();

    return playerDirection;

}

function getSideVector() {

    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    playerDirection.cross(camera.up);

    return playerDirection;

}

// control function 
function controls(deltaTime) {

    // deltaTime? 한 프레임 당 실행하는 시간
    const speedDelta = deltaTime * 25;

    if (keyStates['KeyW']) {
        //playerVelocity 어디로 갈지 얼만큼 갈지 
        //multiplyScalar(speedDelta) -> vector에 speedDelta:Float 곱하기 
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));

    }

    if (keyStates['KeyS']) {
        playerVelocity.add(getForwardVector().multiplyScalar(- speedDelta));

    }

    if (keyStates['KeyA']) {

        playerVelocity.add(getSideVector().multiplyScalar(- speedDelta));

    }

    if (keyStates['KeyD']) {

        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));

    }



}



function updatePlayer(deltaTime) {
    //멈추기 위해
    let damping = Math.exp(- 4 * deltaTime) - 1;
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    // 어디로갈지, 얼마나갈지
    //육하원칙 어디로, 얼마나, 무엇을?
    //aa console.log(deltaPosition, cube.position)
    //cube.position.x += deltaPosition.x
    //console.log(cube.position)
    // cube.position.z += deltaPosition.z
    camera.position.x += deltaPosition.x
    camera.position.z += deltaPosition.z
    // console.log(deltaPosition, 'delta')





}


let object

function loadModel() {
    //traverse()함수는 scene의 child항목들을 반복적으로 검사하는 기능을 수행한다
    object.traverse(function (child) {
        //console.log(child)
        if (child.isMesh) child.material.map = texture;
    });

    //console.log(object.children[0].rotation.x = 4.8, 'object cat')
    //Math.PI 반지름  Math.PI *2 한바퀴
    object.children[0].rotation.x = 4.8
    object.scale.set(0.1, 0.1, 0.1);
    object.position.set(2, 0, -20)

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


const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
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
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
//camera.position.set(0, 50, 300); //카메라의 위치 중점에서 위로 10칸 뒤로 20칸 x,y,z
camera.position.set(0, 2, 5)
camera.rotation.order = 'YXZ';
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

/** ground 땅 만들기*/
const gt = new THREE.TextureLoader().load('textures/uv_grid_opengl.jpg'); //ground texture load
const gg = new THREE.PlaneGeometry(16000, 16000); // 평평한 geometry 
const gm = new THREE.MeshPhongMaterial({ color: 0x0E8960, map: gt }); //재질 컬러, The color map.  map? : texture Default is null. The texture map color is modulated by the diffuse .color.

const ground = new THREE.Mesh(gg, gm); // 위 geometry, material을 통해  ground mesh 생성 
ground.rotation.x = - Math.PI / 2; // ground mesh 눕히기 
ground.material.map.repeat.set(32, 32);
//ground.material.map.wrapS = THREE.RepeatWrapping;
//ground.material.map.wrapT = THREE.RepeatWrapping;
//ground.material.map.encoding = THREE.sRGBEncoding;
// note that because the ground does not cast a shadow, .castShadow is left false
ground.receiveShadow = true;

scene.add(ground);


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
//skybox
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

//방향키로 움직이기 
// OrbitControls는 특정 좌표를 중심으로 카메라를 자전 고정된 축을 중심으로 회전함 또는 공전 한 천체(天體)가 다른 천체의 둘레를 주기적으로 도는 일 을 하도록 한다.
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 0, 0);
cameraControls.update();


const axesHelper = new THREE.AxesHelper(5);
axesHelper.setColors(new THREE.Color('red'), new THREE.Color('skyblue'), new THREE.Color('green'))
scene.add(axesHelper);




function render(time) {

    const deltaTime = Math.min(0.05, clock.getDelta());
    controls(deltaTime);
    updatePlayer(deltaTime);
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


