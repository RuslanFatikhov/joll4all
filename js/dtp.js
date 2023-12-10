// Инициализация карты с использованием Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZnV6bGFuIiwiYSI6ImNscGd4eTZmaTAyZnkya3AwZTAwcmozZTMifQ.JCX6VtrorIpJIwWedIWi_w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [76.9472, 43.249345],
    zoom: 11
});

// Объявление safetyLevels в глобальной области видимости
const safetyLevels = {
    5: { color: '#64C750', text: 'Без пострадавших' },
    4: { color: '#FFBD3F', text: 'Легкий' },
    3: { color: '#E55D47', text: 'Тяжелый' },
    2: { color: '#772613', text: 'Есть погибший' },
    1: { color: '#121212', text: 'Есть погибшие' }
};

let clickedItem = null; // Хранит информацию о последнем выбранном элементе

// Загрузка данных из JSON-файла
fetch('./json/dtp.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(bikePath => {
            const roadColor = safetyLevels[bikePath.safetyLevel]?.color || '#121212';
            const safetyText = safetyLevels[bikePath.safetyLevel]?.text || 'Неизвестно';

            bikePath.coordinates.forEach(coord => {
                map.addLayer({
                    'id': `bike-point-${bikePath.id}-${coord[0]}-${coord[1]}`,
                    'type': 'circle',
                    'source': {
                        'type': 'geojson',
                        'data': {
                            'type': 'Feature',
                            'properties': {
                                'id': bikePath.id,
                                'name': bikePath.name,
                                'safetyLevel': bikePath.safetyLevel,
                                'safetyText': safetyText,
                                'description': bikePath.description,
                                'source': bikePath.source,
                                'date': bikePath.date
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': coord
                            }
                        }
                    },
                    'paint': {
                        'circle-color': roadColor,
                        'circle-radius': 6
                    }
                });
            });
        });

        // Выводим текст в элементе h3
        const mapTitleElement = document.getElementById('text');
        mapTitleElement.textContent = "Карта ДТП"; // Установите нужный текст

        // Создаем список велодорожек
        const veloListElement = document.getElementById('list');
        data.forEach(item => {
            const listItem = createListItem(item);
            veloListElement.appendChild(listItem);
        });

        // Обработчик события клика на элементе списка
        veloListElement.addEventListener('click', (event) => {
            if (event.target && event.target.nodeName === 'LI') {
                const selectedItem = data.find(item => item.name === event.target.firstChild.textContent);

                // Центрирование карты на координатах велодорожки
                map.flyTo({
                    center: selectedItem.coordinates[0],
                    zoom: 14,
                    essential: true
                });

                // Изменение прозрачности других велодорожек
                data.forEach(otherItem => {
                    otherItem.coordinates.forEach(coord => {
                        const layerId = `bike-point-${otherItem.id}-${coord[0]}-${coord[1]}`;
                        const opacity = otherItem.id === selectedItem.id ? 1 : 0.1;
                        map.setPaintProperty(layerId, 'circle-opacity', opacity);
                    });
                });

                // Добавляем класс clicked к выбранному элементу списка
                if (clickedItem) {
                    clickedItem.classList.remove('clicked');
                }
                event.target.classList.add('clicked');

                // Обновляем информацию о последнем выбранном элементе
                clickedItem = event.target;
            }
        });
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));

// Функция для создания элемента списка велодорожек
function createListItem(item) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-card');

    const nameElement = document.createElement('p');
    nameElement.textContent = item.name;

    const safetyLevelElement = document.createElement('p');
    safetyLevelElement.classList.add('label');
    const safetyLevelData = safetyLevels[item.safetyLevel];
    safetyLevelElement.textContent = safetyLevelData.text;
    safetyLevelElement.style.backgroundColor = safetyLevelData.color;

    listItem.appendChild(nameElement);
    listItem.appendChild(safetyLevelElement);

    return listItem;
}
