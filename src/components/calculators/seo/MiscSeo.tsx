import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const TipSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Tipping Etiquette Guide</h2>
    <p>
      Tipping is a way to show appreciation for good service. While customs vary by country, 
      knowing how much to tip can save you from awkward situations.
    </p>
    <h3>General Guidelines (India/Global)</h3>
    <ul>
      <li><strong>Restaurants:</strong> 10-15% of the bill amount is standard if service charge isn't included.</li>
      <li><strong>Food Delivery:</strong> ₹30-₹50 or 10% of the order value.</li>
      <li><strong>Hotels:</strong> ₹50-₹100 for bellboys or housekeeping staff.</li>
    </ul>
    <p>
      This calculator helps you quickly split the bill and the tip among friends, ensuring everyone pays their fair share.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How much should I tip in India?"
          answer="Restaurants: 10% (good service), 15% (excellent). Food delivery: ₹30-₹50. Hotels: Bellboy ₹50-₹100, Housekeeping ₹50/day. Salons: 10%. Taxis: Not mandatory, round up fare. Always check if service charge already added to bill."
        />
        <FaqItem 
          question="Is tipping mandatory in India?"
          answer="No, tipping is optional in India unlike some countries. However, it's appreciated for good service. Many restaurants add 5-10% service charge automatically - check bill before tipping extra. Tip in cash directly to server when possible."
        />
        <FaqItem 
          question="How do I split a bill with tip?"
          answer="Method: (1) Calculate tip % on total bill, (2) Add to bill, (3) Divide by number of people. Example: ₹1,000 bill + 10% tip = ₹1,100 / 4 people = ₹275 each. Our calculator does this automatically!"
        />
      </div>
    </section>
  </div>
)

export const AgeSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Calculate Your Exact Age</h2>
    <p>
      Ever wondered exactly how many days you've been alive? Or need to know your precise age for a form application?
      This calculator gives you your age down to the day.
    </p>
    <h3>Fun Facts About Age</h3>
    <ul>
      <li>Your age on other planets is different! A year on Mars is 687 Earth days.</li>
      <li>The concept of age reckoning varies. In some East Asian cultures, you are considered 1 year old at birth.</li>
    </ul>
    <p>
      Use this tool to calculate age differences between people or to find out the day of the week you were born.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How is age calculated exactly?"
          answer="Age = Current Date - Birth Date. Completed years + months + days. Example: Born Jan 15, 2000, today Jan 2, 2026 = 26 years, 11 months, 18 days. Calculator accounts for leap years."
        />
        <FaqItem 
          question="How many days have I been alive?"
          answer="Multiply years by 365.25 (accounts for leap years) + remaining days. Example: 25 years old = ~9,131 days. Use our calculator for exact count. Fun fact: 10,000 days alive = ~27.4 years old!"
        />
        <FaqItem 
          question="What was the day of the week when I was born?"
          answer="Our calculator shows this! Interesting patterns: Most babies born on weekdays (induced labor/C-sections scheduled). Least babies on weekends/holidays. Knowing your birth day is great for trivia!"
        />
      </div>
    </section>
  </div>
)

export const DatePlusDurationSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Add or Subtract Time from a Date</h2>
    <p>
      Need to know what date it will be in 45 days? Or what the date was 3 weeks ago?
      This calculator allows you to add or subtract years, months, days, hours, and minutes from any starting date.
    </p>
    <h3>Why Use This Tool?</h3>
    <ul>
      <li><strong>Deadline Calculation:</strong> Find the exact submission date for a project given a duration.</li>
      <li><strong>Warranty Expiry:</strong> Calculate when a product warranty ends.</li>
      <li><strong>Legal & Visa:</strong> Determine visa expiry dates or legal notice periods.</li>
    </ul>
    <p>
      Simply enter a start date and the duration you want to add. You can also use negative numbers to subtract time.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I add days to a date?"
          answer="Start Date + Number of Days = End Date. Example: Jan 1, 2026 + 90 days = April 1, 2026. Calculator handles month-end variations (28, 30, 31 days) and leap years automatically. Use negative numbers to subtract."
        />
        <FaqItem 
          question="What is 90 days from today's date?"
          answer="Use our calculator with today's date + 90 days. Common uses: Credit card payment deadlines (30-45 days), Notice periods (30-90 days), Visa validity (180 days), Trial periods (7-30 days). Bookmark for quick access!"
        />
        <FaqItem 
          question="How do I calculate business days vs calendar days?"
          answer="Business days exclude weekends (5 days/week). 30 calendar days ≈ 21-22 business days. For accurate business day calculations, manually exclude Saturdays, Sundays, and public holidays. Our tool uses calendar days - adjust accordingly."
        />
      </div>
    </section>
  </div>
)

