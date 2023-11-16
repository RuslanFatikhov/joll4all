// Инициализация карты с использованием Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZnV6bGFuIiwiYSI6ImNsbjl4bXh5dDBhNHIycXA1dWM3a29wN2sifQ.DdCGdPSwOj5eASUjdiqXsg'; 

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [76.9472, 43.249345],
    zoom: 11
});

map.on('load', () => {
    // Загрузка данных из JSON-файла
    fetch('json/bikePathsData.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(bikePath => {
                const safetyLevels = {
                    5: { color: '#64C750', text: 'Отлично' },
                    4: { color: '#FFBD3F', text: 'Хорошо' },
                    3: { color: '#E55D47', text: 'Плохо' },
                    2: { color: '#772613', text: 'Ужасно' },
                    1: { color: '#121212', text: 'Очень небезопасно' }
                };

                const roadColor = safetyLevels[bikePath.safetyLevel]?.color || '#121212';
                const safetyText = safetyLevels[bikePath.safetyLevel]?.text || 'Неизвестно';

                map.addLayer({
                    'id': `bike-path-${bikePath.id}`,
                    'type': 'line',
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
                                'source':bikePath.source,
                                'date':bikePath.date
                            },
                            'geometry': {
                                'type': 'LineString',
                                'coordinates': bikePath.coordinates
                            }
                        }
                    },
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': roadColor,
                        'line-width': 4
                    }
                });


                function handlePopup(e) {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const properties = e.features[0].properties;
                    const safetyText = safetyLevels[bikePath.safetyLevel]?.text || 'Неизвестно';
                
                    // Добавляем класс в зависимости от значения safetyLevel
                    const labelClass = `bg${bikePath.safetyLevel}`;

                    const popupContent = `
                        <h3>${properties.name}</h3>
                        <p class="label ${labelClass}">${safetyText}</p>
                        <p>${properties.description}</p>
                        <div class="photos">
                            ${bikePath.photos.map(photo => `<img src="${photo}" alt="Фотография велодорожки" class="popup-photo">`).join('')}
                        </div>
                        <div class="down">
                            <button class="compliance-button">
                                <img src="src/icon/warning.svg" alt="warning">
                                <p>Пожаловаться</p>
                            </button>

                            <span>
                                <p class="w20">${properties.source}</p>
                                <p class="w20">${properties.date}</p>
                            <span>
                        </div>
                    `;

                    const popup = new mapboxgl.Popup({
                        className: 'custom-popup',
                        maxWidth: '320px'
                    })
                        .setLngLat(coordinates[0])
                        .setHTML(popupContent)
                        .addTo(map);

                    // Добавляем обработчик события для кнопки compliance
                    popup.getElement().querySelector('.compliance-button').addEventListener('click', () => {
                        window.open('https://tally.so/r/mKx66k', '_blank');
                    });

                    popup.getElement().querySelectorAll('.popup-photo').forEach((photo, index) => {
                        photo.addEventListener('click', () => {
                            openFullscreenGallery(bikePath.photos, index);
                        });
                    });
                }

            });
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
});
