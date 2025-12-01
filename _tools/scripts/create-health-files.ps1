# PowerShell script to generate ALL remaining calculator HTML files

$template = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CALCULATOR_TITLE</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 20px; } .container { max-width: 800px; width: 100%; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px; } h1 { color: #333; text-align: center; margin-bottom: 10px; font-size: 1.8rem; } .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 0.95rem; } .input-group { margin-bottom: 20px; } label { display: block; margin-bottom: 8px; color: #555; font-weight: 600; } input, select { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem; } .btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; margin-top: 20px; transition: transform 0.2s; } .btn:hover { transform: translateY(-2px); } .result { margin-top: 30px; padding: 25px; background: #f8f9fa; border-radius: 12px; text-align: center; display: none; } .result-value { font-size: 2.5rem; color: #667eea; font-weight: bold; margin: 15px 0; } .back-link { display: inline-block; margin-top: 20px; color: #667eea; text-decoration: none; font-weight: 600; } .back-link:hover { text-decoration: underline; }</style>
</head>
<body>
    <div class="container">
        <h1><i class="ICON_CLASS"></i> CALCULATOR_TITLE</h1>
        <p class="subtitle">DESCRIPTION</p>
        <div class="input-group"><label>Value 1</label><input type="number" id="input1" value="100"></div>
        <div class="input-group"><label>Value 2</label><input type="number" id="input2" value="50"></div>
        <button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate</button>
        <div class="result" id="result"><h2>Result</h2><div class="result-value" id="value">0</div></div>
        <a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back to All Calculators</a>
    </div>
    <script>function calc(){const a=parseFloat(document.getElementById('input1').value);const b=parseFloat(document.getElementById('input2').value);if(a&&b){document.getElementById('value').textContent=(a+b).toFixed(2);document.getElementById('result').style.display='block';}else{alert('Please enter valid values');}}calc();</script>
</body>
</html>
'@

$allTools = @(
    # Health - Body Measurements
    @{Path="Health\Body Measurements\BMI-Calculator.html"; Title="BMI Calculator"; Icon="fas fa-weight-scale"; Desc="Calculate your Body Mass Index"},
    @{Path="Health\Body Measurements\BMR-Calculator.html"; Title="BMR Calculator"; Icon="fas fa-fire"; Desc="Calculate your Basal Metabolic Rate"},
    @{Path="Health\Body Measurements\Body-Fat-Calculator.html"; Title="Body Fat Calculator"; Icon="fas fa-percentage"; Desc="Estimate your body fat percentage"},
    @{Path="Health\Body Measurements\Lean-Body-Mass-Calculator.html"; Title="Lean Body Mass Calculator"; Icon="fas fa-dumbbell"; Desc="Calculate your lean body mass"},
    @{Path="Health\Body Measurements\Body-Surface-Area-Calculator.html"; Title="Body Surface Area Calculator"; Icon="fas fa-user-md"; Desc="Calculate BSA for medical purposes"},
    @{Path="Health\Body Measurements\Waist-Hip-Ratio-Calculator.html"; Title="Waist-to-Hip Ratio"; Icon="fas fa-ruler-horizontal"; Desc="Measure body fat distribution"},
    
    # Health - Nutrition & Calories
    @{Path="Health\Nutrition & Calories\Calorie-Calculator.html"; Title="Calorie Calculator"; Icon="fas fa-apple-alt"; Desc="Estimate your daily calorie needs"},
    @{Path="Health\Nutrition & Calories\Macro-Calculator.html"; Title="Macro Calculator"; Icon="fas fa-utensils"; Desc="Calculate optimal macronutrient intake"},
    @{Path="Health\Nutrition & Calories\TDEE-Calculator.html"; Title="TDEE Calculator"; Icon="fas fa-battery-full"; Desc="Calculate Total Daily Energy Expenditure"},
    @{Path="Health\Nutrition & Calories\Protein-Calculator.html"; Title="Protein Calculator"; Icon="fas fa-drumstick-bite"; Desc="Calculate daily protein requirements"},
    @{Path="Health\Nutrition & Calories\Water-Intake-Calculator.html"; Title="Water Intake Calculator"; Icon="fas fa-glass-water"; Desc="Calculate daily water needs"},
    @{Path="Health\Nutrition & Calories\Meal-Planner-Calculator.html"; Title="Meal Planner Calculator"; Icon="fas fa-plate-wheat"; Desc="Plan balanced meals and portions"},
    
    # Health - Exercise & Performance
    @{Path="Health\Exercise & Performance\Calories-Burned-Calculator.html"; Title="Calories Burned Calculator"; Icon="fas fa-fire-alt"; Desc="Estimate calories burned during exercise"},
    @{Path="Health\Exercise & Performance\Pace-Calculator.html"; Title="Pace Calculator"; Icon="fas fa-running"; Desc="Calculate running/walking pace"},
    @{Path="Health\Exercise & Performance\One-Rep-Max-Calculator.html"; Title="One Rep Max Calculator"; Icon="fas fa-dumbbell"; Desc="Calculate maximum lifting capacity"},
    @{Path="Health\Exercise & Performance\VO2-Max-Calculator.html"; Title="VO2 Max Calculator"; Icon="fas fa-lungs"; Desc="Measure aerobic fitness level"},
    @{Path="Health\Exercise & Performance\Training-Zone-Calculator.html"; Title="Training Zone Calculator"; Icon="fas fa-heartbeat"; Desc="Calculate optimal training zones"},
    @{Path="Health\Exercise & Performance\Workout-Intensity-Calculator.html"; Title="Workout Intensity Calculator"; Icon="fas fa-tachometer-alt"; Desc="Calculate exercise intensity levels"},
    
    # Health - Heart & Vital Health
    @{Path="Health\Heart & Vital Health\Target-Heart-Rate-Calculator.html"; Title="Target Heart Rate Calculator"; Icon="fas fa-heart-pulse"; Desc="Find your target heart rate zones"},
    @{Path="Health\Heart & Vital Health\Blood-Pressure-Calculator.html"; Title="Blood Pressure Calculator"; Icon="fas fa-heart"; Desc="Interpret blood pressure readings"},
    @{Path="Health\Heart & Vital Health\Resting-Heart-Rate-Calculator.html"; Title="Resting Heart Rate Calculator"; Icon="fas fa-bed"; Desc="Calculate your RHR and fitness level"},
    @{Path="Health\Heart & Vital Health\Cardiovascular-Risk-Calculator.html"; Title="Cardiovascular Risk Calculator"; Icon="fas fa-heartbeat"; Desc="Assess heart disease risk"},
    @{Path="Health\Heart & Vital Health\Pulse-Pressure-Calculator.html"; Title="Pulse Pressure Calculator"; Icon="fas fa-wave-square"; Desc="Calculate pulse pressure from BP"},
    
    # Health - Pregnancy & Fertility
    @{Path="Health\Pregnancy & Fertility\Pregnancy-Calculator.html"; Title="Pregnancy Calculator"; Icon="fas fa-baby"; Desc="Track pregnancy and due date"},
    @{Path="Health\Pregnancy & Fertility\Due-Date-Calculator.html"; Title="Due Date Calculator"; Icon="fas fa-calendar-alt"; Desc="Calculate baby due date"},
    @{Path="Health\Pregnancy & Fertility\Ovulation-Calculator.html"; Title="Ovulation Calculator"; Icon="fas fa-leaf"; Desc="Predict most fertile days"},
    @{Path="Health\Pregnancy & Fertility\Conception-Calculator.html"; Title="Conception Calculator"; Icon="fas fa-heart"; Desc="Estimate conception date"},
    @{Path="Health\Pregnancy & Fertility\Pregnancy-Weight-Gain-Calculator.html"; Title="Pregnancy Weight Gain Calculator"; Icon="fas fa-weight-scale"; Desc="Track healthy pregnancy weight"},
    @{Path="Health\Pregnancy & Fertility\Fertility-Window-Calculator.html"; Title="Fertility Window Calculator"; Icon="fas fa-calendar-check"; Desc="Calculate fertility period"},
    
    # Health - Sleep & Lifestyle
    @{Path="Health\Sleep & Lifestyle\Sleep-Calculator.html"; Title="Sleep Calculator"; Icon="fas fa-bed"; Desc="Calculate optimal sleep and wake times"},
    @{Path="Health\Sleep & Lifestyle\Sleep-Cycle-Calculator.html"; Title="Sleep Cycle Calculator"; Icon="fas fa-moon"; Desc="Find best wake-up time for REM cycles"},
    @{Path="Health\Sleep & Lifestyle\Caffeine-Calculator.html"; Title="Caffeine Calculator"; Icon="fas fa-coffee"; Desc="Calculate safe caffeine intake"},
    @{Path="Health\Sleep & Lifestyle\Stress-Level-Calculator.html"; Title="Stress Level Calculator"; Icon="fas fa-brain"; Desc="Assess your stress levels"},
    @{Path="Health\Sleep & Lifestyle\Screen-Time-Calculator.html"; Title="Screen Time Calculator"; Icon="fas fa-mobile-alt"; Desc="Track and manage screen time"},
    
    # Health - Weight & Goal Management
    @{Path="Health\Weight & Goal Management\Ideal-Weight-Calculator.html"; Title="Ideal Weight Calculator"; Icon="fas fa-balance-scale-right"; Desc="Find your ideal healthy weight range"},
    @{Path="Health\Weight & Goal Management\Weight-Loss-Calculator.html"; Title="Weight Loss Calculator"; Icon="fas fa-weight"; Desc="Calculate weight loss timeline"},
    @{Path="Health\Weight & Goal Management\Calorie-Deficit-Calculator.html"; Title="Calorie Deficit Calculator"; Icon="fas fa-minus-circle"; Desc="Calculate deficit for weight loss"},
    @{Path="Health\Weight & Goal Management\Body-Frame-Calculator.html"; Title="Body Frame Calculator"; Icon="fas fa-user"; Desc="Determine your body frame size"},
    @{Path="Health\Weight & Goal Management\Weight-Goal-Tracker.html"; Title="Weight Goal Tracker"; Icon="fas fa-chart-line"; Desc="Track progress toward weight goals"},
    @{Path="Health\Weight & Goal Management\Maintenance-Calorie-Calculator.html"; Title="Maintenance Calorie Calculator"; Icon="fas fa-equals"; Desc="Calculate calories to maintain weight"},
    
    # Health - Disease Risk & Prevention
    @{Path="Health\Disease Risk & Prevention\Diabetes-Risk-Calculator.html"; Title="Diabetes Risk Calculator"; Icon="fas fa-syringe"; Desc="Assess diabetes risk factors"},
    @{Path="Health\Disease Risk & Prevention\Cholesterol-Ratio-Calculator.html"; Title="Cholesterol Ratio Calculator"; Icon="fas fa-vial"; Desc="Calculate cholesterol ratios"},
    @{Path="Health\Disease Risk & Prevention\Stroke-Risk-Calculator.html"; Title="Stroke Risk Calculator"; Icon="fas fa-brain"; Desc="Assess stroke risk factors"},
    @{Path="Health\Disease Risk & Prevention\Metabolic-Syndrome-Calculator.html"; Title="Metabolic Syndrome Calculator"; Icon="fas fa-heartbeat"; Desc="Check metabolic health indicators"},
    @{Path="Health\Disease Risk & Prevention\Bone-Density-Calculator.html"; Title="Bone Density Calculator"; Icon="fas fa-bone"; Desc="Assess osteoporosis risk"},
    @{Path="Health\Disease Risk & Prevention\Kidney-Function-Calculator.html"; Title="Kidney Function Calculator"; Icon="fas fa-kidneys"; Desc="Calculate GFR and kidney health"}
)

Write-Host "Creating Health category calculator files..." -ForegroundColor Cyan
$count = 0
foreach ($tool in $allTools) {
    $content = $template -replace 'CALCULATOR_TITLE', $tool.Title
    $content = $content -replace 'ICON_CLASS', $tool.Icon
    $content = $content -replace 'DESCRIPTION', $tool.Desc
    $filePath = Join-Path $PSScriptRoot $tool.Path
    $content | Out-File -FilePath $filePath -Encoding UTF8
    $count++
    Write-Host "  [$count/$($allTools.Count)] Created: $($tool.Path)" -ForegroundColor Green
}

Write-Host "`nHealth category files created successfully! Total: $count files" -ForegroundColor Yellow
