// Advanced Calculator Utilities - Fast Share & Download
const CalcUtils = {
    // Fast Share functionality
    share: function(title, text) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: text,
                url: window.location.href
            }).catch(() => this.copyToClipboard(text));
        } else {
            this.copyToClipboard(text);
        }
    },

    // Fast clipboard copy
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('✓ Copied to clipboard!');
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('✓ Copied to clipboard!');
        }
    },

    // Fast PDF download
    downloadPDF: function(title, content) {
        const element = document.createElement('div');
        element.innerHTML = content;
        element.style.padding = '20px';
        element.style.fontFamily = 'Arial, sans-serif';
        
        const opt = {
            margin: 10,
            filename: title + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
            this.showToast('✓ PDF downloaded!');
        } else {
            this.downloadImage(title, content);
        }
    },

    // Fast image download (fallback)
    downloadImage: function(title, elementId) {
        const element = document.getElementById(elementId) || document.querySelector('.result');
        if (!element) return;
        
        if (typeof html2canvas !== 'undefined') {
            html2canvas(element, { scale: 2 }).then(canvas => {
                const link = document.createElement('a');
                link.download = title + '.png';
                link.href = canvas.toDataURL();
                link.click();
                this.showToast('✓ Image downloaded!');
            });
        } else {
            alert('Download feature requires html2canvas library');
        }
    },

    // Fast CSV download
    downloadCSV: function(title, data) {
        const csv = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = title + '.csv';
        link.click();
        URL.revokeObjectURL(url);
        this.showToast('✓ CSV downloaded!');
    },

    // Toast notification
    showToast: function(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:white;padding:12px 24px;border-radius:8px;font-weight:600;z-index:9999;animation:slideIn 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.15)';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
    },

    // Format currency fast
    fmt: function(n) {
        return '₹' + Math.round(n).toLocaleString('en-IN');
    },

    // Format percentage
    pct: function(n) {
        return n.toFixed(2) + '%';
    }
};

// CSS animations
if (!document.getElementById('calc-utils-style')) {
    const style = document.createElement('style');
    style.id = 'calc-utils-style';
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
    `;
    document.head.appendChild(style);
}
