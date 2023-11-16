// components.js

document.addEventListener('DOMContentLoaded', function () {
    // Загрузка и вставка содержимого для элемента с id="footer"
    loadAndInsertContent('footer', 'components/footer.html');

    // Загрузка и вставка содержимого для элемента с id="header"
    loadAndInsertContent('header', 'components/header.html');

});

function loadAndInsertContent(elementId, filePath) {
    // Получаем элемент по ID
    var targetElement = document.getElementById(elementId);

    // Используем fetch для загрузки содержимого файла
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            // Вставляем полученный текст в содержимое элемента
            targetElement.innerHTML = data;
        })
        .catch(error => console.error(`Ошибка загрузки файла ${filePath}:`, error));
}
