// menu-loader.js

// Проверяем, была ли переменная urlParams уже объявлена
var urlParams = new URLSearchParams(window.location.search);

// Получение параметра data из URL
const dataParam = urlParams.get('data');

// Загрузка и выполнение соответствующего скрипта
if (dataParam) {
    fetch('json/menu.json')
        .then(response => response.json())
        .then(menuData => {
            const menuItem = menuData
                .flatMap(group => group.group_items)
                .find(item => item.link === dataParam);

            if (menuItem) {
                const mapTitleElement = document.getElementById('text');
                mapTitleElement.textContent = menuItem.text;

                // Загружаем и выполняем соответствующий скрипт
                if (menuItem.script) {
                    const script = document.createElement('script');
                    script.src = menuItem.script;
                    document.body.appendChild(script);
                }
            }
        })
        .catch(error => console.error('Error fetching menu JSON:', error));
}
