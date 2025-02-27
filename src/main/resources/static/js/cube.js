const cube = document.getElementById("cube");

let positionX = 0;
let positionY = 0;
let scaleFactor = 1;
let rotation = 30;
let colors = ["red", "green", "blue", "yellow", "purple", "cyan", "orange"];

function drawCube() {
    cube.style.transform = `translate(${positionX}px, ${positionY}px) scale(${scaleFactor}) rotateX(30deg) rotateY(${rotation}deg)`;
}

function moveCube(dx, dy) {
    positionX += dx;
    positionY += dy;
    drawCube();
}

function scaleCube(factor) {
    scaleFactor *= factor;
    drawCube();
}

function rotateCube(deg) {
    rotation += deg;
    drawCube();
}

function changeColor() {
    let faces = document.querySelectorAll(".face");
    let newColor = colors[Math.floor(Math.random() * colors.length)];
    faces.forEach(face => face.style.background = newColor);
}

drawCube();
