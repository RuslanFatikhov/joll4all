document.addEventListener('DOMContentLoaded', function() {
    const mainGrid = document.getElementById('main-grid');

    // Загружаем данные из файла catalog.js
    fetch('json/catalog.json')
      .then(response => response.json())
      .then(data => {
        // Создаем карточки для каждой записи в JSON
        data.forEach(item => {
          const card = document.createElement('a');
          card.href = item.link;
          card.classList.add('catalog-card');

          const img = document.createElement('img');
          img.src = item.img;
          img.alt = item.text;

          const text = document.createElement('h3');
          text.textContent = item.text;

          card.appendChild(img);
          card.appendChild(text);

          mainGrid.appendChild(card);
        });
      })
      .catch(error => console.error('Ошибка загрузки данных:', error));
  });