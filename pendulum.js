// JavaScript code for responsive canvas
const canvas = document.getElementById('pendulum-canvas');
const ctx = canvas.getContext('2d');

var simulationActive = false;
var pendulumAngle = document.getElementById("angle_input").value;
var time = 0; // seconds

// Draw out the state of the pendulum
function updatePendulumCanvas() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Play and Stop Buttons
    let buttonsWidth = 200;
    let buttonsHeight = 100;
    let startingX = canvas.width / 2 - buttonsWidth / 2;

    let padButtons = 20;
    let startingY = canvas.height - buttonsHeight - padButtons;
    let buttonHeight = buttonsHeight - 2 * padButtons;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(startingX, startingY, buttonsWidth, buttonsHeight);
    console.log("startingX: ", startingX);
    console.log("startingY: ", startingY);
    console.log("canvas width: ", canvas.width)
    console.log("canvas height: ", canvas.height)

    let playButton = new Path2D();
    playButton.strokeStyle = "#297511";
    playButton.moveTo(startingX + padButtons, startingY + padButtons);
    playButton.lineTo(startingX + padButtons, startingY + padButtons + buttonHeight);
    playButton.lineTo(startingX + padButtons + buttonHeight / 2.0, startingY + padButtons + buttonHeight / 2.0);
    console.log("triangle point 1: ", startingX + padButtons, startingY + padButtons);
    console.log("triangle point 2: ", startingX + padButtons, startingY + padButtons + buttonHeight);
    console.log("triangle point 3: ", startingX + padButtons + buttonHeight / 2.0, startingY + padButtons + buttonHeight / 2.0);
    playButton.closePath();
    ctx.stroke(playButton);

    ctx.fillStyle = "#92D050";
    if (simulationActive) {
        ctx.fillStyle = "#767676";
    }
    ctx.fill(playButton);

    let stopButton = new Path2D();
    ctx.fillStyle = "#8C8303";
    if (!simulationActive) {
        ctx.fillStyle = "#767676";
    }
    stopButton.rect(startingX + buttonsWidth / 2 + padButtons, startingY + padButtons, buttonHeight, buttonHeight);
    ctx.fill(stopButton);

    console.log("simulationActive at end of function", simulationActive)
    drawPendulum();
    if (simulationActive) {
        simulatePendulum();
    }

    // Add listener for play button click
    canvas.addEventListener("click", (event) => {
        // Check whether point inside play button
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * canvas.width / rect.width;
        const y = (event.clientY - rect.top) * canvas.height / rect.height;
        const isPointInPlay = ctx.isPointInPath(playButton, x, y);
        if (isPointInPlay && !simulationActive) {
            console.log("setting simulation active to true")
            simulationActive = true;
            console.log("simulationActive", simulationActive);
            ctx.fillStyle = "#767676";
            ctx.fill(playButton);
            ctx.fillStyle = "#8C8303";
            ctx.fill(stopButton);
            simulatePendulum();
        }
    })

    console.log("outside first event listener");
    // Add listener for stop button click
    canvas.addEventListener("click", (event) => {
        // Check whether point inside stop button
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * canvas.width / rect.width;
        const y = (event.clientY - rect.top) * canvas.height / rect.height;
        const isPointInStop = ctx.isPointInPath(stopButton, x, y);
        if (isPointInStop && simulationActive) {
            simulationActive = false;
            ctx.fillStyle = "#767676";
            ctx.fill(stopButton);
            ctx.fillStyle = "#92D050";
            ctx.fill(playButton);
        }
    })
}


function drawPendulum() {
    ctx.fillStyle = "#8C8303";
    let anchorWidth = 100;
    let anchorHeight = 30;
    let anchorMiddleX = canvas.width / 2.0 - anchorWidth / 2.0 + anchorWidth / 2.0;
    let anchorMiddleY = anchorHeight + anchorHeight;

    // angle background graphic
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#9DC3E6";

    ctx.moveTo(anchorMiddleX - anchorWidth, anchorMiddleY - anchorHeight / 2.0);
    ctx.lineTo(anchorMiddleX + anchorWidth, anchorMiddleY - anchorHeight / 2.0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(anchorMiddleX, anchorMiddleY - anchorHeight / 2.0, anchorWidth, 0, Math.PI);
    ctx.stroke();

    // anchor
    ctx.fillRect(canvas.width / 2.0 - anchorWidth / 2.0, anchorHeight, anchorWidth, anchorHeight);

    let specifiedLength = document.getElementById("length_input").value;
    console.log("specifiedLength", specifiedLength);

    let specifiedAngleRads = pendulumAngle * (Math.PI / 180)
    console.log("specifiedAngleRads", specifiedAngleRads);

    // set pixels per 1 m specified for length
    let lengthScale = 400;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#767676";
    ctx.moveTo(anchorMiddleX, anchorMiddleY);
    // Calculate endpoint of line based on angle specified
    let lineX = (lengthScale * specifiedLength) * Math.sin(specifiedAngleRads);
    let lineY = (lengthScale * specifiedLength) * Math.cos(specifiedAngleRads);
    console.log("line to ", anchorMiddleX + lineX, anchorMiddleY + lineY);
    ctx.lineTo(anchorMiddleX + lineX, anchorMiddleY + lineY);
    ctx.stroke();

    // draw pendulum mass
    let specifiedMass = document.getElementById("mass_input").value;
    // scale radius to mass 
    let scaleMassRadius = 50; // 50 px for 1 kg mass
    let pendulumMassRadius = scaleMassRadius * specifiedMass;


    ctx.fillStyle = "#C2462E";
    let centerX = anchorMiddleX + lineX + pendulumMassRadius * Math.sin(specifiedAngleRads);
    let centerY = anchorMiddleY + lineY + pendulumMassRadius * Math.cos(specifiedAngleRads);
    ctx.beginPath();
    ctx.arc(centerX, centerY, pendulumMassRadius, 0, 2 * Math.PI);
    console.log("centerX", centerX, "centerY", centerY);
    console.log("pendulumMassRadius", pendulumMassRadius);
    ctx.fill();
    console.log("fill of circle");
}

function simulatePendulum() {
    let timestep = 0.005; // seconds, keeping this constant
    time = time + timestep;
    // Using small angle approximation (only really valid for small angles) - acts as a simple harmonic oscillator
    let gravValue = document.getElementById("gravity_input").value;
    let length = document.getElementById("length_input").value;
    let specifiedAngle = document.getElementById("angle_input").value;
    let omega = Math.sqrt(gravValue / length);
    pendulumAngle = specifiedAngle * Math.cos(omega * time);
    console.log("in simulatePendulum pendulumAngle", pendulumAngle);
    requestAnimationFrame(updatePendulumCanvas)
}


// JavaScript code to display the selected value for each control
const sliders = document.querySelectorAll('input[type="range"]');
const selectedValues = document.querySelectorAll('.selectedValue');

sliders.forEach((slider, index) => {
    selectedValues[index].textContent = slider.value;
    slider.addEventListener('input', function () {
        selectedValues[index].textContent = slider.value;
        pendulumAngle = document.getElementById("angle_input").value;
        updatePendulumCanvas();
        simulationActive = false;
    });
});

updatePendulumCanvas()

