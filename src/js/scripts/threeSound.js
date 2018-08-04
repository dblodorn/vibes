import { easing, everyFrame, value, tween, physics } from 'popmotion'
import { FMSynth, PingPongDelay } from  'tone'
import quantizeNumber from 'quantize-number'
import * as THREE from 'three'

export default () => {
  // TONE
  var feedbackDelay = new PingPongDelay({
    'delayTime': "8n",
    'feedback': 0.86,
    'wet': 0.75
  }).toMaster()
  const fm = new FMSynth().toMaster().connect(feedbackDelay)

  // THREE
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xff69b4)
  const container = document.querySelector('#wrapper')
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(renderer.domElement)
  
  camera.position.z = 4
  camera.position.y = 2

  const cameraRotation = value(0, (v) => {
    camera.position.z = v
    fm.triggerAttackRelease(quantizeNumber(v, 2) * 10, '8n')
  })

  var texture = new THREE.TextureLoader().load( "/assets/textures/rag1.jpg" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );

  // Create a Cube Mesh with basic material
  var geometry = new THREE.BoxGeometry(1, 21, 1)
  var material = new THREE.MeshPhongMaterial({map: texture, overdraw: 0.5})
  var cube = new THREE.Mesh( geometry, material )
  scene.add( cube )

  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const spherematerial = new THREE.MeshPhongMaterial({map: texture, overdraw: 0.5});
  const sphere = new THREE.Mesh(sphereGeometry, spherematerial);
  scene.add(sphere);

  const cubeRotation = value(0, (v) => {
    cube.position.y = v
    cube.rotation.x = v
    cube.rotation.z = v
    sphere.position.y = -v
  })

  // Add grid
  const gridSize = 20
  const gridDivisions = 20
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x14D790, 0x14D790)
  // scene.add(gridHelper)

  // Add lights
  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(100, 1000, 100)
  spotLight.castShadow = true
  scene.add(spotLight)
  
  var spotLight2 = new THREE.SpotLight(0xffffff)
  spotLight2.position.set(100, -1000, 100)
  spotLight2.castShadow = false
  scene.add(spotLight2)

  // Render loop
  const render = () => renderer.render(scene, camera)
  everyFrame().start(render)
  
  // POPMOTION EXAMPLE STUFF
  tween({
    from: 0,
    to: 20,
    flip: Infinity,
    ease: easing.linear,
    duration: 2000
  }).start(cameraRotation)

  const gravity = physics({
    from: cubeRotation.get(),
    acceleration: - 9.8,
    restSpeed: false
  }).start((v) => {
    if (v <= 0.5) {
      v = 0.5
      gravity.setVelocity(10)
    }
    cubeRotation.update(v)
  })
}
