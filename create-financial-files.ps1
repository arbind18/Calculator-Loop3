# PowerShell script to generate calculator HTML files

$template = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CALCULATOR_TITLE</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; } .container { max-width: 800px; width: 100%; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px; } h1 { color: #333; text-align: center; margin-bottom: 30px; } .input-group { margin-bottom: 20px; } label { display: block; margin-bottom: 8px; color: #555; font-weight: 600; } input { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; } .btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; margin-top: 20px; } .result { margin-top: 30px; padding: 25px; background: #f8f9fa; border-radius: 12px; text-align: center; display: none; } .result-value { font-size: 2rem; color: #667eea; font-weight: bold; } .back-link { display: inline-block; margin-top: 20px; color: #667eea; text-decoration: none; }</style>
</head>
<body>
    <div class="container">
        <h1><i class="ICON_CLASS"></i> CALCULATOR_TITLE</h1>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">DESCRIPTION</p>
        <div class="input-group"><label>Input 1</label><input type="number" id="input1" value="100"></div>
        <div class="input-group"><label>Input 2</label><input type="number" id="input2" value="50"></div>
        <button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate</button>
        <div class="result" id="result"><h2>Result</h2><div class="result-value" id="value">0</div></div>
        <a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to All Calculators</a>
    </div>
    <script>function calc(){const a=parseFloat(document.getElementById('input1').value);const b=parseFloat(document.getElementById('input2').value);if(a&&b){document.getElementById('value').textContent=(a+b).toFixed(2);document.getElementById('result').style.display='block';}else{alert('Please enter valid values');}}calc();</script>
</body>
</html>
'@

# Business & Accounting tools
$tools = @(
    @{Path="Financial\Business & Accounting\GST-Calculator.html"; Title="GST Calculator"; Icon="fas fa-receipt"; Desc="Calculate Goods and Services Tax"},
    @{Path="Financial\Business & Accounting\Invoice-Calculator.html"; Title="Invoice Calculator"; Icon="fas fa-file-invoice"; Desc="Create and calculate invoices"},
    @{Path="Financial\Business & Accounting\Profit-Margin-Calculator.html"; Title="Profit Margin Calculator"; Icon="fas fa-chart-pie"; Desc="Calculate profit margins and markup"},
    @{Path="Financial\Business & Accounting\Break-even-Calculator.html"; Title="Break-even Calculator"; Icon="fas fa-balance-scale"; Desc="Calculate break-even point for business"},
    
    # Taxation & Salary
    @{Path="Financial\Taxation & Salary\Tax-Calculator.html"; Title="Income Tax Calculator"; Icon="fas fa-file-invoice-dollar"; Desc="Calculate your estimated income tax"},
    @{Path="Financial\Taxation & Salary\Salary-Calculator.html"; Title="Salary Calculator"; Icon="fas fa-money-bill-wave"; Desc="Calculate net salary after deductions"},
    @{Path="Financial\Taxation & Salary\TDS-Calculator.html"; Title="TDS Calculator"; Icon="fas fa-receipt"; Desc="Calculate Tax Deducted at Source"},
    @{Path="Financial\Taxation & Salary\Bonus-Calculator.html"; Title="Bonus Calculator"; Icon="fas fa-gift"; Desc="Calculate employee bonus amounts"},
    
    # Savings & Budgeting
    @{Path="Financial\Savings & Budgeting\Savings-Calculator.html"; Title="Savings Calculator"; Icon="fas fa-piggy-bank"; Desc="See how your savings will grow"},
    @{Path="Financial\Savings & Budgeting\Budget-Calculator.html"; Title="Budget Calculator"; Icon="fas fa-calculator"; Desc="Plan your monthly budget"},
    @{Path="Financial\Savings & Budgeting\Emergency-Fund-Calculator.html"; Title="Emergency Fund Calculator"; Icon="fas fa-first-aid"; Desc="Calculate emergency fund needs"},
    @{Path="Financial\Savings & Budgeting\Expense-Tracker.html"; Title="Expense Tracker"; Icon="fas fa-wallet"; Desc="Track and analyze your expenses"},
    
    # Retirement Planning
    @{Path="Financial\Retirement & Future Planning\Retirement-Calculator.html"; Title="Retirement Calculator"; Icon="fas fa-umbrella-beach"; Desc="Plan your retirement savings"},
    @{Path="Financial\Retirement & Future Planning\Pension-Calculator.html"; Title="Pension Calculator"; Icon="fas fa-user-clock"; Desc="Calculate pension benefits"},
    @{Path="Financial\Retirement & Future Planning\Future-Value-Calculator.html"; Title="Future Value Calculator"; Icon="fas fa-forward"; Desc="Calculate future value of money"},
    @{Path="Financial\Retirement & Future Planning\College-Savings-Calculator.html"; Title="College Savings Calculator"; Icon="fas fa-graduation-cap"; Desc="Plan for education expenses"},
    
    # Currency Conversion
    @{Path="Financial\Currency & Value Conversion\Currency-Converter.html"; Title="Currency Converter"; Icon="fas fa-exchange-alt"; Desc="Convert between currencies"},
    @{Path="Financial\Currency & Value Conversion\Crypto-Converter.html"; Title="Crypto Converter"; Icon="fab fa-bitcoin"; Desc="Convert cryptocurrency values"},
    @{Path="Financial\Currency & Value Conversion\Inflation-Calculator.html"; Title="Inflation Calculator"; Icon="fas fa-chart-area"; Desc="Calculate impact of inflation"},
    @{Path="Financial\Currency & Value Conversion\Present-Value-Calculator.html"; Title="Present Value Calculator"; Icon="fas fa-clock"; Desc="Calculate present value"},
    
    # Profitability & ROI
    @{Path="Financial\Profitability & ROI\ROI-Calculator.html"; Title="ROI Calculator"; Icon="fas fa-chart-pie"; Desc="Calculate return on investment"},
    @{Path="Financial\Profitability & ROI\CAGR-Calculator.html"; Title="CAGR Calculator"; Icon="fas fa-chart-line"; Desc="Calculate Compound Annual Growth Rate"},
    @{Path="Financial\Profitability & ROI\Payback-Period-Calculator.html"; Title="Payback Period Calculator"; Icon="fas fa-hourglass-half"; Desc="Calculate investment payback period"},
    @{Path="Financial\Profitability & ROI\NPV-Calculator.html"; Title="NPV Calculator"; Icon="fas fa-funnel-dollar"; Desc="Calculate Net Present Value"},
    
    # Financial Ratios
    @{Path="Financial\Financial Ratios & Analysis\Debt-to-Income-Ratio.html"; Title="Debt-to-Income Ratio"; Icon="fas fa-balance-scale-right"; Desc="Calculate debt-to-income ratio"},
    @{Path="Financial\Financial Ratios & Analysis\Liquidity-Ratio-Calculator.html"; Title="Liquidity Ratio Calculator"; Icon="fas fa-water"; Desc="Calculate financial liquidity ratios"},
    @{Path="Financial\Financial Ratios & Analysis\PE-Ratio-Calculator.html"; Title="P/E Ratio Calculator"; Icon="fas fa-divide"; Desc="Calculate Price-to-Earnings ratio"},
    @{Path="Financial\Financial Ratios & Analysis\Net-Worth-Calculator.html"; Title="Net Worth Calculator"; Icon="fas fa-coins"; Desc="Calculate your total net worth"}
)

foreach ($tool in $tools) {
    $content = $template -replace 'CALCULATOR_TITLE', $tool.Title
    $content = $content -replace 'ICON_CLASS', $tool.Icon
    $content = $content -replace 'DESCRIPTION', $tool.Desc
    $filePath = Join-Path $PSScriptRoot $tool.Path
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "Created: $($tool.Path)"
}

Write-Host "`nFinancial category files created successfully!"
