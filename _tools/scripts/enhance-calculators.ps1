# Enhance All Investment Calculators with Share & Download Buttons
$calculatorsPath = "c:\Users\dell\Desktop\calculatorloop.com\Financial\Investment-and-Returns\"

# Share & Download Button HTML/CSS/JS Template
$actionButtonsHTML = @'
        <div class="action-buttons">
            <button class="action-btn share-btn" onclick="shareCalc()"><i class="fas fa-share-alt"></i> Share</button>
            <button class="action-btn download-btn" onclick="downloadCalc()"><i class="fas fa-download"></i> Download PNG</button>
            <button class="action-btn print-btn" onclick="window.print()"><i class="fas fa-print"></i> Print</button>
        </div>
'@

$actionButtonsCSS = @'
        .action-buttons { display: flex; gap: 12px; margin: 25px 0; justify-content: center; flex-wrap: wrap; }
        .action-btn { padding: 12px 24px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .share-btn { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .share-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4); }
        .download-btn { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
        .download-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(240, 147, 251, 0.4); }
        .print-btn { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
        .print-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4); }
'@

$actionButtonsJS = @'
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script>
    function shareCalc() {
        const title = document.title;
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: title, text: 'Check out this calculator result!', url: url })
                .catch(() => copyLink(url));
        } else {
            copyLink(url);
        }
    }
    function copyLink(text) {
        navigator.clipboard.writeText(text).then(() => showToast('✓ Link copied!'));
    }
    function downloadCalc() {
        const elem = document.querySelector('.result') || document.querySelector('.container');
        if (!elem) { showToast('❌ No results to download'); return; }
        html2canvas(elem, { scale: 2, backgroundColor: '#fff', logging: false }).then(canvas => {
            const link = document.createElement('a');
            link.download = document.title.replace(/[^a-zA-Z0-9]/g, '_') + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('✓ Downloaded!');
        });
    }
    function showToast(msg) {
        const t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);animation:slideIn 0.3s';
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2500);
    }
    </script>
'@

Write-Output "=== Enhancing Investment Calculators ==="
Write-Output "Adding Share, Download, and Print buttons..."
Write-Output ""

$files = Get-ChildItem "$calculatorsPath*.html" -Exclude "*backup*"
$count = 0
$errors = @()

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Skip if already enhanced
        if ($content -match 'shareCalc\(\)' -or $content -match 'action-buttons') {
            Write-Output "⏭️  SKIP: $($file.Name) (already enhanced)"
            continue
        }
        
        # Add CSS before </style>
        if ($content -match '</style>') {
            $content = $content -replace '</style>', "$actionButtonsCSS`n    </style>"
        }
        
        # Add buttons after result div or before back-link
        if ($content -match '<div class="result"[^>]*>') {
            $content = $content -replace '(<div class="result"[^>]*>)', "`$1`n$actionButtonsHTML"
        } elseif ($content -match '<a[^>]*class="back-link"') {
            $content = $content -replace '(<a[^>]*class="back-link")', "$actionButtonsHTML`n        `$1"
        }
        
        # Add JS before </body>
        if ($content -match '</body>') {
            $content = $content -replace '</body>', "$actionButtonsJS`n</body>"
        }
        
        # Save enhanced file
        $content | Out-File $file.FullName -Encoding UTF8 -NoNewline
        
        $count++
        Write-Output "✅ ENHANCED: $($file.Name)"
        
    } catch {
        $errors += "$($file.Name): $($_.Exception.Message)"
        Write-Output "❌ ERROR: $($file.Name)"
    }
}

Write-Output ""
Write-Output "=== Summary ==="
Write-Output "✅ Enhanced: $count calculators"
Write-Output "⏭️  Skipped: $($files.Count - $count - $errors.Count) calculators"
if ($errors.Count -gt 0) {
    Write-Output "❌ Errors: $($errors.Count)"
    $errors | ForEach-Object { Write-Output "   $_" }
}
Write-Output ""
Write-Output "🎉 All calculators now have Share, Download & Print buttons!"
