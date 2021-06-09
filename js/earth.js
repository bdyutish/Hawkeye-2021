// Created by Bjorn Sandvik - thematicmapping.org

var countDownDate = new Date('June 11, 2021 00:00:00').getTime();

// Update the count down every 1 second
var x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = String(Math.floor(distance / (1000 * 60 * 60 * 24)));
  var hours = String(
    Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );
  var minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  var seconds = String(Math.floor((distance % (1000 * 60)) / 1000));

  if (days.length == 1) {
    days = `0${days}`;
  }
  if (hours.length == 1) {
    hours = `0${hours}`;
  }
  if (minutes.length == 1) {
    minutes = `0${minutes}`;
  }
  if (seconds.length == 1) {
    seconds = `0${seconds}`;
  }

  // Output the result in an element with id="demo"
  document.getElementById('demo').innerHTML =
    days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById('demo').innerHTML = 'EXPIRED';
  }
}, 1000);

(function () {
  var webglEl = document.getElementById('webgl');

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage(webglEl);
    return;
  }

  var width = window.innerWidth,
    height = window.innerHeight;

  // Earth params

  var radius = 0.25;

  if (window.innerWidth < 453) {
    radius = 0.22;
  }

  if (window.innerWidth < 415) {
    radius = 0.2;
  }

  if (window.innerWidth < 360) {
    radius = 0.175;
  }

  if (window.innerWidth < 340) {
    radius = 0.16;
  }

  if (window.innerWidth > 1000) {
    radius = 0.35;
  }

  (segments = 32), (rotation = 6);

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
  camera.position.z = 1.5;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);

  var sphere = createSphere(radius, segments);
  sphere.rotation.y = rotation;
  scene.add(sphere);

  var clouds = createClouds(radius, segments);
  clouds.rotation.y = rotation;
  scene.add(clouds);

  var stars = createStars(90, 64);
  scene.add(stars);

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  var lightFront = new THREE.SpotLight(0xffffff, 0.75);
  lightFront.position.set(0, 0, 1000);
  scene.add(lightFront);

  var lightBehind = new THREE.SpotLight(0xffffff, 0.75);
  lightBehind.position.set(0, 0, -1000);
  scene.add(lightBehind);

  var lightTop = new THREE.SpotLight(0xffffff, 0.75);
  lightTop.position.set(0, 1000, 0);
  scene.add(lightTop);

  var lightBottom = new THREE.SpotLight(0xffffff, 0.75);
  lightBottom.position.set(0, 1000, 0);
  scene.add(lightBottom);

  var lightRight = new THREE.SpotLight(0xffffff, 0.75);
  lightRight.position.set(1000, 0, 0);
  scene.add(lightRight);

  var lightLeft = new THREE.SpotLight(0xffffff, 0.75);
  lightLeft.position.set(1000, 0, 0);
  scene.add(lightLeft);

  var controls = new THREE.TrackballControls(camera);

  webglEl.appendChild(renderer.domElement);

  render();

  function render() {
    controls.update();
    sphere.rotation.y -= 0.0018;
    clouds.rotation.y -= 0.0018;
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  function createSphere(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/countdown2.svg'),
        // bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
        bumpScale: 0.02,
        // specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
        // specular: new THREE.Color('grey'),
      })
    );
  }

  function createClouds(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.003, segments, segments),
      new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('images/Clouds3.png'),
        transparent: true,
      })
    );
  }

  function createStars(radius, segments) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, segments),
      new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
        side: THREE.BackSide,
      })
    );
  }
})();
