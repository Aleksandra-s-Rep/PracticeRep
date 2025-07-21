// Сanvas для графика
const ctx = document.getElementById('cpuChart').getContext('2d');

// График 
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Временные метки
        datasets: [{
            label: 'Загрузка процессора (%)',
            data: [], 
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true, max: 100 }
        }
    }
});

let totalRequests = 0; // Общее число запросов
let errorRequests = 0; // Число ошибок
let lastValidValue = 0; // Последнее корректное значение загрузки

// Функция для обновления статистики на странице
function updateStats() {
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('errorRequests').textContent = errorRequests;
    document.getElementById('errorPercent').textContent = 
        totalRequests > 0 ? Math.round((errorRequests / totalRequests) * 100) : 0;
}

// Функция для добавления данных на график
function addToChart(value) {
    const time = new Date().toLocaleTimeString(); // Текущее время
    chart.data.labels.push(time); // Добавляем время на ось X
    chart.data.datasets[0].data.push(value); // Добавляем значение загрузки

    // Ограничиваем график 20 точками
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

// Функция для показа сообщения об ошибке
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    // Скрываем сообщение через 3 секунды
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Функция для получения данных с сервера
function getCpuLoad() {
    fetch('http://exercise.develop.maximaster.ru/service/cpu/', {
        headers: { 'Authorization': 'Basic ' + btoa('cli:12344321') }
    })
    .then(response => response.text())
    .then(data => {
        totalRequests++;
        const cpuLoad = parseInt(data);

        if (cpuLoad === 0 || isNaN(cpuLoad)) {
            errorRequests++;
            addToChart(lastValidValue); // Используем последнее валидное значение
            showError('Ошибка данных, использовано предыдущее значение');
        } else {
            // Если данные корректны
            lastValidValue = cpuLoad; // Сохраняем новое значение
            addToChart(cpuLoad); // Добавляем на график
        }
        updateStats();
    })
    .catch(error => {
        // Если произошла ошибка сети
        totalRequests++;
        errorRequests++;
        addToChart(lastValidValue); // Используем последнее значение
        showError('Ошибка сети');
        updateStats();
    });
}

// Первый запрос
getCpuLoad();
// Повторяем запрос каждые 5 секунд
setInterval(getCpuLoad, 5000);