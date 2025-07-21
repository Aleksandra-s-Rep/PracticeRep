const STORAGE_KEY = 'spreadsheetData';
let spreadsheetData = [];
let rows = 1;
let cols = 1;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-col').addEventListener('click', addColumn);
    document.getElementById('remove-col').addEventListener('click', removeColumn);
    document.getElementById('add-row').addEventListener('click', addRow);
    document.getElementById('remove-row').addEventListener('click', removeRow);

    loadData();
    renderTable();
    setupCellListeners();
});

// Загрузка данных из LocalStorage
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        spreadsheetData = data.data || [];
        rows = data.rows || 1;
        cols = data.cols || 1;
    }
}

// Сохранение данных в LocalStorage
function saveData() {
    const dataToSave = { data: spreadsheetData, rows, cols };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

// Отрисовка таблицы
function renderTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            const cellId = `${i}-${j}`;
            cell.setAttribute('data-id', cellId);
            const cellValue = spreadsheetData.find(item => item.id === cellId)?.value || '';
            cell.textContent = cellValue;
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    setupCellListeners();
}

// Настройка слушателей для редактирования ячеек
function setupCellListeners() {
    document.querySelectorAll('#table-body td').forEach(cell => {
        cell.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = cell.textContent;

            cell.innerHTML = '';
            cell.appendChild(input);
            input.focus();

            input.addEventListener('blur', () => {
                const value = input.value;
                const cellId = cell.getAttribute('data-id');
                cell.textContent = value;

                const index = spreadsheetData.findIndex(item => item.id === cellId);
                if (value.trim()) {
                    if (index !== -1) spreadsheetData[index].value = value;
                    else spreadsheetData.push({ id: cellId, value });
                } else if (index !== -1) {
                    spreadsheetData.splice(index, 1);
                }
                saveData();
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') input.blur();
            });
        });
    });
}

function addColumn() {
    cols++;
    renderTable();
    saveData();
}

function removeColumn() {
    if (cols <= 1) return;

    const hasData = spreadsheetData.some(item => {
        const col = parseInt(item.id.split('-')[1]);
        return col === cols - 1;
    });

    if (hasData && !confirm('В столбце есть данные. Удалить?')) return;

    spreadsheetData = spreadsheetData.filter(item => {
        const col = parseInt(item.id.split('-')[1]);
        return col !== cols - 1;
    });
    cols--;
    renderTable();
    saveData();
}

function addRow() {
    rows++;
    renderTable();
    saveData();
}

function removeRow() {
    if (rows <= 1) return;

    const hasData = spreadsheetData.some(item => {
        const row = parseInt(item.id.split('-')[0]);
        return row === rows - 1;
    });

    if (hasData && !confirm('В строке есть данные. Удалить?')) return;

    spreadsheetData = spreadsheetData.filter(item => {
        const row = parseInt(item.id.split('-')[0]);
        return row !== rows - 1;
    });
    rows--;
    renderTable();
    saveData();
}