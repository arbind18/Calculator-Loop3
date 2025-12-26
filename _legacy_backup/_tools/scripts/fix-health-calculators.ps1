# PowerShell Script to Add Missing Functions to Health Calculators
# This script adds toggleDarkMode() and FAQ accordion functionality

Write-Host "🔧 Starting Health Calculator Fix Script..." -ForegroundColor Cyan
Write-Host ""

# Define the toggleDarkMode function to be added
$darkModeFunction = @'

// Dark Mode Toggle Function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    const icon = document.querySelector('.dark-mode-toggle i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.dark-mode-toggle i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
});
'@

# Get all HTML files in Health subdirectories
$healthFiles = Get-ChildItem -Path ".\Health" -Filter "*.html" -Recurse

$processedCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($file in $healthFiles) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Check if toggleDarkMode already exists
        if ($content -match 'function toggleDarkMode\(\)') {
            Write-Host "⏭️  Skipped: $($file.Name) - toggleDarkMode already exists" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Check if file has the closing script tag pattern
        if ($content -match '</script>\s*</body>\s*</html>\s*$') {
            # Add the function before the closing script tag
            $newContent = $content -replace '(</script>\s*</body>\s*</html>)', "$darkModeFunction`$1"
            
            # Write back to file
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
            Write-Host "✅ Fixed: $($file.Name)" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "⚠️  Warning: $($file.Name) - Unexpected file structure" -ForegroundColor Yellow
            $skippedCount++
        }
    } catch {
        Write-Host "❌ Error processing $($file.Name): $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "  ✅ Successfully processed: $processedCount files" -ForegroundColor Green
Write-Host "  ⏭️  Skipped: $skippedCount files" -ForegroundColor Yellow
Write-Host "  ❌ Errors: $errorCount files" -ForegroundColor Red
Write-Host ""
Write-Host "🎉 Health Calculator Fix Complete!" -ForegroundColor Green
