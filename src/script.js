import './style.css'
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; //컨트롤 정의하는데 사용

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
cube.position.set(2, -2, -2)


/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
*/
//PerspectiveCamera (field of view, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
//camera.position.set(0, 10, 20) //카메라의 위치 중점에서 위로 10칸 뒤로 20칸 x,y,z
camera.position.z = 3
scene.add(camera)

/**
 * Light
 */


const color = 0xFFFFFF;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity); //target이 있는 방향으로 빛을 쬔다. ㄴ
light.position.set(0, 10, 0);
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
const texture = loader.load([
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
    'https://threejs.org/manual/examples/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
]);
scene.background = texture;


// OrbitControls는 특정 좌표를 중심으로 카메라를 자전 고정된 축을 중심으로 회전함 또는 공전 한 천체(天體)가 다른 천체의 둘레를 주기적으로 도는 일 을 하도록 한다.
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0); //시점을 중점에서위로 5칸 올림 
controls.update();

const axesHelper = new THREE.AxesHelper(5);


axesHelper.setColors(new THREE.Color('red'), new THREE.Color('skyblue'), new THREE.Color('green'))
scene.add(axesHelper);
function render(time) {
    time *= 0.001; //time -> seconds로 변환

    cube.rotation.x = time;  //time마다 cube가 회전
    cube.rotation.y = time;
    renderer.render(scene, camera)
    requestAnimationFrame(render);

}
//브라우저에 애니메이션 프레임을 요청하는 함수 인자로 실행할 함수를 전달한다.
//브라우저는 넘겨받은 함수를 실행하고, 페이지에 변화가 있다면 페이지를 다시 렌더링한다. 
requestAnimationFrame(render);
