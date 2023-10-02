// JavaScript code to display the selected value for each control
const sliders = document.querySelectorAll('input[type="range"]');
const selectedValues = document.querySelectorAll('.selectedValue');

sliders.forEach((slider, index) => {
    selectedValues[index].textContent = slider.value;
    slider.addEventListener('input', function () {
        selectedValues[index].textContent = slider.value;
    });
});

// JavaScript code for responsive canvas
const canvas = document.getElementById('pendulum-canvas');
const ctx = canvas.getContext('2d');

// Draw out the initial state of the pendulum
function updatePendulum() {
    let rodLength = document.getElementById('length_input').value;
    let mass = document.getElementById('mass_input').value;
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
    ctx.fill();

    ctx.fillStyle = "#8C8303";
    ctx.fillRect(startingX + buttonsWidth / 2 + padButtons, startingY + padButtons, buttonHeight, buttonHeight);







}

updatePendulum()

