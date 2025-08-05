// Инициализация при загрузке документа
$(document).ready(function() {
    // Инициализация AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Мобильное меню с анимациями
    const $mobileMenuButton = $('.header__mobile-menu');
    const $mobileMenu = $('.mobile-menu');
    const $header = $('.header');
    const $body = $('body');
    let mobileMenuOpen = false;
    let isAnimating = false;
    
    function openMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenuOpen = true;
        
        // Haptic feedback для мобильных устройств
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        $mobileMenu.removeClass('mobile-menu--closing').addClass('mobile-menu--open');
        $header.addClass('header--menu-open');
        $body.addClass('menu-open');
        
        // Сбрасываем флаг анимации после завершения
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
    
    function closeMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenuOpen = false;
        
        // Haptic feedback для мобильных устройств
        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
        
        $mobileMenu.addClass('mobile-menu--closing');
        $header.removeClass('header--menu-open').addClass('header--menu-closing');
        $body.removeClass('menu-open');
        
        
        setTimeout(() => {
            $mobileMenu.removeClass('mobile-menu--open mobile-menu--closing');
            $header.removeClass('header--menu-closing');
            isAnimating = false;
        }, 500);
    }
    
    $mobileMenuButton.on('click', function() {
        if (mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Закрытие мобильного меню при клике на ссылку или кнопку
    $('.mobile-menu__link, .mobile-menu__cta').on('click', function() {
        if (mobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Закрытие мобильного меню при клике вне его
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.header__mobile-menu, .mobile-menu').length && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Обработка кликов по CTA кнопкам в header и mobile menu
    $('.header__cta, .mobile-menu__cta').on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        
        // Добавляем эффект нажатия
        if ($button.hasClass('header__cta')) {
            $button.addClass('header__cta--clicked');
            setTimeout(() => {
                $button.removeClass('header__cta--clicked');
            }, 200);
        }
        
        console.log('CTA кнопка нажата - переход к контактам');
        
        // Плавная прокрутка к секции контактов
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });
    
    // Обработка кликов по обычным кнопкам
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
    
    // Smooth scroll для всех якорных ссылок
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Игнорируем пустые якоря
        if (href === '#') return;
        
        const target = $(href);
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });
    
    // Подсветка активной навигации при скролле
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        $('.header__nav-link, .mobile-menu__link').each(function() {
            const href = $(this).attr('href');
            
            if (href && href.startsWith('#') && href !== '#') {
                const target = $(href);
                
                if (target.length) {
                    const targetTop = target.offset().top - 150;
                    const targetBottom = targetTop + target.outerHeight();
                    
                    if (scrollTop >= targetTop && scrollTop < targetBottom) {
                        $('.header__nav-link, .mobile-menu__link').removeClass('header__nav-link--active');
                        $(this).addClass('header__nav-link--active');
                    }
                }
            }
        });
    });
    
    // Закрытие мобильного меню при изменении размера окна
    $(window).on('resize', function() {
        const width = $(window).width();
        
        // Закрываем мобильное меню на больших экранах
        if (width >= 1200 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Инициализация всех Semantic UI компонентов
    $('.ui.dropdown').dropdown();
    $('.ui.accordion').accordion();
    $('.ui.popup').popup();
    
    console.log('Сайт Ильдара инициализирован успешно');
}); 