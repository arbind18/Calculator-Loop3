import os

# Content definitions for each calculator
CONTENT_MAP = {
    "Blood-Pressure-Calculator.html": {
        "article": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Understanding Blood Pressure: A Complete Guide</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">What do the numbers mean?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Blood pressure is recorded as two numbers:
                </p>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Systolic (top number):</strong> Indicates how much pressure your blood is exerting against your artery walls when the heart beats.</li>
                    <li><strong>Diastolic (bottom number):</strong> Indicates how much pressure your blood is exerting against your artery walls while the heart is resting between beats.</li>
                </ul>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Blood Pressure Categories</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    According to the American Heart Association:
                </p>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Normal:</strong> Less than 120/80 mm Hg</li>
                    <li><strong>Elevated:</strong> Systolic between 120-129 AND diastolic less than 80</li>
                    <li><strong>High Blood Pressure (Stage 1):</strong> Systolic 130-139 OR diastolic 80-89</li>
                    <li><strong>High Blood Pressure (Stage 2):</strong> Systolic 140 or higher OR diastolic 90 or higher</li>
                    <li><strong>Hypertensive Crisis:</strong> Systolic higher than 180 AND/OR diastolic higher than 120</li>
                </ul>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Tips for Healthy Blood Pressure</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Lifestyle changes can significantly improve your numbers:
                </p>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li>Reduce sodium (salt) intake</li>
                    <li>Eat a heart-healthy diet (DASH diet)</li>
                    <li>Get regular physical activity</li>
                    <li>Maintain a healthy weight</li>
                    <li>Limit alcohol consumption</li>
                    <li>Manage stress effectively</li>
                </ul>
            </section>
        </article>
    </div>
""",
        "faq": """
    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>What is the "silent killer"?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>High blood pressure is often called the "silent killer" because it may have no warning signs or symptoms, and many people do not know they have it.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>How often should I check my blood pressure?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>If your blood pressure is normal, get it checked at least every two years starting at age 20. If you have high blood pressure, your doctor may recommend more frequent monitoring.</p></div></div>
            
        <div class="faq-item"><div class="faq-question">
            <h3>Can drinking water lower blood pressure?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Staying well-hydrated is important for overall health and can help maintain healthy blood pressure levels, but it is not a substitute for medication or lifestyle changes prescribed by a doctor.</p></div></div>
    </div>
""",
        "schema": """
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is normal blood pressure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Normal blood pressure is defined as less than 120/80 mm Hg."
                }
            },
            {
                "@type": "Question",
                "name": "What causes high blood pressure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Common causes include unhealthy diet, lack of physical activity, obesity, and too much alcohol."
                }
            }
        ]
    }
    </script>
"""
    },
    "Cardiovascular-Risk-Calculator.html": {
        "article": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Understanding Cardiovascular Risk</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">What is Cardiovascular Disease (CVD)?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    CVD refers to a group of disorders of the heart and blood vessels, including coronary heart disease, cerebrovascular disease, and rheumatic heart disease. It is the leading cause of death globally.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Key Risk Factors</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Age:</strong> Risk increases as you get older.</li>
                    <li><strong>Gender:</strong> Men are generally at higher risk at an earlier age than women.</li>
                    <li><strong>High Blood Pressure:</strong> A major risk factor for heart attack and stroke.</li>
                    <li><strong>High Cholesterol:</strong> Can lead to plaque buildup in arteries.</li>
                    <li><strong>Smoking:</strong> Damages blood vessels and reduces oxygen in the blood.</li>
                    <li><strong>Diabetes:</strong> Increases the risk of CVD significantly.</li>
                </ul>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Prevention Strategies</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Most cardiovascular diseases can be prevented by addressing behavioral risk factors such as tobacco use, unhealthy diet and obesity, physical inactivity and harmful use of alcohol.
                </p>
            </section>
        </article>
    </div>
""",
        "faq": """
    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>What is a 10-year risk score?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>It estimates your probability of having a heart attack or stroke within the next 10 years based on your current risk factors.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>Can I lower my risk?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Yes! Quitting smoking, lowering cholesterol and blood pressure, and exercising regularly can significantly reduce your risk.</p></div></div>
    </div>
""",
        "schema": """
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What are the main risk factors for heart disease?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "High blood pressure, high cholesterol, and smoking are key risk factors for heart disease."
                }
            }
        ]
    }
    </script>
"""
    },
    "Pulse-Pressure-Calculator.html": {
        "article": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">What is Pulse Pressure?</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Definition</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Pulse pressure is the difference between your systolic (top number) and diastolic (bottom number) blood pressure readings. It represents the force that the heart generates each time it contracts.
                </p>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    <strong>Formula:</strong> Pulse Pressure = Systolic BP - Diastolic BP
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Why is it important?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    A wide (high) pulse pressure may be a predictor of heart attacks or other cardiovascular diseases, especially in older adults. It can indicate stiffening of the arteries.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Normal Range</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Generally, a pulse pressure of 40 mm Hg is considered normal. A pulse pressure greater than 60 mm Hg is considered a risk factor for cardiovascular disease.
                </p>
            </section>
        </article>
    </div>
""",
        "faq": """
    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>What causes high pulse pressure?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>The most common cause is stiffness of the aorta, the largest artery in the body, often due to aging or high blood pressure.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>Can low pulse pressure be a problem?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Yes, a low pulse pressure (less than 25% of systolic value) can indicate poor heart function, such as heart failure or significant blood loss.</p></div></div>
    </div>
""",
        "schema": """
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is a normal pulse pressure?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A pulse pressure of approximately 40 mm Hg is considered normal."
                }
            }
        ]
    }
    </script>
