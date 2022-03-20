var scene, 
    camera,
    controls,
    fieldOfView,
  	aspectRatio,
  	nearPlane,
  	farPlane,
    shadowLight, 
    objects = [],
    backLight,
    light, 
    renderer,
		container;
   

var floor, planet1, planet2, planet3, planet4;


var HEIGHT,
  	WIDTH,
    windowHalfX,
  	windowHalfY,
    mousePos = {x:0,y:0};


function init(){
  scene = new THREE.Scene();
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 2500; 
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane);
  camera.position.z = 1000;  
  camera.position.y = 300;
  camera.lookAt(new THREE.Vector3(0,0,0));    
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio); 
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMapEnabled = true;
  
  container = document.getElementById('system');
  container.appendChild(renderer.domElement);

  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
    
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchstart', handleTouchStart, false);
	document.addEventListener('touchend', handleTouchEnd, false);
	document.addEventListener('touchmove',handleTouchMove, false);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.minDistance = 350;
  controls.maxDistance = 1600;
  
}


function onWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  windowHalfX = WIDTH / 2;
  windowHalfY = HEIGHT / 2;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


function handleMouseMove(event) {
  mousePos = {x:event.clientX, y:event.clientY};
}


function handleTouchStart(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}


function handleTouchEnd(event) {
    mousePos = {x:windowHalfX, y:windowHalfY};
}


function handleTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
		mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
  }
}


function createLights() {
  light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
  
  shadowLight = new THREE.DirectionalLight(0xffffff, .8);
  shadowLight.position.set(200, 200, 200);
  shadowLight.castShadow = true;
  shadowLight.shadowDarkness = .2;
 	
  backLight = new THREE.DirectionalLight(0xffffff, .4);
  backLight.position.set(-100, 200, 50);
  backLight.shadowDarkness = .1;
  backLight.castShadow = true;
 	
  scene.add(backLight);
  scene.add(light);
  scene.add(shadowLight);
}


Planet = function(fp, sp, color){
  
  this.bodyPlanetInitPositions = [];

  this.orangeSunMat = new THREE.MeshLambertMaterial ({
    color: 0xF48037, 
    shading:THREE.FlatShading
  });
  this.brownMercuryMat = new THREE.MeshLambertMaterial ({
    color: 0x67443B,
    shading: THREE.FlatShading
  });
  this.orangeVenusMat = new THREE.MeshLambertMaterial ({
    color: 0xe39e1c,
    shading: THREE.FlatShading
  });
  this.blueUranusMat = new THREE.MeshLambertMaterial ({
    color: 0xc6d3e3,
    shading: THREE.FlatShading
  });
  this.blueNeptuneMat = new THREE.MeshLambertMaterial ({
    color: 0x85addb,
    shading: THREE.FlatShading
  });

  switch(color) {
    case 1:
      color = this.orangeSunMat;
      break;
    case 2:
      color = this.brownMercuryMat;
      break;
    case 3:
      color = this.orangeVenusMat;
      break;
    case 4:
      color = this.blueUranusMat;
      break;
    case 5:
      color = this.blueNeptuneMat;
      break;
  }

  planetBody = new THREE.TetrahedronGeometry(fp, sp);
  
  planet_returned = new THREE.Mesh(planetBody, color);
  
  return (planet_returned);
  
}


function createPlanets(){

  planet_1 = new Planet(200, 3, 1);
  planet_1.position.x = 0;
  planet_1.position.y = 0;
  planet_1.position.z = 0;

  planet_2 = new Planet(40, 3, 2);
  planet_2.position.x = 0;
  planet_2.position.y = 0;
  planet_2.position.z = 0;

  planet_3 = new Planet(60, 3, 3);
  planet_3.position.x = 0;
  planet_3.position.y = 0;
  planet_3.position.z = 0;

  planet_4 = new Planet(80, 3, 4);
  planet_4.position.x = 0;
  planet_4.position.y = 0;
  planet_4.position.z = 0;

  planet_5 = new Planet(65, 3, 5);
  planet_5.position.x = 0;
  planet_5.position.y = 0;
  planet_5.position.z = 0;

  objects.push(planet_1, planet_2, planet_3, planet_4, planet_5);
  scene.add(planet_1);
  scene.add(planet_2);
  scene.add(planet_3);
  scene.add(planet_4);
  scene.add(planet_5);

}


function setFromCamera(raycaster, coords, origin) {
  raycaster.ray.origin.copy(origin.position);
  raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(origin).sub(origin.position).normalize();
}


async function getCard(card, card_id) {

  var current_card_id = document.getElementById("current_card_id");

  if(current_card_id.innerHTML != card_id) {
    card.style.transition="opacity 0s";
    card.style.opacity="0";
  }

  var card_title = document.getElementById("card_title");
  var card_p = document.getElementById("card_p");
  var card_link_tooltip = document.getElementById("card_link_tooltip");

  let response = await fetch('./json/cards.json');
  let data = await response.json();

  card_title.innerHTML = data.cards[card_id].title;

  card_p.innerHTML = data.cards[card_id].paragraph;

  card_link_tooltip.innerHTML = data.cards[card_id].link_tooltip;

  current_card_id.innerHTML = data.cards[card_id].id;

  card.style.transition="opacity 1s";
  card.style.opacity="1";

};


function onDocumentMouseDown( event ) {

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  var card = document.getElementById("card");
  event.preventDefault();
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(scene.children);

  if(intersects.length > 0) {

    if(intersects[0].object.material.color.getHex() == 0xF48037) {

      getCard(card, 0);

    }

    if(intersects[0].object.material.color.getHex() == 0x67443B) {

        getCard(card, 1);
        
    }

    if(intersects[0].object.material.color.getHex() == 0xe39e1c) {

      getCard(card, 2);
      
    }

    if(intersects[0].object.material.color.getHex() == 0xc6d3e3) {

      getCard(card, 3);
      
    }

    if(intersects[0].object.material.color.getHex() == 0x85addb) {

      getCard(card, 4);
      
    }

  }


}document.addEventListener('mousedown', onDocumentMouseDown, false);


planet_speed_1 = 0;
planet_speed_2 = 0;
planet_speed_3 = 0;
planet_speed_4 = 0;


update = function() {

  planet_speed_1 += 0.008; 
  planet_speed_2 += 0.009;
  planet_speed_3 += 0.0049;
  planet_speed_4 += 0.0035;
	planet_2.position.x = 330*Math.cos(planet_speed_1) + 0;
	planet_2.position.z = 330*Math.sin(planet_speed_1) + 0; 

  planet_3.position.x = 530*Math.cos(planet_speed_2) + 0;
	planet_3.position.z = 530*Math.sin(planet_speed_2) + 0; 

  planet_4.position.x = 750*Math.cos(planet_speed_3) + 0;
	planet_4.position.z = 750*Math.sin(planet_speed_3) + 0; 

  planet_5.position.x = 990*Math.cos(planet_speed_4) + 0;
	planet_5.position.z = 990*Math.sin(planet_speed_4) + 0; 

  return (planet_1.rotation.y += .008, planet_2.rotation.y += .004, planet_3.rotation.y += .01, planet_3.rotation.x += .005, planet_4.rotation.y += -.009, planet_5.rotation.y += -.01);
};


function loop(){

  render();
  requestAnimationFrame(loop);
  return update();
}


function render(){
  renderer.render(scene, camera);
}


init();
createLights();
createPlanets();
loop();