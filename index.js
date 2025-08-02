// Инициализация при загрузке документа
$(document).ready(function() {
    // Инициализация AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Обработка кликов по кнопкам
    $('.button').on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        
        // Добавляем эффект нажатия
        $button.addClass('button--clicked');
        
        setTimeout(() => {
            $button.removeClass('button--clicked');
        }, 200);
        
        if ($button.hasClass('button--info')) {
            console.log('Показана информация о системе контейнеров');
        }
    });
    
    // Отслеживание изменения размера окна для демонстрации
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const width = $(window).width();
            let breakpoint = 'XS';
            
            if (width >= 1200) breakpoint = 'XL';
            else if (width >= 992) breakpoint = 'LG';
            else if (width >= 768) breakpoint = 'MD';
            else if (width >= 576) breakpoint = 'SM';
            
            console.log(`Текущий брейкпоинт: ${breakpoint} (${width}px)`);
            
            // Показываем уведомление о смене брейкпоинта
            showBreakpointNotification(breakpoint, width);
        }, 300);
    });
    
    // Функция для показа уведомления о смене брейкпоинта
    function showBreakpointNotification(breakpoint, width) {
        // Удаляем предыдущее уведомление
        $('.breakpoint-notification').remove();
        
        // Создаем новое уведомление
        const $notification = $('<div class="breakpoint-notification">')
            .html('<strong>' + breakpoint + '</strong> <small>(' + width + 'px)</small>');
        
        $('body').append($notification);
        
        // Анимация появления
        setTimeout(() => {
            $notification.addClass('breakpoint-notification--visible');
        }, 100);
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            $notification.removeClass('breakpoint-notification--visible');
            
            setTimeout(() => {
                $notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Smooth scroll для якорных ссылок
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 600);
        }
    });
    
    // Инициализация всех Semantic UI компонентов
    $('.ui.dropdown').dropdown();
    $('.ui.accordion').accordion();
    $('.ui.popup').popup();
    
    console.log('Все компоненты инициализированы успешно');
}); 