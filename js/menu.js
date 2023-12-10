// Функция для создания HTML-элемента элемента группы
function createItemElement(item) {
    const itemElement = document.createElement("a");
    itemElement.classList.add("item", item.item_size);
    itemElement.href = `map.html?data=${item.link}`; // Устанавливаем ссылку для элемента

    const textElement = document.createElement("p");
    textElement.textContent = item.text;

    const imgElement = document.createElement("img");
    imgElement.src = item.img;

    itemElement.appendChild(textElement);
    itemElement.appendChild(imgElement);

    // Обработчик событий для перенаправления на map.html при клике
    itemElement.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = `map.html?data=${item.link}`;
    });

    return itemElement;
}

// Функция для создания HTML-элемента группы и отображения данных
function createGroupElement(group) {
    const groupElement = document.createElement("div");
    groupElement.id = group.group;
    groupElement.classList.add("group");

    if (group.show_group_text) {
        const h3Element = document.createElement("h3");
        h3Element.textContent = group.group_text;
        groupElement.appendChild(h3Element);
    }

    groupElement.classList.add(group.group_class);

    const itemsElement = document.createElement("div");
    itemsElement.classList.add("items");

    group.group_items.forEach(item => {
        const itemElement = createItemElement(item);
        itemsElement.appendChild(itemElement);
    });

    groupElement.appendChild(itemsElement);

    return groupElement;
}

// Функция для обработки данных JSON и отображения на странице
function displayMenu(jsonData) {
    const menuElement = document.getElementById("menu");

    jsonData.forEach(group => {
        const groupElement = createGroupElement(group);
        menuElement.appendChild(groupElement);
    });
}

// Загрузка данных из JSON файла
fetch('json/menu.json')
    .then(response => response.json())
    .then(data => displayMenu(data))
    .catch(error => console.error('Error fetching JSON:', error));
