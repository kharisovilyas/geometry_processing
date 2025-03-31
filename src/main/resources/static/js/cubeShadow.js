const cube = document.getElementById("cube");
const scene = document.querySelector(".scene");
const shadowCanvas = document.getElementById("shadowCanvas");
const gl = shadowCanvas.getContext('webgl') || shadowCanvas.getContext('experimental-webgl');

let positionX = 0;
let positionY = 0;
let scaleFactor = 1;
let rotation = 30;

// Установка размеров canvas
shadowCanvas.width = scene.offsetWidth;
shadowCanvas.height = scene.offsetHeight;

// Инициализация WebGL
if (!gl) {
    console.error('WebGL не поддерживается в вашем браузере');
} else {
    // Вершинный шейдер
    const vsSource = `
        attribute vec2 aPosition;
        uniform mat3 uTransform;
        void main() {
            vec3 pos = uTransform * vec3(aPosition, 1.0);
            gl_Position = vec4(pos.xy, 0.0, 1.0);
        }
    `;

    // Фрагментный шейдер
    const fsSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.3);
        }
    `;

    // Компиляция шейдеров
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);

    // Создание программы
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Позиции вершин для тени (проекция куба на плоскость)
    const vertices = new Float32Array([
        -0.5, -0.5,  // левый нижний
        0.5, -0.5,  // правый нижний
        0.5,  0.5,   // правый верхний
        -0.5,  0.5    // левый верхний
    ]);

    // Создание буфера вершин
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Указание атрибутов
    const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Получение uniform-переменной
    const uTransform = gl.getUniformLocation(shaderProgram, "uTransform");
}

function drawShadow() {
    if (!gl) return;

    // Очистка canvas
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Матрица преобразования для тени
    const transform = calculateShadowTransform();
    gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, "uTransform"), false, transform);

    // Отрисовка тени
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function calculateShadowTransform() {
    // Матрица масштабирования
    const scaleMat = [
        scaleFactor * 100, 0, 0,
        0, scaleFactor * 100, 0,
        0, 0, 1
    ];

    // Матрица поворота (только по Y, так как тень на плоскости)
    const rad = rotation * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const rotateMat = [
        cos, -sin, 0,
        sin, cos, 0,
        0, 0, 1
    ];

    // Матрица переноса
    const translateMat = [
        1, 0, positionX + scene.offsetWidth / 2,
        0, 1, positionY + scene.offsetHeight / 2,
        0, 0, 1
    ];

    // Комбинирование матриц: translate * rotate * scale
    const transform = multiplyMatrices(translateMat, multiplyMatrices(rotateMat, scaleMat));
    return transform;
}

function multiplyMatrices(a, b) {
    return [
        a[0]*b[0] + a[1]*b[3] + a[2]*b[6], a[0]*b[1] + a[1]*b[4] + a[2]*b[7], a[0]*b[2] + a[1]*b[5] + a[2]*b[8],
        a[3]*b[0] + a[4]*b[3] + a[5]*b[6], a[3]*b[1] + a[4]*b[4] + a[5]*b[7], a[3]*b[2] + a[4]*b[5] + a[5]*b[8],
        a[6]*b[0] + a[7]*b[3] + a[8]*b[6], a[6]*b[1] + a[7]*b[4] + a[8]*b[7], a[6]*b[2] + a[7]*b[5] + a[8]*b[8]
    ];
}

const sceneWidth = scene.offsetWidth;
const sceneHeight = scene.offsetHeight;
const cubeWidth = 100;
const cubeHeight = 100;

function drawCube() {
    cube.style.transform = `translate(${positionX}px, ${positionY}px) scale(${scaleFactor}) rotateX(30deg) rotateY(${rotation}deg)`;
    drawShadow();
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