/**
 * CalculatorLoop Core Engine v1.0
 * Handles: Multi-currency, Multi-language, Theme, and Shared UI elements
 */

const AppConfig = {
    defaultLang: 'en',
    defaultCurrency: 'USD',
    currencies: {
        'USD': { symbol: '$', rate: 1, name: 'US Dollar', locale: 'en-US' },
        'INR': { symbol: '₹', rate: 83.5, name: 'Indian Rupee', locale: 'en-IN' },
        'EUR': { symbol: '€', rate: 0.92, name: 'Euro', locale: 'de-DE' },
        'GBP': { symbol: '£', rate: 0.79, name: 'British Pound', locale: 'en-GB' },
        'AUD': { symbol: 'A$', rate: 1.52, name: 'Australian Dollar', locale: 'en-AU' },
        'CAD': { symbol: 'C$', rate: 1.36, name: 'Canadian Dollar', locale: 'en-CA' },
        'JPY': { symbol: '¥', rate: 151.5, name: 'Japanese Yen', locale: 'ja-JP' }
    },
    languages: {
        'en': 'English',
        'hi': 'हिंदी (Hindi)',
        'es': 'Español (Spanish)',
        'fr': 'Français (French)',
        'de': 'Deutsch (German)'
    },
    // Basic dictionary for common UI elements
    translations: {
        'en': {
            'calculate': 'Calculate',
            'reset': 'Reset',
            'result': 'Result',
            'settings': 'Settings',
            'language': 'Language',
            'currency': 'Currency',
            'back_to_tools': 'Back to Tools',
            'share': 'Share',
            'save_pdf': 'Save PDF'
        },
        'hi': {
            'calculate': 'गणना करें',
            'reset': 'रीसेट',
            'result': 'परिणाम',
            'settings': 'सेटिंग्स',
            'language': 'भाषा',
            'currency': 'मुद्रा',
            'back_to_tools': 'टूल्स पर वापस जाएं',
            'share': 'शेयर करें',
            'save_pdf': 'PDF सेव करें'
        },
        'es': {
            'calculate': 'Calcular',
            'reset': 'Reiniciar',
            'result': 'Resultado',
            'settings': 'Ajustes',
            'language': 'Idioma',
            'currency': 'Moneda',
            'back_to_tools': 'Volver a Herramientas',
            'share': 'Compartir',
            'save_pdf': 'Guardar PDF'
        }
    }
};

class CalculatorApp {
    constructor() {
        this.currency = localStorage.getItem('cl_currency') || AppConfig.defaultCurrency;
        this.lang = localStorage.getItem('cl_lang') || AppConfig.defaultLang;
        this.init();
    }

    init() {
        this.injectControls();
        this.applySettings();
        this.bindEvents();
    }

