/**
 * FlowChat - Frontend Interactivity JS
 * Mejoras aplicadas:
 * 1. IntersectionObserver para animaciones al hacer scroll (Aparición suave).
 * 2. Menú Desplegable Móvil.
 * 3. Form Validation Básica sin recargar la página.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ANIMACIONES DE SCROLL (Intersection Observer)
    // ==========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento visible para disparar
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez (después de aparecer, no se oculta más)
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-right');
    animatedElements.forEach(el => animateOnScroll.observe(el));

    // ==========================================
    // 2. MENÚ MÓVIL
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        
        // Cambiar icono de hamburguesa a cruz
        if (navMenu.classList.contains('open')) {
            menuIcon.classList.remove('bx-menu');
            menuIcon.classList.add('bx-x');
        } else {
            menuIcon.classList.remove('bx-x');
            menuIcon.classList.add('bx-menu');
        }
    });

    // Cerrar menú on click (mobile)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('open');
                menuIcon.classList.remove('bx-x');
                menuIcon.classList.add('bx-menu');
            }
        });
    });

    // ==========================================
    // 3. VALIDACIÓN DE FORMULARIO DE CONTACTO
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.querySelector('.btn-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir el recargo de página

            // Obtener datos
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            resetAlert();

            // Validaciones básicas de campos vacíos
            if (!name || !email || !subject || !message) {
                showAlert('Por favor, completa todos los campos requeridos.', 'error');
                return;
            }

            // Validación de formato de correo
            if (!isValidEmail(email)) {
                showAlert('Por favor, ingresa un correo electrónico válido.', 'error');
                return;
            }

            // Envío real a servidor mediante FormSubmit (AJAX)
            setLoading(true);

            fetch("https://formsubmit.co/ajax/willtrevor888x3h@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Nombre: name,
                    Email: email,
                    Asunto: subject,
                    Mensaje: message,
                    _subject: "Nuevo mensaje de contacto: " + subject // Asunto del correo que llega
                })
            })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                if(data.success) {
                    showAlert(`¡Gracias, ${name}! Hemos recibido tu mensaje y te responderemos pronto.`, 'success');
                    contactForm.reset(); // Limpiar el formulario post-envió
                } else {
                    showAlert('Lo sentimos, ocurrió un error al enviar tu mensaje. Intenta de nuevo más tarde.', 'error');
                }
            })
            .catch(error => {
                setLoading(false);
                showAlert('Hubo un problema de conexión. Por favor, revisa tu internet y vuelve a intentar.', 'error');
            });
        });
    }

    // Utilidades
    function isValidEmail(email) {
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        formAlert.innerHTML = `<i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i> ${message}`;
        formAlert.className = `form-alert ${type}`; // quita el 'hidden' y aplica estilo CSS
    }

    function resetAlert() {
        formAlert.className = 'form-alert hidden';
        formAlert.innerHTML = '';
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span><i class="bx bx-loader bx-spin"></i>';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Enviar Mensaje</span><i class="bx bx-send"></i>';
        }
    }
});
