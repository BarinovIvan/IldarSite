$(document).ready(function() {
    // Инициализация AOS с оптимизацией для мобильных
    function initAOS() {
        const isMobile = window.innerWidth <= 768;
        
        AOS.init({
            duration: isMobile ? 500 : 800,
            easing: 'ease-in-out',
            once: true,
            offset: isMobile ? 50 : 100,
            disable: function() {
                // Отключаем некоторые анимации на слабых мобильных устройствах
                if (isMobile && window.navigator.hardwareConcurrency < 4) {
                    return 'phone';
                }
                return false;
            }
        });
        
        if (isMobile) {
            $('[data-aos-delay]').each(function() {
                const delay = parseInt($(this).attr('data-aos-delay'));
                if (delay > 150) {
                    $(this).attr('data-aos-delay', '0');
                } else if (delay > 0) {
                    $(this).attr('data-aos-delay', Math.min(delay, 100));
                }
            });
        }
    }

    initAOS();

    // Переинициализация AOS при изменении размера окна
    let resizeTimeout;
    $(window).on('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const wasMobile = AOS.init.duration === 400;
            const isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== isMobile) {
                AOS.refresh();
                initAOS();
            }
        }, 250);
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

    // Вставьте свои данные Telegram ниже
    const TELEGRAM_BOT_TOKEN = window.TELEGRAM_BOT_TOKEN || '';
    const TELEGRAM_CHAT_ID = window.TELEGRAM_CHAT_ID || '';

    function formatMessage(fields) {
        const lines = [
            'Новая заявка с сайта ——————',
            `Имя: ${fields.name}`,
            `Телефон: ${fields.phone}`,
            `Способ связи: ${fields.contactMethod}`,
            `URL: ${location.href}`
        ].filter(Boolean);
        return lines.join('\n');
    }

    async function sendToTelegram(text) {
        if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
            throw new Error('Не настроены TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID');
        }
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        const payload = {
            chat_id: TELEGRAM_CHAT_ID,
            text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            throw new Error(`Telegram API error: ${response.status} ${errText}`);
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
            await sendToTelegram(formatMessage(formData));
            $status.text('Готово! Я скоро свяжусь с вами.');
            this.reset();
        } catch (err) {
            console.error(err);
            $status.text('Ошибка отправки. Напишите, пожалуйста, в Telegram: @ildar_izma');
        } finally {
            $submit.prop('disabled', false).removeClass('button--clicked');
        }
    });

    // Color Picker for Design Testing
    const $colorPicker = $('#color-picker');
    const $colorPickerClose = $('.color-picker__close');
    const $colorInputs = $('.color-picker__input');
    const $resetButton = $('.color-picker__button--reset');
    const $exportButton = $('.color-picker__button--export');
    const $copyNotification = $('#copy-notification');
    
    // Исходные значения цветов
    const originalColors = {
        '--color-navy': '#2c3e50',
        '--color-charcoal': '#6c7b7f',
        '--color-cream': '#fafafa',
        '--color-steel-blue': '#4a6fa5',
        '--accent-hover': '#3d5a91'
    };
    
    let colorPickerOpen = false;

    // Функция для обновления CSS переменной
    function updateCSSVariable(variable, value) {
        document.documentElement.style.setProperty(variable, value);
        
        // Обновляем отображаемое значение
        const $valueDisplay = $(`.color-picker__value[data-variable="${variable}"]`);
        $valueDisplay.text(value);
    }

    // Функция для открытия color picker
    function openColorPicker() {
        if (colorPickerOpen) return;
        
        colorPickerOpen = true;
        $colorPicker.addClass('color-picker--open').attr('aria-hidden', 'false');
        $('body').css('overflow', 'hidden');
        
        // Устанавливаем текущие значения в инпуты
        $colorInputs.each(function() {
            const $input = $(this);
            const variable = $input.data('variable');
            const currentValue = getComputedStyle(document.documentElement)
                .getPropertyValue(variable).trim() || originalColors[variable];
            $input.val(currentValue);
        });
    }

    // Функция для закрытия color picker
    function closeColorPicker() {
        if (!colorPickerOpen) return;
        
        colorPickerOpen = false;
        $colorPicker.removeClass('color-picker--open').attr('aria-hidden', 'true');
        $('body').css('overflow', '');
    }

    // Функция для сброса цветов к исходным значениям
    function resetColors() {
        Object.entries(originalColors).forEach(([variable, value]) => {
            updateCSSVariable(variable, value);
            $(`input[data-variable="${variable}"]`).val(value);
        });
        
        showNotification('Цвета сброшены к исходным значениям');
    }

    // Функция для экспорта CSS
    function exportCSS() {
        let css = ':root {\n';
        
        $colorInputs.each(function() {
            const $input = $(this);
            const variable = $input.data('variable');
            const value = $input.val();
            css += `  ${variable}: ${value};\n`;
        });
        
        css += '}';
        
        // Копируем в буфер обмена
        navigator.clipboard.writeText(css).then(() => {
            showNotification('CSS скопирован в буфер обмена!');
        }).catch(() => {
            // Fallback для старых браузеров
            const textArea = document.createElement('textarea');
            textArea.value = css;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('CSS скопирован в буфер обмена!');
        });
    }

    // Функция для показа уведомления
    function showNotification(message) {
        $copyNotification.text(message).addClass('copy-notification--show');
        
        setTimeout(() => {
            $copyNotification.removeClass('copy-notification--show');
        }, 3000);
    }

    // Обработчики событий для color picker
    
    // Горячие клавиши
    $(document).on('keydown', function(e) {
        // Ctrl + K или Cmd + K для открытия/закрытия
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (colorPickerOpen) {
                closeColorPicker();
            } else {
                openColorPicker();
            }
        }
        
        // Escape для закрытия
        if (e.key === 'Escape' && colorPickerOpen) {
            closeColorPicker();
        }
    });

    // Клик по кнопке закрытия
    $colorPickerClose.on('click', closeColorPicker);

    // Клик по overlay для закрытия
    $colorPicker.on('click', function(e) {
        if (e.target === this) {
            closeColorPicker();
        }
    });

    // Изменение цвета в real-time
    $colorInputs.on('input', function() {
        const $input = $(this);
        const variable = $input.data('variable');
        const value = $input.val();
        
        updateCSSVariable(variable, value);
    });

    // Кнопка сброса
    $resetButton.on('click', function() {
        if (confirm('Сбросить все цвета к исходным значениям?')) {
            resetColors();
        }
    });

    // Кнопка экспорта
    $exportButton.on('click', exportCSS);

    // Инициализация - устанавливаем исходные значения в отображение
    Object.entries(originalColors).forEach(([variable, value]) => {
        const $valueDisplay = $(`.color-picker__value[data-variable="${variable}"]`);
        $valueDisplay.text(value);
    });

    // Добавляем подсказку в консоль для разработчиков
    console.log('🎨 Color Picker активирован!');
    console.log('Горячие клавиши:');
    console.log('  Ctrl + K (Cmd + K) - открыть/закрыть color picker');
    console.log('  Esc - закрыть color picker');
    console.log('Используйте color picker для тестирования различных цветовых схем.');
});
