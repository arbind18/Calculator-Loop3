"use client"

import React, { useState, useEffect } from 'react';
import { HardHat, Ruler, Calculator, Home, Zap, DollarSign, Copy, Check, Lightbulb, RefreshCw, Sparkles, BarChart3, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

interface ConstructionInput {
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

interface ConstructionToolConfig {
  title: string;
  description: string;
  inputs: ConstructionInput[];
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

const getToolConfig = (id: string | undefined): ConstructionToolConfig => {
  if (!id) return {
    title: 'Calculator Not Found',
    description: 'This calculator configuration is missing.',
    inputs: [],
    calculate: () => ({ result: 'Error' })
  };
  
  // CONCRETE CALCULATOR
  if (id === 'concrete-calculator') {
    return {
      title: 'Concrete Volume Calculator',
      description: 'Calculate concrete quantity for slabs, beams, and columns',
      presetScenarios: [
        { name: 'Small Slab', icon: '🏗️', values: { length: 10, width: 10, thickness: 0.15, wastage: 5 } },
        { name: 'Large Slab', icon: '🏢', values: { length: 20, width: 15, thickness: 0.15, wastage: 5 } },
        { name: 'Beam', icon: '📏', values: { length: 5, width: 0.3, thickness: 0.5, wastage: 5 } },
      ],
      inputs: [
        { name: 'length', label: 'Length (meters)', type: 'number', defaultValue: 10, min: 0.1, max: 100, step: 0.1 },
        { name: 'width', label: 'Width (meters)', type: 'number', defaultValue: 10, min: 0.1, max: 100, step: 0.1 },
        { name: 'thickness', label: 'Thickness/Height (meters)', type: 'number', defaultValue: 0.15, min: 0.05, max: 10, step: 0.05 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const thickness = safeFloat(inputs.thickness);
        const wastage = safeFloat(inputs.wastage);
        
        const volume = length * width * thickness;
        const volumeWithWastage = volume * (1 + wastage / 100);
        
        // Concrete mix ratio 1:1.5:3 (cement:sand:aggregate)
        const cement = volumeWithWastage * 7; // 7 bags per cubic meter
        const sand = volumeWithWastage * 0.45; // 0.45 cubic meter per cubic meter
        const aggregate = volumeWithWastage * 0.9; // 0.9 cubic meter per cubic meter
        
        const costPerCubicMeter = 6500; // Average cost in INR
        const totalCost = volumeWithWastage * costPerCubicMeter;
        
        return {
          result: `${volumeWithWastage.toFixed(2)} m³`,
          explanation: `Total concrete needed: ${volumeWithWastage.toFixed(2)} cubic meters`,
          steps: [
            `Dimensions: ${length}m × ${width}m × ${thickness}m`,
            `Volume: ${volume.toFixed(2)} m³`,
            `Wastage (${wastage}%): +${(volumeWithWastage - volume).toFixed(2)} m³`,
            `Total concrete: ${volumeWithWastage.toFixed(2)} m³`,
            `Cement bags (50kg): ${cement.toFixed(0)} bags`,
            `Sand: ${sand.toFixed(2)} m³`,
            `Aggregate (20mm): ${aggregate.toFixed(2)} m³`,
            `Estimated cost: ₹${totalCost.toLocaleString()}`
          ],
          visualData: [
            { label: 'Concrete (m³)', value: volumeWithWastage },
            { label: 'Cement (bags)', value: cement },
            { label: 'Sand (m³)', value: sand },
            { label: 'Aggregate (m³)', value: aggregate }
          ],
          tips: [
            '🏗️ Use M20 grade for general construction',
            '💧 Water-cement ratio should be 0.45-0.50',
            `📦 Order ${Math.ceil(cement)} bags of cement`,
            '⏰ Pour concrete within 30 minutes of mixing',
            '🌡️ Cure for minimum 7 days with water',
            `💰 Budget: ₹${totalCost.toLocaleString()} (material + labor)`
          ]
        };
      }
    };
  }

  // BRICK CALCULATOR
  if (id === 'brick-calculator') {
    return {
      title: 'Brick Quantity Calculator',
      description: 'Calculate number of bricks needed for wall construction',
      presetScenarios: [
        { name: '9" Wall', icon: '🧱', values: { length: 10, height: 3, thickness: '9', wastage: 5 } },
        { name: '4.5" Wall', icon: '📏', values: { length: 10, height: 3, thickness: '4.5', wastage: 5 } },
        { name: 'Boundary Wall', icon: '🏡', values: { length: 50, height: 2, thickness: '9', wastage: 8 } },
      ],
      inputs: [
        { name: 'length', label: 'Wall Length (meters)', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1 },
        { name: 'height', label: 'Wall Height (meters)', type: 'number', defaultValue: 3, min: 0.1, max: 20, step: 0.1 },
        { name: 'thickness', label: 'Wall Thickness', type: 'select', options: ['4.5 inch', '9 inch'], defaultValue: '9 inch' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const height = safeFloat(inputs.height);
        const thickness = inputs.thickness || '9 inch';
        const wastage = safeFloat(inputs.wastage);
        
        const area = length * height;
        
        // Bricks per sq meter: 9" wall = 100 bricks, 4.5" wall = 50 bricks
        const bricksPerSqM = thickness === '9 inch' ? 100 : 50;
        const totalBricks = Math.ceil(area * bricksPerSqM * (1 + wastage / 100));
        
        // Mortar calculation
        const mortarPerSqM = thickness === '9 inch' ? 0.03 : 0.015; // cubic meters
        const totalMortar = area * mortarPerSqM;
        const cementBags = Math.ceil(totalMortar * 5.5); // 5.5 bags per cubic meter
        const sand = totalMortar * 1.5;
        
        const brickCost = 8; // per brick
        const totalCost = (totalBricks * brickCost) + (cementBags * 400) + (sand * 1500);
        
        return {
          result: `${totalBricks.toLocaleString()} bricks`,
          explanation: `You need ${totalBricks.toLocaleString()} bricks for ${thickness} thick wall`,
          steps: [
            `Wall dimensions: ${length}m × ${height}m`,
            `Wall area: ${area.toFixed(2)} m²`,
            `Wall thickness: ${thickness}`,
            `Bricks per m²: ${bricksPerSqM}`,
            `Bricks needed: ${totalBricks.toLocaleString()}`,
            `Cement: ${cementBags} bags (50kg)`,
            `Sand: ${sand.toFixed(2)} m³`,
            `Estimated cost: ₹${totalCost.toLocaleString()}`
          ],
          visualData: [
            { label: 'Bricks', value: totalBricks / 1000 },
            { label: 'Cement (bags)', value: cementBags },
            { label: 'Sand (m³)', value: sand }
          ],
          tips: [
            `🧱 Order ${totalBricks} + ${Math.ceil(totalBricks * 0.02)} spare bricks`,
            '📏 Standard brick size: 9" × 4.5" × 3"',
            `💧 Mortar ratio: 1:6 (cement:sand)`,
            '⏰ Soak bricks in water before use',
            `💰 Total budget: ₹${totalCost.toLocaleString()}`,
            thickness === '9 inch' ? '🔊 Good for load-bearing walls' : '🏠 Suitable for partition walls'
          ]
        };
      }
    };
  }

  // CONSTRUCTION COST ESTIMATOR
  if (id === 'construction-cost') {
    return {
      title: 'House Construction Cost Estimator',
      description: 'Estimate total construction cost per square feet',
      presetScenarios: [
        { name: 'Budget', icon: '💰', values: { area: 1000, type: 'Budget', floors: '1', finish: 'Basic' } },
        { name: 'Standard', icon: '🏠', values: { area: 1500, type: 'Standard', floors: '2', finish: 'Standard' } },
        { name: 'Premium', icon: '🏆', values: { area: 2500, type: 'Premium', floors: '2', finish: 'Premium' } },
      ],
      inputs: [
        { name: 'area', label: 'Built-up Area (sq ft)', type: 'number', defaultValue: 1500, min: 100, max: 10000, step: 50 },
        { name: 'type', label: 'Construction Type', type: 'select', options: ['Budget', 'Standard', 'Premium', 'Luxury'], defaultValue: 'Standard' },
        { name: 'floors', label: 'Number of Floors', type: 'select', options: ['1', '2', '3', '4+'], defaultValue: '2' },
        { name: 'finish', label: 'Finishing Quality', type: 'select', options: ['Basic', 'Standard', 'Premium', 'Luxury'], defaultValue: 'Standard' },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const type = inputs.type || 'Standard';
        const floors = inputs.floors || '2';
        const finish = inputs.finish || 'Standard';
        
        // Base rate per sq ft in INR
        let baseRate = 0;
        if (type === 'Budget') baseRate = 1200;
        else if (type === 'Standard') baseRate = 1600;
        else if (type === 'Premium') baseRate = 2200;
        else baseRate = 3000;
        
        // Finish multiplier
        let finishMultiplier = 1.0;
        if (finish === 'Basic') finishMultiplier = 0.85;
        else if (finish === 'Premium') finishMultiplier = 1.25;
        else if (finish === 'Luxury') finishMultiplier = 1.6;
        
        // Floor multiplier (multi-storey is slightly cheaper per sq ft)
        const floorMultiplier = floors === '1' ? 1.0 : floors === '2' ? 0.95 : 0.90;
        
        const ratePerSqFt = baseRate * finishMultiplier * floorMultiplier;
        const totalCost = area * ratePerSqFt;
        
        // Breakdown
        const civilWork = totalCost * 0.45;
        const finishing = totalCost * 0.30;
        const electrical = totalCost * 0.10;
        const plumbing = totalCost * 0.08;
        const other = totalCost * 0.07;
        
        return {
          result: `₹${totalCost.toLocaleString()}`,
          explanation: `Total construction cost: ₹${totalCost.toLocaleString()} (₹${ratePerSqFt.toFixed(0)}/sq ft)`,
          steps: [
            `Built-up area: ${area} sq ft`,
            `Construction type: ${type}`,
            `Floors: ${floors}`,
            `Finishing: ${finish}`,
            `Rate: ₹${ratePerSqFt.toFixed(0)} per sq ft`,
            ``,
            `💰 Cost Breakdown:`,
            `Civil work: ₹${civilWork.toLocaleString()} (45%)`,
            `Finishing: ₹${finishing.toLocaleString()} (30%)`,
            `Electrical: ₹${electrical.toLocaleString()} (10%)`,
            `Plumbing: ₹${plumbing.toLocaleString()} (8%)`,
            `Other: ₹${other.toLocaleString()} (7%)`
          ],
          visualData: [
            { label: 'Civil Work', value: civilWork / 100000 },
            { label: 'Finishing', value: finishing / 100000 },
            { label: 'Electrical', value: electrical / 100000 },
            { label: 'Plumbing', value: plumbing / 100000 }
          ],
          tips: [
            '🏗️ Construction cost varies by city (±20%)',
            `📅 Timeline: ${Math.ceil(area / 500)} months approx`,
            '💡 Add 10-15% contingency for cost overruns',
            `💰 Monthly payment: ₹${(totalCost * 0.85 / 12).toLocaleString()} (12 months)`,
            type === 'Budget' ? '⚠️ Focus on quality materials even in budget' : '✅ Good quality assured',
            '📋 Get government approvals before starting'
          ]
        };
      }
    };
  }

  // PAINT CALCULATOR
  if (id === 'paint-calculator') {
    return {
      title: 'Paint Quantity Calculator',
      description: 'Calculate paint needed for walls and ceilings',
      presetScenarios: [
        { name: 'Small Room', icon: '🏠', values: { length: 3, width: 3, height: 3, coats: '2', doors: '1', windows: '1' } },
        { name: 'Living Room', icon: '🛋️', values: { length: 5, width: 4, height: 3.5, coats: '2', doors: '1', windows: '2' } },
        { name: 'Exterior', icon: '🏢', values: { length: 15, width: 10, height: 3, coats: '3', doors: '2', windows: '6' } },
      ],
      inputs: [
        { name: 'length', label: 'Room Length (meters)', type: 'number', defaultValue: 4, min: 1, max: 50, step: 0.1 },
        { name: 'width', label: 'Room Width (meters)', type: 'number', defaultValue: 4, min: 1, max: 50, step: 0.1 },
        { name: 'height', label: 'Wall Height (meters)', type: 'number', defaultValue: 3, min: 2, max: 10, step: 0.1 },
        { name: 'coats', label: 'Number of Coats', type: 'select', options: ['1', '2', '3'], defaultValue: '2' },
        { name: 'doors', label: 'Number of Doors', type: 'slider', defaultValue: 1, min: 0, max: 10, step: 1 },
        { name: 'windows', label: 'Number of Windows', type: 'slider', defaultValue: 2, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const height = safeFloat(inputs.height);
        const coats = safeInt(inputs.coats);
        const doors = safeInt(inputs.doors);
        const windows = safeInt(inputs.windows);
        
        // Wall area
        const wallArea = 2 * (length + width) * height;
        
        // Deductions
        const doorArea = doors * 2; // 2 sq m per door
        const windowArea = windows * 1.5; // 1.5 sq m per window
        
        const paintableArea = wallArea - doorArea - windowArea;
        const totalAreaToPaint = paintableArea * coats;
        
        // 1 liter covers 10-12 sq m (using 10 for safety)
        const painLiters = Math.ceil(totalAreaToPaint / 10);
        
        const pricePerLiter = 250; // Average paint price
        const totalCost = painLiters * pricePerLiter;
        
        const laborCost = paintableArea * 15; // ₹15 per sq m
        
        return {
          result: `${painLiters} liters`,
          explanation: `You need ${painLiters} liters of paint (${coats} coats)`,
          steps: [
            `Room: ${length}m × ${width}m × ${height}m`,
            `Wall area: ${wallArea.toFixed(2)} m²`,
            `Doors: ${doors} × 2m² = ${doorArea} m²`,
            `Windows: ${windows} × 1.5m² = ${windowArea} m²`,
            `Paintable area: ${paintableArea.toFixed(2)} m²`,
            `Number of coats: ${coats}`,
            `Total area: ${totalAreaToPaint.toFixed(2)} m²`,
            `Paint needed: ${painLiters} liters`,
            `Paint cost: ₹${totalCost.toLocaleString()}`,
            `Labor cost: ₹${laborCost.toLocaleString()}`,
            `Total: ₹${(totalCost + laborCost).toLocaleString()}`
          ],
          tips: [
            `🎨 Buy ${painLiters} + 1 liter extra for touch-ups`,
            '🖌️ Use primer for better finish (add 1 coat)',
            `💰 Material: ₹${totalCost.toLocaleString()} | Labor: ₹${laborCost.toLocaleString()}`,
            coats >= 2 ? '✅ 2-3 coats recommended for best finish' : '⚠️ Consider 2 coats for durability',
            '⏰ Allow 4-6 hours drying time between coats',
            '🌡️ Avoid painting in humid weather'
          ]
        };
      }
    };
  }

  // TILE CALCULATOR
  if (id === 'tile-calculator') {
    return {
      title: 'Tile Quantity Calculator',
      description: 'Calculate tiles needed for flooring and walls',
      presetScenarios: [
        { name: 'Bathroom', icon: '🚿', values: { length: 2.5, width: 2, tileSize: '300', wastage: 10 } },
        { name: 'Kitchen', icon: '🍳', values: { length: 4, width: 3, tileSize: '600', wastage: 8 } },
        { name: 'Living Room', icon: '🛋️', values: { length: 5, width: 4, tileSize: '600', wastage: 5 } },
      ],
      inputs: [
        { name: 'length', label: 'Floor Length (meters)', type: 'number', defaultValue: 4, min: 0.1, max: 100, step: 0.1 },
        { name: 'width', label: 'Floor Width (meters)', type: 'number', defaultValue: 3, min: 0.1, max: 100, step: 0.1 },
        { name: 'tileSize', label: 'Tile Size (mm)', type: 'select', options: ['300x300', '600x600', '800x800', '600x1200'], defaultValue: '600x600' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 8, min: 5, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const tileSize = inputs.tileSize || '600x600';
        const wastage = safeFloat(inputs.wastage);
        
        const floorArea = length * width;
        
        // Calculate tile area in sq meters
        let tileArea = 0;
        if (tileSize === '300x300') tileArea = 0.09;
        else if (tileSize === '600x600') tileArea = 0.36;
        else if (tileSize === '800x800') tileArea = 0.64;
        else tileArea = 0.72; // 600x1200
        
        const tilesNeeded = Math.ceil((floorArea / tileArea) * (1 + wastage / 100));
        const boxesNeeded = Math.ceil(tilesNeeded / 4); // 4 tiles per box (600x600)
        
        const pricePerTile = tileSize === '300x300' ? 30 : tileSize === '600x600' ? 80 : 150;
        const tileCost = tilesNeeded * pricePerTile;
        
        const adhesiveCost = floorArea * 150; // ₹150 per sq m
        const laborCost = floorArea * 200; // ₹200 per sq m
        const totalCost = tileCost + adhesiveCost + laborCost;
        
        return {
          result: `${tilesNeeded} tiles`,
          explanation: `You need ${tilesNeeded} tiles of ${tileSize} size`,
          steps: [
            `Floor: ${length}m × ${width}m = ${floorArea.toFixed(2)} m²`,
            `Tile size: ${tileSize}mm`,
            `Tile area: ${tileArea} m²`,
            `Wastage: ${wastage}%`,
            `Tiles needed: ${tilesNeeded}`,
            `Boxes: ${boxesNeeded} (approx)`,
            ``,
            `💰 Cost Breakdown:`,
            `Tiles: ₹${tileCost.toLocaleString()}`,
            `Adhesive: ₹${adhesiveCost.toLocaleString()}`,
            `Labor: ₹${laborCost.toLocaleString()}`,
            `Total: ₹${totalCost.toLocaleString()}`
          ],
          visualData: [
            { label: 'Tiles', value: tilesNeeded },
            { label: 'Boxes', value: boxesNeeded },
            { label: 'Floor (m²)', value: floorArea }
          ],
          tips: [
            `📦 Order ${boxesNeeded} boxes + 1 extra box`,
            '🔧 Use tile spacers for uniform joints',
            `💰 Total budget: ₹${totalCost.toLocaleString()}`,
            tileSize === '600x600' || tileSize === '800x800' ? '✅ Popular size, easy to install' : '📏 Smaller tiles = more grouting',
            '⏰ Installation: 1 day for small room, 2-3 days for large',
            '💧 Use waterproof adhesive for bathrooms'
          ]
        };
      }
    };
  }

  // CEMENT CALCULATOR
  if (id === 'cement-calculator') {
    return {
      title: 'Cement Calculator',
      description: 'Estimate cement bags needed for concrete, plaster, and mortar mixes',
      presetScenarios: [
        { name: 'Concrete M20 (1 m³)', icon: '🏗️', values: { workType: 'Concrete', volume: 1, concreteRatio: '1:1.5:3', wastage: 5 } },
        { name: 'Plaster (100 m²)', icon: '🎨', values: { workType: 'Plaster', area: 100, thicknessMm: 12, plasterRatio: '1:6', wastage: 7 } },
        { name: 'Mortar (0.5 m³)', icon: '🧱', values: { workType: 'Mortar', volume: 0.5, mortarRatio: '1:6', wastage: 5 } },
      ],
      inputs: [
        { name: 'workType', label: 'Work Type', type: 'select', options: ['Concrete', 'Plaster', 'Mortar'], defaultValue: 'Concrete' },
        { name: 'volume', label: 'Wet Volume (m³)', type: 'number', defaultValue: 1, min: 0, step: 0.01, helpText: 'Used for Concrete/Mortar. For plaster, use Area + Thickness.' },
        { name: 'area', label: 'Area (m²)', type: 'number', defaultValue: 100, min: 0, step: 0.1, helpText: 'Used for Plaster.' },
        { name: 'thicknessMm', label: 'Plaster Thickness (mm)', type: 'number', defaultValue: 12, min: 1, max: 50, step: 1, helpText: 'Used for Plaster.' },
        { name: 'concreteRatio', label: 'Concrete Mix Ratio', type: 'select', options: ['1:1.5:3', '1:2:4', '1:3:6'], defaultValue: '1:1.5:3' },
        { name: 'plasterRatio', label: 'Plaster Ratio (cement:sand)', type: 'select', options: ['1:4', '1:5', '1:6'], defaultValue: '1:6' },
        { name: 'mortarRatio', label: 'Mortar Ratio (cement:sand)', type: 'select', options: ['1:4', '1:5', '1:6'], defaultValue: '1:6' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const workType = inputs.workType || 'Concrete';
        const wastage = safeFloat(inputs.wastage);

        const ratioToParts = (ratio: string) => ratio.split(':').map((p) => safeFloat(p)).filter((n) => n > 0);
        const bagVolumeM3 = 0.035; // approx volume of 50kg cement bag

        let wetVolume = safeFloat(inputs.volume);
        let ratioLabel = '';
        let dryFactor = 1.0;
        let cementPart = 0;
        let totalParts = 0;

        if (workType === 'Plaster') {
          const area = safeFloat(inputs.area);
          const thicknessMm = safeFloat(inputs.thicknessMm);
          wetVolume = area * (thicknessMm / 1000);
          ratioLabel = inputs.plasterRatio || '1:6';
          const parts = ratioToParts(ratioLabel);
          dryFactor = 1.33;
          cementPart = parts[0] ?? 1;
          totalParts = parts.reduce((a, b) => a + b, 0);
        } else if (workType === 'Mortar') {
          ratioLabel = inputs.mortarRatio || '1:6';
          const parts = ratioToParts(ratioLabel);
          dryFactor = 1.33;
          cementPart = parts[0] ?? 1;
          totalParts = parts.reduce((a, b) => a + b, 0);
        } else {
          ratioLabel = inputs.concreteRatio || '1:1.5:3';
          const parts = ratioToParts(ratioLabel);
          dryFactor = 1.54;
          cementPart = parts[0] ?? 1;
          totalParts = parts.reduce((a, b) => a + b, 0);
        }

        const wetWithWastage = wetVolume * (1 + wastage / 100);
        const dryVolume = wetWithWastage * dryFactor;
        const cementVolume = totalParts > 0 ? (dryVolume * cementPart) / totalParts : 0;
        const cementBags = cementVolume / bagVolumeM3;
        const cementBagsRounded = Math.ceil(cementBags);
        const cementWeightKg = cementBags * 50;

        return {
          result: `${cementBagsRounded} bags`,
          explanation: `Estimated cement: ${cementBagsRounded} (50kg) bags for ${workType} (${ratioLabel})`,
          steps: [
            `Work type: ${workType}`,
            workType === 'Plaster'
              ? `Wet volume: Area × Thickness = ${safeFloat(inputs.area).toFixed(2)} × ${(safeFloat(inputs.thicknessMm)).toFixed(0)}mm = ${wetVolume.toFixed(3)} m³`
              : `Wet volume: ${wetVolume.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: ${dryFactor} → ${dryVolume.toFixed(3)} m³`,
            `Mix ratio: ${ratioLabel} (cement part: ${cementPart}, total parts: ${totalParts.toFixed(2)})`,
            `Cement volume: ${cementVolume.toFixed(3)} m³`,
            `Cement bags: ${cementBags.toFixed(2)} → ${cementBagsRounded} bags`,
            `Approx cement weight: ${cementWeightKg.toFixed(0)} kg`,
          ],
          tips: [
            '📦 Always buy 1 extra bag for contingencies',
            '💧 Control water-cement ratio for strength',
            '✅ Use fresh cement (avoid old/expired bags)',
            '📏 Ratios are typical site ratios; confirm with engineer/spec',
          ],
          visualData: [
            { label: 'Wet (m³)', value: wetWithWastage },
            { label: 'Dry (m³)', value: dryVolume },
            { label: 'Bags', value: cementBagsRounded },
          ],
        };
      },
    };
  }

  // SAND & AGGREGATE CALCULATOR
  if (id === 'sand-calculator') {
    return {
      title: 'Sand & Aggregate Calculator',
      description: 'Estimate sand and aggregate quantities for concrete and mortar mixes',
      presetScenarios: [
        { name: 'Concrete M20 (1 m³)', icon: '🏗️', values: { mixType: 'Concrete', volume: 1, concreteRatio: '1:1.5:3', wastage: 5 } },
        { name: 'Mortar (0.5 m³)', icon: '🧱', values: { mixType: 'Mortar', volume: 0.5, mortarRatio: '1:6', wastage: 5 } },
      ],
      inputs: [
        { name: 'mixType', label: 'Mix Type', type: 'select', options: ['Concrete', 'Mortar'], defaultValue: 'Concrete' },
        { name: 'volume', label: 'Wet Volume (m³)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'concreteRatio', label: 'Concrete Mix Ratio', type: 'select', options: ['1:1.5:3', '1:2:4', '1:3:6'], defaultValue: '1:1.5:3' },
        { name: 'mortarRatio', label: 'Mortar Ratio (cement:sand)', type: 'select', options: ['1:4', '1:5', '1:6'], defaultValue: '1:6' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const mixType = inputs.mixType || 'Concrete';
        const wetVolume = safeFloat(inputs.volume);
        const wastage = safeFloat(inputs.wastage);
        const ratioToParts = (ratio: string) => ratio.split(':').map((p) => safeFloat(p)).filter((n) => n > 0);

        const wetWithWastage = wetVolume * (1 + wastage / 100);
        const dryFactor = mixType === 'Concrete' ? 1.54 : 1.33;
        const dryVolume = wetWithWastage * dryFactor;

        let sandVolume = 0;
        let aggregateVolume = 0;
        let ratioLabel = '';
        if (mixType === 'Mortar') {
          ratioLabel = inputs.mortarRatio || '1:6';
          const parts = ratioToParts(ratioLabel);
          const cementPart = parts[0] ?? 1;
          const sandPart = parts[1] ?? 6;
          const totalParts = cementPart + sandPart;
          sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
        } else {
          ratioLabel = inputs.concreteRatio || '1:1.5:3';
          const parts = ratioToParts(ratioLabel);
          const cementPart = parts[0] ?? 1;
          const sandPart = parts[1] ?? 1.5;
          const aggPart = parts[2] ?? 3;
          const totalParts = cementPart + sandPart + aggPart;
          sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
          aggregateVolume = totalParts > 0 ? (dryVolume * aggPart) / totalParts : 0;
        }

        return {
          result:
            mixType === 'Concrete'
              ? `Sand: ${sandVolume.toFixed(2)} m³ | Aggregate: ${aggregateVolume.toFixed(2)} m³`
              : `Sand: ${sandVolume.toFixed(2)} m³`,
          explanation: `${mixType} mix (${ratioLabel}) material estimate`,
          steps: [
            `Wet volume: ${wetVolume.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: ${dryFactor} → ${dryVolume.toFixed(3)} m³`,
            `Mix ratio: ${ratioLabel}`,
            `Sand required: ${sandVolume.toFixed(2)} m³`,
            ...(mixType === 'Concrete' ? [`Aggregate required: ${aggregateVolume.toFixed(2)} m³`] : []),
          ],
          tips: [
            '📦 Add extra for site spillage and bulking',
            '✅ Use clean river sand / approved sand',
            mixType === 'Concrete' ? '🪨 Choose aggregate size per design (10mm/20mm)' : '🧱 Use correct mortar ratio for bonding strength',
          ],
          visualData: [
            { label: 'Sand (m³)', value: sandVolume },
            ...(mixType === 'Concrete' ? [{ label: 'Aggregate (m³)', value: aggregateVolume }] : []),
          ],
        };
      },
    };
  }

  // MORTAR MIX CALCULATOR
  if (id === 'mortar-calculator') {
    return {
      title: 'Mortar Mix Calculator',
      description: 'Calculate cement and sand needed for brickwork mortar',
      presetScenarios: [
        { name: 'Brickwork (0.5 m³)', icon: '🧱', values: { wetMortar: 0.5, ratio: '1:6', wastage: 5 } },
        { name: 'Plaster Base (0.25 m³)', icon: '🎨', values: { wetMortar: 0.25, ratio: '1:5', wastage: 7 } },
      ],
      inputs: [
        { name: 'wetMortar', label: 'Wet Mortar Volume (m³)', type: 'number', defaultValue: 0.5, min: 0, step: 0.01 },
        { name: 'ratio', label: 'Mortar Ratio (cement:sand)', type: 'select', options: ['1:4', '1:5', '1:6'], defaultValue: '1:6' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const wetMortar = safeFloat(inputs.wetMortar);
        const ratioLabel = inputs.ratio || '1:6';
        const wastage = safeFloat(inputs.wastage);
        const bagVolumeM3 = 0.035;

        const parts = ratioLabel.split(':').map((p: string) => safeFloat(p)).filter((n: number) => n > 0);
        const cementPart = parts[0] ?? 1;
        const sandPart = parts[1] ?? 6;
        const totalParts = cementPart + sandPart;

        const wetWithWastage = wetMortar * (1 + wastage / 100);
        const dryVolume = wetWithWastage * 1.33;

        const cementVolume = totalParts > 0 ? (dryVolume * cementPart) / totalParts : 0;
        const sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
        const cementBags = cementVolume / bagVolumeM3;
        const cementBagsRounded = Math.ceil(cementBags);

        return {
          result: `Cement: ${cementBagsRounded} bags | Sand: ${sandVolume.toFixed(2)} m³`,
          explanation: `Mortar materials for ${wetWithWastage.toFixed(2)} m³ (wet) at ratio ${ratioLabel}`,
          steps: [
            `Wet mortar: ${wetMortar.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: 1.33 → ${dryVolume.toFixed(3)} m³`,
            `Ratio: ${ratioLabel} (total parts: ${totalParts})`,
            `Cement bags: ${cementBags.toFixed(2)} → ${cementBagsRounded}`,
            `Sand: ${sandVolume.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Bags', value: cementBagsRounded },
            { label: 'Sand (m³)', value: sandVolume },
          ],
          tips: [
            '💧 Mix with clean water; avoid over-watering',
            '✅ Use suitable ratio: 1:6 common for brickwork',
            '📦 Buy extra sand for bulking and site losses',
          ],
        };
      },
    };
  }

  // PLASTER CALCULATOR
  if (id === 'plaster-calculator') {
    return {
      title: 'Plaster Calculator',
      description: 'Estimate plaster material for walls and ceilings (cement + sand)',
      presetScenarios: [
        { name: 'Internal (100 m², 12mm)', icon: '🏠', values: { area: 100, thicknessMm: 12, ratio: '1:6', wastage: 7 } },
        { name: 'External (100 m², 15mm)', icon: '🏢', values: { area: 100, thicknessMm: 15, ratio: '1:4', wastage: 10 } },
      ],
      inputs: [
        { name: 'area', label: 'Plaster Area (m²)', type: 'number', defaultValue: 100, min: 0, step: 0.1 },
        { name: 'thicknessMm', label: 'Thickness (mm)', type: 'number', defaultValue: 12, min: 1, max: 50, step: 1 },
        { name: 'ratio', label: 'Plaster Ratio (cement:sand)', type: 'select', options: ['1:4', '1:5', '1:6'], defaultValue: '1:6' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 7, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const thicknessMm = safeFloat(inputs.thicknessMm);
        const ratioLabel = inputs.ratio || '1:6';
        const wastage = safeFloat(inputs.wastage);
        const bagVolumeM3 = 0.035;

        const wetVolume = area * (thicknessMm / 1000);
        const wetWithWastage = wetVolume * (1 + wastage / 100);
        const dryVolume = wetWithWastage * 1.33;

        const parts = ratioLabel.split(':').map((p: string) => safeFloat(p)).filter((n: number) => n > 0);
        const cementPart = parts[0] ?? 1;
        const sandPart = parts[1] ?? 6;
        const totalParts = cementPart + sandPart;

        const cementVolume = totalParts > 0 ? (dryVolume * cementPart) / totalParts : 0;
        const sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
        const cementBags = cementVolume / bagVolumeM3;
        const cementBagsRounded = Math.ceil(cementBags);

        return {
          result: `Cement: ${cementBagsRounded} bags | Sand: ${sandVolume.toFixed(2)} m³`,
          explanation: `Plaster volume: ${wetWithWastage.toFixed(2)} m³ (wet) at ${ratioLabel}`,
          steps: [
            `Area: ${area.toFixed(2)} m²`,
            `Thickness: ${thicknessMm.toFixed(0)} mm`,
            `Wet volume: ${wetVolume.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: 1.33 → ${dryVolume.toFixed(3)} m³`,
            `Cement bags: ${cementBags.toFixed(2)} → ${cementBagsRounded}`,
            `Sand: ${sandVolume.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Bags', value: cementBagsRounded },
            { label: 'Sand (m³)', value: sandVolume },
            { label: 'Area (m²)', value: area },
          ],
          tips: [
            '💧 Cure plaster properly to avoid cracks',
            '✅ External plaster typically uses richer mix (1:4)',
            '📏 Add corner beads / mesh at joints for durability',
          ],
        };
      },
    };
  }

  // STEEL WEIGHT CALCULATOR
  if (id === 'steel-weight-calculator') {
    return {
      title: 'Steel Weight Calculator',
      description: 'Calculate weight of steel bars (rebar) by diameter, length, and quantity',
      presetScenarios: [
        { name: '8mm bars (10 pcs × 12m)', icon: '🧱', values: { diameterMm: 8, lengthM: 12, quantity: 10 } },
        { name: '12mm bars (20 pcs × 12m)', icon: '🏗️', values: { diameterMm: 12, lengthM: 12, quantity: 20 } },
      ],
      inputs: [
        { name: 'diameterMm', label: 'Bar Diameter (mm)', type: 'number', defaultValue: 12, min: 4, max: 40, step: 1 },
        { name: 'lengthM', label: 'Length per Bar (m)', type: 'number', defaultValue: 12, min: 0, max: 50, step: 0.1 },
        { name: 'quantity', label: 'Quantity (bars)', type: 'slider', defaultValue: 10, min: 1, max: 500, step: 1 },
        { name: 'ratePerKg', label: 'Rate (₹/kg)', type: 'number', defaultValue: 65, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.diameterMm);
        const length = safeFloat(inputs.lengthM);
        const qty = safeFloat(inputs.quantity);
        const rate = safeFloat(inputs.ratePerKg);

        // Common site formula (India): weight (kg/m) = d^2 / 162, where d in mm
        const kgPerM = (d * d) / 162;
        const weightPerBar = kgPerM * length;
        const totalWeight = weightPerBar * qty;
        const totalCost = totalWeight * rate;

        return {
          result: `${totalWeight.toFixed(2)} kg`,
          explanation: `Total steel weight for ${qty} bars: ${totalWeight.toFixed(2)} kg`,
          steps: [
            `Diameter: ${d} mm`,
            `Weight per meter: d²/162 = ${(d * d).toFixed(0)}/162 = ${kgPerM.toFixed(3)} kg/m`,
            `Length per bar: ${length.toFixed(2)} m`,
            `Weight per bar: ${weightPerBar.toFixed(2)} kg`,
            `Quantity: ${qty}`,
            `Total weight: ${totalWeight.toFixed(2)} kg`,
            `Estimated cost: ₹${totalCost.toLocaleString()}`,
          ],
          visualData: [
            { label: 'Per bar (kg)', value: weightPerBar },
            { label: 'Total (kg)', value: totalWeight },
          ],
          tips: [
            '✅ Add lap length and wastage for cutting bends',
            '📏 Standard market length is often 12m',
            '🧾 Verify TMT grade (Fe500/Fe550) per design',
          ],
        };
      },
    };
  }

  // CONCRETE BLOCK CALCULATOR
  if (id === 'block-calculator') {
    return {
      title: 'Concrete Block Calculator',
      description: 'Calculate number of AAC/concrete blocks required for wall construction',
      presetScenarios: [
        { name: 'AAC Wall (10m × 3m)', icon: '🧱', values: { length: 10, height: 3, blockSize: '600x200', wastage: 5 } },
        { name: 'Partition (5m × 3m)', icon: '🏠', values: { length: 5, height: 3, blockSize: '600x200', wastage: 7 } },
      ],
      inputs: [
        { name: 'length', label: 'Wall Length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'height', label: 'Wall Height (m)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'blockSize', label: 'Block Face Size (mm)', type: 'select', options: ['600x200', '400x200', '600x250'], defaultValue: '600x200' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const length = safeFloat(inputs.length);
        const height = safeFloat(inputs.height);
        const blockSize = inputs.blockSize || '600x200';
        const wastage = safeFloat(inputs.wastage);

        const wallArea = length * height;
        let blockArea = 0.12; // 600x200
        if (blockSize === '400x200') blockArea = 0.08;
        else if (blockSize === '600x250') blockArea = 0.15;

        const blocks = Math.ceil((wallArea / blockArea) * (1 + wastage / 100));

        // Thin-joint mortar (AAC) rough estimate: 3-5 kg per m²
        const mortarKg = wallArea * 4;
        const mortarBags20Kg = Math.ceil(mortarKg / 20);

        return {
          result: `${blocks} blocks`,
          explanation: `Estimated blocks for ${wallArea.toFixed(2)} m² wall using ${blockSize} blocks`,
          steps: [
            `Wall area: ${length.toFixed(2)} × ${height.toFixed(2)} = ${wallArea.toFixed(2)} m²`,
            `Block face area: ${blockArea.toFixed(3)} m²`,
            `Wastage: ${wastage}%`,
            `Blocks needed: ${blocks}`,
            `AAC mortar: ~${mortarKg.toFixed(0)} kg (~${mortarBags20Kg} bags of 20kg)`,
          ],
          visualData: [
            { label: 'Blocks', value: blocks },
            { label: 'Wall (m²)', value: wallArea },
          ],
          tips: [
            '📦 Order a few extra blocks for cutting',
            '✅ Use thin-joint mortar for AAC blocks',
            '📏 Check block size tolerance and vertical alignment',
          ],
        };
      },
    };
  }

  // RCC MIX RATIO CALCULATOR
  if (id === 'rcc-calculator') {
    return {
      title: 'RCC Mix Ratio Calculator',
      description: 'Estimate cement, sand and aggregate for RCC concrete mix',
      presetScenarios: [
        { name: 'M20 (1 m³)', icon: '🏗️', values: { grade: 'M20', volume: 1, wastage: 5 } },
        { name: 'M25 (1 m³)', icon: '🏢', values: { grade: 'M25', volume: 1, wastage: 5 } },
      ],
      inputs: [
        { name: 'grade', label: 'Concrete Grade', type: 'select', options: ['M15', 'M20', 'M25'], defaultValue: 'M20' },
        { name: 'volume', label: 'Wet Concrete Volume (m³)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const grade = inputs.grade || 'M20';
        const volume = safeFloat(inputs.volume);
        const wastage = safeFloat(inputs.wastage);

        // Typical nominal mixes (for estimation only)
        let ratioLabel = '1:1.5:3';
        if (grade === 'M15') ratioLabel = '1:2:4';
        if (grade === 'M25') ratioLabel = '1:1:2';

        const parts = ratioLabel.split(':').map((p: string) => safeFloat(p)).filter((n: number) => n > 0);
        const cementPart = parts[0] ?? 1;
        const sandPart = parts[1] ?? 1.5;
        const aggPart = parts[2] ?? 3;
        const totalParts = cementPart + sandPart + aggPart;

        const wetWithWastage = volume * (1 + wastage / 100);
        const dryVolume = wetWithWastage * 1.54;

        const cementVolume = totalParts > 0 ? (dryVolume * cementPart) / totalParts : 0;
        const sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
        const aggregateVolume = totalParts > 0 ? (dryVolume * aggPart) / totalParts : 0;
        const cementBags = cementVolume / 0.035;
        const cementBagsRounded = Math.ceil(cementBags);

        return {
          result: `Cement: ${cementBagsRounded} bags | Sand: ${sandVolume.toFixed(2)} m³ | Aggregate: ${aggregateVolume.toFixed(2)} m³`,
          explanation: `${grade} RCC estimate for ${wetWithWastage.toFixed(2)} m³ (wet) using ratio ${ratioLabel}`,
          steps: [
            `Grade: ${grade}`,
            `Wet volume: ${volume.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: 1.54 → ${dryVolume.toFixed(3)} m³`,
            `Mix ratio: ${ratioLabel}`,
            `Cement bags: ${cementBags.toFixed(2)} → ${cementBagsRounded}`,
            `Sand: ${sandVolume.toFixed(2)} m³`,
            `Aggregate: ${aggregateVolume.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Bags', value: cementBagsRounded },
            { label: 'Sand (m³)', value: sandVolume },
            { label: 'Agg (m³)', value: aggregateVolume },
          ],
          tips: [
            '✅ Nominal mix is an estimate; follow design mix if specified',
            '💧 Maintain correct slump and curing',
            '🪨 Aggregate grading affects strength and workability',
          ],
        };
      },
    };
  }

  // PCC MIX CALCULATOR
  if (id === 'pcc-calculator') {
    return {
      title: 'PCC Mix Calculator',
      description: 'Estimate cement, sand and aggregate for PCC (plain cement concrete)',
      presetScenarios: [
        { name: 'Levelling (1 m³)', icon: '📏', values: { ratio: '1:4:8', volume: 1, wastage: 5 } },
      ],
      inputs: [
        { name: 'ratio', label: 'PCC Ratio', type: 'select', options: ['1:3:6', '1:4:8'], defaultValue: '1:4:8' },
        { name: 'volume', label: 'Wet PCC Volume (m³)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 15, step: 1 },
      ],
      calculate: (inputs) => {
        const ratioLabel = inputs.ratio || '1:4:8';
        const volume = safeFloat(inputs.volume);
        const wastage = safeFloat(inputs.wastage);

        const parts = ratioLabel.split(':').map((p: string) => safeFloat(p)).filter((n: number) => n > 0);
        const cementPart = parts[0] ?? 1;
        const sandPart = parts[1] ?? 4;
        const aggPart = parts[2] ?? 8;
        const totalParts = cementPart + sandPart + aggPart;

        const wetWithWastage = volume * (1 + wastage / 100);
        const dryVolume = wetWithWastage * 1.54;

        const cementVolume = totalParts > 0 ? (dryVolume * cementPart) / totalParts : 0;
        const sandVolume = totalParts > 0 ? (dryVolume * sandPart) / totalParts : 0;
        const aggregateVolume = totalParts > 0 ? (dryVolume * aggPart) / totalParts : 0;
        const cementBags = cementVolume / 0.035;
        const cementBagsRounded = Math.ceil(cementBags);

        return {
          result: `Cement: ${cementBagsRounded} bags | Sand: ${sandVolume.toFixed(2)} m³ | Aggregate: ${aggregateVolume.toFixed(2)} m³`,
          explanation: `PCC estimate for ${wetWithWastage.toFixed(2)} m³ using ratio ${ratioLabel}`,
          steps: [
            `Wet volume: ${volume.toFixed(3)} m³`,
            `Wastage: ${wastage}% → ${wetWithWastage.toFixed(3)} m³`,
            `Dry volume factor: 1.54 → ${dryVolume.toFixed(3)} m³`,
            `Mix ratio: ${ratioLabel}`,
            `Cement bags: ${cementBags.toFixed(2)} → ${cementBagsRounded}`,
            `Sand: ${sandVolume.toFixed(2)} m³`,
            `Aggregate: ${aggregateVolume.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Bags', value: cementBagsRounded },
            { label: 'Sand (m³)', value: sandVolume },
            { label: 'Agg (m³)', value: aggregateVolume },
          ],
          tips: [
            '✅ PCC is typically used as levelling course under footings',
            '📏 Ensure proper compaction and curing',
          ],
        };
      },
    };
  }

  // AREA CALCULATOR
  if (id === 'area-calculator') {
    return {
      title: 'Area Calculator',
      description: 'Calculate area for common shapes used in construction',
      presetScenarios: [
        { name: 'Rectangle (10m × 5m)', icon: '⬛', values: { shape: 'Rectangle', length: 10, width: 5 } },
        { name: 'Circle (r=3m)', icon: '⚪', values: { shape: 'Circle', radius: 3 } },
        { name: 'Triangle (b=8m, h=4m)', icon: '🔺', values: { shape: 'Triangle', base: 8, height: 4 } },
      ],
      inputs: [
        { name: 'shape', label: 'Shape', type: 'select', options: ['Rectangle', 'Circle', 'Triangle'], defaultValue: 'Rectangle' },
        { name: 'length', label: 'Length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'width', label: 'Width (m)', type: 'number', defaultValue: 5, min: 0, step: 0.1 },
        { name: 'radius', label: 'Radius (m)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'base', label: 'Base (m)', type: 'number', defaultValue: 8, min: 0, step: 0.1 },
        { name: 'height', label: 'Height (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Rectangle';
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const radius = safeFloat(inputs.radius);
        const base = safeFloat(inputs.base);
        const height = safeFloat(inputs.height);

        let area = 0;
        let formula = '';
        if (shape === 'Circle') {
          area = Math.PI * radius * radius;
          formula = 'A = πr²';
        } else if (shape === 'Triangle') {
          area = 0.5 * base * height;
          formula = 'A = ½ × base × height';
        } else {
          area = length * width;
          formula = 'A = length × width';
        }

        return {
          result: `${area.toFixed(2)} m²`,
          explanation: `${shape} area: ${area.toFixed(2)} square meters`,
          formula,
          steps: [
            `Shape: ${shape}`,
            ...(shape === 'Rectangle'
              ? [`Area = ${length.toFixed(2)} × ${width.toFixed(2)} = ${area.toFixed(2)} m²`]
              : shape === 'Circle'
                ? [`Area = π × ${radius.toFixed(2)}² = ${area.toFixed(2)} m²`]
                : [`Area = ½ × ${base.toFixed(2)} × ${height.toFixed(2)} = ${area.toFixed(2)} m²`]),
          ],
          visualData: [{ label: 'Area (m²)', value: area }],
          tips: [
            '📏 Double-check units (meters) before calculation',
            '✅ Add wastage if calculating material coverage',
          ],
        };
      },
    };
  }

  // VOLUME CALCULATOR
  if (id === 'volume-calculator') {
    return {
      title: 'Volume Calculator',
      description: 'Calculate volume for common shapes used in construction',
      presetScenarios: [
        { name: 'Cuboid (4×3×0.15)', icon: '📦', values: { shape: 'Cuboid', length: 4, width: 3, height: 0.15 } },
        { name: 'Cylinder (r=1m, h=2m)', icon: '🛢️', values: { shape: 'Cylinder', radius: 1, height: 2 } },
        { name: 'Sphere (r=1m)', icon: '⚪', values: { shape: 'Sphere', radius: 1 } },
      ],
      inputs: [
        { name: 'shape', label: 'Shape', type: 'select', options: ['Cuboid', 'Cylinder', 'Sphere'], defaultValue: 'Cuboid' },
        { name: 'length', label: 'Length (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'width', label: 'Width (m)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'height', label: 'Height (m)', type: 'number', defaultValue: 0.15, min: 0, step: 0.01 },
        { name: 'radius', label: 'Radius (m)', type: 'number', defaultValue: 1, min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Cuboid';
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const height = safeFloat(inputs.height);
        const radius = safeFloat(inputs.radius);

        let volume = 0;
        let formula = '';
        if (shape === 'Cylinder') {
          volume = Math.PI * radius * radius * height;
          formula = 'V = πr²h';
        } else if (shape === 'Sphere') {
          volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
          formula = 'V = 4/3 πr³';
        } else {
          volume = length * width * height;
          formula = 'V = length × width × height';
        }

        return {
          result: `${volume.toFixed(3)} m³`,
          explanation: `${shape} volume: ${volume.toFixed(3)} cubic meters`,
          formula,
          steps: [
            `Shape: ${shape}`,
            ...(shape === 'Cuboid'
              ? [`Volume = ${length.toFixed(2)} × ${width.toFixed(2)} × ${height.toFixed(3)} = ${volume.toFixed(3)} m³`]
              : shape === 'Cylinder'
                ? [`Volume = π × ${radius.toFixed(2)}² × ${height.toFixed(2)} = ${volume.toFixed(3)} m³`]
                : [`Volume = 4/3 × π × ${radius.toFixed(2)}³ = ${volume.toFixed(3)} m³`]),
          ],
          visualData: [{ label: 'Volume (m³)', value: volume }],
          tips: [
            '🏗️ For concrete quantity, consider wastage 3–7%',
            '📏 Keep all inputs in meters for correct results',
          ],
        };
      },
    };
  }

  // STRUCTURAL LOAD CALCULATOR
  if (id === 'load-calculator') {
    return {
      title: 'Structural Load Calculator',
      description: 'Estimate dead load, live load, and total gravity load for a floor/roof area',
      presetScenarios: [
        { name: 'Residential floor', icon: '🏠', values: { area: 50, deadLoad: 4.0, liveLoad: 2.0, additionalLoad: 0.5, factor: 1.0 } },
        { name: 'Office floor', icon: '🏢', values: { area: 100, deadLoad: 4.5, liveLoad: 3.0, additionalLoad: 0.5, factor: 1.0 } },
      ],
      inputs: [
        { name: 'area', label: 'Loaded Area (m²)', type: 'number', defaultValue: 50, min: 0, step: 0.1 },
        { name: 'deadLoad', label: 'Dead Load (kN/m²)', type: 'number', defaultValue: 4.0, min: 0, step: 0.1, helpText: 'Self-weight of slab, finishes, walls (typical: 3–6 kN/m²)' },
        { name: 'liveLoad', label: 'Live Load (kN/m²)', type: 'number', defaultValue: 2.0, min: 0, step: 0.1, helpText: 'Imposed load from occupancy (typical: 1.5–5 kN/m²)' },
        { name: 'additionalLoad', label: 'Additional Load (kN/m²)', type: 'number', defaultValue: 0.5, min: 0, step: 0.1, helpText: 'Partitions/services/allowance (optional)' },
        { name: 'factor', label: 'Load Factor (multiplier)', type: 'number', defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.05, helpText: 'Use 1.0 for service, or higher for factored checks' },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.area);
        const dead = safeFloat(inputs.deadLoad);
        const live = safeFloat(inputs.liveLoad);
        const add = safeFloat(inputs.additionalLoad);
        const factor = safeFloat(inputs.factor) || 1;

        const totalUDL = dead + live + add;
        const serviceLoad = totalUDL * area;
        const factoredLoad = serviceLoad * factor;

        return {
          result: `${factoredLoad.toFixed(1)} kN`,
          explanation: `Total gravity load on ${area.toFixed(2)} m² = ${(totalUDL).toFixed(2)} kN/m² × area (× factor)`,
          steps: [
            `Area: ${area.toFixed(2)} m²`,
            `Dead: ${dead.toFixed(2)} kN/m²`,
            `Live: ${live.toFixed(2)} kN/m²`,
            `Additional: ${add.toFixed(2)} kN/m²`,
            `Total UDL: ${totalUDL.toFixed(2)} kN/m²`,
            `Service load: ${totalUDL.toFixed(2)} × ${area.toFixed(2)} = ${serviceLoad.toFixed(1)} kN`,
            `Factor: × ${factor.toFixed(2)} → ${factoredLoad.toFixed(1)} kN`,
          ],
          visualData: [
            { label: 'Dead (kN/m²)', value: dead },
            { label: 'Live (kN/m²)', value: live },
            { label: 'Additional (kN/m²)', value: add },
          ],
          tips: [
            '✅ Use code-specified live loads for your occupancy',
            '📌 Dead load depends on slab thickness + finishes + wall layout',
            '🧾 For design, consult a structural engineer and local code',
          ],
        };
      },
    };
  }

  // WIND LOAD CALCULATOR
  if (id === 'wind-load-calculator') {
    return {
      title: 'Wind Load Calculator',
      description: 'Estimate wind pressure and wind force on a facade/roof area (basic approximation)',
      presetScenarios: [
        { name: 'Low wind (V=30 m/s)', icon: '🌬️', values: { windSpeed: 30, area: 50, kz: 1.0, cp: 1.0 } },
        { name: 'High wind (V=45 m/s)', icon: '🌪️', values: { windSpeed: 45, area: 80, kz: 1.2, cp: 1.3 } },
      ],
      inputs: [
        { name: 'windSpeed', label: 'Wind Speed V (m/s)', type: 'number', defaultValue: 30, min: 0, step: 1, helpText: 'Basic/peak wind speed based on your location/code' },
        { name: 'area', label: 'Exposed Area (m²)', type: 'number', defaultValue: 50, min: 0, step: 0.1 },
        { name: 'kz', label: 'Exposure/Height Factor Kz', type: 'number', defaultValue: 1.0, min: 0.5, max: 2.0, step: 0.05 },
        { name: 'cp', label: 'Pressure Coefficient Cp', type: 'number', defaultValue: 1.0, min: 0.1, max: 2.0, step: 0.05 },
      ],
      calculate: (inputs) => {
        const v = safeFloat(inputs.windSpeed);
        const area = safeFloat(inputs.area);
        const kz = safeFloat(inputs.kz) || 1;
        const cp = safeFloat(inputs.cp) || 1;

        // Common simplified dynamic pressure: p = 0.6 * V^2 (N/m²)
        const pNPerM2 = 0.6 * v * v;
        const pKNPerM2 = pNPerM2 / 1000;
        const designPressure = pKNPerM2 * kz * cp;
        const force = designPressure * area;

        return {
          result: `${force.toFixed(1)} kN`,
          explanation: `Wind force ≈ pressure × area = ${designPressure.toFixed(3)} kN/m² × ${area.toFixed(2)} m²`,
          steps: [
            `V = ${v.toFixed(1)} m/s`,
            `Basic pressure p = 0.6 V² = 0.6 × ${v.toFixed(1)}² = ${pNPerM2.toFixed(0)} N/m²`,
            `p = ${(pKNPerM2).toFixed(3)} kN/m²`,
            `Kz = ${kz.toFixed(2)}, Cp = ${cp.toFixed(2)}`,
            `Design pressure = p × Kz × Cp = ${designPressure.toFixed(3)} kN/m²`,
            `Force = ${designPressure.toFixed(3)} × ${area.toFixed(2)} = ${force.toFixed(1)} kN`,
          ],
          visualData: [
            { label: 'Pressure (kN/m²)', value: designPressure },
            { label: 'Force (kN)', value: force },
          ],
          tips: [
            '⚠️ Wind design is code-specific (terrain, height, topography, internal pressure)',
            '✅ Use local code wind speed and coefficients for accurate design',
          ],
        };
      },
    };
  }

  // BEAM DEFLECTION CALCULATOR (simple cases)
  if (id === 'beam-calculator') {
    return {
      title: 'Beam Deflection Calculator',
      description: 'Simply supported beam with UDL or midspan point load (basic)',
      presetScenarios: [
        { name: 'UDL on 4m', icon: '📏', values: { spanM: 4, loadCase: 'UDL', udlKnPerM: 10, pointLoadKn: 0, bMm: 230, dMm: 450, eGpa: 25 } },
        { name: 'Point load on 3m', icon: '🏗️', values: { spanM: 3, loadCase: 'Point (midspan)', udlKnPerM: 0, pointLoadKn: 20, bMm: 230, dMm: 450, eGpa: 25 } },
      ],
      inputs: [
        { name: 'spanM', label: 'Span L (m)', type: 'number', defaultValue: 4, min: 0.1, max: 50, step: 0.1 },
        { name: 'loadCase', label: 'Load Case', type: 'select', options: ['UDL', 'Point (midspan)'], defaultValue: 'UDL' },
        { name: 'udlKnPerM', label: 'UDL w (kN/m)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'pointLoadKn', label: 'Point Load P (kN)', type: 'number', defaultValue: 20, min: 0, step: 0.1 },
        { name: 'bMm', label: 'Section Width b (mm)', type: 'number', defaultValue: 230, min: 50, max: 2000, step: 1 },
        { name: 'dMm', label: 'Section Depth d (mm)', type: 'number', defaultValue: 450, min: 50, max: 3000, step: 1 },
        { name: 'eGpa', label: 'Elastic Modulus E (GPa)', type: 'number', defaultValue: 25, min: 1, max: 300, step: 1, helpText: 'Concrete ~ 20–30, Steel ~ 200' },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.spanM);
        const loadCase = inputs.loadCase || 'UDL';
        const w = safeFloat(inputs.udlKnPerM);
        const P = safeFloat(inputs.pointLoadKn);
        const b = safeFloat(inputs.bMm);
        const d = safeFloat(inputs.dMm);
        const E = safeFloat(inputs.eGpa) * 1e9; // Pa

        // Second moment of area for rectangle: I = b d^3 / 12
        const I_mm4 = (b * Math.pow(d, 3)) / 12;
        const I_m4 = I_mm4 * 1e-12;

        let Mmax_kNm = 0;
        let Vmax_kN = 0;
        let delta_mm = 0;
        let formula = '';

        if (loadCase === 'Point (midspan)') {
          Mmax_kNm = (P * L) / 4;
          Vmax_kN = P / 2;
          // δ = P L^3 / (48 E I)
          const delta_m = (P * 1000 * Math.pow(L, 3)) / (48 * E * I_m4);
          delta_mm = delta_m * 1000;
          formula = 'Mmax = PL/4, Vmax = P/2, δ = PL³/(48EI)';
        } else {
          Mmax_kNm = (w * Math.pow(L, 2)) / 8;
          Vmax_kN = (w * L) / 2;
          // δ = 5 w L^4 / (384 E I)
          const delta_m = (5 * (w * 1000) * Math.pow(L, 4)) / (384 * E * I_m4);
          delta_mm = delta_m * 1000;
          formula = 'Mmax = wL²/8, Vmax = wL/2, δ = 5wL⁴/(384EI)';
        }

        return {
          result: `Mmax: ${Mmax_kNm.toFixed(2)} kN·m`,
          explanation: `Max moment and shear for a simply supported beam (${loadCase})`,
          formula,
          steps: [
            `Span L: ${L.toFixed(2)} m`,
            `Section: b=${b.toFixed(0)} mm, d=${d.toFixed(0)} mm`,
            `I = b d³/12 = ${I_mm4.toExponential(3)} mm⁴`,
            `E = ${(safeFloat(inputs.eGpa)).toFixed(0)} GPa`,
            loadCase === 'Point (midspan)'
              ? `P = ${P.toFixed(2)} kN`
              : `w = ${w.toFixed(2)} kN/m`,
            `Vmax ≈ ${Vmax_kN.toFixed(2)} kN`,
            `Mmax ≈ ${Mmax_kNm.toFixed(2)} kN·m`,
            `Midspan deflection δ ≈ ${delta_mm.toFixed(2)} mm`,
          ],
          visualData: [
            { label: 'Shear (kN)', value: Vmax_kN },
            { label: 'Moment (kN·m)', value: Mmax_kNm },
          ],
          tips: [
            '⚠️ This is a simplified elastic estimate (service-level)',
            '✅ For RC design, cracking and reinforcement affect deflection',
            '🧾 Use local code checks for strength and serviceability',
          ],
        };
      },
    };
  }

  // COLUMN DESIGN CALCULATOR (RCC short column, basic)
  if (id === 'column-calculator') {
    return {
      title: 'Column Design Calculator',
      description: 'Estimate axial capacity of a short RCC column (approximate)',
      presetScenarios: [
        { name: '230×450, M25, 1%', icon: '🏢', values: { bMm: 230, dMm: 450, fck: 25, fy: 500, steelPercent: 1.0 } },
        { name: '300×300, M20, 1.5%', icon: '🏗️', values: { bMm: 300, dMm: 300, fck: 20, fy: 500, steelPercent: 1.5 } },
      ],
      inputs: [
        { name: 'bMm', label: 'Width b (mm)', type: 'number', defaultValue: 300, min: 100, max: 2000, step: 1 },
        { name: 'dMm', label: 'Depth D (mm)', type: 'number', defaultValue: 300, min: 100, max: 2000, step: 1 },
        { name: 'fck', label: 'Concrete grade fck (MPa)', type: 'number', defaultValue: 25, min: 10, max: 80, step: 1 },
        { name: 'fy', label: 'Steel grade fy (MPa)', type: 'number', defaultValue: 500, min: 250, max: 600, step: 10 },
        { name: 'steelPercent', label: 'Steel % (of gross area)', type: 'number', defaultValue: 1.0, min: 0, max: 6, step: 0.1 },
      ],
      calculate: (inputs) => {
        const b = safeFloat(inputs.bMm);
        const D = safeFloat(inputs.dMm);
        const fck = safeFloat(inputs.fck);
        const fy = safeFloat(inputs.fy);
        const p = safeFloat(inputs.steelPercent);

        const Ag = b * D; // mm²
        const Asc = Ag * (p / 100);
        const Ac = Math.max(Ag - Asc, 0);

        // Approx ultimate axial capacity (commonly used form): Pu ≈ 0.4 fck Ac + 0.67 fy Asc (N)
        const Pu_N = 0.4 * fck * Ac + 0.67 * fy * Asc;
        const Pu_kN = Pu_N / 1000;

        return {
          result: `${Pu_kN.toFixed(0)} kN`,
          explanation: `Approx ultimate axial capacity for short RCC column section`,
          formula: 'Pu ≈ 0.4 fck·Ac + 0.67 fy·Asc',
          steps: [
            `Section: ${b.toFixed(0)} × ${D.toFixed(0)} mm`,
            `Ag = ${Ag.toLocaleString()} mm²`,
            `Steel % = ${p.toFixed(2)}% → Asc = ${Asc.toFixed(0)} mm²`,
            `Ac = Ag − Asc = ${Ac.toFixed(0)} mm²`,
            `Pu = 0.4×${fck}×${Ac.toFixed(0)} + 0.67×${fy}×${Asc.toFixed(0)} = ${(Pu_N).toExponential(3)} N`,
            `Pu ≈ ${Pu_kN.toFixed(0)} kN`,
          ],
          tips: [
            '⚠️ This is an approximation; slenderness, eccentricity and detailing matter',
            '✅ Use proper design per local code and engineer approval',
          ],
        };
      },
    };
  }

  // FOOTING DESIGN CALCULATOR (sizing from SBC, basic)
  if (id === 'footing-calculator') {
    return {
      title: 'Footing Design Calculator',
      description: 'Estimate footing plan size from service load and soil bearing capacity (basic)',
      presetScenarios: [
        { name: 'Square footing', icon: '⬛', values: { serviceLoadKn: 800, sbc: 150, shape: 'Square', ratio: 1.0, addPercent: 10 } },
        { name: 'Rect footing (L/B=1.5)', icon: '▭', values: { serviceLoadKn: 1200, sbc: 180, shape: 'Rectangular', ratio: 1.5, addPercent: 10 } },
      ],
      inputs: [
        { name: 'serviceLoadKn', label: 'Service Load (kN)', type: 'number', defaultValue: 800, min: 0, step: 1, helpText: 'Include column load + self weight allowance if needed' },
        { name: 'sbc', label: 'Soil SBC (kN/m²)', type: 'number', defaultValue: 150, min: 10, step: 1 },
        { name: 'addPercent', label: 'Extra for self weight (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
        { name: 'shape', label: 'Footing Shape', type: 'select', options: ['Square', 'Rectangular'], defaultValue: 'Square' },
        { name: 'ratio', label: 'L/B ratio (rectangular)', type: 'number', defaultValue: 1.5, min: 1.0, max: 3.0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const load = safeFloat(inputs.serviceLoadKn);
        const sbc = safeFloat(inputs.sbc);
        const add = safeFloat(inputs.addPercent);
        const shape = inputs.shape || 'Square';
        const ratio = Math.max(safeFloat(inputs.ratio) || 1, 1);

        const loadAdj = load * (1 + add / 100);
        const areaReq = sbc > 0 ? loadAdj / sbc : 0;

        let B = 0;
        let L = 0;
        if (shape === 'Rectangular') {
          B = Math.sqrt(areaReq / ratio);
          L = ratio * B;
        } else {
          B = Math.sqrt(areaReq);
          L = B;
        }

        return {
          result: `${L.toFixed(2)} m × ${B.toFixed(2)} m`,
          explanation: `Required footing area ≈ ${areaReq.toFixed(2)} m² at SBC ${sbc.toFixed(0)} kN/m²`,
          steps: [
            `Service load: ${load.toFixed(0)} kN`,
            `Extra: ${add.toFixed(0)}% → adjusted load: ${loadAdj.toFixed(0)} kN`,
            `Required area A = Load/SBC = ${loadAdj.toFixed(0)}/${sbc.toFixed(0)} = ${areaReq.toFixed(2)} m²`,
            shape === 'Rectangular'
              ? `Assume L/B=${ratio.toFixed(1)} → B=√(A/ratio)=${B.toFixed(2)} m, L=${L.toFixed(2)} m`
              : `Square: side = √A = ${B.toFixed(2)} m`,
          ],
          tips: [
            '⚠️ Actual footing design requires checks for bending, shear and settlement',
            '✅ Confirm SBC with geotechnical report',
          ],
          visualData: [{ label: 'Area (m²)', value: areaReq }],
        };
      },
    };
  }

  // SLAB DESIGN CALCULATOR (thumb-rule thickness + basic moment)
  if (id === 'slab-calculator') {
    return {
      title: 'Slab Design Calculator',
      description: 'Estimate slab thickness by span thumb-rule and basic bending moment per meter width',
      presetScenarios: [
        { name: 'One-way slab (4m)', icon: '🏠', values: { spanM: 4, support: 'Simply Supported', udlKnPerM2: 7 } },
        { name: 'Continuous slab (5m)', icon: '🏢', values: { spanM: 5, support: 'Continuous', udlKnPerM2: 8 } },
      ],
      inputs: [
        { name: 'spanM', label: 'Span L (m)', type: 'number', defaultValue: 4, min: 0.5, max: 20, step: 0.1 },
        { name: 'support', label: 'Support Condition', type: 'select', options: ['Simply Supported', 'Continuous', 'Cantilever'], defaultValue: 'Simply Supported' },
        { name: 'udlKnPerM2', label: 'Total UDL (kN/m²)', type: 'number', defaultValue: 7, min: 0, step: 0.1, helpText: 'Self weight + finishes + live load (approx.)' },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.spanM);
        const support = inputs.support || 'Simply Supported';
        const udl = safeFloat(inputs.udlKnPerM2);

        let ratio = 25;
        if (support === 'Continuous') ratio = 28;
        if (support === 'Cantilever') ratio = 10;

        const thicknessMm = (L * 1000) / ratio;

        // Moment per meter width (approx): M = w L^2 / 8 for simply supported; use /12 for continuous
        const wPerM = udl * 1; // kN/m for 1m strip
        const mDen = support === 'Continuous' ? 12 : support === 'Cantilever' ? 2 : 8;
        const M_kNm_per_m = (wPerM * L * L) / mDen;

        return {
          result: `${thicknessMm.toFixed(0)} mm (approx)`,
          explanation: `Thumb-rule slab thickness based on span/ratio (${support})`,
          steps: [
            `Span L = ${L.toFixed(2)} m`,
            `Support: ${support}`,
            `Thickness ≈ L/${ratio} → ${(L * 1000).toFixed(0)}/${ratio} = ${thicknessMm.toFixed(0)} mm`,
            `UDL ≈ ${udl.toFixed(2)} kN/m²`,
            `Moment per 1m strip ≈ wL²/${mDen} = ${M_kNm_per_m.toFixed(2)} kN·m per m`,
          ],
          visualData: [{ label: 'Moment (kN·m/m)', value: M_kNm_per_m }],
          tips: [
            '⚠️ This is a rule-of-thumb; actual thickness depends on deflection, cover, bar size, continuity',
            '✅ Use proper code-based design for reinforcement and checks',
          ],
        };
      },
    };
  }

  // REBAR CALCULATOR (grid bars for slab)
  if (id === 'rebar-calculator') {
    return {
      title: 'Rebar Calculator',
      description: 'Estimate rebar quantity and weight for a slab grid (two directions)',
      presetScenarios: [
        { name: '10m × 5m, 12mm @150', icon: '🧱', values: { lengthM: 10, widthM: 5, spacingMm: 150, diaMm: 12, layers: 'Single', wastage: 5 } },
        { name: '8m × 8m, 10mm @200', icon: '🏗️', values: { lengthM: 8, widthM: 8, spacingMm: 200, diaMm: 10, layers: 'Single', wastage: 5 } },
      ],
      inputs: [
        { name: 'lengthM', label: 'Slab Length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'widthM', label: 'Slab Width (m)', type: 'number', defaultValue: 5, min: 0, step: 0.1 },
        { name: 'spacingMm', label: 'Bar Spacing (mm)', type: 'number', defaultValue: 150, min: 50, max: 500, step: 10 },
        { name: 'diaMm', label: 'Bar Diameter (mm)', type: 'number', defaultValue: 12, min: 6, max: 32, step: 1 },
        { name: 'layers', label: 'Layers', type: 'select', options: ['Single', 'Double'], defaultValue: 'Single' },
        { name: 'wastage', label: 'Wastage/Laps (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const s = safeFloat(inputs.spacingMm);
        const d = safeFloat(inputs.diaMm);
        const layers = inputs.layers || 'Single';
        const wastage = safeFloat(inputs.wastage);

        const spacingM = s / 1000;
        const barsAlongLength = spacingM > 0 ? Math.floor(W / spacingM) + 1 : 0; // bars parallel to length
        const barsAlongWidth = spacingM > 0 ? Math.floor(L / spacingM) + 1 : 0;  // bars parallel to width

        const totalLengthM = barsAlongLength * L + barsAlongWidth * W;
        const layerMultiplier = layers === 'Double' ? 2 : 1;
        const totalLengthWithLayers = totalLengthM * layerMultiplier;
        const totalLengthWithWastage = totalLengthWithLayers * (1 + wastage / 100);

        const kgPerM = (d * d) / 162;
        const totalWeightKg = totalLengthWithWastage * kgPerM;

        return {
          result: `${totalWeightKg.toFixed(1)} kg`,
          explanation: `Rebar weight for ${layers.toLowerCase()} layer grid at ${s.toFixed(0)}mm spacing`,
          steps: [
            `Slab: ${L.toFixed(2)} m × ${W.toFixed(2)} m`,
            `Spacing: ${s.toFixed(0)} mm`,
            `Bars parallel to length: ${barsAlongLength} (each ~${L.toFixed(2)} m)`,
            `Bars parallel to width: ${barsAlongWidth} (each ~${W.toFixed(2)} m)`,
            `Total bar length (single layer): ${totalLengthM.toFixed(1)} m`,
            `Layers: ${layers} → ×${layerMultiplier} = ${totalLengthWithLayers.toFixed(1)} m`,
            `Wastage/Laps: ${wastage}% → ${totalLengthWithWastage.toFixed(1)} m`,
            `Weight per meter: d²/162 = ${(d * d).toFixed(0)}/162 = ${kgPerM.toFixed(3)} kg/m`,
            `Total weight: ${totalWeightKg.toFixed(1)} kg`,
          ],
          visualData: [
            { label: 'Bars (L-dir)', value: barsAlongLength },
            { label: 'Bars (W-dir)', value: barsAlongWidth },
          ],
          tips: [
            '📌 This is an estimate; account for cover, anchorage, bends, laps',
            '✅ Verify spacing and bar diameter with structural drawings',
          ],
        };
      },
    };
  }

  // STAIRCASE CALCULATOR
  if (id === 'staircase-calculator') {
    return {
      title: 'Staircase Calculator',
      description: 'Calculate risers, treads, run and slope for a straight staircase',
      presetScenarios: [
        { name: 'Typical residential', icon: '🪜', values: { floorHeightMm: 3000, targetRiserMm: 165, treadMm: 270 } },
        { name: 'Compact stair', icon: '🏠', values: { floorHeightMm: 3000, targetRiserMm: 175, treadMm: 250 } },
      ],
      inputs: [
        { name: 'floorHeightMm', label: 'Floor-to-Floor Height (mm)', type: 'number', defaultValue: 3000, min: 1000, max: 6000, step: 10 },
        { name: 'targetRiserMm', label: 'Target Riser (mm)', type: 'number', defaultValue: 165, min: 120, max: 200, step: 1 },
        { name: 'treadMm', label: 'Tread/Going (mm)', type: 'number', defaultValue: 270, min: 200, max: 350, step: 1 },
      ],
      calculate: (inputs) => {
        const H = safeFloat(inputs.floorHeightMm);
        const riserTarget = safeFloat(inputs.targetRiserMm);
        const tread = safeFloat(inputs.treadMm);

        const risers = Math.max(1, Math.ceil(H / Math.max(riserTarget, 1)));
        const actualRiser = H / risers;
        const treads = Math.max(0, risers - 1);
        const totalRunMm = treads * tread;
        const slopeRad = totalRunMm > 0 ? Math.atan(H / totalRunMm) : 0;
        const slopeDeg = (slopeRad * 180) / Math.PI;
        const stringerMm = Math.sqrt(H * H + totalRunMm * totalRunMm);

        // Comfort check (common rule): 2R + T ≈ 600–650 mm
        const comfort = 2 * actualRiser + tread;

        return {
          result: `${risers} risers, ${treads} treads`,
          explanation: `Actual riser ≈ ${actualRiser.toFixed(1)} mm, slope ≈ ${slopeDeg.toFixed(1)}°`,
          steps: [
            `Height H: ${H.toFixed(0)} mm`,
            `Target riser: ${riserTarget.toFixed(0)} mm → risers = ceil(H/R) = ${risers}`,
            `Actual riser = H/risers = ${actualRiser.toFixed(1)} mm`,
            `Treads = risers − 1 = ${treads}`,
            `Tread: ${tread.toFixed(0)} mm`,
            `Total run = ${treads} × ${tread.toFixed(0)} = ${totalRunMm.toFixed(0)} mm`,
            `Stringer length ≈ ${stringerMm.toFixed(0)} mm`,
            `Comfort check: 2R + T = ${comfort.toFixed(0)} mm`,
          ],
          visualData: [
            { label: 'Slope (deg)', value: slopeDeg },
            { label: '2R+T (mm)', value: comfort },
          ],
          tips: [
            '✅ Comfortable stairs often satisfy 2R + T ≈ 600–650 mm',
            '📌 Verify headroom, landing length, and code requirements',
          ],
        };
      },
    };
  }

  // EARTHQUAKE LOAD CALCULATOR (basic)
  if (id === 'earthquake-load') {
    return {
      title: 'Earthquake Load Calculator',
      description: 'Estimate base shear using a simplified seismic coefficient method (basic)',
      presetScenarios: [
        { name: 'Low seismic', icon: '🏠', values: { seismicWeightKn: 1500, ah: 0.08 } },
        { name: 'Higher seismic', icon: '🏢', values: { seismicWeightKn: 4000, ah: 0.12 } },
      ],
      inputs: [
        { name: 'seismicWeightKn', label: 'Seismic Weight W (kN)', type: 'number', defaultValue: 1500, min: 0, step: 1, helpText: 'Approx total seismic weight of structure (dead + portion of live)' },
        { name: 'ah', label: 'Seismic Coefficient Ah (dimensionless)', type: 'number', defaultValue: 0.08, min: 0, max: 1, step: 0.01, helpText: 'Use code-based Ah, typical range ~0.05–0.15' },
      ],
      calculate: (inputs) => {
        const W = safeFloat(inputs.seismicWeightKn);
        const Ah = safeFloat(inputs.ah);
        const V = Ah * W;

        return {
          result: `${V.toFixed(1)} kN`,
          explanation: `Base shear V = Ah × W`,
          formula: 'V = Ah × W',
          steps: [
            `W = ${W.toFixed(1)} kN`,
            `Ah = ${Ah.toFixed(3)}`,
            `V = ${Ah.toFixed(3)} × ${W.toFixed(1)} = ${V.toFixed(1)} kN`,
          ],
          visualData: [{ label: 'Base Shear (kN)', value: V }],
          tips: [
            '⚠️ Use your local seismic code to determine Ah and W accurately',
            '✅ For multi-storey buildings, base shear distribution by height is also required',
          ],
        };
      },
    };
  }

  // SOIL BEARING CAPACITY (Terzaghi, basic)
  if (id === 'soil-bearing-capacity') {
    return {
      title: 'Soil Bearing Capacity',
      description: 'Estimate ultimate and allowable bearing capacity using a basic Terzaghi approach (approx.)',
      presetScenarios: [
        { name: 'Dense sand (φ=32°)', icon: '🏗️', values: { footingShape: 'Strip', B: 1.5, Df: 1.0, gamma: 18, c: 0, phiDeg: 32, FS: 3 } },
        { name: 'Clayey soil (φ=0°)', icon: '🧱', values: { footingShape: 'Strip', B: 1.5, Df: 1.0, gamma: 17, c: 50, phiDeg: 0, FS: 3 } },
      ],
      inputs: [
        { name: 'footingShape', label: 'Footing Shape', type: 'select', options: ['Strip', 'Square', 'Circular'], defaultValue: 'Strip' },
        { name: 'B', label: 'Footing Width B (m)', type: 'number', defaultValue: 1.5, min: 0.1, max: 20, step: 0.1 },
        { name: 'Df', label: 'Foundation Depth Df (m)', type: 'number', defaultValue: 1.0, min: 0, max: 10, step: 0.1 },
        { name: 'gamma', label: 'Soil Unit Weight γ (kN/m³)', type: 'number', defaultValue: 18, min: 5, max: 30, step: 0.1 },
        { name: 'c', label: 'Cohesion c (kPa)', type: 'number', defaultValue: 0, min: 0, max: 500, step: 1 },
        { name: 'phiDeg', label: 'Friction Angle φ (deg)', type: 'number', defaultValue: 30, min: 0, max: 45, step: 1 },
        { name: 'FS', label: 'Factor of Safety', type: 'number', defaultValue: 3, min: 1, max: 10, step: 0.1 },
      ],
      calculate: (inputs) => {
        const shape = inputs.footingShape || 'Strip';
        const B = safeFloat(inputs.B);
        const Df = safeFloat(inputs.Df);
        const gamma = safeFloat(inputs.gamma);
        const c = safeFloat(inputs.c);
        const phiDeg = safeFloat(inputs.phiDeg);
        const FS = Math.max(safeFloat(inputs.FS) || 3, 1);

        const phiRad = (phiDeg * Math.PI) / 180;

        // Bearing capacity factors
        let Nq = 1;
        let Nc = 5.7;
        let Ngamma = 0;
        if (phiDeg > 0) {
          const tanPhi = Math.tan(phiRad);
          Nq = Math.exp(Math.PI * tanPhi) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
          Nc = (Nq - 1) / tanPhi;
          Ngamma = 2 * (Nq + 1) * tanPhi;
        }

        // Simple shape factors (approx.)
        const sc = shape === 'Strip' ? 1.0 : 1.3;
        const sq = shape === 'Strip' ? 1.0 : 1.2;
        const sgamma = shape === 'Strip' ? 1.0 : shape === 'Square' ? 0.8 : 0.6;

        const qult = c * Nc * sc + gamma * Df * Nq * sq + 0.5 * gamma * B * Ngamma * sgamma; // kPa
        const qall = qult / FS;

        return {
          result: `${qall.toFixed(0)} kPa (allowable)`,
          explanation: `Basic Terzaghi estimate (shape: ${shape})`,
          steps: [
            `Inputs: B=${B.toFixed(2)} m, Df=${Df.toFixed(2)} m, γ=${gamma.toFixed(2)} kN/m³, c=${c.toFixed(1)} kPa, φ=${phiDeg.toFixed(0)}°`,
            `Factors: Nq=${Nq.toFixed(2)}, Nc=${Nc.toFixed(2)}, Nγ=${Ngamma.toFixed(2)}`,
            `Shape factors: sc=${sc.toFixed(2)}, sq=${sq.toFixed(2)}, sγ=${sgamma.toFixed(2)}`,
            `qult = cNc(sc) + γDfNq(sq) + 0.5γBNγ(sγ) = ${qult.toFixed(1)} kPa`,
            `FS = ${FS.toFixed(2)} → qall = qult/FS = ${qall.toFixed(1)} kPa`,
          ],
          visualData: [
            { label: 'qult (kPa)', value: qult },
            { label: 'qall (kPa)', value: qall },
          ],
          tips: [
            '⚠️ This is approximate; use geotechnical report parameters',
            '✅ Settlement often governs allowable bearing pressure',
          ],
        };
      },
    };
  }

  // RETAINING WALL (active pressure, basic)
  if (id === 'retaining-wall') {
    return {
      title: 'Retaining Wall Calculator',
      description: 'Estimate active earth pressure and basic stability checks (sliding/overturning) - approx.',
      presetScenarios: [
        { name: '2.5m wall', icon: '🧱', values: { H: 2.5, gamma: 18, phiDeg: 30, surchargeKpa: 0, baseWidth: 1.5, wallWeightKnPerM: 120, mu: 0.5 } },
        { name: '4m wall + surcharge', icon: '🏗️', values: { H: 4, gamma: 19, phiDeg: 32, surchargeKpa: 10, baseWidth: 2.5, wallWeightKnPerM: 250, mu: 0.5 } },
      ],
      inputs: [
        { name: 'H', label: 'Retained Height H (m)', type: 'number', defaultValue: 2.5, min: 0.5, max: 20, step: 0.1 },
        { name: 'gamma', label: 'Soil Unit Weight γ (kN/m³)', type: 'number', defaultValue: 18, min: 5, max: 30, step: 0.1 },
        { name: 'phiDeg', label: 'Soil Friction Angle φ (deg)', type: 'number', defaultValue: 30, min: 0, max: 45, step: 1 },
        { name: 'surchargeKpa', label: 'Uniform Surcharge q (kPa)', type: 'number', defaultValue: 0, min: 0, max: 200, step: 1 },
        { name: 'baseWidth', label: 'Base Width B (m)', type: 'number', defaultValue: 1.5, min: 0.5, max: 10, step: 0.1 },
        { name: 'wallWeightKnPerM', label: 'Wall Weight W (kN/m)', type: 'number', defaultValue: 120, min: 0, step: 1, helpText: 'Approx per meter length (include soil on heel if considered)' },
        { name: 'mu', label: 'Base Friction μ', type: 'number', defaultValue: 0.5, min: 0.1, max: 1.0, step: 0.05 },
      ],
      calculate: (inputs) => {
        const H = safeFloat(inputs.H);
        const gamma = safeFloat(inputs.gamma);
        const phiDeg = safeFloat(inputs.phiDeg);
        const q = safeFloat(inputs.surchargeKpa);
        const B = safeFloat(inputs.baseWidth);
        const W = safeFloat(inputs.wallWeightKnPerM);
        const mu = safeFloat(inputs.mu);

        const phiRad = (phiDeg * Math.PI) / 180;
        const Ka = (1 - Math.sin(phiRad)) / (1 + Math.sin(phiRad));

        const Pa_soil = 0.5 * Ka * gamma * H * H; // kN/m
        const Pa_surcharge = Ka * q * H; // kN/m (since kPa=kN/m²)
        const Pa = Pa_soil + Pa_surcharge;

        const Mo = Pa_soil * (H / 3) + Pa_surcharge * (H / 2); // kN·m per m
        const Mr = W * (B / 2); // kN·m per m (simplified)

        const FS_sliding = Pa > 0 ? (mu * W) / Pa : 0;
        const FS_overturning = Mo > 0 ? Mr / Mo : 0;

        return {
          result: `Pa: ${Pa.toFixed(1)} kN/m`,
          explanation: `Rankine active pressure with basic stability checks (approx.)`,
          steps: [
            `Ka = (1−sinφ)/(1+sinφ) with φ=${phiDeg.toFixed(0)}° → Ka=${Ka.toFixed(3)}`,
            `Pa(soil) = 0.5×Ka×γ×H² = ${Pa_soil.toFixed(1)} kN/m`,
            `Pa(surcharge) = Ka×q×H = ${Pa_surcharge.toFixed(1)} kN/m`,
            `Pa(total) = ${Pa.toFixed(1)} kN/m`,
            `Overturning moment Mo ≈ ${Mo.toFixed(1)} kN·m/m`,
            `Resisting moment Mr (simplified) ≈ W×(B/2) = ${Mr.toFixed(1)} kN·m/m`,
            `FS(sliding) ≈ μW/Pa = ${FS_sliding.toFixed(2)}`,
            `FS(overturning) ≈ Mr/Mo = ${FS_overturning.toFixed(2)}`,
          ],
          visualData: [
            { label: 'FS Sliding', value: FS_sliding },
            { label: 'FS Overturning', value: FS_overturning },
          ],
          tips: [
            '⚠️ Real design must check bearing pressure, eccentricity, drainage, and reinforcement',
            '✅ Consider water pressure and seismic effects if applicable',
          ],
        };
      },
    };
  }

  // SHEAR WALL (basic shear stress)
  if (id === 'shear-wall-design') {
    return {
      title: 'Shear Wall Design Calculator',
      description: 'Compute basic average shear stress and aspect ratio for a rectangular shear wall (approx.)',
      presetScenarios: [
        { name: 'Small wall', icon: '🏠', values: { wallLengthM: 3, thicknessMm: 200, storyShearKn: 300, storyHeightM: 3 } },
        { name: 'Core wall', icon: '🏢', values: { wallLengthM: 6, thicknessMm: 250, storyShearKn: 900, storyHeightM: 3.5 } },
      ],
      inputs: [
        { name: 'wallLengthM', label: 'Wall Length L (m)', type: 'number', defaultValue: 3, min: 0.5, max: 50, step: 0.1 },
        { name: 'thicknessMm', label: 'Wall Thickness t (mm)', type: 'number', defaultValue: 200, min: 100, max: 600, step: 10 },
        { name: 'storyShearKn', label: 'Storey Shear V (kN)', type: 'number', defaultValue: 300, min: 0, step: 1 },
        { name: 'storyHeightM', label: 'Storey Height h (m)', type: 'number', defaultValue: 3, min: 2, max: 10, step: 0.1 },
      ],
      calculate: (inputs) => {
        const Lm = safeFloat(inputs.wallLengthM);
        const t = safeFloat(inputs.thicknessMm);
        const V = safeFloat(inputs.storyShearKn);
        const h = safeFloat(inputs.storyHeightM);

        const Lmm = Lm * 1000;
        const Av_mm2 = Lmm * t;
        const tau_MPa = Av_mm2 > 0 ? (V * 1000) / Av_mm2 : 0; // N/mm²
        const aspect = Lm > 0 ? h / Lm : 0;

        return {
          result: `${tau_MPa.toFixed(3)} MPa`,
          explanation: `Average shear stress τ = V / (L × t) (approx.)`,
          formula: 'τ = V / (L × t)',
          steps: [
            `V = ${V.toFixed(1)} kN`,
            `L = ${Lm.toFixed(2)} m (${Lmm.toFixed(0)} mm), t = ${t.toFixed(0)} mm`,
            `Shear area Av = L×t = ${Av_mm2.toLocaleString()} mm²`,
            `τ = (V×1000)/Av = ${(V * 1000).toFixed(0)}/${Av_mm2.toFixed(0)} = ${tau_MPa.toFixed(3)} MPa`,
            `Aspect ratio h/L = ${h.toFixed(2)}/${Lm.toFixed(2)} = ${aspect.toFixed(2)}`,
          ],
          visualData: [
            { label: 'Shear stress (MPa)', value: tau_MPa },
            { label: 'Aspect ratio (h/L)', value: aspect },
          ],
          tips: [
            '⚠️ Capacity and detailing are code-specific (boundary elements, coupling beams, etc.)',
            '✅ Use local code checks for shear strength and drift limits',
          ],
        };
      },
    };
  }

  // ROOF TRUSS (geometry, basic)
  if (id === 'truss-calculator') {
    return {
      title: 'Roof Truss Calculator',
      description: 'Compute basic truss geometry: pitch, rafter length and top chord length (approx.)',
      presetScenarios: [
        { name: 'Span 10m, rise 2m', icon: '🏠', values: { spanM: 10, riseM: 2, overhangM: 0.5 } },
        { name: 'Span 16m, rise 3m', icon: '🏗️', values: { spanM: 16, riseM: 3, overhangM: 0.75 } },
      ],
      inputs: [
        { name: 'spanM', label: 'Span (m)', type: 'number', defaultValue: 10, min: 1, max: 60, step: 0.1 },
        { name: 'riseM', label: 'Rise (m)', type: 'number', defaultValue: 2, min: 0, max: 20, step: 0.1 },
        { name: 'overhangM', label: 'Overhang (m)', type: 'number', defaultValue: 0.5, min: 0, max: 5, step: 0.05 },
      ],
      calculate: (inputs) => {
        const span = safeFloat(inputs.spanM);
        const rise = safeFloat(inputs.riseM);
        const overhang = safeFloat(inputs.overhangM);

        const halfSpan = span / 2;
        const pitchRad = halfSpan > 0 ? Math.atan(rise / halfSpan) : 0;
        const pitchDeg = (pitchRad * 180) / Math.PI;

        const rafter = Math.sqrt(halfSpan * halfSpan + rise * rise);
        const overhangAlongSlope = Math.cos(pitchRad) > 0 ? overhang / Math.cos(pitchRad) : 0;

        const topChordNoOverhang = 2 * rafter;
        const topChordWithOverhang = 2 * (rafter + overhangAlongSlope);

        return {
          result: `Pitch: ${pitchDeg.toFixed(1)}°`,
          explanation: `Basic truss geometry for a symmetric roof (approx.)`,
          steps: [
            `Span = ${span.toFixed(2)} m, Rise = ${rise.toFixed(2)} m`,
            `Pitch θ = atan(rise/(span/2)) = ${pitchDeg.toFixed(1)}°`,
            `Rafter length (half) = √((span/2)² + rise²) = ${rafter.toFixed(3)} m`,
            `Top chord (no overhang) = 2×rafter = ${topChordNoOverhang.toFixed(3)} m`,
            `Overhang along slope ≈ overhang/cosθ = ${overhangAlongSlope.toFixed(3)} m`,
            `Top chord (with overhang) ≈ ${topChordWithOverhang.toFixed(3)} m`,
          ],
          visualData: [
            { label: 'Rafter (m)', value: rafter },
            { label: 'Top chord w/ overhang (m)', value: topChordWithOverhang },
          ],
          tips: [
            '✅ For member sizing, use structural analysis and code load combinations',
            '📌 Include purlin spacing, roofing dead load, wind uplift in design',
          ],
        };
      },
    };
  }

  // PILE FOUNDATION (skin + end bearing, basic)
  if (id === 'pile-foundation') {
    return {
      title: 'Pile Foundation Calculator',
      description: 'Estimate pile axial capacity from skin friction + end bearing (basic)',
      presetScenarios: [
        { name: '1 pile (D=0.4m, L=12m)', icon: '🪵', values: { diameterM: 0.4, lengthM: 12, fsKpa: 45, qbKpa: 1500, piles: 1, FS: 2.5 } },
        { name: '4 piles group', icon: '🏗️', values: { diameterM: 0.5, lengthM: 15, fsKpa: 60, qbKpa: 2000, piles: 4, FS: 2.5 } },
      ],
      inputs: [
        { name: 'diameterM', label: 'Pile Diameter D (m)', type: 'number', defaultValue: 0.4, min: 0.2, max: 2.0, step: 0.05 },
        { name: 'lengthM', label: 'Pile Length L (m)', type: 'number', defaultValue: 12, min: 1, max: 60, step: 0.5 },
        { name: 'fsKpa', label: 'Unit Skin Friction fs (kPa)', type: 'number', defaultValue: 45, min: 0, max: 300, step: 1 },
        { name: 'qbKpa', label: 'Unit End Bearing qb (kPa)', type: 'number', defaultValue: 1500, min: 0, max: 20000, step: 10 },
        { name: 'piles', label: 'Number of Piles', type: 'slider', defaultValue: 1, min: 1, max: 100, step: 1 },
        { name: 'FS', label: 'Factor of Safety', type: 'number', defaultValue: 2.5, min: 1, max: 10, step: 0.1 },
      ],
      calculate: (inputs) => {
        const D = safeFloat(inputs.diameterM);
        const L = safeFloat(inputs.lengthM);
        const fs = safeFloat(inputs.fsKpa);
        const qb = safeFloat(inputs.qbKpa);
        const piles = Math.max(1, Math.round(safeFloat(inputs.piles) || 1));
        const FS = Math.max(safeFloat(inputs.FS) || 2.5, 1);

        const As = Math.PI * D * L; // m²
        const Ab = (Math.PI * D * D) / 4; // m²

        const Qs = fs * As; // kN
        const Qb = qb * Ab; // kN
        const Qult = Qs + Qb;
        const Qall_per = Qult / FS;
        const Qall_group = Qall_per * piles;

        return {
          result: `${Qall_group.toFixed(0)} kN (allowable group)`,
          explanation: `Qult = fs·(πDL) + qb·(πD²/4), then divide by FS (approx.)`,
          steps: [
            `D=${D.toFixed(2)} m, L=${L.toFixed(2)} m`,
            `As = πDL = ${As.toFixed(3)} m²`,
            `Ab = πD²/4 = ${Ab.toFixed(3)} m²`,
            `Skin: Qs = fs×As = ${fs.toFixed(1)}×${As.toFixed(3)} = ${Qs.toFixed(0)} kN`,
            `End: Qb = qb×Ab = ${qb.toFixed(0)}×${Ab.toFixed(3)} = ${Qb.toFixed(0)} kN`,
            `Qult (per pile) = ${Qult.toFixed(0)} kN`,
            `FS=${FS.toFixed(2)} → Qall (per pile) = ${Qall_per.toFixed(0)} kN`,
            `Piles=${piles} → group allowable = ${Qall_group.toFixed(0)} kN`,
          ],
          visualData: [
            { label: 'Qall per pile (kN)', value: Qall_per },
            { label: 'Group (kN)', value: Qall_group },
          ],
          tips: [
            '⚠️ Group efficiency, settlement, negative skin friction can reduce capacity',
            '✅ Use geotechnical design parameters and field test correlations',
          ],
        };
      },
    };
  }

  // LINTEL (simple beam, basic)
  if (id === 'lintel-calculator') {
    return {
      title: 'Lintel Design Calculator',
      description: 'Simply supported lintel with UDL or midspan point load (basic)',
      presetScenarios: [
        { name: 'UDL lintel (1.5m)', icon: '🧱', values: { spanM: 1.5, loadCase: 'UDL', udlKnPerM: 8, pointLoadKn: 0 } },
        { name: 'Point load (2m)', icon: '🏗️', values: { spanM: 2.0, loadCase: 'Point (midspan)', udlKnPerM: 0, pointLoadKn: 15 } },
      ],
      inputs: [
        { name: 'spanM', label: 'Span L (m)', type: 'number', defaultValue: 1.5, min: 0.3, max: 10, step: 0.05 },
        { name: 'loadCase', label: 'Load Case', type: 'select', options: ['UDL', 'Point (midspan)'], defaultValue: 'UDL' },
        { name: 'udlKnPerM', label: 'UDL w (kN/m)', type: 'number', defaultValue: 8, min: 0, step: 0.1 },
        { name: 'pointLoadKn', label: 'Point Load P (kN)', type: 'number', defaultValue: 15, min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.spanM);
        const loadCase = inputs.loadCase || 'UDL';
        const w = safeFloat(inputs.udlKnPerM);
        const P = safeFloat(inputs.pointLoadKn);

        let Mmax = 0;
        let Vmax = 0;
        let formula = '';

        if (loadCase === 'Point (midspan)') {
          Mmax = (P * L) / 4;
          Vmax = P / 2;
          formula = 'Mmax = PL/4, Vmax = P/2';
        } else {
          Mmax = (w * L * L) / 8;
          Vmax = (w * L) / 2;
          formula = 'Mmax = wL²/8, Vmax = wL/2';
        }

        return {
          result: `Mmax: ${Mmax.toFixed(2)} kN·m`,
          explanation: `Basic lintel bending moment and shear (${loadCase})`,
          formula,
          steps: [
            `Span L = ${L.toFixed(2)} m`,
            loadCase === 'Point (midspan)'
              ? `P = ${P.toFixed(2)} kN`
              : `w = ${w.toFixed(2)} kN/m`,
            `Vmax ≈ ${Vmax.toFixed(2)} kN`,
            `Mmax ≈ ${Mmax.toFixed(2)} kN·m`,
          ],
          visualData: [
            { label: 'Shear (kN)', value: Vmax },
            { label: 'Moment (kN·m)', value: Mmax },
          ],
          tips: [
            '⚠️ Actual lintel design requires reinforcement and deflection checks',
            '✅ Consider wall load dispersion and bearing length at supports',
          ],
        };
      },
    };
  }

  // ASPHALT CALCULATOR
  if (id === 'asphalt-calculator') {
    return {
      title: 'Asphalt Calculator',
      description: 'Estimate asphalt volume and tonnage from area and thickness (approx.)',
      presetScenarios: [
        { name: 'Driveway (50m², 50mm)', icon: '🛣️', values: { areaM2: 50, thicknessMm: 50, densityKgPerM3: 2400, wastage: 5 } },
        { name: 'Road patch (200m², 75mm)', icon: '🚧', values: { areaM2: 200, thicknessMm: 75, densityKgPerM3: 2400, wastage: 5 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Area (m²)', type: 'number', defaultValue: 50, min: 0, step: 0.1 },
        { name: 'thicknessMm', label: 'Thickness (mm)', type: 'number', defaultValue: 50, min: 1, max: 300, step: 1 },
        { name: 'densityKgPerM3', label: 'Density (kg/m³)', type: 'number', defaultValue: 2400, min: 1000, max: 3000, step: 10, helpText: 'Typical asphalt density ~2300–2500 kg/m³' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const areaM2 = safeFloat(inputs.areaM2);
        const thicknessMm = safeFloat(inputs.thicknessMm);
        const density = safeFloat(inputs.densityKgPerM3);
        const wastage = safeFloat(inputs.wastage);

        const thicknessM = thicknessMm / 1000;
        const volumeM3 = areaM2 * thicknessM;
        const volumeWithWastage = volumeM3 * (1 + wastage / 100);
        const massKg = volumeWithWastage * density;
        const tonnes = massKg / 1000;

        return {
          result: `${tonnes.toFixed(2)} tonnes`,
          explanation: `Asphalt quantity from area × thickness (with wastage)`,
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Thickness = ${thicknessMm.toFixed(0)} mm = ${thicknessM.toFixed(3)} m`,
            `Volume = area × thickness = ${volumeM3.toFixed(3)} m³`,
            `Wastage = ${wastage.toFixed(0)}% → ${volumeWithWastage.toFixed(3)} m³`,
            `Mass = volume × density = ${volumeWithWastage.toFixed(3)} × ${density.toFixed(0)} = ${massKg.toFixed(0)} kg`,
            `Tonnage = ${tonnes.toFixed(2)} t`,
          ],
          visualData: [
            { label: 'Volume (m³)', value: volumeWithWastage },
            { label: 'Tonnes', value: tonnes },
          ],
          tips: [
            '⚠️ Actual tonnage varies by mix and compaction; confirm with supplier',
            '✅ Include extra for cuts/edges and uneven base',
          ],
        };
      },
    };
  }

  // DRYWALL CALCULATOR
  if (id === 'drywall-calculator') {
    return {
      title: 'Drywall Calculator',
      description: 'Estimate drywall sheet count from coverage area (approx.)',
      presetScenarios: [
        { name: 'Room walls (80m²)', icon: '🧱', values: { areaM2: 80, sheetWidthM: 1.2, sheetHeightM: 2.4, wastage: 10 } },
        { name: 'Ceiling (40m²)', icon: '🏠', values: { areaM2: 40, sheetWidthM: 1.2, sheetHeightM: 2.4, wastage: 10 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Total Area to Cover (m²)', type: 'number', defaultValue: 80, min: 0, step: 0.1 },
        { name: 'sheetWidthM', label: 'Sheet Width (m)', type: 'number', defaultValue: 1.2, min: 0.3, max: 2.0, step: 0.1 },
        { name: 'sheetHeightM', label: 'Sheet Length/Height (m)', type: 'number', defaultValue: 2.4, min: 0.6, max: 4.8, step: 0.1 },
        { name: 'wastage', label: 'Wastage/Cuts (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const areaM2 = safeFloat(inputs.areaM2);
        const w = safeFloat(inputs.sheetWidthM);
        const h = safeFloat(inputs.sheetHeightM);
        const wastage = safeFloat(inputs.wastage);

        const sheetArea = w * h;
        const areaWithWastage = areaM2 * (1 + wastage / 100);
        const sheets = sheetArea > 0 ? Math.ceil(areaWithWastage / sheetArea) : 0;

        return {
          result: `${sheets} sheets`,
          explanation: `Sheets = ceil((area × (1+wastage)) / sheetArea)`,
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaWithWastage.toFixed(2)} m²`,
            `Sheet size = ${w.toFixed(2)} × ${h.toFixed(2)} = ${sheetArea.toFixed(2)} m²`,
            `Sheets = ceil(${areaWithWastage.toFixed(2)} / ${sheetArea.toFixed(2)}) = ${sheets}`,
          ],
          visualData: [
            { label: 'Sheet area (m²)', value: sheetArea },
            { label: 'Sheets', value: sheets },
          ],
          tips: [
            '✅ Increase wastage for many openings/complex cuts',
            '📌 If doing double-layer, multiply sheets by 2',
          ],
        };
      },
    };
  }

  // FORMWORK CALCULATOR
  if (id === 'formwork-calculator') {
    return {
      title: 'Formwork Material Calculator',
      description: 'Estimate formwork area for slabs, beams, columns, or walls (approx.)',
      presetScenarios: [
        { name: 'Slab (6×4m)', icon: '🏠', values: { element: 'Slab', lengthM: 6, widthM: 4, depthM: 0.15, count: 1, ratePerM2: 0 } },
        { name: 'Beam (3m)', icon: '🏗️', values: { element: 'Beam', lengthM: 3, widthM: 0.23, depthM: 0.45, count: 4, ratePerM2: 0 } },
      ],
      inputs: [
        { name: 'element', label: 'Element', type: 'select', options: ['Slab', 'Beam', 'Column', 'Wall (both faces)'], defaultValue: 'Slab' },
        { name: 'lengthM', label: 'Length (m)', type: 'number', defaultValue: 6, min: 0, step: 0.1 },
        { name: 'widthM', label: 'Width (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'depthM', label: 'Depth/Height (m)', type: 'number', defaultValue: 0.15, min: 0, step: 0.01 },
        { name: 'count', label: 'Count', type: 'slider', defaultValue: 1, min: 1, max: 200, step: 1 },
        { name: 'ratePerM2', label: 'Rate (per m²) (optional)', type: 'number', defaultValue: 0, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const element = inputs.element || 'Slab';
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const D = safeFloat(inputs.depthM);
        const count = Math.max(1, Math.round(safeFloat(inputs.count) || 1));
        const rate = safeFloat(inputs.ratePerM2);

        let areaPer = 0;
        let note = '';

        if (element === 'Beam') {
          // Soffit + 2 sides
          areaPer = L * (W + 2 * D);
          note = 'Beam: area = L × (soffit width + 2×depth)';
        } else if (element === 'Column') {
          // 4 sides; treat width as one side, depth as the other
          const perimeter = 2 * (W + D);
          areaPer = perimeter * L;
          note = 'Column: area = perimeter × height (length field used as height)';
        } else if (element === 'Wall (both faces)') {
          areaPer = 2 * L * W;
          note = 'Wall: area = 2 × length × height (both faces)';
        } else {
          // Slab underside + edge shuttering
          const underside = L * W;
          const perimeter = 2 * (L + W);
          const edges = perimeter * D;
          areaPer = underside + edges;
          note = 'Slab: underside + edges (perimeter × thickness)';
        }

        const totalArea = areaPer * count;
        const cost = rate > 0 ? totalArea * rate : 0;

        return {
          result: `${totalArea.toFixed(2)} m²`,
          explanation: `Formwork area estimate (${element}). ${rate > 0 ? `Cost ≈ ${cost.toFixed(0)}` : ''}`.trim(),
          steps: [
            `Element: ${element}`,
            `Inputs: L=${L.toFixed(2)} m, W=${W.toFixed(2)} m, D=${D.toFixed(2)} m, count=${count}`,
            `${note}`,
            `Area per unit = ${areaPer.toFixed(3)} m²`,
            `Total area = ${areaPer.toFixed(3)} × ${count} = ${totalArea.toFixed(2)} m²`,
            ...(rate > 0 ? [`Rate = ${rate.toFixed(2)} per m² → cost ≈ ${cost.toFixed(0)}`] : []),
          ],
          visualData: [
            { label: 'Area (m²)', value: totalArea },
            ...(rate > 0 ? [{ label: 'Cost', value: cost }] : []),
          ],
          tips: [
            '⚠️ Formwork area depends on openings, joints, and site method',
            '✅ Add extra for wastage and overlaps as per contractor practice',
          ],
        };
      },
    };
  }

  // GLASS CALCULATOR
  if (id === 'glass-calculator') {
    return {
      title: 'Glass Quantity Calculator',
      description: 'Estimate glass area and weight (approx.)',
      presetScenarios: [
        { name: 'Window (1.2×1.5m, 6mm)', icon: '🪟', values: { widthM: 1.2, heightM: 1.5, thicknessMm: 6, quantity: 4, densityKgPerM3: 2500 } },
      ],
      inputs: [
        { name: 'widthM', label: 'Width (m)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
        { name: 'heightM', label: 'Height (m)', type: 'number', defaultValue: 1.5, min: 0, step: 0.01 },
        { name: 'thicknessMm', label: 'Thickness (mm)', type: 'number', defaultValue: 6, min: 3, max: 25, step: 1 },
        { name: 'quantity', label: 'Quantity', type: 'slider', defaultValue: 4, min: 1, max: 200, step: 1 },
        { name: 'densityKgPerM3', label: 'Density (kg/m³)', type: 'number', defaultValue: 2500, min: 1500, max: 3000, step: 10 },
        { name: 'ratePerM2', label: 'Rate (per m²) (optional)', type: 'number', defaultValue: 0, min: 0, step: 10 },
      ],
      calculate: (inputs) => {
        const w = safeFloat(inputs.widthM);
        const h = safeFloat(inputs.heightM);
        const tMm = safeFloat(inputs.thicknessMm);
        const qty = Math.max(1, Math.round(safeFloat(inputs.quantity) || 1));
        const density = safeFloat(inputs.densityKgPerM3);
        const rate = safeFloat(inputs.ratePerM2);

        const areaOne = w * h;
        const areaTotal = areaOne * qty;
        const tM = tMm / 1000;
        const volume = areaTotal * tM;
        const weightKg = volume * density;
        const cost = rate > 0 ? areaTotal * rate : 0;

        return {
          result: `${areaTotal.toFixed(2)} m²`,
          explanation: `Estimated glass weight ≈ ${weightKg.toFixed(1)} kg${rate > 0 ? `; cost ≈ ${cost.toFixed(0)}` : ''}`,
          steps: [
            `Size: ${w.toFixed(2)} × ${h.toFixed(2)} m → area per piece = ${areaOne.toFixed(3)} m²`,
            `Quantity: ${qty} → total area = ${areaTotal.toFixed(3)} m²`,
            `Thickness: ${tMm.toFixed(0)} mm = ${tM.toFixed(3)} m`,
            `Volume = area × thickness = ${volume.toFixed(4)} m³`,
            `Weight = volume × density = ${volume.toFixed(4)} × ${density.toFixed(0)} = ${weightKg.toFixed(1)} kg`,
            ...(rate > 0 ? [`Rate = ${rate.toFixed(0)}/m² → cost ≈ ${cost.toFixed(0)}`] : []),
          ],
          visualData: [
            { label: 'Area (m²)', value: areaTotal },
            { label: 'Weight (kg)', value: weightKg },
          ],
          tips: [
            '⚠️ For tempered/laminated glass, density is similar but thickness and pricing differ',
            '✅ Add extra for breakage and cutting tolerances',
          ],
        };
      },
    };
  }

  // GRAVEL CALCULATOR
  if (id === 'gravel-calculator') {
    return {
      title: 'Gravel & Stone Calculator',
      description: 'Estimate gravel quantity (volume and tonnage) from volume (approx.)',
      presetScenarios: [
        { name: 'Gravel (5 m³)', icon: '🪨', values: { volumeM3: 5, densityKgPerM3: 1600, wastage: 5 } },
      ],
      inputs: [
        { name: 'volumeM3', label: 'Required Volume (m³)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
        { name: 'densityKgPerM3', label: 'Bulk Density (kg/m³)', type: 'number', defaultValue: 1600, min: 1000, max: 2000, step: 10, helpText: 'Typical bulk density ~1500–1700 kg/m³' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const volume = safeFloat(inputs.volumeM3);
        const density = safeFloat(inputs.densityKgPerM3);
        const wastage = safeFloat(inputs.wastage);

        const volAdj = volume * (1 + wastage / 100);
        const kg = volAdj * density;
        const tonnes = kg / 1000;

        return {
          result: `${tonnes.toFixed(2)} tonnes`,
          explanation: `Tonnage ≈ volume × bulk density (with wastage)`,
          steps: [
            `Volume = ${volume.toFixed(3)} m³`,
            `Wastage = ${wastage.toFixed(0)}% → ${volAdj.toFixed(3)} m³`,
            `Mass = ${volAdj.toFixed(3)} × ${density.toFixed(0)} = ${kg.toFixed(0)} kg`,
            `Tonnes = ${tonnes.toFixed(2)} t`,
          ],
          visualData: [
            { label: 'Volume (m³)', value: volAdj },
            { label: 'Tonnes', value: tonnes },
          ],
          tips: [
            '✅ If ordering by truck, confirm truck capacity and moisture content',
            '📌 Densities vary by size/gradation and compaction',
          ],
        };
      },
    };
  }

  // INSULATION MATERIAL
  if (id === 'insulation-material') {
    return {
      title: 'Insulation Material Calculator',
      description: 'Estimate insulation rolls/panels needed for a given area (approx.)',
      presetScenarios: [
        { name: 'Roof (120 m²)', icon: '🏠', values: { areaM2: 120, coveragePerUnitM2: 10, wastage: 10, unitsPerPack: 1 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Area to Insulate (m²)', type: 'number', defaultValue: 120, min: 0, step: 0.1 },
        { name: 'coveragePerUnitM2', label: 'Coverage per Roll/Panel (m²)', type: 'number', defaultValue: 10, min: 0.1, step: 0.1 },
        { name: 'unitsPerPack', label: 'Units per Pack', type: 'number', defaultValue: 1, min: 1, max: 50, step: 1 },
        { name: 'wastage', label: 'Wastage/Overlap (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
        { name: 'ratePerPack', label: 'Rate per Pack (optional)', type: 'number', defaultValue: 0, min: 0, step: 10 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaM2);
        const coverage = safeFloat(inputs.coveragePerUnitM2);
        const unitsPerPack = Math.max(1, Math.round(safeFloat(inputs.unitsPerPack) || 1));
        const wastage = safeFloat(inputs.wastage);
        const rate = safeFloat(inputs.ratePerPack);

        const areaAdj = area * (1 + wastage / 100);
        const units = coverage > 0 ? Math.ceil(areaAdj / coverage) : 0;
        const packs = unitsPerPack > 0 ? Math.ceil(units / unitsPerPack) : 0;
        const cost = rate > 0 ? packs * rate : 0;

        return {
          result: `${packs} packs`,
          explanation: `Units needed ≈ ${units}; packs = ceil(units / unitsPerPack)`,
          steps: [
            `Area = ${area.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdj.toFixed(2)} m²`,
            `Coverage per unit = ${coverage.toFixed(2)} m²`,
            `Units = ceil(${areaAdj.toFixed(2)} / ${coverage.toFixed(2)}) = ${units}`,
            `Units per pack = ${unitsPerPack} → packs = ${packs}`,
            ...(rate > 0 ? [`Rate per pack = ${rate.toFixed(0)} → cost ≈ ${cost.toFixed(0)}`] : []),
          ],
          visualData: [
            { label: 'Units', value: units },
            { label: 'Packs', value: packs },
          ],
          tips: [
            '✅ Increase wastage for irregular shapes and overlaps',
            '📌 Choose insulation thickness/R-value per climate and code',
          ],
        };
      },
    };
  }

  // SOIL FILL CALCULATOR
  if (id === 'soil-calculator') {
    return {
      title: 'Soil Fill Calculator',
      description: 'Estimate soil volume and weight for backfill/fill (approx.)',
      presetScenarios: [
        { name: 'Rect fill (10×5×0.3)', icon: '🪏', values: { shape: 'Rectangular', lengthM: 10, widthM: 5, depthM: 0.3, volumeM3: 0, densityKgPerM3: 1600, truckCapacityM3: 3 } },
      ],
      inputs: [
        { name: 'shape', label: 'Input Type', type: 'select', options: ['Rectangular', 'Circular', 'Direct Volume'], defaultValue: 'Rectangular' },
        { name: 'lengthM', label: 'Length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'widthM', label: 'Width (m)', type: 'number', defaultValue: 5, min: 0, step: 0.1 },
        { name: 'depthM', label: 'Depth (m)', type: 'number', defaultValue: 0.3, min: 0, step: 0.01 },
        { name: 'diameterM', label: 'Diameter (m) (circular)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'volumeM3', label: 'Volume (m³) (direct)', type: 'number', defaultValue: 0, min: 0, step: 0.01 },
        { name: 'densityKgPerM3', label: 'Bulk Density (kg/m³)', type: 'number', defaultValue: 1600, min: 1000, max: 2200, step: 10 },
        { name: 'truckCapacityM3', label: 'Truck Capacity (m³)', type: 'number', defaultValue: 3, min: 0.5, max: 20, step: 0.5 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Rectangular';
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const D = safeFloat(inputs.depthM);
        const dia = safeFloat(inputs.diameterM);
        const directVol = safeFloat(inputs.volumeM3);
        const density = safeFloat(inputs.densityKgPerM3);
        const truckCap = safeFloat(inputs.truckCapacityM3);

        let volume = 0;
        if (shape === 'Direct Volume') {
          volume = directVol;
        } else if (shape === 'Circular') {
          const r = dia / 2;
          volume = Math.PI * r * r * D;
        } else {
          volume = L * W * D;
        }

        const kg = volume * density;
        const tonnes = kg / 1000;
        const trucks = truckCap > 0 ? Math.ceil(volume / truckCap) : 0;

        return {
          result: `${volume.toFixed(2)} m³`,
          explanation: `Estimated soil weight ≈ ${tonnes.toFixed(2)} tonnes; trucks ≈ ${trucks}`,
          steps: [
            `Mode: ${shape}`,
            ...(shape === 'Rectangular'
              ? [`Volume = L×W×D = ${L.toFixed(2)}×${W.toFixed(2)}×${D.toFixed(2)} = ${volume.toFixed(2)} m³`]
              : shape === 'Circular'
                ? [`Volume = πr²D with r=${(dia / 2).toFixed(2)} → ${volume.toFixed(2)} m³`]
                : [`Volume (direct) = ${volume.toFixed(2)} m³`]),
            `Density = ${density.toFixed(0)} kg/m³ → weight = ${kg.toFixed(0)} kg = ${tonnes.toFixed(2)} t`,
            `Truck capacity = ${truckCap.toFixed(2)} m³ → trips ≈ ${trucks}`,
          ],
          visualData: [
            { label: 'Tonnes', value: tonnes },
            { label: 'Trucks', value: trucks },
          ],
          tips: [
            '⚠️ Soil moisture and compaction change bulk density significantly',
            '✅ Consider shrink/swell factors for excavation/backfill',
          ],
        };
      },
    };
  }

  // TIMBER & WOOD
  if (id === 'timber-calculator') {
    return {
      title: 'Timber & Wood Calculator',
      description: 'Estimate timber volume (m³) from piece dimensions and quantity (approx.)',
      presetScenarios: [
        { name: '2"×4" studs (3m)', icon: '🪵', values: { thicknessMm: 50, widthMm: 100, lengthM: 3, quantity: 50, wastage: 5, densityKgPerM3: 600 } },
      ],
      inputs: [
        { name: 'thicknessMm', label: 'Thickness (mm)', type: 'number', defaultValue: 50, min: 5, max: 300, step: 1 },
        { name: 'widthMm', label: 'Width (mm)', type: 'number', defaultValue: 100, min: 10, max: 600, step: 1 },
        { name: 'lengthM', label: 'Length (m)', type: 'number', defaultValue: 3, min: 0, step: 0.01 },
        { name: 'quantity', label: 'Pieces', type: 'slider', defaultValue: 50, min: 1, max: 1000, step: 1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 25, step: 1 },
        { name: 'densityKgPerM3', label: 'Density (kg/m³) (optional)', type: 'number', defaultValue: 600, min: 200, max: 1000, step: 10 },
      ],
      calculate: (inputs) => {
        const tMm = safeFloat(inputs.thicknessMm);
        const wMm = safeFloat(inputs.widthMm);
        const L = safeFloat(inputs.lengthM);
        const qty = Math.max(1, Math.round(safeFloat(inputs.quantity) || 1));
        const wastage = safeFloat(inputs.wastage);
        const density = safeFloat(inputs.densityKgPerM3);

        const tM = tMm / 1000;
        const wM = wMm / 1000;
        const volOne = tM * wM * L;
        const vol = volOne * qty;
        const volAdj = vol * (1 + wastage / 100);
        const weightKg = volAdj * density;

        const ft3 = volAdj * 35.3147;

        return {
          result: `${volAdj.toFixed(3)} m³`,
          explanation: `Total timber volume (with wastage). Estimated weight ≈ ${weightKg.toFixed(0)} kg`,
          steps: [
            `Piece size = ${tMm.toFixed(0)}×${wMm.toFixed(0)} mm, length = ${L.toFixed(2)} m`,
            `Volume per piece = ${volOne.toFixed(5)} m³`,
            `Pieces = ${qty} → volume = ${vol.toFixed(3)} m³`,
            `Wastage = ${wastage.toFixed(0)}% → ${volAdj.toFixed(3)} m³`,
            `≈ ${ft3.toFixed(2)} ft³`,
            `Weight (optional) = volume × density = ${volAdj.toFixed(3)} × ${density.toFixed(0)} = ${weightKg.toFixed(0)} kg`,
          ],
          visualData: [
            { label: 'Volume (m³)', value: volAdj },
            { label: 'Weight (kg)', value: weightKg },
          ],
          tips: [
            '✅ Add more wastage for complex carpentry and cutting losses',
            '📌 Timber density varies by species and moisture content',
          ],
        };
      },
    };
  }

  // AREA & VOLUME (ADVANCED)
  if (id === 'built-up-area') {
    return {
      title: 'Built-up Area Calculator',
      description: 'Estimate built-up area from carpet area using wall/common/loading percentages',
      presetScenarios: [
        { name: 'Apartment (1000 sq ft)', icon: '🏢', values: { unit: 'sq ft', carpetArea: 1000, wallPercent: 12, commonPercent: 18 } },
        { name: 'Small home (65 m²)', icon: '🏠', values: { unit: 'm²', carpetArea: 65, wallPercent: 10, commonPercent: 15 } },
      ],
      inputs: [
        { name: 'unit', label: 'Input Unit', type: 'select', options: ['m²', 'sq ft'], defaultValue: 'sq ft' },
        { name: 'carpetArea', label: 'Carpet Area', type: 'number', defaultValue: 1000, min: 0, step: 1 },
        { name: 'wallPercent', label: 'Wall/Structure Loading (%)', type: 'slider', defaultValue: 12, min: 0, max: 40, step: 1 },
        { name: 'commonPercent', label: 'Common Area Loading (%)', type: 'slider', defaultValue: 18, min: 0, max: 50, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'sq ft';
        const carpet = safeFloat(inputs.carpetArea);
        const wall = safeFloat(inputs.wallPercent);
        const common = safeFloat(inputs.commonPercent);

        const built = carpet * (1 + (wall + common) / 100);

        const sqm = unit === 'm²' ? built : built / 10.7639;
        const sqft = unit === 'sq ft' ? built : built * 10.7639;

        return {
          result: `${built.toFixed(2)} ${unit}`,
          explanation: 'Built-up area is carpet area adjusted by wall + common area loading.',
          formula: 'Built-up = Carpet × (1 + (Wall% + Common%)/100)',
          steps: [
            `Carpet area = ${carpet.toFixed(2)} ${unit}`,
            `Wall loading = ${wall.toFixed(0)}%`,
            `Common loading = ${common.toFixed(0)}%`,
            `Built-up = ${carpet.toFixed(2)} × (1 + ${(wall + common).toFixed(0)}/100) = ${built.toFixed(2)} ${unit}`,
            `≈ ${sqm.toFixed(2)} m²`,
            `≈ ${sqft.toFixed(2)} sq ft`,
          ],
          visualData: [
            { label: 'Built-up (m²)', value: sqm },
            { label: 'Built-up (sq ft)', value: sqft },
          ],
          tips: [
            '📌 Ratios vary by project (often 1.15–1.35× of carpet).',
            '✅ For exact numbers, use developer-provided loading factors.',
          ],
        };
      },
    };
  }

  if (id === 'circular-area') {
    return {
      title: 'Circular Area Calculator',
      description: 'Calculate the area of a circle using radius or diameter',
      presetScenarios: [
        { name: 'Radius 5 m', icon: '⭕', values: { mode: 'Radius', radiusM: 5, diameterM: 10 } },
        { name: 'Diameter 3 m', icon: '🛢️', values: { mode: 'Diameter', radiusM: 1.5, diameterM: 3 } },
      ],
      inputs: [
        { name: 'mode', label: 'Given', type: 'select', options: ['Radius', 'Diameter'], defaultValue: 'Radius' },
        { name: 'radiusM', label: 'Radius (m)', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
        { name: 'diameterM', label: 'Diameter (m)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'Radius';
        const radius = mode === 'Diameter' ? safeFloat(inputs.diameterM) / 2 : safeFloat(inputs.radiusM);
        const area = Math.PI * radius * radius;

        return {
          result: `${area.toFixed(3)} m²`,
          explanation: 'Circle area from radius.',
          formula: 'A = πr²',
          steps: [
            `r = ${radius.toFixed(3)} m`,
            `A = π × ${radius.toFixed(3)}² = ${area.toFixed(3)} m²`,
          ],
          visualData: [{ label: 'Area (m²)', value: area }],
          tips: ['✅ Use diameter mode if you measured across the circle.'],
        };
      },
    };
  }

  if (id === 'trapezoidal-area') {
    return {
      title: 'Trapezoidal Area Calculator',
      description: 'Area of a trapezoid from two parallel sides and height',
      presetScenarios: [
        { name: 'a=10, b=6, h=4', icon: '📐', values: { a: 10, b: 6, h: 4 } },
      ],
      inputs: [
        { name: 'a', label: 'Parallel Side a (m)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'b', label: 'Parallel Side b (m)', type: 'number', defaultValue: 6, min: 0, step: 0.01 },
        { name: 'h', label: 'Height (m)', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const a = safeFloat(inputs.a);
        const b = safeFloat(inputs.b);
        const h = safeFloat(inputs.h);
        const area = ((a + b) / 2) * h;

        return {
          result: `${area.toFixed(3)} m²`,
          explanation: 'Trapezoid area from average of parallel sides × height.',
          formula: 'A = (a + b)/2 × h',
          steps: [
            `a = ${a.toFixed(3)} m`,
            `b = ${b.toFixed(3)} m`,
            `h = ${h.toFixed(3)} m`,
            `A = (${a.toFixed(3)} + ${b.toFixed(3)})/2 × ${h.toFixed(3)} = ${area.toFixed(3)} m²`,
          ],
          visualData: [{ label: 'Area (m²)', value: area }],
          tips: ['📌 Ensure a and b are the parallel sides.'],
        };
      },
    };
  }

  if (id === 'polygon-area') {
    return {
      title: 'Regular Polygon Area Calculator',
      description: 'Area of a regular polygon from number of sides and side length',
      presetScenarios: [
        { name: 'Hexagon (s=2m)', icon: '⬡', values: { n: 6, sideM: 2 } },
        { name: 'Octagon (s=1m)', icon: '🛑', values: { n: 8, sideM: 1 } },
      ],
      inputs: [
        { name: 'n', label: 'Number of sides', type: 'slider', defaultValue: 6, min: 3, max: 20, step: 1 },
        { name: 'sideM', label: 'Side length (m)', type: 'number', defaultValue: 2, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const n = Math.max(3, Math.round(safeFloat(inputs.n) || 3));
        const s = safeFloat(inputs.sideM);
        const area = n > 2 ? (n * s * s) / (4 * Math.tan(Math.PI / n)) : 0;
        const apothem = n > 2 ? s / (2 * Math.tan(Math.PI / n)) : 0;
        const perimeter = n * s;

        return {
          result: `${area.toFixed(3)} m²`,
          explanation: 'Regular polygon area using apothem and perimeter.',
          formula: 'A = (n·s²) / (4·tan(π/n))',
          steps: [
            `n = ${n}`,
            `s = ${s.toFixed(3)} m`,
            `Perimeter = n×s = ${perimeter.toFixed(3)} m`,
            `Apothem ≈ ${apothem.toFixed(3)} m`,
            `Area ≈ ${area.toFixed(3)} m²`,
          ],
          visualData: [
            { label: 'Area (m²)', value: area },
            { label: 'Perimeter (m)', value: perimeter },
          ],
          tips: ['✅ This works for regular (equal sides/angles) polygons.'],
        };
      },
    };
  }

  if (id === 'land-area-calculator') {
    return {
      title: 'Land Area Converter',
      description: 'Convert land/plot area between common units',
      presetScenarios: [
        { name: '1 acre', icon: '🌾', values: { value: 1, unit: 'acre' } },
        { name: '2000 sq ft', icon: '🏠', values: { value: 2000, unit: 'sq ft' } },
      ],
      inputs: [
        { name: 'value', label: 'Area value', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'unit', label: 'Unit', type: 'select', options: ['m²', 'sq ft', 'sq yd', 'acre', 'hectare'], defaultValue: 'acre' },
      ],
      calculate: (inputs) => {
        const value = safeFloat(inputs.value);
        const unit = inputs.unit || 'acre';

        const toM2 = (val: number, u: string) => {
          if (u === 'm²') return val;
          if (u === 'sq ft') return val / 10.7639;
          if (u === 'sq yd') return val * 0.836127;
          if (u === 'acre') return val * 4046.8564224;
          if (u === 'hectare') return val * 10000;
          return val;
        };

        const m2 = toM2(value, unit);
        const sqFt = m2 * 10.7639;
        const sqYd = m2 / 0.836127;
        const acres = m2 / 4046.8564224;
        const hectares = m2 / 10000;

        return {
          result: `${m2.toFixed(2)} m²`,
          explanation: 'Converted area values in multiple units.',
          steps: [
            `Input = ${value.toFixed(4)} ${unit}`,
            `m² = ${m2.toFixed(4)}`,
            `sq ft = ${sqFt.toFixed(2)}`,
            `sq yd = ${sqYd.toFixed(2)}`,
            `acre = ${acres.toFixed(6)}`,
            `hectare = ${hectares.toFixed(6)}`,
          ],
          visualData: [
            { label: 'm²', value: m2 },
            { label: 'sq ft', value: sqFt },
            { label: 'acres', value: acres },
            { label: 'hectares', value: hectares },
          ],
          tips: ['📌 For legal documents, verify local unit definitions.'],
        };
      },
    };
  }

  if (id === 'plot-area-calculator') {
    return {
      title: 'Plot Area Calculator',
      description: 'Calculate plot area by shape (rectangle/triangle/trapezoid)',
      presetScenarios: [
        { name: 'Rect 30×40 ft', icon: '📏', values: { shape: 'Rectangle', unit: 'ft', L: 40, W: 30, a: 0, b: 0, h: 0 } },
        { name: 'Trap (10, 6, 4 m)', icon: '📐', values: { shape: 'Trapezoid', unit: 'm', L: 0, W: 0, a: 10, b: 6, h: 4 } },
      ],
      inputs: [
        { name: 'shape', label: 'Shape', type: 'select', options: ['Rectangle', 'Triangle', 'Trapezoid'], defaultValue: 'Rectangle' },
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'L', label: 'Length/Base (unit)', type: 'number', defaultValue: 40, min: 0, step: 0.01 },
        { name: 'W', label: 'Width/Height (unit)', type: 'number', defaultValue: 30, min: 0, step: 0.01 },
        { name: 'a', label: 'Trapezoid side a (unit)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'b', label: 'Trapezoid side b (unit)', type: 'number', defaultValue: 6, min: 0, step: 0.01 },
        { name: 'h', label: 'Trapezoid height (unit)', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Rectangle';
        const unit = inputs.unit || 'ft';

        const L = safeFloat(inputs.L);
        const W = safeFloat(inputs.W);
        const a = safeFloat(inputs.a);
        const b = safeFloat(inputs.b);
        const h = safeFloat(inputs.h);

        let areaUnit2 = 0;
        let formula = '';

        if (shape === 'Triangle') {
          areaUnit2 = 0.5 * L * W;
          formula = 'A = 1/2 × base × height';
        } else if (shape === 'Trapezoid') {
          areaUnit2 = ((a + b) / 2) * h;
          formula = 'A = (a + b)/2 × h';
        } else {
          areaUnit2 = L * W;
          formula = 'A = L × W';
        }

        const areaM2 = unit === 'm' ? areaUnit2 : areaUnit2 / 10.7639;
        const areaSqFt = unit === 'ft' ? areaUnit2 : areaUnit2 * 10.7639;

        return {
          result: `${areaUnit2.toFixed(2)} ${unit}²`,
          explanation: `Plot area by ${shape.toLowerCase()} geometry.`,
          formula,
          steps: [
            `Shape = ${shape}`,
            unit === 'm' ? `Area = ${areaM2.toFixed(2)} m²` : `Area = ${areaSqFt.toFixed(2)} sq ft`,
            `≈ ${areaM2.toFixed(2)} m²`,
            `≈ ${areaSqFt.toFixed(2)} sq ft`,
          ],
          visualData: [
            { label: 'Area (m²)', value: areaM2 },
            { label: 'Area (sq ft)', value: areaSqFt },
          ],
          tips: ['✅ For irregular plots, split into simple shapes and sum areas.'],
        };
      },
    };
  }

  if (id === 'room-size-calculator') {
    return {
      title: 'Room Size Calculator',
      description: 'Compute room floor area, perimeter, wall area, and volume',
      presetScenarios: [
        { name: 'Bedroom (12×10 ft, 9ft height)', icon: '🛏️', values: { unit: 'ft', L: 12, W: 10, H: 9 } },
        { name: 'Living (5×4 m, 2.8m)', icon: '🛋️', values: { unit: 'm', L: 5, W: 4, H: 2.8 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'L', label: 'Length', type: 'number', defaultValue: 12, min: 0, step: 0.01 },
        { name: 'W', label: 'Width', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'H', label: 'Height', type: 'number', defaultValue: 9, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const L = safeFloat(inputs.L);
        const W = safeFloat(inputs.W);
        const H = safeFloat(inputs.H);

        const floorArea = L * W;
        const perimeter = 2 * (L + W);
        const wallArea = perimeter * H;
        const volume = floorArea * H;

        const mFactor = unit === 'ft' ? 0.3048 : 1;
        const floorAreaM2 = floorArea * mFactor * mFactor;
        const volumeM3 = volume * mFactor * mFactor * mFactor;

        return {
          result: `${floorArea.toFixed(2)} ${unit}²`,
          explanation: 'Basic room sizing metrics for flooring/paint/HVAC estimation.',
          steps: [
            `Floor area = L×W = ${L.toFixed(2)}×${W.toFixed(2)} = ${floorArea.toFixed(2)} ${unit}²`,
            `Perimeter = 2(L+W) = ${perimeter.toFixed(2)} ${unit}`,
            `Wall area = perimeter×H = ${wallArea.toFixed(2)} ${unit}²`,
            `Room volume = floor area×H = ${volume.toFixed(2)} ${unit}³`,
            `≈ ${floorAreaM2.toFixed(2)} m²`,
            `≈ ${volumeM3.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Floor area (m²)', value: floorAreaM2 },
            { label: 'Volume (m³)', value: volumeM3 },
          ],
          tips: [
            '📌 For paint, subtract doors/windows from wall area.',
            '✅ For flooring, add 3–10% wastage depending on pattern.',
          ],
        };
      },
    };
  }

  if (id === 'excavation-calculator') {
    return {
      title: 'Excavation Calculator',
      description: 'Estimate excavation volume (cut) and loose volume (bulking factor)',
      presetScenarios: [
        { name: 'Footing pit (2×2×1m)', icon: '⛏️', values: { L: 2, W: 2, D: 1, bulking: 25, wastage: 5, densityKgPerM3: 1600 } },
        { name: 'Trench (20×0.6×1.2m)', icon: '🚧', values: { L: 20, W: 0.6, D: 1.2, bulking: 30, wastage: 5, densityKgPerM3: 1600 } },
      ],
      inputs: [
        { name: 'L', label: 'Length (m)', type: 'number', defaultValue: 20, min: 0, step: 0.01 },
        { name: 'W', label: 'Width (m)', type: 'number', defaultValue: 0.6, min: 0, step: 0.01 },
        { name: 'D', label: 'Depth (m)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
        { name: 'wastage', label: 'Extra (%)', type: 'slider', defaultValue: 5, min: 0, max: 30, step: 1 },
        { name: 'bulking', label: 'Bulking factor (%)', type: 'slider', defaultValue: 30, min: 0, max: 60, step: 1, helpText: 'Loose soil volume increase after excavation' },
        { name: 'densityKgPerM3', label: 'Soil density (kg/m³) (optional)', type: 'number', defaultValue: 1600, min: 0, step: 10 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.L);
        const W = safeFloat(inputs.W);
        const D = safeFloat(inputs.D);
        const extra = safeFloat(inputs.wastage);
        const bulking = safeFloat(inputs.bulking);
        const density = safeFloat(inputs.densityKgPerM3);

        const cutVol = L * W * D;
        const cutVolAdj = cutVol * (1 + extra / 100);
        const looseVol = cutVolAdj * (1 + bulking / 100);
        const massKg = density > 0 ? looseVol * density : 0;
        const tonnes = massKg / 1000;

        return {
          result: `${cutVolAdj.toFixed(3)} m³ (cut)`,
          explanation: 'Excavation cut volume with extra %; loose volume adds bulking factor.',
          steps: [
            `Cut volume = L×W×D = ${L.toFixed(2)}×${W.toFixed(2)}×${D.toFixed(2)} = ${cutVol.toFixed(3)} m³`,
            `Extra = ${extra.toFixed(0)}% → ${cutVolAdj.toFixed(3)} m³`,
            `Bulking = ${bulking.toFixed(0)}% → loose ≈ ${looseVol.toFixed(3)} m³`,
            density > 0 ? `Mass (optional) = ${looseVol.toFixed(3)}×${density.toFixed(0)} = ${massKg.toFixed(0)} kg (≈ ${tonnes.toFixed(2)} t)` : 'Mass: density not provided',
          ],
          visualData: [
            { label: 'Cut (m³)', value: cutVolAdj },
            { label: 'Loose (m³)', value: looseVol },
          ],
          tips: [
            '⚠️ Bulking depends on soil type and moisture; adjust per site.',
            '✅ Consider side slopes/shoring requirements separately.',
          ],
        };
      },
    };
  }

  if (id === 'tank-volume') {
    return {
      title: 'Tank Volume Calculator',
      description: 'Estimate tank capacity for rectangular or cylindrical tanks',
      presetScenarios: [
        { name: 'Cyl tank (d=1.2m, h=1.5m)', icon: '🛢️', values: { shape: 'Cylindrical', lengthM: 0, widthM: 0, heightM: 1.5, diameterM: 1.2 } },
        { name: 'Rect tank (2×1×1m)', icon: '💧', values: { shape: 'Rectangular', lengthM: 2, widthM: 1, heightM: 1, diameterM: 0 } },
      ],
      inputs: [
        { name: 'shape', label: 'Shape', type: 'select', options: ['Rectangular', 'Cylindrical'], defaultValue: 'Rectangular' },
        { name: 'lengthM', label: 'Length (m) (rectangular)', type: 'number', defaultValue: 2, min: 0, step: 0.01 },
        { name: 'widthM', label: 'Width (m) (rectangular)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'heightM', label: 'Water height (m)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'diameterM', label: 'Diameter (m) (cylindrical)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Rectangular';
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const H = safeFloat(inputs.heightM);
        const d = safeFloat(inputs.diameterM);

        let volumeM3 = 0;
        let formula = '';

        if (shape === 'Cylindrical') {
          const r = d / 2;
          volumeM3 = Math.PI * r * r * H;
          formula = 'V = πr²h';
        } else {
          volumeM3 = L * W * H;
          formula = 'V = L×W×H';
        }

        const liters = volumeM3 * 1000;

        return {
          result: `${liters.toFixed(0)} liters`,
          explanation: 'Tank volume from dimensions; liters = m³ × 1000.',
          formula,
          steps: [
            `Volume = ${volumeM3.toFixed(3)} m³`,
            `Capacity = ${liters.toFixed(0)} L`,
          ],
          visualData: [
            { label: 'Volume (m³)', value: volumeM3 },
            { label: 'Liters', value: liters },
          ],
          tips: ['📌 For usable capacity, subtract freeboard and inlet/outlet space.'],
        };
      },
    };
  }

  if (id === 'pyramid-volume') {
    return {
      title: 'Pyramid Volume Calculator',
      description: 'Volume of a pyramid from base dimensions and height',
      presetScenarios: [
        { name: 'Square base 2m, h=3m', icon: '🔺', values: { base: 'Square', lengthM: 2, widthM: 2, heightM: 3 } },
        { name: 'Rect base 3×2m, h=2m', icon: '📐', values: { base: 'Rectangle', lengthM: 3, widthM: 2, heightM: 2 } },
      ],
      inputs: [
        { name: 'base', label: 'Base shape', type: 'select', options: ['Square', 'Rectangle'], defaultValue: 'Square' },
        { name: 'lengthM', label: 'Base length (m)', type: 'number', defaultValue: 2, min: 0, step: 0.01 },
        { name: 'widthM', label: 'Base width (m)', type: 'number', defaultValue: 2, min: 0, step: 0.01 },
        { name: 'heightM', label: 'Height (m)', type: 'number', defaultValue: 3, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const base = inputs.base || 'Square';
        const L = safeFloat(inputs.lengthM);
        const W = base === 'Square' ? L : safeFloat(inputs.widthM);
        const H = safeFloat(inputs.heightM);
        const baseArea = L * W;
        const volume = (1 / 3) * baseArea * H;

        return {
          result: `${volume.toFixed(3)} m³`,
          explanation: 'Pyramid volume from one-third of base area times height.',
          formula: 'V = (1/3) × (base area) × h',
          steps: [
            `Base = ${base}, base area = ${L.toFixed(2)}×${W.toFixed(2)} = ${baseArea.toFixed(3)} m²`,
            `Height = ${H.toFixed(2)} m`,
            `Volume = (1/3)×${baseArea.toFixed(3)}×${H.toFixed(2)} = ${volume.toFixed(3)} m³`,
          ],
          visualData: [{ label: 'Volume (m³)', value: volume }],
          tips: ['✅ Useful for earthworks or pyramid-shaped fills.'],
        };
      },
    };
  }

  // FINISHING WORK (ADVANCED)
  if (id === 'carpet-calculator') {
    return {
      title: 'Carpet Area Calculator',
      description: 'Estimate carpet required from floor area (with wastage) and optional cost',
      presetScenarios: [
        { name: 'Bedroom (12×10 ft)', icon: '🛏️', values: { unit: 'ft', length: 12, width: 10, wastage: 7, costPerSqFt: 0 } },
        { name: 'Hall (5×4 m)', icon: '🏠', values: { unit: 'm', length: 5, width: 4, wastage: 10, costPerSqFt: 0 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'length', label: 'Length', type: 'number', defaultValue: 12, min: 0, step: 0.01 },
        { name: 'width', label: 'Width', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'wastage', label: 'Wastage/Cuts (%)', type: 'slider', defaultValue: 7, min: 0, max: 25, step: 1 },
        { name: 'costPerSqFt', label: 'Rate (per sq ft) (optional)', type: 'number', defaultValue: 0, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const wastage = safeFloat(inputs.wastage);
        const ratePerSqFt = safeFloat(inputs.costPerSqFt);

        const areaUnit2 = L * W;
        const areaWithWastageUnit2 = areaUnit2 * (1 + wastage / 100);

        const areaM2 = unit === 'm' ? areaWithWastageUnit2 : areaWithWastageUnit2 / 10.7639;
        const areaSqFt = unit === 'ft' ? areaWithWastageUnit2 : areaWithWastageUnit2 * 10.7639;

        const estimatedCost = ratePerSqFt > 0 ? areaSqFt * ratePerSqFt : 0;

        return {
          result: `${areaWithWastageUnit2.toFixed(2)} ${unit}²`,
          explanation: 'Carpet quantity equals floor area plus wastage allowance.',
          steps: [
            `Floor area = ${L.toFixed(2)}×${W.toFixed(2)} = ${areaUnit2.toFixed(2)} ${unit}²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaWithWastageUnit2.toFixed(2)} ${unit}²`,
            `≈ ${areaM2.toFixed(2)} m²`,
            `≈ ${areaSqFt.toFixed(2)} sq ft`,
            ratePerSqFt > 0 ? `Cost ≈ ${areaSqFt.toFixed(2)} × ${ratePerSqFt.toFixed(2)} = ₹${estimatedCost.toFixed(0)}` : 'Cost: rate not provided',
          ],
          visualData: [
            { label: 'Area (m²)', value: areaM2 },
            { label: 'Area (sq ft)', value: areaSqFt },
          ],
          tips: [
            '✅ Increase wastage for patterned carpets and many corners.',
            '📌 If using carpet rolls, seam layout may increase waste further.',
          ],
        };
      },
    };
  }

  if (id === 'ceiling-calculator') {
    return {
      title: 'False Ceiling Calculator',
      description: 'Estimate ceiling area, perimeter, and panel count (approx.)',
      presetScenarios: [
        { name: 'Room (12×10 ft)', icon: '🏠', values: { unit: 'ft', length: 12, width: 10, wastage: 5, panelSize: '2×2 ft' } },
        { name: 'Hall (6×4 m)', icon: '🏢', values: { unit: 'm', length: 6, width: 4, wastage: 7, panelSize: '600×600 mm' } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'length', label: 'Length', type: 'number', defaultValue: 12, min: 0, step: 0.01 },
        { name: 'width', label: 'Width', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'panelSize', label: 'Panel size', type: 'select', options: ['2×2 ft', '2×4 ft', '600×600 mm'], defaultValue: '2×2 ft' },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const panelSize = inputs.panelSize || '2×2 ft';
        const wastage = safeFloat(inputs.wastage);

        const areaUnit2 = L * W;
        const areaAdj = areaUnit2 * (1 + wastage / 100);
        const perimeterUnit = 2 * (L + W);

        let panelAreaUnit2 = 0;
        if (unit === 'm') {
          if (panelSize === '600×600 mm') panelAreaUnit2 = 0.6 * 0.6;
          else if (panelSize === '2×4 ft') panelAreaUnit2 = (2 * 0.3048) * (4 * 0.3048);
          else panelAreaUnit2 = (2 * 0.3048) * (2 * 0.3048);
        } else {
          if (panelSize === '600×600 mm') panelAreaUnit2 = (0.6 / 0.3048) * (0.6 / 0.3048);
          else if (panelSize === '2×4 ft') panelAreaUnit2 = 2 * 4;
          else panelAreaUnit2 = 2 * 2;
        }

        const panels = panelAreaUnit2 > 0 ? Math.ceil(areaAdj / panelAreaUnit2) : 0;

        const areaM2 = unit === 'm' ? areaAdj : areaAdj / 10.7639;

        return {
          result: `${areaAdj.toFixed(2)} ${unit}²`,
          explanation: 'Ceiling estimate: area + wastage and approximate panel count.',
          steps: [
            `Ceiling area = ${L.toFixed(2)}×${W.toFixed(2)} = ${areaUnit2.toFixed(2)} ${unit}²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdj.toFixed(2)} ${unit}²`,
            `Perimeter = 2(L+W) = ${perimeterUnit.toFixed(2)} ${unit}`,
            `Panel size = ${panelSize} → panel area ≈ ${panelAreaUnit2.toFixed(2)} ${unit}²`,
            `Panels ≈ ceil(${areaAdj.toFixed(2)} / ${panelAreaUnit2.toFixed(2)}) = ${panels}`,
            `≈ ${areaM2.toFixed(2)} m²`,
          ],
          visualData: [
            { label: 'Area (m²)', value: areaM2 },
            { label: 'Panels', value: panels },
          ],
          tips: [
            '📌 Grid/edge cutting can increase wastage for small rooms.',
            '✅ Add extra for coves, bulkheads, and light cutouts.',
          ],
        };
      },
    };
  }

  if (id === 'flooring-calculator') {
    return {
      title: 'Flooring Material Calculator',
      description: 'Estimate flooring quantity in boxes from floor area and coverage per box',
      presetScenarios: [
        { name: 'Room 200 sq ft', icon: '🧱', values: { unit: 'ft', area: 200, coveragePerBoxM2: 1.5, wastage: 8 } },
        { name: 'Hall 30 m²', icon: '🏠', values: { unit: 'm', area: 30, coveragePerBoxM2: 2.0, wastage: 10 } },
      ],
      inputs: [
        { name: 'unit', label: 'Area unit', type: 'select', options: ['m²', 'sq ft'], defaultValue: 'sq ft' },
        { name: 'area', label: 'Floor Area', type: 'number', defaultValue: 200, min: 0, step: 0.1 },
        { name: 'coveragePerBoxM2', label: 'Coverage per Box (m²)', type: 'number', defaultValue: 1.5, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 8, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'sq ft';
        const areaInput = safeFloat(inputs.area);
        const coveragePerBoxM2 = safeFloat(inputs.coveragePerBoxM2);
        const wastage = safeFloat(inputs.wastage);

        const areaM2 = unit === 'm²' ? areaInput : areaInput / 10.7639;
        const areaAdjM2 = areaM2 * (1 + wastage / 100);
        const boxes = coveragePerBoxM2 > 0 ? Math.ceil(areaAdjM2 / coveragePerBoxM2) : 0;

        return {
          result: `${boxes} boxes`,
          explanation: 'Boxes = ceil((area × (1+wastage)) / coveragePerBox).',
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdjM2.toFixed(2)} m²`,
            `Coverage/box = ${coveragePerBoxM2.toFixed(2)} m²`,
            `Boxes = ceil(${areaAdjM2.toFixed(2)} / ${coveragePerBoxM2.toFixed(2)}) = ${boxes}`,
          ],
          visualData: [
            { label: 'Area (m²)', value: areaAdjM2 },
            { label: 'Boxes', value: boxes },
          ],
          tips: [
            '✅ Use 10–15% wastage for diagonal patterns.',
            '📌 Check if box coverage already includes spacing/groove allowances.',
          ],
        };
      },
    };
  }

  if (id === 'laminate-flooring') {
    return {
      title: 'Laminate Flooring Calculator',
      description: 'Estimate laminate boxes needed from area and box coverage',
      presetScenarios: [
        { name: '25 m² room', icon: '🪵', values: { unit: 'm²', area: 25, boxCoverageM2: 1.8, wastage: 10 } },
        { name: '300 sq ft room', icon: '🏠', values: { unit: 'sq ft', area: 300, boxCoverageM2: 1.8, wastage: 12 } },
      ],
      inputs: [
        { name: 'unit', label: 'Area unit', type: 'select', options: ['m²', 'sq ft'], defaultValue: 'm²' },
        { name: 'area', label: 'Floor Area', type: 'number', defaultValue: 25, min: 0, step: 0.1 },
        { name: 'boxCoverageM2', label: 'Box coverage (m²)', type: 'number', defaultValue: 1.8, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'm²';
        const areaInput = safeFloat(inputs.area);
        const boxCoverage = safeFloat(inputs.boxCoverageM2);
        const wastage = safeFloat(inputs.wastage);

        const areaM2 = unit === 'm²' ? areaInput : areaInput / 10.7639;
        const areaAdjM2 = areaM2 * (1 + wastage / 100);
        const boxes = boxCoverage > 0 ? Math.ceil(areaAdjM2 / boxCoverage) : 0;

        return {
          result: `${boxes} boxes`,
          explanation: 'Laminate boxes estimated from total area including wastage.',
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdjM2.toFixed(2)} m²`,
            `Box coverage = ${boxCoverage.toFixed(2)} m²`,
            `Boxes = ${boxes}`,
          ],
          visualData: [
            { label: 'Area (m²)', value: areaAdjM2 },
            { label: 'Boxes', value: boxes },
          ],
          tips: ['📌 Add underlayment separately; box coverage usually excludes it.'],
        };
      },
    };
  }

  if (id === 'molding-calculator') {
    return {
      title: 'Crown Molding Calculator',
      description: 'Estimate molding length, pieces, and cuts allowance',
      presetScenarios: [
        { name: 'Room 12×10 ft', icon: '📏', values: { unit: 'ft', length: 12, width: 10, doorCount: 1, doorWidth: 3, pieceLength: 8, wastage: 10 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 12, min: 0, step: 0.01 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'doorCount', label: 'Doors (count)', type: 'slider', defaultValue: 1, min: 0, max: 10, step: 1 },
        { name: 'doorWidth', label: 'Door width (unit)', type: 'number', defaultValue: 3, min: 0, step: 0.01 },
        { name: 'pieceLength', label: 'Molding piece length (unit)', type: 'number', defaultValue: 8, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Cuts/Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const doors = Math.max(0, Math.round(safeFloat(inputs.doorCount) || 0));
        const doorWidth = safeFloat(inputs.doorWidth);
        const piece = safeFloat(inputs.pieceLength);
        const wastage = safeFloat(inputs.wastage);

        const perimeter = 2 * (L + W);
        const openings = doors * doorWidth;
        const net = Math.max(0, perimeter - openings);
        const adj = net * (1 + wastage / 100);
        const pieces = piece > 0 ? Math.ceil(adj / piece) : 0;

        const meters = unit === 'm' ? adj : adj * 0.3048;

        return {
          result: `${adj.toFixed(2)} ${unit}`,
          explanation: 'Molding length is room perimeter minus openings, plus wastage.',
          steps: [
            `Perimeter = 2(L+W) = ${perimeter.toFixed(2)} ${unit}`,
            `Openings = doors×width = ${doors}×${doorWidth.toFixed(2)} = ${openings.toFixed(2)} ${unit}`,
            `Net = ${net.toFixed(2)} ${unit}`,
            `Wastage = ${wastage.toFixed(0)}% → ${adj.toFixed(2)} ${unit}`,
            `Pieces = ceil(${adj.toFixed(2)} / ${piece.toFixed(2)}) = ${pieces}`,
            `≈ ${meters.toFixed(2)} m`,
          ],
          visualData: [
            { label: 'Length (m)', value: meters },
            { label: 'Pieces', value: pieces },
          ],
          tips: ['✅ Add extra for outside corners and complex joints.'],
        };
      },
    };
  }

  if (id === 'paving-calculator') {
    return {
      title: 'Paving Block Calculator',
      description: 'Estimate paver block count from area and paver size (approx.)',
      presetScenarios: [
        { name: 'Driveway 30 m²', icon: '🧱', values: { areaM2: 30, paverLengthMm: 200, paverWidthMm: 100, wastage: 7 } },
        { name: 'Walkway 100 m²', icon: '🚶', values: { areaM2: 100, paverLengthMm: 200, paverWidthMm: 200, wastage: 5 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Area (m²)', type: 'number', defaultValue: 30, min: 0, step: 0.1 },
        { name: 'paverLengthMm', label: 'Paver length (mm)', type: 'number', defaultValue: 200, min: 10, step: 1 },
        { name: 'paverWidthMm', label: 'Paver width (mm)', type: 'number', defaultValue: 100, min: 10, step: 1 },
        { name: 'wastage', label: 'Wastage/Cuts (%)', type: 'slider', defaultValue: 7, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const areaM2 = safeFloat(inputs.areaM2);
        const lMm = safeFloat(inputs.paverLengthMm);
        const wMm = safeFloat(inputs.paverWidthMm);
        const wastage = safeFloat(inputs.wastage);

        const paverArea = (lMm / 1000) * (wMm / 1000);
        const areaAdj = areaM2 * (1 + wastage / 100);
        const count = paverArea > 0 ? Math.ceil(areaAdj / paverArea) : 0;

        return {
          result: `${count} blocks`,
          explanation: 'Block count from adjusted area divided by single paver area.',
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdj.toFixed(2)} m²`,
            `Paver area = ${(lMm / 1000).toFixed(3)}×${(wMm / 1000).toFixed(3)} = ${paverArea.toFixed(4)} m²`,
            `Blocks = ceil(${areaAdj.toFixed(2)} / ${paverArea.toFixed(4)}) = ${count}`,
          ],
          visualData: [
            { label: 'Blocks', value: count },
            { label: 'Area (m²)', value: areaAdj },
          ],
          tips: ['📌 Joint gaps and laying pattern can change actual counts.'],
        };
      },
    };
  }

  if (id === 'skirting-calculator') {
    return {
      title: 'Skirting Calculator',
      description: 'Estimate skirting length and pieces from room perimeter (minus doors)',
      presetScenarios: [
        { name: 'Room 12×10 ft', icon: '📏', values: { unit: 'ft', length: 12, width: 10, doorCount: 1, doorWidth: 3, pieceLength: 2.5, wastage: 8 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'ft' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 12, min: 0, step: 0.01 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'doorCount', label: 'Doors (count)', type: 'slider', defaultValue: 1, min: 0, max: 10, step: 1 },
        { name: 'doorWidth', label: 'Door width (unit)', type: 'number', defaultValue: 3, min: 0, step: 0.01 },
        { name: 'pieceLength', label: 'Skirting piece length (unit)', type: 'number', defaultValue: 2.5, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 8, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const doors = Math.max(0, Math.round(safeFloat(inputs.doorCount) || 0));
        const doorWidth = safeFloat(inputs.doorWidth);
        const piece = safeFloat(inputs.pieceLength);
        const wastage = safeFloat(inputs.wastage);

        const perimeter = 2 * (L + W);
        const openings = doors * doorWidth;
        const net = Math.max(0, perimeter - openings);
        const adj = net * (1 + wastage / 100);
        const pieces = piece > 0 ? Math.ceil(adj / piece) : 0;

        const meters = unit === 'm' ? adj : adj * 0.3048;

        return {
          result: `${adj.toFixed(2)} ${unit}`,
          explanation: 'Skirting length equals room perimeter minus doors, plus wastage.',
          steps: [
            `Perimeter = ${perimeter.toFixed(2)} ${unit}`,
            `Doors = ${doors} × ${doorWidth.toFixed(2)} = ${openings.toFixed(2)} ${unit}`,
            `Net skirting = ${net.toFixed(2)} ${unit}`,
            `Wastage = ${wastage.toFixed(0)}% → ${adj.toFixed(2)} ${unit}`,
            `Pieces = ceil(${adj.toFixed(2)} / ${piece.toFixed(2)}) = ${pieces}`,
          ],
          visualData: [
            { label: 'Length (m)', value: meters },
            { label: 'Pieces', value: pieces },
          ],
          tips: ['✅ For many corners, use a higher wastage percent.'],
        };
      },
    };
  }

  if (id === 'trim-calculator') {
    return {
      title: 'Baseboard Trim Calculator',
      description: 'Estimate trim length and pieces from perimeter (minus doors)',
      presetScenarios: [
        { name: 'Room 5×4 m', icon: '📏', values: { unit: 'm', length: 5, width: 4, doorCount: 1, doorWidth: 0.9, pieceLength: 2.4, wastage: 10 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'm' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
        { name: 'doorCount', label: 'Doors (count)', type: 'slider', defaultValue: 1, min: 0, max: 10, step: 1 },
        { name: 'doorWidth', label: 'Door width (unit)', type: 'number', defaultValue: 0.9, min: 0, step: 0.01 },
        { name: 'pieceLength', label: 'Trim piece length (unit)', type: 'number', defaultValue: 2.4, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Cuts/Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'm';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const doors = Math.max(0, Math.round(safeFloat(inputs.doorCount) || 0));
        const doorWidth = safeFloat(inputs.doorWidth);
        const piece = safeFloat(inputs.pieceLength);
        const wastage = safeFloat(inputs.wastage);

        const perimeter = 2 * (L + W);
        const openings = doors * doorWidth;
        const net = Math.max(0, perimeter - openings);
        const adj = net * (1 + wastage / 100);
        const pieces = piece > 0 ? Math.ceil(adj / piece) : 0;

        const meters = unit === 'm' ? adj : adj * 0.3048;

        return {
          result: `${adj.toFixed(2)} ${unit}`,
          explanation: 'Baseboard trim required along walls excluding door openings.',
          steps: [
            `Perimeter = ${perimeter.toFixed(2)} ${unit}`,
            `Doors = ${doors} × ${doorWidth.toFixed(2)} = ${openings.toFixed(2)} ${unit}`,
            `Net = ${net.toFixed(2)} ${unit}`,
            `Wastage = ${wastage.toFixed(0)}% → ${adj.toFixed(2)} ${unit}`,
            `Pieces = ${pieces}`,
          ],
          visualData: [
            { label: 'Length (m)', value: meters },
            { label: 'Pieces', value: pieces },
          ],
          tips: ['📌 Consider additional trim for closets and niches if applicable.'],
        };
      },
    };
  }

  if (id === 'vinyl-flooring') {
    return {
      title: 'Vinyl Flooring Calculator',
      description: 'Estimate vinyl required (area-based) and boxes/roll coverage (approx.)',
      presetScenarios: [
        { name: 'Room 18 m²', icon: '🧩', values: { unit: 'm²', area: 18, coveragePerUnitM2: 2.5, wastage: 8 } },
        { name: 'Room 250 sq ft', icon: '🏠', values: { unit: 'sq ft', area: 250, coveragePerUnitM2: 2.5, wastage: 10 } },
      ],
      inputs: [
        { name: 'unit', label: 'Area unit', type: 'select', options: ['m²', 'sq ft'], defaultValue: 'm²' },
        { name: 'area', label: 'Floor Area', type: 'number', defaultValue: 18, min: 0, step: 0.1 },
        { name: 'coveragePerUnitM2', label: 'Coverage per box/roll (m²)', type: 'number', defaultValue: 2.5, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 8, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'm²';
        const areaInput = safeFloat(inputs.area);
        const coverage = safeFloat(inputs.coveragePerUnitM2);
        const wastage = safeFloat(inputs.wastage);

        const areaM2 = unit === 'm²' ? areaInput : areaInput / 10.7639;
        const areaAdj = areaM2 * (1 + wastage / 100);
        const units = coverage > 0 ? Math.ceil(areaAdj / coverage) : 0;

        return {
          result: `${units} units`,
          explanation: 'Units (boxes/rolls) estimated from adjusted area and per-unit coverage.',
          steps: [
            `Area = ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdj.toFixed(2)} m²`,
            `Coverage/unit = ${coverage.toFixed(2)} m²`,
            `Units = ${units}`,
          ],
          visualData: [
            { label: 'Area (m²)', value: areaAdj },
            { label: 'Units', value: units },
          ],
          tips: ['✅ Add more wastage for complex layouts and pattern matching.'],
        };
      },
    };
  }

  if (id === 'wallpaper-calculator') {
    return {
      title: 'Wallpaper Calculator',
      description: 'Estimate wallpaper rolls from wall area and roll coverage (approx.)',
      presetScenarios: [
        { name: 'Room 12×10 ft, 9ft height', icon: '🧱', values: { unit: 'ft', length: 12, width: 10, height: 9, doors: 1, windows: 2, doorArea: 21, windowArea: 16, rollWidth: 0.53, rollLength: 10, wastage: 10 } },
        { name: 'Room 5×4 m, 2.8m', icon: '🏠', values: { unit: 'm', length: 5, width: 4, height: 2.8, doors: 1, windows: 2, doorArea: 2.0, windowArea: 1.5, rollWidth: 0.53, rollLength: 10, wastage: 12 } },
      ],
      inputs: [
        { name: 'unit', label: 'Unit', type: 'select', options: ['m', 'ft'], defaultValue: 'm' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 5, min: 0, step: 0.01 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 4, min: 0, step: 0.01 },
        { name: 'height', label: 'Wall height', type: 'number', defaultValue: 2.8, min: 0, step: 0.01 },
        { name: 'doors', label: 'Doors (count)', type: 'slider', defaultValue: 1, min: 0, max: 20, step: 1 },
        { name: 'windows', label: 'Windows (count)', type: 'slider', defaultValue: 2, min: 0, max: 30, step: 1 },
        { name: 'doorArea', label: 'Single door area (m²) or (ft²)', type: 'number', defaultValue: 2.0, min: 0, step: 0.1 },
        { name: 'windowArea', label: 'Single window area (m²) or (ft²)', type: 'number', defaultValue: 1.5, min: 0, step: 0.1 },
        { name: 'rollWidth', label: 'Roll width (m)', type: 'number', defaultValue: 0.53, min: 0.1, step: 0.01 },
        { name: 'rollLength', label: 'Roll length (m)', type: 'number', defaultValue: 10, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Pattern/Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'm';
        const L = safeFloat(inputs.length);
        const W = safeFloat(inputs.width);
        const H = safeFloat(inputs.height);
        const doors = Math.max(0, Math.round(safeFloat(inputs.doors) || 0));
        const windows = Math.max(0, Math.round(safeFloat(inputs.windows) || 0));
        const doorArea = safeFloat(inputs.doorArea);
        const windowArea = safeFloat(inputs.windowArea);
        const rollW = safeFloat(inputs.rollWidth);
        const rollL = safeFloat(inputs.rollLength);
        const wastage = safeFloat(inputs.wastage);

        const perimeter = 2 * (L + W);
        const wallAreaUnit2 = perimeter * H;
        const openingsUnit2 = doors * doorArea + windows * windowArea;
        const netWallAreaUnit2 = Math.max(0, wallAreaUnit2 - openingsUnit2);

        const areaM2 = unit === 'm' ? netWallAreaUnit2 : netWallAreaUnit2 / 10.7639;
        const areaAdjM2 = areaM2 * (1 + wastage / 100);

        const rollArea = rollW * rollL;
        const rolls = rollArea > 0 ? Math.ceil(areaAdjM2 / rollArea) : 0;

        return {
          result: `${rolls} rolls`,
          explanation: 'Wallpaper rolls estimated from net wall area (minus openings) plus wastage.',
          steps: [
            `Wall area = perimeter×height = ${wallAreaUnit2.toFixed(2)} ${unit}²`,
            `Openings = ${openingsUnit2.toFixed(2)} ${unit}² → net = ${netWallAreaUnit2.toFixed(2)} ${unit}²`,
            `Net ≈ ${areaM2.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${areaAdjM2.toFixed(2)} m²`,
            `Roll area = ${rollW.toFixed(2)}×${rollL.toFixed(2)} = ${rollArea.toFixed(2)} m²`,
            `Rolls = ceil(${areaAdjM2.toFixed(2)} / ${rollArea.toFixed(2)}) = ${rolls}`,
          ],
          visualData: [
            { label: 'Net area (m²)', value: areaM2 },
            { label: 'Rolls', value: rolls },
          ],
          tips: [
            '✅ Pattern repeats often require higher wastage.',
            '📌 For best accuracy, calculate strips per roll using wall height.',
          ],
        };
      },
    };
  }

  if (id === 'window-calculator') {
    return {
      title: 'Window & Door Calculator',
      description: 'Compute total opening area for windows and doors (useful for paint/wallpaper/glass estimates)',
      presetScenarios: [
        { name: '2 windows + 1 door', icon: '🚪', values: { windowCount: 2, windowWidthM: 1.2, windowHeightM: 1.2, doorCount: 1, doorWidthM: 0.9, doorHeightM: 2.1 } },
      ],
      inputs: [
        { name: 'windowCount', label: 'Windows (count)', type: 'slider', defaultValue: 2, min: 0, max: 50, step: 1 },
        { name: 'windowWidthM', label: 'Window width (m)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
        { name: 'windowHeightM', label: 'Window height (m)', type: 'number', defaultValue: 1.2, min: 0, step: 0.01 },
        { name: 'doorCount', label: 'Doors (count)', type: 'slider', defaultValue: 1, min: 0, max: 20, step: 1 },
        { name: 'doorWidthM', label: 'Door width (m)', type: 'number', defaultValue: 0.9, min: 0, step: 0.01 },
        { name: 'doorHeightM', label: 'Door height (m)', type: 'number', defaultValue: 2.1, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const wCount = Math.max(0, Math.round(safeFloat(inputs.windowCount) || 0));
        const ww = safeFloat(inputs.windowWidthM);
        const wh = safeFloat(inputs.windowHeightM);
        const dCount = Math.max(0, Math.round(safeFloat(inputs.doorCount) || 0));
        const dw = safeFloat(inputs.doorWidthM);
        const dh = safeFloat(inputs.doorHeightM);

        const windowArea = wCount * ww * wh;
        const doorArea = dCount * dw * dh;
        const total = windowArea + doorArea;

        return {
          result: `${total.toFixed(2)} m²`,
          explanation: 'Total opening area from window and door dimensions.',
          steps: [
            `Windows = ${wCount} × ${ww.toFixed(2)} × ${wh.toFixed(2)} = ${windowArea.toFixed(2)} m²`,
            `Doors = ${dCount} × ${dw.toFixed(2)} × ${dh.toFixed(2)} = ${doorArea.toFixed(2)} m²`,
            `Total openings = ${total.toFixed(2)} m²`,
          ],
          visualData: [
            { label: 'Windows (m²)', value: windowArea },
            { label: 'Doors (m²)', value: doorArea },
          ],
          tips: ['✅ Use this to subtract openings from wall area calculations.'],
        };
      },
    };
  }

  // COST ESTIMATION (ADVANCED)
  if (id === 'per-sqft-cost') {
    return {
      title: 'Per Sq Ft Rate Calculator',
      description: 'Compute total project cost from built-up area and per-sq-ft rate',
      presetScenarios: [
        { name: '1500 sq ft @ ₹2000/sq ft', icon: '💰', values: { areaSqFt: 1500, ratePerSqFt: 2000, contingency: 5 } },
      ],
      inputs: [
        { name: 'areaSqFt', label: 'Built-up Area (sq ft)', type: 'number', defaultValue: 1500, min: 0, step: 1 },
        { name: 'ratePerSqFt', label: 'Rate (₹/sq ft)', type: 'number', defaultValue: 2000, min: 0, step: 10 },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.ratePerSqFt);
        const cont = safeFloat(inputs.contingency);

        const base = area * rate;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Total cost estimated from per-sq-ft rate plus contingency.',
          formula: 'Total = Area × Rate × (1 + Cont%/100)',
          steps: [
            `Base = ${area.toFixed(0)} × ${rate.toFixed(0)} = ₹${base.toFixed(0)}`,
            `Contingency = ${cont.toFixed(0)}% → Total = ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['📌 Rates vary by city, finish level, and structure type.'],
        };
      },
    };
  }

  if (id === 'material-cost') {
    return {
      title: 'Material Cost Estimator',
      description: 'Estimate material cost from quantity × unit rate with wastage',
      presetScenarios: [
        { name: 'Tiles 250 sq ft @ ₹90', icon: '🧱', values: { quantity: 250, unit: 'sq ft', rate: 90, wastage: 10 } },
        { name: 'Paint 80 m² @ ₹55', icon: '🎨', values: { quantity: 80, unit: 'm²', rate: 55, wastage: 5 } },
      ],
      inputs: [
        { name: 'quantity', label: 'Quantity', type: 'number', defaultValue: 250, min: 0, step: 0.1 },
        { name: 'unit', label: 'Unit (label)', type: 'select', options: ['sq ft', 'm²', 'm³', 'kg', 'unit'], defaultValue: 'sq ft' },
        { name: 'rate', label: 'Rate (₹ per unit)', type: 'number', defaultValue: 90, min: 0, step: 1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const qty = safeFloat(inputs.quantity);
        const unit = inputs.unit || 'unit';
        const rate = safeFloat(inputs.rate);
        const wastage = safeFloat(inputs.wastage);

        const qtyAdj = qty * (1 + wastage / 100);
        const cost = qtyAdj * rate;

        return {
          result: `₹${cost.toFixed(0)}`,
          explanation: 'Adds wastage to quantity and multiplies by unit rate.',
          formula: 'Cost = Quantity × (1 + Wastage%/100) × Rate',
          steps: [
            `Quantity = ${qty.toFixed(2)} ${unit}`,
            `Wastage = ${wastage.toFixed(0)}% → ${qtyAdj.toFixed(2)} ${unit}`,
            `Cost = ${qtyAdj.toFixed(2)} × ₹${rate.toFixed(2)} = ₹${cost.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Adjusted qty', value: qtyAdj },
            { label: 'Cost (₹)', value: cost },
          ],
          tips: ['✅ Keep a separate line item for transport and handling if needed.'],
        };
      },
    };
  }

  if (id === 'labor-cost') {
    return {
      title: 'Labor Cost Calculator',
      description: 'Estimate labor cost from number of workers, days, and daily rate',
      presetScenarios: [
        { name: '6 workers × 15 days', icon: '👷', values: { workers: 6, days: 15, dailyRate: 900, overhead: 10 } },
      ],
      inputs: [
        { name: 'workers', label: 'Workers', type: 'slider', defaultValue: 6, min: 1, max: 200, step: 1 },
        { name: 'days', label: 'Days', type: 'number', defaultValue: 15, min: 0, step: 1 },
        { name: 'dailyRate', label: 'Daily rate (₹/worker/day)', type: 'number', defaultValue: 900, min: 0, step: 10 },
        { name: 'overhead', label: 'Overhead (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const workers = Math.max(1, Math.round(safeFloat(inputs.workers) || 1));
        const days = safeFloat(inputs.days);
        const rate = safeFloat(inputs.dailyRate);
        const overhead = safeFloat(inputs.overhead);

        const base = workers * days * rate;
        const total = base * (1 + overhead / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Labor cost = workers × days × rate plus overhead.',
          formula: 'Total = Workers × Days × Rate × (1 + Overhead%/100)',
          steps: [
            `Base = ${workers} × ${days.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${base.toFixed(0)}`,
            `Overhead = ${overhead.toFixed(0)}% → Total = ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['📌 Overhead can include supervisor, tools, safety, and small consumables.'],
        };
      },
    };
  }

  if (id === 'contractor-margin') {
    return {
      title: 'Contractor Margin Calculator',
      description: 'Add contractor margin and tax/charges to a base estimate',
      presetScenarios: [
        { name: '₹25L base', icon: '🧾', values: { baseCost: 2500000, marginPercent: 12, additionalChargesPercent: 5 } },
      ],
      inputs: [
        { name: 'baseCost', label: 'Base cost (₹)', type: 'number', defaultValue: 2500000, min: 0, step: 1000 },
        { name: 'marginPercent', label: 'Contractor margin (%)', type: 'slider', defaultValue: 12, min: 0, max: 30, step: 1 },
        { name: 'additionalChargesPercent', label: 'Additional charges/tax (%)', type: 'slider', defaultValue: 5, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const base = safeFloat(inputs.baseCost);
        const marginP = safeFloat(inputs.marginPercent);
        const addP = safeFloat(inputs.additionalChargesPercent);

        const marginAmt = base * (marginP / 100);
        const subTotal = base + marginAmt;
        const addAmt = subTotal * (addP / 100);
        const total = subTotal + addAmt;

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Applies margin first, then additional charges on the subtotal.',
          steps: [
            `Base = ₹${base.toFixed(0)}`,
            `Margin (${marginP.toFixed(0)}%) = ₹${marginAmt.toFixed(0)} → Subtotal = ₹${subTotal.toFixed(0)}`,
            `Charges (${addP.toFixed(0)}%) = ₹${addAmt.toFixed(0)} → Total = ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['✅ Confirm whether taxes are applied before/after margin in your contract.'],
        };
      },
    };
  }

  if (id === 'architect-fee') {
    return {
      title: 'Architect Fee Calculator',
      description: 'Estimate architect fee as a percentage of project cost (or per-sq-ft)',
      presetScenarios: [
        { name: '5% of ₹40L', icon: '📐', values: { mode: 'Percent', projectCost: 4000000, feePercent: 5, areaSqFt: 2000, ratePerSqFt: 0 } },
        { name: '₹80/sq ft of 2500 sq ft', icon: '🏗️', values: { mode: 'Per sq ft', projectCost: 0, feePercent: 0, areaSqFt: 2500, ratePerSqFt: 80 } },
      ],
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: ['Percent', 'Per sq ft'], defaultValue: 'Percent' },
        { name: 'projectCost', label: 'Project cost (₹)', type: 'number', defaultValue: 4000000, min: 0, step: 1000 },
        { name: 'feePercent', label: 'Fee (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
        { name: 'areaSqFt', label: 'Area (sq ft)', type: 'number', defaultValue: 2000, min: 0, step: 1 },
        { name: 'ratePerSqFt', label: 'Rate (₹/sq ft)', type: 'number', defaultValue: 80, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'Percent';
        const projectCost = safeFloat(inputs.projectCost);
        const feeP = safeFloat(inputs.feePercent);
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.ratePerSqFt);

        const fee = mode === 'Per sq ft' ? area * rate : projectCost * (feeP / 100);

        return {
          result: `₹${fee.toFixed(0)}`,
          explanation: 'Architect fees vary by scope: concept + drawings + site visits + approvals.',
          steps: [
            mode === 'Per sq ft'
              ? `Fee = ${area.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${fee.toFixed(0)}`
              : `Fee = ₹${projectCost.toFixed(0)} × ${feeP.toFixed(0)}% = ₹${fee.toFixed(0)}`,
          ],
          visualData: [{ label: 'Fee (₹)', value: fee }],
          tips: ['📌 Confirm whether structural drawings, 3D, and approvals are included.'],
        };
      },
    };
  }

  if (id === 'budget-planner') {
    return {
      title: 'Construction Budget Planner',
      description: 'Split total budget across major categories using percentages',
      presetScenarios: [
        { name: '₹50L typical split', icon: '📊', values: { totalBudget: 5000000, structure: 45, finishes: 25, mep: 15, fees: 5, misc: 10 } },
      ],
      inputs: [
        { name: 'totalBudget', label: 'Total budget (₹)', type: 'number', defaultValue: 5000000, min: 0, step: 1000 },
        { name: 'structure', label: 'Structure (%)', type: 'slider', defaultValue: 45, min: 0, max: 100, step: 1 },
        { name: 'finishes', label: 'Finishes (%)', type: 'slider', defaultValue: 25, min: 0, max: 100, step: 1 },
        { name: 'mep', label: 'Electrical/Plumbing/HVAC (%)', type: 'slider', defaultValue: 15, min: 0, max: 100, step: 1 },
        { name: 'fees', label: 'Fees/Approvals (%)', type: 'slider', defaultValue: 5, min: 0, max: 100, step: 1 },
        { name: 'misc', label: 'Misc/Contingency (%)', type: 'slider', defaultValue: 10, min: 0, max: 100, step: 1 },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.totalBudget);
        const pStructure = safeFloat(inputs.structure);
        const pFinishes = safeFloat(inputs.finishes);
        const pMep = safeFloat(inputs.mep);
        const pFees = safeFloat(inputs.fees);
        const pMisc = safeFloat(inputs.misc);
        const sum = pStructure + pFinishes + pMep + pFees + pMisc;

        const alloc = (p: number) => (total * p) / 100;
        const structureAmt = alloc(pStructure);
        const finishesAmt = alloc(pFinishes);
        const mepAmt = alloc(pMep);
        const feesAmt = alloc(pFees);
        const miscAmt = alloc(pMisc);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: sum === 100 ? 'Budget split totals 100%.' : `Percentages sum to ${sum.toFixed(0)}% (adjust if you want exactly 100%).`,
          steps: [
            `Structure: ${pStructure.toFixed(0)}% → ₹${structureAmt.toFixed(0)}`,
            `Finishes: ${pFinishes.toFixed(0)}% → ₹${finishesAmt.toFixed(0)}`,
            `MEP: ${pMep.toFixed(0)}% → ₹${mepAmt.toFixed(0)}`,
            `Fees: ${pFees.toFixed(0)}% → ₹${feesAmt.toFixed(0)}`,
            `Misc: ${pMisc.toFixed(0)}% → ₹${miscAmt.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Structure (₹)', value: structureAmt },
            { label: 'Finishes (₹)', value: finishesAmt },
            { label: 'MEP (₹)', value: mepAmt },
            { label: 'Fees (₹)', value: feesAmt },
            { label: 'Misc (₹)', value: miscAmt },
          ],
          tips: ['✅ Keep a contingency buffer for price variation and design changes.'],
        };
      },
    };
  }

  if (id === 'civil-work-cost') {
    return {
      title: 'Civil Work Cost Calculator',
      description: 'Estimate civil/structure cost from built-up area and civil rate',
      presetScenarios: [
        { name: '2000 sq ft @ ₹1200/sq ft', icon: '🏗️', values: { areaSqFt: 2000, civilRate: 1200, contingency: 5 } },
      ],
      inputs: [
        { name: 'areaSqFt', label: 'Built-up Area (sq ft)', type: 'number', defaultValue: 2000, min: 0, step: 1 },
        { name: 'civilRate', label: 'Civil rate (₹/sq ft)', type: 'number', defaultValue: 1200, min: 0, step: 10 },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 5, min: 0, max: 20, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.civilRate);
        const cont = safeFloat(inputs.contingency);

        const base = area * rate;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Civil work cost is typically the structural portion of a build.',
          steps: [
            `Base = ${area.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${base.toFixed(0)}`,
            `Contingency ${cont.toFixed(0)}% → ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['📌 Civil rate excludes interiors, fixtures, and appliances in many estimates.'],
        };
      },
    };
  }

  if (id === 'interior-cost') {
    return {
      title: 'Interior Design Cost',
      description: 'Estimate interior cost from area using per-sq-ft interior rate',
      presetScenarios: [
        { name: '1200 sq ft @ ₹900/sq ft', icon: '🛋️', values: { areaSqFt: 1200, interiorRate: 900, contingency: 10 } },
      ],
      inputs: [
        { name: 'areaSqFt', label: 'Carpet/usable area (sq ft)', type: 'number', defaultValue: 1200, min: 0, step: 1 },
        { name: 'interiorRate', label: 'Interior rate (₹/sq ft)', type: 'number', defaultValue: 900, min: 0, step: 10 },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.interiorRate);
        const cont = safeFloat(inputs.contingency);

        const base = area * rate;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Interior costs depend heavily on materials, brand, and carpentry complexity.',
          steps: [
            `Base = ${area.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${base.toFixed(0)}`,
            `Contingency ${cont.toFixed(0)}% → ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['✅ Separate budget for appliances and loose furniture if not included.'],
        };
      },
    };
  }

  if (id === 'landscaping-cost') {
    return {
      title: 'Landscaping Cost Calculator',
      description: 'Estimate landscaping cost from area and per-unit rate',
      presetScenarios: [
        { name: 'Garden 800 sq ft', icon: '🌿', values: { unit: 'sq ft', area: 800, ratePerUnit: 120, contingency: 10 } },
      ],
      inputs: [
        { name: 'unit', label: 'Area unit', type: 'select', options: ['sq ft', 'm²'], defaultValue: 'sq ft' },
        { name: 'area', label: 'Area', type: 'number', defaultValue: 800, min: 0, step: 1 },
        { name: 'ratePerUnit', label: 'Rate (₹ per unit area)', type: 'number', defaultValue: 120, min: 0, step: 1 },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'sq ft';
        const area = safeFloat(inputs.area);
        const rate = safeFloat(inputs.ratePerUnit);
        const cont = safeFloat(inputs.contingency);

        const base = area * rate;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Landscaping cost includes softscape and hardscape depending on scope.',
          steps: [
            `Base = ${area.toFixed(0)} ${unit} × ₹${rate.toFixed(0)} = ₹${base.toFixed(0)}`,
            `Contingency ${cont.toFixed(0)}% → ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['📌 Irrigation, lighting, and boundary work can add significant cost.'],
        };
      },
    };
  }

  if (id === 'demolition-cost') {
    return {
      title: 'Demolition Cost Calculator',
      description: 'Estimate demolition cost from area and rate, plus debris disposal',
      presetScenarios: [
        { name: '1000 sq ft @ ₹150/sq ft', icon: '🏚️', values: { areaSqFt: 1000, ratePerSqFt: 150, disposalCost: 25000, contingency: 10 } },
      ],
      inputs: [
        { name: 'areaSqFt', label: 'Demolition area (sq ft)', type: 'number', defaultValue: 1000, min: 0, step: 1 },
        { name: 'ratePerSqFt', label: 'Rate (₹/sq ft)', type: 'number', defaultValue: 150, min: 0, step: 5 },
        { name: 'disposalCost', label: 'Debris disposal (₹)', type: 'number', defaultValue: 25000, min: 0, step: 1000 },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.ratePerSqFt);
        const disposal = safeFloat(inputs.disposalCost);
        const cont = safeFloat(inputs.contingency);

        const base = area * rate + disposal;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Includes demolition rate plus disposal and contingency.',
          steps: [
            `Area cost = ${area.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${(area * rate).toFixed(0)}`,
            `Disposal = ₹${disposal.toFixed(0)}`,
            `Subtotal = ₹${base.toFixed(0)}`,
            `Contingency ${cont.toFixed(0)}% → ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Subtotal (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['⚠️ Check for permits, safety, and hazardous material handling.'],
        };
      },
    };
  }

  if (id === 'permit-fee-calculator') {
    return {
      title: 'Building Permit Fee Calculator',
      description: 'Estimate permit fee from project cost or area using a percentage/rate',
      presetScenarios: [
        { name: '0.5% of ₹40L', icon: '📝', values: { mode: 'Percent of cost', projectCost: 4000000, percent: 0.5, areaSqFt: 0, ratePerSqFt: 0 } },
        { name: '₹25/sq ft for 2000 sq ft', icon: '🏢', values: { mode: 'Rate per sq ft', projectCost: 0, percent: 0, areaSqFt: 2000, ratePerSqFt: 25 } },
      ],
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: ['Percent of cost', 'Rate per sq ft'], defaultValue: 'Percent of cost' },
        { name: 'projectCost', label: 'Project cost (₹)', type: 'number', defaultValue: 4000000, min: 0, step: 1000 },
        { name: 'percent', label: 'Permit fee (%)', type: 'number', defaultValue: 0.5, min: 0, step: 0.1 },
        { name: 'areaSqFt', label: 'Area (sq ft)', type: 'number', defaultValue: 2000, min: 0, step: 1 },
        { name: 'ratePerSqFt', label: 'Rate (₹/sq ft)', type: 'number', defaultValue: 25, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'Percent of cost';
        const projectCost = safeFloat(inputs.projectCost);
        const percent = safeFloat(inputs.percent);
        const area = safeFloat(inputs.areaSqFt);
        const rate = safeFloat(inputs.ratePerSqFt);

        const fee = mode === 'Rate per sq ft' ? area * rate : projectCost * (percent / 100);

        return {
          result: `₹${fee.toFixed(0)}`,
          explanation: 'Permit fees depend on local authority rules; this is a quick estimate.',
          steps: [
            mode === 'Rate per sq ft'
              ? `Fee = ${area.toFixed(0)} × ₹${rate.toFixed(0)} = ₹${fee.toFixed(0)}`
              : `Fee = ₹${projectCost.toFixed(0)} × ${percent.toFixed(2)}% = ₹${fee.toFixed(0)}`,
          ],
          visualData: [{ label: 'Fee (₹)', value: fee }],
          tips: ['📌 Include drawings, scrutiny fees, and NOCs if applicable.'],
        };
      },
    };
  }

  if (id === 'renovation-cost') {
    return {
      title: 'Renovation Cost Calculator',
      description: 'Estimate renovation cost from area, scope factor, and per-sq-ft base rate',
      presetScenarios: [
        { name: '1000 sq ft moderate', icon: '🛠️', values: { areaSqFt: 1000, baseRate: 900, scope: 'Moderate', contingency: 12 } },
      ],
      inputs: [
        { name: 'areaSqFt', label: 'Renovation area (sq ft)', type: 'number', defaultValue: 1000, min: 0, step: 1 },
        { name: 'baseRate', label: 'Base rate (₹/sq ft)', type: 'number', defaultValue: 900, min: 0, step: 10 },
        { name: 'scope', label: 'Scope', type: 'select', options: ['Light', 'Moderate', 'Heavy'], defaultValue: 'Moderate' },
        { name: 'contingency', label: 'Contingency (%)', type: 'slider', defaultValue: 12, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaSqFt);
        const baseRate = safeFloat(inputs.baseRate);
        const scope = inputs.scope || 'Moderate';
        const cont = safeFloat(inputs.contingency);

        const factor = scope === 'Light' ? 0.8 : scope === 'Heavy' ? 1.4 : 1.0;
        const base = area * baseRate * factor;
        const total = base * (1 + cont / 100);

        return {
          result: `₹${total.toFixed(0)}`,
          explanation: 'Uses a scope multiplier over base rate, then adds contingency.',
          steps: [
            `Scope factor (${scope}) = ${factor.toFixed(2)}`,
            `Base = ${area.toFixed(0)} × ₹${baseRate.toFixed(0)} × ${factor.toFixed(2)} = ₹${base.toFixed(0)}`,
            `Contingency ${cont.toFixed(0)}% → ₹${total.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Base (₹)', value: base },
            { label: 'Total (₹)', value: total },
          ],
          tips: ['✅ Always inspect site conditions (wiring/plumbing/waterproofing) before finalizing.'],
        };
      },
    };
  }

  if (id === 'roi-calculator') {
    return {
      title: 'Construction ROI Calculator',
      description: 'Compute ROI from total investment and annual net return (rent or business)',
      presetScenarios: [
        { name: '₹50L investment, ₹4L/yr net', icon: '📈', values: { investment: 5000000, annualNetReturn: 400000, holdingYears: 10 } },
      ],
      inputs: [
        { name: 'investment', label: 'Total investment (₹)', type: 'number', defaultValue: 5000000, min: 0, step: 1000 },
        { name: 'annualNetReturn', label: 'Annual net return (₹/year)', type: 'number', defaultValue: 400000, min: 0, step: 1000 },
        { name: 'holdingYears', label: 'Holding period (years)', type: 'slider', defaultValue: 10, min: 1, max: 50, step: 1 },
      ],
      calculate: (inputs) => {
        const investment = safeFloat(inputs.investment);
        const annual = safeFloat(inputs.annualNetReturn);
        const years = Math.max(1, Math.round(safeFloat(inputs.holdingYears) || 1));

        const totalReturn = annual * years;
        const roi = investment > 0 ? (totalReturn - investment) / investment : 0;
        const roiPct = roi * 100;
        const paybackYears = annual > 0 ? investment / annual : 0;

        return {
          result: `${roiPct.toFixed(2)}% ROI`,
          explanation: 'Simple ROI over the holding period (does not discount cashflows).',
          formula: 'ROI = (Total Return − Investment) / Investment',
          steps: [
            `Total return = ₹${annual.toFixed(0)} × ${years} = ₹${totalReturn.toFixed(0)}`,
            `ROI = (₹${totalReturn.toFixed(0)} − ₹${investment.toFixed(0)}) / ₹${investment.toFixed(0)} = ${roiPct.toFixed(2)}%`,
            annual > 0 ? `Payback ≈ ₹${investment.toFixed(0)} / ₹${annual.toFixed(0)} = ${paybackYears.toFixed(1)} years` : 'Payback: annual return not provided',
          ],
          visualData: [
            { label: 'ROI (%)', value: roiPct },
            { label: 'Payback (years)', value: paybackYears },
          ],
          tips: ['📌 For investment decisions, consider discount rate and resale value separately.'],
        };
      },
    };
  }

  // ELECTRICAL & PLUMBING (ADVANCED)
  if (id === 'load-calculation') {
    return {
      title: 'Electrical Load Calculator',
      description: 'Estimate total load (kW/kVA) and current for single-phase or three-phase systems',
      presetScenarios: [
        { name: 'Home (5.0 kW)', icon: '🏠', values: { totalConnectedW: 5000, demandFactor: 80, voltageV: 230, phase: 'Single-phase', powerFactor: 0.9 } },
        { name: 'Small shop (12 kW, 3φ)', icon: '🏪', values: { totalConnectedW: 12000, demandFactor: 70, voltageV: 415, phase: 'Three-phase', powerFactor: 0.85 } },
      ],
      inputs: [
        { name: 'totalConnectedW', label: 'Total connected load (W)', type: 'number', defaultValue: 5000, min: 0, step: 50, helpText: 'Sum of appliance wattages × quantities' },
        { name: 'demandFactor', label: 'Demand/Diversity factor (%)', type: 'slider', defaultValue: 80, min: 30, max: 100, step: 1 },
        { name: 'phase', label: 'Supply', type: 'select', options: ['Single-phase', 'Three-phase'], defaultValue: 'Single-phase' },
        { name: 'voltageV', label: 'Voltage (V)', type: 'number', defaultValue: 230, min: 100, step: 1 },
        { name: 'powerFactor', label: 'Power factor (PF)', type: 'number', defaultValue: 0.9, min: 0.5, max: 1.0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const connectedW = safeFloat(inputs.totalConnectedW);
        const demand = safeFloat(inputs.demandFactor);
        const phase = inputs.phase || 'Single-phase';
        const V = safeFloat(inputs.voltageV);
        const pf = Math.min(1, Math.max(0.5, safeFloat(inputs.powerFactor) || 0.9));

        const demandW = connectedW * (demand / 100);
        const kW = demandW / 1000;
        const kVA = pf > 0 ? kW / pf : 0;

        const I = phase === 'Three-phase'
          ? (kW * 1000) / (Math.sqrt(3) * V * pf)
          : (kW * 1000) / (V * pf);

        return {
          result: `${kW.toFixed(2)} kW`,
          explanation: 'Applies demand factor to connected load, then estimates current using PF and voltage.',
          steps: [
            `Connected load = ${connectedW.toFixed(0)} W`,
            `Demand factor = ${demand.toFixed(0)}% → demand load = ${demandW.toFixed(0)} W`,
            `kW = ${kW.toFixed(2)} kW`,
            `kVA = kW / PF = ${kW.toFixed(2)} / ${pf.toFixed(2)} = ${kVA.toFixed(2)} kVA`,
            phase === 'Three-phase'
              ? `Current (3φ) ≈ kW×1000 / (√3×V×PF) = ${I.toFixed(1)} A`
              : `Current (1φ) ≈ kW×1000 / (V×PF) = ${I.toFixed(1)} A`,
          ],
          visualData: [
            { label: 'kW', value: kW },
            { label: 'kVA', value: kVA },
            { label: 'Current (A)', value: isFinite(I) ? I : 0 },
          ],
          tips: [
            '✅ Use higher demand factor for commercial kitchens / workshops.',
            '📌 For motor loads, consider starting current separately.',
          ],
        };
      },
    };
  }

  if (id === 'mcb-rating') {
    return {
      title: 'MCB Rating Calculator',
      description: 'Estimate circuit breaker size from load and voltage (with safety margin)',
      presetScenarios: [
        { name: '3 kW @ 230V', icon: '⚡', values: { loadKw: 3, voltageV: 230, powerFactor: 0.95, safetyMargin: 25, phase: 'Single-phase' } },
        { name: '10 kW @ 415V (3φ)', icon: '🏭', values: { loadKw: 10, voltageV: 415, powerFactor: 0.9, safetyMargin: 25, phase: 'Three-phase' } },
      ],
      inputs: [
        { name: 'phase', label: 'Supply', type: 'select', options: ['Single-phase', 'Three-phase'], defaultValue: 'Single-phase' },
        { name: 'loadKw', label: 'Load (kW)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'voltageV', label: 'Voltage (V)', type: 'number', defaultValue: 230, min: 100, step: 1 },
        { name: 'powerFactor', label: 'Power factor (PF)', type: 'number', defaultValue: 0.95, min: 0.5, max: 1.0, step: 0.01 },
        { name: 'safetyMargin', label: 'Safety margin (%)', type: 'slider', defaultValue: 25, min: 0, max: 50, step: 1 },
        { name: 'curve', label: 'Trip curve (info)', type: 'select', options: ['B (lighting)', 'C (general)', 'D (motors)'], defaultValue: 'C (general)' },
      ],
      calculate: (inputs) => {
        const phase = inputs.phase || 'Single-phase';
        const kW = safeFloat(inputs.loadKw);
        const V = safeFloat(inputs.voltageV);
        const pf = Math.min(1, Math.max(0.5, safeFloat(inputs.powerFactor) || 0.95));
        const margin = safeFloat(inputs.safetyMargin);
        const curve = inputs.curve || 'C (general)';

        const I = phase === 'Three-phase'
          ? (kW * 1000) / (Math.sqrt(3) * V * pf)
          : (kW * 1000) / (V * pf);
        const Irec = I * (1 + margin / 100);

        const standard = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];
        const suggested = standard.find(s => s >= Irec) ?? standard[standard.length - 1];

        return {
          result: `${suggested} A MCB`,
          explanation: 'Calculates load current and selects next standard MCB rating with margin.',
          steps: [
            phase === 'Three-phase'
              ? `I (3φ) = kW×1000 / (√3×V×PF) = ${I.toFixed(1)} A`
              : `I (1φ) = kW×1000 / (V×PF) = ${I.toFixed(1)} A`,
            `Safety margin = ${margin.toFixed(0)}% → recommended ≥ ${Irec.toFixed(1)} A`,
            `Suggested standard rating = ${suggested} A`,
            `Trip curve: ${curve}`,
          ],
          visualData: [
            { label: 'Load current (A)', value: isFinite(I) ? I : 0 },
            { label: 'Recommended (A)', value: isFinite(Irec) ? Irec : 0 },
          ],
          tips: [
            '⚠️ Confirm cable size and protective device coordination with an electrician.',
            '✅ Use curve D for high inrush motor loads if appropriate.',
          ],
        };
      },
    };
  }

  if (id === 'voltage-drop') {
    return {
      title: 'Voltage Drop Calculator',
      description: 'Estimate voltage drop based on current, length, conductor size, and material',
      presetScenarios: [
        { name: 'Copper 4mm², 20m, 16A', icon: '🔌', values: { system: 'Single-phase', voltageV: 230, currentA: 16, lengthM: 20, areaMm2: 4, material: 'Copper' } },
        { name: 'Al 16mm², 80m, 40A', icon: '🏭', values: { system: 'Three-phase', voltageV: 415, currentA: 40, lengthM: 80, areaMm2: 16, material: 'Aluminium' } },
      ],
      inputs: [
        { name: 'system', label: 'System', type: 'select', options: ['Single-phase', 'Three-phase'], defaultValue: 'Single-phase' },
        { name: 'voltageV', label: 'Voltage (V)', type: 'number', defaultValue: 230, min: 100, step: 1 },
        { name: 'currentA', label: 'Current (A)', type: 'number', defaultValue: 16, min: 0, step: 0.1 },
        { name: 'lengthM', label: 'One-way length (m)', type: 'number', defaultValue: 20, min: 0, step: 0.1 },
        { name: 'areaMm2', label: 'Conductor area (mm²)', type: 'number', defaultValue: 4, min: 0.5, step: 0.5 },
        { name: 'material', label: 'Conductor material', type: 'select', options: ['Copper', 'Aluminium'], defaultValue: 'Copper' },
      ],
      calculate: (inputs) => {
        const system = inputs.system || 'Single-phase';
        const V = safeFloat(inputs.voltageV);
        const I = safeFloat(inputs.currentA);
        const L = safeFloat(inputs.lengthM);
        const A = Math.max(0.0001, safeFloat(inputs.areaMm2));
        const material = inputs.material || 'Copper';

        // Resistivity at ~20°C in Ω·mm²/m (approx.)
        const rho = material === 'Aluminium' ? 0.028264 : 0.017241;

        // R per conductor over length L
        const R = (rho * L) / A;
        const vDrop = system === 'Three-phase'
          ? Math.sqrt(3) * I * R
          : 2 * I * R;
        const pct = V > 0 ? (vDrop / V) * 100 : 0;

        return {
          result: `${vDrop.toFixed(2)} V (${pct.toFixed(2)}%)`,
          explanation: 'Uses simplified resistive drop (reactance neglected).',
          steps: [
            `ρ (${material}) ≈ ${rho.toFixed(6)} Ω·mm²/m`,
            `R = ρ×L/A = ${rho.toFixed(6)}×${L.toFixed(1)}/${A.toFixed(2)} = ${R.toFixed(4)} Ω`,
            system === 'Three-phase'
              ? `Vdrop = √3×I×R = ${vDrop.toFixed(2)} V`
              : `Vdrop = 2×I×R = ${vDrop.toFixed(2)} V`,
            `Percent = ${pct.toFixed(2)}%`,
          ],
          visualData: [
            { label: 'V drop (V)', value: vDrop },
            { label: 'Drop (%)', value: pct },
          ],
          tips: [
            '📌 Many standards target ≤3% lighting and ≤5% total feeder drop (varies by code).',
            '⚠️ Long runs and motor loads may need a detailed calculation including reactance.',
          ],
        };
      },
    };
  }

  if (id === 'wire-calculator') {
    return {
      title: 'Electrical Wire Size Calculator',
      description: 'Estimate minimum conductor size from current using current density (simplified)',
      presetScenarios: [
        { name: '16A (home circuit)', icon: '🏠', values: { currentA: 16, material: 'Copper', currentDensity: 6, derating: 0.9 } },
        { name: '63A feeder', icon: '🏭', values: { currentA: 63, material: 'Copper', currentDensity: 5, derating: 0.85 } },
      ],
      inputs: [
        { name: 'currentA', label: 'Design current (A)', type: 'number', defaultValue: 16, min: 0, step: 0.1 },
        { name: 'material', label: 'Material', type: 'select', options: ['Copper', 'Aluminium'], defaultValue: 'Copper' },
        { name: 'currentDensity', label: 'Allowable current density (A/mm²)', type: 'number', defaultValue: 6, min: 1, max: 12, step: 0.5, helpText: 'Depends on insulation/installation. Use conservative values.' },
        { name: 'derating', label: 'Derating factor', type: 'number', defaultValue: 0.9, min: 0.5, max: 1.0, step: 0.01, helpText: 'Temperature/bundling correction (0.5–1.0)' },
      ],
      calculate: (inputs) => {
        const I = safeFloat(inputs.currentA);
        const material = inputs.material || 'Copper';
        const J = Math.max(0.1, safeFloat(inputs.currentDensity));
        const der = Math.min(1, Math.max(0.1, safeFloat(inputs.derating) || 1));

        const required = der > 0 ? I / (J * der) : 0;
        const standard = [1.0, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
        const suggested = standard.find(s => s >= required) ?? standard[standard.length - 1];

        return {
          result: `${suggested} mm² (${material})`,
          explanation: 'Simplified sizing using current density and derating. Check ampacity tables for compliance.',
          steps: [
            `Required area = I / (J×derating) = ${I.toFixed(1)} / (${J.toFixed(1)}×${der.toFixed(2)}) = ${required.toFixed(2)} mm²`,
            `Suggested standard size = ${suggested} mm²`,
          ],
          visualData: [
            { label: 'Required (mm²)', value: required },
            { label: 'Suggested (mm²)', value: suggested },
          ],
          tips: [
            '⚠️ Always verify against local electrical code and insulation type.',
            '📌 Aluminium typically needs larger size than copper for the same current.',
          ],
        };
      },
    };
  }

  if (id === 'conduit-calculator') {
    return {
      title: 'Conduit Size Calculator',
      description: 'Estimate conduit diameter based on number of wires and fill factor (approx.)',
      presetScenarios: [
        { name: '10 wires, 3.5mm OD', icon: '🧰', values: { wireCount: 10, wireOuterDiameterMm: 3.5, fillPercent: 40 } },
        { name: '6 wires, 5mm OD', icon: '🔧', values: { wireCount: 6, wireOuterDiameterMm: 5, fillPercent: 40 } },
      ],
      inputs: [
        { name: 'wireCount', label: 'Number of wires', type: 'slider', defaultValue: 10, min: 1, max: 200, step: 1 },
        { name: 'wireOuterDiameterMm', label: 'Wire outer diameter (mm)', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.1 },
        { name: 'fillPercent', label: 'Fill factor (%)', type: 'slider', defaultValue: 40, min: 20, max: 60, step: 1, helpText: 'Common practice often limits fill to ~40%' },
      ],
      calculate: (inputs) => {
        const n = Math.max(1, Math.round(safeFloat(inputs.wireCount) || 1));
        const d = safeFloat(inputs.wireOuterDiameterMm);
        const fill = Math.min(80, Math.max(5, safeFloat(inputs.fillPercent) || 40));

        const wireArea = Math.PI * Math.pow(d / 2, 2);
        const totalWireArea = n * wireArea;
        const conduitArea = fill > 0 ? totalWireArea / (fill / 100) : 0;
        const conduitDia = conduitArea > 0 ? Math.sqrt((4 * conduitArea) / Math.PI) : 0;

        const standard = [16, 20, 25, 32, 40, 50, 63, 75];
        const suggested = standard.find(s => s >= conduitDia) ?? standard[standard.length - 1];

        return {
          result: `${suggested} mm conduit`,
          explanation: 'Computes required internal area from total wire area and fill factor, then converts to equivalent diameter.',
          steps: [
            `Wire area = π(d/2)² = ${wireArea.toFixed(2)} mm²`,
            `Total wire area = ${n} × ${wireArea.toFixed(2)} = ${totalWireArea.toFixed(2)} mm²`,
            `Fill factor = ${fill.toFixed(0)}% → conduit area ≈ ${conduitArea.toFixed(2)} mm²`,
            `Equivalent internal diameter ≈ ${conduitDia.toFixed(1)} mm`,
            `Suggested standard size = ${suggested} mm`,
          ],
          visualData: [
            { label: 'Required dia (mm)', value: conduitDia },
            { label: 'Suggested (mm)', value: suggested },
          ],
          tips: [
            '📌 This is a geometric estimate; pulling/tension and bend count also matter.',
            '✅ Use a lower fill % for long runs or many bends.',
          ],
        };
      },
    };
  }

  if (id === 'cable-tray-sizing') {
    return {
      title: 'Cable Tray Size Calculator',
      description: 'Estimate tray width from cable diameters, spacing, and spare capacity (approx.)',
      presetScenarios: [
        { name: '20 cables (12mm OD)', icon: '🧵', values: { cableCount: 20, cableDiameterMm: 12, spacingMm: 5, sparePercent: 20 } },
      ],
      inputs: [
        { name: 'cableCount', label: 'Number of cables', type: 'slider', defaultValue: 20, min: 1, max: 500, step: 1 },
        { name: 'cableDiameterMm', label: 'Average cable diameter (mm)', type: 'number', defaultValue: 12, min: 1, step: 0.5 },
        { name: 'spacingMm', label: 'Spacing between cables (mm)', type: 'number', defaultValue: 5, min: 0, step: 1 },
        { name: 'sparePercent', label: 'Spare capacity (%)', type: 'slider', defaultValue: 20, min: 0, max: 50, step: 1 },
      ],
      calculate: (inputs) => {
        const n = Math.max(1, Math.round(safeFloat(inputs.cableCount) || 1));
        const d = safeFloat(inputs.cableDiameterMm);
        const s = safeFloat(inputs.spacingMm);
        const spare = safeFloat(inputs.sparePercent);

        const widthOneLayer = n * d + Math.max(0, n - 1) * s;
        const widthWithSpare = widthOneLayer * (1 + spare / 100);
        const depth = d * 1.2;

        const standard = [50, 100, 150, 200, 300, 450, 600, 750, 900];
        const suggested = standard.find(w => w >= widthWithSpare) ?? standard[standard.length - 1];

        return {
          result: `${suggested} mm tray width`,
          explanation: 'One-layer tray width estimate from cable ODs, spacing, and spare capacity.',
          steps: [
            `One-layer width ≈ n×d + (n−1)×spacing = ${widthOneLayer.toFixed(1)} mm`,
            `Spare = ${spare.toFixed(0)}% → ${widthWithSpare.toFixed(1)} mm`,
            `Suggested standard width = ${suggested} mm`,
            `Suggested depth (rule-of-thumb) ≈ ${depth.toFixed(0)} mm`,
          ],
          visualData: [
            { label: 'Required width (mm)', value: widthWithSpare },
            { label: 'Suggested width (mm)', value: suggested },
          ],
          tips: [
            '⚠️ Heat dissipation and segregation rules may require more space.',
            '✅ For power + control cables, consider separate trays.',
          ],
        };
      },
    };
  }

  if (id === 'generator-sizing') {
    return {
      title: 'Generator Sizing Calculator',
      description: 'Estimate generator kVA from running load, power factor, and starting factor',
      presetScenarios: [
        { name: '10 kW load, PF 0.8', icon: '🧯', values: { runningLoadKw: 10, powerFactor: 0.8, startingFactor: 1.5, margin: 20 } },
      ],
      inputs: [
        { name: 'runningLoadKw', label: 'Running load (kW)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'powerFactor', label: 'Power factor (PF)', type: 'number', defaultValue: 0.8, min: 0.5, max: 1.0, step: 0.01 },
        { name: 'startingFactor', label: 'Starting factor (motors)', type: 'number', defaultValue: 1.5, min: 1.0, max: 3.0, step: 0.1 },
        { name: 'margin', label: 'Sizing margin (%)', type: 'slider', defaultValue: 20, min: 0, max: 50, step: 1 },
      ],
      calculate: (inputs) => {
        const kW = safeFloat(inputs.runningLoadKw);
        const pf = Math.min(1, Math.max(0.5, safeFloat(inputs.powerFactor) || 0.8));
        const sf = Math.max(1, safeFloat(inputs.startingFactor) || 1);
        const margin = safeFloat(inputs.margin);

        const baseKva = pf > 0 ? (kW / pf) * sf : 0;
        const kva = baseKva * (1 + margin / 100);
        const suggested = Math.ceil(kva / 5) * 5;

        return {
          result: `${suggested} kVA (suggested)`,
          explanation: 'Converts kW to kVA, applies starting factor and margin, then rounds up to a common rating step.',
          steps: [
            `Base kVA = (kW/PF)×starting = (${kW.toFixed(2)}/${pf.toFixed(2)})×${sf.toFixed(2)} = ${baseKva.toFixed(2)} kVA`,
            `Margin = ${margin.toFixed(0)}% → ${kva.toFixed(2)} kVA`,
            `Rounded suggestion ≈ ${suggested} kVA`,
          ],
          visualData: [
            { label: 'kVA', value: kva },
            { label: 'Suggested', value: suggested },
          ],
          tips: ['📌 For large motor loads, use detailed starting kVA calculations.'],
        };
      },
    };
  }

  if (id === 'transformer-calculator') {
    return {
      title: 'Transformer Size Calculator',
      description: 'Estimate transformer rating (kVA) from load (kW) and power factor with margin',
      presetScenarios: [
        { name: '50 kW @ PF 0.9', icon: '🔋', values: { loadKw: 50, powerFactor: 0.9, margin: 25 } },
      ],
      inputs: [
        { name: 'loadKw', label: 'Load (kW)', type: 'number', defaultValue: 50, min: 0, step: 0.1 },
        { name: 'powerFactor', label: 'Power factor (PF)', type: 'number', defaultValue: 0.9, min: 0.5, max: 1.0, step: 0.01 },
        { name: 'margin', label: 'Margin (%)', type: 'slider', defaultValue: 25, min: 0, max: 50, step: 1 },
      ],
      calculate: (inputs) => {
        const kW = safeFloat(inputs.loadKw);
        const pf = Math.min(1, Math.max(0.5, safeFloat(inputs.powerFactor) || 0.9));
        const margin = safeFloat(inputs.margin);

        const baseKva = pf > 0 ? kW / pf : 0;
        const kva = baseKva * (1 + margin / 100);

        const standard = [5, 10, 15, 25, 50, 63, 75, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000];
        const suggested = standard.find(s => s >= kva) ?? Math.ceil(kva / 50) * 50;

        return {
          result: `${suggested} kVA transformer`,
          explanation: 'Transformer sizing from kW, PF, and a margin for growth/temperature.',
          steps: [
            `Base kVA = kW/PF = ${kW.toFixed(2)}/${pf.toFixed(2)} = ${baseKva.toFixed(2)} kVA`,
            `Margin = ${margin.toFixed(0)}% → ${kva.toFixed(2)} kVA`,
            `Suggested standard rating = ${suggested} kVA`,
          ],
          visualData: [
            { label: 'Required kVA', value: kva },
            { label: 'Suggested', value: suggested },
          ],
          tips: ['✅ Consider harmonic loads and cooling class for final selection.'],
        };
      },
    };
  }

  if (id === 'solar-panel-sizing') {
    return {
      title: 'Solar Panel Calculator',
      description: 'Estimate number of panels from daily energy need, sun hours, and system losses',
      presetScenarios: [
        { name: '10 kWh/day, 5 sun hrs', icon: '☀️', values: { dailyEnergyKwh: 10, sunHours: 5, systemLossPercent: 20, panelWatt: 550 } },
      ],
      inputs: [
        { name: 'dailyEnergyKwh', label: 'Daily energy (kWh/day)', type: 'number', defaultValue: 10, min: 0, step: 0.1 },
        { name: 'sunHours', label: 'Peak sun hours (hrs/day)', type: 'number', defaultValue: 5, min: 1, max: 10, step: 0.1 },
        { name: 'systemLossPercent', label: 'System losses (%)', type: 'slider', defaultValue: 20, min: 0, max: 50, step: 1, helpText: 'Inverter + temperature + wiring + dust losses' },
        { name: 'panelWatt', label: 'Panel rating (W)', type: 'number', defaultValue: 550, min: 50, step: 10 },
      ],
      calculate: (inputs) => {
        const daily = safeFloat(inputs.dailyEnergyKwh);
        const sun = Math.max(0.1, safeFloat(inputs.sunHours));
        const loss = Math.min(90, Math.max(0, safeFloat(inputs.systemLossPercent)));
        const panelW = Math.max(1, safeFloat(inputs.panelWatt));

        const effective = 1 - loss / 100;
        const requiredW = effective > 0 ? (daily * 1000) / (sun * effective) : 0;
        const panels = panelW > 0 ? Math.ceil(requiredW / panelW) : 0;
        const systemKw = (panels * panelW) / 1000;

        return {
          result: `${panels} panels`,
          explanation: 'Sizing based on energy per day divided by effective sun-hours output.',
          steps: [
            `Daily energy = ${daily.toFixed(2)} kWh`,
            `Sun hours = ${sun.toFixed(2)} h/day`,
            `Losses = ${loss.toFixed(0)}% → effective = ${effective.toFixed(2)}`,
            `Required PV ≈ (kWh×1000)/(sun×effective) = ${requiredW.toFixed(0)} W`,
            `Panels = ceil(${requiredW.toFixed(0)} / ${panelW.toFixed(0)}) = ${panels}`,
            `Installed ≈ ${systemKw.toFixed(2)} kW`,
          ],
          visualData: [
            { label: 'Required (W)', value: requiredW },
            { label: 'System (kW)', value: systemKw },
          ],
          tips: ['📌 Battery backup requires separate sizing (kWh storage + inverter).'],
        };
      },
    };
  }

  if (id === 'pump-calculator') {
    return {
      title: 'Water Pump Calculator',
      description: 'Estimate pump power from flow rate, head, and efficiency (approx.)',
      presetScenarios: [
        { name: '30 L/min @ 25m head', icon: '💧', values: { flowLpm: 30, headM: 25, efficiency: 55 } },
      ],
      inputs: [
        { name: 'flowLpm', label: 'Flow rate (L/min)', type: 'number', defaultValue: 30, min: 0, step: 0.1 },
        { name: 'headM', label: 'Total head (m)', type: 'number', defaultValue: 25, min: 0, step: 0.1 },
        { name: 'efficiency', label: 'Pump efficiency (%)', type: 'slider', defaultValue: 55, min: 20, max: 80, step: 1 },
      ],
      calculate: (inputs) => {
        const flowLpm = safeFloat(inputs.flowLpm);
        const head = safeFloat(inputs.headM);
        const eff = Math.min(100, Math.max(1, safeFloat(inputs.efficiency) || 50));

        const rho = 1000; // kg/m3
        const g = 9.81;
        const Q = (flowLpm / 1000) / 60; // m3/s
        const hydraulicW = rho * g * Q * head;
        const shaftW = hydraulicW / (eff / 100);
        const kW = shaftW / 1000;
        const hp = kW / 0.746;

        return {
          result: `${kW.toFixed(2)} kW (${hp.toFixed(2)} HP)`,
          explanation: 'Uses P = ρgQH/η. Real selections depend on pump curves and pipe losses.',
          steps: [
            `Q = ${flowLpm.toFixed(1)} L/min = ${(Q).toFixed(4)} m³/s`,
            `Head = ${head.toFixed(1)} m`,
            `Hydraulic power = ρgQH = ${hydraulicW.toFixed(0)} W`,
            `Efficiency = ${eff.toFixed(0)}% → shaft power ≈ ${shaftW.toFixed(0)} W`,
          ],
          visualData: [
            { label: 'kW', value: kW },
            { label: 'HP', value: hp },
          ],
          tips: [
            '✅ Add extra head for friction losses (elbows, valves, long runs).',
            '📌 Use pump curves to pick a model near best-efficiency point (BEP).',
          ],
        };
      },
    };
  }

  if (id === 'pipe-size-calculator') {
    return {
      title: 'Plumbing Pipe Size',
      description: 'Estimate internal pipe diameter from flow rate and target velocity (approx.)',
      presetScenarios: [
        { name: '25 L/min @ 1.5 m/s', icon: '🚰', values: { flowLpm: 25, velocity: 1.5 } },
        { name: '100 L/min @ 2.0 m/s', icon: '🏢', values: { flowLpm: 100, velocity: 2.0 } },
      ],
      inputs: [
        { name: 'flowLpm', label: 'Flow rate (L/min)', type: 'number', defaultValue: 25, min: 0, step: 0.1 },
        { name: 'velocity', label: 'Target velocity (m/s)', type: 'number', defaultValue: 1.5, min: 0.1, max: 5, step: 0.1, helpText: 'Typical water: 1–2 m/s (varies by design)' },
      ],
      calculate: (inputs) => {
        const flowLpm = safeFloat(inputs.flowLpm);
        const v = Math.max(0.001, safeFloat(inputs.velocity));
        const Q = (flowLpm / 1000) / 60; // m3/s

        const D = Math.sqrt((4 * Q) / (Math.PI * v)); // m
        const Dmm = D * 1000;

        const nominal = [10, 15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150];
        const suggested = nominal.find(n => n >= Dmm) ?? nominal[nominal.length - 1];

        return {
          result: `${suggested} mm (nominal)`,
          explanation: 'Uses continuity Q = A·v to estimate diameter; verify with pressure loss calculations.',
          steps: [
            `Q = ${flowLpm.toFixed(1)} L/min = ${Q.toFixed(5)} m³/s`,
            `D = sqrt(4Q/(πv)) = ${Dmm.toFixed(1)} mm`,
            `Suggested nominal size ≈ ${suggested} mm`,
          ],
          visualData: [
            { label: 'Required dia (mm)', value: Dmm },
            { label: 'Suggested (mm)', value: suggested },
          ],
          tips: ['📌 Hot water and long runs typically need larger sizes to reduce losses.'],
        };
      },
    };
  }

  if (id === 'water-pressure') {
    return {
      title: 'Water Pressure Calculator',
      description: 'Convert water head (height) to pressure and include optional pump/line losses',
      presetScenarios: [
        { name: 'Tank 15m above', icon: '🏢', values: { headM: 15, pumpBar: 0, lossBar: 0.2 } },
        { name: 'Pump + tank', icon: '💧', values: { headM: 10, pumpBar: 1.5, lossBar: 0.3 } },
      ],
      inputs: [
        { name: 'headM', label: 'Static head (m)', type: 'number', defaultValue: 15, min: 0, step: 0.1 },
        { name: 'pumpBar', label: 'Pump pressure added (bar)', type: 'number', defaultValue: 0, min: 0, step: 0.1 },
        { name: 'lossBar', label: 'Estimated losses (bar)', type: 'number', defaultValue: 0.2, min: 0, step: 0.05 },
      ],
      calculate: (inputs) => {
        const head = safeFloat(inputs.headM);
        const pump = safeFloat(inputs.pumpBar);
        const loss = safeFloat(inputs.lossBar);

        const rho = 1000;
        const g = 9.81;
        const pPa = rho * g * head;
        const pBar = pPa / 100000;
        const pPsi = pPa / 6894.757;

        const netBar = Math.max(0, pBar + pump - loss);
        const netPsi = netBar * 14.5038;

        return {
          result: `${netBar.toFixed(2)} bar`,
          explanation: 'Pressure from static head plus pump pressure minus estimated losses.',
          steps: [
            `Static pressure = ρgh = ${pBar.toFixed(2)} bar (≈ ${pPsi.toFixed(1)} psi)`,
            `Pump add = ${pump.toFixed(2)} bar`,
            `Loss = ${loss.toFixed(2)} bar`,
            `Net = ${netBar.toFixed(2)} bar (≈ ${netPsi.toFixed(1)} psi)`,
          ],
          visualData: [
            { label: 'Static (bar)', value: pBar },
            { label: 'Net (bar)', value: netBar },
          ],
          tips: ['📌 1 bar ≈ 10.2 m water head (approx.).'],
        };
      },
    };
  }

  if (id === 'drainage-calculator') {
    return {
      title: 'Drainage System Calculator',
      description: 'Estimate full-flow capacity of a circular pipe using Manning equation (approx.)',
      presetScenarios: [
        { name: '100mm PVC @ 1% slope', icon: '🕳️', values: { diameterMm: 100, slopePercent: 1, manningN: 0.013 } },
        { name: '150mm RCC @ 0.5%', icon: '🏗️', values: { diameterMm: 150, slopePercent: 0.5, manningN: 0.015 } },
      ],
      inputs: [
        { name: 'diameterMm', label: 'Pipe diameter (mm)', type: 'number', defaultValue: 100, min: 25, step: 1 },
        { name: 'slopePercent', label: 'Slope (%)', type: 'number', defaultValue: 1, min: 0.01, step: 0.01 },
        { name: 'manningN', label: 'Manning n', type: 'number', defaultValue: 0.013, min: 0.01, max: 0.03, step: 0.001, helpText: 'PVC ~0.011–0.013, concrete ~0.013–0.015' },
      ],
      calculate: (inputs) => {
        const dMm = safeFloat(inputs.diameterMm);
        const slopePct = safeFloat(inputs.slopePercent);
        const n = Math.max(0.0001, safeFloat(inputs.manningN));

        const d = dMm / 1000;
        const S = slopePct / 100;
        const A = Math.PI * Math.pow(d / 2, 2);
        const R = d / 4; // hydraulic radius for full circular pipe
        const Q = (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(Math.max(0, S));
        const Lps = Q * 1000;
        const m3h = Q * 3600;

        return {
          result: `${Lps.toFixed(2)} L/s`,
          explanation: 'Manning full-flow capacity (does not account for partial flow or surcharging).',
          formula: 'Q = (1/n)·A·R^(2/3)·S^(1/2)',
          steps: [
            `Diameter = ${dMm.toFixed(0)} mm`,
            `Slope S = ${S.toFixed(4)} (from ${slopePct.toFixed(2)}%)`,
            `A = ${A.toFixed(4)} m²`,
            `R = d/4 = ${R.toFixed(4)} m`,
            `Q = ${Q.toFixed(4)} m³/s = ${Lps.toFixed(2)} L/s = ${m3h.toFixed(1)} m³/h`,
          ],
          visualData: [
            { label: 'Flow (L/s)', value: Lps },
            { label: 'Flow (m³/h)', value: m3h },
          ],
          tips: ['⚠️ For sanitary design, check minimum velocity for self-cleansing and partial flow conditions.'],
        };
      },
    };
  }

  if (id === 'septic-tank') {
    return {
      title: 'Septic Tank Size Calculator',
      description: 'Estimate septic tank volume from occupants, sewage rate, and retention time (approx.)',
      presetScenarios: [
        { name: '5 persons', icon: '🏠', values: { persons: 5, sewageLppd: 135, retentionDays: 1.5, sludgeStorageL: 500 } },
        { name: '12 persons', icon: '🏢', values: { persons: 12, sewageLppd: 135, retentionDays: 2, sludgeStorageL: 1200 } },
      ],
      inputs: [
        { name: 'persons', label: 'Number of users', type: 'slider', defaultValue: 5, min: 1, max: 100, step: 1 },
        { name: 'sewageLppd', label: 'Sewage per person (L/day)', type: 'number', defaultValue: 135, min: 50, max: 300, step: 5 },
        { name: 'retentionDays', label: 'Retention time (days)', type: 'number', defaultValue: 1.5, min: 0.5, max: 3, step: 0.1 },
        { name: 'sludgeStorageL', label: 'Sludge storage (L)', type: 'number', defaultValue: 500, min: 0, step: 50, helpText: 'Extra volume between desludging intervals' },
        { name: 'freeboardPercent', label: 'Freeboard (%)', type: 'slider', defaultValue: 15, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const persons = Math.max(1, Math.round(safeFloat(inputs.persons) || 1));
        const lppd = safeFloat(inputs.sewageLppd);
        const days = safeFloat(inputs.retentionDays);
        const sludge = safeFloat(inputs.sludgeStorageL);
        const freeboard = safeFloat(inputs.freeboardPercent);

        const liquidL = persons * lppd * days;
        const totalL = (liquidL + sludge) * (1 + freeboard / 100);
        const m3 = totalL / 1000;

        return {
          result: `${m3.toFixed(2)} m³`,
          explanation: 'Simple sizing for preliminary estimates; final design must follow local standards.',
          steps: [
            `Liquid volume = persons×LPPD×days = ${persons}×${lppd.toFixed(0)}×${days.toFixed(1)} = ${liquidL.toFixed(0)} L`,
            `Sludge storage = ${sludge.toFixed(0)} L`,
            `Freeboard = ${freeboard.toFixed(0)}% → total = ${totalL.toFixed(0)} L`,
            `Total = ${m3.toFixed(2)} m³`,
          ],
          visualData: [
            { label: 'Total (L)', value: totalL },
            { label: 'Total (m³)', value: m3 },
          ],
          tips: [
            '⚠️ Include soak pit/leach field sizing separately.',
            '✅ Plan access for maintenance/desludging.',
          ],
        };
      },
    };
  }

  if (id === 'earthing-calculator') {
    return {
      title: 'Earthing System Calculator',
      description: 'Estimate earth resistance of a single rod and multiple rods (approx.)',
      presetScenarios: [
        { name: '1 rod (2.5m)', icon: '🌍', values: { soilResistivity: 100, rodLengthM: 2.5, rodDiameterMm: 16, rods: 1, efficiency: 1.0 } },
        { name: '3 rods', icon: '⚡', values: { soilResistivity: 80, rodLengthM: 3.0, rodDiameterMm: 16, rods: 3, efficiency: 0.7 } },
      ],
      inputs: [
        { name: 'soilResistivity', label: 'Soil resistivity ρ (Ω·m)', type: 'number', defaultValue: 100, min: 1, step: 1 },
        { name: 'rodLengthM', label: 'Rod length L (m)', type: 'number', defaultValue: 2.5, min: 0.5, step: 0.1 },
        { name: 'rodDiameterMm', label: 'Rod diameter d (mm)', type: 'number', defaultValue: 16, min: 6, step: 1 },
        { name: 'rods', label: 'Number of rods', type: 'slider', defaultValue: 1, min: 1, max: 20, step: 1 },
        { name: 'efficiency', label: 'Parallel efficiency factor', type: 'number', defaultValue: 1.0, min: 0.4, max: 1.0, step: 0.05, helpText: 'Accounts for mutual resistance due to spacing (0.4–1.0). Higher is better spacing.' },
      ],
      calculate: (inputs) => {
        const rho = safeFloat(inputs.soilResistivity);
        const L = Math.max(0.1, safeFloat(inputs.rodLengthM));
        const dMm = Math.max(0.1, safeFloat(inputs.rodDiameterMm));
        const nRods = Math.max(1, Math.round(safeFloat(inputs.rods) || 1));
        const eff = Math.min(1, Math.max(0.1, safeFloat(inputs.efficiency) || 1));

        const d = dMm / 1000;
        // R ≈ (ρ/(2πL)) [ln(4L/d) - 1]
        const term = Math.log((4 * L) / d) - 1;
        const R1 = (rho / (2 * Math.PI * L)) * term;
        const Rn = (nRods * eff) > 0 ? R1 / (nRods * eff) : R1;

        return {
          result: `${Rn.toFixed(2)} Ω`,
          explanation: 'Approximate earth resistance for vertical rod electrodes. Real results depend on soil layering and moisture.',
          formula: 'R ≈ (ρ/(2πL))·(ln(4L/d) − 1)',
          steps: [
            `Single rod R1 ≈ ${R1.toFixed(2)} Ω`,
            `Rods = ${nRods}, efficiency = ${eff.toFixed(2)} → R ≈ R1/(n×eff) = ${Rn.toFixed(2)} Ω`,
          ],
          visualData: [
            { label: 'Single rod (Ω)', value: R1 },
            { label: 'Estimated total (Ω)', value: Rn },
          ],
          tips: [
            '✅ Increase rod spacing and length to reduce resistance.',
            '📌 Use soil treatment/backfill as per standards where permitted.',
          ],
        };
      },
    };
  }

  // ROOFING & WATERPROOFING (ADVANCED)
  if (id === 'roof-area') {
    return {
      title: 'Roof Area Calculator',
      description: 'Estimate roof surface area for common roof shapes (includes pitch multiplier)',
      presetScenarios: [
        { name: 'Gable 10×8m, 30°', icon: '🏠', values: { shape: 'Gable', lengthM: 10, widthM: 8, pitchDeg: 30, includeOverhang: 'No', overhangM: 0.3 } },
        { name: 'Hip 12×10m, 25°', icon: '🏡', values: { shape: 'Hip', lengthM: 12, widthM: 10, pitchDeg: 25, includeOverhang: 'Yes', overhangM: 0.4 } },
      ],
      inputs: [
        { name: 'shape', label: 'Roof shape', type: 'select', options: ['Gable', 'Hip', 'Flat'], defaultValue: 'Gable' },
        { name: 'lengthM', label: 'Building length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'widthM', label: 'Building width (m)', type: 'number', defaultValue: 8, min: 0, step: 0.01 },
        { name: 'pitchDeg', label: 'Pitch angle (degrees)', type: 'number', defaultValue: 30, min: 0, max: 60, step: 1 },
        { name: 'includeOverhang', label: 'Include overhang', type: 'select', options: ['No', 'Yes'], defaultValue: 'No' },
        { name: 'overhangM', label: 'Overhang on each side (m)', type: 'number', defaultValue: 0.3, min: 0, step: 0.01 },
      ],
      calculate: (inputs) => {
        const shape = inputs.shape || 'Gable';
        const includeOverhang = inputs.includeOverhang || 'No';
        const overhang = safeFloat(inputs.overhangM);
        const L0 = safeFloat(inputs.lengthM);
        const W0 = safeFloat(inputs.widthM);
        const pitchDeg = safeFloat(inputs.pitchDeg);

        const L = includeOverhang === 'Yes' ? L0 + 2 * overhang : L0;
        const W = includeOverhang === 'Yes' ? W0 + 2 * overhang : W0;

        const basePlanArea = L * W;
        const pitchRad = (pitchDeg * Math.PI) / 180;
        const pitchFactor = shape === 'Flat' ? 1 : (Math.cos(pitchRad) > 0 ? 1 / Math.cos(pitchRad) : 1);

        // For gable/hip, surface area approximately equals plan area × pitch factor
        const roofArea = basePlanArea * pitchFactor;

        return {
          result: `${roofArea.toFixed(2)} m²`,
          explanation: 'Approximates roof surface area using plan area multiplied by a pitch factor.',
          formula: 'Roof area ≈ (L×W) × (1/cos(pitch))',
          steps: [
            `Plan area = ${L.toFixed(2)}×${W.toFixed(2)} = ${basePlanArea.toFixed(2)} m²`,
            shape === 'Flat' ? 'Flat roof: pitch factor = 1.00' : `Pitch factor = 1/cos(${pitchDeg.toFixed(0)}°) = ${pitchFactor.toFixed(3)}`,
            `Roof area ≈ ${basePlanArea.toFixed(2)} × ${pitchFactor.toFixed(3)} = ${roofArea.toFixed(2)} m²`,
          ],
          visualData: [
            { label: 'Plan (m²)', value: basePlanArea },
            { label: 'Roof (m²)', value: roofArea },
          ],
          tips: [
            '📌 Complex roofs (valleys/dormers) need detailed takeoff from drawings.',
            '✅ Add extra for overlaps/wastage depending on material type.',
          ],
        };
      },
    };
  }

  if (id === 'roof-pitch') {
    return {
      title: 'Roof Pitch Calculator',
      description: 'Convert roof rise/run to pitch angle and slope percentage',
      presetScenarios: [
        { name: 'Rise 6, Run 12', icon: '📐', values: { rise: 6, run: 12, unit: 'in' } },
        { name: 'Rise 0.5, Run 3', icon: '🏠', values: { rise: 0.5, run: 3, unit: 'm' } },
      ],
      inputs: [
        { name: 'rise', label: 'Rise', type: 'number', defaultValue: 6, min: 0, step: 0.01 },
        { name: 'run', label: 'Run', type: 'number', defaultValue: 12, min: 0.01, step: 0.01 },
        { name: 'unit', label: 'Unit label', type: 'select', options: ['in', 'ft', 'm'], defaultValue: 'in' },
      ],
      calculate: (inputs) => {
        const rise = safeFloat(inputs.rise);
        const run = Math.max(0.0001, safeFloat(inputs.run));
        const unit = inputs.unit || 'in';

        const slope = rise / run;
        const angleDeg = (Math.atan(slope) * 180) / Math.PI;
        const percent = slope * 100;
        const pitchOver12 = slope * 12;

        return {
          result: `${angleDeg.toFixed(1)}°`,
          explanation: 'Roof pitch expressed as angle, slope %, and rise per 12 run.',
          steps: [
            `Slope = rise/run = ${rise.toFixed(3)}/${run.toFixed(3)} = ${slope.toFixed(4)}`,
            `Angle = atan(slope) = ${angleDeg.toFixed(1)}°`,
            `Slope % = ${percent.toFixed(1)}%`,
            `Pitch ≈ ${pitchOver12.toFixed(2)} : 12 (${unit})`,
          ],
          visualData: [
            { label: 'Angle (deg)', value: angleDeg },
            { label: 'Slope (%)', value: percent },
          ],
          tips: ['✅ Use consistent units for rise and run.'],
        };
      },
    };
  }

  if (id === 'drainage-slope') {
    return {
      title: 'Roof Drainage Slope',
      description: 'Compute required drop from slope percentage (or set slope from drop and run)',
      presetScenarios: [
        { name: '1% over 10m', icon: '🌧️', values: { mode: 'Drop from slope', runM: 10, slopePercent: 1, dropMm: 0 } },
        { name: 'Drop 50mm over 6m', icon: '🏠', values: { mode: 'Slope from drop', runM: 6, slopePercent: 0, dropMm: 50 } },
      ],
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: ['Drop from slope', 'Slope from drop'], defaultValue: 'Drop from slope' },
        { name: 'runM', label: 'Run length (m)', type: 'number', defaultValue: 10, min: 0, step: 0.01 },
        { name: 'slopePercent', label: 'Slope (%)', type: 'number', defaultValue: 1, min: 0, step: 0.01 },
        { name: 'dropMm', label: 'Drop (mm)', type: 'number', defaultValue: 50, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'Drop from slope';
        const run = safeFloat(inputs.runM);
        const slopePct = safeFloat(inputs.slopePercent);
        const dropMm = safeFloat(inputs.dropMm);

        const dropFromSlopeMm = run * (slopePct / 100) * 1000;
        const slopeFromDropPct = run > 0 ? (dropMm / (run * 1000)) * 100 : 0;

        return {
          result: mode === 'Slope from drop'
            ? `${slopeFromDropPct.toFixed(2)}% slope`
            : `${dropFromSlopeMm.toFixed(0)} mm drop`,
          explanation: 'Slope (%) = (drop/run) × 100, with run in the same unit as drop.',
          steps: [
            `Run = ${run.toFixed(2)} m`,
            mode === 'Slope from drop'
              ? `Slope = (${dropMm.toFixed(0)} mm / ${(run * 1000).toFixed(0)} mm) × 100 = ${slopeFromDropPct.toFixed(2)}%`
              : `Drop = ${run.toFixed(2)} m × ${slopePct.toFixed(2)}% = ${dropFromSlopeMm.toFixed(0)} mm`,
          ],
          visualData: [
            { label: 'Drop (mm)', value: dropFromSlopeMm },
            { label: 'Slope (%)', value: slopeFromDropPct },
          ],
          tips: ['📌 Check local minimum slope requirements and waterproofing membrane specs.'],
        };
      },
    };
  }

  if (id === 'gutter-calculator') {
    return {
      title: 'Rain Gutter Calculator',
      description: 'Estimate gutter length, downspouts, and flow capacity from roof area and rainfall intensity (approx.)',
      presetScenarios: [
        { name: 'Roof 120 m², heavy rain', icon: '🌧️', values: { roofAreaM2: 120, rainfallMmPerHr: 100, gutterRunM: 20, downspoutCapacityLps: 4 } },
      ],
      inputs: [
        { name: 'roofAreaM2', label: 'Roof area draining to gutter (m²)', type: 'number', defaultValue: 120, min: 0, step: 0.1 },
        { name: 'rainfallMmPerHr', label: 'Design rainfall (mm/hour)', type: 'number', defaultValue: 100, min: 0, step: 1 },
        { name: 'gutterRunM', label: 'Gutter run length (m)', type: 'number', defaultValue: 20, min: 0, step: 0.1 },
        { name: 'downspoutCapacityLps', label: 'Downspout capacity (L/s) (approx.)', type: 'number', defaultValue: 4, min: 0.5, step: 0.1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.roofAreaM2);
        const i = safeFloat(inputs.rainfallMmPerHr);
        const run = safeFloat(inputs.gutterRunM);
        const cap = Math.max(0.0001, safeFloat(inputs.downspoutCapacityLps));

        // Q (L/s) = Area(m²) × rainfall(mm/hr) / 3600
        const flowLps = (area * i) / 3600;
        const downspouts = Math.max(1, Math.ceil(flowLps / cap));
        const spacing = downspouts > 0 ? run / downspouts : 0;

        return {
          result: `${run.toFixed(1)} m gutter`,
          explanation: 'Flow estimate from roof area and rainfall; suggests number of downspouts by capacity.',
          steps: [
            `Flow Q = A×i/3600 = ${area.toFixed(1)}×${i.toFixed(0)}/3600 = ${flowLps.toFixed(2)} L/s`,
            `Downspout capacity ≈ ${cap.toFixed(2)} L/s → required = ${downspouts}`,
            `Approx spacing along ${run.toFixed(1)} m run ≈ ${spacing.toFixed(1)} m`,
          ],
          visualData: [
            { label: 'Flow (L/s)', value: flowLps },
            { label: 'Downspouts', value: downspouts },
          ],
          tips: [
            '⚠️ Capacity depends on gutter profile, slope, and outlet size; verify with manufacturer tables.',
            '✅ Add leaf guards and maintenance access in tree-heavy areas.',
          ],
        };
      },
    };
  }

  if (id === 'metal-roofing') {
    return {
      title: 'Metal Roofing Calculator',
      description: 'Estimate metal sheet count from roof area, sheet coverage, and overlap wastage',
      presetScenarios: [
        { name: 'Roof 150 m²', icon: '🪙', values: { roofAreaM2: 150, sheetCoverageM2: 3.0, wastage: 10 } },
      ],
      inputs: [
        { name: 'roofAreaM2', label: 'Roof area (m²)', type: 'number', defaultValue: 150, min: 0, step: 0.1 },
        { name: 'sheetCoverageM2', label: 'Coverage per sheet (m²)', type: 'number', defaultValue: 3.0, min: 0.1, step: 0.1, helpText: 'Use effective coverage (after side laps) if known' },
        { name: 'wastage', label: 'Overlap/Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.roofAreaM2);
        const coverage = Math.max(0.0001, safeFloat(inputs.sheetCoverageM2));
        const wastage = safeFloat(inputs.wastage);

        const adj = area * (1 + wastage / 100);
        const sheets = Math.ceil(adj / coverage);

        return {
          result: `${sheets} sheets`,
          explanation: 'Sheets = ceil((roof area × (1+wastage)) / effective sheet coverage).',
          steps: [
            `Roof area = ${area.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${adj.toFixed(2)} m²`,
            `Coverage per sheet = ${coverage.toFixed(2)} m²`,
            `Sheets = ceil(${adj.toFixed(2)} / ${coverage.toFixed(2)}) = ${sheets}`,
          ],
          visualData: [
            { label: 'Adjusted area (m²)', value: adj },
            { label: 'Sheets', value: sheets },
          ],
          tips: ['📌 Include ridge/hip flashing and fasteners separately.'],
        };
      },
    };
  }

  if (id === 'shingle-calculator') {
    return {
      title: 'Roofing Shingle Calculator',
      description: 'Estimate shingle bundles from roof area and bundle coverage',
      presetScenarios: [
        { name: 'Roof 180 m²', icon: '🧱', values: { roofAreaM2: 180, bundleCoverageM2: 3.1, wastage: 10 } },
      ],
      inputs: [
        { name: 'roofAreaM2', label: 'Roof area (m²)', type: 'number', defaultValue: 180, min: 0, step: 0.1 },
        { name: 'bundleCoverageM2', label: 'Coverage per bundle (m²)', type: 'number', defaultValue: 3.1, min: 0.1, step: 0.1 },
        { name: 'wastage', label: 'Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.roofAreaM2);
        const coverage = Math.max(0.0001, safeFloat(inputs.bundleCoverageM2));
        const wastage = safeFloat(inputs.wastage);

        const adj = area * (1 + wastage / 100);
        const bundles = Math.ceil(adj / coverage);

        return {
          result: `${bundles} bundles`,
          explanation: 'Bundles estimated from adjusted roof area and bundle coverage.',
          steps: [
            `Area = ${area.toFixed(2)} m²`,
            `Wastage = ${wastage.toFixed(0)}% → ${adj.toFixed(2)} m²`,
            `Coverage/bundle = ${coverage.toFixed(2)} m²`,
            `Bundles = ${bundles}`,
          ],
          visualData: [
            { label: 'Adjusted area (m²)', value: adj },
            { label: 'Bundles', value: bundles },
          ],
          tips: ['✅ Increase wastage for complex roofs and many valleys.'],
        };
      },
    };
  }

  if (id === 'skylight-calculator') {
    return {
      title: 'Skylight Size Calculator',
      description: 'Estimate recommended skylight area as a fraction of floor area (rule-of-thumb)',
      presetScenarios: [
        { name: 'Room 20 m²', icon: '☀️', values: { floorAreaM2: 20, daylightFactorPercent: 7, skylightUnitAreaM2: 0.72 } },
      ],
      inputs: [
        { name: 'floorAreaM2', label: 'Floor area (m²)', type: 'number', defaultValue: 20, min: 0, step: 0.1 },
        { name: 'daylightFactorPercent', label: 'Skylight area (% of floor)', type: 'slider', defaultValue: 7, min: 2, max: 15, step: 1, helpText: 'Typical guidance often falls in ~5–10% depending on climate and glazing' },
        { name: 'skylightUnitAreaM2', label: 'Single skylight size (m²)', type: 'number', defaultValue: 0.72, min: 0.1, step: 0.01, helpText: 'Example: 1.2m×0.6m = 0.72 m²' },
      ],
      calculate: (inputs) => {
        const floor = safeFloat(inputs.floorAreaM2);
        const pct = safeFloat(inputs.daylightFactorPercent);
        const unit = Math.max(0.0001, safeFloat(inputs.skylightUnitAreaM2));

        const targetArea = floor * (pct / 100);
        const count = Math.max(1, Math.ceil(targetArea / unit));
        const provided = count * unit;

        return {
          result: `${count} skylights`,
          explanation: 'Rule-of-thumb sizing from floor area. Final design depends on glazing type and roof structure.',
          steps: [
            `Target skylight area = ${floor.toFixed(2)} × ${pct.toFixed(0)}% = ${targetArea.toFixed(2)} m²`,
            `Unit skylight = ${unit.toFixed(2)} m²`,
            `Count = ceil(${targetArea.toFixed(2)} / ${unit.toFixed(2)}) = ${count}`,
            `Provided area = ${provided.toFixed(2)} m²`,
          ],
          visualData: [
            { label: 'Target (m²)', value: targetArea },
            { label: 'Provided (m²)', value: provided },
          ],
          tips: ['⚠️ Check structural framing and waterproofing details around openings.'],
        };
      },
    };
  }

  if (id === 'rainwater-harvesting') {
    return {
      title: 'Rainwater Harvesting Calculator',
      description: 'Estimate annual rainwater yield from catchment area and rainfall (approx.)',
      presetScenarios: [
        { name: 'Roof 120m², 800mm/yr', icon: '💧', values: { catchmentAreaM2: 120, rainfallMmPerYear: 800, runoffCoeff: 0.8, filterLossPercent: 10 } },
      ],
      inputs: [
        { name: 'catchmentAreaM2', label: 'Catchment area (m²)', type: 'number', defaultValue: 120, min: 0, step: 0.1 },
        { name: 'rainfallMmPerYear', label: 'Annual rainfall (mm/year)', type: 'number', defaultValue: 800, min: 0, step: 10 },
        { name: 'runoffCoeff', label: 'Runoff coefficient', type: 'number', defaultValue: 0.8, min: 0.3, max: 0.95, step: 0.05, helpText: 'Metal roof ~0.8–0.9, tiled ~0.7–0.85 (varies)' },
        { name: 'filterLossPercent', label: 'First-flush/filter loss (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const A = safeFloat(inputs.catchmentAreaM2);
        const Rmm = safeFloat(inputs.rainfallMmPerYear);
        const c = Math.min(1, Math.max(0, safeFloat(inputs.runoffCoeff) || 0.8));
        const loss = Math.min(90, Math.max(0, safeFloat(inputs.filterLossPercent)));

        const rainfallM = Rmm / 1000;
        const rawM3 = A * rainfallM * c;
        const netM3 = rawM3 * (1 - loss / 100);
        const liters = netM3 * 1000;

        return {
          result: `${liters.toFixed(0)} L/year`,
          explanation: 'Yield = area × rainfall × runoff coefficient, reduced by first-flush/filter losses.',
          steps: [
            `Rainfall = ${Rmm.toFixed(0)} mm = ${rainfallM.toFixed(3)} m`,
            `Raw yield = ${A.toFixed(1)}×${rainfallM.toFixed(3)}×${c.toFixed(2)} = ${rawM3.toFixed(2)} m³`,
            `Loss = ${loss.toFixed(0)}% → net = ${netM3.toFixed(2)} m³`,
            `Net ≈ ${liters.toFixed(0)} L/year`,
          ],
          visualData: [
            { label: 'Net (m³)', value: netM3 },
            { label: 'Liters/year', value: liters },
          ],
          tips: ['✅ Storage sizing depends on rainfall seasonality and usage pattern.'],
        };
      },
    };
  }

  if (id === 'membrane-waterproofing') {
    return {
      title: 'Membrane Waterproofing Calculator',
      description: 'Estimate membrane rolls needed from area, roll size, and overlap wastage',
      presetScenarios: [
        { name: 'Terrace 120 m²', icon: '🧰', values: { areaM2: 120, rollWidthM: 1, rollLengthM: 10, overlapPercent: 10 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Area to waterproof (m²)', type: 'number', defaultValue: 120, min: 0, step: 0.1 },
        { name: 'rollWidthM', label: 'Roll width (m)', type: 'number', defaultValue: 1, min: 0.2, step: 0.05 },
        { name: 'rollLengthM', label: 'Roll length (m)', type: 'number', defaultValue: 10, min: 1, step: 0.5 },
        { name: 'overlapPercent', label: 'Overlap/Wastage (%)', type: 'slider', defaultValue: 10, min: 0, max: 25, step: 1 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaM2);
        const w = safeFloat(inputs.rollWidthM);
        const l = safeFloat(inputs.rollLengthM);
        const overlap = safeFloat(inputs.overlapPercent);

        const rollArea = w * l;
        const adj = area * (1 + overlap / 100);
        const rolls = rollArea > 0 ? Math.ceil(adj / rollArea) : 0;

        return {
          result: `${rolls} rolls`,
          explanation: 'Rolls = ceil((area × (1+overlap)) / (roll width × roll length)).',
          steps: [
            `Area = ${area.toFixed(2)} m²`,
            `Overlap/Wastage = ${overlap.toFixed(0)}% → ${adj.toFixed(2)} m²`,
            `Roll coverage = ${w.toFixed(2)}×${l.toFixed(2)} = ${rollArea.toFixed(2)} m²`,
            `Rolls = ${rolls}`,
          ],
          visualData: [
            { label: 'Adjusted area (m²)', value: adj },
            { label: 'Rolls', value: rolls },
          ],
          tips: ['⚠️ Detailing at corners/drains/penetrations may require extra material.'],
        };
      },
    };
  }

  if (id === 'waterproofing-cost') {
    return {
      title: 'Waterproofing Calculator',
      description: 'Estimate waterproofing quantity and cost from area and rate (with wastage)',
      presetScenarios: [
        { name: 'Terrace 100 m²', icon: '💦', values: { areaM2: 100, ratePerM2: 450, wastage: 8 } },
      ],
      inputs: [
        { name: 'areaM2', label: 'Area (m²)', type: 'number', defaultValue: 100, min: 0, step: 0.1 },
        { name: 'wastage', label: 'Extra/Wastage (%)', type: 'slider', defaultValue: 8, min: 0, max: 25, step: 1 },
        { name: 'ratePerM2', label: 'Rate (₹/m²)', type: 'number', defaultValue: 450, min: 0, step: 10 },
      ],
      calculate: (inputs) => {
        const area = safeFloat(inputs.areaM2);
        const waste = safeFloat(inputs.wastage);
        const rate = safeFloat(inputs.ratePerM2);

        const qty = area * (1 + waste / 100);
        const cost = qty * rate;

        return {
          result: `₹${cost.toFixed(0)}`,
          explanation: 'Cost = (area + wastage) × rate.',
          steps: [
            `Area = ${area.toFixed(2)} m²`,
            `Wastage = ${waste.toFixed(0)}% → Qty = ${qty.toFixed(2)} m²`,
            `Cost = ${qty.toFixed(2)} × ₹${rate.toFixed(0)} = ₹${cost.toFixed(0)}`,
          ],
          visualData: [
            { label: 'Qty (m²)', value: qty },
            { label: 'Cost (₹)', value: cost },
          ],
          tips: ['✅ Ask for system warranty and surface preparation details in the quote.'],
        };
      },
    };
  }

  // HVAC & INSULATION (ADVANCED)
  if (id === 'btu-calculator') {
    return {
      title: 'BTU Calculator for AC',
      description: 'Estimate cooling capacity (BTU/hr) from room size and common adjustment factors (approx.)',
      presetScenarios: [
        { name: 'Bedroom 12×12 ft', icon: '🛏️', values: { unit: 'ft', length: 12, width: 12, height: 9, insulation: 'Average', climate: 'Hot', people: 2, windows: 1 } },
        { name: 'Living 4×5 m', icon: '🛋️', values: { unit: 'm', length: 4, width: 5, height: 3, insulation: 'Poor', climate: 'Very Hot', people: 4, windows: 2 } },
      ],
      inputs: [
        { name: 'unit', label: 'Units', type: 'select', options: ['ft', 'm'], defaultValue: 'ft' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'height', label: 'Ceiling height', type: 'number', defaultValue: 9, min: 0, step: 0.1 },
        { name: 'insulation', label: 'Insulation level', type: 'select', options: ['Good', 'Average', 'Poor'], defaultValue: 'Average' },
        { name: 'climate', label: 'Climate', type: 'select', options: ['Mild', 'Hot', 'Very Hot'], defaultValue: 'Hot' },
        { name: 'people', label: 'People typically in room', type: 'number', defaultValue: 2, min: 0, step: 1 },
        { name: 'windows', label: 'Windows receiving sun', type: 'number', defaultValue: 1, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const unit = inputs.unit || 'ft';
        const length = safeFloat(inputs.length);
        const width = safeFloat(inputs.width);
        const height = safeFloat(inputs.height);
        const insulation = inputs.insulation || 'Average';
        const climate = inputs.climate || 'Hot';
        const people = Math.max(0, safeInt(inputs.people));
        const windows = Math.max(0, safeInt(inputs.windows));

        const lengthFt = unit === 'm' ? length * 3.28084 : length;
        const widthFt = unit === 'm' ? width * 3.28084 : width;
        const heightFt = unit === 'm' ? height * 3.28084 : height;
        const areaFt2 = lengthFt * widthFt;

        // Rule-of-thumb baseline: ~25 BTU/hr per ft² (average room, ~8ft ceiling)
        const base = areaFt2 * 25;

        const insulationFactor = insulation === 'Good' ? 0.9 : insulation === 'Poor' ? 1.12 : 1.0;
        const climateFactor = climate === 'Mild' ? 0.9 : climate === 'Very Hot' ? 1.2 : 1.0;
        const heightFactor = heightFt > 0 ? heightFt / 8 : 1;

        const peopleBTU = people * 600;
        const windowBTU = windows * 1000;

        const btu = (base * insulationFactor * climateFactor * heightFactor) + peopleBTU + windowBTU;
        const tonnage = btu / 12000;

        return {
          result: `${Math.round(btu).toLocaleString()} BTU/hr`,
          explanation: 'A practical estimate using room area baseline with adjustments for ceiling height, climate, insulation, people, and sun-facing windows.',
          steps: [
            `Area ≈ ${areaFt2.toFixed(0)} ft² → base ≈ ${Math.round(base).toLocaleString()} BTU/hr (25×area)`,
            `Ceiling factor = ${heightFactor.toFixed(2)} (height/8ft)`,
            `Insulation factor = ${insulationFactor.toFixed(2)}, climate factor = ${climateFactor.toFixed(2)}`,
            `People add = ${peopleBTU.toLocaleString()} BTU/hr, windows add = ${windowBTU.toLocaleString()} BTU/hr`,
            `Total ≈ ${Math.round(btu).toLocaleString()} BTU/hr (≈ ${tonnage.toFixed(2)} TR)`,
          ],
          visualData: [
            { label: 'BTU/hr', value: btu },
            { label: 'Tonnage (TR)', value: tonnage },
          ],
          tips: [
            '✅ Use this for quick sizing; final sizing should consider heat gain and equipment efficiency.',
            '📌 Add margin for top-floor rooms, west-facing glass, and poor shading.',
          ],
        };
      },
    };
  }

  if (id === 'ac-tonnage') {
    return {
      title: 'AC Tonnage Calculator',
      description: 'Convert BTU/hr to tons of refrigeration (TR) or estimate tonnage from room size (approx.)',
      presetScenarios: [
        { name: 'From BTU (18,000)', icon: '❄️', values: { mode: 'From BTU', btuPerHr: 18000, unit: 'ft', length: 0, width: 0, height: 0, insulation: 'Average', climate: 'Hot', people: 0, windows: 0 } },
        { name: 'From Room 12×12 ft', icon: '🏠', values: { mode: 'From Room', btuPerHr: 0, unit: 'ft', length: 12, width: 12, height: 9, insulation: 'Average', climate: 'Hot', people: 2, windows: 1 } },
      ],
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: ['From BTU', 'From Room'], defaultValue: 'From BTU' },
        { name: 'btuPerHr', label: 'Cooling load (BTU/hr)', type: 'number', defaultValue: 18000, min: 0, step: 100 },
        { name: 'unit', label: 'Room units (for "From Room")', type: 'select', options: ['ft', 'm'], defaultValue: 'ft' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'height', label: 'Ceiling height', type: 'number', defaultValue: 9, min: 0, step: 0.1 },
        { name: 'insulation', label: 'Insulation', type: 'select', options: ['Good', 'Average', 'Poor'], defaultValue: 'Average' },
        { name: 'climate', label: 'Climate', type: 'select', options: ['Mild', 'Hot', 'Very Hot'], defaultValue: 'Hot' },
        { name: 'people', label: 'People', type: 'number', defaultValue: 2, min: 0, step: 1 },
        { name: 'windows', label: 'Sun-facing windows', type: 'number', defaultValue: 1, min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'From BTU';
        let btu = safeFloat(inputs.btuPerHr);

        if (mode === 'From Room') {
          const unit = inputs.unit || 'ft';
          const length = safeFloat(inputs.length);
          const width = safeFloat(inputs.width);
          const height = safeFloat(inputs.height);
          const insulation = inputs.insulation || 'Average';
          const climate = inputs.climate || 'Hot';
          const people = Math.max(0, safeInt(inputs.people));
          const windows = Math.max(0, safeInt(inputs.windows));

          const lengthFt = unit === 'm' ? length * 3.28084 : length;
          const widthFt = unit === 'm' ? width * 3.28084 : width;
          const heightFt = unit === 'm' ? height * 3.28084 : height;
          const areaFt2 = lengthFt * widthFt;

          const base = areaFt2 * 25;
          const insulationFactor = insulation === 'Good' ? 0.9 : insulation === 'Poor' ? 1.12 : 1.0;
          const climateFactor = climate === 'Mild' ? 0.9 : climate === 'Very Hot' ? 1.2 : 1.0;
          const heightFactor = heightFt > 0 ? heightFt / 8 : 1;
          btu = (base * insulationFactor * climateFactor * heightFactor) + (people * 600) + (windows * 1000);
        }

        const tr = btu / 12000;
        const kW = btu * 0.000293071;

        return {
          result: `${tr.toFixed(2)} TR`,
          explanation: '1 ton of refrigeration (TR) ≈ 12,000 BTU/hr.',
          steps: [
            `BTU/hr = ${Math.round(btu).toLocaleString()}`,
            `TR = BTU/hr ÷ 12,000 = ${tr.toFixed(2)}`,
            `Cooling power ≈ ${kW.toFixed(2)} kW`,
          ],
          visualData: [
            { label: 'TR', value: tr },
            { label: 'kW', value: kW },
          ],
          tips: ['✅ Round up slightly for safety, but avoid oversizing (humidity control suffers).'],
        };
      },
    };
  }

  if (id === 'cfm-calculator') {
    return {
      title: 'CFM Calculator',
      description: 'Compute airflow (CFM) from air-changes-per-hour (ACH) or from a cooling load and ΔT (approx.)',
      presetScenarios: [
        { name: 'ACH method (bedroom)', icon: '🌬️', values: { mode: 'From ACH', unit: 'ft', length: 12, width: 12, height: 9, ach: 6, btuPerHr: 0, deltaTF: 20 } },
        { name: 'BTU method (18k BTU)', icon: '❄️', values: { mode: 'From BTU', unit: 'ft', length: 0, width: 0, height: 0, ach: 0, btuPerHr: 18000, deltaTF: 20 } },
      ],
      inputs: [
        { name: 'mode', label: 'Mode', type: 'select', options: ['From ACH', 'From BTU'], defaultValue: 'From ACH' },
        { name: 'unit', label: 'Room units (ACH mode)', type: 'select', options: ['ft', 'm'], defaultValue: 'ft' },
        { name: 'length', label: 'Room length', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'width', label: 'Room width', type: 'number', defaultValue: 12, min: 0, step: 0.1 },
        { name: 'height', label: 'Ceiling height', type: 'number', defaultValue: 9, min: 0, step: 0.1 },
        { name: 'ach', label: 'Air changes per hour (ACH)', type: 'number', defaultValue: 6, min: 0, step: 0.5 },
        { name: 'btuPerHr', label: 'Cooling load (BTU/hr) (BTU mode)', type: 'number', defaultValue: 18000, min: 0, step: 100 },
        { name: 'deltaTF', label: 'Supply/return ΔT (°F) (BTU mode)', type: 'number', defaultValue: 20, min: 1, step: 1, helpText: 'Typical HVAC range often ~15–25°F' },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'From ACH';
        let cfm = 0;
        let notes: string[] = [];

        if (mode === 'From ACH') {
          const unit = inputs.unit || 'ft';
          const L = safeFloat(inputs.length);
          const W = safeFloat(inputs.width);
          const H = safeFloat(inputs.height);
          const ach = safeFloat(inputs.ach);
          const Lft = unit === 'm' ? L * 3.28084 : L;
          const Wft = unit === 'm' ? W * 3.28084 : W;
          const Hft = unit === 'm' ? H * 3.28084 : H;
          const volumeFt3 = Lft * Wft * Hft;
          cfm = (volumeFt3 * ach) / 60;
          notes = [
            `Volume ≈ ${volumeFt3.toFixed(0)} ft³`,
            `CFM = Volume×ACH/60 = ${volumeFt3.toFixed(0)}×${ach.toFixed(1)}/60`,
          ];
        } else {
          const btu = safeFloat(inputs.btuPerHr);
          const dT = Math.max(0.0001, safeFloat(inputs.deltaTF));
          // Sensible heat equation: BTU/hr = 1.08 × CFM × ΔT
          cfm = btu / (1.08 * dT);
          notes = [
            `CFM = BTU/hr ÷ (1.08×ΔT) = ${Math.round(btu).toLocaleString()} ÷ (1.08×${dT.toFixed(0)})`,
          ];
        }

        const lps = cfm * 0.471947;

        return {
          result: `${cfm.toFixed(0)} CFM`,
          explanation: 'CFM can be estimated either from target air changes (ACH) or from a sensible cooling load with a temperature difference.',
          steps: [...notes, `≈ ${lps.toFixed(1)} L/s`],
          visualData: [
            { label: 'CFM', value: cfm },
            { label: 'L/s', value: lps },
          ],
          tips: ['📌 For total airflow, consider latent load and humidity control too.'],
        };
      },
    };
  }

  if (id === 'ventilation-calculator') {
    return {
      title: 'Ventilation Calculator',
      description: 'Estimate required outdoor air (CFM) from occupancy and floor area (rule-of-thumb / ASHRAE-style)',
      presetScenarios: [
        { name: 'Small office', icon: '🏢', values: { people: 10, areaUnit: 'ft²', area: 500, cfmPerPerson: 5, cfmPerArea: 0.06 } },
        { name: 'Classroom', icon: '🏫', values: { people: 30, areaUnit: 'm²', area: 60, cfmPerPerson: 7.5, cfmPerArea: 0.12 } },
      ],
      inputs: [
        { name: 'people', label: 'Number of people', type: 'number', defaultValue: 10, min: 0, step: 1 },
        { name: 'areaUnit', label: 'Floor area unit', type: 'select', options: ['ft²', 'm²'], defaultValue: 'ft²' },
        { name: 'area', label: 'Floor area', type: 'number', defaultValue: 500, min: 0, step: 1 },
        { name: 'cfmPerPerson', label: 'Ventilation per person (CFM/person)', type: 'number', defaultValue: 5, min: 0, step: 0.5 },
        { name: 'cfmPerArea', label: 'Ventilation per area (CFM/ft²)', type: 'number', defaultValue: 0.06, min: 0, step: 0.01, helpText: 'If using m², value will be converted internally' },
      ],
      calculate: (inputs) => {
        const people = Math.max(0, safeInt(inputs.people));
        const areaUnit = inputs.areaUnit || 'ft²';
        const areaInput = safeFloat(inputs.area);
        const cfmPerPerson = Math.max(0, safeFloat(inputs.cfmPerPerson));
        const cfmPerArea = Math.max(0, safeFloat(inputs.cfmPerArea));

        const areaFt2 = areaUnit === 'm²' ? areaInput * 10.7639 : areaInput;
        const perAreaCfm = cfmPerArea * (areaUnit === 'm²' ? 1 / 10.7639 : 1);

        const cfmPeople = people * cfmPerPerson;
        const cfmArea = areaFt2 * perAreaCfm;
        const totalCfm = cfmPeople + cfmArea;
        const lps = totalCfm * 0.471947;

        return {
          result: `${totalCfm.toFixed(0)} CFM`,
          explanation: 'Outdoor air requirement estimated as (people × CFM/person) + (area × CFM/area).',
          steps: [
            `People component = ${people} × ${cfmPerPerson.toFixed(1)} = ${cfmPeople.toFixed(0)} CFM`,
            `Area component = ${areaFt2.toFixed(0)} ft² × ${perAreaCfm.toFixed(3)} = ${cfmArea.toFixed(0)} CFM`,
            `Total = ${totalCfm.toFixed(0)} CFM (≈ ${lps.toFixed(1)} L/s)`,
          ],
          visualData: [
            { label: 'People CFM', value: cfmPeople },
            { label: 'Area CFM', value: cfmArea },
            { label: 'Total CFM', value: totalCfm },
          ],
          tips: ['✅ Verify against local code and building type requirements.'],
        };
      },
    };
  }

  if (id === 'heat-gain-calculator') {
    return {
      title: 'Heat Gain Calculator',
      description: 'Estimate cooling heat gain from envelope U-values and infiltration (simplified)',
      presetScenarios: [
        { name: 'Small room', icon: '🌡️', values: { lengthM: 4, widthM: 4, heightM: 3, deltaTC: 10, ach: 1, wallAreaM2: 35, wallU: 1.2, roofAreaM2: 16, roofU: 0.8, windowAreaM2: 4, windowU: 2.8 } },
      ],
      inputs: [
        { name: 'lengthM', label: 'Length (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'widthM', label: 'Width (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'heightM', label: 'Height (m)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'deltaTC', label: 'Indoor–Outdoor ΔT (°C)', type: 'number', defaultValue: 10, min: 0, step: 0.5 },
        { name: 'ach', label: 'Air changes per hour (ACH)', type: 'number', defaultValue: 1, min: 0, step: 0.1 },
        { name: 'wallAreaM2', label: 'Wall area (m²)', type: 'number', defaultValue: 35, min: 0, step: 0.1 },
        { name: 'wallU', label: 'Wall U-value (W/m²·K)', type: 'number', defaultValue: 1.2, min: 0, step: 0.05 },
        { name: 'roofAreaM2', label: 'Roof area (m²)', type: 'number', defaultValue: 16, min: 0, step: 0.1 },
        { name: 'roofU', label: 'Roof U-value (W/m²·K)', type: 'number', defaultValue: 0.8, min: 0, step: 0.05 },
        { name: 'windowAreaM2', label: 'Window area (m²)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'windowU', label: 'Window U-value (W/m²·K)', type: 'number', defaultValue: 2.8, min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const H = safeFloat(inputs.heightM);
        const dT = safeFloat(inputs.deltaTC);
        const ach = Math.max(0, safeFloat(inputs.ach));

        const V = L * W * H; // m³

        const Aw = safeFloat(inputs.wallAreaM2);
        const Uw = safeFloat(inputs.wallU);
        const Ar = safeFloat(inputs.roofAreaM2);
        const Ur = safeFloat(inputs.roofU);
        const Awin = safeFloat(inputs.windowAreaM2);
        const Uwin = safeFloat(inputs.windowU);

        const qWalls = Uw * Aw * dT;
        const qRoof = Ur * Ar * dT;
        const qWindows = Uwin * Awin * dT;
        // Infiltration sensible load approx: Q(W) ≈ 0.33 × ACH × V(m³) × ΔT(°C)
        const qInf = 0.33 * ach * V * dT;
        const qTotalW = qWalls + qRoof + qWindows + qInf;
        const qkW = qTotalW / 1000;
        const btuPerHr = qTotalW * 3.41214163;
        const tr = btuPerHr / 12000;

        return {
          result: `${qkW.toFixed(2)} kW`,
          explanation: 'Simplified heat gain from conduction (U×A×ΔT) plus infiltration sensible load (0.33×ACH×V×ΔT).',
          steps: [
            `Room volume V = ${L.toFixed(2)}×${W.toFixed(2)}×${H.toFixed(2)} = ${V.toFixed(2)} m³`,
            `Walls: ${qWalls.toFixed(0)} W, Roof: ${qRoof.toFixed(0)} W, Windows: ${qWindows.toFixed(0)} W`,
            `Infiltration: 0.33×${ach.toFixed(2)}×${V.toFixed(2)}×${dT.toFixed(1)} = ${qInf.toFixed(0)} W`,
            `Total ≈ ${qTotalW.toFixed(0)} W = ${qkW.toFixed(2)} kW`,
            `≈ ${Math.round(btuPerHr).toLocaleString()} BTU/hr (≈ ${tr.toFixed(2)} TR)`,
          ],
          visualData: [
            { label: 'Walls (W)', value: qWalls },
            { label: 'Roof (W)', value: qRoof },
            { label: 'Windows (W)', value: qWindows },
            { label: 'Infiltration (W)', value: qInf },
          ],
          tips: ['📌 Solar gain and internal loads (lights/appliances) can be significant; add margin if needed.'],
        };
      },
    };
  }

  if (id === 'heat-loss') {
    return {
      title: 'Heat Loss Calculator',
      description: 'Estimate heating heat loss from envelope U-values and infiltration (simplified)',
      presetScenarios: [
        { name: 'Room heating', icon: '🔥', values: { lengthM: 4, widthM: 4, heightM: 3, deltaTC: 18, ach: 0.7, wallAreaM2: 35, wallU: 1.0, roofAreaM2: 16, roofU: 0.6, windowAreaM2: 4, windowU: 2.5 } },
      ],
      inputs: [
        { name: 'lengthM', label: 'Length (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'widthM', label: 'Width (m)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'heightM', label: 'Height (m)', type: 'number', defaultValue: 3, min: 0, step: 0.1 },
        { name: 'deltaTC', label: 'Indoor–Outdoor ΔT (°C)', type: 'number', defaultValue: 18, min: 0, step: 0.5 },
        { name: 'ach', label: 'Air changes per hour (ACH)', type: 'number', defaultValue: 0.7, min: 0, step: 0.1 },
        { name: 'wallAreaM2', label: 'Wall area (m²)', type: 'number', defaultValue: 35, min: 0, step: 0.1 },
        { name: 'wallU', label: 'Wall U-value (W/m²·K)', type: 'number', defaultValue: 1.0, min: 0, step: 0.05 },
        { name: 'roofAreaM2', label: 'Roof area (m²)', type: 'number', defaultValue: 16, min: 0, step: 0.1 },
        { name: 'roofU', label: 'Roof U-value (W/m²·K)', type: 'number', defaultValue: 0.6, min: 0, step: 0.05 },
        { name: 'windowAreaM2', label: 'Window area (m²)', type: 'number', defaultValue: 4, min: 0, step: 0.1 },
        { name: 'windowU', label: 'Window U-value (W/m²·K)', type: 'number', defaultValue: 2.5, min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const L = safeFloat(inputs.lengthM);
        const W = safeFloat(inputs.widthM);
        const H = safeFloat(inputs.heightM);
        const dT = safeFloat(inputs.deltaTC);
        const ach = Math.max(0, safeFloat(inputs.ach));
        const V = L * W * H;

        const Aw = safeFloat(inputs.wallAreaM2);
        const Uw = safeFloat(inputs.wallU);
        const Ar = safeFloat(inputs.roofAreaM2);
        const Ur = safeFloat(inputs.roofU);
        const Awin = safeFloat(inputs.windowAreaM2);
        const Uwin = safeFloat(inputs.windowU);

        const qWalls = Uw * Aw * dT;
        const qRoof = Ur * Ar * dT;
        const qWindows = Uwin * Awin * dT;
        const qInf = 0.33 * ach * V * dT;
        const qTotalW = qWalls + qRoof + qWindows + qInf;
        const qkW = qTotalW / 1000;
        const btuPerHr = qTotalW * 3.41214163;

        return {
          result: `${qkW.toFixed(2)} kW`,
          explanation: 'Simplified heating loss from conduction and infiltration sensible load.',
          steps: [
            `Room volume V = ${V.toFixed(2)} m³`,
            `Walls: ${qWalls.toFixed(0)} W, Roof: ${qRoof.toFixed(0)} W, Windows: ${qWindows.toFixed(0)} W`,
            `Infiltration: ${qInf.toFixed(0)} W`,
            `Total ≈ ${qTotalW.toFixed(0)} W = ${qkW.toFixed(2)} kW`,
            `≈ ${Math.round(btuPerHr).toLocaleString()} BTU/hr`,
          ],
          visualData: [
            { label: 'Total (W)', value: qTotalW },
            { label: 'Total (kW)', value: qkW },
          ],
          tips: ['✅ For boilers/heaters, include system losses and a safety factor.'],
        };
      },
    };
  }

  if (id === 'duct-size') {
    return {
      title: 'Duct Size Calculator',
      description: 'Estimate round duct diameter from airflow (CFM) and target velocity (fpm)',
      presetScenarios: [
        { name: '400 CFM @ 900 fpm', icon: '🌀', values: { airflowCfm: 400, velocityFpm: 900 } },
      ],
      inputs: [
        { name: 'airflowCfm', label: 'Airflow (CFM)', type: 'number', defaultValue: 400, min: 0, step: 10 },
        { name: 'velocityFpm', label: 'Target velocity (fpm)', type: 'number', defaultValue: 900, min: 100, step: 50, helpText: 'Typical: supply ~700–1200 fpm, return ~500–900 fpm' },
      ],
      calculate: (inputs) => {
        const cfm = Math.max(0, safeFloat(inputs.airflowCfm));
        const v = Math.max(0.0001, safeFloat(inputs.velocityFpm));

        const areaFt2 = cfm / v;
        const diameterFt = Math.sqrt((4 * areaFt2) / Math.PI);
        const diameterIn = diameterFt * 12;
        const diameterRoundedIn = Math.max(1, Math.round(diameterIn * 2) / 2);
        const diameterMm = diameterRoundedIn * 25.4;

        return {
          result: `${diameterRoundedIn.toFixed(1)} in duct`,
          explanation: 'Uses round-duct area from CFM and velocity: Area = CFM/velocity, then diameter from area.',
          formula: 'Area(ft²)=CFM/velocity(fpm), d=√(4A/π)',
          steps: [
            `Area = ${cfm.toFixed(0)} / ${v.toFixed(0)} = ${areaFt2.toFixed(3)} ft²`,
            `Diameter ≈ ${diameterIn.toFixed(2)} in → rounded to ${diameterRoundedIn.toFixed(1)} in (${diameterMm.toFixed(0)} mm)`,
          ],
          visualData: [
            { label: 'Area (ft²)', value: areaFt2 },
            { label: 'Diameter (in)', value: diameterRoundedIn },
          ],
          tips: ['📌 Check noise and static pressure; lower velocity often improves comfort.'],
        };
      },
    };
  }

  if (id === 'chiller-sizing') {
    return {
      title: 'Chiller Capacity Calculator',
      description: 'Convert cooling load between kW, BTU/hr, and TR (with optional safety factor)',
      presetScenarios: [
        { name: 'Load 50 kW', icon: '🏭', values: { mode: 'kW', load: 50, safetyPercent: 10 } },
        { name: 'Load 30 TR', icon: '❄️', values: { mode: 'TR', load: 30, safetyPercent: 15 } },
      ],
      inputs: [
        { name: 'mode', label: 'Input unit', type: 'select', options: ['kW', 'BTU/hr', 'TR'], defaultValue: 'kW' },
        { name: 'load', label: 'Cooling load', type: 'number', defaultValue: 50, min: 0, step: 0.1 },
        { name: 'safetyPercent', label: 'Safety factor (%)', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const mode = inputs.mode || 'kW';
        const load = Math.max(0, safeFloat(inputs.load));
        const safety = Math.max(0, safeFloat(inputs.safetyPercent));

        let kW = 0;
        if (mode === 'kW') kW = load;
        if (mode === 'BTU/hr') kW = load * 0.000293071;
        if (mode === 'TR') kW = load * 3.517;

        const kWAdj = kW * (1 + safety / 100);
        const tr = kWAdj / 3.517;
        const btu = kWAdj / 0.000293071;

        return {
          result: `${tr.toFixed(2)} TR`,
          explanation: 'Uses 1 TR ≈ 3.517 kW and 1 kW ≈ 3412 BTU/hr, then applies a safety factor.',
          steps: [
            `Base load = ${kW.toFixed(2)} kW`,
            `Safety factor = ${safety.toFixed(0)}% → ${kWAdj.toFixed(2)} kW`,
            `TR = ${kWAdj.toFixed(2)} / 3.517 = ${tr.toFixed(2)} TR`,
            `BTU/hr ≈ ${Math.round(btu).toLocaleString()} BTU/hr`,
          ],
          visualData: [
            { label: 'kW', value: kWAdj },
            { label: 'TR', value: tr },
          ],
          tips: ['✅ Verify with detailed load calculations for industrial/critical systems.'],
        };
      },
    };
  }

  if (id === 'boiler-sizing') {
    return {
      title: 'Boiler Size Calculator',
      description: 'Estimate boiler input size from heating load, efficiency, and safety factor',
      presetScenarios: [
        { name: 'Heat load 30 kW', icon: '🔥', values: { heatLoadKw: 30, efficiencyPercent: 88, safetyPercent: 15 } },
      ],
      inputs: [
        { name: 'heatLoadKw', label: 'Heating load (kW)', type: 'number', defaultValue: 30, min: 0, step: 0.1 },
        { name: 'efficiencyPercent', label: 'Boiler efficiency (%)', type: 'slider', defaultValue: 88, min: 60, max: 98, step: 1 },
        { name: 'safetyPercent', label: 'Safety factor (%)', type: 'slider', defaultValue: 15, min: 0, max: 30, step: 1 },
      ],
      calculate: (inputs) => {
        const loadKw = Math.max(0, safeFloat(inputs.heatLoadKw));
        const eff = Math.min(99.9, Math.max(1, safeFloat(inputs.efficiencyPercent)));
        const safety = Math.max(0, safeFloat(inputs.safetyPercent));

        const loadAdj = loadKw * (1 + safety / 100);
        const inputKw = loadAdj / (eff / 100);
        const inputBtuHr = inputKw / 0.000293071;

        return {
          result: `${inputKw.toFixed(1)} kW input`,
          explanation: 'Boiler input ≈ (heating load × safety) ÷ efficiency.',
          steps: [
            `Adjusted load = ${loadKw.toFixed(1)} × (1+${safety.toFixed(0)}%) = ${loadAdj.toFixed(1)} kW`,
            `Input = ${loadAdj.toFixed(1)} ÷ ${(eff / 100).toFixed(2)} = ${inputKw.toFixed(1)} kW`,
            `≈ ${Math.round(inputBtuHr).toLocaleString()} BTU/hr`,
          ],
          visualData: [
            { label: 'Load (kW)', value: loadAdj },
            { label: 'Input (kW)', value: inputKw },
          ],
          tips: ['📌 Account for distribution losses and domestic hot water if applicable.'],
        };
      },
    };
  }

  if (id === 'insulation-calculator') {
    return {
      title: 'Insulation R-Value Calculator',
      description: 'Compute R-value and U-value from insulation thickness and thermal conductivity',
      presetScenarios: [
        { name: 'EPS 50mm (k=0.035)', icon: '🧊', values: { thicknessMm: 50, conductivity: 0.035 } },
        { name: 'Rockwool 75mm (k=0.040)', icon: '🧱', values: { thicknessMm: 75, conductivity: 0.04 } },
      ],
      inputs: [
        { name: 'thicknessMm', label: 'Thickness (mm)', type: 'number', defaultValue: 50, min: 0, step: 1 },
        { name: 'conductivity', label: 'Thermal conductivity k (W/m·K)', type: 'number', defaultValue: 0.035, min: 0.01, step: 0.001 },
      ],
      calculate: (inputs) => {
        const tMm = Math.max(0, safeFloat(inputs.thicknessMm));
        const k = Math.max(0.000001, safeFloat(inputs.conductivity));
        const tM = tMm / 1000;

        const rSI = tM / k; // m²K/W
        const uSI = rSI > 0 ? 1 / rSI : 0;
        const rUS = rSI * 5.678263;

        return {
          result: `R = ${rSI.toFixed(2)} (m²·K/W)`,
          explanation: 'For a single uniform layer: R = thickness / k. U = 1/R.',
          steps: [
            `Thickness = ${tMm.toFixed(0)} mm = ${tM.toFixed(3)} m`,
            `R(SI) = ${tM.toFixed(3)} / ${k.toFixed(3)} = ${rSI.toFixed(2)} m²·K/W`,
            `U(SI) = 1/R = ${uSI.toFixed(2)} W/m²·K`,
            `R(US) ≈ ${rUS.toFixed(1)} (ft²·°F·h/BTU)`,
          ],
          visualData: [
            { label: 'R (SI)', value: rSI },
            { label: 'U (SI)', value: uSI },
          ],
          tips: ['✅ Total wall/roof R-value includes other layers and air films.'],
        };
      },
    };
  }

  // DEFAULT (for remaining tools)
  return {
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `This construction calculator is not configured yet for id: ${id}`,
    inputs: [
      { name: 'dimension1', label: 'Length/Dimension 1', type: 'number', defaultValue: 10, min: 0.1, max: 1000, step: 0.1 },
      { name: 'dimension2', label: 'Width/Dimension 2', type: 'number', defaultValue: 5, min: 0.1, max: 1000, step: 0.1 },
      { name: 'quantity', label: 'Quantity/Units', type: 'slider', defaultValue: 1, min: 1, max: 100, step: 1 },
    ],
    calculate: (inputs) => {
      return {
        result: 'Not Configured',
        explanation: `No formula has been added for this construction tool yet (id: ${id}).`,
        steps: [
          `Tool id: ${id}`,
          'Status: Not configured',
          'Next: add a proper input set + calculation formula in getToolConfig(id).'
        ],
        tips: [
          '✅ This is not a runtime error — it needs implementation',
          '📌 If you tell me the exact tool you want next, I can implement it first',
          '📏 Use accurate on-site measurements before ordering materials'
        ]
      };
    }
  };
};

const getCategoryTheme = () => ({
  gradient: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10',
  icon: HardHat,
  emoji: '🏗️',
  accentColor: 'text-orange-600 dark:text-orange-400'
});

export function GenericConstructionTool({ id }: { id: string }) {
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
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputs, autoCalculate]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const calculationResult = config.calculate(inputs);
      setResult(calculationResult);
      setIsCalculating(false);
    }, 100);
  };

  const handlePresetClick = (preset: any) => {
    setInputs(preset.values);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `${config.title}\nResult: ${result.result}\n${result.explanation || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${theme.gradient} border border-border/50 rounded-2xl p-8 mb-8`}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-background rounded-xl">
            <theme.icon className={`w-8 h-8 ${theme.accentColor}`} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
            <p className="text-muted-foreground text-lg">{config.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Preset Scenarios */}
          {config.presetScenarios && config.presetScenarios.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Quick Scenarios</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {config.presetScenarios.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetClick(preset)}
                    className="p-4 bg-muted/50 hover:bg-muted border border-border rounded-xl transition-all hover:scale-105 text-center"
                  >
                    <div className="text-2xl mb-1">{preset.icon || theme.emoji}</div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Fields */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Input Parameters</h3>
            </div>
            <div className="space-y-5">
              {config.inputs.map((input) => (
                <div key={input.name}>
                  <label className="block text-sm font-medium mb-2">
                    {input.label}
                    {input.helpText && (
                      <span className="text-xs text-muted-foreground ml-2">({input.helpText})</span>
                    )}
                  </label>
                  {input.type === 'slider' ? (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min={input.min}
                        max={input.max}
                        step={input.step}
                        value={inputs[input.name] ?? input.defaultValue}
                        onChange={(e) => setInputs({ ...inputs, [input.name]: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{input.min}</span>
                        <span className="font-semibold text-foreground">{inputs[input.name] ?? input.defaultValue}</span>
                        <span>{input.max}</span>
                      </div>
                    </div>
                  ) : input.type === 'select' ? (
                    <select
                      value={inputs[input.name] ?? input.defaultValue}
                      onChange={(e) => setInputs({ ...inputs, [input.name]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50"
                    >
                      {input.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={input.type}
                      value={inputs[input.name] ?? input.defaultValue}
                      onChange={(e) => setInputs({ ...inputs, [input.name]: e.target.value })}
                      placeholder={input.placeholder}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      className="w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auto Calculate Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
            <span className="text-sm font-medium">Auto Calculate</span>
            <button
              onClick={() => setAutoCalculate(!autoCalculate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoCalculate ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoCalculate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {!autoCalculate && (
            <button
              onClick={handleCalculate}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-colors"
            >
              Calculate
            </button>
          )}
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Main Result */}
              <div className={`bg-gradient-to-br ${theme.gradient} border-2 border-primary/20 rounded-2xl p-8`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Result</span>
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-background/50 rounded-lg transition-colors"
                    title="Copy result"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-4xl font-bold mb-2 text-foreground">{result.result}</div>
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>

              {/* Calculation Steps */}
              {result.steps && result.steps.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Calculation Breakdown</h3>
                  </div>
                  <div className="space-y-2">
                    {result.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        {step && <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${theme.accentColor} bg-primary/10 flex-shrink-0`}>
                          {idx + 1}
                        </div>}
                        <p className={`${step ? 'text-foreground' : 'font-semibold text-lg mt-2'}`}>{step || <br />}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Data */}
              {result.visualData && result.visualData.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Quick Overview</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {result.visualData.map((data, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold mb-1">{data.value.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">{data.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold">Pro Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-lg mt-0.5">{tip.split(' ')[0]}</span>
                        <span>{tip.substring(tip.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
        <SeoContentGenerator 
          title={config.title} 
          description={config.description} 
          categoryName="Construction" 
        />
      </div>
    </div>
  );
}
