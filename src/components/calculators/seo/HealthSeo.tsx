import React from 'react'

export const BMRSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>What is BMR (Basal Metabolic Rate)?</h2>
    <p>
      Your Basal Metabolic Rate (BMR) is the number of calories your body burns while at rest. 
      Even when you are sleeping or sitting still, your body needs energy to perform basic functions 
      like breathing, circulating blood, controlling body temperature, and cell growth.
    </p>
    <h3>Why is BMR Important?</h3>
    <p>
      Knowing your BMR is the starting point for any weight management plan. 
      It represents the minimum amount of energy your body needs to survive. 
      Most people burn more than their BMR because of daily activities and exercise.
    </p>
    <h3>How to Use This BMR Calculator</h3>
    <ul>
      <li><strong>Lose Weight:</strong> Consume fewer calories than your TDEE (Total Daily Energy Expenditure).</li>
      <li><strong>Gain Muscle:</strong> Consume more calories than your TDEE combined with strength training.</li>
      <li><strong>Maintain Weight:</strong> Consume calories equal to your TDEE.</li>
    </ul>
    <p>
      This calculator uses the Mifflin-St Jeor equation, which is considered one of the most accurate 
      formulas for estimating BMR.
    </p>
  </div>
)

export const BodyFatSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Understanding Body Fat Percentage</h2>
    <p>
      Body fat percentage is a key indicator of your overall health and fitness level. 
      Unlike BMI, which only looks at weight relative to height, body fat percentage 
      tells you how much of your weight is fat mass versus lean mass (muscle, bones, water).
    </p>
    <h3>Body Fat Categories</h3>
    <ul>
      <li><strong>Essential Fat:</strong> 2-5% (Men), 10-13% (Women)</li>
      <li><strong>Athletes:</strong> 6-13% (Men), 14-20% (Women)</li>
      <li><strong>Fitness:</strong> 14-17% (Men), 21-24% (Women)</li>
      <li><strong>Average:</strong> 18-24% (Men), 25-31% (Women)</li>
      <li><strong>Obese:</strong> 25%+ (Men), 32%+ (Women)</li>
    </ul>
    <p>
      This calculator uses the U.S. Navy Method, which estimates body fat based on body measurements. 
      While not as accurate as a DEXA scan, it provides a good estimate for tracking progress.
    </p>
  </div>
)

export const CalorieSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Master Your Daily Calorie Intake</h2>
    <p>
      Calories are the fuel your body needs to function. The number of calories you need depends on 
      your age, gender, weight, height, and activity level. This calculator helps you determine 
      exactly how much you should eat to reach your goals.
    </p>
    <h3>The Science of Weight Loss</h3>
    <p>
      To lose weight, you need to create a calorie deficit. This means burning more calories than you consume. 
      A safe rate of weight loss is generally considered to be 0.5kg to 1kg per week. 
      This usually requires a deficit of 500 to 1000 calories per day.
    </p>
    <h3>Tips for Success</h3>
    <ul>
      <li>Track your food intake accurately.</li>
      <li>Focus on nutrient-dense foods like vegetables, lean proteins, and whole grains.</li>
      <li>Don't drink your calories – stick to water or unsweetened beverages.</li>
      <li>Combine diet with regular exercise for best results.</li>
    </ul>
  </div>
)

export const IdealWeightSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>What is Your Ideal Weight?</h2>
    <p>
      "Ideal weight" is a range rather than a single number. It's the weight at which your body 
      functions optimally and your risk of weight-related health issues is lowest.
    </p>
    <h3>Formulas Used</h3>
    <ul>
      <li><strong>Hamwi Formula (1964):</strong> Originally designed for drug dosage calculations.</li>
      <li><strong>Devine Formula (1974):</strong> The most widely used formula medically.</li>
      <li><strong>Robinson Formula (1983):</strong> A modification of the Devine formula.</li>
      <li><strong>Miller Formula (1983):</strong> Often used to estimate ideal weight.</li>
    </ul>
    <p>
      Remember that these formulas don't account for muscle mass. An athlete might weigh more 
      than their "ideal" weight due to muscle, but still be very healthy.
    </p>
  </div>
)

export const MacroSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Macronutrients: The Building Blocks</h2>
    <p>
      Macronutrients (macros) are the nutrients your body needs in large amounts: Protein, Carbohydrates, and Fats. 
      Balancing these is crucial for achieving specific fitness goals.
    </p>
    <h3>Why Count Macros?</h3>
    <ul>
      <li><strong>Protein:</strong> Essential for building and repairing muscle tissue. (4 calories/gram)</li>
      <li><strong>Carbohydrates:</strong> The body's primary energy source. (4 calories/gram)</li>
      <li><strong>Fats:</strong> Vital for hormone production and nutrient absorption. (9 calories/gram)</li>
    </ul>
    <p>
      This calculator provides a balanced split (Moderate Carb) suitable for most people. 
      Bodybuilders or endurance athletes may need different ratios.
    </p>
  </div>
)

