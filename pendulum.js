// JavaScript code for responsive canvas
const canvas = document.getElementById('pendulum-canvas');
const ctx = canvas.getContext('2d');

var simulationActive = false;
var pendulumAngle = document.getElementById("angle_input").value;
var angularVelocity = 0; // intial value for angular velocity
var time = 0; // seconds
const timestep = 0.005; // seconds, keeping this constant
var scatterPlotData = {};
let simNum = 0;

const defaultColors = ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78"];
const nColors = defaultColors.length;
let plotDataSets = [{ label: "Sim 1", data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true }];

// Get the canvas element and create a Chart.js chart
const plottingCanvas = document.getElementById('plotting-canvas').getContext('2d');

let angleChart = new Chart(plottingCanvas, {
    type: 'scatter',
    data: {
        datasets: plotDataSets,
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)',
                    align: 'center'
                },
                grid: {
                    display: false
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Angle (degrees)',
                    align: 'center'
                }
            }
        }
    }
});

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

    let playButton = new Path2D();
    playButton.strokeStyle = "#297511";
    playButton.moveTo(startingX + padButtons, startingY + padButtons);
    playButton.lineTo(startingX + padButtons, startingY + padButtons + buttonHeight);
    playButton.lineTo(startingX + padButtons + buttonHeight / 2.0, startingY + padButtons + buttonHeight / 2.0);
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
            simulationActive = true;
            ctx.fillStyle = "#767676";
            ctx.fill(playButton);
            ctx.fillStyle = "#8C8303";
            ctx.fill(stopButton);
            scatterPlotData = [{ x: time, y: pendulumAngle }];
            simulatePendulum();
        }
    })

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
            document.getElementById("angle_input").value = pendulumAngle;
            document.getElementById("angleDisplayedValue").textContent = document.getElementById("angle_input").value;
            if (time > 0) {
                simNum++;
                scatterPlotData = [];
                plotDataSets.push({ label: "Sim " + (simNum + 1).toString(), data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true });
            }
            angularVelocity = 0; // intial value for angular velocity
            time = 0; // seconds

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

    let specifiedAngleRads = pendulumAngle * (Math.PI / 180)

    // set pixels per 1 m specified for length
    let lengthScale = 400;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#767676";
    ctx.moveTo(anchorMiddleX, anchorMiddleY);
    // Calculate endpoint of line based on angle specified
    let lineX = (lengthScale * specifiedLength) * Math.sin(specifiedAngleRads);
    let lineY = (lengthScale * specifiedLength) * Math.cos(specifiedAngleRads);
    ctx.lineTo(anchorMiddleX + lineX, anchorMiddleY + lineY);
    ctx.stroke();

    // draw pendulum mass
    let specifiedMass = document.getElementById("mass_input").value;
    // scale radius to mass 
    let scaleMassRadius = 50; // 50 px for 1 kg mass
    let pendulumMassRadius = scaleMassRadius * specifiedMass;


    let pendulumMass = new Path2D();
    ctx.fillStyle = "#C2462E";
    let centerX = anchorMiddleX + lineX + pendulumMassRadius * Math.sin(specifiedAngleRads);
    let centerY = anchorMiddleY + lineY + pendulumMassRadius * Math.cos(specifiedAngleRads);

    pendulumMass.arc(centerX, centerY, pendulumMassRadius, 0, 2 * Math.PI);
    ctx.fill(pendulumMass);

    let isDragging = false;

    // Add listener for dragging the pendulum mass to a different angle
    canvas.addEventListener("mousedown", (event) => {
        // Check whether point inside pendulum mass
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) * canvas.width / rect.width;
        const y = (event.clientY - rect.top) * canvas.height / rect.height;
        const isPointInMass = ctx.isPointInPath(pendulumMass, x, y);

        if (isPointInMass) {
            isDragging = true;
            simulationActive = false;
            if (time > 0) {
                simNum++;
                scatterPlotData = [];
                plotDataSets.push({ label: "Sim " + (simNum + 1).toString(), data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true });
            }
            angularVelocity = 0; // intial value for angular velocity
            time = 0; // seconds
        }
    })

    canvas.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * canvas.width / rect.width;
            const y = (event.clientY - rect.top) * canvas.height / rect.height;
            pendulumAngle = Math.round(Math.atan((x - anchorMiddleX) / (y - anchorMiddleY)) * (180 / Math.PI));
            let diffX = x - anchorMiddleX;
            let diffY = y - anchorMiddleY;
            document.getElementById("angle_input").value = pendulumAngle;
            document.getElementById("angleDisplayedValue").textContent = document.getElementById("angle_input").value;
        }
    })

    canvas.addEventListener("mouseup", (event) => {
        if (isDragging) {
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * canvas.width / rect.width;
            const y = (event.clientY - rect.top) * canvas.height / rect.height;
            pendulumAngle = Math.round(Math.atan((x - anchorMiddleX) / (y - anchorMiddleY)) * (180 / Math.PI));
            let diffX = x - anchorMiddleX;
            let diffY = y - anchorMiddleY;
            document.getElementById("angle_input").value = pendulumAngle;
            document.getElementById("angleDisplayedValue").textContent = document.getElementById("angle_input").value;
            isDragging = false;
            updatePendulumCanvas()
        }
    })
}
function smallAngleApproxSim() {
    time = time + timestep;
    // Using small angle approximation (only really valid for small angles) - acts as a simple harmonic oscillator
    let gravValue = document.getElementById("gravity_input").value;
    let length = document.getElementById("length_input").value;
    let frictionFactor = document.getElementById("friction_input").value;
    let mass = document.getElementById("mass_input").value;
    let specifiedAngle = document.getElementById("angle_input").value;
    let omega = Math.sqrt(gravValue / length);
    // using initial conditions of at t = 0, initial angle is specifiedAngle, and angular velocity is 0
    if (frictionFactor == 0) {
        pendulumAngle = specifiedAngle * Math.cos(omega * time);
    }
    else {
        // adding a term for friction where the frictionFactor is multiplied by angular velocity to get the torque related to friction
        let p = frictionFactor / (mass * length ** 2);
        let q = gravValue / length;
        let discriminant = p ** 2 - 4 * q;
        if (discriminant > 0) {
            // two real roots
            let r1 = (-p + Math.sqrt(discriminant)) / 2.0;
            let r2 = (-p - Math.sqrt(discriminant)) / 2.0;
            let A = specifiedAngle / (1 - (r1 / r2));
            let B = (-A * r1) / r2;
            pendulumAngle = A * Math.exp(r1 * time) + B * Math.exp(r2 * time);
            console.log("with friction discriminant > 0, time: ", time, "pendulumAngle: ", pendulumAngle);
        }
        else if (discriminant < 0) {
            // two complex roots (r1 = v + wi, r2 = v - wi)
            let v = -p / 2.0;
            let w = Math.sqrt(-1 * discriminant) / 2.0;
            console.log("v: ", v, "w: ", w);
            pendulumAngle = Math.exp(v * time) * (specifiedAngle * Math.cos(w * time) - (v * specifiedAngle / w) * Math.sin(w * time));
            console.log("with friction discriminant < 0, time: ", time, "pendulumAngle: ", pendulumAngle);
        }
        else {
            // equal to zero, one real root
            let r = -p / 2.0;
            let A = specifiedAngle;
            let B = -A * r;
            pendulumAngle = A * Math.exp(r * time) + B * time * Math.exp(r * time);
            console.log("with friction discriminant == 0, time: ", time, "pendulumAngle: ", pendulumAngle);
        }
    }
    scatterPlotData.push({ x: time.toFixed(2), y: pendulumAngle });
    // Update the chart with new data
    angleChart.data.datasets[simNum].data = scatterPlotData;
    // Update the chart
    angleChart.update();
    requestAnimationFrame(updatePendulumCanvas);
}

