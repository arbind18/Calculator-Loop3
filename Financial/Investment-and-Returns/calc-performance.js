// Advanced Performance Optimizer for All Calculators
// Auto-included in all calculator pages

(function() {
    'use strict';
    
    // Performance boost - Debounce calculations
    function debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Auto-save to localStorage
    const autoSave = {
        save: function(key, data) {
            try {
                localStorage.setItem('calc_' + key, JSON.stringify(data));
            } catch(e) {}
        },
        load: function(key) {
            try {
                const data = localStorage.getItem('calc_' + key);
                return data ? JSON.parse(data) : null;
            } catch(e) {
                return null;
            }
        },
        clear: function(key) {
            try {
                localStorage.removeItem('calc_' + key);
            } catch(e) {}
        }
    };
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter = Calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            const calcBtn = document.querySelector('button[onclick*="calc"]') || 
                           document.querySelector('.btn');
            if (calcBtn) calcBtn.click();
        }
        // Ctrl/Cmd + S = Share
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (typeof shareCalc === 'function') shareCalc();
        }
        // Ctrl/Cmd + D = Download
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            if (typeof downloadCalc === 'function') downloadCalc();
        }
    });
    
    // Auto-detect page load and restore last calculation
    window.addEventListener('DOMContentLoaded', function() {
        const pageKey = window.location.pathname.split('/').pop().replace('.html', '');
        const saved = autoSave.load(pageKey);
        
        if (saved && saved.inputs) {
            // Restore inputs
            Object.keys(saved.inputs).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = saved.inputs[key];
                    // Trigger change event for range sliders
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            
            // Show notification
            showQuickToast('💾 Last calculation restored', 2000);
        }
        
        // Add shortcuts hint
        setTimeout(() => {
            const container = document.querySelector('.container');
            if (container && !document.querySelector('.shortcuts-hint')) {
                const hint = document.createElement('div');
                hint.className = 'shortcuts-hint';
                hint.innerHTML = '⌨️ Shortcuts: <kbd>Ctrl+Enter</kbd> Calculate | <kbd>Ctrl+S</kbd> Share | <kbd>Ctrl+D</kbd> Download';
                hint.style.cssText = 'position:fixed;bottom:10px;left:10px;background:rgba(0,0,0,0.75);color:#fff;padding:8px 16px;border-radius:8px;font-size:0.75rem;z-index:1000;opacity:0.7;transition:opacity 0.3s';
                hint.onmouseenter = () => hint.style.opacity = '1';
                hint.onmouseleave = () => hint.style.opacity = '0.7';
                document.body.appendChild(hint);
            }
        }, 2000);
    });
    
    // Auto-save on calculation
    const originalCalc = window.calc;
    if (typeof originalCalc === 'function') {
        window.calc = function() {
            const result = originalCalc.apply(this, arguments);
            
            // Save inputs
            const inputs = {};
            document.querySelectorAll('input[type="number"], input[type="range"]').forEach(input => {
                if (input.id) inputs[input.id] = input.value;
            });
            
            const pageKey = window.location.pathname.split('/').pop().replace('.html', '');
            autoSave.save(pageKey, { inputs, timestamp: Date.now() });
            
            return result;
        };
    }
    
    // Fast toast notification
    function showQuickToast(msg, duration = 2000) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#1a1a2e;color:#fff;padding:12px 20px;border-radius:8px;font-weight:600;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.3);animation:slideInRight 0.3s ease';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    // Add animation CSS
    if (!document.getElementById('perf-optimizer-style')) {
        const style = document.createElement('style');
        style.id = 'perf-optimizer-style';
        style.textContent = `
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
            kbd { background: #fff; padding: 2px 6px; border-radius: 4px; border: 1px solid #ccc; font-family: monospace; font-size: 0.85em; }
            input:focus { animation: inputFocus 0.3s ease; }
            @keyframes inputFocus { from { transform: scale(0.98); } to { transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }
    
    // Performance monitoring
    console.log('⚡ Calculator Performance Optimizer Loaded');
    console.log('📊 Features: Auto-save, Keyboard shortcuts, Fast calculations');
    
    // Export utilities
    window.CalcPerf = {
        debounce,
        autoSave,
        showQuickToast
    };
})();