export const TDEESeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Total Daily Energy Expenditure (TDEE)</h2>
    <p>
      Your TDEE is the total number of calories you burn in a day. It is calculated by taking your 
      BMR and multiplying it by an activity factor.
    </p>
    <h3>Components of TDEE</h3>
    <ol>
      <li><strong>Basal Metabolic Rate (BMR):</strong> Calories burned at rest (~70% of TDEE).</li>
      <li><strong>Thermic Effect of Food (TEF):</strong> Calories burned digesting food (~10%).</li>
      <li><strong>Physical Activity:</strong> Calories burned during exercise and movement (~20%).</li>
    </ol>
    <p>
      Knowing your TDEE is crucial because it acts as your "maintenance calories". 
      Eat more than your TDEE to gain weight, eat less to lose weight.
    </p>
  </div>
)

export const WaterIntakeSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Stay Hydrated for Optimal Health</h2>
    <p>
      Water is essential for life. It regulates body temperature, lubricates joints, 
      protects tissues, and helps eliminate waste.
    </p>
    <h3>Signs of Dehydration</h3>
    <ul>
      <li>Thirst</li>
      <li>Dark yellow urine</li>
      <li>Fatigue</li>
      <li>Dizziness</li>
      <li>Dry mouth</li>
    </ul>
    <p>
      While the "8 glasses a day" rule is a good start, your actual needs depend on your weight 
      and activity level. This calculator gives you a personalized recommendation.
    </p>
  </div>
)

export const LeanBodyMassSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>What is Lean Body Mass?</h2>
    <p>
      Lean Body Mass (LBM) is your total weight minus your fat weight. 
      It includes muscle, bone, water, connective tissue, and internal organs.
    </p>
    <h3>Why Track LBM?</h3>
    <p>
      Tracking LBM is better than tracking just weight. If you are losing weight but your LBM is staying the same 
      or increasing, you are losing fat and keeping muscle – which is the goal!
    </p>
    <p>
      This calculator uses the Boer formula, which is known for its accuracy in individuals with average body composition.
    </p>
  </div>
)

export const WaistHipRatioSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Waist-to-Hip Ratio (WHR)</h2>
    <p>
      WHR is a simple but powerful measurement of fat distribution. 
      It helps determine if you carry more weight around your middle (apple shape) 
      or your hips (pear shape).
    </p>
    <h3>Health Implications</h3>
    <p>
      People who carry more weight around their waist (abdominal obesity) are at higher risk for:
    </p>
    <ul>
      <li>Heart disease</li>
      <li>Type 2 diabetes</li>
      <li>High blood pressure</li>
    </ul>
    <p>
      According to the WHO, a healthy WHR is 0.9 or less for men and 0.85 or less for women.
    </p>
  </div>
)

export const ProteinSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Protein: The Muscle Builder</h2>
    <p>
      Protein is arguably the most important macronutrient for body composition. 
      It is made up of amino acids, which are the building blocks of muscle.
    </p>
    <h3>How Much Do You Need?</h3>
    <ul>
      <li><strong>Sedentary:</strong> 0.8g per kg of body weight.</li>
      <li><strong>Active:</strong> 1.2g - 1.7g per kg.</li>
      <li><strong>Athletes/Muscle Gain:</strong> 1.6g - 2.2g per kg.</li>
    </ul>
    <p>
      Eating enough protein helps you feel full, boosts metabolism, and preserves muscle mass while dieting.
    </p>
  </div>
)

export const CaloriesBurnedSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Estimate Your Exercise Calorie Burn</h2>
    <p>
      Knowing how many calories you burn during exercise helps you balance your energy intake. 
      This calculator uses MET (Metabolic Equivalent of Task) values to estimate energy expenditure.
    </p>
    <h3>What is a MET?</h3>
    <p>
      1 MET is the energy you spend sitting at rest. 
      An activity with a MET of 5 means you are burning 5 times as much energy as you would be sitting still.
    </p>
    <p>
      Remember that these are estimates. Intensity, fitness level, and individual metabolism all play a role.
    </p>
  </div>
)

export const TargetHeartRateSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Train Smarter with Heart Rate Zones</h2>
    <p>
      Your heart rate is a great indicator of exercise intensity. 
      Training in specific "zones" can help you achieve different goals.
    </p>
    <h3>The Zones</h3>
    <ul>
      <li><strong>Fat Burn (60-70% Max HR):</strong> Best for endurance and burning fat.</li>
      <li><strong>Cardio (70-80% Max HR):</strong> Improves cardiovascular fitness and stamina.</li>
      <li><strong>Peak (80-90% Max HR):</strong> High intensity for performance and speed.</li>
    </ul>
    <p>
      This calculator uses the Karvonen method, which takes your resting heart rate into account 
      for a more personalized zone calculation.
    </p>
  </div>
)

export const SleepSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Sleep Cycles and Rest</h2>
    <p>
      Waking up feeling groggy? You might be waking up in the middle of a sleep cycle. 
      A typical sleep cycle lasts about 90 minutes, moving through light sleep, deep sleep, and REM sleep.
    </p>
    <h3>Why Timing Matters</h3>
    <p>
      Waking up at the end of a cycle ensures you feel refreshed and alert. 
      Waking up during deep sleep can lead to "sleep inertia" – that heavy, groggy feeling.
    </p>
    <p>
      Most adults need 5-6 cycles (7.5 - 9 hours) of sleep per night.
    </p>
  </div>
)
