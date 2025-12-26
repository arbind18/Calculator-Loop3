import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is BMR and how is it different from TDEE?"
          answer="BMR (Basal Metabolic Rate) is calories burned at complete rest. TDEE (Total Daily Energy Expenditure) = BMR × Activity Factor. Example: BMR 1,500 × 1.55 (moderate activity) = 2,325 TDEE. Eat below TDEE to lose weight."
        />
        <FaqItem 
          question="Does muscle increase BMR?"
          answer="Yes! Muscle tissue burns more calories at rest than fat (7-10 cal/kg for muscle vs 2-3 cal/kg for fat). Building 5kg muscle can increase BMR by 100-150 calories/day. This is why strength training is crucial for metabolism."
        />
        <FaqItem 
          question="How can I increase my BMR naturally?"
          answer="5 ways: (1) Build muscle (strength training), (2) Eat enough protein (boosts TEF by 20-30%), (3) Stay hydrated, (4) Get 7-9 hours sleep (lack of sleep reduces BMR by 15%), (5) Don't crash diet (extreme calorie cuts slow metabolism)."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is a healthy body fat percentage?"
          answer="Men: 10-20% (athletes 6-13%), Women: 20-30% (athletes 14-20%). Essential fat: 2-5% (men), 10-13% (women). Going below essential fat is dangerous. Fitness level: 14-17% men, 21-24% women is ideal for health and aesthetics."
        />
        <FaqItem 
          question="Is body fat % more important than BMI?"
          answer="Yes! BMI doesn't distinguish muscle from fat. A bodybuilder might have high BMI (overweight) but low body fat (very healthy). Body fat % gives true picture of fitness. Aim for healthy fat % regardless of BMI."
        />
        <FaqItem 
          question="How do I reduce body fat percentage?"
          answer="Combine: (1) Calorie deficit (eat 300-500 below TDEE), (2) Strength training (preserve muscle while losing fat), (3) High protein (1.6-2.2g/kg), (4) Cardio 3-4x/week, (5) Sleep 7-9 hours. Lose 0.5-1% body fat per month safely."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How many calories should I eat to lose weight?"
          answer="Create a 500-cal deficit from your TDEE to lose 0.5kg/week, 1000-cal for 1kg/week. Never go below 1,200 cal (women) or 1,500 cal (men) - too low slows metabolism. Slow and steady wins the race!"
        />
        <FaqItem 
          question="Do I need to count every calorie?"
          answer="Initially yes, to learn portion sizes and food calories. After 2-3 months, you'll develop intuition. Use apps like MyFitnessPal. Weigh food for accuracy - eyeballing can be off by 30-50%. Most people underestimate intake."
        />
        <FaqItem 
          question="Can I eat anything if it fits my calorie goal?"
          answer="Technically yes (IIFYM - If It Fits Your Macros), but not recommended. 1,500 cal of junk food = hungry, low energy. 1,500 cal of whole foods = full, energized. Prioritize protein, veggies, whole grains, then allow treats 10-20%."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Is ideal weight the same for everyone of the same height?"
          answer="No! Ideal weight varies by frame size, muscle mass, age, and gender. A 180cm bodybuilder might weigh 90kg (healthy), while a 180cm sedentary person at 90kg might be overweight. Use BMI + body fat % + how you feel for complete picture."
        />
        <FaqItem 
          question="Should I aim for the exact ideal weight?"
          answer="Ideal weight is a range, not a target. Focus on body composition (muscle vs fat) and health markers (energy, blood pressure, cholesterol) instead of scale number. Weighing 5-10kg more than 'ideal' with muscle is perfectly healthy."
        />
        <FaqItem 
          question="How long does it take to reach ideal weight?"
          answer="Safe weight loss: 0.5-1kg per week. If you're 20kg over ideal, expect 5-10 months. Rapid weight loss causes muscle loss and metabolic slowdown. Aim for sustainable lifestyle changes, not quick fixes. Patience wins!"
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the best macro split for fat loss?"
          answer="High Protein (40% protein, 30% carbs, 30% fat) works best. Protein preserves muscle, keeps you full. Example for 2,000 cal: 200g protein, 150g carbs, 67g fat. Adjust carbs/fats based on energy needs and preference."
        />
        <FaqItem 
          question="Do I need to hit macros exactly every day?"
          answer="No, aim for weekly averages. Being off by 10-20g daily won't hurt. Protein is most important (hit target daily). Carbs and fats can vary based on activity (high-carb on workout days, lower on rest days)."
        />
        <FaqItem 
          question="What are the best sources for each macro?"
          answer="Protein: Chicken, fish, eggs, Greek yogurt, paneer, dal. Carbs: Rice, oats, quinoa, sweet potato, fruits. Fats: Nuts, avocado, olive oil, ghee, fatty fish. Focus on whole foods over processed."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How accurate is TDEE calculation?"
          answer="TDEE calculators are estimates (± 10-15% accuracy). Track weight for 2 weeks - if stable, that's your true TDEE. If gaining, reduce by 200 cal. If losing, add 200 cal. Recalculate every 5kg weight change."
        />
        <FaqItem 
          question="Which activity level should I choose?"
          answer="Sedentary (1.2): Office job, no exercise. Light (1.375): Light exercise 1-3 days/week. Moderate (1.55): Moderate exercise 3-5 days. Active (1.725): Heavy exercise 6-7 days. Very Active (1.9): Physical job + training. Most people overestimate!"
        />
        <FaqItem 
          question="Does TDEE change over time?"
          answer="Yes! TDEE decreases as you lose weight (smaller body burns less). Recalculate every 5kg. Metabolic adaptation also occurs - body becomes efficient. Combat with: reverse dieting, strength training, diet breaks every 12-16 weeks."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How much water should I drink daily?"
          answer="General rule: 30-35ml per kg body weight. Example: 70kg person needs 2.1-2.5L/day. Add 500ml-1L for exercise, hot weather. Urine color test: Pale yellow = hydrated, Dark yellow = drink more."
        />
        <FaqItem 
          question="Can I drink too much water?"
          answer="Yes, overhydration (hyponatremia) is dangerous but rare. Drinking >1L/hour can dilute blood sodium. Symptoms: nausea, headache, confusion. Stick to 3-4L/day max unless you're an endurance athlete. Listen to your body."
        />
        <FaqItem 
          question="Does coffee/tea count towards water intake?"
          answer="Yes, but partially. Coffee/tea are 85-95% water, so they hydrate despite mild diuretic effect. Count 50-75% towards daily goal. Best: Start with 2 glasses plain water, then coffee/tea, more water throughout day."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is Lean Body Mass (LBM)?"
          answer="LBM = Total Weight - Fat Mass. Includes muscle, bones, water, organs. Example: 80kg person with 20% body fat. Fat = 16kg, LBM = 64kg. Higher LBM = higher metabolism. Goal: Maintain/increase LBM while losing fat."
        />
        <FaqItem 
          question="How can I increase my lean body mass?"
          answer="3 pillars: (1) Strength training 3-5x/week (progressive overload), (2) Eat 1.6-2.2g protein/kg, (3) Slight calorie surplus (200-300 above TDEE). Expect 0.25-0.5kg muscle gain/month naturally. Be patient!"
        />
        <FaqItem 
          question="Can I lose fat and gain muscle simultaneously?"
          answer="Yes (body recomposition), but slower than bulk/cut cycles. Works best for: beginners, returning after break, overweight individuals. Requirements: High protein, strength training, small calorie deficit (200-300), patience (6-12 months)."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I measure waist and hip correctly?"
          answer="Waist: Measure at narrowest point (usually above belly button) while standing, relaxed, after exhaling. Hips: Measure at widest point of buttocks. Use measuring tape parallel to floor. Don't suck in stomach!"
        />
        <FaqItem 
          question="What does high WHR mean for health?"
          answer="High WHR (>0.9 men, >0.85 women) indicates abdominal obesity - 'apple shape'. Linked to: heart disease, type 2 diabetes, metabolic syndrome. Belly fat (visceral fat) is more dangerous than hip/thigh fat (subcutaneous)."
        />
        <FaqItem 
          question="How can I reduce my waist-to-hip ratio?"
          answer="Can't spot reduce, but: (1) Overall calorie deficit (lose fat everywhere), (2) Core exercises (strengthens muscles), (3) Reduce alcohol (belly fat accumulator), (4) Manage stress (cortisol increases belly fat), (5) Sleep 7-9 hours. Genetics play a role."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How much protein do I need daily?"
          answer="Sedentary: 0.8g/kg, Active: 1.2-1.6g/kg, Muscle building: 1.6-2.2g/kg, Fat loss: 2-2.5g/kg (higher protein preserves muscle). Example: 70kg person building muscle needs 112-154g protein/day. Spread across 3-5 meals."
        />
        <FaqItem 
          question="Can I eat too much protein?"
          answer="Unlikely for healthy individuals. Upper safe limit: ~3g/kg. Concerns about kidney damage are myths for healthy people. Excess protein converts to energy, not stored as fat unless in calorie surplus. Focus: get enough, don't obsess."
        />
        <FaqItem 
          question="What are the best protein sources?"
          answer="Animal: Chicken (30g/100g), Eggs (13g/2 eggs), Fish (25g/100g), Greek yogurt (10g/100g). Vegetarian: Paneer (18g/100g), Dal (9g/100g cooked), Tofu (8g/100g), Protein powder (20-25g/scoop). Combine sources for complete amino acids."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How many calories does exercise really burn?"
          answer="Running (8 km/h): 450-550 cal/hour, Cycling (moderate): 400-500, Swimming: 400-600, Walking (5 km/h): 200-250, Strength training: 200-300. Heavier people burn more. Intensity matters more than duration!"
        />
        <FaqItem 
          question="Should I eat back calories burned from exercise?"
          answer="Depends on goal. Fat loss: Don't eat back (creates deficit). Maintenance: Eat back 50-75% (trackers overestimate). Muscle gain: Eat back 100%+. Most accurate: Track weight trends weekly, adjust calories based on results."
        />
        <FaqItem 
          question="Which exercise burns the most calories?"
          answer="Per hour: Running (600-900 cal), Jump rope (600-800), Swimming (500-700), Cycling (400-600). BUT: Best exercise = one you'll do consistently. Mixing cardio + strength training is optimal for health and body composition."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is maximum heart rate?"
          answer="Simple formula: 220 - Age. Example: 30 years old = 190 bpm max. More accurate: Do a fitness test. Max HR determines your training zones. Never train above max for extended periods - dangerous!"
        />
        <FaqItem 
          question="Which heart rate zone is best for fat loss?"
          answer="Myth: 'Fat burning zone' (60-70%) burns more fat. Truth: Higher intensity (70-85%) burns MORE total calories = more fat lost overall. Best approach: Mix both - LISS (low intensity) for recovery, HIIT (high intensity) for max burn."
        />
        <FaqItem 
          question="How do I measure resting heart rate?"
          answer="Best time: Morning, still in bed, before moving. Use fitness tracker or manually (count pulse for 60 seconds). Normal: 60-100 bpm. Athletes: 40-60 bpm. Lower RHR generally = better cardiovascular fitness. Track weekly trends."
        />
      </div>
    </section>
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
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How many sleep cycles do I need?"
          answer="Adults: 5-6 cycles (7.5-9 hours). Each cycle = 90 minutes (light sleep → deep sleep → REM). Waking between cycles = refreshed. Waking mid-cycle = groggy. Set alarm for multiples of 90min (6h, 7.5h, 9h)."
        />
        <FaqItem 
          question="What if I can't sleep 7-9 hours?"
          answer="Quality > Quantity. Better: 6 hours uninterrupted than 8 hours broken sleep. Prioritize: (1) Consistent sleep/wake times, (2) Dark, cool room, (3) No screens 1hr before bed, (4) No caffeine after 2pm. Naps: 20min or 90min (full cycle)."
        />
        <FaqItem 
          question="Does lack of sleep affect weight loss?"
          answer="YES! <6 hours sleep: (1) Increases hunger hormones (ghrelin), (2) Decreases fullness hormones (leptin), (3) Reduces willpower, (4) Lowers metabolism by 10-15%, (5) Increases cortisol (belly fat). Sleep is as important as diet and exercise!"
        />
      </div>
    </section>
  </div>
)
