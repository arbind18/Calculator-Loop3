import os

file_path = r"c:\Users\dell\Desktop\calculatorloop.com\Health\Nutrition-and-Calories\Meal-Prep-Cost-Optimizer.html"

correct_script = """
    <script>
        function calculateSavings() {
            const groceryBudget = parseFloat(document.getElementById('groceryBudget').value);
            const mealsPrepped = parseFloat(document.getElementById('mealsPrepped').value);
            const eatingOutCost = parseFloat(document.getElementById('eatingOutCost').value);
            const mealsReplaced = parseFloat(document.getElementById('mealsReplaced').value);

            if (!groceryBudget || !mealsPrepped || !eatingOutCost || !mealsReplaced) {
                alert('Please fill in all fields with valid numbers');
                return;
            }

            // Calculations
            const costPerHomeMeal = groceryBudget / mealsPrepped;
            const costOfEatingOutWeekly = eatingOutCost * mealsReplaced;
            const costOfHomeMealsWeekly = costPerHomeMeal * mealsReplaced;
            
            const weeklySavings = costOfEatingOutWeekly - costOfHomeMealsWeekly;
            const annualSavings = weeklySavings * 52;

            // Display Results
            document.getElementById('annualSavings').textContent = '$' + annualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('costPerHomeMeal').textContent = '$' + costPerHomeMeal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            document.getElementById('weeklySavings').textContent = '$' + weeklySavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

            document.querySelector('.result').style.display = 'block';
            
            // Update Chart
            updateChart(costOfEatingOutWeekly, costOfHomeMealsWeekly);
            showActionButtons();
        }

        let savingsChart = null;

        function updateChart(eatingOut, homeCooking) {
            const ctx = document.getElementById('savingsChart').getContext('2d');
            
            if (savingsChart) {
                savingsChart.destroy();
            }

            savingsChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Weekly Cost'],
                    datasets: [
                        {
                            label: 'Eating Out',
                            data: [eatingOut],
                            backgroundColor: '#ff6b6b',
                            borderRadius: 8
                        },
                        {
                            label: 'Home Cooking',
                            data: [homeCooking],
                            backgroundColor: '#667eea',
                            borderRadius: 8
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    </script>
"""

rich_content = """
    <!-- Rich Content Section -->
    <div class="container" style="margin-top: 30px;">
        <article>
            <h2 style="color: #667eea; margin-bottom: 20px;">Maximize Your Savings with Meal Prepping</h2>
            
            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Why Meal Prep?</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Meal prepping is not just a health trend; it's a powerful financial strategy. By planning and preparing your meals in advance, you can significantly reduce your food expenses, minimize food waste, and avoid the high markup of restaurant meals and takeout.
                </p>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    The average commercial meal costs 3-5 times more than a home-cooked equivalent. Our calculator helps you visualize these savings over time, showing you exactly how much that daily lunch habit is costing you annually.
                </p>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Financial Benefits of Cooking at Home</h3>
                <ul style="line-height: 2; color: #555; margin-left: 20px;">
                    <li><strong>Bulk Buying:</strong> Purchasing ingredients in larger quantities often lowers the unit price.</li>
                    <li><strong>Portion Control:</strong> You decide the size, reducing waste and cost per serving.</li>
                    <li><strong>Less Impulse Buying:</strong> Shopping with a list for specific recipes prevents unnecessary purchases.</li>
                    <li><strong>Healthier Wallet & Body:</strong> Home meals are generally lower in calories, sodium, and unhealthy fats, potentially saving on future healthcare costs.</li>
                </ul>
            </section>

            <section style="margin-bottom: 30px;">
                <h3 style="color: #333; margin-bottom: 15px;">Tips for Cost-Effective Meal Prepping</h3>
                <p style="line-height: 1.8; color: #555; margin-bottom: 15px;">
                    Start small by prepping just a few meals a week. Focus on versatile ingredients like rice, beans, and seasonal vegetables. Invest in good quality, reusable containers to keep food fresh. Use your freezer to store portions for later, ensuring nothing goes to waste.
                </p>
            </section>
        </article>
    </div>

    <!-- FAQ Section -->
    <div class="container" style="margin-top: 30px;">
        <h2 style="color: #667eea; margin-bottom: 25px; text-align: center;">Meal Prep & Savings: FAQ</h2>
        
        <div class="faq-item"><div class="faq-question">
            <h3>1. How much can I really save by meal prepping?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>
                Savings vary, but many people save between $1,500 and $3,000 annually by replacing daily takeout lunches with home-cooked meals.
            </p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>2. Do I need expensive containers?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>
                No. You can start with basic plastic containers or reuse glass jars. The key is that they are airtight to maintain freshness.
            </p></div></div>

        <div class="faq-item"><div class="faq-question">
            <h3>3. Is meal prepping time-consuming?</h3><i class="fas fa-chevron-down faq-icon"></i></div><div class="faq-answer">
            <p>
                It requires an upfront time investment (usually 2-3 hours on a weekend), but it saves time during the week by eliminating daily cooking and cleaning.
            </p></div></div>
    </div>

    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How much can I really save by meal prepping?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Savings vary, but many people save between $1,500 and $3,000 annually by replacing daily takeout lunches with home-cooked meals."
                }
            },
            {
                "@type": "Question",
                "name": "Is meal prepping time-consuming?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It requires an upfront time investment (usually 2-3 hours on a weekend), but it saves time during the week by eliminating daily cooking and cleaning."
                }
            }
        ]
    }
    </script>

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Meal Prep Cost Optimizer",
        "description": "Calculate your potential savings from cooking at home vs eating out. Optimize your grocery budget and see your annual savings.",
        "url": "https://calculatorloop.com/Health/Nutrition-and-Calories/Meal-Prep-Cost-Optimizer.html",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        }
    }
    </script>
"""

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the start of the incorrect script
    start_marker = '<script>\n        function calculateDiabetesRisk() {'
    # Find the end marker (start of chat widget)
    end_marker = '<!-- Floating Chat Widget -->'

    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)

    if start_idx != -1 and end_idx != -1:
        new_content = content[:start_idx] + correct_script + rich_content + "\n\n" + content[end_idx:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Successfully fixed {os.path.basename(file_path)}")
    else:
        print(f"Could not find markers in {os.path.basename(file_path)}")

except Exception as e:
    print(f"Error processing {file_path}: {str(e)}")
