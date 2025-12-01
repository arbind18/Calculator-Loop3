import os

# Define the base path
base_path = r"c:\Users\dell\Desktop\calculatorloop.com\Health\Nutrition-and-Calories"

# Define the correct content for each calculator
calculators = {
    "Protein-Calculator.html": {
        "script": """
    <script>
        function calculate() {
            const weight = parseFloat(document.getElementById('weight').value);
            const activity = parseFloat(document.getElementById('activity').value);
            const goal = parseFloat(document.getElementById('goal').value);
            
            if (!weight || weight < 30) {
                alert('Please enter a valid weight');
                return;
            }
            
            // Calculate protein needs
            const baseProtein = weight * activity;
            const totalProtein = baseProtein * goal;
            
            // Determine category and recommendations
            let category, color, description, recommendations;
            
            if (activity < 1.0) {
                category = 'Sedentary';
                color = '#fbc02d';
                description = 'Your protein needs are baseline. Focus on quality sources.';
            } else if (activity < 1.6) {
                category = 'Active';
                color = '#388e3c';
                description = 'You need more protein to support your activity level.';
            } else {
                category = 'Athlete';
                color = '#1976d2';
                description = 'High protein intake is crucial for recovery and performance.';
            }
            
            recommendations = `
                <h3 style="color: ${color}; margin-bottom: 10px;">Daily Targets:</h3>
                <ul style="line-height: 2;">
                    <li><strong>Total Protein:</strong> ${Math.round(totalProtein)}g per day</li>
                    <li><strong>Per Meal (4 meals):</strong> ${Math.round(totalProtein / 4)}g</li>
                    <li><strong>Per Meal (5 meals):</strong> ${Math.round(totalProtein / 5)}g</li>
                </ul>
                <h4 style="margin-top: 15px;">Recommended Sources:</h4>
                <p>Chicken breast, fish, eggs, greek yogurt, lean beef, tofu, lentils, whey protein.</p>
            `;
            
            // Display results
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            document.getElementById('resultValue').textContent = Math.round(totalProtein) + 'g';
            document.getElementById('resultDetails').innerHTML = `
                <h3 style="color: ${color}">${category} Level</h3>
                <p>${description}</p>
                ${recommendations}
            `;
            
            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Calculate on page load
        // calculate();
    </script>
""",
        "rich_content": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Protein Calculator: Optimize Your Intake</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Why Protein Matters?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Protein is an essential macronutrient that plays a critical role in building and repairing tissues, making enzymes and hormones, and supporting immune function. Unlike fat and carbohydrates, the body does not store protein, so there is no reservoir to draw on when it needs a new supply.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">How Much Protein Do You Need?</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Sedentary Adults:</strong> 0.8g per kg of body weight.</li>
                    <li><strong>Endurance Athletes:</strong> 1.2-1.4g per kg of body weight.</li>
                    <li><strong>Strength Athletes:</strong> 1.6-2.2g per kg of body weight.</li>
                    <li><strong>Weight Loss:</strong> Higher protein (1.6-2.4g/kg) helps preserve muscle mass while in a calorie deficit.</li>
                </ul>
            </section>
        </article>
    </div>

    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>1. Can I eat too much protein?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>For most healthy people, a high-protein diet is not harmful, particularly when followed for a short time. However, extremely high protein intake over a long period can strain the kidneys in individuals with pre-existing kidney disease.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>2. What are the best sources of protein?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Animal sources like meat, poultry, fish, eggs, and dairy provide complete proteins. Plant sources like beans, lentils, nuts, seeds, and soy are also excellent, though some may need to be combined to ensure a complete amino acid profile.</p></div></div>
    </div>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can I eat too much protein?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For most healthy people, a high-protein diet is not harmful. However, extremely high protein intake can strain kidneys in those with pre-existing conditions."
                }
            },
            {
                "@type": "Question",
                "name": "What are the best sources of protein?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Animal sources like meat, fish, and eggs provide complete proteins. Plant sources like beans, lentils, and soy are also excellent."
                }
            }
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Protein Calculator",
        "description": "Calculate your daily protein requirements based on weight, activity level, and fitness goals.",
        "url": "https://calculatorloop.com/Health/Nutrition-and-Calories/Protein-Calculator.html",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
