"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Zap, Activity, Gauge, Battery, Lightbulb, Wind, Atom, Copy, Check, RefreshCw, Sparkles, BarChart3, TrendingUp } from 'lucide-react';
import { FinancialCalculatorTemplate } from '@/components/calculators/templates/FinancialCalculatorTemplate';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FAQSection, getPhysicsFAQs } from '@/components/calculators/ui/FAQSection';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

interface PhysicsInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'slider';
  options?: string[];
  defaultValue?: number | string;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
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
}

interface PhysicsToolConfig {
  title: string;
  description: string;
  inputs: PhysicsInput[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
  presetScenarios?: Array<{ name: string; icon?: string; values: Record<string, any> }>;
}

// Helper for safe number parsing
const safeFloat = (val: any) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const formatNumber = (value: number, decimals = 4) => {
  if (!isFinite(value)) return 'Error';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return value.toExponential(3);
  return value.toFixed(decimals);
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;

const getToolConfig = (id: string | undefined): PhysicsToolConfig => {
  if (!id) return {
    title: 'Calculator Not Found',
    description: 'This calculator configuration is missing.',
    inputs: [],
    calculate: () => ({ result: 'Error' })
  };

  // --- ID Aliases (science/scientific catalog variants) ---
  if (id === 'kinetic-energy-calculator') return getToolConfig('kinetic-energy');
  if (id === 'potential-energy-calculator') return getToolConfig('potential-energy');
  if (id === 'friction-force') return getToolConfig('friction-calculator');
  if (id === 'pendulum-period') return getToolConfig('simple-pendulum');
  
  // --- Mechanics & Motion ---
  if (id === 'velocity-calculator') {
    return {
      title: 'Velocity Calculator',
      description: 'Calculate velocity from distance and time.',
      presetScenarios: [
        { name: 'Walking', icon: '🚶', values: { distance: 100, time: 72 } },
        { name: 'Running', icon: '🏃', values: { distance: 100, time: 12 } },
        { name: 'Car', icon: '🚗', values: { distance: 1000, time: 36 } },
      ],
      inputs: [
        { name: 'distance', label: 'Distance', type: 'slider', defaultValue: 100, suffix: 'm', min: 0, max: 10000, step: 10, helpText: 'Distance traveled' },
        { name: 'time', label: 'Time', type: 'slider', defaultValue: 10, suffix: 's', min: 0.1, max: 3600, step: 0.1, helpText: 'Time taken' },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.distance);
        const t = safeFloat(inputs.time);
        
        if (t === 0) return { result: 'Error', explanation: 'Time cannot be zero.' };

        const v = d / t;
        const kmh = v * 3.6;

        const tips: string[] = [];
        if (v < 2) tips.push('🚶 Walking speed range');
        else if (v < 5) tips.push('🏃 Jogging speed');
        else if (v < 12) tips.push('🚴 Cycling speed');
        else if (v < 30) tips.push('🚗 City traffic speed');
        else tips.push('🏎️ Highway speed');

        tips.push(`💡 Remember: v = d ÷ t`);
        tips.push(`🌍 This is ${kmh.toFixed(2)} km/h`);

        return {
          result: `${v.toFixed(2)} m/s`,
          explanation: 'Average velocity calculated.',
          steps: [
            `Formula: v = d / t`,
            `Velocity = Distance / Time`,
            `v = ${d} m / ${t} s = ${v.toFixed(4)} m/s`,
            `In km/h: ${v.toFixed(2)} × 3.6 = ${kmh.toFixed(2)} km/h`
          ],
          tips,
          formula: 'v = d ÷ t',
          visualData: [
            { label: 'Distance (m)', value: d },
            { label: 'Time (s)', value: t },
            { label: 'Velocity (m/s)', value: v }
          ]
        };
      }
    };
  }

  if (id === 'force-calculator') {
    return {
      title: 'Force Calculator (Newton\'s Second Law)',
      description: 'Calculate force using F = ma.',
      inputs: [
        { name: 'mass', label: 'Mass', type: 'number', defaultValue: 10, suffix: 'kg' },
        { name: 'acceleration', label: 'Acceleration', type: 'number', defaultValue: 9.8, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const a = safeFloat(inputs.acceleration);
        
        const f = m * a;

        return {
          result: `${f.toFixed(2)} N`,
          explanation: 'Force = Mass × Acceleration',
          steps: [
            `F = m × a`,
            `F = ${m} × ${a} = ${f.toFixed(2)} N`
          ]
        };
      }
    };
  }

  if (id === 'acceleration-calculator') {
    return {
      title: 'Acceleration Calculator',
      description: 'Calculate acceleration from change in velocity over time.',
      inputs: [
        { name: 'initialVelocity', label: 'Initial Velocity (u)', type: 'number', defaultValue: 0, suffix: 'm/s' },
        { name: 'finalVelocity', label: 'Final Velocity (v)', type: 'number', defaultValue: 20, suffix: 'm/s' },
        { name: 'time', label: 'Time (t)', type: 'number', defaultValue: 5, suffix: 's', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const u = safeFloat(inputs.initialVelocity);
        const v = safeFloat(inputs.finalVelocity);
        const t = safeFloat(inputs.time);
        if (t === 0) return { result: 'Error', explanation: 'Time cannot be zero.' };
        const a = (v - u) / t;
        return {
          result: `${formatNumber(a, 4)} m/s²`,
          explanation: 'Acceleration = (Final − Initial) ÷ Time',
          steps: [
            `Formula: a = (v − u) / t`,
            `a = (${v} − ${u}) / ${t} = ${formatNumber(a, 6)} m/s²`,
          ],
          formula: 'a = (v − u) ÷ t',
        };
      },
    };
  }

  if (id === 'momentum-calculator') {
    return {
      title: 'Momentum Calculator',
      description: 'Calculate momentum using p = mv.',
      inputs: [
        { name: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 10, suffix: 'kg', min: 0 },
        { name: 'velocity', label: 'Velocity (v)', type: 'number', defaultValue: 5, suffix: 'm/s' },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const v = safeFloat(inputs.velocity);
        const p = m * v;
        return {
          result: `${formatNumber(p, 4)} kg·m/s`,
          explanation: 'Momentum = Mass × Velocity',
          steps: [
            `Formula: p = m × v`,
            `p = ${m} × ${v} = ${formatNumber(p, 6)} kg·m/s`,
          ],
          formula: 'p = m × v',
        };
      },
    };
  }

  if (id === 'kinetic-energy') {
    return {
      title: 'Kinetic Energy Calculator',
      description: 'Calculate kinetic energy of a moving object.',
      inputs: [
        { name: 'mass', label: 'Mass', type: 'number', defaultValue: 5, suffix: 'kg' },
        { name: 'velocity', label: 'Velocity', type: 'number', defaultValue: 10, suffix: 'm/s' },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const v = safeFloat(inputs.velocity);
        
        const ke = 0.5 * m * v * v;

        return {
          result: `${ke.toFixed(2)} J`,
          explanation: 'Kinetic Energy = ½mv²',
          steps: [
            `KE = 0.5 × m × v²`,
            `KE = 0.5 × ${m} × ${v}²`,
            `KE = ${ke.toFixed(2)} Joules`
          ]
        };
      }
    };
  }

  if (id === 'potential-energy') {
    return {
      title: 'Gravitational Potential Energy',
      description: 'Calculate potential energy based on height.',
      inputs: [
        { name: 'mass', label: 'Mass', type: 'number', defaultValue: 10, suffix: 'kg' },
        { name: 'height', label: 'Height', type: 'number', defaultValue: 20, suffix: 'm' },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.8, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const h = safeFloat(inputs.height);
        const g = safeFloat(inputs.gravity);
        
        const pe = m * g * h;

        return {
          result: `${pe.toFixed(2)} J`,
          explanation: 'Potential Energy = mgh',
          steps: [
            `PE = m × g × h`,
            `PE = ${m} × ${g} × ${h}`,
            `PE = ${pe.toFixed(2)} Joules`
          ]
        };
      }
    };
  }

  if (id === 'work-calculator') {
    return {
      title: 'Work Calculator',
      description: 'Calculate work done using W = F d cos(θ).',
      inputs: [
        { name: 'force', label: 'Force (F)', type: 'number', defaultValue: 50, suffix: 'N' },
        { name: 'distance', label: 'Displacement (d)', type: 'number', defaultValue: 10, suffix: 'm', min: 0 },
        { name: 'angle', label: 'Angle (θ)', type: 'number', defaultValue: 0, suffix: '°' },
      ],
      calculate: (inputs) => {
        const f = safeFloat(inputs.force);
        const d = safeFloat(inputs.distance);
        const angleDeg = safeFloat(inputs.angle);
        const w = f * d * Math.cos(degToRad(angleDeg));
        return {
          result: `${formatNumber(w, 4)} J`,
          explanation: 'Work is energy transferred by force over a distance.',
          steps: [
            `Formula: W = F × d × cos(θ)`,
            `W = ${f} × ${d} × cos(${angleDeg}°) = ${formatNumber(w, 6)} J`,
          ],
          formula: 'W = Fd cos(θ)',
        };
      },
    };
  }

  if (id === 'power-calculator') {
    return {
      title: 'Power Calculator',
      description: 'Calculate power using P = W/t.',
      inputs: [
        { name: 'work', label: 'Work (W)', type: 'number', defaultValue: 1000, suffix: 'J' },
        { name: 'time', label: 'Time (t)', type: 'number', defaultValue: 10, suffix: 's', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const w = safeFloat(inputs.work);
        const t = safeFloat(inputs.time);
        if (t === 0) return { result: 'Error', explanation: 'Time cannot be zero.' };
        const p = w / t;
        return {
          result: `${formatNumber(p, 4)} W`,
          explanation: 'Power is the rate of doing work.',
          steps: [
            `Formula: P = W / t`,
            `P = ${w} / ${t} = ${formatNumber(p, 6)} W`,
          ],
          formula: 'P = W / t',
        };
      },
    };
  }

  if (id === 'mechanical-energy') {
    return {
      title: 'Mechanical Energy',
      description: 'Calculate total mechanical energy (KE + PE).',
      inputs: [
        { name: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 2, suffix: 'kg', min: 0 },
        { name: 'velocity', label: 'Velocity (v)', type: 'number', defaultValue: 5, suffix: 'm/s' },
        { name: 'height', label: 'Height (h)', type: 'number', defaultValue: 3, suffix: 'm', min: 0 },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.80665, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const v = safeFloat(inputs.velocity);
        const h = safeFloat(inputs.height);
        const g = safeFloat(inputs.gravity);
        const ke = 0.5 * m * v * v;
        const pe = m * g * h;
        const total = ke + pe;
        return {
          result: `${formatNumber(total, 4)} J`,
          explanation: `KE: ${formatNumber(ke, 4)} J | PE: ${formatNumber(pe, 4)} J`,
          steps: [
            `KE = ½mv² = 0.5×${m}×${v}² = ${formatNumber(ke, 6)} J`,
            `PE = mgh = ${m}×${g}×${h} = ${formatNumber(pe, 6)} J`,
            `Total = KE + PE = ${formatNumber(total, 6)} J`,
          ],
        };
      },
    };
  }

  if (id === 'efficiency-calculator') {
    return {
      title: 'Efficiency Calculator',
      description: 'Calculate efficiency using η = (output/input) × 100%.',
      inputs: [
        { name: 'output', label: 'Useful Output', type: 'number', defaultValue: 80, min: 0 },
        { name: 'input', label: 'Total Input', type: 'number', defaultValue: 100, min: 0.000001 },
      ],
      calculate: (inputs) => {
        const out = safeFloat(inputs.output);
        const inn = safeFloat(inputs.input);
        if (inn === 0) return { result: 'Error', explanation: 'Input cannot be zero.' };
        const eta = (out / inn) * 100;
        return {
          result: `${formatNumber(eta, 2)}%`,
          explanation: 'Higher efficiency means less energy wasted.',
          steps: [
            `Formula: η = (output / input) × 100%`,
            `η = (${out} / ${inn}) × 100 = ${formatNumber(eta, 6)}%`,
          ],
          formula: 'η = (output/input) × 100%',
        };
      },
    };
  }

  if (id === 'projectile-motion') {
    return {
      title: 'Projectile Motion Calculator',
      description: 'Calculate range, max height, and time of flight.',
      inputs: [
        { name: 'velocity', label: 'Initial Velocity', type: 'number', defaultValue: 20, suffix: 'm/s' },
        { name: 'angle', label: 'Launch Angle', type: 'number', defaultValue: 45, suffix: '°' },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.8, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const v = safeFloat(inputs.velocity);
        const angleDeg = safeFloat(inputs.angle);
        const g = safeFloat(inputs.gravity);
        
        const angleRad = (angleDeg * Math.PI) / 180;
        const range = (v * v * Math.sin(2 * angleRad)) / g;
        const maxHeight = (v * v * Math.sin(angleRad) * Math.sin(angleRad)) / (2 * g);
        const timeOfFlight = (2 * v * Math.sin(angleRad)) / g;

        return {
          result: `Range: ${range.toFixed(2)} m`,
          explanation: `Max Height: ${maxHeight.toFixed(2)} m | Time: ${timeOfFlight.toFixed(2)} s`,
          steps: [
            `Range = v² sin(2θ) / g = ${range.toFixed(2)} m`,
            `Max Height = v² sin²(θ) / 2g = ${maxHeight.toFixed(2)} m`,
            `Time of Flight = 2v sin(θ) / g = ${timeOfFlight.toFixed(2)} s`
          ]
        };
      }
    };
  }

  if (id === 'friction-calculator') {
    return {
      title: 'Friction Force Calculator',
      description: 'Calculate friction force using F = μN.',
      inputs: [
        { name: 'coefficient', label: 'Coefficient of Friction (μ)', type: 'number', defaultValue: 0.3, min: 0, step: 0.01 },
        { name: 'normalForce', label: 'Normal Force (N)', type: 'number', defaultValue: 100, suffix: 'N', min: 0 },
      ],
      calculate: (inputs) => {
        const mu = safeFloat(inputs.coefficient);
        const n = safeFloat(inputs.normalForce);
        const f = mu * n;
        return {
          result: `${formatNumber(f, 4)} N`,
          explanation: 'Friction force = μ × Normal force',
          steps: [
            `Formula: F = μ × N`,
            `F = ${mu} × ${n} = ${formatNumber(f, 6)} N`,
          ],
          formula: 'F = μN',
        };
      },
    };
  }

  if (id === 'torque-calculator') {
    return {
      title: 'Torque Calculator',
      description: 'Calculate torque using τ = rF sin(θ).',
      inputs: [
        { name: 'force', label: 'Force (F)', type: 'number', defaultValue: 50, suffix: 'N' },
        { name: 'radius', label: 'Lever Arm (r)', type: 'number', defaultValue: 0.3, suffix: 'm', min: 0 },
        { name: 'angle', label: 'Angle (θ)', type: 'number', defaultValue: 90, suffix: '°' },
      ],
      calculate: (inputs) => {
        const f = safeFloat(inputs.force);
        const r = safeFloat(inputs.radius);
        const angleDeg = safeFloat(inputs.angle);
        const tau = r * f * Math.sin(degToRad(angleDeg));
        return {
          result: `${formatNumber(tau, 4)} N·m`,
          explanation: 'Torque depends on force, lever arm, and angle.',
          steps: [
            `Formula: τ = r × F × sin(θ)`,
            `τ = ${r} × ${f} × sin(${angleDeg}°) = ${formatNumber(tau, 6)} N·m`,
          ],
          formula: 'τ = rF sin(θ)',
        };
      },
    };
  }

  if (id === 'rotational-inertia') {
    return {
      title: 'Rotational Inertia (Moment of Inertia)',
      description: 'Calculate moment of inertia for common shapes.',
      inputs: [
        {
          name: 'shape',
          label: 'Shape',
          type: 'select',
          options: [
            'Solid Disk/Cylinder',
            'Solid Sphere',
            'Hollow Sphere',
            'Thin Rod (center)',
            'Thin Rod (end)',
            'Point Mass',
          ],
          defaultValue: 'Solid Disk/Cylinder',
        },
        { name: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 2, suffix: 'kg', min: 0 },
        { name: 'radius', label: 'Radius (r)', type: 'number', defaultValue: 0.5, suffix: 'm', min: 0 },
        { name: 'length', label: 'Length (L)', type: 'number', defaultValue: 1, suffix: 'm', min: 0 },
      ],
      calculate: (inputs) => {
        const shape = String(inputs.shape || 'Solid Disk/Cylinder');
        const m = safeFloat(inputs.mass);
        const r = safeFloat(inputs.radius);
        const L = safeFloat(inputs.length);

        let I = 0;
        let formula = '';
        if (shape === 'Solid Disk/Cylinder') {
          I = 0.5 * m * r * r;
          formula = 'I = ½mr²';
        } else if (shape === 'Solid Sphere') {
          I = (2 / 5) * m * r * r;
          formula = 'I = 2/5 mr²';
        } else if (shape === 'Hollow Sphere') {
          I = (2 / 3) * m * r * r;
          formula = 'I = 2/3 mr²';
        } else if (shape === 'Thin Rod (center)') {
          I = (1 / 12) * m * L * L;
          formula = 'I = 1/12 mL²';
        } else if (shape === 'Thin Rod (end)') {
          I = (1 / 3) * m * L * L;
          formula = 'I = 1/3 mL²';
        } else {
          I = m * r * r;
          formula = 'I = mr²';
        }

        return {
          result: `${formatNumber(I, 6)} kg·m²`,
          explanation: `Shape: ${shape}`,
          steps: [
            `Selected formula: ${formula}`,
            `I = ${formatNumber(I, 9)} kg·m²`,
          ],
          formula,
        };
      },
    };
  }

  if (id === 'angular-velocity') {
    return {
      title: 'Angular Velocity Calculator',
      description: 'Calculate angular velocity using ω = Δθ / t.',
      inputs: [
        { name: 'angle', label: 'Angular Displacement (Δθ)', type: 'number', defaultValue: 360, suffix: '°' },
        { name: 'time', label: 'Time (t)', type: 'number', defaultValue: 2, suffix: 's', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const angleDeg = safeFloat(inputs.angle);
        const t = safeFloat(inputs.time);
        if (t === 0) return { result: 'Error', explanation: 'Time cannot be zero.' };
        const omega = degToRad(angleDeg) / t;
        return {
          result: `${formatNumber(omega, 6)} rad/s`,
          explanation: `${formatNumber(angleDeg / t, 4)} °/s`,
          steps: [
            `Formula: ω = Δθ / t`,
            `ω = (${angleDeg}° × π/180) / ${t} = ${formatNumber(omega, 9)} rad/s`,
          ],
          formula: 'ω = Δθ / t',
        };
      },
    };
  }

  if (id === 'angular-acceleration') {
    return {
      title: 'Angular Acceleration Calculator',
      description: 'Calculate angular acceleration using α = (ωf − ωi) / t.',
      inputs: [
        { name: 'initialOmega', label: 'Initial Angular Velocity (ωi)', type: 'number', defaultValue: 0, suffix: 'rad/s' },
        { name: 'finalOmega', label: 'Final Angular Velocity (ωf)', type: 'number', defaultValue: 10, suffix: 'rad/s' },
        { name: 'time', label: 'Time (t)', type: 'number', defaultValue: 2, suffix: 's', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const wi = safeFloat(inputs.initialOmega);
        const wf = safeFloat(inputs.finalOmega);
        const t = safeFloat(inputs.time);
        if (t === 0) return { result: 'Error', explanation: 'Time cannot be zero.' };
        const alpha = (wf - wi) / t;
        return {
          result: `${formatNumber(alpha, 6)} rad/s²`,
          explanation: 'Angular acceleration is the rate of change of angular velocity.',
          steps: [
            `Formula: α = (ωf − ωi) / t`,
            `α = (${wf} − ${wi}) / ${t} = ${formatNumber(alpha, 9)} rad/s²`,
          ],
          formula: 'α = (ωf − ωi) / t',
        };
      },
    };
  }

  if (id === 'angular-momentum') {
    return {
      title: 'Angular Momentum Calculator',
      description: 'Calculate angular momentum using L = Iω.',
      inputs: [
        { name: 'momentOfInertia', label: 'Moment of Inertia (I)', type: 'number', defaultValue: 0.5, suffix: 'kg·m²', min: 0 },
        { name: 'angularVelocity', label: 'Angular Velocity (ω)', type: 'number', defaultValue: 10, suffix: 'rad/s' },
      ],
      calculate: (inputs) => {
        const I = safeFloat(inputs.momentOfInertia);
        const omega = safeFloat(inputs.angularVelocity);
        const L = I * omega;
        return {
          result: `${formatNumber(L, 6)} kg·m²/s`,
          explanation: 'Angular momentum is conserved without external torque.',
          steps: [
            `Formula: L = I × ω`,
            `L = ${I} × ${omega} = ${formatNumber(L, 9)} kg·m²/s`,
          ],
          formula: 'L = Iω',
        };
      },
    };
  }

  if (id === 'spring-constant') {
    return {
      title: "Spring Constant (Hooke's Law)",
      description: 'Calculate spring constant using k = F/x.',
      inputs: [
        { name: 'force', label: 'Force (F)', type: 'number', defaultValue: 10, suffix: 'N' },
        { name: 'displacement', label: 'Displacement (x)', type: 'number', defaultValue: 0.05, suffix: 'm', min: 0.000000001 },
      ],
      calculate: (inputs) => {
        const F = safeFloat(inputs.force);
        const x = safeFloat(inputs.displacement);
        if (x === 0) return { result: 'Error', explanation: 'Displacement cannot be zero.' };
        const k = F / x;
        return {
          result: `${formatNumber(k, 6)} N/m`,
          explanation: 'Hooke’s law: F = kx (within elastic limit).',
          steps: [
            `Formula: k = F / x`,
            `k = ${F} / ${x} = ${formatNumber(k, 9)} N/m`,
          ],
          formula: 'k = F/x',
        };
      },
    };
  }

  if (id === 'collision-calculator') {
    return {
      title: '1D Collision Calculator',
      description: 'Compute final velocities for a 1D collision using coefficient of restitution (e).',
      presetScenarios: [
        { name: 'Elastic (e=1)', icon: '⚡', values: { m1: 2, m2: 1, u1: 3, u2: -1, e: 1 } },
        { name: 'Inelastic (e=0)', icon: '🧱', values: { m1: 2, m2: 1, u1: 3, u2: -1, e: 0 } },
      ],
      inputs: [
        { name: 'm1', label: 'Mass 1 (m₁)', type: 'number', defaultValue: 2, suffix: 'kg', min: 0 },
        { name: 'm2', label: 'Mass 2 (m₂)', type: 'number', defaultValue: 1, suffix: 'kg', min: 0 },
        { name: 'u1', label: 'Initial Velocity 1 (u₁)', type: 'number', defaultValue: 3, suffix: 'm/s' },
        { name: 'u2', label: 'Initial Velocity 2 (u₂)', type: 'number', defaultValue: -1, suffix: 'm/s' },
        { name: 'e', label: 'Restitution (e)', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01, helpText: '0 = perfectly inelastic, 1 = perfectly elastic' },
      ],
      calculate: (inputs) => {
        const m1 = safeFloat(inputs.m1);
        const m2 = safeFloat(inputs.m2);
        const u1 = safeFloat(inputs.u1);
        const u2 = safeFloat(inputs.u2);
        const e = safeFloat(inputs.e);
        const denom = m1 + m2;
        if (denom === 0) return { result: 'Error', explanation: 'Total mass cannot be zero.' };

        const v1 = (m1 * u1 + m2 * u2 - m2 * e * (u1 - u2)) / denom;
        const v2 = (m1 * u1 + m2 * u2 + m1 * e * (u1 - u2)) / denom;

        return {
          result: `v₁: ${formatNumber(v1, 4)} m/s`,
          explanation: `v₂: ${formatNumber(v2, 4)} m/s`,
          steps: [
            `Using restitution-based solution for 1D collision`,
            `v₁ = (m₁u₁ + m₂u₂ − m₂e(u₁ − u₂)) / (m₁ + m₂)`,
            `v₂ = (m₁u₁ + m₂u₂ + m₁e(u₁ − u₂)) / (m₁ + m₂)`,
          ],
        };
      },
    };
  }

  if (id === 'centripetal-force') {
    return {
      title: 'Centripetal Force Calculator',
      description: 'Calculate centripetal force using Fc = mv²/r.',
      inputs: [
        { name: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 2, suffix: 'kg', min: 0 },
        { name: 'velocity', label: 'Velocity (v)', type: 'number', defaultValue: 10, suffix: 'm/s' },
        { name: 'radius', label: 'Radius (r)', type: 'number', defaultValue: 5, suffix: 'm', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const v = safeFloat(inputs.velocity);
        const r = safeFloat(inputs.radius);
        if (r === 0) return { result: 'Error', explanation: 'Radius cannot be zero.' };
        const fc = (m * v * v) / r;
        return {
          result: `${formatNumber(fc, 4)} N`,
          explanation: 'Centripetal force points toward the center of motion.',
          steps: [
            `Formula: Fc = m v² / r`,
            `Fc = ${m} × ${v}² / ${r} = ${formatNumber(fc, 6)} N`,
          ],
          formula: 'Fc = mv² ÷ r',
        };
      },
    };
  }

  // --- Electricity ---
  if (id === 'ohms-law') {
    return {
      title: "Ohm's Law Calculator",
      description: 'Calculate voltage, current, or resistance using V = IR.',
      inputs: [
        { name: 'voltage', label: 'Voltage (V)', type: 'number', defaultValue: 12, suffix: 'V' },
        { name: 'current', label: 'Current (I)', type: 'number', defaultValue: 2, suffix: 'A' },
      ],
      calculate: (inputs) => {
        const v = safeFloat(inputs.voltage);
        const i = safeFloat(inputs.current);
        
        if (i === 0) return { result: 'Error', explanation: 'Current cannot be zero.' };

        const r = v / i;

        return {
          result: `${r.toFixed(2)} Ω`,
          explanation: 'Resistance calculated using Ohm\'s Law.',
          steps: [
            `V = I × R`,
            `R = V / I = ${v} / ${i} = ${r.toFixed(2)} Ω`
          ]
        };
      }
    };
  }

  if (id === 'power-consumption') {
    return {
      title: 'Power Consumption Calculator',
      description: 'Calculate electrical power using P = VI.',
      inputs: [
        { name: 'voltage', label: 'Voltage', type: 'number', defaultValue: 220, suffix: 'V' },
        { name: 'current', label: 'Current', type: 'number', defaultValue: 5, suffix: 'A' },
      ],
      calculate: (inputs) => {
        const v = safeFloat(inputs.voltage);
        const i = safeFloat(inputs.current);
        
        const p = v * i;

        return {
          result: `${p.toFixed(2)} W`,
          explanation: 'Power = Voltage × Current',
          steps: [
            `P = V × I`,
            `P = ${v} × ${i} = ${p.toFixed(2)} Watts`
          ]
        };
      }
    };
  }

  if (id === 'voltage-divider') {
    return {
      title: 'Voltage Divider Calculator',
      description: 'Calculate output voltage in a voltage divider circuit.',
      inputs: [
        { name: 'vin', label: 'Input Voltage', type: 'number', defaultValue: 12, suffix: 'V' },
        { name: 'r1', label: 'R1 (Resistor 1)', type: 'number', defaultValue: 1000, suffix: 'Ω' },
        { name: 'r2', label: 'R2 (Resistor 2)', type: 'number', defaultValue: 2000, suffix: 'Ω' },
      ],
      calculate: (inputs) => {
        const vin = safeFloat(inputs.vin);
        const r1 = safeFloat(inputs.r1);
        const r2 = safeFloat(inputs.r2);
        
        if (r1 + r2 === 0) return { result: 'Error', explanation: 'Total resistance cannot be zero.' };

        const vout = vin * (r2 / (r1 + r2));

        return {
          result: `${vout.toFixed(2)} V`,
          explanation: 'Output voltage calculated.',
          steps: [
            `Vout = Vin × (R2 / (R1 + R2))`,
            `Vout = ${vin} × (${r2} / (${r1} + ${r2}))`,
            `Vout = ${vout.toFixed(2)} V`
          ]
        };
      }
    };
  }

  if (id === 'resistance-calculator') {
    return {
      title: 'Resistance (Material) Calculator',
      description: 'Calculate resistance using R = ρL/A.',
      inputs: [
        { name: 'resistivity', label: 'Resistivity (ρ)', type: 'number', defaultValue: 1.68e-8, suffix: 'Ω·m', min: 0 },
        { name: 'length', label: 'Length (L)', type: 'number', defaultValue: 1, suffix: 'm', min: 0 },
        { name: 'area', label: 'Cross-sectional Area (A)', type: 'number', defaultValue: 1e-6, suffix: 'm²', min: 0.000000000001 },
      ],
      calculate: (inputs) => {
        const rho = safeFloat(inputs.resistivity);
        const L = safeFloat(inputs.length);
        const A = safeFloat(inputs.area);
        if (A === 0) return { result: 'Error', explanation: 'Area cannot be zero.' };
        const R = (rho * L) / A;
        return {
          result: `${formatNumber(R, 6)} Ω`,
          explanation: 'Longer wires increase resistance; thicker wires reduce it.',
          steps: [
            `Formula: R = ρL / A`,
            `R = ${rho} × ${L} / ${A} = ${formatNumber(R, 9)} Ω`,
          ],
          formula: 'R = ρL / A',
        };
      },
    };
  }

  if (id === 'capacitance-calculator') {
    return {
      title: 'Capacitance (Parallel Plate)',
      description: 'Calculate capacitance using C = ε₀ εr A / d.',
      inputs: [
        { name: 'area', label: 'Plate Area (A)', type: 'number', defaultValue: 0.01, suffix: 'm²', min: 0 },
        { name: 'distance', label: 'Plate Separation (d)', type: 'number', defaultValue: 0.001, suffix: 'm', min: 0.000000001 },
        { name: 'relativePermittivity', label: 'Relative Permittivity (εr)', type: 'number', defaultValue: 1, min: 1 },
      ],
      calculate: (inputs) => {
        const eps0 = 8.8541878128e-12;
        const A = safeFloat(inputs.area);
        const d = safeFloat(inputs.distance);
        const er = safeFloat(inputs.relativePermittivity);
        if (d === 0) return { result: 'Error', explanation: 'Separation cannot be zero.' };
        const C = (eps0 * er * A) / d;
        return {
          result: `${formatNumber(C, 9)} F`,
          explanation: 'Increasing area increases capacitance; increasing distance decreases it.',
          steps: [
            `Formula: C = ε₀ εr A / d`,
            `C = ${eps0} × ${er} × ${A} / ${d} = ${formatNumber(C, 12)} F`,
          ],
          formula: 'C = ε₀εrA / d',
        };
      },
    };
  }

  if (id === 'current-divider') {
    return {
      title: 'Current Divider Calculator',
      description: 'Split current between two parallel resistors.',
      inputs: [
        { name: 'totalCurrent', label: 'Total Current (It)', type: 'number', defaultValue: 2, suffix: 'A' },
        { name: 'r1', label: 'Resistor R1', type: 'number', defaultValue: 100, suffix: 'Ω', min: 0.000001 },
        { name: 'r2', label: 'Resistor R2', type: 'number', defaultValue: 200, suffix: 'Ω', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const It = safeFloat(inputs.totalCurrent);
        const R1 = safeFloat(inputs.r1);
        const R2 = safeFloat(inputs.r2);
        if (R1 + R2 === 0) return { result: 'Error', explanation: 'Resistances cannot both be zero.' };
        const I1 = It * (R2 / (R1 + R2));
        const I2 = It * (R1 / (R1 + R2));
        return {
          result: `I1: ${formatNumber(I1, 4)} A`,
          explanation: `I2: ${formatNumber(I2, 4)} A`,
          steps: [
            `I1 = It × (R2 / (R1 + R2)) = ${It} × (${R2} / (${R1}+${R2})) = ${formatNumber(I1, 6)} A`,
            `I2 = It × (R1 / (R1 + R2)) = ${It} × (${R1} / (${R1}+${R2})) = ${formatNumber(I2, 6)} A`,
          ],
        };
      },
    };
  }

  if (id === 'led-resistor') {
    return {
      title: 'LED Resistor Calculator',
      description: 'Calculate series resistor for an LED.',
      inputs: [
        { name: 'supplyVoltage', label: 'Supply Voltage (Vs)', type: 'number', defaultValue: 5, suffix: 'V', min: 0 },
        { name: 'ledVoltage', label: 'LED Forward Voltage (Vf)', type: 'number', defaultValue: 2, suffix: 'V', min: 0 },
        { name: 'currentmA', label: 'LED Current (I)', type: 'number', defaultValue: 20, suffix: 'mA', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const Vs = safeFloat(inputs.supplyVoltage);
        const Vf = safeFloat(inputs.ledVoltage);
        const ImA = safeFloat(inputs.currentmA);
        const I = ImA / 1000;
        if (I === 0) return { result: 'Error', explanation: 'Current cannot be zero.' };
        const Vdrop = Vs - Vf;
        if (Vdrop <= 0) return { result: 'Error', explanation: 'Supply voltage must be higher than LED forward voltage.' };
        const R = Vdrop / I;
        const P = Vdrop * I;
        return {
          result: `${formatNumber(R, 2)} Ω`,
          explanation: `Resistor power ≈ ${formatNumber(P, 4)} W`,
          steps: [
            `Formula: R = (Vs − Vf) / I`,
            `R = (${Vs} − ${Vf}) / ${I} = ${formatNumber(R, 6)} Ω`,
            `Power: P = (Vs − Vf) × I = ${formatNumber(P, 6)} W`,
          ],
          formula: 'R = (Vs − Vf) / I',
        };
      },
    };
  }

  if (id === 'frequency-wavelength') {
    return {
      title: 'Frequency ↔ Wavelength',
      description: 'Convert frequency to wavelength using λ = v/f.',
      presetScenarios: [
        { name: 'FM Radio', icon: '📻', values: { frequency: 1e8, speed: 3e8 } },
        { name: 'Visible Light', icon: '💡', values: { frequency: 5e14, speed: 3e8 } },
      ],
      inputs: [
        { name: 'frequency', label: 'Frequency (f)', type: 'number', defaultValue: 1e9, suffix: 'Hz', min: 0.000000001 },
        { name: 'speed', label: 'Wave Speed (v)', type: 'number', defaultValue: 3e8, suffix: 'm/s', min: 0.000000001 },
      ],
      calculate: (inputs) => {
        const f = safeFloat(inputs.frequency);
        const v = safeFloat(inputs.speed);
        if (f === 0) return { result: 'Error', explanation: 'Frequency cannot be zero.' };
        const lambda = v / f;
        return {
          result: `${formatNumber(lambda, 6)} m`,
          explanation: 'Wavelength decreases as frequency increases.',
          steps: [
            `Formula: λ = v / f`,
            `λ = ${v} / ${f} = ${formatNumber(lambda, 9)} m`,
          ],
          formula: 'λ = v / f',
        };
      },
    };
  }

  if (id === 'battery-capacity') {
    return {
      title: 'Battery Capacity Calculator',
      description: 'Calculate battery runtime based on capacity and load.',
      inputs: [
        { name: 'capacity', label: 'Battery Capacity', type: 'number', defaultValue: 2000, suffix: 'mAh' },
        { name: 'current', label: 'Load Current', type: 'number', defaultValue: 100, suffix: 'mA' },
      ],
      calculate: (inputs) => {
        const cap = safeFloat(inputs.capacity);
        const curr = safeFloat(inputs.current);
        
        if (curr === 0) return { result: 'Error', explanation: 'Current cannot be zero.' };

        const hours = cap / curr;

        return {
          result: `${hours.toFixed(2)} hours`,
          explanation: 'Battery runtime estimated.',
          steps: [
            `Runtime = Capacity / Current`,
            `Runtime = ${cap} mAh / ${curr} mA = ${hours.toFixed(2)} hours`
          ]
        };
      }
    };
  }

  if (id === 'free-fall-calculator') {
    return {
      title: 'Free Fall Calculator',
      description: 'Calculate distance and final velocity in free fall.',
      inputs: [
        { name: 'initialVelocity', label: 'Initial Velocity (u)', type: 'number', defaultValue: 0, suffix: 'm/s' },
        { name: 'time', label: 'Time (t)', type: 'number', defaultValue: 3, suffix: 's', min: 0 },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.80665, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const u = safeFloat(inputs.initialVelocity);
        const t = safeFloat(inputs.time);
        const g = safeFloat(inputs.gravity);
        const v = u + g * t;
        const s = u * t + 0.5 * g * t * t;
        return {
          result: `Distance: ${formatNumber(s, 4)} m`,
          explanation: `Final velocity: ${formatNumber(v, 4)} m/s`,
          steps: [
            `v = u + gt = ${u} + ${g}×${t} = ${formatNumber(v, 6)} m/s`,
            `s = ut + ½gt² = ${u}×${t} + 0.5×${g}×${t}² = ${formatNumber(s, 6)} m`,
          ],
        };
      },
    };
  }

  if (id === 'gravitational-force') {
    return {
      title: 'Gravitational Force Calculator',
      description: 'Calculate force between two masses using Newton’s law of gravitation.',
      presetScenarios: [
        { name: 'Earth–1kg', icon: '🌍', values: { m1: 5.972e24, m2: 1, distance: 6.371e6 } },
      ],
      inputs: [
        { name: 'm1', label: 'Mass 1 (m₁)', type: 'number', defaultValue: 5.972e24, suffix: 'kg', min: 0 },
        { name: 'm2', label: 'Mass 2 (m₂)', type: 'number', defaultValue: 1000, suffix: 'kg', min: 0 },
        { name: 'distance', label: 'Distance (r)', type: 'number', defaultValue: 6.371e6, suffix: 'm', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const G = 6.6743e-11;
        const m1 = safeFloat(inputs.m1);
        const m2 = safeFloat(inputs.m2);
        const r = safeFloat(inputs.distance);
        if (r === 0) return { result: 'Error', explanation: 'Distance cannot be zero.' };
        const f = (G * m1 * m2) / (r * r);
        return {
          result: `${formatNumber(f, 6)} N`,
          explanation: 'Gravitational force decreases with the square of distance.',
          steps: [
            `Formula: F = G m₁ m₂ / r²`,
            `F = ${G} × ${m1} × ${m2} / (${r})² = ${formatNumber(f, 9)} N`,
          ],
          formula: 'F = Gm₁m₂ / r²',
        };
      },
    };
  }

  if (id === 'escape-velocity') {
    return {
      title: 'Escape Velocity',
      description: 'Calculate the minimum speed needed to escape a body’s gravity (ignoring atmosphere).',
      presetScenarios: [
        { name: 'Earth', icon: '🌍', values: { mass: 5.972e24, radius: 6.371e6 } },
        { name: 'Moon', icon: '🌕', values: { mass: 7.342e22, radius: 1.737e6 } },
      ],
      inputs: [
        { name: 'mass', label: 'Mass (M)', type: 'number', defaultValue: 5.972e24, suffix: 'kg', min: 0 },
        { name: 'radius', label: 'Radius (r)', type: 'number', defaultValue: 6.371e6, suffix: 'm', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const G = 6.6743e-11;
        const M = safeFloat(inputs.mass);
        const r = safeFloat(inputs.radius);
        if (r === 0) return { result: 'Error', explanation: 'Radius cannot be zero.' };
        const v = Math.sqrt((2 * G * M) / r);
        const kmps = v / 1000;
        return {
          result: `${formatNumber(kmps, 4)} km/s`,
          explanation: `${formatNumber(v, 2)} m/s`,
          steps: [
            `Formula: v = √(2GM / r)`,
            `v = √(2 × ${G} × ${M} / ${r}) = ${formatNumber(v, 6)} m/s`,
          ],
          formula: 'v = √(2GM / r)',
        };
      },
    };
  }

  if (id === 'orbital-velocity') {
    return {
      title: 'Orbital Velocity',
      description: 'Calculate circular orbital speed around a central body.',
      presetScenarios: [
        { name: 'Low Earth Orbit', icon: '🛰️', values: { mass: 5.972e24, radius: 6.771e6 } },
      ],
      inputs: [
        { name: 'mass', label: 'Central Mass (M)', type: 'number', defaultValue: 5.972e24, suffix: 'kg', min: 0 },
        { name: 'radius', label: 'Orbital Radius (r)', type: 'number', defaultValue: 6.771e6, suffix: 'm', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const G = 6.6743e-11;
        const M = safeFloat(inputs.mass);
        const r = safeFloat(inputs.radius);
        if (r === 0) return { result: 'Error', explanation: 'Radius cannot be zero.' };
        const v = Math.sqrt((G * M) / r);
        return {
          result: `${formatNumber(v / 1000, 4)} km/s`,
          explanation: `${formatNumber(v, 2)} m/s`,
          steps: [
            `Formula: v = √(GM / r)`,
            `v = √(${G} × ${M} / ${r}) = ${formatNumber(v, 6)} m/s`,
          ],
          formula: 'v = √(GM / r)',
        };
      },
    };
  }

  if (id === 'keplers-law') {
    return {
      title: "Kepler's Third Law (Period)",
      description: 'Calculate orbital period for a circular orbit using T = 2π √(a³/GM).',
      presetScenarios: [
        { name: 'GEO (Earth)', icon: '🛰️', values: { mass: 5.972e24, semiMajorAxis: 4.2164e7 } },
      ],
      inputs: [
        { name: 'mass', label: 'Central Mass (M)', type: 'number', defaultValue: 5.972e24, suffix: 'kg', min: 0 },
        { name: 'semiMajorAxis', label: 'Semi-Major Axis (a)', type: 'number', defaultValue: 4.2164e7, suffix: 'm', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const G = 6.6743e-11;
        const M = safeFloat(inputs.mass);
        const a = safeFloat(inputs.semiMajorAxis);
        if (a === 0) return { result: 'Error', explanation: 'Axis length cannot be zero.' };
        const T = 2 * Math.PI * Math.sqrt((a * a * a) / (G * M));
        const hours = T / 3600;
        const days = T / 86400;
        return {
          result: `${formatNumber(hours, 4)} hours`,
          explanation: `${formatNumber(T, 2)} s (${formatNumber(days, 4)} days)`,
          steps: [
            `Formula: T = 2π √(a³ / GM)`,
            `T = 2π √(${a}³ / (${G}×${M})) = ${formatNumber(T, 6)} s`,
          ],
          formula: 'T = 2π √(a³ / GM)',
        };
      },
    };
  }

  if (id === 'density-calculator') {
    return {
      title: 'Density Calculator',
      description: 'Calculate density using ρ = m/V.',
      inputs: [
        { name: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 1, suffix: 'kg', min: 0 },
        { name: 'volume', label: 'Volume (V)', type: 'number', defaultValue: 0.001, suffix: 'm³', min: 0.000000001 },
      ],
      calculate: (inputs) => {
        const m = safeFloat(inputs.mass);
        const v = safeFloat(inputs.volume);
        if (v === 0) return { result: 'Error', explanation: 'Volume cannot be zero.' };
        const rho = m / v;
        return {
          result: `${formatNumber(rho, 4)} kg/m³`,
          explanation: 'Density = Mass ÷ Volume',
          steps: [
            `Formula: ρ = m / V`,
            `ρ = ${m} / ${v} = ${formatNumber(rho, 6)} kg/m³`,
          ],
          formula: 'ρ = m / V',
        };
      },
    };
  }

  if (id === 'pressure-calculator') {
    return {
      title: 'Pressure Calculator',
      description: 'Calculate pressure using P = F/A.',
      inputs: [
        { name: 'force', label: 'Force (F)', type: 'number', defaultValue: 100, suffix: 'N' },
        { name: 'area', label: 'Area (A)', type: 'number', defaultValue: 0.01, suffix: 'm²', min: 0.000000001 },
      ],
      calculate: (inputs) => {
        const f = safeFloat(inputs.force);
        const a = safeFloat(inputs.area);
        if (a === 0) return { result: 'Error', explanation: 'Area cannot be zero.' };
        const p = f / a;
        return {
          result: `${formatNumber(p, 4)} Pa`,
          explanation: 'Pressure = Force ÷ Area',
          steps: [
            `Formula: P = F / A`,
            `P = ${f} / ${a} = ${formatNumber(p, 6)} Pa`,
          ],
          formula: 'P = F / A',
        };
      },
    };
  }

  if (id === 'buoyancy-calculator') {
    return {
      title: 'Buoyant Force Calculator',
      description: 'Calculate buoyant force using Fb = ρ g V.',
      presetScenarios: [
        { name: 'Water', icon: '💧', values: { density: 1000, volume: 0.01, gravity: 9.80665 } },
      ],
      inputs: [
        { name: 'density', label: 'Fluid Density (ρ)', type: 'number', defaultValue: 1000, suffix: 'kg/m³', min: 0 },
        { name: 'volume', label: 'Displaced Volume (V)', type: 'number', defaultValue: 0.01, suffix: 'm³', min: 0 },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.80665, suffix: 'm/s²' },
      ],
      calculate: (inputs) => {
        const rho = safeFloat(inputs.density);
        const V = safeFloat(inputs.volume);
        const g = safeFloat(inputs.gravity);
        const fb = rho * g * V;
        return {
          result: `${formatNumber(fb, 4)} N`,
          explanation: 'Upward buoyant force equals weight of displaced fluid.',
          steps: [
            `Formula: Fb = ρ × g × V`,
            `Fb = ${rho} × ${g} × ${V} = ${formatNumber(fb, 6)} N`,
          ],
          formula: 'Fb = ρgV',
        };
      },
    };
  }

  if (id === 'simple-pendulum') {
    return {
      title: 'Simple Pendulum (Period)',
      description: 'Calculate pendulum period using T = 2π √(L/g).',
      inputs: [
        { name: 'length', label: 'Length (L)', type: 'number', defaultValue: 1, suffix: 'm', min: 0.000001 },
        { name: 'gravity', label: 'Gravity (g)', type: 'number', defaultValue: 9.80665, suffix: 'm/s²', min: 0.000001 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.length);
        const g = safeFloat(inputs.gravity);
        if (L === 0 || g === 0) return { result: 'Error', explanation: 'Length and gravity must be non-zero.' };
        const T = 2 * Math.PI * Math.sqrt(L / g);
        return {
          result: `${formatNumber(T, 4)} s`,
          explanation: 'Valid for small oscillation angles.',
          steps: [
            `Formula: T = 2π √(L / g)`,
            `T = 2π √(${L} / ${g}) = ${formatNumber(T, 6)} s`,
          ],
          formula: 'T = 2π √(L/g)',
        };
      },
    };
  }

  if (id === 'impulse-calculator') {
    return {
      title: 'Impulse Calculator',
      description: 'Calculate impulse using J = FΔt.',
      inputs: [
        { name: 'force', label: 'Force (F)', type: 'number', defaultValue: 100, suffix: 'N' },
        { name: 'time', label: 'Time (Δt)', type: 'number', defaultValue: 0.2, suffix: 's', min: 0 },
      ],
      calculate: (inputs) => {
        const f = safeFloat(inputs.force);
        const t = safeFloat(inputs.time);
        const j = f * t;
        return {
          result: `${formatNumber(j, 4)} N·s`,
          explanation: 'Impulse equals change in momentum (Δp).',
          steps: [
            `Formula: J = F × Δt`,
            `J = ${f} × ${t} = ${formatNumber(j, 6)} N·s`,
          ],
          formula: 'J = FΔt',
        };
      },
    };
  }

  // --- Default Fallback ---
  return {
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'This calculator exists in the catalog, but its formula is not configured yet.',
    inputs: [
      { name: 'val1', label: 'Value 1', type: 'number', defaultValue: 0 },
      { name: 'val2', label: 'Value 2', type: 'number', defaultValue: 0 },
    ],
    calculate: (inputs) => {
      return {
        result: 'Not Configured',
        explanation: `Missing formula mapping for: ${id}`,
        steps: []
      };
    }
  };
};

const getCategoryTheme = () => ({
  gradient: 'from-purple-500/10 via-cyan-500/10 to-blue-500/10',
  icon: Atom,
  emoji: '⚛️',
  accentColor: 'text-purple-600 dark:text-purple-400'
});

export const GenericPhysicsTool = ({ id }: { id: string }) => {
  if (!id) return <div className="p-8 text-center text-muted-foreground">Calculator configuration not found</div>;

  const config = useMemo(() => getToolConfig(id), [id]);
  const theme = useMemo(() => getCategoryTheme(), []);
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
  }, [config]);

  // Auto-calculate with debounce
  useEffect(() => {
    if (!autoCalculate) return;
    
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs, autoCalculate]);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setResult(config.calculate(inputs));
      setIsCalculating(false);
    }, 150);
  }, [config, inputs]);

  const handleCopy = async () => {
    if (!result) return;
    const text = `Result: ${result.result}${result.explanation ? '\nExplanation: ' + result.explanation : ''}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (values: Record<string, any>) => {
    setInputs(prev => ({ ...prev, ...values }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-xl shadow-lg">
              <theme.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {config.title}
              </h1>
              <p className="text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Preset Scenarios */}
            {config.presetScenarios && config.presetScenarios.length > 0 && (
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Quick Scenarios</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {config.presetScenarios.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.values)}
                      className="group p-4 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-transparent hover:border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
                      <div className="text-xs font-medium text-center">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <div className="space-y-5">
                {config.inputs.map((input, idx) => (
                  <div key={input.name} className="space-y-2 animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        {input.label}
                        {input.helpText && (
                          <div className="group relative">
                            <Lightbulb className="w-4 h-4 text-purple-500 cursor-help" />
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
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 outline-none transition-all duration-300 hover:shadow-md"
                      >
                        {input.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : input.type === 'slider' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{input.prefix || ''}{input.min || 0}{input.suffix || ''}</span>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">{input.prefix || ''}{inputs[input.name]}{input.suffix || ''}</span>
                          <span>{input.prefix || ''}{input.max || 100}{input.suffix || ''}</span>
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
                            background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((parseFloat(inputs[input.name] || 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) ${((parseFloat(inputs[input.name] || 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) 100%)`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        {input.prefix && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium z-10">
                            {input.prefix}
                          </span>
                        )}
                        <Input
                          type={input.type}
                          value={inputs[input.name] ?? ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: input.type === 'number' ? Number(e.target.value) : e.target.value }))}
                          placeholder={input.placeholder || 'Enter value...'}
                          className={`${input.prefix ? 'pl-8' : ''} ${input.suffix ? 'pr-12' : ''} focus:ring-2 focus:ring-purple-500`}
                          min={input.type === 'number' ? input.min : undefined}
                          step={input.type === 'number' ? (input.step ?? 'any') : undefined}
                        />
                        {input.suffix && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                            {input.suffix}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm group-hover:text-purple-600 transition-colors">Auto-calculate</span>
                </label>

                {!autoCalculate && (
                  <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
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
                {/* Main Result */}
                <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-950/30 dark:to-cyan-950/30 backdrop-blur-sm p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Result
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                      title="Copy result"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                    {result.result.toString()}
                  </div>
                  {result.explanation && (
                    <div className="text-sm text-muted-foreground mt-2">{result.explanation}</div>
                  )}
                  {result.formula && (
                    <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Formula</div>
                      <div className="text-sm font-mono text-purple-600 dark:text-purple-400">{result.formula}</div>
                    </div>
                  )}
                </div>

                {/* Steps */}
                {result.steps && result.steps.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-purple-500" />
                      Solution Steps
                    </h3>
                    <div className="space-y-3">
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-right-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-600 text-white text-xs flex items-center justify-center font-bold">
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

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-blue-500" />
                      Physics Insights
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Visual Data */}
                {result.visualData && result.visualData.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      Data Visualization
                    </h3>
                    <div className="space-y-3">
                      {result.visualData.map((item, idx) => {
                        const maxVal = Math.max(...result.visualData!.map(d => d.value));
                        const percentage = (item.value / maxVal) * 100;
                        return (
                          <div key={idx} className="animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-purple-600 dark:text-purple-400 font-bold">{item.value.toFixed(2)}</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-cyan-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
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
            categoryName="Physics" 
          />
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168 85 247), rgb(6 182 212));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(168 85 247), rgb(6 182 212));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
