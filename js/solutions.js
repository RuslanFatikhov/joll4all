// solutions.js

mapboxgl.accessToken = 'pk.eyJ1IjoiZnV6bGFuIiwiYSI6ImNsbjl4bXh5dDBhNHIycXA1dWM3a29wN2sifQ.DdCGdPSwOj5eASUjdiqXsg';

// Создание всплывающего окна
const popup = document.getElementById('custom-popup');
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [76.9472, 43.249345],
  zoom: 11
});

// Чтение данных из JSON-файла
fetch('json/solutions.json')
  .then(response => response.json())
  .then(data => {
    // Перебор элементов массива
    data.forEach(item => {
      // Извлечение координат из JSON-данных
      const coordinates = item.point;

      // Создание HTML-элемента для метки
      const markerElement = document.createElement('div');
      markerElement.className = 'map-point';

      // Создание метки на карте
      new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(map);

      // Добавление события клика на метку
      markerElement.addEventListener('click', () => {
        // Установка HTML-контента всплывающего окна
        popup.innerHTML =
          `<h3>${item.name}</h3>
          <div class="s12"></div>
          <p>${item.desc}</p>
          <div class="s12"></div>
          <video mute controls src="${item.video}"></video>
          <div class="s12"></div>
          <button id="close-popup-btn" class="ghost">Закрыть</button>`;

        // Показ кастомного поп-апа
        popup.style.display = 'block';

        // Обработчик события для кнопки закрытия поп-апа
        const closePopupBtn = document.getElementById('close-popup-btn');
        closePopupBtn.addEventListener('click', () => {
          popup.style.display = 'none';
        });

        // Установка координат и отображение всплывающего окна
        map.flyTo({
          center: coordinates,
          zoom: 14
        });
      });
    });
  })
  .catch(error => console.error('Ошибка при загрузке JSON: ', error));
