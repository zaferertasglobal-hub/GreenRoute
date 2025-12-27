/**
* GreenRoute - Frontend Final Script
* This file communicates with the Backend (8080) in Docker. */

const canvas = document.getElementById('cityCanvas');
const ctx = canvas.getContext('2d');

// X, Y coordinate mappings of nodes in the Backend on the map
const coords = {
    "Warehouse": [50, 350],
    "Intersection-A": [150, 200],
    "Charge-1": [300, 100],
    "Destination-Customer": [550, 50]
};

/**
* Starts the simulation and retrieves route data from the Backend
*/
async function startSimulation() {
    const statusText = document.getElementById('status');
    statusText.innerText = "Status: Calculating route...";
    statusText.style.color = "#2980b9";

    // API address on Docker (Port 8080)
    const apiUrl = 'http://127.0.0.1:8080/calculate_route/Vehicle-01?battery=25';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Backend error!");

        const data = await response.json();

        if (data.path && data.path.length > 0) {
            drawMap(data.path, data.cost);
            statusText.innerText = `Status: Route found! (Cost: ${data.cost})`;
            statusText.style.color = "#27ae60";
        } else {
            statusText.innerText = "Status: No suitable route found!";
            statusText.style.color = "#c0392b";
        }
    } catch (error) {
        console.error("Error:", error);
        statusText.innerText = "Error: Backend service unreachable!";
        statusText.style.color = "#c0392b";
    }
}

/**
* Updates weather and affects traffic
*/
async function setWeather(state) {
    let factor = (state === 'Snowy') ? 5.0 : 1.0;
    const weatherStatus = document.getElementById('weather-status');

    try {
        // Send traffic update request to backend
        const response = await fetch(`http://127.0.0.1:8080/update_traffic?start=Intersection-A&end=Target-Customer&factor=${factor}`, {
            method: 'POST'
        });
        if (response.ok) {
            weatherStatus.innerText = "Weather: " + state;
            weatherStatus.style.color = (state === 'Snowy') ? "#3498db" : "#f1c40f";
            // Automatically refresh route when weather changes
            startSimulation();
        }
    } catch (error) {
        console.error("Could not update weather:", error);
    }
}

/**
* Draws the map and route on the canvas
*/
function drawMap(path, cost) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw all connections (paths) in gray
    drawAllConnections();

    // 2. Draw the calculated route in green
    ctx.beginPath();
    ctx.strokeStyle = "#27ae60";
    ctx.lineWidth = 6;
    ctx.setLineDash([]); // Straight line

    path.forEach((node, index) => {
        const [x, y] = coords[node];
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 3. Draw the nodes (city points)
    for (let nodeName in coords) {
        const [x, y] = coords[nodeName];

        // Charging station?
        ctx.fillStyle = nodeName.includes("Charging") ? "#e67e22" : "#2c3e50";
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Write the labels
        ctx.fillStyle = "#333";
        ctx.font = "bold 12px Arial";
        ctx.fillText(nodeName, x + 12, y + 5);
    }
}

function drawAllConnections() {
    ctx.beginPath();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line


    const links = [
        ["Ware_House", "Junction_A"],
        ["Junction_A", "Charge_Station1"],
        ["Charge_Station1", "Target-Customer"],
        ["Junction-A", "Target_Customer"]
    ];

    links.forEach(link => {
        const [start, end] = link;
        ctx.moveTo(coords[start][0], coords[start][1]);
        ctx.lineTo(coords[end][0], coords[end][1]);
    });
    ctx.stroke();
}
