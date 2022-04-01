import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //컨트롤 정의하는데 사용
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; //obj loader
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'; //material loader

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/** * Sizes*/
const sizes = {
    width: 800,
    height: 600
}


let cameraControls;

const playerVelocity = new THREE.Vector3(); //속도 길이 얼만큼 움직일지 
const playerDirection = new THREE.Vector3(); // 방향 

const keyStates = {};

const clock = new THREE.Clock(); //시간을 추적하기 위한 개체

// 시점번경 버튼 이벤트 추가 
document.querySelector('.viewBtn').addEventListener('click', changeView);

// 카메라를 cube위에 달아논다? 
// cube위치랑 카메라 위치랑

let isClick = false;
function changeView() {

    isClick = !isClick

    if (isClick) {
        //target이 보여야 orbitcontrol이 가능하다!! -> orbitcontrol은 target주위를 도니까
        camera.position.x = cube.position.x
        camera.position.z = cube.position.z
        camera.position.y = cube.position.y
    } else {
        camera.position.x = cube.position.x + 15
        camera.position.y = cube.position.y + 10
        camera.position.z = cube.position.z + 15
    }

}

// event 등록 
document.addEventListener('keydown', (event) => { //key 누를 때 

    keyStates[event.code] = true;
});

document.addEventListener('keyup', (event) => { //key 놓을 때 

    keyStates[event.code] = false;

});


//playerDirection 방향값을 리턴하는 함수 
function getForwardVector() {
    //아래 코드가 없으면 카메라의 포지션은 미동도 없다. 
    //console.log(camera.getWorldDirection(playerDirection))
    //console.log(camera.position)
    camera.getWorldDirection(playerDirection); //(target: Vector3) 결과 vector3에 복사된다. 
    playerDirection.y = 0;

    //방향만 필요하기 때문에 길이 최소한 하기 normalize
    //정규화 불필요한 영향을 제거한다. 
    playerDirection.normalize();

    //w,s key {x: -0, y: 0, z: -1}
    return playerDirection;

}
//playerDirection 방향값을 리턴하는 함수 
function getSideVector() {

    camera.getWorldDirection(playerDirection);
    playerDirection.y = 0;
    playerDirection.normalize();
    // console.log(camera.up)
    playerDirection.cross(camera.up);
    //a,d key {x: 1, y: 0, z: -0}
    return playerDirection;

}

// control function 
function controls(deltaTime) {

    // deltaTime? 한 프레임 당 실행하는 시간
    // fram 화면에 뿌려주는 한장 한장의 그림
    // 곱하는 숫자가 커질수록 움직임이 빠르게 보인다. 
    const speedDelta = deltaTime * 130;

    if (keyStates['KeyW']) {
        //playerVelocity 어디로 갈지 얼만큼 갈지 
        playerVelocity.add(getForwardVector().multiplyScalar(speedDelta));
        //getForwardVector() 는 방향을 나타내는 벡터 값 일 것이고 이 벡터값에 speedDelta 값을 곱하자
        //console.log(getForwardVector(), "벡터값이니")
        //console.log(getForwardVector().multiplyScalar(speedDelta), "who r u")
        //playerVelocity 벡터에 추가하기 - 위에서 구한 얼마큰 움직일지에 대한 값을 추가 
        //앞으로 갈 수록 벡터 z rkqtdms -값이 점점 커지고 다시 뒤로가면 z값은 +값으로 커진다. 
        // console.log(playerVelocity, "wwwwww")
    }

    if (keyStates['KeyS']) {
        //s key a key - speedDelta값을 곱하는 이유는 ? z값 음수를 양수로 바꾸기 위해 
        playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta));
        // console.log(playerVelocity, "ssssss")
    }

    if (keyStates['KeyA']) {

        playerVelocity.add(getSideVector().multiplyScalar(-speedDelta));

    }

    if (keyStates['KeyD']) {

        playerVelocity.add(getSideVector().multiplyScalar(speedDelta));

    }



}

