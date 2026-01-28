/**
 * Pure Logic Layer for Health Calculators
 * Zero UI dependencies, Zero language dependencies.
 */

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Goal = 'maintain' | 'lose_mild' | 'lose_standard' | 'lose_extreme' | 'gain_mild' | 'gain_standard';
export type DietType = 'balanced' | 'low-carb' | 'high-protein' | 'keto';

export interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  idealWeightMin: number;
  idealWeightMax: number;
  // Advanced features
  bmiPrime?: number;
  ponderal?: number;
  healthRisk?: string;
  recommendation?: string;
  weightToLose?: number;
  weightToGain?: number;
  chartData?: any;
}

export interface MacroResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    fats: number;
    carbs: number;
  };
}

/**
 * Calculates Body Mass Index (BMI) with Advanced Features
 * @param weight Weight in kg
 * @param height Height in cm
 * @returns BMIResult object with advanced metrics
 */
export const calculateBMI = (weight: number, height: number): BMIResult => {
  const heightM = height / 100;
  const bmi = weight / Math.pow(heightM, 2);
  
  let category: BMIResult['category'] = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  // Calculate ideal weight range
  const idealWeightMin = Number((18.5 * Math.pow(heightM, 2)).toFixed(1));
  const idealWeightMax = Number((24.9 * Math.pow(heightM, 2)).toFixed(1));

  // Advanced metrics
  const bmiPrime = Number((bmi / 25).toFixed(2)); // BMI Prime (BMI/25)
  const ponderal = Number((weight / Math.pow(heightM, 3)).toFixed(2)); // Ponderal Index

  // Health risk assessment
  let healthRisk = 'Minimal';
  if (category === 'underweight') healthRisk = 'Increased risk of malnutrition';
  else if (category === 'overweight') healthRisk = 'Moderate risk of health issues';
  else if (category === 'obese') healthRisk = 'High risk of serious health conditions';

  // Personalized recommendations
  let recommendation = 'Maintain your healthy weight with balanced diet and exercise.';
  if (category === 'underweight') {
    recommendation = 'Increase caloric intake with nutritious foods. Consult a dietitian.';
  } else if (category === 'overweight') {
    recommendation = 'Aim for 0.5-1kg weight loss per week through diet and exercise.';
  } else if (category === 'obese') {
    recommendation = 'Consult healthcare provider for personalized weight loss plan.';
  }

  // Calculate weight to lose/gain to reach ideal range
  const weightToLose = weight > idealWeightMax ? Number((weight - idealWeightMax).toFixed(1)) : 0;
  const weightToGain = weight < idealWeightMin ? Number((idealWeightMin - weight).toFixed(1)) : 0;

  // Generate chart data for visualization
  const chartData = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese', 'Your BMI'],
    datasets: [{
      label: 'BMI Categories',
      data: [18.5, 24.9, 29.9, 35, bmi],
      backgroundColor: [
        'rgba(96, 165, 250, 0.7)',
        'rgba(34, 197, 94, 0.7)',
        'rgba(251, 191, 36, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(168, 85, 247, 0.9)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(22, 163, 74)',
        'rgb(245, 158, 11)',
        'rgb(220, 38, 38)',
        'rgb(147, 51, 234)'
      ],
      borderWidth: 2
    }]
  };

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    idealWeightMin,
    idealWeightMax,
    bmiPrime,
    ponderal,
    healthRisk,
    recommendation,
    weightToLose,
    weightToGain,
    chartData
  };
};

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: Gender): number => {
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') bmr += 5;
  else bmr -= 161;
  return Math.round(bmr);
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE) and Macros
 */
export const calculateMacros = (
  weight: number, 
  height: number, 
  age: number, 
  gender: Gender,
  activity: ActivityLevel,
  goal: Goal,
  dietType: DietType
): MacroResult => {
  const bmr = calculateBMR(weight, height, age, gender);
  
  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const tdee = Math.round(bmr * activityMultipliers[activity]);
  
  let targetCalories = tdee;
  
  switch(goal) {
    case 'lose_mild': targetCalories -= 250; break;
    case 'lose_standard': targetCalories -= 500; break;
    case 'lose_extreme': targetCalories -= 1000; break;
    case 'gain_mild': targetCalories += 250; break;
    case 'gain_standard': targetCalories += 500; break;
  }

  // Macro Split Ratios
  let proteinRatio = 0.3;
  let fatRatio = 0.3;
  let carbRatio = 0.4;

  if (dietType === 'low-carb') {
    proteinRatio = 0.4; fatRatio = 0.4; carbRatio = 0.2;
  } else if (dietType === 'high-protein') {
    proteinRatio = 0.5; fatRatio = 0.2; carbRatio = 0.3;
  } else if (dietType === 'keto') {
    proteinRatio = 0.25; fatRatio = 0.70; carbRatio = 0.05;
  }

  return {
    bmr,
    tdee,
    targetCalories: Math.round(targetCalories),
    macros: {
      protein: Math.round((targetCalories * proteinRatio) / 4),
      fats: Math.round((targetCalories * fatRatio) / 9),
      carbs: Math.round((targetCalories * carbRatio) / 4)
    }
  };
};
