$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root 'public'

function Write-IconPng {
  param(
    [Parameter(Mandatory=$true)][int]$Size,
    [Parameter(Mandatory=$true)][string]$FileName
  )

  $outPath = Join-Path $public $FileName

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  # Brand colors (already used across the site)
  $c1 = [System.Drawing.ColorTranslator]::FromHtml('#00D4FF')
  $c2 = [System.Drawing.ColorTranslator]::FromHtml('#8B5CF6')

  # Full-bleed gradient background
  $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
  $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 45)
  $g.FillRectangle($bgBrush, $rect)

  # Rounded inner panel (subtle highlight) to look like an app icon
  $pad = [Math]::Max(1, [Math]::Round($Size * 0.08))
  $inner = New-Object System.Drawing.RectangleF $pad, $pad, ($Size - 2*$pad), ($Size - 2*$pad)
  $radius = [Math]::Max(2, [Math]::Round($Size * 0.20))
  $d = $radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($inner.X, $inner.Y, $d, $d, 180, 90) | Out-Null
  $path.AddArc($inner.Right - $d, $inner.Y, $d, $d, 270, 90) | Out-Null
  $path.AddArc($inner.Right - $d, $inner.Bottom - $d, $d, $d, 0, 90) | Out-Null
  $path.AddArc($inner.X, $inner.Bottom - $d, $d, $d, 90, 90) | Out-Null
  $path.CloseFigure() | Out-Null
  $overlay = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 255, 255, 255))
  $g.FillPath($overlay, $path)

  # Corner accent dot (matches navbar/logo vibe)
  $dot = [Math]::Max(2, [Math]::Round($Size * 0.13))
  $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#F59E0B'))
  $g.FillEllipse($dotBrush, $pad - 1, $pad - 1, $dot, $dot)

  # Text mark
  $fontSize = [Math]::Max(8, [Math]::Round($Size * 0.42))
  $font = New-Object System.Drawing.Font('Arial', [float]$fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $fmt = New-Object System.Drawing.StringFormat
  $fmt.Alignment = [System.Drawing.StringAlignment]::Center
  $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
  $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 255, 255, 255))
  $textRect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $g.DrawString('CL', $font, $textBrush, $textRect, $fmt)

  $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $textBrush.Dispose()
  $fmt.Dispose()
  $font.Dispose()
  $dotBrush.Dispose()
  $overlay.Dispose()
  $path.Dispose()
  $bgBrush.Dispose()
  $g.Dispose()
  $bmp.Dispose()

  return $outPath
}

Write-IconPng -Size 16  -FileName 'favicon-16.png' | Out-Null
Write-IconPng -Size 32  -FileName 'favicon-32.png' | Out-Null
Write-IconPng -Size 48  -FileName 'favicon-48.png' | Out-Null
Write-IconPng -Size 192 -FileName 'icon-192.png' | Out-Null
Write-IconPng -Size 512 -FileName 'icon-512.png' | Out-Null
Write-IconPng -Size 180 -FileName 'apple-touch-icon.png' | Out-Null

'Generated:'
Get-ChildItem $public -Filter '*.png' |
  Where-Object { $_.Name -in @('favicon-16.png','favicon-32.png','favicon-48.png','icon-192.png','icon-512.png','apple-touch-icon.png') } |
  Select-Object Name, Length |
  Format-Table -AutoSize
