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
 * Calculates Body Mass Index (BMI)
 * @param weight Weight in kg
 * @param height Height in cm
 * @returns BMIResult object
 */
export const calculateBMI = (weight: number, height: number): BMIResult => {
  const heightM = height / 100;
  const bmi = weight / Math.pow(heightM, 2);
  
  let category: BMIResult['category'] = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  return {
    bmi: Number(bmi.toFixed(1)),
    category,
    idealWeightMin: Number((18.5 * Math.pow(heightM, 2)).toFixed(1)),
    idealWeightMax: Number((24.9 * Math.pow(heightM, 2)).toFixed(1))
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