"""
    },
    "Resting-Heart-Rate-Calculator.html": {
        "article": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Resting Heart Rate: A Vital Health Indicator</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">What is Resting Heart Rate (RHR)?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Your resting heart rate is the number of times your heart beats per minute while you are at complete rest. It is a key indicator of your basic heart health and cardiovascular fitness.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Normal Ranges</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Adults:</strong> 60 to 100 beats per minute (bpm).</li>
                    <li><strong>Athletes:</strong> 40 to 60 bpm.</li>
                </ul>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Generally, a lower resting heart rate implies more efficient heart function and better cardiovascular fitness.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Factors Affecting RHR</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li>Age</li>
                    <li>Fitness and activity levels</li>
                    <li>Smoking</li>
                    <li>Cardiovascular disease, high cholesterol or diabetes</li>
                    <li>Air temperature</li>
                    <li>Body position</li>
                    <li>Emotions</li>
                </ul>
            </section>
        </article>
    </div>
""",
        "faq": """
    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>When is the best time to measure RHR?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>The best time is in the morning, right after you wake up, before you get out of bed or have any caffeine.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>What if my heart rate is consistently above 100 bpm?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>A resting heart rate consistently above 100 bpm is called tachycardia. You should consult a doctor to determine the cause.</p></div></div>
    </div>
""",
        "schema": """
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is a normal resting heart rate?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For most adults, a normal resting heart rate is between 60 and 100 beats per minute."
                }
            }
        ]
    }
    </script>
"""
    },
    "Target-Heart-Rate-Calculator.html": {
        "article": """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Optimizing Your Workout with Target Heart Rate</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Why calculate Target Heart Rate?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Your target heart rate helps you pace your workouts to achieve specific fitness goals without overtraining. It ensures you are exercising at the right intensity.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Heart Rate Zones</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Moderate Intensity (50-70%):</strong> Good for warm-up and fat burning.</li>
                    <li><strong>Vigorous Intensity (70-85%):</strong> Improves cardiovascular fitness and endurance.</li>
                    <li><strong>Maximum Effort (85-100%):</strong> For short bursts of high-intensity interval training (HIIT).</li>
                </ul>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">The Karvonen Method</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    This calculator uses the Karvonen formula, which takes into account your resting heart rate, providing a more personalized target zone than the standard "220 minus age" formula.
                </p>
            </section>
        </article>
    </div>
""",
        "faq": """
    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Frequently Asked Questions</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>How do I measure my heart rate during exercise?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>You can use a heart rate monitor, smartwatch, or manually check your pulse at your wrist or neck for 10 seconds and multiply by 6.</p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>Is it safe to exceed my target heart rate?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>Briefly exceeding it is usually safe for healthy individuals, but sustaining a rate near your maximum can be dangerous. Always listen to your body.</p></div></div>
    </div>
""",
        "schema": """
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the target heart rate for fat burning?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The fat-burning zone is typically between 50% and 70% of your maximum heart rate."
                }
            }
        ]
    }
    </script>
"""
    }
}

def add_content(filepath, content_data):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if content is already added
    if "<!-- Rich Content Section -->" in content:
        print(f"Skipping {filepath}: Content already present")
        return

    # Find insertion point: Before <!-- Floating Chat Widget -->
    insert_marker = '<!-- Floating Chat Widget -->'
    if insert_marker not in content:
        print(f"Skipping {filepath}: Chat widget marker not found")
        return

    insert_index = content.find(insert_marker)
    
    # Construct new content
    new_section = content_data["article"] + "\n" + content_data["faq"] + "\n" + content_data["schema"] + "\n"
    
    # Insert content
    new_content = content[:insert_index] + new_section + content[insert_index:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath}")

def main():
    root_dir = r"c:\Users\dell\Desktop\calculatorloop.com\Health\Heart-and-Vital-Health"
    for filename, data in CONTENT_MAP.items():
        filepath = os.path.join(root_dir, filename)
        if os.path.exists(filepath):
            add_content(filepath, data)
        else:
            print(f"File not found: {filepath}")

if __name__ == "__main__":
    main()
