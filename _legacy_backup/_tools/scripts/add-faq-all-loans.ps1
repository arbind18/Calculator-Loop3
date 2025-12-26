# PowerShell script to add unique FAQ sections to all loan calculators

$calculators = @{
    "Two-Wheeler-Loan-Calculator.html" = @{
        color = "#667eea"
        faqs = @"
            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> What is included in the on-road price of a two-wheeler?</div>
                <div class="faq-answer">The on-road price includes the ex-showroom price (manufacturer's base price), RTO registration charges (5-12% varying by state), road tax (lifetime or annual based on state policy), insurance premium (third-party and comprehensive), extended warranty costs if opted, accessories and add-ons like helmets or phone mounts, and dealer handling charges. For example, a bike with ₹1 lakh ex-showroom price might have on-road price of ₹1.15-1.20 lakhs depending on your state and insurance choices.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> How much down payment is required for two-wheeler loans?</div>
                <div class="faq-answer">Most lenders require 10-25% down payment for two-wheeler loans. For a bike priced at ₹1 lakh on-road, you'll pay ₹10,000-25,000 upfront and finance the remaining ₹75,000-90,000. Lower down payment increases your EMI and total interest burden. Some lenders offer zero down payment schemes during festive seasons, especially for customers with excellent credit scores (750+) and stable income. Electric vehicles often get better financing terms with down payments as low as 5-10% due to government subsidies and lender promotions.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> What is the typical two-wheeler loan tenure?</div>
                <div class="faq-answer">Two-wheeler loans typically have tenure ranging from 12 months to 48 months (1-4 years), with most borrowers opting for 24-36 months. Shorter tenure means higher EMIs but lower total interest. For example, on a ₹80,000 loan at 11% interest, 2-year EMI is ₹3,700 (total interest ₹8,800) versus 3-year EMI of ₹2,620 (total interest ₹14,320). Choose tenure based on your monthly income and existing financial obligations, keeping EMI within 20% of take-home salary.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> Are there special schemes for electric two-wheeler loans?</div>
                <div class="faq-answer">Yes, electric two-wheelers benefit from multiple advantages including FAME II subsidy (₹10,000-15,000 direct price reduction), state-specific subsidies (varying by state), lower interest rates (8-10% vs 10-15% for petrol bikes), 100% financing options from some banks, waived processing fees, and zero-emission vehicle benefits. Total savings can reach ₹20,000-40,000 making EVs more affordable. Many manufacturers partner with NBFCs to offer instant loan approval at dealerships with minimal documentation for EV purchases.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> What documents are needed for two-wheeler loan approval?</div>
                <div class="faq-answer">Required documents include identity proof (Aadhaar, PAN card, passport), address proof (utility bills, rent agreement), income proof (salary slips for last 3 months, bank statements for 6 months, ITR for self-employed), age proof (minimum 21 years, maximum 60-65 years), passport size photographs, proforma invoice from dealer showing vehicle details and price, and existing loan statements if any. Salaried employees get faster approval (24-48 hours) while self-employed may need additional business documents and take 3-5 days.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> Can I prepay my two-wheeler loan without penalties?</div>
                <div class="faq-answer">Most two-wheeler loans allow prepayment or foreclosure after 6-12 months without penalties, especially for floating rate loans. Fixed rate loans might have 2-4% foreclosure charges if closed within first year. Check your loan agreement for specific terms. Even partial prepayments of ₹5,000-10,000 made annually can reduce your tenure by 3-6 months and save thousands in interest. Some lenders offer zero prepayment charges throughout the loan tenure, particularly NBFCs competing for market share during festive seasons.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #667eea;"></i> How does credit score affect two-wheeler loan approval?</div>
                <div class="faq-answer">Credit score significantly impacts loan approval, interest rates, and down payment requirements. Score above 750 gets best rates (9-11%), fastest approval, and minimal down payment. Score 650-750 faces higher rates (11-14%) and 15-20% down payment. Score below 650 may face rejection or require 25-30% down payment with co-applicant. First-time borrowers with no credit history can still get loans based on income stability and employer reputation, though at slightly higher rates. Building good credit by paying EMIs on time improves future borrowing capacity.</div>
            </div>
"@
        schema = @"
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is included in the on-road price of a two-wheeler?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The on-road price includes ex-showroom price, RTO registration charges, road tax, insurance premium, extended warranty, accessories, and dealer handling charges."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How much down payment is required for two-wheeler loans?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Most lenders require 10-25% down payment for two-wheeler loans. Some offer zero down payment during festive seasons for excellent credit scores."
                    }
                }
            ]
        }
