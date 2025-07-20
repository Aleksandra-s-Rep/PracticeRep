async function createTable() {
    if (!validateElements()) {
        return;
    }

    resetTable();

    const response = await fetch("https://exercise.develop.maximaster.ru/service/products/");
    if (!response.ok) {
        alert("Ошибка HTTP: " + response.status);
        return;
    }

    let data = await response.json();
    data = data.map((item, index) => ({
        id: index + 1,
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price),
        sum: Number(item.price) * Number(item.quantity)
    }));

    const minPrice = getMinPrice();
    const maxPrice = getMaxPrice();

    const filteredData = data.filter(item => 
        item.price >= minPrice && item.price <= maxPrice
    );

    if (filteredData.length === 0) {
        alert('Нет данных, соответствующих фильтру');
        return;
    }

    const table = document.getElementById('productTable');
    filteredData.forEach(item => {
        const row = table.insertRow();
        row.insertCell().textContent = item.id;
        row.insertCell().textContent = item.name;
        row.insertCell().textContent = item.quantity;
        row.insertCell().textContent = item.price.toFixed(2);
        row.insertCell().textContent = item.sum.toFixed(2);
    });
}

function resetTable() {
    const table = document.getElementById('productTable');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

function getMinPrice() {
    const minInput = document.getElementById('priceFrom');
    return minInput.value === "" || minInput.value === "0" ? -1 : Number(minInput.value);
}

function getMaxPrice() {
    const maxInput = document.getElementById('priceTo');
    return maxInput.value === "" || maxInput.value === "0" ? Number.POSITIVE_INFINITY : Number(maxInput.value);
}

function validateElements() {
    const elements = ['priceFrom', 'priceTo', 'productTable'];
    const missing = elements.some(id => !document.getElementById(id));
    if (missing) {
        console.error('Ошибка: отсутствуют элементы DOM');
        return false;
    }
    return true;
}