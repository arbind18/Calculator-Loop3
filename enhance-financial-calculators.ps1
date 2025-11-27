# PowerShell Script to enhance Financial calculators

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Enhancing Financial Calculators" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ROI Calculator Enhancement
$roiContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ROI Calculator - Return on Investment</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.container{max-width:800px;width:100%;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);padding:40px}h1{color:#333;text-align:center;margin-bottom:10px;font-size:1.9rem}.subtitle{text-align:center;color:#666;margin-bottom:30px;font-size:0.95rem}.input-group{margin-bottom:20px}label{display:block;margin-bottom:8px;color:#555;font-weight:600}input{width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem;transition:border-color 0.3s}input:focus{outline:none;border-color:#667eea}.btn{width:100%;padding:15px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:1.1rem;cursor:pointer;margin-top:20px;transition:transform 0.2s}.btn:hover{transform:translateY(-2px)}.result{margin-top:30px;padding:25px;background:#f8f9fa;border-radius:12px;text-align:center;display:none}.result-value{font-size:2.5rem;font-weight:bold;margin:15px 0}.back-link{display:inline-block;margin-top:20px;color:#667eea;text-decoration:none;font-weight:600}.back-link:hover{text-decoration:underline}.positive{color:#10b981}.negative{color:#ef4444}</style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-chart-pie"></i> ROI Calculator</h1>
        <p class="subtitle">Calculate Return on Investment Percentage</p>
        
        <div class="input-group">
            <label>Initial Investment ($)</label>
            <input type="number" id="initial" value="10000" min="0" step="100">
        </div>
        
        <div class="input-group">
            <label>Final Value ($)</label>
            <input type="number" id="final" value="15000" min="0" step="100">
        </div>
        
        <div class="input-group">
            <label>Additional Costs (optional) ($)</label>
            <input type="number" id="costs" value="0" min="0" step="10">
        </div>
        
        <button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate ROI</button>
        
        <div class="result" id="result">
            <h2>Return on Investment</h2>
            <div class="result-value" id="roiValue">0%</div>
            <div style="text-align:left;max-width:400px;margin:20px auto 0;">
                <p style="display:flex;justify-content:space-between;margin:8px 0;"><span>Net Profit:</span><strong id="profit">$0</strong></p>
                <p style="display:flex;justify-content:space-between;margin:8px 0;"><span>Total Investment:</span><strong id="totalInv">$0</strong></p>
                <p style="display:flex;justify-content:space-between;margin:8px 0;"><span>ROI Percentage:</span><strong id="roiPct">0%</strong></p>
            </div>
        </div>
        
        <a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back</a>
    </div>
    
    <script>
        function calc(){
            const initial=parseFloat(document.getElementById('initial').value)||0;
            const final=parseFloat(document.getElementById('final').value)||0;
            const costs=parseFloat(document.getElementById('costs').value)||0;
            
            if(initial>0){
                const totalInvestment=initial+costs;
                const netProfit=final-totalInvestment;
                const roi=(netProfit/totalInvestment)*100;
                
                const roiClass=roi>=0?'positive':'negative';
                document.getElementById('roiValue').textContent=roi.toFixed(2)+'%';
                document.getElementById('roiValue').className='result-value '+roiClass;
                document.getElementById('profit').textContent='$'+netProfit.toLocaleString('en-US',{minimumFractionDigits:2});
                document.getElementById('profit').style.color=roi>=0?'#10b981':'#ef4444';
                document.getElementById('totalInv').textContent='$'+totalInvestment.toLocaleString('en-US',{minimumFractionDigits:2});
                document.getElementById('roiPct').textContent=roi.toFixed(2)+'%';
                document.getElementById('roiPct').style.color=roi>=0?'#10b981':'#ef4444';
                document.getElementById('result').style.display='block';
            }else{
                alert('Please enter a valid initial investment');
            }
        }
        
        document.querySelectorAll('input').forEach(el=>el.addEventListener('input',calc));
        calc();
    </script>
</body>
</html>
'@

$roiContent | Out-File -FilePath "Financial\Profitability & ROI\ROI-Calculator.html" -Encoding UTF8
Write-Host "[1/10] Enhanced: ROI Calculator" -ForegroundColor Green

# Savings Calculator
$savingsContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Savings Calculator</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.container{max-width:800px;width:100%;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);padding:40px}h1{color:#333;text-align:center;margin-bottom:10px;font-size:1.9rem}.subtitle{text-align:center;color:#666;margin-bottom:30px}.input-group{margin-bottom:20px}label{display:block;margin-bottom:8px;color:#555;font-weight:600}input,select{width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem}input:focus{outline:none;border-color:#667eea}.btn{width:100%;padding:15px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:1.1rem;cursor:pointer;margin-top:20px}.result{margin-top:30px;padding:25px;background:#f8f9fa;border-radius:12px;text-align:center;display:none}.result-value{font-size:2.5rem;color:#10b981;font-weight:bold;margin:15px 0}.back-link{display:inline-block;margin-top:20px;color:#667eea;text-decoration:none;font-weight:600}</style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-piggy-bank"></i> Savings Calculator</h1>
        <p class="subtitle">See how your savings will grow over time</p>
        
        <div class="input-group">
            <label>Initial Savings ($)</label>
            <input type="number" id="initial" value="1000" min="0" step="100">
        </div>
        
        <div class="input-group">
            <label>Monthly Deposit ($)</label>
            <input type="number" id="monthly" value="500" min="0" step="50">
        </div>
        
        <div class="input-group">
            <label>Annual Interest Rate (%)</label>
            <input type="number" id="rate" value="4" min="0" max="100" step="0.1">
        </div>
        
        <div class="input-group">
            <label>Time Period (years)</label>
            <input type="number" id="years" value="10" min="0.5" step="0.5">
        </div>
        
        <button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate Savings</button>
        
        <div class="result" id="result">
            <h2>Your Savings Will Grow To</h2>
            <div class="result-value" id="futureValue">$0</div>
            <div style="text-align:left;max-width:400px;margin:20px auto 0;">
                <p style="display:flex;justify-content:space-between;margin:10px 0;padding:10px;background:white;border-radius:8px;"><span>Total Deposits:</span><strong id="deposits">$0</strong></p>
                <p style="display:flex;justify-content:space-between;margin:10px 0;padding:10px;background:white;border-radius:8px;"><span>Interest Earned:</span><strong id="interest" style="color:#10b981">$0</strong></p>
            </div>
        </div>
        
        <a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back</a>
    </div>
    
    <script>
        function calc(){
            const initial=parseFloat(document.getElementById('initial').value)||0;
            const monthly=parseFloat(document.getElementById('monthly').value)||0;
            const rate=parseFloat(document.getElementById('rate').value)/100;
            const years=parseFloat(document.getElementById('years').value);
            
            if(years>0){
                const months=years*12;
                const monthlyRate=rate/12;
                
                const futureInitial=initial*Math.pow(1+monthlyRate,months);
                const futureMonthly=monthly*(Math.pow(1+monthlyRate,months)-1)/monthlyRate;
                const futureValue=futureInitial+futureMonthly;
                
                const totalDeposits=initial+monthly*months;
                const interestEarned=futureValue-totalDeposits;
                
                document.getElementById('futureValue').textContent='$'+futureValue.toLocaleString('en-US',{minimumFractionDigits:2});
                document.getElementById('deposits').textContent='$'+totalDeposits.toLocaleString('en-US',{minimumFractionDigits:2});
                document.getElementById('interest').textContent='$'+interestEarned.toLocaleString('en-US',{minimumFractionDigits:2});
                document.getElementById('result').style.display='block';
            }else{
                alert('Please enter valid values');
            }
        }
        
        document.querySelectorAll('input').forEach(el=>el.addEventListener('input',calc));
        calc();
    </script>
</body>
</html>
'@

$savingsContent | Out-File -FilePath "Financial\Savings & Budgeting\Savings-Calculator.html" -Encoding UTF8
Write-Host "[2/10] Enhanced: Savings Calculator" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Financial calculators enhanced!" -ForegroundColor Green
Write-Host "Updated: 2 calculators" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Yellow