"""
    },
    "Meal-Planner-Calculator.html": {
        "script": """
    <script>
        function calculate() {
            const calories = parseFloat(document.getElementById('calories').value);
            const meals = parseInt(document.getElementById('meals').value);
            const dist = document.getElementById('dist').value;
            
            if (!calories || calories < 500) {
                alert('Please enter valid daily calories');
                return;
            }
            
            let distribution = [];
            let mealNames = [];
            
            if (meals === 3) mealNames = ['Breakfast', 'Lunch', 'Dinner'];
            else if (meals === 4) mealNames = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
            else if (meals === 5) mealNames = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner'];
            else mealNames = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner', 'Snack 3'];
            
            if (dist === 'equal') {
                const perMeal = calories / meals;
                distribution = Array(meals).fill(perMeal);
            } else if (dist === 'larger-dinner') {
                const dinnerCals = calories * 0.4;
                const remaining = calories - dinnerCals;
                const otherMeals = remaining / (meals - 1);
                distribution = Array(meals - 1).fill(otherMeals);
                distribution.push(dinnerCals);
            } else if (dist === 'larger-lunch') {
                const lunchIndex = mealNames.indexOf('Lunch');
                const lunchCals = calories * 0.4;
                const remaining = calories - lunchCals;
                const otherMeals = remaining / (meals - 1);
                distribution = Array(meals).fill(otherMeals);
                distribution[lunchIndex] = lunchCals;
            }
            
            let resultHTML = '<ul style="list-style: none; padding: 0;">';
            distribution.forEach((cals, index) => {
                resultHTML += `
                    <li style="background: #f8f9fa; padding: 10px; margin-bottom: 5px; border-radius: 5px; display: flex; justify-content: space-between;">
                        <strong>${mealNames[index]}:</strong>
                        <span>${Math.round(cals)} kcal</span>
                    </li>
                `;
            });
            resultHTML += '</ul>';
            
            // Display results
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            document.getElementById('resultValue').textContent = Math.round(calories) + ' kcal';
            document.getElementById('resultDetails').innerHTML = `
                <h3 style="color: #667eea">Meal Plan Breakdown</h3>
                <p>Based on ${meals} meals with ${dist.replace('-', ' ')} distribution:</p>
                ${resultHTML}
            `;
            
            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
""",
        "rich_content": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Meal Planning: The Key to Nutritional Success</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Benefits of Meal Planning</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Meal planning is one of the most effective strategies for maintaining a healthy diet. It helps you control portion sizes, ensure nutritional balance, reduce food waste, and save money. By deciding what to eat in advance, you're less likely to make impulsive, unhealthy food choices when hunger strikes.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">How to Distribute Calories</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Calorie distribution depends on your lifestyle and preferences. Some people prefer three large meals, while others do better with smaller, more frequent meals.
                </p>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Equal Distribution:</strong> Good for steady energy levels throughout the day.</li>
                    <li><strong>Larger Lunch:</strong> Beneficial if you need more energy during the workday.</li>
                    <li><strong>Larger Dinner:</strong> Common for social reasons or if you prefer a hearty meal at the end of the day.</li>
                </ul>
            </section>
        </article>
    </div>

    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>1. How many meals should I eat a day?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>There is no "perfect" number. Whether you eat 3 meals or 6, the most important factor is total daily calorie and nutrient intake. Choose a frequency that fits your schedule and keeps you satisfied.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>2. Does eating late at night cause weight gain?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Weight gain is primarily determined by total calorie intake versus expenditure, not the time of day. However, late-night snacking often leads to consuming extra, unnecessary calories.</p></div></div>
    </div>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How many meals should I eat a day?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "There is no perfect number. The most important factor is total daily calorie and nutrient intake. Choose a frequency that fits your schedule."
                }
            },
            {
                "@type": "Question",
                "name": "Does eating late at night cause weight gain?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Weight gain is primarily determined by total calorie intake, not the time of day. However, late-night snacking often leads to consuming extra calories."
                }
            }
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Meal Planner Calculator",
        "description": "Plan your daily meal calorie distribution for weight loss or maintenance.",
        "url": "https://calculatorloop.com/Health/Nutrition-and-Calories/Meal-Planner-Calculator.html",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
"""
    },
    "TDEE-Calculator.html": {
        "script": """
    <script>
        function calculate() {
            const age = parseFloat(document.getElementById('age').value);
            const gender = document.getElementById('gender').value;
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);
            const activity = parseFloat(document.getElementById('activity').value);
            
            if (!age || !weight || !height) {
                alert('Please enter valid details');
                return;
            }
            
            // Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
            } else {
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
            }
            
            const tdee = bmr * activity;
            
            // Display results
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            document.getElementById('resultValue').textContent = Math.round(tdee) + ' kcal/day';
            document.getElementById('resultDetails').innerHTML = `
                <h3 style="color: #667eea">Your Energy Needs</h3>
                <p><strong>Basal Metabolic Rate (BMR):</strong> ${Math.round(bmr)} kcal/day</p>
                <p>This is the energy your body needs just to function at rest.</p>
                <h4 style="margin-top: 15px;">Goal Adjustments:</h4>
                <ul style="line-height: 2;">
                    <li><strong>Weight Loss (-500):</strong> ${Math.round(tdee - 500)} kcal</li>
                    <li><strong>Maintenance:</strong> ${Math.round(tdee)} kcal</li>
                    <li><strong>Weight Gain (+500):</strong> ${Math.round(tdee + 500)} kcal</li>
                </ul>
            `;
            
            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
""",
        "rich_content": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Understanding TDEE: Total Daily Energy Expenditure</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">What is TDEE?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    TDEE stands for Total Daily Energy Expenditure. It represents the total number of calories your body burns in a day, accounting for your Basal Metabolic Rate (BMR) and your physical activity level. Knowing your TDEE is crucial for weight management.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Components of TDEE</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>BMR (Basal Metabolic Rate):</strong> Calories burned at rest (breathing, circulation, cell production). Accounts for ~60-70% of TDEE.</li>
                    <li><strong>TEF (Thermic Effect of Food):</strong> Calories burned digesting and processing food. Accounts for ~10% of TDEE.</li>
                    <li><strong>NEAT (Non-Exercise Activity Thermogenesis):</strong> Calories burned from daily movements like walking, standing, fidgeting.</li>
                    <li><strong>EAT (Exercise Activity Thermogenesis):</strong> Calories burned during planned exercise.</li>
                </ul>
            </section>
        </article>
    </div>

    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>1. How accurate is this TDEE calculator?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>This calculator uses the Mifflin-St Jeor equation, considered one of the most accurate for the general population. However, individual metabolism varies. Use this as a starting point and adjust based on your progress.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>2. Should I eat back my exercise calories?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>If you correctly selected your activity level, your exercise calories are already included in your TDEE. Do not add them again, or you may overeat.</p></div></div>
    </div>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How accurate is this TDEE calculator?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This calculator uses the Mifflin-St Jeor equation, considered one of the most accurate. However, individual metabolism varies, so use this as a starting point."
                }
            },
            {
                "@type": "Question",
                "name": "Should I eat back my exercise calories?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "If you correctly selected your activity level, your exercise calories are already included in your TDEE. Do not add them again."
                }
            }
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "TDEE Calculator",
        "description": "Calculate your Total Daily Energy Expenditure (TDEE) to know how many calories you burn daily.",
        "url": "https://calculatorloop.com/Health/Nutrition-and-Calories/TDEE-Calculator.html",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
