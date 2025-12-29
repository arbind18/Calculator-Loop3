"use client"

import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"

import React, { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Zap, TrendingUp, Calculator, Award, Target, Copy, Check, Lightbulb, RefreshCw, Sparkles, BarChart3, Brain, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

interface EducationInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'slider';
  options?: string[];
  defaultValue?: number | string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

interface CalculationResult {
  result: string | number;
  explanation?: string;
  steps?: string[];
  tips?: string[];
  formula?: string;
  visualData?: Array<{ label: string; value: number }>;
  insights?: string[];
  recommendations?: string[];
}

interface EducationToolConfig {
  title: string;
  description: string;
  inputs: EducationInput[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
  presetScenarios?: Array<{ name: string; icon?: string; values: Record<string, any> }>;
}

const safeFloat = (val: any) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const safeInt = (val: any) => {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
};

const getToolConfig = (id: string | undefined): EducationToolConfig => {
  if (!id) return {
    title: 'Calculator Not Found',
    description: 'This calculator configuration is missing.',
    inputs: [],
    calculate: () => ({ result: 'Error' })
  };
  
  // GPA CALCULATOR
  if (id === 'gpa-calculator') {
    return {
      title: 'GPA Calculator',
      description: 'Calculate your Grade Point Average with detailed analysis',
      presetScenarios: [
        { name: 'Excellent', icon: '🌟', values: { credits: '4,3,3,2', grades: '4.0,4.0,3.7,4.0' } },
        { name: 'Good', icon: '👍', values: { credits: '4,3,3,2', grades: '3.5,3.3,3.7,3.0' } },
        { name: 'Average', icon: '📚', values: { credits: '4,3,3,2', grades: '3.0,2.7,3.0,2.5' } },
      ],
      inputs: [
        { name: 'credits', label: 'Credit Hours (comma-separated)', type: 'text', defaultValue: '3,4,3,2,4', placeholder: 'e.g., 3,4,3,2', helpText: 'Enter credit hours for each course' },
        { name: 'grades', label: 'Grade Points (comma-separated)', type: 'text', defaultValue: '4.0,3.7,3.3,4.0,3.0', placeholder: 'e.g., 4.0,3.7,3.3', helpText: 'Enter grade points (0-4 scale)' },
      ],
      calculate: (inputs) => {
        const credits = (inputs.credits || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
        const grades = (inputs.grades || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
        
        if (credits.length === 0 || grades.length === 0 || credits.length !== grades.length) {
          return { result: 'Error', explanation: 'Please enter equal number of credits and grades' };
        }

        let totalPoints = 0;
        let totalCredits = 0;
        const courseData: Array<{ label: string; value: number }> = [];

        for (let i = 0; i < credits.length; i++) {
          totalPoints += credits[i] * grades[i];
          totalCredits += credits[i];
          courseData.push({ label: `Course ${i + 1}`, value: grades[i] });
        }

        const gpa = totalPoints / totalCredits;
        
        const tips: string[] = [];
        if (gpa >= 3.8) tips.push('🌟 Outstanding! You\'re in the top tier. Keep it up!');
        else if (gpa >= 3.5) tips.push('💎 Excellent performance! You\'re doing great!');
        else if (gpa >= 3.0) tips.push('✅ Good job! Room for improvement in some courses.');
        else if (gpa >= 2.5) tips.push('📈 Focus on improving weak subjects.');
        else tips.push('🎯 Need immediate attention. Consider tutoring or study groups.');

        tips.push(`📊 You need ${(totalCredits * 4 - totalPoints).toFixed(1)} more grade points to reach 4.0 GPA`);
        tips.push(`💡 Each 0.1 GPA increase requires ~${((totalCredits * 0.1) / 3).toFixed(1)} credit hours at 4.0`);

        const recommendations: string[] = [];
        if (gpa < 3.0) {
          recommendations.push('Focus on high-credit courses to maximize GPA impact');
          recommendations.push('Attend office hours and form study groups');
          recommendations.push('Use academic resources like tutoring centers');
        }
        if (gpa >= 3.5) {
          recommendations.push('Consider taking challenging courses to stand out');
          recommendations.push('Maintain consistency across all subjects');
        }

        return {
          result: gpa.toFixed(3),
          explanation: `Based on ${credits.length} courses with ${totalCredits} total credits`,
          steps: [
            `Total Credit Hours: ${totalCredits}`,
            `Total Grade Points: ${totalPoints.toFixed(2)}`,
            `GPA = Total Grade Points ÷ Total Credits`,
            `GPA = ${totalPoints.toFixed(2)} ÷ ${totalCredits} = ${gpa.toFixed(3)}`
          ],
          tips,
          recommendations,
          formula: 'GPA = Σ(Credit Hours × Grade Points) ÷ Σ(Credit Hours)',
          visualData: courseData
        };
      }
    };
  }

  // ATTENDANCE CALCULATOR
  if (id === 'attendance-calculator') {
    return {
      title: 'Attendance Calculator',
      description: 'Calculate attendance percentage and plan your leaves smartly',
      presetScenarios: [
        { name: 'Safe Zone', icon: '✅', values: { attended: 90, total: 100, required: 75 } },
        { name: 'Warning', icon: '⚠️', values: { attended: 76, total: 100, required: 75 } },
        { name: 'Danger', icon: '🚨', values: { attended: 70, total: 100, required: 75 } },
      ],
      inputs: [
        { name: 'attended', label: 'Classes Attended', type: 'slider', defaultValue: 85, min: 0, max: 200, step: 1, helpText: 'Total classes you attended' },
        { name: 'total', label: 'Total Classes', type: 'slider', defaultValue: 100, min: 1, max: 200, step: 1, helpText: 'Total classes conducted' },
        { name: 'required', label: 'Required Percentage', type: 'slider', defaultValue: 75, min: 50, max: 100, step: 1, helpText: 'Minimum required attendance %' },
      ],
      calculate: (inputs) => {
        const attended = safeFloat(inputs.attended);
        const total = safeFloat(inputs.total);
        const required = safeFloat(inputs.required);

        if (total === 0) return { result: 'Error', explanation: 'Total classes cannot be zero' };

        const current = (attended / total) * 100;
        const requiredClasses = Math.ceil((required * total - attended * 100) / (100 - required));
        const canBunk = Math.floor((attended - (required * total / 100)) / (required / 100));

        const tips: string[] = [];
        if (current >= required + 10) {
          tips.push(`😎 You can miss ${Math.max(0, canBunk)} more classes safely!`);
          tips.push('✅ You have a comfortable buffer. Stay consistent!');
        } else if (current >= required) {
          tips.push(`⚠️ You can only miss ${Math.max(0, canBunk)} classes. Be careful!`);
          tips.push('📌 Avoid consecutive absences to stay safe');
        } else {
          tips.push(`🚨 You need to attend ${Math.max(0, requiredClasses)} consecutive classes!`);
          tips.push('⏰ Set alarms and don\'t miss any more classes');
          tips.push('💡 Inform professors if you have genuine reasons');
        }

        const daysToRecover = Math.max(0, requiredClasses);
        tips.push(`📅 Recovery time: ~${daysToRecover} classes at 100% attendance`);

        const insights: string[] = [];
        insights.push(`Current status: ${current >= required ? 'SAFE ✅' : 'AT RISK 🚨'}`);
        insights.push(`Buffer: ${current >= required ? '+' : ''}${(current - required).toFixed(1)}%`);

        return {
          result: `${current.toFixed(2)}%`,
          explanation: `${attended} out of ${total} classes attended`,
          steps: [
            `Current Attendance = (Attended ÷ Total) × 100`,
            `Current = (${attended} ÷ ${total}) × 100 = ${current.toFixed(2)}%`,
            `Required = ${required}%`,
            current >= required 
              ? `Can bunk = ⌊(${attended} - ${required}% of ${total}) ÷ ${(required/100).toFixed(2)}⌋ = ${Math.max(0, canBunk)} classes`
              : `Need to attend = ⌈(${required}% × ${total} - ${attended} × 100) ÷ (100 - ${required})⌉ = ${Math.max(0, requiredClasses)} classes`
          ],
          tips,
          insights,
          formula: 'Attendance % = (Classes Attended ÷ Total Classes) × 100',
          visualData: [
            { label: 'Attended', value: attended },
            { label: 'Missed', value: total - attended },
            { label: 'Required (min)', value: (required / 100) * total },
          ]
        };
      }
    };
  }

  // STUDY TIME CALCULATOR
  if (id === 'study-time-calculator') {
    return {
      title: 'Study Time Optimizer',
      description: 'Plan optimal study schedule with Pomodoro technique',
      presetScenarios: [
        { name: 'Light', icon: '📖', values: { topics: 3, difficulty: 30, dailyHours: 4 } },
        { name: 'Medium', icon: '📚', values: { topics: 5, difficulty: 60, dailyHours: 6 } },
        { name: 'Intense', icon: '🔥', values: { topics: 8, difficulty: 90, dailyHours: 8 } },
      ],
      inputs: [
        { name: 'topics', label: 'Number of Topics', type: 'slider', defaultValue: 5, min: 1, max: 20, step: 1, helpText: 'Topics to cover' },
        { name: 'difficulty', label: 'Difficulty Level (%)', type: 'slider', defaultValue: 50, min: 10, max: 100, step: 10, helpText: '10=Easy, 100=Very Hard' },
        { name: 'dailyHours', label: 'Daily Study Hours', type: 'slider', defaultValue: 6, min: 1, max: 12, step: 0.5, helpText: 'Hours available per day' },
        { name: 'daysLeft', label: 'Days Until Exam', type: 'slider', defaultValue: 30, min: 1, max: 90, step: 1, helpText: 'Days remaining' },
      ],
      calculate: (inputs) => {
        const topics = safeInt(inputs.topics);
        const difficulty = safeFloat(inputs.difficulty);
        const dailyHours = safeFloat(inputs.dailyHours);
        const daysLeft = safeInt(inputs.daysLeft);

        const baseTimePerTopic = 2; // hours
        const timeMultiplier = 1 + (difficulty / 100);
        const totalTimeNeeded = topics * baseTimePerTopic * timeMultiplier;
        const totalTimeAvailable = dailyHours * daysLeft;
        
        // Pomodoro calculation (25 min work + 5 min break)
        const pomodorosPerDay = Math.floor((dailyHours * 60) / 30);
        const effectiveStudyHours = pomodorosPerDay * 0.42; // 25min per pomodoro in hours
        
        const hoursPerTopic = totalTimeNeeded / topics;
        const daysPerTopic = hoursPerTopic / dailyHours;

        const tips: string[] = [];
        if (totalTimeAvailable >= totalTimeNeeded * 1.5) {
          tips.push('😊 You have plenty of time! Stay consistent and don\'t procrastinate');
          tips.push('✅ Use extra time for practice and revision');
        } else if (totalTimeAvailable >= totalTimeNeeded) {
          tips.push('👍 Good planning! Stick to your schedule');
          tips.push('⚠️ No room for delays. Stay disciplined');
        } else {
          tips.push('🚨 Time is tight! Prioritize high-weightage topics');
          tips.push('⏰ Increase study hours or focus on important concepts only');
        }

        tips.push(`🍅 Use ${pomodorosPerDay} Pomodoro sessions daily (25min work + 5min break)`);
        tips.push(`🧠 Best study times: 6-8 AM (peak focus) and 4-6 PM (review time)`);
        tips.push(`💤 Don't sacrifice sleep. 7-8 hours is crucial for memory consolidation`);

        const recommendations: string[] = [];
        recommendations.push(`Study ${hoursPerTopic.toFixed(1)}h per topic over ${daysPerTopic.toFixed(1)} days`);
        recommendations.push('Take 5-min breaks every 25 minutes (Pomodoro)');
        recommendations.push('Take 15-min break after 2 hours of study');
        recommendations.push('Review yesterday\'s topics for 30 mins daily');

        return {
          result: `${totalTimeNeeded.toFixed(1)} hours needed`,
          explanation: `${topics} topics × ${hoursPerTopic.toFixed(1)}h each`,
          steps: [
            `Base time per topic: ${baseTimePerTopic}h`,
            `Difficulty multiplier: ${timeMultiplier.toFixed(2)}x`,
            `Time per topic: ${baseTimePerTopic} × ${timeMultiplier.toFixed(2)} = ${hoursPerTopic.toFixed(2)}h`,
            `Total time needed: ${topics} × ${hoursPerTopic.toFixed(2)} = ${totalTimeNeeded.toFixed(1)}h`,
            `Time available: ${daysLeft} days × ${dailyHours}h = ${totalTimeAvailable}h`,
            `Status: ${totalTimeAvailable >= totalTimeNeeded ? 'FEASIBLE ✅' : 'TIGHT 🚨'}`
          ],
          tips,
          recommendations,
          formula: 'Total Time = Topics × Base Time × (1 + Difficulty/100)',
          visualData: [
            { label: 'Time Needed', value: totalTimeNeeded },
            { label: 'Time Available', value: totalTimeAvailable },
            { label: 'Effective Study Time', value: effectiveStudyHours * daysLeft },
          ],
          insights: [
            `${pomodorosPerDay} Pomodoros per day`,
            `${(totalTimeNeeded / topics).toFixed(1)}h per topic`,
            `${totalTimeAvailable >= totalTimeNeeded ? 'On Track ✅' : 'Need More Time 🚨'}`
          ]
        };
      }
    };
  }

  // EXAM SCORE CALCULATOR
  if (id === 'exam-score-calculator') {
    return {
      title: 'Exam Score Calculator',
      description: 'Calculate required exam score to achieve target grade',
      presetScenarios: [
        { name: 'Target A', icon: '🎯', values: { currentGrade: 85, targetGrade: 90, examWeight: 40 } },
        { name: 'Pass', icon: '✅', values: { currentGrade: 55, targetGrade: 60, examWeight: 50 } },
        { name: 'Excel', icon: '💎', values: { currentGrade: 92, targetGrade: 95, examWeight: 30 } },
      ],
      inputs: [
        { name: 'currentGrade', label: 'Current Grade (%)', type: 'slider', defaultValue: 75, min: 0, max: 100, step: 1, helpText: 'Your grade before final exam' },
        { name: 'targetGrade', label: 'Target Grade (%)', type: 'slider', defaultValue: 85, min: 0, max: 100, step: 1, helpText: 'Desired final grade' },
        { name: 'examWeight', label: 'Final Exam Weight (%)', type: 'slider', defaultValue: 40, min: 10, max: 100, step: 5, helpText: 'Exam weightage in final grade' },
      ],
      calculate: (inputs) => {
        const current = safeFloat(inputs.currentGrade);
        const target = safeFloat(inputs.targetGrade);
        const weight = safeFloat(inputs.examWeight);

        const currentWeight = 100 - weight;
        const requiredScore = (target - (current * currentWeight / 100)) * (100 / weight);

        const tips: string[] = [];
        if (requiredScore > 100) {
          tips.push('🚨 Target is mathematically impossible with current grade!');
          tips.push(`💡 Maximum achievable: ${(current * currentWeight / 100 + 100 * weight / 100).toFixed(1)}%`);
          tips.push('📝 Focus on improving current assignments first');
        } else if (requiredScore >= 95) {
          tips.push('🔥 You need near-perfect score! Study intensively');
          tips.push('📚 Focus on past papers and practice tests');
        } else if (requiredScore >= 80) {
          tips.push('💪 Challenging but achievable with focused study');
          tips.push('✅ Review all topics thoroughly');
        } else if (requiredScore >= 60) {
          tips.push('👍 Very achievable! Stay consistent');
        } else {
          tips.push('😊 You have a comfortable buffer!');
          tips.push('✨ Use extra preparation time for excellence');
        }

        const maxPossible = current * currentWeight / 100 + 100 * weight / 100;
        const minPossible = current * currentWeight / 100;

        return {
          result: requiredScore > 100 ? 'Impossible' : `${requiredScore.toFixed(1)}%`,
          explanation: requiredScore > 100 ? `Need ${requiredScore.toFixed(1)}% (not possible)` : `Score needed on final exam`,
          steps: [
            `Current grade weight: ${currentWeight}%`,
            `Final exam weight: ${weight}%`,
            `Current contribution: ${current} × ${currentWeight}% = ${(current * currentWeight / 100).toFixed(2)}`,
            `Required from exam: ${target} - ${(current * currentWeight / 100).toFixed(2)} = ${(target - current * currentWeight / 100).toFixed(2)}`,
            `Exam score needed: ${(target - current * currentWeight / 100).toFixed(2)} ÷ ${weight}% = ${requiredScore.toFixed(2)}%`
          ],
          tips,
          formula: 'Required Score = (Target - Current × CurrentWeight%) ÷ ExamWeight%',
          visualData: [
            { label: 'Current Grade', value: current },
            { label: 'Target Grade', value: target },
            { label: 'Required Score', value: Math.min(requiredScore, 100) },
          ],
          insights: [
            `Maximum possible: ${maxPossible.toFixed(1)}%`,
            `Minimum possible: ${minPossible.toFixed(1)}%`,
            requiredScore <= 100 ? `Achievable ✅` : `Not Possible 🚨`
          ]
        };
      }
    };
  }

  // COLLEGE COST CALCULATOR
  if (id === 'college-cost-calculator') {
    return {
      title: 'College Cost Calculator',
      description: 'Calculate total college cost with inflation and plan savings',
      presetScenarios: [
        { name: 'Public', icon: '🏫', values: { tuition: 50000, years: 4, inflation: 7, living: 30000 } },
        { name: 'Private', icon: '🎓', values: { tuition: 200000, years: 4, inflation: 8, living: 50000 } },
        { name: 'Premium', icon: '💎', values: { tuition: 500000, years: 4, inflation: 10, living: 100000 } },
      ],
      inputs: [
        { name: 'tuition', label: 'Annual Tuition Fee (₹)', type: 'slider', defaultValue: 100000, min: 10000, max: 1000000, step: 10000, helpText: 'Yearly college fees' },
        { name: 'living', label: 'Annual Living Expenses (₹)', type: 'slider', defaultValue: 60000, min: 10000, max: 500000, step: 10000, helpText: 'Hostel, food, books etc.' },
        { name: 'years', label: 'Duration (Years)', type: 'slider', defaultValue: 4, min: 1, max: 6, step: 1, helpText: 'Course duration' },
        { name: 'inflation', label: 'Inflation Rate (%)', type: 'slider', defaultValue: 7, min: 3, max: 15, step: 0.5, helpText: 'Expected annual increase' },
        { name: 'yearsToStart', label: 'Years Until College', type: 'slider', defaultValue: 5, min: 0, max: 18, step: 1, helpText: 'When will you join?' },
      ],
      calculate: (inputs) => {
        const tuition = safeFloat(inputs.tuition);
        const living = safeFloat(inputs.living);
        const years = safeInt(inputs.years);
        const inflation = safeFloat(inputs.inflation) / 100;
        const yearsToStart = safeInt(inputs.yearsToStart);

        const annualCost = tuition + living;
        let totalCost = 0;
        const yearlyBreakdown: Array<{ label: string; value: number }> = [];

        for (let i = 0; i < years; i++) {
          const yearCost = annualCost * Math.pow(1 + inflation, yearsToStart + i);
          totalCost += yearCost;
          yearlyBreakdown.push({ label: `Year ${i + 1}`, value: yearCost });
        }

        const monthlySavings = totalCost / (yearsToStart * 12);
        const withReturn = monthlySavings * 1.08; // Assuming 8% return

        const tips: string[] = [];
        tips.push(`💰 Start saving ₹${monthlySavings.toFixed(0)} per month from now`);
        tips.push(`📈 With 8% returns, save ₹${withReturn.toFixed(0)}/month to reach goal`);
        tips.push(`🎯 Year 1 cost: ₹${yearlyBreakdown[0].value.toFixed(0)}`);
        tips.push(`🔥 Final year cost: ₹${yearlyBreakdown[years-1].value.toFixed(0)} (due to inflation)`);

        const recommendations: string[] = [];
        recommendations.push('Open a dedicated education savings account');
        recommendations.push('Consider SIP in index funds for better returns');
        recommendations.push('Research scholarships (can reduce cost by 25-100%)');
        recommendations.push('Look into education loans (covers 80-100% cost)');
        recommendations.push('Consider part-time work during college');

        return {
          result: `₹${(totalCost / 100000).toFixed(2)} Lakhs`,
          explanation: `Total cost for ${years} years including inflation`,
          steps: [
            `Annual cost today: ₹${annualCost.toLocaleString('en-IN')}`,
            `Inflation rate: ${(inflation * 100).toFixed(1)}% per year`,
            ...yearlyBreakdown.map((y, i) => `${y.label}: ₹${y.value.toLocaleString('en-IN')}`),
            `Total = ₹${totalCost.toLocaleString('en-IN')}`
          ],
          tips,
          recommendations,
          formula: 'Total Cost = Σ(Annual Cost × (1 + Inflation)^year)',
          visualData: yearlyBreakdown,
          insights: [
            `Monthly savings needed: ₹${monthlySavings.toFixed(0)}`,
            `Total inflation impact: +${((totalCost / (annualCost * years) - 1) * 100).toFixed(1)}%`,
            `Avg. cost per year: ₹${(totalCost / years).toFixed(0)}`
          ]
        };
      }
    };
  }

  // CGPA CALCULATOR
  if (id === 'cgpa-calculator') {
    return {
      title: 'CGPA Calculator',
      description: 'Calculate Cumulative Grade Point Average across semesters',
      presetScenarios: [
        { name: 'First Class', icon: '🎓', values: { sgpas: '8.5,8.7,8.9,9.0', credits: '20,22,20,24' } },
        { name: 'Second Class', icon: '📚', values: { sgpas: '7.0,7.2,6.8,7.5', credits: '20,22,20,24' } },
        { name: 'Pass Class', icon: '✅', values: { sgpas: '6.0,5.8,6.2,6.5', credits: '20,22,20,24' } },
      ],
      inputs: [
        { name: 'sgpas', label: 'Semester GPAs (comma-separated)', type: 'text', defaultValue: '8.5,8.7,8.9', placeholder: 'e.g., 8.5,8.7,8.9', helpText: 'Enter SGPA for each semester' },
        { name: 'credits', label: 'Credits per Semester (comma-separated)', type: 'text', defaultValue: '20,22,20', placeholder: 'e.g., 20,22,20', helpText: 'Total credits for each semester' },
      ],
      calculate: (inputs) => {
        const sgpas = (inputs.sgpas || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n) && n >= 0 && n <= 10);
        const credits = (inputs.credits || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n) && n > 0);
        
        if (sgpas.length === 0 || credits.length === 0 || sgpas.length !== credits.length) {
          return { result: 'Error', explanation: 'Enter equal number of SGPAs and credits' };
        }

        let totalPoints = 0;
        let totalCredits = 0;
        const semData: Array<{ label: string; value: number }> = [];

        for (let i = 0; i < sgpas.length; i++) {
          totalPoints += sgpas[i] * credits[i];
          totalCredits += credits[i];
          semData.push({ label: `Sem ${i + 1}`, value: sgpas[i] });
        }

        const cgpa = totalPoints / totalCredits;
        const percentage = (cgpa - 0.75) * 10;
        
        return {
          result: cgpa.toFixed(2),
          explanation: `Your CGPA is ${cgpa.toFixed(2)} across ${sgpas.length} semesters`,
          steps: [
            `Total semesters: ${sgpas.length}`,
            `Total credits: ${totalCredits}`,
            `Total grade points: ${totalPoints.toFixed(1)}`,
            `CGPA = ${totalPoints.toFixed(1)} ÷ ${totalCredits} = ${cgpa.toFixed(2)}`,
            `Approximate percentage: ${percentage.toFixed(1)}%`
          ],
          visualData: semData,
          tips: [
            cgpa >= 9.0 ? '🌟 Outstanding! You\'re eligible for top scholarships!' : 
            cgpa >= 8.0 ? '💎 Excellent performance! Keep pushing for 9.0+' :
            cgpa >= 7.0 ? '✅ Good job! Aim for 8.0+ to improve placement chances' :
            cgpa >= 6.0 ? '📈 Decent performance. Focus on core subjects' :
            '🎯 Need improvement. Consider academic counseling',
            `You need ${((9.0 * totalCredits - totalPoints) / 20).toFixed(1)} SGPA in next semester (20 credits) to reach 9.0 CGPA`,
            cgpa >= 8.5 ? 'Eligible for most scholarships and placements' : 'Work on improving weak subjects'
          ]
        };
      }
    };
  }

  // GRADE TO PERCENTAGE
  if (id === 'grade-to-percentage') {
    return {
      title: 'Grade to Percentage Converter',
      description: 'Convert letter grades to percentage and vice versa',
      presetScenarios: [
        { name: 'A Grade', icon: '🌟', values: { grade: 'A', system: 'us' } },
        { name: 'B Grade', icon: '👍', values: { grade: 'B', system: 'us' } },
        { name: 'Indian', icon: '🇮🇳', values: { percentage: '85', system: 'indian' } },
      ],
      inputs: [
        { name: 'system', label: 'Grading System', type: 'select', options: ['US (A-F)', 'Indian (10-point)', 'UK (First/Second)', 'European (ECTS)'], defaultValue: 'US (A-F)' },
        { name: 'grade', label: 'Letter Grade', type: 'text', defaultValue: 'A', placeholder: 'e.g., A, B+, C' },
        { name: 'percentage', label: 'Or Percentage', type: 'number', defaultValue: 85, min: 0, max: 100 },
      ],
      calculate: (inputs) => {
        const gradeMap: Record<string, number> = {
          'A+': 97, 'A': 93, 'A-': 90, 'B+': 87, 'B': 83, 'B-': 80,
          'C+': 77, 'C': 73, 'C-': 70, 'D+': 67, 'D': 63, 'D-': 60, 'F': 50
        };
        
        const grade = (inputs.grade || '').toUpperCase().trim();
        const percentage = safeFloat(inputs.percentage);
        
        if (grade && gradeMap[grade]) {
          const pct = gradeMap[grade];
          return {
            result: `${pct}%`,
            explanation: `Grade ${grade} typically equals ${pct}%`,
            steps: [
              `Letter Grade: ${grade}`,
              `US System: ${pct}% (${grade})`,
              `GPA equivalent: ${(pct / 25).toFixed(1)}/4.0`,
              `Indian equivalent: ${((pct - 10) / 10).toFixed(1)}/10`
            ],
            tips: [
              '📊 Grade conversion varies by institution',
              '🎯 This is a general guideline, check your school\'s policy',
              grade >= 'A' ? '🌟 Excellent grade!' : grade >= 'B' ? '👍 Good job!' : '📈 Room for improvement'
            ]
          };
        } else if (percentage > 0) {
          let letterGrade = 'F';
          if (percentage >= 93) letterGrade = 'A';
          else if (percentage >= 90) letterGrade = 'A-';
          else if (percentage >= 87) letterGrade = 'B+';
          else if (percentage >= 83) letterGrade = 'B';
          else if (percentage >= 80) letterGrade = 'B-';
          else if (percentage >= 77) letterGrade = 'C+';
          else if (percentage >= 73) letterGrade = 'C';
          else if (percentage >= 70) letterGrade = 'C-';
          else if (percentage >= 60) letterGrade = 'D';
          
          return {
            result: letterGrade,
            explanation: `${percentage}% equals grade ${letterGrade}`,
            steps: [
              `Percentage: ${percentage}%`,
              `Letter Grade: ${letterGrade}`,
              `GPA: ${(percentage / 25).toFixed(2)}/4.0`,
              `CGPA (Indian): ${((percentage - 10) / 10).toFixed(1)}/10`
            ]
          };
        }
        
        return { result: 'Error', explanation: 'Enter a valid grade or percentage' };
      }
    };
  }

  // PERCENTAGE TO GPA
  if (id === 'percentage-to-gpa') {
    return {
      title: 'Percentage to GPA Converter',
      description: 'Convert percentage marks to GPA (4.0 or 10.0 scale)',
      presetScenarios: [
        { name: 'Excellent (90%)', icon: '🌟', values: { percentage: 90, scale: '4.0' } },
        { name: 'Good (75%)', icon: '👍', values: { percentage: 75, scale: '4.0' } },
        { name: 'Average (60%)', icon: '📚', values: { percentage: 60, scale: '4.0' } },
      ],
      inputs: [
        { name: 'percentage', label: 'Percentage', type: 'slider', defaultValue: 85, min: 0, max: 100, step: 0.1 },
        { name: 'scale', label: 'GPA Scale', type: 'select', options: ['4.0', '10.0'], defaultValue: '4.0' },
      ],
      calculate: (inputs) => {
        const percentage = safeFloat(inputs.percentage);
        const scale = inputs.scale || '4.0';
        
        let gpa = 0;
        if (scale === '4.0') {
          gpa = percentage / 25;
        } else {
          gpa = (percentage - 10) / 10;
        }
        
        return {
          result: gpa.toFixed(2),
          explanation: `${percentage}% = ${gpa.toFixed(2)} GPA (${scale} scale)`,
          steps: [
            `Percentage: ${percentage}%`,
            `GPA Scale: ${scale}`,
            scale === '4.0' ? `Formula: ${percentage} ÷ 25 = ${gpa.toFixed(2)}` : `Formula: (${percentage} - 10) ÷ 10 = ${gpa.toFixed(2)}`,
            `Performance: ${percentage >= 90 ? 'Excellent' : percentage >= 75 ? 'Good' : percentage >= 60 ? 'Average' : 'Needs Improvement'}`
          ],
          tips: [
            gpa >= 3.5 ? '🌟 Outstanding! Top tier performance' :
            gpa >= 3.0 ? '💎 Great job! You\'re doing well' :
            gpa >= 2.5 ? '✅ Good progress, keep improving' :
            '📈 Focus on weak subjects to boost GPA',
            '📊 Conversion formulas vary by institution',
            `To reach ${scale === '4.0' ? '4.0' : '10.0'} GPA, you need ${(scale === '4.0' ? 100 : (10 * 10 + 10)).toFixed(0)}%`
          ]
        };
      }
    };
  }

  // GPA TO PERCENTAGE
  if (id === 'gpa-to-percentage') {
    return {
      title: 'GPA to Percentage Converter',
      description: 'Convert GPA (4.0 or 10.0 scale) to percentage marks',
      presetScenarios: [
        { name: 'High GPA', icon: '🌟', values: { gpa: 3.8, scale: '4.0' } },
        { name: 'Medium GPA', icon: '👍', values: { gpa: 3.0, scale: '4.0' } },
        { name: 'Indian CGPA', icon: '🇮🇳', values: { gpa: 8.5, scale: '10.0' } },
      ],
      inputs: [
        { name: 'gpa', label: 'GPA/CGPA', type: 'number', defaultValue: 3.5, min: 0, max: 10, step: 0.01 },
        { name: 'scale', label: 'Scale', type: 'select', options: ['4.0', '10.0'], defaultValue: '4.0' },
      ],
      calculate: (inputs) => {
        const gpa = safeFloat(inputs.gpa);
        const scale = inputs.scale || '4.0';
        
        let percentage = 0;
        if (scale === '4.0') {
          percentage = gpa * 25;
        } else {
          percentage = (gpa * 10) + 10;
        }
        
        percentage = Math.min(percentage, 100);
        
        return {
          result: `${percentage.toFixed(1)}%`,
          explanation: `GPA ${gpa} (${scale} scale) = ${percentage.toFixed(1)}%`,
          steps: [
            `GPA: ${gpa}`,
            `Scale: ${scale}`,
            scale === '4.0' ? `Formula: ${gpa} × 25 = ${percentage.toFixed(1)}%` : `Formula: (${gpa} × 10) + 10 = ${percentage.toFixed(1)}%`,
            `Class: ${percentage >= 90 ? 'First Class with Distinction' : percentage >= 75 ? 'First Class' : percentage >= 60 ? 'Second Class' : 'Pass Class'}`
          ],
          tips: [
            percentage >= 90 ? '🏆 Outstanding academic performance!' :
            percentage >= 75 ? '🌟 Excellent! You\'re in first class' :
            percentage >= 60 ? '👍 Good job! Keep improving' :
            '📈 Focus on core subjects',
            '📊 Formula may vary by university policy',
            `Your percentile rank: Top ${(100 - percentage).toFixed(0)}%`
          ]
        };
      }
    };
  }

  // GRADE POINT AVERAGE
  if (id === 'grade-point-average') {
    return {
      title: 'Weighted Grade Point Average',
      description: 'Calculate weighted GPA with course difficulty levels',
      presetScenarios: [
        { name: 'Honors', icon: '🎓', values: { credits: '4,3,3', grades: '4.0,3.7,4.0', weights: '1.5,1.0,1.5' } },
        { name: 'Regular', icon: '📚', values: { credits: '4,3,3', grades: '3.5,3.3,3.0', weights: '1.0,1.0,1.0' } },
        { name: 'Mixed', icon: '🎯', values: { credits: '4,3,3', grades: '4.0,3.5,3.7', weights: '1.5,1.0,1.2' } },
      ],
      inputs: [
        { name: 'credits', label: 'Credit Hours', type: 'text', defaultValue: '3,4,3,2', placeholder: 'e.g., 3,4,3,2' },
        { name: 'grades', label: 'Grade Points', type: 'text', defaultValue: '4.0,3.7,3.3,4.0', placeholder: 'e.g., 4.0,3.7,3.3' },
        { name: 'weights', label: 'Weights (1.0=Regular, 1.5=Honors)', type: 'text', defaultValue: '1.0,1.5,1.0,1.0', placeholder: 'e.g., 1.0,1.5,1.0' },
      ],
      calculate: (inputs) => {
        const credits = (inputs.credits || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
        const grades = (inputs.grades || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
        const weights = (inputs.weights || '').split(',').map((s: string) => parseFloat(s.trim())).filter((n: number) => !isNaN(n));
        
        if (credits.length === 0 || credits.length !== grades.length || credits.length !== weights.length) {
          return { result: 'Error', explanation: 'Enter equal number of credits, grades, and weights' };
        }

        let totalPoints = 0;
        let totalCredits = 0;

        for (let i = 0; i < credits.length; i++) {
          const weightedGrade = grades[i] * weights[i];
          totalPoints += credits[i] * weightedGrade;
          totalCredits += credits[i];
        }

        const weightedGPA = totalPoints / totalCredits;
        let unweightedPoints = 0;
        for (let i = 0; i < credits.length; i++) {
          unweightedPoints += credits[i] * grades[i];
        }
        const unweightedGPA = unweightedPoints / totalCredits;
        
        return {
          result: weightedGPA.toFixed(2),
          explanation: `Weighted GPA: ${weightedGPA.toFixed(2)} (Unweighted: ${unweightedGPA.toFixed(2)})`,
          steps: [
            `Total courses: ${credits.length}`,
            `Total credits: ${totalCredits}`,
            `Weighted points: ${totalPoints.toFixed(1)}`,
            `Weighted GPA: ${weightedGPA.toFixed(2)}`,
            `Unweighted GPA: ${unweightedGPA.toFixed(2)}`,
            `GPA boost from honors: +${(weightedGPA - unweightedGPA).toFixed(2)}`
          ],
          tips: [
            weightedGPA >= 4.5 ? '🌟 Exceptional! Taking challenging courses pays off!' :
            weightedGPA >= 4.0 ? '💎 Excellent weighted GPA with honors courses' :
            weightedGPA >= 3.5 ? '✅ Good performance in advanced courses' :
            '📈 Consider more honors/AP courses',
            `Honors courses boosted your GPA by ${((weightedGPA - unweightedGPA) * 100 / unweightedGPA).toFixed(1)}%`,
            'Weighted GPA is crucial for competitive college admissions'
          ]
        };
      }
    };
  }

  // SEMESTER GPA
  if (id === 'semester-gpa') {
    return {
      title: 'Semester GPA Calculator',
      description: 'Calculate your GPA for current semester',
      presetScenarios: [
        { name: 'Excellent Sem', icon: '🌟', values: { courses: '5', avgGrade: '3.8', avgCredit: '3' } },
        { name: 'Good Sem', icon: '👍', values: { courses: '5', avgGrade: '3.3', avgCredit: '3' } },
        { name: 'Average Sem', icon: '📚', values: { courses: '5', avgGrade: '2.8', avgCredit: '3' } },
      ],
      inputs: [
        { name: 'courses', label: 'Number of Courses', type: 'slider', defaultValue: 5, min: 1, max: 10, step: 1 },
        { name: 'avgGrade', label: 'Average Grade Point', type: 'slider', defaultValue: 3.5, min: 0, max: 4, step: 0.1 },
        { name: 'avgCredit', label: 'Average Credits per Course', type: 'slider', defaultValue: 3, min: 1, max: 6, step: 1 },
      ],
      calculate: (inputs) => {
        const courses = safeInt(inputs.courses);
        const avgGrade = safeFloat(inputs.avgGrade);
        const avgCredit = safeFloat(inputs.avgCredit);
        
        const totalCredits = courses * avgCredit;
        const totalPoints = totalCredits * avgGrade;
        const sgpa = avgGrade;
        
        return {
          result: sgpa.toFixed(2),
          explanation: `Semester GPA: ${sgpa.toFixed(2)} for ${courses} courses`,
          steps: [
            `Total courses: ${courses}`,
            `Average credits: ${avgCredit} per course`,
            `Total credits: ${totalCredits}`,
            `Average grade point: ${avgGrade}`,
            `SGPA: ${sgpa.toFixed(2)}`
          ],
          visualData: [
            { label: 'Courses', value: courses },
            { label: 'Credits', value: totalCredits },
            { label: 'SGPA', value: sgpa }
          ],
          tips: [
            sgpa >= 3.8 ? '🏆 Outstanding semester! Keep it up!' :
            sgpa >= 3.3 ? '🌟 Great semester performance!' :
            sgpa >= 2.8 ? '✅ Decent semester, aim higher next time' :
            '📈 Focus on improving next semester',
            `Total workload: ${totalCredits} credits`,
            `To reach 4.0 next semester, need all A grades in ${courses} courses`
          ]
        };
      }
    };
  }

  // CUMULATIVE GPA
  if (id === 'cumulative-gpa') {
    return {
      title: 'Cumulative GPA Calculator',
      description: 'Track your overall GPA across all semesters',
      presetScenarios: [
        { name: '4 Semesters', icon: '🎓', values: { semesters: '4', avgSGPA: '3.6', creditsPerSem: '18' } },
        { name: '6 Semesters', icon: '📚', values: { semesters: '6', avgSGPA: '3.3', creditsPerSem: '18' } },
        { name: '8 Semesters', icon: '🏆', values: { semesters: '8', avgSGPA: '3.8', creditsPerSem: '16' } },
      ],
      inputs: [
        { name: 'semesters', label: 'Completed Semesters', type: 'slider', defaultValue: 4, min: 1, max: 10, step: 1 },
        { name: 'avgSGPA', label: 'Average SGPA', type: 'slider', defaultValue: 3.5, min: 0, max: 4, step: 0.1 },
        { name: 'creditsPerSem', label: 'Average Credits per Semester', type: 'slider', defaultValue: 18, min: 12, max: 24, step: 1 },
      ],
      calculate: (inputs) => {
        const semesters = safeInt(inputs.semesters);
        const avgSGPA = safeFloat(inputs.avgSGPA);
        const creditsPerSem = safeFloat(inputs.creditsPerSem);
        
        const totalCredits = semesters * creditsPerSem;
        const cgpa = avgSGPA;
        const percentage = (cgpa - 0.75) * 10;
        
        return {
          result: cgpa.toFixed(2),
          explanation: `Cumulative GPA: ${cgpa.toFixed(2)} over ${semesters} semesters`,
          steps: [
            `Completed semesters: ${semesters}`,
            `Total credits earned: ${totalCredits}`,
            `Average SGPA: ${avgSGPA.toFixed(2)}`,
            `Cumulative GPA: ${cgpa.toFixed(2)}`,
            `Approximate percentage: ${percentage.toFixed(1)}%`
          ],
          visualData: [
            { label: 'Semesters', value: semesters },
            { label: 'Credits', value: totalCredits },
            { label: 'CGPA', value: cgpa }
          ],
          tips: [
            cgpa >= 3.8 ? '🏆 Outstanding cumulative performance!' :
            cgpa >= 3.3 ? '🌟 Excellent overall GPA!' :
            cgpa >= 2.8 ? '✅ Good progress, keep improving' :
            '📈 Focus on upcoming semesters',
            `Credits completed: ${totalCredits} / ~120 for graduation`,
            `Class standing: ${cgpa >= 3.8 ? 'Summa Cum Laude' : cgpa >= 3.5 ? 'Magna Cum Laude' : cgpa >= 3.0 ? 'Cum Laude' : 'Good Standing'}`
          ]
        };
      }
    };
  }

  // JEE RANK PREDICTOR
  if (id === 'jee-rank-predictor') {
    return {
      title: 'JEE Main/Advanced Rank Predictor',
      description: 'Predict your JEE rank based on expected marks',
      presetScenarios: [
        { name: 'Top 100', icon: '🏆', values: { marks: 280, totalMarks: 300, category: 'General' } },
        { name: 'Top 1000', icon: '🌟', values: { marks: 250, totalMarks: 300, category: 'General' } },
        { name: 'Top 10000', icon: '✅', values: { marks: 180, totalMarks: 300, category: 'OBC' } },
      ],
      inputs: [
        { name: 'marks', label: 'Expected Marks', type: 'slider', defaultValue: 200, min: 0, max: 300, step: 1 },
        { name: 'totalMarks', label: 'Total Marks', type: 'number', defaultValue: 300, min: 100, max: 360 },
        { name: 'category', label: 'Category', type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'EWS'], defaultValue: 'General' },
      ],
      calculate: (inputs) => {
        const marks = safeFloat(inputs.marks);
        const total = safeFloat(inputs.totalMarks);
        const category = inputs.category || 'General';
        
        const percentile = (marks / total) * 100;
        const estimatedRank = Math.round(1000000 * (1 - percentile / 100));
        const adjustedRank = category === 'General' ? estimatedRank : 
                            category === 'OBC' ? estimatedRank * 0.7 :
                            category === 'EWS' ? estimatedRank * 0.8 :
                            estimatedRank * 0.5;
        
        return {
          result: adjustedRank.toFixed(0),
          explanation: `Predicted JEE Rank: ${adjustedRank.toFixed(0)} (${category})`,
          steps: [
            `Marks scored: ${marks}/${total}`,
            `Percentile: ${percentile.toFixed(2)}%`,
            `Category: ${category}`,
            `Estimated Rank: ${adjustedRank.toFixed(0)}`,
            `Cutoff for Top NITs: ~${category === 'General' ? '15000' : '25000'}`
          ],
          visualData: [
            { label: 'Marks', value: marks },
            { label: 'Percentile', value: percentile },
            { label: 'Rank (Est.)', value: adjustedRank / 1000 }
          ],
          tips: [
            adjustedRank <= 1000 ? '🏆 Excellent! Top IITs within reach!' :
            adjustedRank <= 10000 ? '🌟 Great score! Good IITs/NITs possible' :
            adjustedRank <= 50000 ? '✅ Decent rank, focus on state colleges' :
            '📈 Keep practicing to improve rank',
            `Target for IIT Bombay CSE: Rank < 100`,
            `Target for Top NITs: Rank < ${category === 'General' ? '15000' : '25000'}`,
            'This is an estimate based on previous years data'
          ]
        };
      }
    };
  }

  // NEET SCORE CALCULATOR
  if (id === 'neet-score-calculator') {
    return {
      title: 'NEET Score Calculator & Rank Predictor',
      description: 'Calculate NEET score and predict AIR',
      presetScenarios: [
        { name: 'AIIMS Level', icon: '🏆', values: { correct: 170, incorrect: 10, category: 'General' } },
        { name: 'Top Medical', icon: '🌟', values: { correct: 150, incorrect: 15, category: 'General' } },
        { name: 'State Quota', icon: '✅', values: { correct: 120, incorrect: 20, category: 'OBC' } },
      ],
      inputs: [
        { name: 'correct', label: 'Correct Answers', type: 'slider', defaultValue: 140, min: 0, max: 180, step: 1 },
        { name: 'incorrect', label: 'Incorrect Answers', type: 'slider', defaultValue: 20, min: 0, max: 100, step: 1 },
        { name: 'category', label: 'Category', type: 'select', options: ['General', 'OBC', 'SC', 'ST', 'EWS'], defaultValue: 'General' },
      ],
      calculate: (inputs) => {
        const correct = safeInt(inputs.correct);
        const incorrect = safeInt(inputs.incorrect);
        const category = inputs.category || 'General';
        
        const score = (correct * 4) - (incorrect * 1);
        const percentile = (score / 720) * 100;
        const estimatedRank = Math.round(1800000 * (1 - percentile / 100));
        
        return {
          result: score.toFixed(0),
          explanation: `NEET Score: ${score}/720 | Est. Rank: ${estimatedRank.toLocaleString()}`,
          steps: [
            `Correct answers: ${correct} × 4 = ${correct * 4}`,
            `Wrong answers: ${incorrect} × (-1) = -${incorrect}`,
            `Total Score: ${score}/720`,
            `Percentile: ${percentile.toFixed(2)}%`,
            `Estimated AIR: ${estimatedRank.toLocaleString()} (${category})`
          ],
          visualData: [
            { label: 'Correct', value: correct },
            { label: 'Incorrect', value: incorrect },
            { label: 'Score', value: score }
          ],
          tips: [
            score >= 650 ? '🏆 AIIMS Delhi range! Excellent preparation!' :
            score >= 600 ? '🌟 Top government medical colleges possible' :
            score >= 500 ? '✅ Good score for state medical colleges' :
            score >= 400 ? '📈 Decent, aim for private/state colleges' :
            '🎯 Focus on Biology - 50% weightage',
            `Cutoff for AIIMS: ~${category === 'General' ? '670' : '620'}+`,
            `Cutoff for Top GMCs: ~${category === 'General' ? '600' : '550'}+`,
            'Practice previous year papers to improve accuracy'
          ]
        };
      }
    };
  }

  // SCHOLARSHIP CALCULATOR
  if (id === 'scholarship-calculator') {
    return {
      title: 'Scholarship Amount Calculator',
      description: 'Calculate scholarship eligibility and amount',
      presetScenarios: [
        { name: 'Merit Based', icon: '🏆', values: { gpa: 3.8, income: 300000, type: 'Merit' } },
        { name: 'Need Based', icon: '💰', values: { gpa: 3.2, income: 150000, type: 'Need-Based' } },
        { name: 'Sports', icon: '⚽', values: { gpa: 3.0, income: 400000, type: 'Sports' } },
      ],
      inputs: [
        { name: 'gpa', label: 'Current GPA/CGPA', type: 'slider', defaultValue: 3.5, min: 0, max: 4, step: 0.1 },
        { name: 'income', label: 'Annual Family Income (₹)', type: 'number', defaultValue: 300000, min: 0, max: 10000000 },
        { name: 'type', label: 'Scholarship Type', type: 'select', options: ['Merit', 'Need-Based', 'Sports', 'Minority', 'SC/ST'], defaultValue: 'Merit' },
      ],
      calculate: (inputs) => {
        const gpa = safeFloat(inputs.gpa);
        const income = safeFloat(inputs.income);
        const type = inputs.type || 'Merit';
        
        let baseAmount = 0;
        let eligibility = false;
        
        if (type === 'Merit') {
          if (gpa >= 3.8) { baseAmount = 100000; eligibility = true; }
          else if (gpa >= 3.5) { baseAmount = 50000; eligibility = true; }
          else if (gpa >= 3.0) { baseAmount = 25000; eligibility = true; }
        } else if (type === 'Need-Based') {
          if (income < 200000) { baseAmount = 80000; eligibility = true; }
          else if (income < 400000) { baseAmount = 50000; eligibility = true; }
          else if (income < 600000) { baseAmount = 30000; eligibility = true; }
        } else {
          baseAmount = 40000;
          eligibility = gpa >= 2.5;
        }
        
        const finalAmount = eligibility ? baseAmount * (income < 200000 ? 1.2 : 1.0) : 0;
        
        return {
          result: eligibility ? `₹${finalAmount.toLocaleString()}` : 'Not Eligible',
          explanation: eligibility ? `You're eligible for ₹${finalAmount.toLocaleString()} scholarship` : 'You don\'t meet eligibility criteria',
          steps: [
            `Scholarship Type: ${type}`,
            `Your GPA: ${gpa.toFixed(2)}`,
            `Family Income: ₹${income.toLocaleString()}`,
            `Base Amount: ₹${baseAmount.toLocaleString()}`,
            income < 200000 ? `Low income bonus: +20%` : '',
            `Final Amount: ₹${finalAmount.toLocaleString()}`
          ].filter(s => s),
          tips: [
            eligibility ? '🎉 Congratulations! You qualify for scholarship' : '📈 Work on improving GPA or exploring other scholarship types',
            'Merit scholarships renewed annually based on GPA',
            'Apply early - scholarships are limited',
            gpa >= 3.5 ? 'Consider applying for national scholarships' : 'Focus on state-level scholarships',
            'Maintain attendance > 75% for eligibility'
          ]
        };
      }
    };
  }

  // STUDENT LOAN CALCULATOR
  if (id === 'student-loan-calculator') {
    return {
      title: 'Education Loan EMI Calculator',
      description: 'Calculate education loan EMI and repayment',
      presetScenarios: [
        { name: 'Engineering', icon: '🎓', values: { amount: 1500000, rate: 9.5, tenure: 10 } },
        { name: 'Medical', icon: '⚕️', values: { amount: 5000000, rate: 9.0, tenure: 15 } },
        { name: 'MBA', icon: '💼', values: { amount: 2500000, rate: 10.0, tenure: 12 } },
      ],
      inputs: [
        { name: 'amount', label: 'Loan Amount (₹)', type: 'number', defaultValue: 1000000, min: 100000, max: 10000000, step: 50000 },
        { name: 'rate', label: 'Interest Rate (%)', type: 'slider', defaultValue: 9.5, min: 7, max: 14, step: 0.1 },
        { name: 'tenure', label: 'Repayment Period (years)', type: 'slider', defaultValue: 10, min: 5, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const principal = safeFloat(inputs.amount);
        const rate = safeFloat(inputs.rate) / 12 / 100;
        const months = safeFloat(inputs.tenure) * 12;
        
        const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        return {
          result: `₹${emi.toFixed(0)}`,
          explanation: `Monthly EMI: ₹${emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}`,
          steps: [
            `Loan Amount: ₹${principal.toLocaleString()}`,
            `Interest Rate: ${(rate * 12 * 100).toFixed(2)}% p.a.`,
            `Tenure: ${(months/12).toFixed(0)} years (${months} months)`,
            `Monthly EMI: ₹${emi.toFixed(0)}`,
            `Total Payment: ₹${totalPayment.toFixed(0)}`,
            `Total Interest: ₹${totalInterest.toFixed(0)}`
          ],
          visualData: [
            { label: 'Principal', value: principal / 100000 },
            { label: 'Interest', value: totalInterest / 100000 },
            { label: 'Total', value: totalPayment / 100000 }
          ],
          tips: [
            '🎓 Most banks offer moratorium period during study',
            `💰 Interest to Principal ratio: ${((totalInterest/principal) * 100).toFixed(0)}%`,
            'Parents as co-borrowers get tax benefits under 80E',
            `Monthly income needed: ~₹${(emi * 3).toFixed(0)} (EMI should be <33% of income)`,
            totalInterest > principal ? '⚠️ Consider shorter tenure to reduce interest' : '✅ Good repayment plan'
          ]
        };
      }
    };
  }

  // DEFAULT (for remaining tools)
  return {
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Advanced ${id.split('-').join(' ')} with detailed insights`,
    inputs: [
      { name: 'score', label: 'Score/Marks', type: 'slider', defaultValue: 75, min: 0, max: 100, step: 1 },
      { name: 'target', label: 'Target Score', type: 'slider', defaultValue: 90, min: 0, max: 100, step: 1 },
      { name: 'timeframe', label: 'Time Available (days)', type: 'slider', defaultValue: 30, min: 1, max: 365, step: 1 },
    ],
    calculate: (inputs) => {
      const current = safeFloat(inputs.score);
      const target = safeFloat(inputs.target);
      const days = safeFloat(inputs.timeframe);
      
      const gap = target - current;
      const dailyImprovement = gap / days;
      const effort = gap > 0 ? (gap > 20 ? 'High' : gap > 10 ? 'Medium' : 'Low') : 'Maintain';
      
      return {
        result: effort,
        explanation: `You need ${effort.toLowerCase()} effort to reach ${target} from ${current} in ${days} days`,
        steps: [
          `Current Score: ${current}`,
          `Target Score: ${target}`,
          `Score Gap: ${gap > 0 ? gap : 0} points`,
          `Days Available: ${days}`,
          `Daily Improvement Needed: ${dailyImprovement.toFixed(2)} points/day`,
          `Effort Level: ${effort}`
        ],
        visualData: [
          { label: 'Current', value: current },
          { label: 'Target', value: target },
          { label: 'Days', value: days }
        ],
        tips: [
          gap > 0 ? `📈 Focus on weak areas to gain ${gap} points` : '🌟 Maintain your excellent performance!',
          `⏰ Study ${gap > 20 ? '4-5' : gap > 10 ? '2-3' : '1-2'} hours daily`,
          '📚 Practice previous year papers',
          gap > 15 ? '👨‍🏫 Consider taking coaching/tutoring' : '✅ Self-study with focus can achieve this',
          '🎯 Break down target into weekly milestones'
        ]
      };
    }
  };
};

const getCategoryTheme = () => ({
  gradient: 'from-indigo-500/10 via-purple-500/10 to-pink-500/10',
  icon: GraduationCap,
  emoji: '🎓',
  accentColor: 'text-indigo-600 dark:text-indigo-400'
});

export function GenericEducationTool({ id }: { id: string }) {
  if (!id) return <div className="p-8 text-center text-muted-foreground">Calculator configuration not found</div>;

  const config = getToolConfig(id);
  const theme = getCategoryTheme();
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const defaults: Record<string, any> = {};
    config.inputs.forEach(input => {
      defaults[input.name] = input.defaultValue;
    });
    setInputs(defaults);
    setResult(null);
  }, [id]);

  useEffect(() => {
    if (!autoCalculate) return;
    
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs, autoCalculate]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResult(config.calculate(inputs));
      setIsCalculating(false);
    }, 150);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `Result: ${result.result}${result.explanation ? '\nExplanation: ' + result.explanation : ''}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (values: Record<string, any>) => {
    setInputs({ ...inputs, ...values });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <theme.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {config.title}
              </h1>
              <p className="text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {config.presetScenarios && config.presetScenarios.length > 0 && (
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-semibold">Quick Scenarios</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {config.presetScenarios.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.values)}
                      className="group p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-transparent hover:border-indigo-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
                      <div className="text-xs font-medium text-center">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <div className="space-y-5">
                {config.inputs.map((input, idx) => (
                  <div key={input.name} className="space-y-2 animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        {input.label}
                        {input.helpText && (
                          <div className="group relative">
                            <Lightbulb className="w-4 h-4 text-indigo-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {input.helpText}
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {input.type === 'select' && input.options ? (
                      <select
                        value={inputs[input.name] || input.options[0]}
                        onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 outline-none transition-all duration-300 hover:shadow-md"
                      >
                        {input.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : input.type === 'slider' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{input.min || 0}</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{inputs[input.name]}</span>
                          <span>{input.max || 100}</span>
                        </div>
                        <input
                          type="range"
                          value={inputs[input.name] || 0}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: parseFloat(e.target.value) }))}
                          min={input.min || 0}
                          max={input.max || 100}
                          step={input.step || 1}
                          className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, rgb(99 102 241) 0%, rgb(99 102 241) ${((parseFloat(inputs[input.name] || 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) ${((parseFloat(inputs[input.name] || 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) 100%)`
                          }}
                        />
                      </div>
                    ) : input.type === 'number' ? (
                      <div className="relative">
                        <Input
                          type={input.type}
                          value={inputs[input.name] || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: Number(e.target.value) }))}
                          placeholder={input.placeholder || 'Enter value...'}
                          className="pr-12 focus:ring-2 focus:ring-indigo-500"
                          min={typeof input.min === 'number' ? input.min : 0}
                          max={typeof input.max === 'number' ? input.max : undefined}
                          step={input.step ?? 'any'}
                        />
                        <VoiceNumberButton
                          label={input.label}
                          onValueAction={(v) => setInputs(prev => ({ ...prev, [input.name]: v }))}
                          min={typeof input.min === 'number' ? input.min : undefined}
                          max={typeof input.max === 'number' ? input.max : undefined}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                      </div>
                    ) : (
                      <Input
                        type={input.type}
                        value={inputs[input.name] || ''}
                        onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: e.target.value }))}
                        placeholder={input.placeholder || 'Enter value...'}
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm group-hover:text-indigo-600 transition-colors">Auto-calculate</span>
                </label>

                {!autoCalculate && (
                  <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                    Calculate
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {result && (
              <>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-sm p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      Result
                    </div>
                    <button onClick={handleCopy} className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors" title="Copy result">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                    {result.result.toString()}
                  </div>
                  {result.explanation && (
                    <div className="text-sm text-muted-foreground mt-2">{result.explanation}</div>
                  )}
                  {result.formula && (
                    <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Formula</div>
                      <div className="text-sm font-mono text-indigo-600 dark:text-indigo-400">{result.formula}</div>
                    </div>
                  )}
                </div>

                {result.steps && result.steps.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-indigo-500" />
                      Calculation Steps
                    </h3>
                    <div className="space-y-3">
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-right-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg text-sm">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.tips && result.tips.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 backdrop-blur-sm p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Smart Tips
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <Target className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 backdrop-blur-sm p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-250">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-green-500" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <Award className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.visualData && result.visualData.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-indigo-500" />
                      Visual Breakdown
                    </h3>
                    <div className="space-y-3">
                      {result.visualData.map((item, idx) => {
                        const maxVal = Math.max(...result.visualData!.map(d => d.value));
                        const percentage = (item.value / maxVal) * 100;
                        return (
                          <div key={idx} className="animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{item.value.toFixed(2)}</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {result.insights && result.insights.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-350">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Key Insights
                    </h3>
                    <div className="grid gap-3">
                      {result.insights.map((insight, idx) => (
                        <div key={idx} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && (
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm p-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center animate-in fade-in duration-700">
                <theme.icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">
                  {autoCalculate ? 'Adjust values to see results' : 'Click Calculate to see results'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <SeoContentGenerator 
            title={config.title} 
            description={config.description} 
            categoryName="Education" 
          />
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(99 102 241), rgb(168 85 247));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
