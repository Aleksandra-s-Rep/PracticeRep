function getRandomColor() {
    const randomNum = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomNum.padStart(6, '0');
}

function updateSquare() {
    if (!validateElements() || !validateInputs()) {
        return;
    }

    const square = document.getElementById('square');
    const width = document.getElementById('widthInput').value;
    const height = document.getElementById('heightInput').value;

    square.style.width = width + 'px';
    square.style.height = height + 'px';
    square.style.backgroundColor = getRandomColor();
}

function validateElements() {
    const elements = ['widthInput', 'heightInput', 'square'];
    const missing = elements.filter(id => !document.getElementById(id));
    if (missing.length > 0) {
        console.error(`Missing elements: ${missing.join(', ')}`);
        return false;
    }
    return true;
}

function validateInputs() {
    const width = document.getElementById('widthInput').value;
    const height = document.getElementById('heightInput').value;

    if ((/^\d+$/.test(width) && /^\d+$/.test(height)) || (width === '' || height === '')) {
        return true;
    }

    console.error('Invalid input values');
    return false;
}
