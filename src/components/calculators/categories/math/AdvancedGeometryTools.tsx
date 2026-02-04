'use client';
import React, { useState } from 'react';

// ============================================================================
// ADVANCED AREA CALCULATOR
// ============================================================================
export function AdvancedAreaCalculator() {
  const [shape, setShape] = useState('rectangle');
  const [dimensions, setDimensions] = useState<any>({ length: '', width: '' });
  const [results, setResults] = useState<any>(null);

  const calculateArea = () => {
    let area = 0, perimeter = 0, diagonal = 0, details: any = {};

    switch (shape) {
      case 'rectangle':
        const l = parseFloat(dimensions.length) || 0;
        const w = parseFloat(dimensions.width) || 0;
        area = l * w;
        perimeter = 2 * (l + w);
        diagonal = Math.sqrt(l * l + w * w);
        details = { length: l, width: w, diagonal: diagonal.toFixed(4) };
        break;
      case 'circle':
        const r = parseFloat(dimensions.radius) || 0;
        area = Math.PI * r * r;
        perimeter = 2 * Math.PI * r; // circumference
        details = { radius: r, diameter: (2 * r).toFixed(4), circumference: perimeter.toFixed(4) };
        break;
      case 'triangle':
        const base = parseFloat(dimensions.base) || 0;
        const height = parseFloat(dimensions.height) || 0;
        area = 0.5 * base * height;
        // For equilateral approximation
        perimeter = base * 3; // simplified
        details = { base, height };
        break;
      case 'trapezoid':
        const a = parseFloat(dimensions.base1) || 0;
        const b = parseFloat(dimensions.base2) || 0;
        const h = parseFloat(dimensions.height) || 0;
        area = 0.5 * (a + b) * h;
        details = { base1: a, base2: b, height: h };
        break;
      case 'ellipse':
        const a_axis = parseFloat(dimensions.majorAxis) || 0;
        const b_axis = parseFloat(dimensions.minorAxis) || 0;
        area = Math.PI * a_axis * b_axis;
        perimeter = Math.PI * (3 * (a_axis + b_axis) - Math.sqrt((3 * a_axis + b_axis) * (a_axis + 3 * b_axis)));
        details = { majorAxis: a_axis, minorAxis: b_axis };
        break;
    }

    setResults({
      shape,
      area: area.toFixed(6),
      perimeter: perimeter.toFixed(6),
      areaInUnits: {
        squareMeters: area.toFixed(6),
        squareFeet: (area * 10.764).toFixed(4),
        squareInches: (area * 1550.003).toFixed(2),
        acres: (area * 0.000247105).toFixed(8),
      },
      ...details,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Area Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Shape</label>
        <select
          value={shape}
          onChange={(e) => { setShape(e.target.value); setResults(null); }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
          <option value="triangle">Triangle</option>
          <option value="trapezoid">Trapezoid</option>
          <option value="ellipse">Ellipse</option>
        </select>
      </div>

      <div className="space-y-3 mb-4">
        {shape === 'rectangle' && (
          <>
            <input
              type="number"
              placeholder="Length"
              value={dimensions.length}
              onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
        {shape === 'circle' && (
          <input
            type="number"
            placeholder="Radius"
            value={dimensions.radius}
            onChange={(e) => setDimensions({ ...dimensions, radius: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        )}
        {shape === 'triangle' && (
          <>
            <input
              type="number"
              placeholder="Base"
              value={dimensions.base}
              onChange={(e) => setDimensions({ ...dimensions, base: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
        {shape === 'trapezoid' && (
          <>
            <input
              type="number"
              placeholder="Base 1 (parallel side)"
              value={dimensions.base1}
              onChange={(e) => setDimensions({ ...dimensions, base1: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Base 2 (parallel side)"
              value={dimensions.base2}
              onChange={(e) => setDimensions({ ...dimensions, base2: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
        {shape === 'ellipse' && (
          <>
            <input
              type="number"
              placeholder="Major Axis (a)"
              value={dimensions.majorAxis}
              onChange={(e) => setDimensions({ ...dimensions, majorAxis: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Minor Axis (b)"
              value={dimensions.minorAxis}
              onChange={(e) => setDimensions({ ...dimensions, minorAxis: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
      </div>

      <button
        onClick={calculateArea}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
      >
        Calculate Area
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Main Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="text-3xl font-bold text-blue-600">{results.area} units²</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Perimeter</p>
                <p className="text-3xl font-bold text-indigo-600">{results.perimeter} units</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Area in Different Units</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Square Meters</p>
                <p className="font-bold text-green-700">{results.areaInUnits.squareMeters} m²</p>
              </div>
              <div>
                <p className="text-gray-600">Square Feet</p>
                <p className="font-bold text-green-700">{results.areaInUnits.squareFeet} ft²</p>
              </div>
              <div>
                <p className="text-gray-600">Square Inches</p>
                <p className="font-bold text-green-700">{results.areaInUnits.squareInches} in²</p>
              </div>
              <div>
                <p className="text-gray-600">Acres</p>
                <p className="font-bold text-green-700">{results.areaInUnits.acres} ac</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED VOLUME CALCULATOR
// ============================================================================
export function AdvancedVolumeCalculator() {
  const [shape, setShape] = useState('cube');
  const [dimensions, setDimensions] = useState<any>({ side: '' });
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let volume = 0, surfaceArea = 0, details: any = {};

    switch (shape) {
      case 'cube':
        const side = parseFloat(dimensions.side) || 0;
        volume = Math.pow(side, 3);
        surfaceArea = 6 * side * side;
        details = { side, diagonalFace: (side * Math.sqrt(2)).toFixed(4), diagonalSpace: (side * Math.sqrt(3)).toFixed(4) };
        break;
      case 'sphere':
        const r = parseFloat(dimensions.radius) || 0;
        volume = (4 / 3) * Math.PI * Math.pow(r, 3);
        surfaceArea = 4 * Math.PI * r * r;
        details = { radius: r, diameter: (2 * r).toFixed(4) };
        break;
      case 'cylinder':
        const rad = parseFloat(dimensions.radius) || 0;
        const h = parseFloat(dimensions.height) || 0;
        volume = Math.PI * rad * rad * h;
        surfaceArea = 2 * Math.PI * rad * (rad + h);
        details = { radius: rad, height: h, lateralArea: (2 * Math.PI * rad * h).toFixed(4) };
        break;
      case 'cone':
        const r_cone = parseFloat(dimensions.radius) || 0;
        const h_cone = parseFloat(dimensions.height) || 0;
        volume = (1 / 3) * Math.PI * r_cone * r_cone * h_cone;
        const slant = Math.sqrt(r_cone * r_cone + h_cone * h_cone);
        surfaceArea = Math.PI * r_cone * (r_cone + slant);
        details = { radius: r_cone, height: h_cone, slantHeight: slant.toFixed(4) };
        break;
      case 'rectangular-prism':
        const l = parseFloat(dimensions.length) || 0;
        const w = parseFloat(dimensions.width) || 0;
        const ht = parseFloat(dimensions.height) || 0;
        volume = l * w * ht;
        surfaceArea = 2 * (l * w + l * ht + w * ht);
        details = { length: l, width: w, height: ht, diagonal: Math.sqrt(l * l + w * w + ht * ht).toFixed(4) };
        break;
    }

    setResults({
      shape,
      volume: volume.toFixed(6),
      surfaceArea: surfaceArea.toFixed(6),
      volumeInUnits: {
        cubicMeters: volume.toFixed(6),
        cubicFeet: (volume * 35.315).toFixed(4),
        liters: (volume * 1000).toFixed(4),
        gallons: (volume * 264.172).toFixed(4),
      },
      ...details,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Volume Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select 3D Shape</label>
        <select
          value={shape}
          onChange={(e) => { setShape(e.target.value); setResults(null); }}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="cube">Cube</option>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Cylinder</option>
          <option value="cone">Cone</option>
          <option value="rectangular-prism">Rectangular Prism</option>
        </select>
      </div>

      <div className="space-y-3 mb-4">
        {shape === 'cube' && (
          <input
            type="number"
            placeholder="Side length"
            value={dimensions.side}
            onChange={(e) => setDimensions({ side: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        )}
        {shape === 'sphere' && (
          <input
            type="number"
            placeholder="Radius"
            value={dimensions.radius}
            onChange={(e) => setDimensions({ radius: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        )}
        {(shape === 'cylinder' || shape === 'cone') && (
          <>
            <input
              type="number"
              placeholder="Radius"
              value={dimensions.radius}
              onChange={(e) => setDimensions({ ...dimensions, radius: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
        {shape === 'rectangular-prism' && (
          <>
            <input
              type="number"
              placeholder="Length"
              value={dimensions.length}
              onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        )}
      </div>

      <button
        onClick={calculate}
        className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
      >
        Calculate Volume & Surface Area
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Main Results</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Volume</p>
                <p className="text-3xl font-bold text-purple-600">{results.volume} units³</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Surface Area</p>
                <p className="text-3xl font-bold text-pink-600">{results.surfaceArea} units²</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Volume in Different Units</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Cubic Meters</p>
                <p className="font-bold text-blue-700">{results.volumeInUnits.cubicMeters} m³</p>
              </div>
              <div>
                <p className="text-gray-600">Cubic Feet</p>
                <p className="font-bold text-blue-700">{results.volumeInUnits.cubicFeet} ft³</p>
              </div>
              <div>
                <p className="text-gray-600">Liters</p>
                <p className="font-bold text-blue-700">{results.volumeInUnits.liters} L</p>
              </div>
              <div>
                <p className="text-gray-600">Gallons (US)</p>
                <p className="font-bold text-blue-700">{results.volumeInUnits.gallons} gal</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED TRIANGLE CALCULATOR
// ============================================================================
export function AdvancedTriangleCalculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [angleA, setAngleA] = useState('');
  const [angleB, setAngleB] = useState('');
  const [angleC, setAngleC] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const sideA = parseFloat(a) || 0;
    const sideB = parseFloat(b) || 0;
    const sideC = parseFloat(c) || 0;

    if (sideA <= 0 || sideB <= 0 || sideC <= 0) {
      alert('All sides must be positive numbers');
      return;
    }

    // Check triangle inequality
    if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
      alert('These sides cannot form a valid triangle');
      return;
    }

    // Calculate angles using law of cosines
    const angleArad = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC));
    const angleBrad = Math.acos((sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC));
    const angleCrad = Math.PI - angleArad - angleBrad;

    const angleADeg = (angleArad * 180 / Math.PI).toFixed(4);
    const angleBDeg = (angleBrad * 180 / Math.PI).toFixed(4);
    const angleCDeg = (angleCrad * 180 / Math.PI).toFixed(4);

    // Calculate area using Heron's formula
    const s = (sideA + sideB + sideC) / 2;
    const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));

    // Perimeter
    const perimeter = sideA + sideB + sideC;

    // Heights
    const heightA = (2 * area) / sideA;
    const heightB = (2 * area) / sideB;
    const heightC = (2 * area) / sideC;

    // Circumradius and inradius
    const circumradius = (sideA * sideB * sideC) / (4 * area);
    const inradius = area / s;

    // Triangle type
    let triangleType = 'Scalene';
    if (sideA === sideB && sideB === sideC) triangleType = 'Equilateral';
    else if (sideA === sideB || sideB === sideC || sideA === sideC) triangleType = 'Isosceles';

    let angleType = 'Acute';
    const maxAngle = Math.max(angleArad, angleBrad, angleCrad);
    if (maxAngle === Math.PI / 2) angleType = 'Right';
    else if (maxAngle > Math.PI / 2) angleType = 'Obtuse';

    setResults({
      sideA, sideB, sideC,
      angleA: angleADeg,
      angleB: angleBDeg,
      angleC: angleCDeg,
      area: area.toFixed(6),
      perimeter: perimeter.toFixed(6),
      semiperimeter: s.toFixed(6),
      heightA: heightA.toFixed(6),
      heightB: heightB.toFixed(6),
      heightC: heightC.toFixed(6),
      circumradius: circumradius.toFixed(6),
      inradius: inradius.toFixed(6),
      triangleType,
      angleType,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Triangle Calculator</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Three Sides</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Side a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Side b"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Side c"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
      >
        Calculate Triangle Properties
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Triangle Classification</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type by Sides</p>
                <p className="text-2xl font-bold text-green-600">{results.triangleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type by Angles</p>
                <p className="text-2xl font-bold text-teal-600">{results.angleType}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-gray-600">Angle A</p>
              <p className="text-xl font-bold text-blue-600">{results.angleA}°</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-gray-600">Angle B</p>
              <p className="text-xl font-bold text-purple-600">{results.angleB}°</p>
            </div>
            <div className="bg-pink-50 p-3 rounded">
              <p className="text-sm text-gray-600">Angle C</p>
              <p className="text-xl font-bold text-pink-600">{results.angleC}°</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Area & Perimeter</h4>
              <p className="text-sm mb-1">Area: <strong>{results.area} units²</strong></p>
              <p className="text-sm mb-1">Perimeter: <strong>{results.perimeter} units</strong></p>
              <p className="text-sm">Semiperimeter: <strong>{results.semiperimeter} units</strong></p>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Radii</h4>
              <p className="text-sm mb-1">Circumradius (R): <strong>{results.circumradius}</strong></p>
              <p className="text-sm">Inradius (r): <strong>{results.inradius}</strong></p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Heights (Altitudes)</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <p>h<sub>a</sub>: <strong>{results.heightA}</strong></p>
              <p>h<sub>b</sub>: <strong>{results.heightB}</strong></p>
              <p>h<sub>c</sub>: <strong>{results.heightC}</strong></p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Formulas Used</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Area (Heron's): √[s(s-a)(s-b)(s-c)] where s = (a+b+c)/2</li>
              <li>• Angles: cos(A) = (b²+c²-a²)/(2bc)</li>
              <li>• Circumradius: R = abc/(4×Area)</li>
              <li>• Inradius: r = Area/s</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ADVANCED CIRCLE CALCULATOR
// ============================================================================
export function AdvancedCircleCalculator() {
  const [radius, setRadius] = useState('');
  const [diameter, setDiameter] = useState('');
  const [circumference, setCircumference] = useState('');
  const [area, setArea] = useState('');
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    let r = parseFloat(radius);
    
    if (!r || r <= 0) {
      if (diameter) r = parseFloat(diameter) / 2;
      else if (circumference) r = parseFloat(circumference) / (2 * Math.PI);
      else if (area) r = Math.sqrt(parseFloat(area) / Math.PI);
    }

    if (!r || r <= 0) {
      alert('Please enter a valid positive value');
      return;
    }

    const d = 2 * r;
    const c = 2 * Math.PI * r;
    const a = Math.PI * r * r;
    const sectorArea90 = (Math.PI * r * r) / 4;
    const arcLength90 = (Math.PI * r) / 2;

    setResults({
      radius: r.toFixed(6),
      diameter: d.toFixed(6),
      circumference: c.toFixed(6),
      area: a.toFixed(6),
      sectorArea90: sectorArea90.toFixed(6),
      arcLength90: arcLength90.toFixed(6),
      areaInUnits: {
        squareMeters: a.toFixed(6),
        squareFeet: (a * 10.764).toFixed(4),
        squareInches: (a * 1550.003).toFixed(2),
      },
      circumferenceInUnits: {
        meters: c.toFixed(6),
        feet: (c * 3.281).toFixed(4),
        inches: (c * 39.370).toFixed(2),
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Advanced Circle Calculator</h2>
      <p className="text-gray-600 mb-4">Enter any one value to calculate all properties</p>
      
      <div className="space-y-3 mb-4">
        <input
          type="number"
          placeholder="Radius (r)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Diameter (d)"
          value={diameter}
          onChange={(e) => setDiameter(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Circumference (C)"
          value={circumference}
          onChange={(e) => setCircumference(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Area (A)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
      >
        Calculate Circle Properties
      </button>

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Basic Properties</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Radius (r)</p>
                <p className="text-2xl font-bold text-blue-600">{results.radius}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Diameter (d)</p>
                <p className="text-2xl font-bold text-cyan-600">{results.diameter}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Circumference (C)</p>
                <p className="text-2xl font-bold text-blue-600">{results.circumference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Area (A)</p>
                <p className="text-2xl font-bold text-cyan-600">{results.area}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">90° Sector Properties</h4>
              <p className="text-sm mb-1">Sector Area: <strong>{results.sectorArea90}</strong></p>
              <p className="text-sm">Arc Length: <strong>{results.arcLength90}</strong></p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Area Conversions</h4>
              <p className="text-sm mb-1">{results.areaInUnits.squareMeters} m²</p>
              <p className="text-sm mb-1">{results.areaInUnits.squareFeet} ft²</p>
              <p className="text-sm">{results.areaInUnits.squareInches} in²</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Formulas</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Area = πr²</li>
              <li>• Circumference = 2πr</li>
              <li>• Diameter = 2r</li>
              <li>• Sector Area = (θ/360°) × πr²</li>
              <li>• Arc Length = (θ/360°) × 2πr</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
