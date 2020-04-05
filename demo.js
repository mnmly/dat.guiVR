import * as THREE from 'three'
import { dat } from './modules/datguivr/index'
import VRButton from './modules/thirdparty/VRButton'

var camera, scene, renderer, controllers, cameraRig
controllers = []
var settings = {
  'speed':20,
  'friction':0.1
}

initThreeJS();
initApp();
// animate();

function initThreeJS() {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 15 );
  camera.position.set(0,0,5.0);
  camera.lookAt( new THREE.Vector3() )

  var geom = new THREE.BoxGeometry( 1, 1, 1 )
  var mat = new THREE.MeshBasicMaterial({color: 0xffffffff })
  var node = new THREE.Mesh( geom, mat )
  node.visible = false
  scene.add( node )

  renderer = new THREE.WebGLRenderer( { antialias: true } )
  renderer.setClearColor( 0x3333333 );
  renderer.domElement.id = 'main-canvas'
  renderer.xr.enabled = true;
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )

  document.body.appendChild( renderer.domElement );
  document.body.appendChild( VRButton.createButton( renderer ) );

  setupControllerNodes()
  renderer.setAnimationLoop( tick );
}

function setupControllerNodes() {
    
    function setupGUIEvent( _controller ) {
        let laser = dat.addInputObject( _controller )
        _controller.addEventListener('selectstart', () => laser.pressed( true ) );
        _controller.addEventListener('selectend', () => laser.pressed( false ) );
        scene.add( laser )
    }
    for (let i = 0; i < 2; i++) {
        let controller = renderer.xr.getController( i )
        let box = new THREE.BoxGeometry(0.05, 0.05, 0.05)
        let mat = new THREE.MeshBasicMaterial( { color: 0xffffffff } )
        let mesh = new THREE.Mesh(box, mat)
        setupGUIEvent( controller )
        controller.add( mesh )
        controller.raycaster = new THREE.Raycaster();
        controller.raycaster.near = 0.1;
        // controller.addEventListener('selectend', this.onSelectEnd.bind( this ));
        controllers[ i ] = controller
    }

    cameraRig = new THREE.Group();
    cameraRig.add(camera);
    cameraRig.add(controllers[0]);
    cameraRig.add(controllers[1]);
    cameraRig.position.set(0, 0, 2);
    scene.add(cameraRig);
    cameraRig = cameraRig
}

function initApp(){

  const gui = dat.create( 'Empty GUI' );
  gui.position.set( -0.5, 0, 0 );

  gui.add(settings, 'speed')
  let g = gui.add(settings, 'friction')
  controllers[0].add( gui );
  gui.remove( g )
  dat.enableMouse( camera );
}


function tick() 
{
    // let delta = this.clock.getDelta()
    // let elapsedTime = this.clock.elapsedTime
    // this.world.execute( delta, elapsedTime )
    // this.controls.update()
    dat.tick()
    renderer.render( scene, camera )
}