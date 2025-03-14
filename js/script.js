// script.js

let scene, camera, renderer;
let cube;
let obstacles = [];
let score = 0;
let gameOver = false;
let obstacleSpawnInterval;

const CUBE_SIZE = 1;
const OBSTACLE_SIZE = 2;
const MOVE_SPEED = 0.1;
const OBSTACLE_SPEED = 0.05;
const OBSTACLE_SPAWN_RATE = 2;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const cubeGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onKeyDown);

    obstacleSpawnInterval = setInterval(spawnObstacle, OBSTACLE_SPAWN_RATE * 1000);

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        cube.position.x -= MOVE_SPEED;
    } else if (event.key === 'ArrowRight') {
        cube.position.x += MOVE_SPEED;
    }
    cube.position.x = Math.max(-5, Math.min(5, cube.position.x));
}

function spawnObstacle() {
    if (gameOver) return;

    const obstacleGeometry = new THREE.BoxGeometry(OBSTACLE_SIZE, OBSTACLE_SIZE, OBSTACLE_SIZE);
    const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);

    obstacle.position.x = (Math.random() - 0.5) * 10;
    obstacle.position.z = -20;

    obstacles.push(obstacle);
    scene.add(obstacle);
}

function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].position.z += OBSTACLE_SPEED;

        if (obstacles[i].position.z > 10) {
            scene.remove(obstacles[i]);
            obstacles.splice(i, 1);
            i--;
            score++;
        }
    }
}

function checkCollisions() {
    for (let i = 0; i < obstacles.length; i++) {
        const distance = cube.position.distanceTo(obstacles[i].position);
        if (distance < (CUBE_SIZE + OBSTACLE_SIZE) / 2) {
            gameOver = true;
            document.getElementById("finalScore").textContent = score;
            document.getElementById("gameOverScreen").style.display = "block";
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        updateObstacles();
        checkCollisions();
        document.getElementById("currentScore").textContent = score;
    }

    renderer.render(scene, camera);
}

function restartGame() {
    gameOver = false;
    document.getElementById("gameOverScreen").style.display = "none";

    score = 0;
    cube.position.set(0, 0, 0);

    for (let i = 0; i < obstacles.length; i++) {
        scene.remove(obstacles[i]);
    }
    obstacles = [];

    clearInterval(obstacleSpawnInterval);
    obstacleSpawnInterval = setInterval(spawnObstacle, OBSTACLE_SPAWN_RATE * 1000);

    animate();
}

init();