"""
    },
    "Water-Intake-Calculator.html": {
        "script": """
    <script>
        function calculate() {
            const weight = parseFloat(document.getElementById('weight').value);
            const activity = parseFloat(document.getElementById('activity').value);
            const climate = parseFloat(document.getElementById('climate').value);
            
            if (!weight || weight < 20) {
                alert('Please enter a valid weight');
                return;
            }
            
            // Base calculation: 33ml per kg
            let waterNeeds = weight * 0.033;
            
            // Activity adjustment (liters)
            waterNeeds += activity;
            
            // Climate adjustment (liters)
            waterNeeds += climate;
            
            // Display results
            const resultDiv = document.getElementById('result');
            resultDiv.style.display = 'block';
            
            document.getElementById('resultValue').textContent = waterNeeds.toFixed(1) + ' Liters';
            document.getElementById('resultDetails').innerHTML = `
                <h3 style="color: #667eea">Daily Hydration Goal</h3>
                <p>Based on your weight, activity, and climate.</p>
                <h4 style="margin-top: 15px;">Equivalent to:</h4>
                <ul style="line-height: 2;">
                    <li>${Math.round(waterNeeds * 1000 / 250)} glasses (250ml)</li>
                    <li>${Math.round(waterNeeds * 1000 / 500)} bottles (500ml)</li>
                </ul>
                <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">*Drink more if you sweat heavily.</p>
            `;
            
            // Scroll to result
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
""",
        "rich_content": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Hydration: The Foundation of Health</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Why Hydration is Critical</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Water makes up about 60% of your body weight and is involved in every bodily function. It regulates temperature, lubricates joints, protects tissues, and transports nutrients and oxygen to cells. Even mild dehydration can lead to fatigue, headaches, and impaired cognitive function.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Signs of Dehydration</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li>Thirst (a late sign)</li>
                    <li>Dark yellow urine</li>
                    <li>Dry mouth and skin</li>
                    <li>Fatigue and dizziness</li>
                    <li>Headache</li>
                </ul>
            </section>
        </article>
    </div>

    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>1. Does coffee count towards water intake?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Yes, in moderation. While caffeine has a mild diuretic effect, the water in coffee and tea still contributes to hydration. However, plain water is always the best choice.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>2. Can I drink too much water?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Yes, it's possible but rare. Drinking excessive amounts of water in a short period can lead to hyponatremia (low blood sodium), which can be dangerous. Listen to your thirst and spread intake throughout the day.</p></div></div>
    </div>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Does coffee count towards water intake?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, in moderation. While caffeine has a mild diuretic effect, the water in coffee and tea still contributes to hydration."
                }
            },
            {
                "@type": "Question",
                "name": "Can I drink too much water?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, it's possible but rare. Drinking excessive amounts of water in a short period can lead to hyponatremia."
                }
            }
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Water Intake Calculator",
        "description": "Calculate your daily water intake needs based on weight, activity, and climate.",
        "url": "https://calculatorloop.com/Health/Nutrition-and-Calories/Water-Intake-Calculator.html",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
"""
    }
}