function rungeKuttaSim() {
    let g = document.getElementById("gravity_input").value;
    let L = document.getElementById("length_input").value;
    let frictionFactor = document.getElementById("friction_input").value;
    let mass = document.getElementById("mass_input").value;
    let h = timestep;
    let omega = angularVelocity;
    let theta = pendulumAngle * (Math.PI / 180);


    // Calculate the four RK4 increments
    const k1_theta = h * omega;
    const k1_omega = h * (-(g / L) * Math.sin(theta) - (frictionFactor * omega / (mass * L ** 2)));

    const k2_theta = h * (omega + 0.5 * k1_omega);
    const k2_omega = h * (-(g / L) * Math.sin(theta + 0.5 * k1_theta) - (frictionFactor * (omega + 0.5 * k1_omega) / (mass * L ** 2)));

    const k3_theta = h * (omega + 0.5 * k2_omega);
    const k3_omega = h * (-(g / L) * Math.sin(theta + 0.5 * k2_theta) - (frictionFactor * (omega + 0.5 * k2_omega) / (mass * L ** 2)));

    const k4_theta = h * (omega + k3_omega);
    const k4_omega = h * (-(g / L) * Math.sin(theta + k3_theta) - (frictionFactor * (omega + k3_omega) / (mass * L ** 2)));

    // Update theta and omega using the weighted average of the increments
    theta = theta + (k1_theta + 2 * k2_theta + 2 * k3_theta + k4_theta) / 6;
    omega = omega + (k1_omega + 2 * k2_omega + 2 * k3_omega + k4_omega) / 6;
    angularVelocity = omega;
    pendulumAngle = theta * (180 / Math.PI);
    time = time + timestep;

    scatterPlotData.push({ x: time.toFixed(2), y: pendulumAngle });

    // Update the chart with new data
    angleChart.data.datasets[simNum].data = scatterPlotData;
    // Update the chart
    angleChart.update();
    requestAnimationFrame(updatePendulumCanvas)
}

function simulatePendulum() {
    var solver = document.getElementById("solverSelect").value;
    if (solver == "small_angle_approx") {
        smallAngleApproxSim();
    }
    else if (solver == "runge_kutta") {
        rungeKuttaSim();
    }
    else {
        console.log("unknown solver")
        alert("Unknown solver")
    }
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
        if (time > 0) {
            simNum++;
            scatterPlotData = [];
            plotDataSets.push({ label: "Sim " + (simNum + 1).toString(), data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true });
        }
        time = 0;
        angularVelocity = 0;
    });
});

document.getElementById("solverSelect").addEventListener('input', function () {
    simulationActive = false;
    if (time > 0) {
        simNum++;
        scatterPlotData = [];
        plotDataSets.push({ label: "Sim " + (simNum + 1).toString(), data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true });
    }
    time = 0;
    angularVelocity = 0;
    updatePendulumCanvas()
})

updatePendulumCanvas()

document.getElementById("clearButton").addEventListener("click", clearPlot);

function clearPlot() {
    simNum = 0;
    angleChart.data.datasets = [{ label: "Sim 1", data: scatterPlotData, borderColor: defaultColors[simNum % nColors], backgroundColor: defaultColors[simNum % nColors], pointRadius: 3, showLine: true }];
    angleChart.update();

}


