'use strict';

Physijs.scripts.worker = 'vendor/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var initScene,
  render,
  ground_material,
  renderer,
  render_stats,
  physics_stats,
  scene,
  ground,
  light,
  camera,
  vehicle_body,
  vehicle,
  loader,
  config;

initScene = function () {
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  document.getElementById('viewport').appendChild(renderer.domElement);

  render_stats = new Stats();
  render_stats.domElement.style.position = 'absolute';
  render_stats.domElement.style.top = '0';
  render_stats.domElement.style.zIndex = 100;
  document.getElementById('viewport').appendChild(render_stats.domElement);

  physics_stats = new Stats();
  physics_stats.domElement.style.position = 'absolute';
  physics_stats.domElement.style.top = '0';
  physics_stats.domElement.style.left = '80px';
  physics_stats.domElement.style.zIndex = 100;
  document.getElementById('viewport').appendChild(physics_stats.domElement);

  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, -30, 0));
  scene.addEventListener('update', function () {
    if (input && vehicle) {
      if (input.direction !== null) {
        input.steering += input.direction / 50;
        if (input.steering < -0.6) input.steering = -0.6;
        if (input.steering > 0.6) input.steering = 0.6;
      }
      vehicle.setSteering(input.steering, 0);
      vehicle.setSteering(input.steering, 1);

      if (input.power === true) {
        vehicle.applyEngineForce(300);
      } else if (input.power === false) {
        vehicle.setBrake(20, 2);
        vehicle.setBrake(20, 3);
      } else {
        vehicle.applyEngineForce(0);
      }
    }

    scene.simulate(undefined, 2);
    physics_stats.update();
  });

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
  scene.add(camera);

  // Light
  light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1 );
  // light.position.set(20, 20, -15);
  // light.target.position.copy(scene.position);
  // light.castShadow = true;
  // light.shadowCameraLeft = -1500;
  // light.shadowCameraTop = -1500;
  // light.shadowCameraRight = 1500;
  // light.shadowCameraBottom = 1500;
  // light.shadowCameraNear = 20;
  // light.shadowCameraFar = 400;
  // light.shadowBias = -0.0001;
  // light.shadowMapWidth = light.shadowMapHeight = 2048;
  // light.shadowDarkness = 0.7;
  scene.add(light);

  var input;

  // Loader
  loader = new THREE.TextureLoader();

  // Materials
  ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({
      map: loader.load('images/rocks.jpg'),
    }),
    0.8, // high friction
    0.4 // low restitution
  );
  ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
  ground_material.map.repeat.set(3, 3);

  // Ground
  var NoiseGen = new SimplexNoise();

  var ground_geometry = new THREE.PlaneGeometry(300, 300, 100, 100);
  for (var i = 0; i < ground_geometry.vertices.length; i++) {
    var vertex = ground_geometry.vertices[i];
    // vertex.y = NoiseGen.noise( vertex.x / 30, vertex.z / 30 ) * 1;
  }
  ground_geometry.computeFaceNormals();
  ground_geometry.computeVertexNormals();

  // If your plane is not square as far as face count then the HeightfieldMesh
  // takes two more arguments at the end: # of x faces and # of z faces that were passed to THREE.PlaneMaterial
  ground = new Physijs.HeightfieldMesh(
    ground_geometry,
    ground_material,
    0 // mass
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  var json_loader = new THREE.JSONLoader();

  json_loader.load('models/mustang.json', function (car, car_materials) {
    json_loader.load('models/mustang_wheel.json', function (wheel, wheel_materials) {
      var mesh = new Physijs.BoxMesh(car, new THREE.MeshFaceMaterial(car_materials));
      mesh.position.y = 2;
      mesh.castShadow = mesh.receiveShadow = true;

      vehicle = new Physijs.Vehicle(
        mesh,
        new Physijs.VehicleTuning(10.88, 1.83, 0.28, 500, 10.5, 6000)
      );
      scene.add(vehicle);

      var wheel_material = new THREE.MeshFaceMaterial(wheel_materials);

      for (var i = 0; i < 4; i++) {
        vehicle.addWheel(
          wheel,
          wheel_material,
          new THREE.Vector3(i % 2 === 0 ? -1.6 : 1.6, -1, i < 2 ? 3.3 : -3.2),
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(-1, 0, 0),
          0.5,
          0.7,
          i < 2 ? false : true
        );
      }

      input = {
        power: null,
        direction: null,
        steering: 0,
      };

      document.addEventListener('keydown', function (ev) {
        switch (ev.keyCode) {
          case 37: // left
            input.direction = 1;
            break;

          case 38: // forward
            input.power = true;
            break;

          case 39: // right
            input.direction = -1;
            break;

          case 40: // back
            input.power = false;
            break;
        }
      });

      document.addEventListener('keyup', function (ev) {
        switch (ev.keyCode) {
          case 37: // left
            input.direction = null;
            break;

          case 38: // forward
            input.power = null;
            break;

          case 39: // right
            input.direction = null;
            break;

          case 40: // back
            input.power = null;
            break;
        }
      });
    });
  });

  const gui = new dat.GUI();
  const folder = gui.addFolder('General');
  folder.open();

  config = { sample: 50 };

  folder.add(config, 'sample', 0, 100);

  requestAnimationFrame(render);
  scene.simulate();
};

render = function () {
  requestAnimationFrame(render);

  if (vehicle) {
    camera.position.copy(vehicle.mesh.position).add(new THREE.Vector3(40, 25, 40));
    camera.lookAt(vehicle.mesh.position);

    // light.target.position.copy(vehicle.mesh.position);
    // light.position.addVectors(light.target.position, new THREE.Vector3(20, 20, -15));
  }

  renderer.render(scene, camera);
  render_stats.update();
};

window.onload = initScene;
