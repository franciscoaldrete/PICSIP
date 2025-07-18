// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 80,
    formValidation: true,
    debug: false
};

// ===== CLASE PRINCIPAL DE LA APLICACIÓN =====
class PICSPApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAnimations();
        this.log('Aplicación PICSP inicializada');
    }

    // ===== CONFIGURACIÓN DE EVENTOS =====
    setupEventListeners() {
        // Navegación suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });

        // Navegación activa en scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });

        // Animaciones al hacer scroll
        window.addEventListener('scroll', () => {
            this.handleScrollAnimations();
        });

        // Formularios
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        });

        // Botones de acción
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleButtonAction(e);
            });
        });
    }

    // ===== INICIALIZACIÓN DE COMPONENTES =====
    initializeComponents() {
        // Inicializar tooltips de Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        // Inicializar popovers de Bootstrap
        if (typeof bootstrap !== 'undefined') {
            const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
            popoverTriggerList.map(function (popoverTriggerEl) {
                return new bootstrap.Popover(popoverTriggerEl);
            });
        }

        // Configurar navbar responsive
        this.setupResponsiveNavbar();
    }

    // ===== NAVEGACIÓN SUAVE =====
    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - CONFIG.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = CONFIG.animationDuration;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ===== ACTUALIZAR NAVEGACIÓN ACTIVA =====
    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - CONFIG.scrollOffset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== ANIMACIONES AL HACER SCROLL =====
    setupAnimations() {
        // Agregar clase para animaciones
        const animatedElements = document.querySelectorAll('.card, .section');
        animatedElements.forEach(el => {
            el.classList.add('fade-in-up');
        });
    }

    handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in-up');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animate');
            }
        });
    }

    // ===== MANEJO DE FORMULARIOS =====
    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        if (CONFIG.formValidation && !this.validateForm(form)) {
            this.showNotification('Por favor, completa todos los campos requeridos', 'warning');
            return;
        }

        // Simular envío de formulario
        this.showNotification('Enviando formulario...', 'info');
        
        setTimeout(() => {
            this.showNotification('Formulario enviado exitosamente', 'success');
            form.reset();
        }, 2000);
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    // ===== MANEJO DE BOTONES =====
    handleButtonAction(event) {
        const button = event.target;
        const action = button.dataset.action;

        switch (action) {
            case 'scroll-top':
                this.scrollToTop();
                break;
            case 'print':
                window.print();
                break;
            case 'share':
                this.shareContent();
                break;
            default:
                this.log(`Acción no definida: ${action}`);
        }
    }

    // ===== NAVEGACIÓN RESPONSIVA =====
    setupResponsiveNavbar() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            // Cerrar navbar al hacer clic en un enlace
            const navLinks = navbarCollapse.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 992) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                });
            });
        }
    }

    // ===== UTILIDADES =====
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    shareContent() {
        if (navigator.share) {
            navigator.share({
                title: 'PICSP - Competitividad Regional de Chihuahua',
                text: 'Conoce más sobre la competitividad regional de Chihuahua',
                url: window.location.href
            });
        } else {
            // Fallback para navegadores que no soportan Web Share API
            this.copyToClipboard(window.location.href);
            this.showNotification('Enlace copiado al portapapeles', 'success');
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    log(message) {
        if (CONFIG.debug) {
            console.log(`[PICSP] ${message}`);
        }
    }
}

// ===== INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', () => {
    window.picspApp = new PICSPApp();
});

// ===== EXPORTAR PARA USO GLOBAL =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PICSPApp;
} 