0258# Add Performance Optimizer to All Calculators
$calculatorsPath = "c:\Users\dell\Desktop\calculatorloop.com\Financial\Investment-and-Returns\"

$perfScript = '<script src="./calc-performance.js"></script>'

Write-Output "=== Adding Performance Optimizer ==="
Write-Output ""

$files = Get-ChildItem "$calculatorsPath*.html" -Exclude "*backup*"
$count = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Skip if already has performance script
        if ($content -match 'calc-performance\.js') {
            Write-Output "⏭️  SKIP: $($file.Name)"
            continue
        }
        
        # Add performance script before </head>
        if ($content -match '</head>') {
            $content = $content -replace '</head>', "    $perfScript`n</head>"
            $content | Out-File $file.FullName -Encoding UTF8 -NoNewline
            $count++
            Write-Output "✅ ADDED: $($file.Name)"
        }
        
    } catch {
        Write-Output "❌ ERROR: $($file.Name) - $($_.Exception.Message)"
    }
}

Write-Output ""
Write-Output "=== Summary ==="
Write-Output "✅ Enhanced: $count calculators"
Write-Output ""
Write-Output "🚀 Performance Features Added:"
Write-Output "   • Auto-save last calculation"
Write-Output "   • Keyboard shortcuts (Ctrl+Enter, Ctrl+S, Ctrl+D)"
Write-Output "   • Faster input handling with debounce"
Write-Output "   • Smart restore on page load"