export const DateDifferenceSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Time Between Dates</h2>
    <p>
      Calculating the duration between two dates can be tricky with leap years and varying month lengths.
      This tool handles all that complexity for you.
    </p>
    <h3>Common Uses</h3>
    <ul>
      <li><strong>Project Planning:</strong> Calculate the number of working days or weeks until a deadline.</li>
      <li><strong>Event Countdown:</strong> See how many days are left until a wedding, vacation, or birthday.</li>
      <li><strong>Tenure Calculation:</strong> Determine exactly how long you've worked at a company.</li>
    </ul>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How many days between two dates?"
          answer="End Date - Start Date = Days. Example: Jan 1 to March 1 = 59 days (non-leap) or 60 days (leap year). Our calculator shows exact days, weeks, months, years. Useful for project timelines, age calculations, event countdowns."
        />
        <FaqItem 
          question="How many working days between dates?"
          answer="Approximate: Total days × 5/7 = working days (excludes weekends). Example: 70 calendar days ≈ 50 working days. For exact count: Subtract Saturdays, Sundays, public holidays manually. India has 10-15 public holidays/year."
        />
        <FaqItem 
          question="What is the date difference for visa/notice period?"
          answer="Visa: Count from entry date to expiry (usually 180 days tourist visa). Notice period: From resignation date to last working day (typically 30-90 days). Always count calendar days unless contract specifies business days."
        />
      </div>
    </section>
  </div>
)

export const PercentageSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Understanding Percentages</h2>
    <p>
      "Percent" means "per 100". It is a way of expressing a number as a fraction of 100.
      Percentages are used everywhere, from shopping discounts to tax calculations.
    </p>
    <h3>Real World Examples</h3>
    <ul>
      <li><strong>Discounts:</strong> A 20% sale on a ₹1000 item means you save ₹200.</li>
      <li><strong>Taxes:</strong> GST of 18% on a ₹100 service adds ₹18 to the bill.</li>
      <li><strong>Growth:</strong> If your salary increases from 50k to 55k, that's a 10% hike.</li>
    </ul>
    <p>
      This calculator helps you find the percentage value and the final total after adding the percentage.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate percentage?"
          answer="Percentage = (Part / Whole) × 100. Example: You scored 45 out of 60. Percentage = (45/60) × 100 = 75%. To find X% of Y: (X/100) × Y. Example: 20% of 500 = (20/100) × 500 = 100."
        />
        <FaqItem 
          question="What is the percentage increase formula?"
          answer="% Increase = [(New - Old) / Old] × 100. Example: Salary increased from ₹50,000 to ₹55,000. Increase = [(55,000-50,000)/50,000] × 100 = 10%. For decrease, use same formula (result will be negative)."
        />
        <FaqItem 
          question="How to calculate discount percentage?"
          answer="Discount % = [(Original Price - Sale Price) / Original Price] × 100. Example: ₹2,000 item on sale for ₹1,600. Discount = [(2,000-1,600)/2,000] × 100 = 20% off. Reverse: Sale Price = Original × (1 - Discount%/100)."
        />
      </div>
    </section>
  </div>
)

export const FuelCostSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Plan Your Trip Budget</h2>
    <p>
      Fuel costs can be a major part of any road trip budget. Knowing your car's mileage and the current fuel price
      allows you to estimate the cost of your journey accurately.
    </p>
    <h3>How to Improve Mileage</h3>
    <ul>
      <li>Maintain steady speed and avoid sudden braking.</li>
      <li>Keep tires properly inflated.</li>
      <li>Reduce excess weight in the car.</li>
      <li>Service your vehicle regularly.</li>
    </ul>
    <p>
      Use this calculator to split fuel costs with friends or to track your monthly commuting expenses.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate fuel cost for a trip?"
          answer="Formula: (Distance / Mileage) × Fuel Price = Cost. Example: 600km trip, car gives 15 km/L, petrol ₹100/L. Cost = (600/15) × 100 = ₹4,000. Add 10-15% buffer for AC, traffic, terrain variations."
        />
        <FaqItem 
          question="What is good mileage for a car in India?"
          answer="Petrol cars: 15-20 km/L (city), 18-25 km/L (highway). Diesel: 18-25 km/L (city), 20-28 km/L (highway). SUVs: 12-16 km/L. Electric: 4-6 km/kWh. Mileage decreases with AC, traffic, aggressive driving."
        />
        <FaqItem 
          question="How to improve car fuel efficiency?"
          answer="10 tips: (1) Maintain 60-80 km/h on highway, (2) Proper tire pressure (check monthly), (3) Regular servicing, (4) Remove excess weight, (5) Use AC judiciously, (6) Smooth acceleration, (7) Plan routes, (8) Avoid idling >30 sec, (9) Use correct gear, (10) Quality fuel."
        />
      </div>
    </section>
  </div>
)

export const BMISeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Body Mass Index (BMI) Explained</h2>
    <p>
      BMI is a screening tool used to identify potential weight problems in adults. 
      It is calculated by dividing a person's weight in kilograms by the square of their height in meters.
    </p>
    <h3>BMI Categories (WHO)</h3>
    <ul>
      <li><strong>Underweight:</strong> Less than 18.5</li>
      <li><strong>Normal weight:</strong> 18.5 – 24.9</li>
      <li><strong>Overweight:</strong> 25 – 29.9</li>
      <li><strong>Obesity:</strong> 30 or greater</li>
    </ul>
    <p>
      <strong>Note:</strong> BMI does not distinguish between weight from muscle and weight from fat. 
      Athletes may have a high BMI but low body fat. Always consult a doctor for a full health assessment.
    </p>
  </div>
)
