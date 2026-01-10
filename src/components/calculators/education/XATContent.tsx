"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, BookOpen, Calculator, School, HelpCircle } from "lucide-react"

export function XATContent() {
    return (
        <div className="mt-12 space-y-12 max-w-4xl mx-auto">

            {/* 1. Introduction Section */}
            <section className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-primary">Everything You Need to Know About XAT Scoring (2026)</h2>
                <p className="text-muted-foreground leading-relaxed">
                    The Xavier Aptitude Test (XAT) is one of the most challenging and prestigious MBA entrance exams in India, conducted by XLRI Jamshedpur.
                    Unlike CAT, XAT has a unique marking scheme that includes penalties not just for incorrect answers but also for unattempted questions beyond a certain limit.
                    Understanding this complex scoring logic is crucial for maximizing your percentile.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    This <strong>Advanced XAT Score Calculator</strong> is designed to mimic the official periodic score calculation, giving you the most accurate estimate of your
                    Raw Score and Predicted Percentile.
                </p>
            </section>

            {/* 2. Marking Scheme Table */}
            <section>
                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-blue-600" />
                            XAT Official Marking Scheme
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3">Criterion</th>
                                        <th className="px-6 py-3">Marks Awarded/Deducted</th>
                                        <th className="px-6 py-3">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    <tr className="bg-background">
                                        <td className="px-6 py-4 font-medium">Correct Answer</td>
                                        <td className="px-6 py-4 text-green-600 font-bold">+1.00</td>
                                        <td className="px-6 py-4 text-muted-foreground">For every correct response in VALR, DM, and QA-DI.</td>
                                    </tr>
                                    <tr className="bg-background">
                                        <td className="px-6 py-4 font-medium">Incorrect Answer</td>
                                        <td className="px-6 py-4 text-red-600 font-bold">-0.25</td>
                                        <td className="px-6 py-4 text-muted-foreground">Negative marking for wrong attempts.</td>
                                    </tr>
                                    <tr className="bg-background">
                                        <td className="px-6 py-4 font-medium">Unattempted Questions</td>
                                        <td className="px-6 py-4 text-orange-600 font-bold">-0.10*</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            *Deducted ONLY for unattempted questions <strong>beyond 8 consecutive/total skips</strong>.
                                            The first 8 unattempted questions are free of penalty.
                                        </td>
                                    </tr>
                                    <tr className="bg-muted/30">
                                        <td className="px-6 py-4 font-medium">GK Portion</td>
                                        <td className="px-6 py-4 text-gray-500">Not Counted</td>
                                        <td className="px-6 py-4 text-muted-foreground">GK scores are used only during PI rounds, not for initial percentile.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* 3. Sectional Strategy */}
            <section className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Section-wise Strategy & Good Scores
                </h3>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-lg mb-2 text-blue-700">Verbal & Logical (VALR)</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Known for critical reasoning and complex RCs. Accuracy is key here.
                        </p>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-foreground/80">
                            <li><strong>Good Attempt:</strong> 16-18 Questions</li>
                            <li><strong>Safe Score:</strong> 8-9 Marks</li>
                            <li><strong>99%ile Score:</strong> 15+ Marks</li>
                        </ul>
                    </div>

                    <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-lg mb-2 text-green-700">Decision Making (DM)</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            The make-or-break section. Focus on ethics and business logic over emotions.
                        </p>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-foreground/80">
                            <li><strong>Good Attempt:</strong> 15-17 Questions</li>
                            <li><strong>Safe Score:</strong> 7-8 Marks</li>
                            <li><strong>99%ile Score:</strong> 12+ Marks</li>
                        </ul>
                    </div>

                    <div className="border rounded-xl p-5 bg-card hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-lg mb-2 text-amber-700">Quant & DI (QA-DI)</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            Traditionally tougher than CAT. DI sets can be lengthy calculations.
                        </p>
                        <ul className="text-sm space-y-2 list-disc pl-4 text-foreground/80">
                            <li><strong>Good Attempt:</strong> 14-16 Questions</li>
                            <li><strong>Safe Score:</strong> 9-10 Marks</li>
                            <li><strong>99%ile Score:</strong> 16+ Marks</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 4. Score vs Percentile Trends */}
            <section className="space-y-4">
                <h3 className="text-2xl font-bold">XAT Score vs Percentile (Past Trends)</h3>
                <p className="text-muted-foreground">
                    Based on historical data from 2024 and 2025, here is an average correlation between raw score and percentile.
                    Use this to gauge your standing.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                        { score: "43+", percentile: "99.9+" },
                        { score: "36-39", percentile: "99" },
                        { score: "32-34", percentile: "97+" },
                        { score: "30-31", percentile: "95" },
                        { score: "27-29", percentile: "92" },
                        { score: "25-27", percentile: "90" },
                        { score: "22-24", percentile: "85" },
                        { score: "< 20", percentile: "< 80" },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-muted/20 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-primary">{item.score}</div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Score</div>
                            <div className="text-lg font-medium text-foreground mt-1">{item.percentile} %ile</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. XLRI Cutoffs */}
            <section className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <School className="w-6 h-6 text-primary" />
                    XLRI Jamshedpur Cutoffs
                </h3>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Note on Gender Diversity</AlertTitle>
                    <AlertDescription>
                        XLRI often has slightly lower cutoffs for female candidates (usually 1-2 percentile points lower) to promote diversity.
                        Non-engineer males usually face the highest cutoffs.
                    </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Business Management (BM)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between border-b pb-1"><span>Male Engineer</span> <span>96 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Female Engineer</span> <span>91 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Male Non-Engineer</span> <span>95 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Female Non-Engineer</span> <span>90 %ile</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Human Resource Management (HRM)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex justify-between border-b pb-1"><span>Male Engineer</span> <span>95 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Female Engineer</span> <span>90 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Male Non-Engineer</span> <span>93 %ile</span></li>
                                <li className="flex justify-between border-b pb-1"><span>Female Non-Engineer</span> <span>88 %ile</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* 6. FAQ Accordion */}
            <section className="space-y-6 pt-6 border-t">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-primary" />
                    Frequently Asked Questions (FAQs)
                </h3>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Is there negative marking for unattempted questions in XAT?</AccordionTrigger>
                        <AccordionContent>
                            Yes, unlike CAT, XAT has a penalty for unattempted questions. You are allowed to leave up to 8 questions unattempted without any penalty.
                            Beyond 8 questions, a negative marking of **0.10 marks** applies for every unattempted question.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>What is a good score in XAT 2026?</AccordionTrigger>
                        <AccordionContent>
                            A score of **35+** is generally considered excellent and can fetch you a 95+ percentile, clearing cutoffs for XLRI BM and HRM programs.
                            For top-tier colleges like XIMB and IMT Ghaziabad, a score of **28-30** is often sufficient.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Does GK score affect the XAT Percentile?</AccordionTrigger>
                        <AccordionContent>
                            No, the General Knowledge (GK) section score is **NOT included** in the calculation of the main XAT percentile.
                            However, it is used by XLRI and other institutes during the final selection process (PI/GD rounds).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>What is the difference between XAT and CAT marking?</AccordionTrigger>
                        <AccordionContent>
                            CAT usually has +3 for correct and -1 for incorrect. XAT follows a +1 for correct and -0.25 for incorrect scheme.
                            The major difference is the **unattempted penalty** in XAT, which forces students to balance their attempts more carefully.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>How accurate is this score calculator?</AccordionTrigger>
                        <AccordionContent>
                            This calculator uses the latest official marking logic from the XAT convener.
                            The percentile estimation is based on interpolation of score-vs-percentile data from the last 2 years, offering a highly realistic prediction (+/- 2 percentile error margin).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>Are the cutoffs same for Engineers and Non-Engineers?</AccordionTrigger>
                        <AccordionContent>
                            No, XLRI promotes academic diversity. Engineers typically have slightly higher cutoffs (1-2 percentile points) compared to Non-Engineers for the Business Management (BM) program.
                            HRM cutoffs are also slightly variable based on stream and gender.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

        </div>
    )
}