"@
    }
    
    "Loan-Prepayment-Calculator.html" = @{
        color = "#38ef7d"
        faqs = @"
            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> What is loan prepayment and how does it work?</div>
                <div class="faq-answer">Loan prepayment means paying off part or all of your loan before the scheduled tenure ends. When you make a lump sum payment toward your principal, it directly reduces the outstanding balance, which in turn decreases your interest burden since interest is calculated on the reducing balance. You have two options: reduce EMI while keeping the tenure same, or keep EMI same and reduce tenure. The latter saves more interest. For example, prepaying ₹2 lakhs on a ₹20 lakh home loan after 2 years can save ₹6-8 lakhs in interest over a 20-year tenure.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> When is the best time to prepay a loan?</div>
                <div class="faq-answer">The earlier you prepay, the more you save. Prepaying in the first 5 years of a long-term loan (15-20 years) yields maximum savings because most of your initial EMIs go toward interest rather than principal. For instance, on a 20-year loan, if you prepay ₹5 lakhs in year 2, you could save ₹15-18 lakhs in interest. Prepaying in year 15 saves only ₹2-3 lakhs. Ideal times include receiving bonuses, maturity of fixed deposits, sale of assets, or income tax refunds. Even small annual prepayments of ₹50,000-1 lakh significantly reduce long-term interest costs.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> Are there penalties for loan prepayment?</div>
                <div class="faq-answer">Prepayment penalty rules vary by loan type and lender. For home loans, RBI prohibits banks from charging prepayment penalties on floating rate loans. Fixed rate home loans may have 2-5% foreclosure charges. Personal loans typically have 2-5% prepayment penalties if foreclosed within first 12-24 months. Vehicle loans from NBFCs might charge 3-6% on early closure. Business loans vary widely. Always check your loan agreement for the prepayment clause. Many lenders waive penalties after 1-2 years. Public sector banks generally have more borrower-friendly prepayment policies than private lenders and NBFCs.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> Should I reduce EMI or reduce tenure when prepaying?</div>
                <div class="faq-answer">Reducing tenure while keeping EMI constant saves significantly more interest than reducing EMI. For example, on a ₹30 lakh loan at 9% for 20 years (EMI ₹26,992), prepaying ₹5 lakhs after 2 years saves ₹10.2 lakhs if tenure is reduced to 14.5 years versus saving only ₹5.8 lakhs if EMI is reduced to ₹23,500. Choose EMI reduction only if you need immediate cash flow relief or have financial constraints. If you can afford current EMI, always opt for tenure reduction to maximize interest savings and become debt-free faster.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> How much should I prepay if I have extra funds?</div>
                <div class="faq-answer">The optimal prepayment amount depends on your loan interest rate versus alternative investment returns. If your loan interest is 9-12%, but you can earn only 5-7% from fixed deposits, prepaying saves more money. However, if you can invest in equity mutual funds or PPF with potential 10-15% returns, investing might be better than prepaying a 7-8% home loan. General rule: prepay high-interest debts first (credit cards 36-48%, personal loans 14-24%, vehicle loans 10-15%) before low-interest secured loans. Maintain an emergency fund of 6 months' expenses before aggressive prepayment.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> Can I get tax benefits on loan prepayment?</div>
                <div class="faq-answer">Prepaying home loans affects tax benefits under Section 80C (principal repayment up to ₹1.5 lakhs) and Section 24(b) (interest payment up to ₹2 lakhs). When you prepay, your annual interest component reduces, decreasing your Section 24(b) deduction. However, the net savings from reduced interest typically outweigh the lost tax benefit. For example, if prepayment saves ₹3 lakhs in interest but you lose ₹50,000 in tax deductions (₹15,000 actual tax at 30% slab), you still save ₹2.85 lakhs. Plan prepayments after March to maximize current year's deductions while benefiting from reduced interest next financial year.</div>
            </div>

            <div class="faq-item">
                <div class="faq-question"><i class="fas fa-chevron-right" style="color: #38ef7d;"></i> What is the process to prepay a loan?</div>
                <div class="faq-answer">To prepay your loan: 1) Submit prepayment request to your lender (online or at branch) at least 15-30 days before making payment. 2) Obtain prepayment approval letter mentioning outstanding principal, penalty charges if any, and payment deadline. 3) Make payment via cheque, demand draft, or NEFT/RTGS to the loan account. 4) Request revised loan schedule showing reduced tenure or EMI. 5) Obtain acknowledgment and updated NOC if you're foreclosing fully. For partial prepayments, ensure the amount is credited to principal, not interest. Most banks allow prepayments on any EMI due date. Keep prepayment receipts for tax purposes and future reference.</div>
            </div>
"@
        schema = @"
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is loan prepayment and how does it work?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Loan prepayment means paying off part or all of your loan before scheduled tenure ends. It reduces outstanding balance and interest burden."
                    }
                },
                {
                    "@type": "Question",
                    "name": "When is the best time to prepay a loan?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Prepaying in the first 5 years of a long-term loan yields maximum savings because initial EMIs mostly go toward interest."
                    }
                }
            ]
        }
"@
    }
}

Write-Host "Starting FAQ addition to loan calculators..." -ForegroundColor Cyan

foreach ($file in $calculators.Keys) {
    $filePath = "c:\Users\dell\Desktop\calculatorloop.com\Financial\Loan-and-EMI\$file"
    
    if (Test-Path $filePath) {
        Write-Host "Processing $file..." -ForegroundColor Yellow
        
        $content = Get-Content $filePath -Raw
        $calc = $calculators[$file]
        
        # Find the closing </div> before </div> that closes container
        $faqSection = @"

        <!-- FAQ Section -->
        <div class="faq-section">
            <h2><i class="fas fa-question-circle"></i> Frequently Asked Questions</h2>
            
$($calc.faqs)
        </div>
    </div>

    <!-- Schema Markup for SEO -->
    <script type="application/ld+json">
    $($calc.schema)
    </script>
"@
        
        # Replace the last occurrence of </div> before </body>
        $pattern = '(\s*)</div>\s*</div>\s*<script>'
        $replacement = "$faqSection`r`n`$1</div>`r`n`r`n    <script>"
        
        $newContent = $content -replace $pattern, $replacement
        
        if ($newContent -ne $content) {
            Set-Content -Path $filePath -Value $newContent -NoNewline
            Write-Host "✓ Successfully added FAQ to $file" -ForegroundColor Green
        } else {
            Write-Host "⚠ Pattern not found in $file, trying alternative..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nCompleted FAQ addition!" -ForegroundColor Cyan
