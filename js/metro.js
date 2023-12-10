mapboxgl.accessToken = 'pk.eyJ1IjoiZnV6bGFuIiwiYSI6ImNscGd4eTZmaTAyZnkya3AwZTAwcmozZTMifQ.JCX6VtrorIpJIwWedIWi_w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [76.9472, 43.249345],
    zoom: 11
});

// Загрузка данных из JSON-файла
fetch('json/data.json')
    .then(response => response.json())
    .then(data => {
        // Добавление точек и текста на карту
        const lineCoordinates = data.lines[0].coordinates.map(coord => [coord[1], coord[0]]);
        const stations = data.lines[0].stations;

        stations.forEach(station => {
            // Создание HTML-элемента для маркера с текстом
            const el = document.createElement('div');
            el.className = 'marker';
            el.textContent = station.name;

            // Добавление маркера на карту
            new mapboxgl.Marker(el)
                .setLngLat(station.coordinated)
                .addTo(map);
        });

        // Добавление линии метро
        map.addLayer({
            id: 'metro-line',
            type: 'line',
            source: {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: lineCoordinates
                    }
                }
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': data.lines[0].color,
                'line-width': 5
            }
        });
    })
    .catch(error => console.error('Error loading data:', error));