def fix_file(filename, data):
    filepath = os.path.join(base_path, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the incorrect script
    script_start_marker = "function calculateDiabetesRisk()"
    script_start_idx = content.find(script_start_marker)
    
    if script_start_idx == -1:
        print(f"Could not find incorrect script in {filename}")
        # Try to find where to insert if it's missing or different
        # But for now, let's assume the structure is consistent with what we saw
        return

    # Find the start of the <script> tag containing this function
    script_tag_start = content.rfind("<script>", 0, script_start_idx)
    
    # Find the end of the Schema Markup
    schema_end_marker = "</script>"
    # We need the last </script> before the Chat Widget scripts
    # The Chat Widget scripts start with "<!-- Floating Chat Widget -->"
    # Or we can look for the end of the last schema script
    
    # Let's look for the "Floating Chat Widget" comment
    chat_widget_marker = "<!-- Floating Chat Widget -->"
    chat_widget_idx = content.find(chat_widget_marker)
    
    if chat_widget_idx == -1:
        print(f"Could not find Chat Widget marker in {filename}")
        return

    # The section to replace is from script_tag_start to chat_widget_idx
    # But we need to be careful not to cut off the chat widget
    
    # Construct the new content
    new_section = data["script"] + data["rich_content"] + "\n\n"
    
    # Replace
    new_content = content[:script_tag_start] + new_section + content[chat_widget_idx:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Fixed {filename}")

# Run the fix for each calculator
for filename, data in calculators.items():
    fix_file(filename, data)

print("All files processed.")
