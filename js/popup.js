document.addEventListener('DOMContentLoaded', function () {
    // Функция для открытия поп-апа
    function openPopup() {
        var popup = document.getElementById('disabled');
        if (popup) {
            popup.style.display = 'block';
            popup.style.opacity = '1';
            popup.style.transform = 'scale(1)';

            // Добавляем обработчик для закрытия при клике за пределами поп-апа
            document.addEventListener('click', closeOnOutsideClick);
        }
    }

    // Функция для закрытия поп-апа
    function closePopup() {
        var popup = document.getElementById('disabled');
        if (popup) {
            popup.style.display = 'none';

            // Удаляем обработчик для закрытия при клике за пределами поп-апа
            document.removeEventListener('click', closeOnOutsideClick);
        }
    }

    // Функция для закрытия поп-апа при клике за его пределами
    function closeOnOutsideClick(event) {
        var popup = document.getElementById('disabled');
        var closeButton = document.getElementById('close-pop');

        // Проверяем, что клик был за пределами поп-апа и не на кнопке закрытия
        if (popup && !popup.contains(event.target) && event.target !== closeButton) {
            closePopup();
        }
    }

    // Назначение обработчика события на кнопку
    var themeButton = document.getElementById('theme');
    if (themeButton) {
        themeButton.addEventListener('click', openPopup);
    }
});
