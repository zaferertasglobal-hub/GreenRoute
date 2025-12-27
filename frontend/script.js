const canvas = document.getElementById('cityCanvas');
const ctx = canvas.getContext('2d');


async function setWeather(state) {
    let factor = (state === 'Snowy') ? 5.0 : 1.0; // Roads are 5 times slower if it snows

    // Let's send a request to the backend to update the traffic on all roads
    // (For example, let's affect the road between Junction-A and Target-Customer)
    const response = await fetch(`http://127.0.0.1:8080/update_traffic?start=Junction-A&end=Target-Customer&factor=${factor}`, {
        method: 'POST'
    });

    if (response.ok) {
        document.getElementById('weather-status').innerText = "Weather Condition: " + state;
        // Recalculate and redraw the route when the weather changes
        startSimulation();

    }
}


async function startSimulation() {
    document.getElementById('status').innerText = "Status: Calculating route...";


    try {
        const response = await fetch('http://127.0.0.1:8080/calculate_route/Vehicle-01?battery=20');
        const data = await response.json();

        if (data.path) {
            drawPath(data.path);
            document.getElementById('status').innerText = "Status: Route Found!";
        }
    } catch (error) {
        document.getElementById('status').innerText = "Error: Could not connect to the server!";
    }
}

function drawPath(path) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;

    // Simple coordinate mapping (based on X,Y values ​​in the Backend)
    // Simple points representing city nodes
    const coords = {
        "Ware_House": [50, 350],
        "Intersection-A": [150, 200],
        "Charge-1": [300, 100],
        "Destination-Customer": [550, 50]
    };

    path.forEach((node, index) => {
        const [x, y] = coords[node];
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        //Draw nodes
        ctx.fillStyle = "red";
        ctx.fillRect(x - 5, y - 5, 10, 10);
    });

    ctx.stroke();
}