    injectControls() {
        // Check if controls already exist
        if (document.getElementById('clSettingsToggle')) return;

        const controlsHTML = `
            <div class="cl-settings-panel" id="clSettingsPanel" style="display:none;">
                <div class="cl-panel-header">
                    <h3>${this.t('settings')}</h3>
                    <button class="cl-close-btn" id="clCloseSettings">&times;</button>
                </div>
                <div class="cl-setting-group">
                    <label><i class="fas fa-globe"></i> ${this.t('language')}</label>
                    <select id="clLangSelect">
                        ${Object.entries(AppConfig.languages).map(([code, name]) => 
                            `<option value="${code}" ${code === this.lang ? 'selected' : ''}>${name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="cl-setting-group">
                    <label><i class="fas fa-coins"></i> ${this.t('currency')}</label>
                    <select id="clCurrencySelect">
                        ${Object.entries(AppConfig.currencies).map(([code, info]) => 
                            `<option value="${code}" ${code === this.currency ? 'selected' : ''}>${code} - ${info.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
            <button class="cl-settings-toggle" id="clSettingsToggle" title="${this.t('settings')}">
                <i class="fas fa-cog"></i>
            </button>
            <style>
                .cl-settings-toggle {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--accent, #10b981);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    cursor: pointer;
                    z-index: 9999;
                    font-size: 1.4rem;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cl-settings-toggle:hover { 
                    transform: rotate(90deg) scale(1.1); 
                }
                .cl-settings-panel {
                    position: fixed;
                    bottom: 85px;
                    right: 20px;
                    background: var(--bg-card, #ffffff);
                    padding: 20px;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    z-index: 9999;
                    min-width: 280px;
                    border: 1px solid var(--border, #e5e7eb);
                    animation: clSlideUp 0.3s ease;
                }
                @keyframes clSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .cl-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    border-bottom: 1px solid var(--border, #eee);
                    padding-bottom: 10px;
                }
                .cl-panel-header h3 { margin: 0; font-size: 1.1rem; color: var(--text-primary, #333); }
                .cl-close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary, #666); }
                .cl-setting-group { margin-bottom: 15px; }
                .cl-setting-group label { display: block; font-size: 0.9rem; margin-bottom: 8px; color: var(--text-secondary, #555); font-weight: 500; }
                .cl-setting-group select { 
                    width: 100%; 
                    padding: 10px; 
                    border-radius: 8px; 
                    border: 1px solid var(--border, #ddd); 
                    background: var(--bg-primary, #f9fafb);
                    color: var(--text-primary, #333);
                    font-size: 0.95rem;
                }
                .cl-setting-group select:focus { outline: none; border-color: var(--accent, #10b981); }
            </style>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = controlsHTML;
        document.body.appendChild(div);
    }

    bindEvents() {
        const toggleBtn = document.getElementById('clSettingsToggle');
        const panel = document.getElementById('clSettingsPanel');
        const closeBtn = document.getElementById('clCloseSettings');

        const togglePanel = () => {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            toggleBtn.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
        };

        toggleBtn.addEventListener('click', togglePanel);
        closeBtn.addEventListener('click', togglePanel);

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggleBtn.contains(e.target) && panel.style.display === 'block') {
                togglePanel();
            }
        });

        document.getElementById('clLangSelect').addEventListener('change', (e) => {
            this.lang = e.target.value;
            localStorage.setItem('cl_lang', this.lang);
            location.reload(); 
        });

        document.getElementById('clCurrencySelect').addEventListener('change', (e) => {
            this.currency = e.target.value;
            localStorage.setItem('cl_currency', this.currency);
            location.reload(); // Reload to update all calculations and charts
        });
    }

    t(key) {
        return AppConfig.translations[this.lang]?.[key] || AppConfig.translations['en'][key] || key;
    }

    /**
     * Formats a number as currency based on selected settings
     * @param {number} amount - The amount in USD (base currency)
     * @returns {string} Formatted currency string
     */
    formatMoney(amount) {
        const currencyInfo = AppConfig.currencies[this.currency];
        const converted = amount * currencyInfo.rate;
        
        try {
            return new Intl.NumberFormat(currencyInfo.locale, {
                style: 'currency',
                currency: this.currency
            }).format(converted);
        } catch (e) {
            return `${currencyInfo.symbol}${converted.toFixed(2)}`;
        }
    }

    /**
     * Formats a number as currency based on selected settings WITHOUT conversion
     * Use this when the input is already in the user's selected currency
     * @param {number} amount - The amount in the current currency
     * @returns {string} Formatted currency string
     */
    formatRawMoney(amount) {
        const currencyInfo = AppConfig.currencies[this.currency];
        
        try {
            return new Intl.NumberFormat(currencyInfo.locale, {
                style: 'currency',
                currency: this.currency
            }).format(amount);
        } catch (e) {
            return `${currencyInfo.symbol}${amount.toFixed(2)}`;
        }
    }

    /**
     * Get the current currency symbol
     */
    getSymbol() {
        return AppConfig.currencies[this.currency].symbol;
    }

    applySettings() {
        // Translate static elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) el.textContent = this.t(key);
        });

        // Update currency icons/labels in inputs
        const symbol = this.getSymbol();
        document.querySelectorAll('.input-icon.fa-dollar-sign').forEach(el => {
            el.classList.remove('fa-dollar-sign');
            // FontAwesome doesn't have all currency symbols, so we might replace class or text
            // For simplicity, we'll just keep the generic money icon or update text if it was a text node
        });
        
        // If we have specific currency labels
        document.querySelectorAll('.currency-symbol').forEach(el => {
            el.textContent = symbol;
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.CalculatorApp = new CalculatorApp();
});
