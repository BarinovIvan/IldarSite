// Инициализация при загрузке документа
$(document).ready(function() {
    console.log('Проект инициализирован');
    
    // Инициализация AOS
    AOS.init();
    
    // Пример использования Semantic UI
    $('.ui.button').on('click', function() {
        console.log('Кнопка нажата');
    });
}); 