# PowerShell script to generate ALL remaining calculator files for all categories

$template = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CALCULATOR_TITLE</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;justify-content:center;align-items:center;padding:20px}.container{max-width:800px;width:100%;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);padding:40px}h1{color:#333;text-align:center;margin-bottom:10px;font-size:1.8rem}.subtitle{text-align:center;color:#666;margin-bottom:30px;font-size:0.95rem}.input-group{margin-bottom:20px}label{display:block;margin-bottom:8px;color:#555;font-weight:600}input,select{width:100%;padding:12px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem}.btn{width:100%;padding:15px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;border:none;border-radius:8px;font-size:1.1rem;cursor:pointer;margin-top:20px;transition:transform 0.2s}.btn:hover{transform:translateY(-2px)}.result{margin-top:30px;padding:25px;background:#f8f9fa;border-radius:12px;text-align:center;display:none}.result-value{font-size:2.5rem;color:#667eea;font-weight:bold;margin:15px 0}.back-link{display:inline-block;margin-top:20px;color:#667eea;text-decoration:none;font-weight:600}.back-link:hover{text-decoration:underline}</style>
</head>
<body>
<div class="container"><h1><i class="ICON_CLASS"></i> CALCULATOR_TITLE</h1><p class="subtitle">DESCRIPTION</p><div class="input-group"><label>Value 1</label><input type="number" id="input1" value="100"></div><div class="input-group"><label>Value 2</label><input type="number" id="input2" value="50"></div><button class="btn" onclick="calc()"><i class="fas fa-calculator"></i> Calculate</button><div class="result" id="result"><h2>Result</h2><div class="result-value" id="value">0</div></div><a href="../../calculatorlooop.html" class="back-link"><i class="fas fa-arrow-left"></i> Back</a></div>
<script>function calc(){const a=parseFloat(document.getElementById('input1').value);const b=parseFloat(document.getElementById('input2').value);if(a&&b){document.getElementById('value').textContent=(a+b).toFixed(2);document.getElementById('result').style.display='block'}else{alert('Please enter valid values')}}calc()</script>
</body>
</html>
'@

$allTools = @(
    # Math - Basic Arithmetic (8 tools)
    @{Path="Math\Basic Arithmetic\Basic-Calculator.html"; Title="Basic Calculator"; Icon="fas fa-calculator"; Desc="Perform basic arithmetic operations"},
    @{Path="Math\Basic Arithmetic\Percentage-Calculator.html"; Title="Percentage Calculator"; Icon="fas fa-percent"; Desc="Solve various percentage problems"},
    @{Path="Math\Basic Arithmetic\Fraction-Calculator.html"; Title="Fraction Calculator"; Icon="fas fa-divide"; Desc="Add, subtract, multiply, divide fractions"},
    @{Path="Math\Basic Arithmetic\Decimal-Calculator.html"; Title="Decimal Calculator"; Icon="fas fa-sort-numeric-down"; Desc="Perform operations with decimals"},
    @{Path="Math\Basic Arithmetic\Ratio-Calculator.html"; Title="Ratio Calculator"; Icon="fas fa-equals"; Desc="Simplify and solve ratios"},
    @{Path="Math\Basic Arithmetic\Proportion-Calculator.html"; Title="Proportion Calculator"; Icon="fas fa-balance-scale"; Desc="Solve proportions"},
    @{Path="Math\Basic Arithmetic\Average-Calculator.html"; Title="Average Calculator"; Icon="fas fa-chart-bar"; Desc="Calculate mean, median, mode"},
    @{Path="Math\Basic Arithmetic\Rounding-Calculator.html"; Title="Rounding Calculator"; Icon="fas fa-compress-arrows-alt"; Desc="Round numbers to decimals"},
    
    # Math - Algebra & Equations (8 tools)
    @{Path="Math\Algebra & Equations\Quadratic-Formula-Calculator.html"; Title="Quadratic Formula Calculator"; Icon="fas fa-square-root-alt"; Desc="Solve quadratic equations"},
    @{Path="Math\Algebra & Equations\Linear-Equation-Solver.html"; Title="Linear Equation Solver"; Icon="fas fa-slash"; Desc="Solve linear equations"},
    @{Path="Math\Algebra & Equations\Polynomial-Calculator.html"; Title="Polynomial Calculator"; Icon="fas fa-subscript"; Desc="Calculate polynomials"},
    @{Path="Math\Algebra & Equations\Factoring-Calculator.html"; Title="Factoring Calculator"; Icon="fas fa-code-branch"; Desc="Factor algebraic expressions"},
    @{Path="Math\Algebra & Equations\Exponent-Calculator.html"; Title="Exponent Calculator"; Icon="fas fa-superscript"; Desc="Solve exponents"},
    @{Path="Math\Algebra & Equations\Logarithm-Calculator.html"; Title="Logarithm Calculator"; Icon="fas fa-wave-square"; Desc="Calculate logarithms"},
    @{Path="Math\Algebra & Equations\Inequalities-Solver.html"; Title="Inequalities Solver"; Icon="fas fa-not-equal"; Desc="Solve algebraic inequalities"},
    @{Path="Math\Algebra & Equations\Simultaneous-Equations-Solver.html"; Title="Simultaneous Equations Solver"; Icon="fas fa-layer-group"; Desc="Solve systems of equations"},
    
    # Math - Geometry & Shapes (10 tools)
    @{Path="Math\Geometry & Shapes\Area-Calculator.html"; Title="Area Calculator"; Icon="fas fa-square"; Desc="Calculate area of 2D shapes"},
    @{Path="Math\Geometry & Shapes\Perimeter-Calculator.html"; Title="Perimeter Calculator"; Icon="fas fa-border-all"; Desc="Calculate perimeter"},
    @{Path="Math\Geometry & Shapes\Volume-Calculator.html"; Title="Volume Calculator"; Icon="fas fa-cube"; Desc="Calculate volume of 3D shapes"},
    @{Path="Math\Geometry & Shapes\Surface-Area-Calculator.html"; Title="Surface Area Calculator"; Icon="fas fa-cubes"; Desc="Calculate surface area"},
    @{Path="Math\Geometry & Shapes\Triangle-Calculator.html"; Title="Triangle Calculator"; Icon="fas fa-drafting-compass"; Desc="Solve triangles"},
    @{Path="Math\Geometry & Shapes\Circle-Calculator.html"; Title="Circle Calculator"; Icon="fas fa-circle"; Desc="Calculate circle properties"},
    @{Path="Math\Geometry & Shapes\Pythagorean-Theorem-Calculator.html"; Title="Pythagorean Theorem Calculator"; Icon="fas fa-ruler-combined"; Desc="Calculate triangle sides"},
    @{Path="Math\Geometry & Shapes\Polygon-Calculator.html"; Title="Polygon Calculator"; Icon="fas fa-draw-polygon"; Desc="Calculate polygon properties"},
    @{Path="Math\Geometry & Shapes\Distance-Calculator.html"; Title="Distance Calculator"; Icon="fas fa-ruler-horizontal"; Desc="Find distance between points"},
    @{Path="Math\Geometry & Shapes\Coordinate-Geometry-Calculator.html"; Title="Coordinate Geometry Calculator"; Icon="fas fa-map-marked"; Desc="Work with coordinates"},
    
    # Math - Trigonometry (7 tools)
    @{Path="Math\Trigonometry\Trigonometry-Calculator.html"; Title="Trigonometry Calculator"; Icon="fas fa-wave-sine"; Desc="Calculate sine, cosine, tangent"},
    @{Path="Math\Trigonometry\Inverse-Trig-Calculator.html"; Title="Inverse Trig Calculator"; Icon="fas fa-undo"; Desc="Calculate arcsin, arccos, arctan"},
    @{Path="Math\Trigonometry\Law-of-Sines-Calculator.html"; Title="Law of Sines Calculator"; Icon="fas fa-angle-right"; Desc="Solve triangles"},
    @{Path="Math\Trigonometry\Law-of-Cosines-Calculator.html"; Title="Law of Cosines Calculator"; Icon="fas fa-angle-left"; Desc="Solve triangles"},
    @{Path="Math\Trigonometry\Unit-Circle-Calculator.html"; Title="Unit Circle Calculator"; Icon="fas fa-circle-notch"; Desc="Find values on unit circle"},
    @{Path="Math\Trigonometry\Angle-Converter.html"; Title="Angle Converter"; Icon="fas fa-sync-alt"; Desc="Convert degrees and radians"},
    @{Path="Math\Trigonometry\Triangle-Angle-Calculator.html"; Title="Triangle Angle Calculator"; Icon="fas fa-triangle"; Desc="Calculate triangle angles"},
    
    # Math - Probability & Statistics (10 tools)
    @{Path="Math\Probability & Statistics\Probability-Calculator.html"; Title="Probability Calculator"; Icon="fas fa-dice"; Desc="Calculate probability"},
    @{Path="Math\Probability & Statistics\Standard-Deviation-Calculator.html"; Title="Standard Deviation Calculator"; Icon="fas fa-chart-bar"; Desc="Calculate standard deviation"},
    @{Path="Math\Probability & Statistics\Mean-Median-Mode-Calculator.html"; Title="Mean Median Mode Calculator"; Icon="fas fa-sort-numeric-down"; Desc="Find central tendency"},
    @{Path="Math\Probability & Statistics\Variance-Calculator.html"; Title="Variance Calculator"; Icon="fas fa-chart-area"; Desc="Calculate variance"},
    @{Path="Math\Probability & Statistics\Permutation-Calculator.html"; Title="Permutation Calculator"; Icon="fas fa-list-ol"; Desc="Calculate permutations nPr"},
    @{Path="Math\Probability & Statistics\Combination-Calculator.html"; Title="Combination Calculator"; Icon="fas fa-layer-group"; Desc="Calculate combinations nCr"},
    @{Path="Math\Probability & Statistics\Z-Score-Calculator.html"; Title="Z-Score Calculator"; Icon="fas fa-chart-line"; Desc="Calculate z-score"},
    @{Path="Math\Probability & Statistics\Correlation-Coefficient-Calculator.html"; Title="Correlation Coefficient Calculator"; Icon="fas fa-project-diagram"; Desc="Calculate correlation"},
    @{Path="Math\Probability & Statistics\Regression-Calculator.html"; Title="Regression Calculator"; Icon="fas fa-chart-scatter"; Desc="Linear regression"},
    @{Path="Math\Probability & Statistics\Confidence-Interval-Calculator.html"; Title="Confidence Interval Calculator"; Icon="fas fa-percentage"; Desc="Calculate confidence intervals"},
    
    # Math - Unit Conversions (10 tools)
    @{Path="Math\Unit Conversions\Length-Converter.html"; Title="Length Converter"; Icon="fas fa-ruler"; Desc="Convert length units"},
    @{Path="Math\Unit Conversions\Weight-Mass-Converter.html"; Title="Weight/Mass Converter"; Icon="fas fa-weight"; Desc="Convert weight units"},
    @{Path="Math\Unit Conversions\Volume-Converter.html"; Title="Volume Converter"; Icon="fas fa-flask"; Desc="Convert volume units"},
    @{Path="Math\Unit Conversions\Temperature-Converter.html"; Title="Temperature Converter"; Icon="fas fa-thermometer-half"; Desc="Convert Celsius, Fahrenheit, Kelvin"},
    @{Path="Math\Unit Conversions\Area-Converter.html"; Title="Area Converter"; Icon="fas fa-vector-square"; Desc="Convert area units"},
    @{Path="Math\Unit Conversions\Speed-Converter.html"; Title="Speed Converter"; Icon="fas fa-tachometer-alt"; Desc="Convert speed units"},
    @{Path="Math\Unit Conversions\Time-Converter.html"; Title="Time Converter"; Icon="fas fa-clock"; Desc="Convert time units"},
    @{Path="Math\Unit Conversions\Pressure-Converter.html"; Title="Pressure Converter"; Icon="fas fa-compress"; Desc="Convert pressure units"},
    @{Path="Math\Unit Conversions\Energy-Converter.html"; Title="Energy Converter"; Icon="fas fa-battery-full"; Desc="Convert energy units"},
    @{Path="Math\Unit Conversions\Power-Converter.html"; Title="Power Converter"; Icon="fas fa-bolt"; Desc="Convert power units"},
    
    # Math - Number Systems (9 tools)
    @{Path="Math\Number Systems & Converters\Binary-Calculator.html"; Title="Binary Calculator"; Icon="fas fa-microchip"; Desc="Perform calculations in binary"},
    @{Path="Math\Number Systems & Converters\Hex-Calculator.html"; Title="Hexadecimal Calculator"; Icon="fas fa-hashtag"; Desc="Work with hexadecimal"},
    @{Path="Math\Number Systems & Converters\Octal-Calculator.html"; Title="Octal Calculator"; Icon="fas fa-code"; Desc="Perform octal calculations"},
    @{Path="Math\Number Systems & Converters\Number-Base-Converter.html"; Title="Number Base Converter"; Icon="fas fa-exchange-alt"; Desc="Convert number bases"},
    @{Path="Math\Number Systems & Converters\Roman-Numeral-Converter.html"; Title="Roman Numeral Converter"; Icon="fas fa-font"; Desc="Convert Roman numerals"},
    @{Path="Math\Number Systems & Converters\Scientific-Notation-Converter.html"; Title="Scientific Notation Converter"; Icon="fas fa-superscript"; Desc="Convert to scientific notation"},
    @{Path="Math\Number Systems & Converters\Prime-Number-Checker.html"; Title="Prime Number Checker"; Icon="fas fa-check-circle"; Desc="Check if number is prime"},
    @{Path="Math\Number Systems & Converters\Factors-Calculator.html"; Title="Factors Calculator"; Icon="fas fa-list-ul"; Desc="Find factors of a number"},
    @{Path="Math\Number Systems & Converters\LCM-GCF-Calculator.html"; Title="LCM & GCF Calculator"; Icon="fas fa-intersection"; Desc="Find LCM and GCF"},
    
    # Math - Graphs & Formulas (8 tools)
    @{Path="Math\Graphs & Formulas\Graphing-Calculator.html"; Title="Graphing Calculator"; Icon="fas fa-chart-line"; Desc="Graph mathematical functions"},
    @{Path="Math\Graphs & Formulas\Slope-Calculator.html"; Title="Slope Calculator"; Icon="fas fa-slash"; Desc="Calculate slope"},
    @{Path="Math\Graphs & Formulas\Midpoint-Calculator.html"; Title="Midpoint Calculator"; Icon="fas fa-dot-circle"; Desc="Find midpoint"},
    @{Path="Math\Graphs & Formulas\Intercept-Calculator.html"; Title="Intercept Calculator"; Icon="fas fa-times"; Desc="Find x and y intercepts"},
    @{Path="Math\Graphs & Formulas\Sequence-Calculator.html"; Title="Sequence Calculator"; Icon="fas fa-list-ol"; Desc="Calculate sequences"},
    @{Path="Math\Graphs & Formulas\Series-Calculator.html"; Title="Series Calculator"; Icon="fas fa-sigma"; Desc="Calculate series summations"},
    @{Path="Math\Graphs & Formulas\Function-Calculator.html"; Title="Function Calculator"; Icon="fas fa-function"; Desc="Evaluate functions"},
    @{Path="Math\Graphs & Formulas\Parabola-Calculator.html"; Title="Parabola Calculator"; Icon="fas fa-curve"; Desc="Calculate parabola properties"},
    
    # Math - Matrices & Vectors (7 tools)
    @{Path="Math\Matrices & Vectors\Matrix-Calculator.html"; Title="Matrix Calculator"; Icon="fas fa-th"; Desc="Matrix operations"},
    @{Path="Math\Matrices & Vectors\Determinant-Calculator.html"; Title="Determinant Calculator"; Icon="fas fa-grip"; Desc="Calculate determinant"},
    @{Path="Math\Matrices & Vectors\Vector-Calculator.html"; Title="Vector Calculator"; Icon="fas fa-arrows-alt"; Desc="Vector operations"},
    @{Path="Math\Matrices & Vectors\Dot-Product-Calculator.html"; Title="Dot Product Calculator"; Icon="fas fa-circle"; Desc="Calculate dot product"},
    @{Path="Math\Matrices & Vectors\Cross-Product-Calculator.html"; Title="Cross Product Calculator"; Icon="fas fa-times"; Desc="Calculate cross product"},
    @{Path="Math\Matrices & Vectors\Eigenvalue-Calculator.html"; Title="Eigenvalue Calculator"; Icon="fas fa-vector-square"; Desc="Find eigenvalues"},
    @{Path="Math\Matrices & Vectors\Matrix-Inverse-Calculator.html"; Title="Matrix Inverse Calculator"; Icon="fas fa-undo"; Desc="Calculate matrix inverse"},
    
    # Math - Advanced Mathematics (10 tools)
    @{Path="Math\Advanced Mathematics\Scientific-Calculator.html"; Title="Scientific Calculator"; Icon="fas fa-flask"; Desc="Advanced calculations"},
    @{Path="Math\Advanced Mathematics\Derivative-Calculator.html"; Title="Derivative Calculator"; Icon="fas fa-chart-line"; Desc="Calculate derivatives"},
    @{Path="Math\Advanced Mathematics\Integral-Calculator.html"; Title="Integral Calculator"; Icon="fas fa-integral"; Desc="Calculate integrals"},
    @{Path="Math\Advanced Mathematics\Limit-Calculator.html"; Title="Limit Calculator"; Icon="fas fa-infinity"; Desc="Calculate limits"},
    @{Path="Math\Advanced Mathematics\Differential-Equation-Solver.html"; Title="Differential Equation Solver"; Icon="fas fa-wave-square"; Desc="Solve differential equations"},
    @{Path="Math\Advanced Mathematics\Fourier-Series-Calculator.html"; Title="Fourier Series Calculator"; Icon="fas fa-wave-sine"; Desc="Calculate Fourier series"},
    @{Path="Math\Advanced Mathematics\Laplace-Transform-Calculator.html"; Title="Laplace Transform Calculator"; Icon="fas fa-project-diagram"; Desc="Calculate Laplace transforms"},
    @{Path="Math\Advanced Mathematics\Complex-Number-Calculator.html"; Title="Complex Number Calculator"; Icon="fas fa-code"; Desc="Work with complex numbers"},
    @{Path="Math\Advanced Mathematics\Partial-Derivative-Calculator.html"; Title="Partial Derivative Calculator"; Icon="fas fa-divide"; Desc="Calculate partial derivatives"},
    @{Path="Math\Advanced Mathematics\Random-Number-Generator.html"; Title="Random Number Generator"; Icon="fas fa-random"; Desc="Generate random numbers"},
    
    # DateTime - Age & Birthdate (3 tools)
    @{Path="DateTime\Age & Birthdate\Age-Calculator.html"; Title="Age Calculator"; Icon="fas fa-birthday-cake"; Desc="Calculate your exact age"},
    @{Path="DateTime\Age & Birthdate\Exact-Age-Calculator.html"; Title="Exact Age Calculator"; Icon="fas fa-stopwatch"; Desc="Calculate age with precision"},
    @{Path="DateTime\Age & Birthdate\Zodiac-Sign-Calculator.html"; Title="Zodiac Sign Calculator"; Icon="fas fa-star"; Desc="Find zodiac sign from birthdate"},
    
    # DateTime - Date Arithmetic (3 tools)
    @{Path="DateTime\Date Arithmetic & Difference\Date-Difference-Calculator.html"; Title="Date Difference Calculator"; Icon="fas fa-calendar-minus"; Desc="Calculate difference between dates"},
    @{Path="DateTime\Date Arithmetic & Difference\Add-Days-Calculator.html"; Title="Add Days to Date"; Icon="fas fa-calendar-plus"; Desc="Add or subtract days"},
    @{Path="DateTime\Date Arithmetic & Difference\Business-Days-Calculator.html"; Title="Business Days Calculator"; Icon="fas fa-briefcase"; Desc="Calculate working days"},
    
    # DateTime - Time Management (3 tools)
    @{Path="DateTime\Time Management & Tracking\Countdown-Timer.html"; Title="Countdown Timer"; Icon="fas fa-hourglass-half"; Desc="Set countdown for any event"},
    @{Path="DateTime\Time Management & Tracking\Event-Countdown.html"; Title="Event Countdown"; Icon="fas fa-calendar-check"; Desc="Count down to special events"},
    @{Path="DateTime\Time Management & Tracking\Pomodoro-Timer.html"; Title="Pomodoro Timer"; Icon="fas fa-clock"; Desc="Productivity timer with breaks"},
    
    # DateTime - Timezone (3 tools)
    @{Path="DateTime\Timezone & World Time\Timezone-Converter.html"; Title="Time Zone Converter"; Icon="fas fa-globe"; Desc="Convert time across time zones"},
    @{Path="DateTime\Timezone & World Time\World-Clock.html"; Title="World Clock"; Icon="fas fa-globe-americas"; Desc="View time in multiple zones"},
    @{Path="DateTime\Timezone & World Time\UTC-Converter.html"; Title="UTC Time Converter"; Icon="fas fa-clock"; Desc="Convert to/from UTC time"},
    
    # Construction - Structural Engineering (4 tools)
    @{Path="Construction\Structural Engineering\Structural-Load-Calculator.html"; Title="Structural Load Calculator"; Icon="fas fa-ruler-combined"; Desc="Estimate structural loads"},
    @{Path="Construction\Structural Engineering\Beam-Deflection-Calculator.html"; Title="Beam Deflection Calculator"; Icon="fas fa-minus"; Desc="Calculate beam deflection"},
    @{Path="Construction\Structural Engineering\Column-Design-Calculator.html"; Title="Column Design Calculator"; Icon="fas fa-grip-lines-vertical"; Desc="Design concrete columns"},
    @{Path="Construction\Structural Engineering\Rebar-Calculator.html"; Title="Rebar Calculator"; Icon="fas fa-bars"; Desc="Calculate reinforcement"},
    
    # Construction - Materials & Quantity (4 tools)
    @{Path="Construction\Materials & Quantity\Concrete-Calculator.html"; Title="Concrete Calculator"; Icon="fas fa-hard-hat"; Desc="Calculate concrete volume"},
    @{Path="Construction\Materials & Quantity\Brick-Calculator.html"; Title="Brick Calculator"; Icon="fas fa-cube"; Desc="Calculate bricks needed"},
    @{Path="Construction\Materials & Quantity\Cement-Calculator.html"; Title="Cement Calculator"; Icon="fas fa-box"; Desc="Calculate cement bags"},
    @{Path="Construction\Materials & Quantity\Sand-Gravel-Calculator.html"; Title="Sand & Gravel Calculator"; Icon="fas fa-layer-group"; Desc="Calculate sand quantities"},
    
    # Construction - Area & Volume (4 tools)
    @{Path="Construction\Area & Volume\Area-Calculator.html"; Title="Area Calculator"; Icon="fas fa-square"; Desc="Calculate area"},
    @{Path="Construction\Area & Volume\Volume-Calculator.html"; Title="Volume Calculator"; Icon="fas fa-cube"; Desc="Calculate volume"},
    @{Path="Construction\Area & Volume\Room-Size-Calculator.html"; Title="Room Size Calculator"; Icon="fas fa-home"; Desc="Calculate room dimensions"},
    @{Path="Construction\Area & Volume\Excavation-Calculator.html"; Title="Excavation Calculator"; Icon="fas fa-industry"; Desc="Calculate excavation volume"},
    
    # Construction - Finishing Work (4 tools)
    @{Path="Construction\Finishing Work\Paint-Calculator.html"; Title="Paint Calculator"; Icon="fas fa-paint-roller"; Desc="Estimate paint quantity"},
    @{Path="Construction\Finishing Work\Tile-Calculator.html"; Title="Tile Calculator"; Icon="fas fa-th"; Desc="Calculate tiles needed"},
    @{Path="Construction\Finishing Work\Wallpaper-Calculator.html"; Title="Wallpaper Calculator"; Icon="fas fa-image"; Desc="Calculate wallpaper rolls"},
    @{Path="Construction\Finishing Work\Flooring-Calculator.html"; Title="Flooring Calculator"; Icon="fas fa-grip-horizontal"; Desc="Calculate flooring materials"},
    
    # Physics - Mechanics & Motion (4 tools)
    @{Path="Physics\Mechanics & Motion\Velocity-Calculator.html"; Title="Velocity Calculator"; Icon="fas fa-tachometer-alt"; Desc="Calculate velocity"},
    @{Path="Physics\Mechanics & Motion\Force-Calculator.html"; Title="Force Calculator"; Icon="fas fa-atom"; Desc="Calculate force"},
    @{Path="Physics\Mechanics & Motion\Acceleration-Calculator.html"; Title="Acceleration Calculator"; Icon="fas fa-rocket"; Desc="Calculate acceleration"},
    @{Path="Physics\Mechanics & Motion\Momentum-Calculator.html"; Title="Momentum Calculator"; Icon="fas fa-car"; Desc="Calculate momentum"},
    
    # Physics - Energy & Power (4 tools)
    @{Path="Physics\Energy & Power\Kinetic-Energy-Calculator.html"; Title="Kinetic Energy Calculator"; Icon="fas fa-running"; Desc="Calculate kinetic energy"},
    @{Path="Physics\Energy & Power\Potential-Energy-Calculator.html"; Title="Potential Energy Calculator"; Icon="fas fa-mountain"; Desc="Calculate potential energy"},
    @{Path="Physics\Energy & Power\Power-Calculator.html"; Title="Power Calculator"; Icon="fas fa-bolt"; Desc="Calculate power"},
    @{Path="Physics\Energy & Power\Work-Calculator.html"; Title="Work Calculator"; Icon="fas fa-weight-hanging"; Desc="Calculate work done"},
    
    # Physics - Electricity (4 tools)
    @{Path="Physics\Electricity & Electronics\Ohms-Law-Calculator.html"; Title="Ohm's Law Calculator"; Icon="fas fa-bolt"; Desc="Calculate voltage, current, resistance"},
    @{Path="Physics\Electricity & Electronics\Power-Consumption-Calculator.html"; Title="Power Consumption Calculator"; Icon="fas fa-lightbulb"; Desc="Calculate power usage"},
    @{Path="Physics\Electricity & Electronics\Resistance-Calculator.html"; Title="Resistance Calculator"; Icon="fas fa-minus-circle"; Desc="Calculate resistance"},
    @{Path="Physics\Electricity & Electronics\Capacitance-Calculator.html"; Title="Capacitance Calculator"; Icon="fas fa-battery-full"; Desc="Calculate capacitor values"},
    
    # Everyday - Food & Dining (4 tools)
    @{Path="Everyday\Food & Dining\Tip-Calculator.html"; Title="Tip Calculator"; Icon="fas fa-hand-holding-heart"; Desc="Calculate tips and split bills"},
    @{Path="Everyday\Food & Dining\Recipe-Converter.html"; Title="Recipe Converter"; Icon="fas fa-book-open"; Desc="Convert recipe quantities"},
    @{Path="Everyday\Food & Dining\Serving-Size-Calculator.html"; Title="Serving Size Calculator"; Icon="fas fa-users"; Desc="Adjust recipe servings"},
    @{Path="Everyday\Food & Dining\Cooking-Time-Calculator.html"; Title="Cooking Time Calculator"; Icon="fas fa-clock"; Desc="Calculate cooking times"},
    
    # Everyday - Conversion Tools (4 tools)
    @{Path="Everyday\Conversion Tools\Unit-Converter.html"; Title="Unit Converter"; Icon="fas fa-exchange-alt"; Desc="Convert between units"},
    @{Path="Everyday\Conversion Tools\Temperature-Converter.html"; Title="Temperature Converter"; Icon="fas fa-thermometer-half"; Desc="Convert temperature"},
    @{Path="Everyday\Conversion Tools\Currency-Converter.html"; Title="Currency Converter"; Icon="fas fa-money-bill-wave"; Desc="Convert currencies"},
    @{Path="Everyday\Conversion Tools\Length-Converter.html"; Title="Length Converter"; Icon="fas fa-ruler"; Desc="Convert length units"},
    
    # Everyday - Shopping & Budgeting (4 tools)
    @{Path="Everyday\Shopping & Budgeting\Discount-Calculator.html"; Title="Discount Calculator"; Icon="fas fa-tags"; Desc="Calculate sale prices"},
    @{Path="Everyday\Shopping & Budgeting\Sales-Tax-Calculator.html"; Title="Sales Tax Calculator"; Icon="fas fa-receipt"; Desc="Calculate tax on purchases"},
    @{Path="Everyday\Shopping & Budgeting\Price-Comparison-Calculator.html"; Title="Price Comparison Calculator"; Icon="fas fa-balance-scale"; Desc="Compare unit prices"},
    @{Path="Everyday\Shopping & Budgeting\Budget-Calculator.html"; Title="Budget Calculator"; Icon="fas fa-wallet"; Desc="Plan and track budget"},
    
    # Education - Academic & Grades (4 tools)
    @{Path="Education\Academic & Grades\GPA-Calculator.html"; Title="GPA Calculator"; Icon="fas fa-graduation-cap"; Desc="Calculate Grade Point Average"},
    @{Path="Education\Academic & Grades\Grade-Calculator.html"; Title="Grade Calculator"; Icon="fas fa-award"; Desc="Calculate your final grade"},
    @{Path="Education\Academic & Grades\Percentage-Grade-Calculator.html"; Title="Percentage Grade Calculator"; Icon="fas fa-percent"; Desc="Convert marks to percentage"},
    @{Path="Education\Academic & Grades\CGPA-Calculator.html"; Title="CGPA Calculator"; Icon="fas fa-chart-line"; Desc="Calculate cumulative GPA"},
    
    # Education - Test & Preparation (3 tools)
    @{Path="Education\Test & Preparation\Study-Time-Calculator.html"; Title="Study Time Calculator"; Icon="fas fa-clock"; Desc="Plan your study schedule"},
    @{Path="Education\Test & Preparation\Exam-Score-Calculator.html"; Title="Exam Score Calculator"; Icon="fas fa-file-alt"; Desc="Calculate required exam scores"},
    @{Path="Education\Test & Preparation\Reading-Time-Calculator.html"; Title="Reading Time Calculator"; Icon="fas fa-book-reader"; Desc="Estimate time to read books"},
    
    # Technology - Networking (3 tools)
    @{Path="Technology\Networking & Internet\Bandwidth-Calculator.html"; Title="Bandwidth Calculator"; Icon="fas fa-wifi"; Desc="Calculate bandwidth requirements"},
    @{Path="Technology\Networking & Internet\IP-Subnet-Calculator.html"; Title="IP Subnet Calculator"; Icon="fas fa-server"; Desc="Calculate IP subnets"},
    @{Path="Technology\Networking & Internet\Download-Time-Calculator.html"; Title="Download Time Calculator"; Icon="fas fa-download"; Desc="Estimate download time"},
    
    # Technology - Security (3 tools)
    @{Path="Technology\Security & Privacy\Password-Strength-Checker.html"; Title="Password Strength Checker"; Icon="fas fa-lock"; Desc="Check password security"},
    @{Path="Technology\Security & Privacy\Password-Generator.html"; Title="Password Generator"; Icon="fas fa-key"; Desc="Generate secure passwords"},
    @{Path="Technology\Security & Privacy\Encryption-Calculator.html"; Title="Encryption Calculator"; Icon="fas fa-user-secret"; Desc="Calculate encryption strength"},
    
    # Technology - Storage & Data (3 tools)
    @{Path="Technology\Storage & Data\File-Size-Converter.html"; Title="File Size Converter"; Icon="fas fa-file"; Desc="Convert bytes, KB, MB, GB"},
    @{Path="Technology\Storage & Data\Storage-Calculator.html"; Title="Storage Calculator"; Icon="fas fa-hdd"; Desc="Calculate storage requirements"},
    @{Path="Technology\Storage & Data\Data-Transfer-Calculator.html"; Title="Data Transfer Calculator"; Icon="fas fa-exchange-alt"; Desc="Calculate data transfer rates"},
    
    # Scientific - Astronomy (3 tools)
    @{Path="Scientific\Astronomy & Space\Astronomical-Calculator.html"; Title="Astronomical Calculator"; Icon="fas fa-rocket"; Desc="Calculate astronomical distances"},
    @{Path="Scientific\Astronomy & Space\Light-Year-Calculator.html"; Title="Light Year Calculator"; Icon="fas fa-star"; Desc="Convert light years"},
    @{Path="Scientific\Astronomy & Space\Planet-Weight-Calculator.html"; Title="Planet Weight Calculator"; Icon="fas fa-globe"; Desc="Calculate weight on planets"},
    
    # Scientific - Scientific Notation (3 tools)
    @{Path="Scientific\Scientific Notation & Units\Scientific-Notation-Calculator.html"; Title="Scientific Notation Calculator"; Icon="fas fa-microscope"; Desc="Convert to scientific notation"},
    @{Path="Scientific\Scientific Notation & Units\Mole-Calculator.html"; Title="Mole Calculator"; Icon="fas fa-atom"; Desc="Calculate moles"},
    @{Path="Scientific\Scientific Notation & Units\Concentration-Calculator.html"; Title="Concentration Calculator"; Icon="fas fa-flask"; Desc="Calculate concentrations"}
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Creating ALL remaining calculator files" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$count = 0
$categories = @{}

foreach ($tool in $allTools) {
    $content = $template -replace 'CALCULATOR_TITLE', $tool.Title
    $content = $content -replace 'ICON_CLASS', $tool.Icon
    $content = $content -replace 'DESCRIPTION', $tool.Desc
    $filePath = Join-Path $PSScriptRoot $tool.Path
    $content | Out-File -FilePath $filePath -Encoding UTF8
    $count++
    
    # Track category counts
    $category = $tool.Path.Split('\')[0]
    if (-not $categories.ContainsKey($category)) {
        $categories[$category] = 0
    }
    $categories[$category]++
    
    Write-Host "  [$count/$($allTools.Count)] Created: $($tool.Path)" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
foreach ($cat in $categories.Keys | Sort-Object) {
    Write-Host "  $cat : $($categories[$cat]) files" -ForegroundColor Magenta
}
Write-Host "`nTotal files created: $count" -ForegroundColor Green
Write-Host "All calculator files generated successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Yellow
