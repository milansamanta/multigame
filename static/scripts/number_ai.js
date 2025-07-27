const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
resize_canvas(canvas);
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
let isDrawing = false;


canvas.addEventListener('mousedown', (e) => {
    
    ctx.lineWidth = canvas.clientWidth / 10;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', (event) => {
    if (isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        console.log(ctx.strokeStyle);
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.closePath();
});

canvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

canvas.addEventListener('touchstart', (e) => {
    
    ctx.lineWidth = canvas.clientWidth / 10;
    isDrawing = true;
    const touch = e.touches[0];
    ctx.beginPath();
    ctx.moveTo(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
});

canvas.addEventListener('touchmove', (e) => {
    if (isDrawing) {
        const touch = e.touches[0];
        ctx.lineTo(touch.clientX - canvas.getBoundingClientRect().left, touch.clientY - canvas.getBoundingClientRect().top);
        ctx.stroke();
    }
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
    ctx.closePath();
});

canvas.addEventListener('touchcancel', () => {
    isDrawing = false;
});

document.querySelector('#clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

document.querySelector('#predict').addEventListener('click', () => {
    let pixels = get_image(ctx);
    document.querySelector('#result').innerHTML = `analyzing image...`;
    console.log(pixels);
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pixels: pixels})
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log(response);
            throw new Error('Network response was not ok');
        }
    }).then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            document.querySelector('#result').innerHTML = `Looks like ${data.prediction}`;
        }
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});

window.addEventListener('resize', () => {
    resize_canvas(canvas);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
});

function resize_canvas(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}


function get_image(ctx){
    const imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height, {willReadFrequently: true});
    const rows = imagedata.width;
    const cols = imagedata.height;
    const data = imagedata.data;
    pixels = Array.from({length: rows}, () => Array(cols).fill(0.0));

    for (let i = 0; i < data.length; i += 4){
        const row = Math.floor((i/4)/rows);
        const col = Math.floor((i/4)%cols);
        pixels[row][col] = (255 - data[i]) / 255;
    }

    return pixels;
}