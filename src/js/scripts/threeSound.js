import { easing, everyFrame, value, tween, physics } from 'popmotion'
import { Synth, PingPongDelay } from  'tone'
import quantizeNumber from 'quantize-number'
import * as THREE from 'three'

export default () => {
  // TONE
  var feedbackDelay = new PingPongDelay({
    'delayTime': "8n",
    'feedback': 0.1,
    'wet': 0.15
  }).toMaster()
  const fm = new Synth({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.3,
      release: 1
    }
  }).toMaster().connect(feedbackDelay)

  // THREE
  let clothGeometry;

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xff69b4)
  scene.fog = new THREE.Fog( 0xff69b4, 10, 1000 )
  const container = document.querySelector('#wrapper')
  const loader = new THREE.TextureLoader()
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  container.appendChild(renderer.domElement)
  // CAMERA
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  camera.position.z = 10
  camera.position.y = 3
  camera.position.x = 0

  const cameraRotation = value(0, (v) => {
    // fm.triggerAttackRelease(v, '2n')
  })

  var texture = new THREE.TextureLoader().load( "/assets/textures/rag1.jpg" );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 1, 1 );

  // SPHERE
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereGeometry2 = new THREE.SphereGeometry(1, 12, 12);
  
  const spherematerial = new THREE.MeshPhongMaterial({
    map: texture,
    overdraw: 0.125
  });

  const sphere2material = new THREE.MeshPhongMaterial({
    color: 0xff69b4
  });
  
  const sphere = new THREE.Mesh(sphereGeometry, sphere2material);
  const sphere2 = new THREE.Mesh(sphereGeometry2, sphere2material);
  const sphere3 = new THREE.Mesh(sphereGeometry2, sphere2material);
  
  scene.add(sphere);
  scene.add(sphere2);
  scene.add(sphere3);

  sphere2.receiveShadow = false

  sphere.position.x = 5
  sphere2.position.x = 0
  sphere2.position.z = -5
  sphere3.position.x = -5
  sphere3.position.z = -2

  const cubeRotation = value(0, (v) => {
    sphere.position.y = v
    sphere2.position.y = v / 2
    sphere3.position.y = v * 1.5
    fm.triggerAttackRelease(v * 70, '2n')
  })

  // GROUND
  var groundTexture = loader.load( '/assets/textures/rag1.jpg' );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 12;
  var groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexture
  });

  var mesh = new THREE.Mesh(
    new THREE.PlaneBufferGeometry( 3000, 3000 ),
    groundMaterial
  );
  mesh.position.y = - 250;
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );

  // LIGHTS
  scene.add(
    new THREE.AmbientLight(0x666666)
  )

  var spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(10, 100, 10)
  spotLight.castShadow = true
  scene.add(spotLight)

  // CLOTH


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
