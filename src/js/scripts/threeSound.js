import { calc, easing, everyFrame, value, tween, physics } from 'popmotion'
import { FMSynth } from  'tone'
import quantizeNumber from 'quantize-number'
import * as THREE from 'three'

export default (config) => {
  const fm = new FMSynth().toMaster()
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xff69b4);
  const container = document.querySelector('#wrapper');
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  
  camera.position.z = 4;
  camera.position.y = 2
  const cameraDistance = 8;

  const cameraRotation = value(0, (v) => {
    camera.position.z = v
    fm.triggerAttackRelease(quantizeNumber(v, 20) * 10, '8n')
  });

  // Create a Cube Mesh with basic material
  var geometry = new THREE.BoxGeometry(1, 1, 1)
  var material = new THREE.MeshPhongMaterial({color:"#433F81"})
  var cube = new THREE.Mesh( geometry, material )
  scene.add( cube );

  const cubeRotation = value(0, (v) => {
    cube.position.y = v
    cube.rotation.x = v
    cube.rotation.y = v
  })

  // Add grid
  const gridSize = 20;
  const gridDivisions = 20;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x14D790, 0x14D790);
  // scene.add(gridHelper);

  // Add lights
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100, 1000, 100);
  spotLight.castShadow = true;
  scene.add(spotLight);
  
  var spotLight2 = new THREE.SpotLight(0xffffff);
  spotLight2.position.set(100, -1000, 100);
  spotLight2.castShadow = false;
  scene.add(spotLight2);

  // Render loop
  const render = () => renderer.render(scene, camera);
  everyFrame().start(render);
  
  // Rotate camera
  tween({
    from: 0,
    to: 20,
    flip: Infinity,
    ease: easing.linear,
    duration: 2000
  }).start(cameraRotation);

  const gravity = physics({
    from: cubeRotation.get(),
    acceleration: - 9.8,
    restSpeed: false
  }).start((v) => {
    if (v <= 0.5) {
      v = 0.5;
      gravity.setVelocity(10);
    }
    cubeRotation.update(v);
  });
}
