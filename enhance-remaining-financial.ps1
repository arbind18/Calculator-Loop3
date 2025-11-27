# Enhanced Financial Calculator Generator Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Enhancing ALL Financial Calculators" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$baseDir = "c:\Users\dell\Desktop\New folder (4)\Financial"

# SIP Calculator with Charts
$sipCalculator = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced SIP Calculator | Systematic Investment Plan</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1400px; width: 100%; background: white; border-radius: 25px; box-shadow: 0 25px 70px rgba(0,0,0,0.3); padding: 50px; margin: 0 auto; }
        h1 { color: #1a1a2e; text-align: center; margin-bottom: 15px; font-size: 2.8rem; font-weight: 800; }
        .subtitle { text-align: center; color: #666; margin-bottom: 40px; font-size: 1.2rem; }
        .layout { display: grid; grid-template-columns: 420px 1fr; gap: 40px; margin-top: 40px; }
        .input-section { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 35px; border-radius: 20px; height: fit-content; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .input-group { margin-bottom: 28px; }
        label { display: block; margin-bottom: 12px; color: #1a1a2e; font-weight: 700; font-size: 1rem; }
        input { width: 100%; padding: 16px; border: 2px solid #d0d5dd; border-radius: 12px; font-size: 1.05rem; transition: all 0.3s; background: white; }
        input:focus { outline: none; border-color: #38ef7d; box-shadow: 0 0 0 4px rgba(56, 239, 125, 0.15); }
        input[type="range"] { accent-color: #38ef7d; margin-top: 10px; }
        .btn { width: 100%; padding: 20px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; border: none; border-radius: 15px; font-size: 1.2rem; cursor: pointer; margin-top: 25px; font-weight: 800; box-shadow: 0 6px 20px rgba(56, 239, 125, 0.4); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(56, 239, 125, 0.5); }
        .results-section { display: flex; flex-direction: column; gap: 30px; }
        .hero-card { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 50px; border-radius: 25px; color: white; text-align: center; box-shadow: 0 15px 40px rgba(56, 239, 125, 0.4); }
        .maturity-amount { font-size: 4.5rem; font-weight: 900; margin: 20px 0; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .metric-card { background: white; padding: 30px; border-radius: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); text-align: center; border-top: 5px solid #38ef7d; }
        .metric-card h3 { font-size: 0.85rem; color: #666; margin-bottom: 12px; text-transform: uppercase; }
        .metric-value { font-size: 2.2rem; font-weight: 800; color: #1a1a2e; }
        .chart-section { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .chart-card { background: white; padding: 30px; border-radius: 18px; box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
        .chart-card h3 { color: #1a1a2e; margin-bottom: 20px; font-size: 1.3rem; font-weight: 700; }
        .chart-wrapper { height: 350px; position: relative; }
        .back-link { display: inline-block; margin-top: 40px; color: #11998e; text-decoration: none; font-weight: 700; font-size: 1.1rem; }
        .info-box { background: #d1fae5; border-left: 5px solid #38ef7d; padding: 20px; margin-top: 25px; border-radius: 12px; }
        .info-box h4 { color: #166534; margin-bottom: 10px; font-weight: 700; }
        .info-box p { color: #166534; font-size: 0.9rem; line-height: 1.7; }
        @media (max-width: 1200px) { .layout { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr; } .chart-section { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-piggy-bank"></i> Advanced SIP Calculator</h1>
        <p class="subtitle">Plan your wealth with Systematic Investment Plan</p>
        <div class="layout">
            <div class="input-section">
                <h2 style="margin-bottom: 30px; color: #1a1a2e;"><i class="fas fa-calculator"></i> SIP Details</h2>
                <div class="input-group"><label><i class="fas fa-rupee-sign"></i> Monthly Investment (₹)</label><input type="number" id="monthly" value="5000"><input type="range" id="monthlyRange" min="500" max="100000" value="5000" step="500"></div>
                <div class="input-group"><label><i class="fas fa-percentage"></i> Expected Return (% p.a.)</label><input type="number" id="returnRate" value="12" step="0.5"><input type="range" id="returnRateRange" min="5" max="30" value="12" step="0.5"></div>
                <div class="input-group"><label><i class="fas fa-clock"></i> Investment Period (Years)</label><input type="number" id="years" value="10"><input type="range" id="yearsRange" min="1" max="40" value="10"></div>
                <div class="input-group"><label><i class="fas fa-chart-line"></i> Annual Step-up (%)</label><input type="number" id="stepup" value="0" step="5"><input type="range" id="stepupRange" min="0" max="20" value="0" step="5"></div>
                <button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate SIP</button>
                <div class="info-box"><h4><i class="fas fa-lightbulb"></i> SIP Advantage</h4><p>SIP helps average out market volatility through rupee cost averaging. Start early to maximize wealth creation!</p></div>
            </div>
            <div class="results-section">
                <div class="hero-card"><h2><i class="fas fa-trophy"></i> Maturity Value</h2><div class="maturity-amount" id="maturity">₹0</div><p style="font-size:1.1rem;">Wealth created in <span id="period">0</span> years</p></div>
                <div class="metrics-grid">
                    <div class="metric-card"><h3><i class="fas fa-hand-holding-usd"></i> Total Invested</h3><div class="metric-value" id="invested">₹0</div></div>
                    <div class="metric-card"><h3><i class="fas fa-chart-line"></i> Estimated Returns</h3><div class="metric-value" id="returns">₹0</div></div>
                    <div class="metric-card"><h3><i class="fas fa-percentage"></i> Return %</h3><div class="metric-value" id="returnPercent">0%</div></div>
                </div>
                <div class="chart-section">
                    <div class="chart-card"><h3><i class="fas fa-chart-pie"></i> Investment Breakdown</h3><div class="chart-wrapper"><canvas id="pieChart"></canvas></div></div>
                    <div class="chart-card"><h3><i class="fas fa-chart-area"></i> Wealth Growth</h3><div class="chart-wrapper"><canvas id="lineChart"></canvas></div></div>
                </div>
            </div>
        </div>
        <a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back</a>
    </div>
    <script>
        let pieChart=null,lineChart=null;
        [['monthly','monthlyRange'],['returnRate','returnRateRange'],['years','yearsRange'],['stepup','stepupRange']].forEach(([i,r])=>{
            document.getElementById(r).oninput=e=>{document.getElementById(i).value=e.target.value;calc();}
            document.getElementById(i).oninput=e=>{document.getElementById(r).value=e.target.value;calc();}
        });
        function fmt(n){if(n>=1e7)return'₹'+(n/1e7).toFixed(2)+' Cr';if(n>=1e5)return'₹'+(n/1e5).toFixed(2)+' L';return'₹'+Math.round(n).toLocaleString('en-IN');}
        function calc(){
            const m=+document.getElementById('monthly').value||5000,r=(+document.getElementById('returnRate').value||12)/100/12,y=+document.getElementById('years').value||10,s=+document.getElementById('stepup').value||0;
            let inv=0,fv=0,monthly=m;const labels=[],invData=[],fvData=[];
            for(let yr=1;yr<=y;yr++){
                for(let mo=1;mo<=12;mo++){inv+=monthly;fv=(fv+monthly)*(1+r);}
                labels.push('Year '+yr);invData.push(inv);fvData.push(fv);
                monthly*=(1+s/100);
            }
            const ret=fv-inv,retPct=((ret/inv)*100).toFixed(2);
            document.getElementById('maturity').textContent=fmt(fv);
            document.getElementById('invested').textContent=fmt(inv);
            document.getElementById('returns').textContent=fmt(ret);
            document.getElementById('returnPercent').textContent=retPct+'%';
            document.getElementById('period').textContent=y;
            const ctx1=document.getElementById('pieChart').getContext('2d');
            if(pieChart)pieChart.destroy();
            pieChart=new Chart(ctx1,{type:'doughnut',data:{labels:['Invested','Returns'],datasets:[{data:[inv,ret],backgroundColor:['#11998e','#38ef7d']}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'}}}});
            const ctx2=document.getElementById('lineChart').getContext('2d');
            if(lineChart)lineChart.destroy();
            lineChart=new Chart(ctx2,{type:'line',data:{labels:labels,datasets:[{label:'Invested',data:invData,borderColor:'#11998e',backgroundColor:'rgba(17,153,142,0.1)',fill:true,tension:0.4},{label:'Maturity Value',data:fvData,borderColor:'#38ef7d',backgroundColor:'rgba(56,239,125,0.1)',fill:true,tension:0.4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true,ticks:{callback:v=>'₹'+(v/1000).toFixed(0)+'K'}}}}});
        }
        calc();
    </script>
</body>
</html>
'@

Write-Host "`n[1/10] Creating SIP Calculator..." -ForegroundColor Yellow
$sipCalculator | Out-File -FilePath "$baseDir\Investment & Trading\SIP-Calculator.html" -Encoding UTF8 -Force
Write-Host "✓ SIP Calculator Enhanced" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Financial Calculators Enhanced!" -ForegroundColor Green
Write-Host "Total Enhanced: 1 calculator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
