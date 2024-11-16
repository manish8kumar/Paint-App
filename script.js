// Canvas and context properties
let canvas, context, canvasImage, bgColor;

// Circle properties
let circles = [];
let circleCount = 0;
let color, radius;

// Dragging properties
let dragging = { draw: false, move: false };
let dragIndex = { delete: -1, move: -1 };
let dragStartLocation, dragX, dragY;

// Mouse position
let mouse = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let temp = { x: 0, y: 0 };
let distance = { dx: 0, dy: 0 };

// Flags
let flag = false;

window.addEventListener('load', init, false);

// Resize canvas based on the window size (called on: load, resize)
window.onload = window.onresize = function () {
    var canvas = document.querySelector('.canvas');
    canvas.width = window.innerWidth * 0.6;
    canvas.height = window.innerHeight * 0.8;
    drawCircles();
};

// Initialize global variables (called on: load of window)
function init() {
    canvas = document.querySelector('.canvas');
    context = canvas.getContext('2d');
    context.lineWidth = 4;
    context.lineCap = 'round';

    circleCount = 0;
    dragging.draw = false;
    bgColor = "#000000";
    circles = [];

    // Event listeners to draw circles
    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);

    // Event listener to delete circle
    canvas.addEventListener('dblclick', deleteCircle, false);

    // Event listener for "Hit or Miss"
    canvas.addEventListener('click', detectHitOrMiss, false);

    // Clear canvas button event listener
    document.querySelector('.btnClear').addEventListener('click', clearCanvas);
}

// Drawing of circles with random colors
function dragStart(e) {
    dragging.draw = true;
    dragStartLocation = getCanvasCoordinates(e);
    color = generateRandomColor();
    getImage();
}
function generateRandomColor() {
    const randomValue = () => Math.floor(Math.random() * 255);
    return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`;
}

function drag(e) {
    var position;
    if (dragging.draw === true) {
        putImage();
        position = getCanvasCoordinates(e);
        drawCircle(position);
        context.fillStyle = color;
        context.fill();
    }
}

function dragStop(e) {
    dragging.draw = false;
    putImage();
    var position = getCanvasCoordinates(e);
    drawCircle(position);
    context.fillStyle = color;
    context.fill();
    circleCount = circleCount + 1;
    tempCircle = { x: temp.x, y: temp.y, rad: radius, color: color };

    circles.push(tempCircle);
}

function getCanvasCoordinates(e) {
    var x = e.clientX - canvas.getBoundingClientRect().left,
        y = e.clientY - canvas.getBoundingClientRect().top;

    return { x: x, y: y };
}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

function drawCircle(position) {
    temp.x = dragStartLocation.x;
    temp.y = dragStartLocation.y;

    radius = Math.sqrt(Math.pow((temp.x - position.x), 2) + Math.pow((temp.y - position.y), 2));
    context.beginPath();
    context.arc(temp.x, temp.y, radius, 0, 2 * Math.PI, false);
    context.closePath();
}

// On click of Erase Button
function clearCanvas() {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    circles = [];
    circleCount = 0;
}


function drawCircles() {
    var i, x, y, rad, color;

    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (i = 0; i < circleCount; i++) {
        rad = circles[i].rad;
        x = circles[i].x;
        y = circles[i].y;
        color = circles[i].color;
        context.beginPath();
        context.arc(x, y, rad, 0, 2 * Math.PI, false);
        context.closePath();
        context.fillStyle = color;
        context.fill();
    }
}

// Double-click to delete the circles
function deleteCircle(e) {
    let { x, y } = getMousePosition(e);

    // To find which circle was clicked
    for (i = 0; i < circleCount; i++) {
        if (isCircleClicked(circles[i], x, y)) {
            dragIndexDelete = i;
        }
    }

    // Remove the circle from the array
    if (dragIndexDelete > -1) {
        circles.splice(dragIndexDelete, 1)[0];
        circleCount = circleCount - 1;
    }

    drawCircles();
}

// To check whether the circle was clicked
function isCircleClicked(shape, mx, my) {
    var dx = mx - shape.x;
    var dy = my - shape.y;
    return dx * dx + dy * dy < shape.rad * shape.rad;
}

function getMousePosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

// Hit or Miss Function
function detectHitOrMiss(e) {
	if (circleCount === 0) {
        return;
    }
    const { x, y } = getMousePosition(e);
    const isHit = circles.some((circle) => isCircleClicked(circle, x, y));
    showHitOrMiss(isHit, x, y);
}

// Display "Hit" or "Miss" directly on the canvas
function showHitOrMiss(isHit, x, y) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles(); // Redraw circles to maintain the display
    context.font = "16px Arial";
    context.fillStyle = isHit ? "yellow" : "white";
    context.fillText(isHit ? "Hit" : "Miss", x, y);
}