function updatePlayer(deltaTime) {
    //멈추기 위한 값
    let damping = Math.exp(- 4 * deltaTime) - 1;
    // addScaledVector(vector3, s:float) v와 s 배수의 값을 곱한다. damping 값이 없으면 방향키대로 물체가 멈추지 않고 계속 진행된다. 
    playerVelocity.addScaledVector(playerVelocity, damping);
    //playerVelocity를 복사한값에 deltaTime( 방향은 없고 크기 물리량)을 곱하면 델타 포지션 완성 
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    // 어디로갈지, 얼마나갈지
    //육하원칙 어디로, 얼마나, 무엇을?
    // console.log('cube', cube.position, 'car', carObj.position)


    cube.position.x += deltaPosition.x;
    cube.position.z += deltaPosition.z;
    camera.position.x += deltaPosition.x;
    camera.position.z += deltaPosition.z;

    cameraControls.target.set(cube.position.x, 0, cube.position.z)


}
let catArr = [];
let cat
//multifle loader
const objPostion = [
    [30, -1, -15],
    [-18, -1, 10],
    [0, -1, 30],
    [9, -1, 12],
    [-25, -1, -30]
]
for (let i = 0; i < 10; i++) {


    const onProgress = function (xhr) {

        if (xhr.lengthComputable) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');

        }

    };

    new MTLLoader()
        .setPath('models/obj/cat/')
        .load('12221_Cat_v1_l3.mtl', function (materials) {

            materials.preload();

            new OBJLoader()
                // .setMaterials(materials)
                .setPath('models/obj/cat/')
                .load('cat.obj', function (object) {
                    cat = object
                    cat.traverse(function (child) {
                        // console.log('cc', child)
                        if (child.isMesh) child.material.map = texture
                    });

                    cat.children[0].rotation.x = 4.8
                    cat.scale.set(0.7, 0.7, 0.7);
                    //cat.position.set(...objPostion[i])
                    object.position.x = Math.random() * 1000 - 800;
                    object.position.y = -1;
                    object.position.z = Math.random() * 900 - 700;
                    catArr.push(cat)
                    scene.add(cat);

                }, onProgress);

        });
}




//cat object 
let catObj
//cat obj load
function loadModel() {
    //traverse()함수는 scene의 child항목들을 반복적으로 검사하는 기능을 수행한다
    //  catObj.traverse(function (child) {
    //     if (child.isMesh) child.material.map = textureLoader.load('textures/uv_grid_opengl.jpg');
    //});

    //Math.PI 반지름  Math.PI *2 한바퀴
    // catObj.children[0].rotation.x = 4.8
    //  catObj.scale.set(0.1, 0.1, 0.1);
    //  catObj.position.set(2, 0, -15)

    //   scene.add(catObj);

}
//말 그대로 로딩 매니저 
const manager = new THREE.LoadingManager(loadModel);
// texture
const textureLoader = new THREE.TextureLoader(manager);
const texture = textureLoader.load('textures/Cat_diffuse.jpg');

function onProgress(xhr) {

    if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

    }

}

function onError() { }


const objLoader = new OBJLoader(manager);
/*
objLoader.load('models/obj/cat/cat.obj', function (obj) {

    catObj = obj;

}, onProgress, onError);*/
let maleObj1
objLoader.load('models/obj/male02/male02.obj', function (obj) {

    maleObj1 = obj
    maleObj1.traverse(function (child) {
        if (child.isMesh) child.material.map = textureLoader.load('textures/uv_grid_opengl.jpg');;
    });
    maleObj1.scale.set(0.1, 0.1, 0.1);
    maleObj1.position.set(-30, -1, 5)
    scene.add(maleObj1)

}, onProgress, onError);

