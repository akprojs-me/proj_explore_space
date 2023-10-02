// JavaScript code for responsive canvas
const canvas = document.getElementById('pendulum-canvas');
const ctx = canvas.getContext('2d');

var simulationActive = false;

// Draw out the state of the pendulum
function drawCanvas() {
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
    ctx.strokeRect(startingX, startingY, buttonsWidth, buttonsHeight);
    console.log("startingX: ", startingX);
    console.log("startingY: ", startingY);
    console.log("canvas width: ", canvas.width)
    console.log("canvas height: ", canvas.height)

    ctx.strokeStyle = "#297511";
    ctx.beginPath();
    ctx.moveTo(startingX + padButtons, startingY + padButtons);
    ctx.lineTo(startingX + padButtons, startingY + padButtons + buttonHeight);
    ctx.lineTo(startingX + padButtons + buttonHeight / 2.0, startingY + padButtons + buttonHeight / 2.0);
    console.log("triangle point 1: ", startingX + padButtons, startingY + padButtons);
    console.log("triangle point 2: ", startingX + padButtons, startingY + padButtons + buttonHeight);
    console.log("triangle point 3: ", startingX + padButtons + buttonHeight / 2.0, startingY + padButtons + buttonHeight / 2.0);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "#92D050";
    if (simulationActive) {
        ctx.fillStyle = "#767676";
    }
    ctx.fill();
    ctx.fillStyle = "#8C8303";
    if (!simulationActive) {
        ctx.fillStyle = "#767676";
    }
    ctx.fillRect(startingX + buttonsWidth / 2 + padButtons, startingY + padButtons, buttonHeight, buttonHeight);
    drawPendulum();
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
    let specifiedAngle = document.getElementById("angle_input").value;
    console.log("specifiedAngle", specifiedAngle);
    let specifiedAngleRads = specifiedAngle * (Math.PI / 180)
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

// JavaScript code to display the selected value for each control
const sliders = document.querySelectorAll('input[type="range"]');
const selectedValues = document.querySelectorAll('.selectedValue');

sliders.forEach((slider, index) => {
    selectedValues[index].textContent = slider.value;
    slider.addEventListener('input', function () {
        selectedValues[index].textContent = slider.value;
        drawCanvas();
    });
});

drawCanvas()

