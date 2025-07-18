// Инициализация карты Яндекс
ymaps.ready(function () {
    console.log("Попытка инициализации карты...");
    let карта;
    try {
        карта = new ymaps.Map("deliveryMap", {
            center: [54.193122, 37.617348],
            zoom: 11
        }, {
            balloonMaxWidth: 200,
            searchControlProvider: 'yandex#search'
        });
        console.log("Карта инициализирована успешно");

        карта.events.add('click', function (e) {
            let координаты = e.get('coords');
            if (!карта.balloon.isOpen()) {
                карта.balloon.open(координаты, {
                    contentHeader: 'Выбрано место',
                    contentBody: `<p>Координаты: ${координаты[0].toPrecision(6)}, ${координаты[1].toPrecision(6)}</p>`
                });
            } else {
                карта.balloon.close();
            }
        });

        карта.events.add('balloonopen', function () {
            карта.hint.close();
        });
    } catch (error) {
        console.error("Ошибка при инициализации карты:", error);
    }
});

// Валидация формы
function validateForm() {
    if (!checkElementsExist()) return;

    const элементыФормы = {
        nameError: document.getElementById('nameError'),
        phoneError: document.getElementById('phoneError'),
        emailError: document.getElementById('emailError'),
        formResult: document.getElementById('formResult')
    };

    const данныеФормы = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        userEmail: document.getElementById('userEmail').value
    };

    const ошибкиВалидации = checkInputValidity(данныеФормы);
    displayValidationResults(ошибкиВалидации, элементыФормы);
}

// Проверка наличия всех элементов DOM
function checkElementsExist() {
    const требуемыеИд = ['fullName', 'phone', 'userEmail', 'nameError', 'phoneError', 'emailError', 'formResult', 'deliveryMap'];
    const отсутствующие = требуемыеИд.filter(id => !document.getElementById(id));
    if (отсутствующие.length > 0) {
        console.error(`Отсутствуют элементы: ${отсутствующие.join(', ')}`);
        return false;
    }
    return true;
}

// Проверка корректности введённых данных
function checkInputValidity(данные) {
    const ошибки = {};
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    const phoneRegex = /^\d+$/;

    if (!данные.fullName.trim()) {
        ошибки.nameError = "Поле ФИО обязательно для заполнения";
    }
    if (данные.userEmail && !emailRegex.test(данные.userEmail)) {
        ошибки.emailError = "Введите корректный e-mail (должен содержать @)";
    }
    if (!phoneRegex.test(данные.phone)) {
        ошибки.phoneError = "Телефон должен содержать только цифры";
    }

    return ошибки;
}

// Отображение результатов валидации
function displayValidationResults(ошибки, элементы) {
    Object.keys(элементы).forEach(key => {
        if (key !== 'formResult') элементы[key].textContent = '';
    });

    Object.entries(ошибки).forEach(([key, сообщение]) => {
        if (элементы[key]) элементы[key].textContent = сообщение;
    });

    элементы.formResult.textContent = '';
    if (Object.keys(ошибки).length === 0 && typeof ymaps !== 'undefined' && document.getElementById('deliveryMap').querySelector('.ymaps-2-1-79-map')) {
        элементы.formResult.textContent = "Заказ оформлен!";
        элементы.formResult.style.color = "green";
    } else if (Object.keys(ошибки).length > 0 || typeof ymaps === 'undefined' || !document.getElementById('deliveryMap').querySelector('.ymaps-2-1-79-map')) {
        элементы.formResult.textContent = "Не отмечено место доставки или есть ошибки в полях";
        элементы.formResult.style.color = "red";
    }
}