let legoObj
objLoader.load('models/obj/lego/lego obj.obj', function (obj) {
    legoObj = obj
    legoObj.traverse(function (child) {
        if (child.isMesh) child.material.map = textureLoader.load('textures/uv_grid_opengl.jpg');;
    });
    legoObj.rotation.y = 0.5
    legoObj.scale.set(0.5, 0.5, 0.5);
    legoObj.position.set(0, -1, -20)
    scene.add(legoObj)

}, onProgress, onError);
//let ironMan
/*objLoader.load('models/obj/IronMan/IronMan.obj', function (obj) {
    ironMan = obj
    // ironMan.traverse(function (child) {
    //    if (child.isMesh) child.material.map = textureLoader.load('textures/uv_grid_opengl.jpg');;
    // });
    ironMan.scale.set(0.03, 0.03, 0.03);
    ironMan.position.set(-10, 0, -10)

    scene.add(ironMan)

}, onProgress, onError)
*/


/* Object*/
//geometry 뼈대 BoxGeometry 정육면체 (가로, 세로, 깊이)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({ color: 0xff0000 })

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
cube.scale.set(10, 10, 10);
cube.position.set(0, 0, 0)




/** Camera
 * 
*/
//PerspectiveCamera (field of view, aspect, near, far)
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(15, 10, 15)  //카메라의 위치 중점에서 위로 3칸 뒤로 9칸 x,y,z
camera.rotation.order = 'YXZ';
scene.add(camera)
//const helper = new THREE.CameraHelper(camera);
//scene.add(helper);




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
const gg = new THREE.PlaneGeometry(1600, 1600); // 평평한 geometry 
const gm = new THREE.MeshPhongMaterial({ color: 0xF1C232 }); //재질 컬러, The color map.  map? : texture Default is null. The texture map color is modulated by the diffuse .color.

const ground = new THREE.Mesh(gg, gm); // 위 geometry, material을 통해  ground mesh 생성 
ground.rotation.x = - Math.PI / 2; // ground mesh 눕히기 
ground.position.y = -1;
//ground.material.map.repeat.set(32, 32);
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

//cubeTextureLoader skybox
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



//방향키로 움직이기 
// OrbitControls는 특정 좌표를 중심으로 카메라를 자전 고정된 축을 중심으로 회전함 또는 공전 한 천체(天體)가 다른 천체의 둘레를 주기적으로 도는 일 을 하도록 한다.
cameraControls = new OrbitControls(camera, renderer.domElement);
// cameraControls.target.set(0, 0, 0); //control의 초점? 
//cameraControls.update();
//cameraControls.minDistance = 0; //얼마나 멀리 가깝게 
//cameraControls.maxDistance = 500;
// cameraControls.maxPolarAngle = Math.PI / 2; //수직으로 도는 범위 


//const axesHelper = new THREE.AxesHelper(5);
//axesHelper.setColors(new THREE.Color('red'), new THREE.Color('skyblue'), new THREE.Color('green'))
//scene.add(axesHelper);




function render(time) {

    const deltaTime = Math.min(0.05, clock.getDelta());
    controls(deltaTime);
    cameraControls.update() //mouse로 인해 변경된 가메라값을 업데이트 ?
    //update를 하지 않으면  mouse로 변경된 값을 그대로 가져간다. 
    //update를 하면 내가 보고 있던 위를 보고 있더라도 시점변경을 했을 때 다시 앞을 바라본다. 
    updatePlayer(deltaTime);


    time *= 0.002; //time -> seconds로 변환
    // cube.rotation.x = time;  //time마다 cube가 회전
    //cube.rotation.y = time;
    // object cat이 null이 아닐 때 
    catArr.forEach((el) => el.rotation.y = time)
    if (cat) cat.rotation.y = time;
    if (legoObj) legoObj.rotation.y = time;
    if (maleObj1) maleObj1.rotation.y = time;
    //  if (ironMan) ironMan.rotation.y = time;
    renderer.render(scene, camera)
    requestAnimationFrame(render);
    // console.log(camera.position)


}
//브라우저에 애니메이션 프레임을 요청하는 함수 인자로 실행할 함수를 전달한다.
//브라우저는 넘겨받은 함수를 실행하고, 페이지에 변화가 있다면 페이지를 다시 렌더링한다. 
requestAnimationFrame(render);


