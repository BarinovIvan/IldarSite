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
    let lockedScrollY = 0;
    
    function openMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenuOpen = true;
        
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
        
        $mobileMenu.removeClass('mobile-menu--closing').addClass('mobile-menu--open');
        $header.addClass('header--menu-open');        
        lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        $body.addClass('menu-open')
             .css({
                 position: 'fixed',
                 top: `-${lockedScrollY}px`,
                 left: '0',
                 right: '0',
                 width: '100%'
             });

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
    
    function closeMobileMenu() {
        if (isAnimating) return;
        isAnimating = true;
        mobileMenuOpen = false;
        
        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
        
        $mobileMenu.addClass('mobile-menu--closing');
        $header.removeClass('header--menu-open').addClass('header--menu-closing');        
        $body.removeClass('menu-open')
             .css({ position: '', top: '', left: '', right: '', width: '' });
        window.scrollTo(0, lockedScrollY);
        
        
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
        
        if ($button.hasClass('header__cta')) {
            $button.addClass('header__cta--clicked');
            setTimeout(() => {
                $button.removeClass('header__cta--clicked');
            }, 200);
        }
        
        console.log('CTA кнопка нажата - переход к контактам');
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });
    
    // Обработка кликов по обычным кнопкам (кроме кнопки отправки формы)
    $('.button').not('#contact-submit').on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        
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
        
        if (href === '#') return;
        
        const target = $(href);
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 600);
        }
    });
    
    
    // Закрытие мобильного меню при изменении размера окна
    $(window).on('resize', function() {
        const width = $(window).width();

        if (width >= 1200 && mobileMenuOpen) {
            closeMobileMenu();
        }
    });

    $('.ui.dropdown').dropdown();
    $('.ui.accordion').accordion();
    $('.ui.popup').popup();


    // Reviews карусель
    if (window.Swiper) {
        const reviewsSwiper = new Swiper('.reviews__slider', {
            slidesPerView: 1,
            spaceBetween: 16,
            loop: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: { slidesPerView: 1 },
                1200: { slidesPerView: 2 },
            }
        });
    } else {
        console.warn('Swiper не загружен');
    }
    
    // Маска для телефона
    function formatPhoneNumber(value) {

        const digits = value.replace(/\D/g, '');

        let cleanDigits = digits;
        if (cleanDigits.startsWith('8')) {
            cleanDigits = '7' + cleanDigits.slice(1);
        }

        if (!cleanDigits.startsWith('7') && cleanDigits.length > 0) {
            cleanDigits = '7' + cleanDigits;
        }

        if (cleanDigits.length === 0) return '';
        if (cleanDigits.length <= 1) return '+7';
        if (cleanDigits.length <= 4) return `+7 (${cleanDigits.slice(1)}`;
        if (cleanDigits.length <= 7) return `+7 (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4)}`;
        if (cleanDigits.length <= 9) return `+7 (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4, 7)}-${cleanDigits.slice(7)}`;
        return `+7 (${cleanDigits.slice(1, 4)}) ${cleanDigits.slice(4, 7)}-${cleanDigits.slice(7, 9)}-${cleanDigits.slice(9, 11)}`;
    }
    
    // Применяем маску к полю телефона
    const $phoneInput = $('#phone');
    
    $phoneInput.on('input', function(e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = formatPhoneNumber(oldValue);
        
        e.target.value = newValue;

        let newCursorPosition = cursorPosition;
        if (newValue.length > oldValue.length) {
            newCursorPosition = cursorPosition + (newValue.length - oldValue.length);
        }

        if (newCursorPosition < 4) {
            newCursorPosition = newValue.length;
        }
        
        setTimeout(() => {
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    });
    
    $phoneInput.on('focus', function(e) {
        if (!e.target.value) {
            e.target.value = '+7 (';
            setTimeout(() => {
                e.target.setSelectionRange(4, 4);
            }, 0);
        }
    });
    
    $phoneInput.on('keydown', function(e) {
        if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            (e.keyCode === 88 && e.ctrlKey === true) ||
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // Contact form → Telegram
    const $contactForm = $('#contact-form');
    const $status = $('#contact-status');
    const $submit = $('#contact-submit');

    async function sendToTelegram(formData) {
        const response = await fetch('/api/send-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        return response.json();
    }
    
    function applySubmitColorByMethod() {
        const method = $('input[name="contact_method"]:checked').val();
        const $choices = $('.form__choice');
        
        // Удаляем все классы стилизации
        $choices.removeClass('is-checked');
        
        // Добавляем единый класс для выбранного элемента
        $choices.has('input:checked').addClass('is-checked');
    }

    $('input[name="contact_method"]').on('change', applySubmitColorByMethod);
    applySubmitColorByMethod();

    $contactForm.on('submit', async function(e) {
        e.preventDefault();
        const formData = {
            name: $.trim($('#name').val()),
            phone: $.trim($('#phone').val()),
            contactMethod: $('input[name="contact_method"]:checked').val() || 'telegram'
        };

        const phoneDigits = formData.phone.replace(/\D/g, '');
        
        if (!formData.name || !formData.phone || phoneDigits.length < 11) {
            $status.text('Пожалуйста, заполните все поля и введите корректный номер телефона.');
            return;
        }
        
        $submit.prop('disabled', true).addClass('button--clicked');
        $status.text('Отправка...');
        
        try {
            await sendToTelegram(formData);
            $status.text('Готово! Я скоро свяжусь с вами.');
            this.reset();
        } catch (err) {
            console.error(err);
            $status.text('Ошибка отправки. Напишите, пожалуйста, в Telegram: @ildar_izma');
        } finally {
            $submit.prop('disabled', false).removeClass('button--clicked');
        }
    });
}); 