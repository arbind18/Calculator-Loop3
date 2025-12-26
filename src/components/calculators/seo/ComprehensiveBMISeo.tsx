import React from 'react'
import { FaqItem } from "@/components/ui/faq-item"
import { HelpCircle } from "lucide-react"

export const ComprehensiveBMISeo = () => (
  <div className="prose dark:prose-invert max-w-none mt-8 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Complete BMI Calculator Guide - Understand Your Body Weight with Real Examples</h2>
      <p className="text-lg leading-relaxed">
        Body Mass Index (BMI) is the most widely used metric to assess whether your weight is healthy for your height. 
        Used by doctors worldwide, BMI helps identify potential health risks related to being underweight, overweight, or obese. 
        This comprehensive guide explains BMI calculation, categories, limitations, and provides detailed real-life examples for Indian body types.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Understanding BMI - The Formula Explained</h3>
      <div className="bg-primary/10 p-6 rounded-lg">
        <p className="font-semibold mb-2">BMI Formula:</p>
        <p className="font-mono text-lg mb-4">BMI = Weight (kg) / Height² (m²)</p>
        
        <div className="space-y-2 text-sm">
          <p><strong>For metric units:</strong></p>
          <ul className="ml-4 space-y-1">
            <li>• Weight in kilograms (kg)</li>
            <li>• Height in meters (m)</li>
            <li>• Example: 70 kg ÷ (1.75 m)² = 70 ÷ 3.06 = 22.9</li>
          </ul>
          
          <p className="mt-3"><strong>For imperial units:</strong></p>
          <p className="font-mono">BMI = (Weight in pounds / Height² in inches) × 703</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">BMI Categories - What Your Number Means</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">BMI Range</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Health Risk</th>
              <th className="p-3 text-left">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-blue-500/10">
              <td className="p-3 font-semibold">&lt; 18.5</td>
              <td className="p-3">Underweight</td>
              <td className="p-3 text-yellow-600">Moderate Risk</td>
              <td className="p-3">Gain weight through balanced diet</td>
            </tr>
            <tr className="border-b bg-green-500/10">
              <td className="p-3 font-semibold">18.5 - 24.9</td>
              <td className="p-3">Normal Weight</td>
              <td className="p-3 text-green-600">Low Risk</td>
              <td className="p-3">Maintain through healthy lifestyle</td>
            </tr>
            <tr className="border-b bg-yellow-500/10">
              <td className="p-3 font-semibold">25.0 - 29.9</td>
              <td className="p-3">Overweight</td>
              <td className="p-3 text-orange-600">Increased Risk</td>
              <td className="p-3">Lose 5-10% weight gradually</td>
            </tr>
            <tr className="border-b bg-orange-500/10">
              <td className="p-3 font-semibold">30.0 - 34.9</td>
              <td className="p-3">Obese (Class I)</td>
              <td className="p-3 text-red-600">High Risk</td>
              <td className="p-3">Medical supervision needed</td>
            </tr>
            <tr className="border-b bg-red-500/10">
              <td className="p-3 font-semibold">35.0 - 39.9</td>
              <td className="p-3">Obese (Class II)</td>
              <td className="p-3 text-red-600">Very High Risk</td>
              <td className="p-3">Immediate medical intervention</td>
            </tr>
            <tr className="border-b bg-red-500/20">
              <td className="p-3 font-semibold">≥ 40.0</td>
              <td className="p-3">Obese (Class III)</td>
              <td className="p-3 text-red-600 font-bold">Extremely High Risk</td>
              <td className="p-3">Urgent medical care required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg">
        <p className="font-semibold">Special Note for Asian/Indian Population:</p>
        <p className="text-sm mt-2">
          Research shows that Asians develop health risks at lower BMI thresholds. Many Indian medical experts recommend:
          <br/>• Normal weight: 18.5 - 22.9 (instead of 24.9)
          <br/>• Overweight: 23.0 - 27.5
          <br/>• Obese: &gt; 27.5
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Real-Life Example 1: Software Engineer - Underweight to Healthy</h3>
      <div className="border-l-4 border-blue-500 pl-6">
        <p className="font-semibold mb-2">Profile: Rohan (Age 26, Male)</p>
        <ul className="space-y-1 text-sm">
          <li>• Height: 175 cm (1.75 m)</li>
          <li>• Current Weight: 58 kg</li>
          <li>• Occupation: Software Developer (sedentary)</li>
          <li>• Lifestyle: Poor diet, skips meals, high stress</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">BMI Calculation:</p>
          <ol className="space-y-2 text-sm">
            <li><strong>Step 1:</strong> Convert height to meters
              <p>Height = 175 cm = 1.75 m</p>
            </li>
            <li><strong>Step 2:</strong> Square the height
              <p>Height² = 1.75 × 1.75 = 3.0625 m²</p>
            </li>
            <li><strong>Step 3:</strong> Divide weight by height squared
              <p>BMI = 58 / 3.0625</p>
              <p className="font-bold text-blue-500 text-lg">BMI = 18.9 (Borderline Normal/Underweight)</p>
            </li>
          </ol>

          <div className="mt-4 p-3 bg-yellow-500/10 rounded">
            <p className="font-semibold">Health Assessment:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Category: Just above underweight threshold</li>
              <li>• Risks: Low immunity, fatigue, muscle loss</li>
              <li>• Recommendation: Gain 5-8 kg to reach optimal BMI 21-22</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-green-500/10 rounded">
            <p className="font-semibold">3-Month Goal:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Target Weight: 65 kg</li>
              <li>• Target BMI: 65 / 3.0625 = <strong>21.2 (Healthy)</strong></li>
              <li>• Weight Gain Needed: 7 kg</li>
              <li>• Weekly Gain: 0.5 kg (healthy rate)</li>
              <li>• Daily Calorie Surplus: +500 calories</li>
            </ul>
            <p className="text-xs mt-2 italic">
              Plan: 3 proper meals + 2 snacks, protein-rich diet, strength training 3×/week
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Real-Life Example 2: Working Mother - Overweight to Healthy Range</h3>
      <div className="border-l-4 border-orange-500 pl-6">
        <p className="font-semibold mb-2">Profile: Priya (Age 35, Female)</p>
        <ul className="space-y-1 text-sm">
          <li>• Height: 160 cm (1.60 m)</li>
          <li>• Current Weight: 72 kg</li>
          <li>• Occupation: Marketing Manager + Mother of 2</li>
          <li>• Lifestyle: Busy schedule, irregular meals, limited exercise</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">Current BMI:</p>
          <p className="text-sm">BMI = 72 / (1.60)² = 72 / 2.56 = <strong className="text-orange-500">28.1 (Overweight)</strong></p>

          <div className="mt-4 p-3 bg-orange-500/10 rounded">
            <p className="font-semibold">Health Risks at BMI 28:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Elevated risk: Type 2 diabetes, high BP, joint problems</li>
              <li>• Energy levels: Often tired, breathlessness</li>
              <li>• Post-pregnancy weight retained for 5+ years</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-green-500/10 rounded">
            <p className="font-semibold">6-Month Weight Loss Plan:</p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Target 1: Overweight → Normal (3 months)</p>
                <ul className="ml-4 space-y-1">
                  <li>• Target Weight: 63 kg</li>
                  <li>• Target BMI: 63 / 2.56 = 24.6 (High Normal)</li>
                  <li>• Weight Loss: 9 kg in 12 weeks</li>
                  <li>• Weekly Loss: 0.75 kg (safe rate)</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Target 2: Optimal Weight (6 months)</p>
                <ul className="ml-4 space-y-1">
                  <li>• Target Weight: 58 kg</li>
                  <li>• Target BMI: 58 / 2.56 = <strong className="text-green-600">22.7 (Optimal)</strong></li>
                  <li>• Total Loss: 14 kg</li>
                  <li>• Daily Calorie Deficit: 500 calories</li>
                </ul>
              </div>

              <div className="bg-white/10 p-3 rounded mt-2">
                <p className="font-semibold">Action Plan:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Diet: 1500 cal/day (balanced, not crash diet)</li>
                  <li>• Exercise: 30 min walk daily + yoga 3×/week</li>
                  <li>• Lifestyle: 7-8 hours sleep, stress management</li>
                  <li>• Tracking: Weekly weigh-in, food diary</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 3: Middle-Aged Executive - Obesity to Overweight</h3>
      <div className="border-l-4 border-red-500 pl-6">
        <p className="font-semibold mb-2">Profile: Amit (Age 45, Male)</p>
        <ul className="space-y-1 text-sm">
          <li>• Height: 170 cm (1.70 m)</li>
          <li>• Current Weight: 92 kg</li>
          <li>• Occupation: Business Owner (desk job)</li>
          <li>• Health Issues: Pre-diabetic (HbA1c 6.2%), high cholesterol</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">Current Situation:</p>
          <p className="text-sm">BMI = 92 / (1.70)² = 92 / 2.89 = <strong className="text-red-500">31.8 (Obese Class I)</strong></p>

          <div className="mt-4 p-3 bg-red-500/20 rounded">
            <p className="font-semibold text-red-600">Immediate Health Concerns:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Type 2 Diabetes risk: 80% chance within 10 years</li>
              <li>• Cardiovascular disease risk: 3× higher than normal BMI</li>
              <li>• Sleep apnea symptoms reported</li>
              <li>• Joint pain in knees and lower back</li>
              <li>• Blood pressure: 140/90 (borderline high)</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 rounded">
            <p className="font-semibold">Doctor-Supervised Weight Loss Plan:</p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Phase 1: First 10% Loss (3 months) - CRITICAL</p>
                <ul className="ml-4 space-y-1">
                  <li>• Target Weight: 83 kg</li>
                  <li>• Target BMI: 28.4 (Overweight - major improvement)</li>
                  <li>• Weight Loss: 9 kg</li>
                  <li>• <strong className="text-green-600">Health Impact: HbA1c drops to 5.9%, BP normalizes</strong></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Phase 2: Reach Overweight (6 months)</p>
                <ul className="ml-4 space-y-1">
                  <li>• Target Weight: 77 kg</li>
                  <li>• Target BMI: 26.6 (Still overweight but much safer)</li>
                  <li>• Total Loss: 15 kg</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">Phase 3: Optimal Goal (12 months)</p>
                <ul className="ml-4 space-y-1">
                  <li>• Target Weight: 70 kg</li>
                  <li>• Target BMI: <strong className="text-green-600">24.2 (Normal Range)</strong></li>
                  <li>• Total Loss: 22 kg</li>
                  <li>• <strong>Diabetes risk reduced by 60%!</strong></li>
                </ul>
              </div>

              <div className="bg-white/10 p-3 rounded mt-2">
                <p className="font-semibold">Medical Intervention Plan:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Nutritionist consultation: 1800 cal/day meal plan</li>
                  <li>• Exercise physiologist: Gradual fitness program</li>
                  <li>• Monthly doctor checkups: Track HbA1c, lipid profile</li>
                  <li>• Possible medication: Metformin for pre-diabetes</li>
                  <li>• Behavioral therapy: Address emotional eating</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 4: BMI Across Different Heights - Target Weight Guide</h3>
      <p className="mb-4">What weight should you aim for based on your height?</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Height (cm)</th>
              <th className="p-3 text-left">Underweight (&lt;18.5)</th>
              <th className="p-3 text-left">Normal (18.5-24.9)</th>
              <th className="p-3 text-left">Overweight (25-29.9)</th>
              <th className="p-3 text-left">Obese (≥30)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-semibold">150 cm</td>
              <td className="p-3">&lt; 42 kg</td>
              <td className="p-3 bg-green-500/10">42 - 56 kg</td>
              <td className="p-3 bg-yellow-500/10">56 - 67 kg</td>
              <td className="p-3 bg-red-500/10">≥ 68 kg</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">160 cm</td>
              <td className="p-3">&lt; 47 kg</td>
              <td className="p-3 bg-green-500/10">47 - 64 kg</td>
              <td className="p-3 bg-yellow-500/10">64 - 77 kg</td>
              <td className="p-3 bg-red-500/10">≥ 77 kg</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">165 cm</td>
              <td className="p-3">&lt; 50 kg</td>
              <td className="p-3 bg-green-500/10">50 - 68 kg</td>
              <td className="p-3 bg-yellow-500/10">68 - 82 kg</td>
              <td className="p-3 bg-red-500/10">≥ 82 kg</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">170 cm</td>
              <td className="p-3">&lt; 53 kg</td>
              <td className="p-3 bg-green-500/10">53 - 72 kg</td>
              <td className="p-3 bg-yellow-500/10">72 - 87 kg</td>
              <td className="p-3 bg-red-500/10">≥ 87 kg</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">175 cm</td>
              <td className="p-3">&lt; 57 kg</td>
              <td className="p-3 bg-green-500/10">57 - 76 kg</td>
              <td className="p-3 bg-yellow-500/10">76 - 92 kg</td>
              <td className="p-3 bg-red-500/10">≥ 92 kg</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">180 cm</td>
              <td className="p-3">&lt; 60 kg</td>
              <td className="p-3 bg-green-500/10">60 - 81 kg</td>
              <td className="p-3 bg-yellow-500/10">81 - 97 kg</td>
              <td className="p-3 bg-red-500/10">≥ 97 kg</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs italic">
        💡 Tip: Aim for the middle of the normal range (BMI 21-22) for optimal health
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">BMI Limitations - When It Doesn't Tell the Full Story</h3>
      
      <div className="space-y-4">
        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">❌ Case 1: Athletic Build - High Muscle Mass</h4>
          <p className="text-sm"><strong>Example: Vikram (Age 30, Professional Cricketer)</strong></p>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Height: 178 cm, Weight: 85 kg</li>
            <li>• BMI: 26.8 (Overweight according to chart)</li>
            <li>• Reality: 12% body fat, highly muscular</li>
            <li>• <strong className="text-green-600">Actual Status: Extremely fit, BMI misleading</strong></li>
          </ul>
          <p className="text-xs mt-2 italic">
            Why: Muscle weighs more than fat. BMI doesn't distinguish between muscle and fat mass.
          </p>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">❌ Case 2: Skinny Fat - Normal BMI but High Body Fat</h4>
          <p className="text-sm"><strong>Example: Neha (Age 28, Office Worker)</strong></p>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Height: 162 cm, Weight: 58 kg</li>
            <li>• BMI: 22.1 (Normal range)</li>
            <li>• Body Fat: 32% (high for her age)</li>
            <li>• <strong className="text-orange-600">Actual Status: Metabolically unhealthy despite normal BMI</strong></li>
          </ul>
          <p className="text-xs mt-2 italic">
            Why: Low muscle mass, high visceral fat. Needs strength training, not weight loss.
          </p>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">❌ Case 3: Elderly - Muscle Loss Masks Obesity</h4>
          <p className="text-sm"><strong>Example: Mr. Sharma (Age 70)</strong></p>
          <ul className="text-sm space-y-1 mt-2">
            <li>• Height: 168 cm, Weight: 65 kg</li>
            <li>• BMI: 23.0 (Normal)</li>
            <li>• Reality: Sarcopenia (muscle loss), high belly fat</li>
            <li>• <strong className="text-orange-600">Risk: Type 2 diabetes despite "normal" BMI</strong></li>
          </ul>
          <p className="text-xs mt-2 italic">
            Why: Age-related muscle loss. Waist circumference is better metric for elderly.
          </p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
        <p className="font-semibold">Better Metrics to Use Alongside BMI:</p>
        <ul className="text-sm space-y-2 mt-2">
          <li>• <strong>Waist Circumference:</strong> Men &gt;90cm / Women &gt;80cm = health risk</li>
          <li>• <strong>Waist-to-Hip Ratio:</strong> &gt;0.9 (men) / &gt;0.85 (women) = risk</li>
          <li>• <strong>Body Fat Percentage:</strong> More accurate than BMI for fitness</li>
          <li>• <strong>Waist-to-Height Ratio:</strong> Should be less than 0.5</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Health Risks by BMI Category - The Science</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 bg-blue-500/5">
          <h4 className="font-semibold mb-2 text-blue-600">Underweight (BMI &lt; 18.5)</h4>
          <p className="text-xs mb-2">Increased Risk Of:</p>
          <ul className="text-sm space-y-1">
            <li>• Weakened immune system</li>
            <li>• Osteoporosis and fractures</li>
            <li>• Anemia and nutrient deficiencies</li>
            <li>• Fertility issues (women)</li>
            <li>• Delayed wound healing</li>
            <li>• Depression and anxiety</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-green-500/5">
          <h4 className="font-semibold mb-2 text-green-600">Normal Weight (BMI 18.5-24.9)</h4>
          <p className="text-xs mb-2">Optimal Health Status:</p>
          <ul className="text-sm space-y-1">
            <li>• Lowest mortality risk</li>
            <li>• Best cardiovascular health</li>
            <li>• Optimal metabolic function</li>
            <li>• Good energy levels</li>
            <li>• Healthy hormone balance</li>
            <li>• Strong immune system</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-yellow-500/5">
          <h4 className="font-semibold mb-2 text-yellow-600">Overweight (BMI 25-29.9)</h4>
          <p className="text-xs mb-2">Moderate Risk Of:</p>
          <ul className="text-sm space-y-1">
            <li>• Type 2 diabetes (2× risk)</li>
            <li>• High blood pressure</li>
            <li>• High cholesterol</li>
            <li>• Heart disease</li>
            <li>• Sleep apnea</li>
            <li>• Joint problems (osteoarthritis)</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-red-500/5">
          <h4 className="font-semibold mb-2 text-red-600">Obese (BMI ≥ 30)</h4>
          <p className="text-xs mb-2">High Risk Of:</p>
          <ul className="text-sm space-y-1">
            <li>• Type 2 diabetes (7× risk)</li>
            <li>• Heart disease and stroke</li>
            <li>• Certain cancers (13 types)</li>
            <li>• Severe sleep apnea</li>
            <li>• Fatty liver disease</li>
            <li>• Kidney disease</li>
            <li>• Infertility</li>
            <li>• Depression</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">BMI for Children & Teens - Different Standards</h3>
      
      <div className="bg-purple-500/10 p-6 rounded-lg">
        <p className="mb-3 font-semibold">Children (2-18 years) use BMI Percentiles, not fixed numbers:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-2 text-left">BMI Percentile</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Action Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2">&lt; 5th percentile</td>
                <td className="p-2">Underweight</td>
                <td className="p-2 text-sm">Pediatric nutritionist consultation</td>
              </tr>
              <tr className="border-b bg-green-500/10">
                <td className="p-2">5th - 85th percentile</td>
                <td className="p-2">Healthy Weight</td>
                <td className="p-2 text-sm">Encourage healthy habits</td>
              </tr>
              <tr className="border-b bg-yellow-500/10">
                <td className="p-2">85th - 95th percentile</td>
                <td className="p-2">Overweight</td>
                <td className="p-2 text-sm">Lifestyle modification needed</td>
              </tr>
              <tr className="border-b bg-red-500/10">
                <td className="p-2">≥ 95th percentile</td>
                <td className="p-2">Obese</td>
                <td className="p-2 text-sm">Medical intervention required</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs mt-4 italic">
          Example: A 10-year-old boy at 60th percentile is healthier than 60% of boys his age - this is normal and healthy.
          Use CDC or WHO growth charts for accurate assessment.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Common BMI Mistakes to Avoid</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Obsessing Over Daily Weight Changes</p>
            <p className="text-sm">Weight fluctuates 1-2 kg daily due to water, food, etc. Weigh once a week, 
            same time, same conditions (morning, after bathroom, before eating).</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Crash Dieting to "Fix" BMI Fast</p>
            <p className="text-sm">Losing more than 1 kg/week is unhealthy. You lose muscle, slow metabolism, 
            and gain it all back. Aim for 0.5-1 kg/week for sustainable results.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Ignoring Body Composition</p>
            <p className="text-sm">Two people with same BMI can look completely different. One might be muscular 
            and fit, other might be "skinny fat". Use body fat % alongside BMI.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Comparing Your BMI to Athletes/Models</p>
            <p className="text-sm">Professional athletes have specialized training and genetics. Models often have 
            unhealthily low BMI. Focus on YOUR healthy range, not media standards.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Action Plan by BMI Category</h3>
      
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">If You're Underweight (BMI &lt; 18.5)</h4>
          <ul className="text-sm space-y-2">
            <li>✓ Eat calorie-dense foods: nuts, nut butter, dried fruits, whole milk</li>
            <li>✓ 5-6 small meals per day instead of 3 large ones</li>
            <li>✓ Strength training to build muscle mass</li>
            <li>✓ Protein shake between meals (banana, milk, peanut butter)</li>
            <li>✓ Rule out medical causes: thyroid, malabsorption, mental health</li>
            <li>✓ Target: Gain 0.5 kg per week</li>
          </ul>
        </div>

        <div className="border-l-4 border-green-500 pl-4 bg-green-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">If You're Normal Weight (BMI 18.5-24.9)</h4>
          <ul className="text-sm space-y-2">
            <li>✓ Maintain through balanced diet and regular exercise</li>
            <li>✓ 30 min moderate exercise 5 days/week</li>
            <li>✓ Focus on muscle building, not just weight maintenance</li>
            <li>✓ Annual health checkup to monitor metabolic markers</li>
            <li>✓ Don't become complacent - prevent future weight gain</li>
          </ul>
        </div>

        <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">If You're Overweight (BMI 25-29.9)</h4>
          <ul className="text-sm space-y-2">
            <li>✓ Goal: Lose 5-10% body weight (significant health improvement)</li>
            <li>✓ Create 500 cal/day deficit (diet 300 + exercise 200)</li>
            <li>✓ Focus on whole foods, reduce processed foods and sugar</li>
            <li>✓ Track food intake for 2 weeks to identify problem areas</li>
            <li>✓ 45 min exercise 5 days/week (cardio + strength mix)</li>
            <li>✓ Target: Lose 0.5-1 kg per week</li>
          </ul>
        </div>

        <div className="border-l-4 border-red-500 pl-4 bg-red-500/10 p-4 rounded">
          <h4 className="font-semibold mb-2">If You're Obese (BMI ≥ 30)</h4>
          <ul className="text-sm space-y-2">
            <li>✓ <strong>Medical supervision essential</strong> - consult doctor first</li>
            <li>✓ Get blood work: HbA1c, lipid panel, thyroid, liver function</li>
            <li>✓ Work with registered dietitian for meal planning</li>
            <li>✓ Start with low-impact exercise: walking, swimming, cycling</li>
            <li>✓ Consider behavioral therapy for emotional eating</li>
            <li>✓ In severe cases (BMI &gt; 40): discuss bariatric surgery options</li>
            <li>✓ Monthly medical monitoring during weight loss</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Quick BMI Health Checklist</h3>
      
      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Calculate your BMI accurately (use digital scale, measure height properly)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Understand your category and associated health risks</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Also measure waist circumference (more accurate for health risk)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Set realistic weight goal (5-10% loss if overweight/obese)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Create sustainable diet plan (not crash diet)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Start/increase physical activity gradually</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Track progress weekly, not daily</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Consult doctor if BMI &lt;18.5 or ≥30</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Get annual health checkup regardless of BMI</span>
        </label>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Conclusion - BMI is a Starting Point</h3>
      <p className="leading-relaxed">
        BMI is a useful screening tool to identify potential weight-related health risks, but it's not the complete picture. 
        Use it alongside other metrics like waist circumference, body fat percentage, and most importantly - how you FEEL. 
        Two people with the same BMI can have vastly different health outcomes based on diet quality, exercise habits, 
        stress levels, and sleep. Focus on sustainable lifestyle changes rather than just the number on the scale.
      </p>
      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
        <p className="font-semibold text-lg">Remember:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>✓ BMI is a guide, not a life sentence</li>
          <li>✓ Small, consistent changes beat drastic temporary measures</li>
          <li>✓ Health is multidimensional - physical, mental, and emotional</li>
          <li>✓ Consult healthcare professionals for personalized advice</li>
        </ul>
      </div>
      <p className="mt-4 text-sm font-semibold bg-primary/10 p-4 rounded">
        💡 Pro Tip: Take progress photos and measurements (chest, waist, hips, thighs) monthly. 
        The scale might not move much, but you'll SEE and FEEL the difference. Body composition changes 
        matter more than just weight. Build muscle, lose fat, improve health - that's the real goal!
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Is BMI accurate for athletes?"
          answer="BMI may not be accurate for athletes or bodybuilders because it doesn't distinguish between muscle mass and fat. Muscle is denser than fat, so a muscular person might have a high BMI but low body fat."
        />
        <FaqItem 
          question="Does BMI differ for men and women?"
          answer="The standard BMI formula is the same for adult men and women. However, women naturally have more body fat than men at the same BMI level."
        />
        <FaqItem 
          question="What is the best time to weigh myself?"
          answer="For the most consistent results, weigh yourself first thing in the morning, after using the restroom and before eating or drinking, wearing minimal clothing."
        />
        <FaqItem 
          question="Can I calculate BMI for children?"
          answer="For children and teens (ages 2-19), BMI is calculated the same way but interpreted differently using age-and-gender-specific percentiles."
        />
      </div>
    </section>
  </div>
)
