const cube = document.getElementById("cube");
const scene = document.querySelector(".scene");

let positionX = 0;
let positionY = 0;
let scaleFactor = 1;
let rotation = 30;

const sceneWidth = scene.offsetWidth;
const sceneHeight = scene.offsetHeight;
const cubeWidth = 100; // Размер куба (ширина)
const cubeHeight = 100; // Размер куба (высота)

function drawCube() {
    cube.style.transform = `translate(${positionX}px, ${positionY}px) scale(${scaleFactor}) rotateX(30deg) rotateY(${rotation}deg)`;
}

function moveCube(dx, dy) {

    let newX = positionX + dx;
    let newY = positionY + dy;


    const maxX = (sceneWidth - cubeWidth * scaleFactor) / 2;
    const maxY = (sceneHeight - cubeHeight * scaleFactor) / 2;

    if (newX < -maxX) newX = -maxX;
    if (newX > maxX) newX = maxX;
    if (newY < -maxY) newY = -maxY;
    if (newY > maxY) newY = maxY;


    positionX = newX;
    positionY = newY;

    drawCube();
}

function scaleCube(factor) {
    scaleFactor *= factor;

    moveCube(0, 0);
    drawCube();
}

function rotateCube(deg) {
    rotation += deg;
    drawCube();
}

drawCube();