'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

interface CalculatorConfig {
  id: string;
  title: string;
  description: string;
  inputs: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    unit?: string;
    options?: { value: string; label: string }[];
  }[];
  calculate: (inputs: { [key: string]: number | string }) => {
    results: { label: string; value: string | number; unit?: string }[];
    breakdown?: { label: string; value: string | number; unit?: string }[];
  };
}

interface GenericTechnologyToolProps {
  id: string;
  title: string;
  description: string;
}

export default function GenericTechnologyTool({ id, title, description }: GenericTechnologyToolProps) {
  const [inputs, setInputs] = useState<{ [key: string]: string | number }>({});
  const [results, setResults] = useState<any>(null);

  const getCalculatorConfig = (calculatorId: string): CalculatorConfig => {
    switch (calculatorId) {
      case 'bandwidth-calculator':
        return {
          id: 'bandwidth-calculator',
          title: 'Bandwidth Calculator',
          description: 'Calculate network bandwidth and data transfer requirements',
          inputs: [
            { name: 'dataSize', label: 'Data Size', type: 'number', placeholder: '100', unit: 'MB' },
            { name: 'time', label: 'Time Duration', type: 'number', placeholder: '10', unit: 'seconds' },
            { name: 'unit', label: 'Output Unit', type: 'select', options: [
              { value: 'mbps', label: 'Mbps (Megabits per second)' },
              { value: 'kbps', label: 'Kbps (Kilobits per second)' },
              { value: 'gbps', label: 'Gbps (Gigabits per second)' },
            ]},
          ],
          calculate: (inputs) => {
            const dataSize = Number(inputs.dataSize) || 0;
            const time = Number(inputs.time) || 1;
            const unit = inputs.unit || 'mbps';
            
            const dataBits = dataSize * 8; // Convert MB to Megabits
            const mbps = dataBits / time;
            const kbps = mbps * 1024;
            const gbps = mbps / 1024;
            const MBps = dataSize / time; // Megabytes per second
            
            let bandwidth = mbps;
            let displayUnit = 'Mbps';
            
            if (unit === 'kbps') {
              bandwidth = kbps;
              displayUnit = 'Kbps';
            } else if (unit === 'gbps') {
              bandwidth = gbps;
              displayUnit = 'Gbps';
            }
            
            return {
              results: [
                { label: 'Required Bandwidth', value: bandwidth.toFixed(2), unit: displayUnit },
                { label: 'In Mbps', value: mbps.toFixed(2), unit: 'Mbps' },
                { label: 'In MBps', value: MBps.toFixed(2), unit: 'MB/s' },
              ],
              breakdown: [
                { label: 'Data Size', value: dataSize, unit: 'MB' },
                { label: 'Transfer Time', value: time, unit: 'seconds' },
                { label: 'In Kbps', value: kbps.toFixed(2), unit: 'Kbps' },
                { label: 'In Gbps', value: gbps.toFixed(4), unit: 'Gbps' },
              ]
            };
          }
        };

      case 'password-strength':
        return {
          id: 'password-strength',
          title: 'Password Strength Checker',
          description: 'Analyze password security and estimate crack time',
          inputs: [
            { name: 'password', label: 'Password', type: 'text', placeholder: 'Enter password to check' },
          ],
          calculate: (inputs) => {
            const password = String(inputs.password || '');
            const length = password.length;
            
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
            
            let charSetSize = 0;
            if (hasLower) charSetSize += 26;
            if (hasUpper) charSetSize += 26;
            if (hasNumber) charSetSize += 10;
            if (hasSpecial) charSetSize += 32;
            
            const entropy = length * Math.log2(charSetSize);
            const combinations = Math.pow(charSetSize, length);
            
            // Assume 10 billion guesses per second
            const guessesPerSecond = 10_000_000_000;
            const secondsToCrack = combinations / guessesPerSecond;
            
            let crackTime = '';
            if (secondsToCrack < 1) crackTime = 'Instant';
            else if (secondsToCrack < 60) crackTime = `${secondsToCrack.toFixed(0)} seconds`;
            else if (secondsToCrack < 3600) crackTime = `${(secondsToCrack / 60).toFixed(0)} minutes`;
            else if (secondsToCrack < 86400) crackTime = `${(secondsToCrack / 3600).toFixed(0)} hours`;
            else if (secondsToCrack < 31536000) crackTime = `${(secondsToCrack / 86400).toFixed(0)} days`;
            else if (secondsToCrack < 31536000 * 100) crackTime = `${(secondsToCrack / 31536000).toFixed(0)} years`;
            else crackTime = `${(secondsToCrack / 31536000).toExponential(2)} years`;
            
            let strength = 'Very Weak';
            let score = 0;
            if (entropy > 80) { strength = 'Very Strong'; score = 5; }
            else if (entropy > 60) { strength = 'Strong'; score = 4; }
            else if (entropy > 40) { strength = 'Medium'; score = 3; }
            else if (entropy > 25) { strength = 'Weak'; score = 2; }
            else { strength = 'Very Weak'; score = 1; }
            
            return {
              results: [
                { label: 'Password Strength', value: strength },
                { label: 'Strength Score', value: `${score}/5` },
                { label: 'Time to Crack', value: crackTime },
                { label: 'Entropy', value: entropy.toFixed(1), unit: 'bits' },
              ],
              breakdown: [
                { label: 'Length', value: length, unit: 'characters' },
                { label: 'Lowercase Letters', value: hasLower ? 'Yes' : 'No' },
                { label: 'Uppercase Letters', value: hasUpper ? 'Yes' : 'No' },
                { label: 'Numbers', value: hasNumber ? 'Yes' : 'No' },
                { label: 'Special Characters', value: hasSpecial ? 'Yes' : 'No' },
                { label: 'Character Set Size', value: charSetSize },
                { label: 'Possible Combinations', value: combinations.toExponential(2) },
              ]
            };
          }
        };

      case 'file-size-converter':
        return {
          id: 'file-size-converter',
          title: 'File Size Converter',
          description: 'Convert between bytes, KB, MB, GB, TB, PB',
          inputs: [
            { name: 'size', label: 'File Size', type: 'number', placeholder: '1024' },
            { name: 'fromUnit', label: 'From Unit', type: 'select', options: [
              { value: 'bytes', label: 'Bytes' },
              { value: 'kb', label: 'KB (Kilobytes)' },
              { value: 'mb', label: 'MB (Megabytes)' },
              { value: 'gb', label: 'GB (Gigabytes)' },
              { value: 'tb', label: 'TB (Terabytes)' },
              { value: 'pb', label: 'PB (Petabytes)' },
            ]},
          ],
          calculate: (inputs) => {
            const size = Number(inputs.size) || 0;
            const fromUnit = inputs.fromUnit || 'bytes';
            const fromUnitStr = String(fromUnit);
            
            const bytesMap: { [key: string]: number } = {
              bytes: 1,
              kb: 1024,
              mb: 1024 * 1024,
              gb: 1024 * 1024 * 1024,
              tb: 1024 * 1024 * 1024 * 1024,
              pb: 1024 * 1024 * 1024 * 1024 * 1024,
            };
            
            const bytes = size * bytesMap[fromUnitStr];
            
            return {
              results: [
                { label: 'Bytes', value: bytes.toLocaleString(), unit: 'B' },
                { label: 'Kilobytes', value: (bytes / bytesMap.kb).toFixed(2), unit: 'KB' },
                { label: 'Megabytes', value: (bytes / bytesMap.mb).toFixed(2), unit: 'MB' },
                { label: 'Gigabytes', value: (bytes / bytesMap.gb).toFixed(4), unit: 'GB' },
                { label: 'Terabytes', value: (bytes / bytesMap.tb).toFixed(6), unit: 'TB' },
              ],
              breakdown: [
                { label: 'Input Size', value: size, unit: fromUnitStr.toUpperCase() },
                { label: 'In Bits', value: (bytes * 8).toLocaleString(), unit: 'bits' },
              ]
            };
          }
        };

      case 'download-time-calculator':
        return {
          id: 'download-time-calculator',
          title: 'Download Time Calculator',
          description: 'Estimate file download time based on internet speed',
          inputs: [
            { name: 'fileSize', label: 'File Size', type: 'number', placeholder: '1000' },
            { name: 'fileSizeUnit', label: 'File Size Unit', type: 'select', options: [
              { value: 'mb', label: 'MB (Megabytes)' },
              { value: 'gb', label: 'GB (Gigabytes)' },
              { value: 'kb', label: 'KB (Kilobytes)' },
            ]},
            { name: 'speed', label: 'Internet Speed', type: 'number', placeholder: '100' },
            { name: 'speedUnit', label: 'Speed Unit', type: 'select', options: [
              { value: 'mbps', label: 'Mbps (Megabits/sec)' },
              { value: 'kbps', label: 'Kbps (Kilobits/sec)' },
              { value: 'gbps', label: 'Gbps (Gigabits/sec)' },
            ]},
          ],
          calculate: (inputs) => {
            const fileSize = Number(inputs.fileSize) || 0;
            const fileSizeUnit = inputs.fileSizeUnit || 'mb';
            const speed = Number(inputs.speed) || 1;
            const speedUnit = inputs.speedUnit || 'mbps';
            
            // Convert file size to MB
            let fileSizeMB = fileSize;
            if (fileSizeUnit === 'gb') fileSizeMB = fileSize * 1024;
            else if (fileSizeUnit === 'kb') fileSizeMB = fileSize / 1024;
            
            // Convert speed to Mbps
            let speedMbps = speed;
            if (speedUnit === 'kbps') speedMbps = speed / 1024;
            else if (speedUnit === 'gbps') speedMbps = speed * 1024;
            
            // Calculate time (file size in bits / speed in bits per second)
            const fileSizeBits = fileSizeMB * 8; // MB to Megabits
            const timeSeconds = fileSizeBits / speedMbps;
            
            const hours = Math.floor(timeSeconds / 3600);
            const minutes = Math.floor((timeSeconds % 3600) / 60);
            const seconds = Math.floor(timeSeconds % 60);
            
            let timeDisplay = '';
            if (hours > 0) timeDisplay += `${hours}h `;
            if (minutes > 0) timeDisplay += `${minutes}m `;
            timeDisplay += `${seconds}s`;
            
            return {
              results: [
                { label: 'Download Time', value: timeDisplay },
                { label: 'Total Seconds', value: timeSeconds.toFixed(0), unit: 'sec' },
                { label: 'Total Minutes', value: (timeSeconds / 60).toFixed(1), unit: 'min' },
              ],
              breakdown: [
                { label: 'File Size', value: fileSizeMB.toFixed(2), unit: 'MB' },
                { label: 'Download Speed', value: speedMbps.toFixed(2), unit: 'Mbps' },
                { label: 'Actual Speed (MBps)', value: (speedMbps / 8).toFixed(2), unit: 'MB/s' },
              ]
            };
          }
        };

      case 'ip-subnet-calculator':
        return {
          id: 'ip-subnet-calculator',
          title: 'IP Subnet Calculator',
          description: 'Calculate IPv4 subnet information and IP ranges',
          inputs: [
            { name: 'ip', label: 'IP Address', type: 'text', placeholder: '192.168.1.0' },
            { name: 'cidr', label: 'CIDR / Subnet Bits', type: 'number', placeholder: '24' },
          ],
          calculate: (inputs) => {
            const ip = String(inputs.ip || '192.168.1.0');
            const cidr = Number(inputs.cidr) || 24;
            
            const ipParts = ip.split('.').map(Number);
            
            // Calculate subnet mask
            const mask: number[] = [];
            for (let i = 0; i < 4; i++) {
              const bits = Math.max(0, Math.min(8, cidr - i * 8));
              mask.push(256 - Math.pow(2, 8 - bits));
            }
            
            // Network address
            const network = ipParts.map((part, i) => part & mask[i]);
            
            // Broadcast address
            const broadcast = network.map((part, i) => part | (255 - mask[i]));
            
            // First and last host
            const firstHost = [...network];
            firstHost[3] += 1;
            const lastHost = [...broadcast];
            lastHost[3] -= 1;
            
            const totalHosts = Math.pow(2, 32 - cidr);
            const usableHosts = totalHosts - 2;
            
            return {
              results: [
                { label: 'Network Address', value: network.join('.') },
                { label: 'Broadcast Address', value: broadcast.join('.') },
                { label: 'Subnet Mask', value: mask.join('.') },
                { label: 'First Host', value: firstHost.join('.') },
                { label: 'Last Host', value: lastHost.join('.') },
              ],
              breakdown: [
                { label: 'CIDR Notation', value: `${network.join('.')}/${cidr}` },
                { label: 'Total Hosts', value: totalHosts.toLocaleString() },
                { label: 'Usable Hosts', value: usableHosts.toLocaleString() },
                { label: 'Wildcard Mask', value: mask.map(m => 255 - m).join('.') },
              ]
            };
          }
        };

      case 'hash-calculator':
        return {
          id: 'hash-calculator',
          title: 'Hash Calculator',
          description: 'Calculate hash values for text (demonstration)',
          inputs: [
            { name: 'text', label: 'Text to Hash', type: 'text', placeholder: 'Enter text' },
          ],
          calculate: (inputs) => {
            const text = String(inputs.text || '');
            
            // Simple hash function for demonstration
            const simpleHash = (str: string) => {
              let hash = 0;
              for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
              }
              return Math.abs(hash).toString(16);
            };
            
            const hash = simpleHash(text);
            
            return {
              results: [
                { label: 'Simple Hash', value: hash },
                { label: 'Hash Length', value: hash.length, unit: 'chars' },
                { label: 'Text Length', value: text.length, unit: 'chars' },
              ],
              breakdown: [
                { label: 'Input Text', value: text.substring(0, 50) + (text.length > 50 ? '...' : '') },
                { label: 'Note', value: 'Use proper crypto libraries for production' },
              ]
            };
          }
        };

      case 'aws-cost-calculator':
        return {
          id: 'aws-cost-calculator',
          title: 'AWS EC2 Cost Calculator',
          description: 'Estimate AWS EC2 instance monthly costs',
          inputs: [
            { name: 'instanceType', label: 'Instance Type', type: 'select', options: [
              { value: 't2.micro', label: 't2.micro - $0.0116/hour' },
              { value: 't2.small', label: 't2.small - $0.023/hour' },
              { value: 't2.medium', label: 't2.medium - $0.0464/hour' },
              { value: 't3.small', label: 't3.small - $0.0208/hour' },
              { value: 't3.medium', label: 't3.medium - $0.0416/hour' },
              { value: 'm5.large', label: 'm5.large - $0.096/hour' },
              { value: 'm5.xlarge', label: 'm5.xlarge - $0.192/hour' },
            ]},
            { name: 'hoursPerDay', label: 'Hours Per Day', type: 'number', placeholder: '24' },
            { name: 'daysPerMonth', label: 'Days Per Month', type: 'number', placeholder: '30' },
          ],
          calculate: (inputs) => {
            const instanceType = inputs.instanceType || 't2.micro';
            const hoursPerDay = Number(inputs.hoursPerDay) || 24;
            const daysPerMonth = Number(inputs.daysPerMonth) || 30;
            
            const pricing: { [key: string]: number } = {
              't2.micro': 0.0116,
              't2.small': 0.023,
              't2.medium': 0.0464,
              't3.small': 0.0208,
              't3.medium': 0.0416,
              'm5.large': 0.096,
              'm5.xlarge': 0.192,
            };
            
            const hourlyRate = pricing[instanceType as string] || 0.0116;
            const totalHours = hoursPerDay * daysPerMonth;
            const monthlyCost = hourlyRate * totalHours;
            const yearlyCost = monthlyCost * 12;
            
            return {
              results: [
                { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` },
                { label: 'Yearly Cost', value: `$${yearlyCost.toFixed(2)}` },
                { label: 'Daily Cost', value: `$${(monthlyCost / daysPerMonth).toFixed(2)}` },
              ],
              breakdown: [
                { label: 'Instance Type', value: instanceType },
                { label: 'Hourly Rate', value: `$${hourlyRate.toFixed(4)}` },
                { label: 'Total Hours/Month', value: totalHours, unit: 'hours' },
                { label: 'Cost Per Hour', value: `$${hourlyRate.toFixed(4)}` },
              ]
            };
          }
        };

      case 'json-validator':
        return {
          id: 'json-validator',
          title: 'JSON Validator',
          description: 'Validate and analyze JSON data',
          inputs: [
            { name: 'json', label: 'JSON Data', type: 'text', placeholder: '{"key": "value"}' },
          ],
          calculate: (inputs) => {
            const jsonStr = String(inputs.json || '{}');
            
            let isValid = false;
            let parsed: any = null;
            let error = '';
            let keys = 0;
            
            try {
              parsed = JSON.parse(jsonStr);
              isValid = true;
              if (typeof parsed === 'object' && parsed !== null) {
                keys = Object.keys(parsed).length;
              }
            } catch (e: any) {
              error = e.message;
            }
            
            return {
              results: [
                { label: 'Valid JSON', value: isValid ? 'Yes ✓' : 'No ✗' },
                { label: 'JSON Type', value: isValid ? typeof parsed : 'Invalid' },
                { label: 'Character Count', value: jsonStr.length, unit: 'chars' },
              ],
              breakdown: [
                { label: 'Keys Count', value: isValid ? keys : 0 },
                { label: 'Error Message', value: error || 'No errors' },
              ]
            };
          }
        };

      // Generic fallback calculator
      default:
        return {
          id: 'generic',
          title: title,
          description: description,
          inputs: [
            { name: 'input1', label: 'Input Value 1', type: 'number', placeholder: '0' },
            { name: 'input2', label: 'Input Value 2', type: 'number', placeholder: '0' },
          ],
          calculate: (inputs) => {
            const input1 = Number(inputs.input1) || 0;
            const input2 = Number(inputs.input2) || 0;
            
            return {
              results: [
                { label: 'Sum', value: input1 + input2 },
                { label: 'Product', value: input1 * input2 },
                { label: 'Average', value: ((input1 + input2) / 2).toFixed(2) },
              ],
              breakdown: [
                { label: 'Note', value: 'Advanced calculator coming soon!' },
              ]
            };
          }
        };
    }
  };

  const config = getCalculatorConfig(id);

  useEffect(() => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
  }, [id]);

  const handleInputChange = (name: string, value: string | number) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const result = config.calculate(inputs);
    setResults(result);
  };

  const handleReset = () => {
    const defaultInputs: { [key: string]: string | number } = {};
    config.inputs.forEach(input => {
      if (input.type === 'select' && input.options) {
        defaultInputs[input.name] = input.options[0].value;
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton />
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
            <i className="fas fa-laptop-code text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {config.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="p-6 shadow-xl border-2 border-blue-100 dark:border-blue-900">
          <div className="space-y-6">
            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {config.inputs.map((input) => (
                <div key={input.name} className="space-y-2">
                  <Label htmlFor={input.name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {input.label}
                    {input.unit && <span className="text-blue-600 ml-1">({input.unit})</span>}
                  </Label>
                  {input.type === 'select' ? (
                    <select
                      id={input.name}
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      {input.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={input.name}
                      type={input.type}
                      placeholder={input.placeholder}
                      value={inputs[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, input.type === 'number' ? Number(e.target.value) : e.target.value)}
                      className="border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg shadow-lg transition transform hover:scale-[1.02]"
              >
                <i className="fas fa-calculator mr-2"></i>
                Calculate
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 border-2 border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-4 animate-fadeIn">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
              <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                <i className="fas fa-chart-line mr-3 text-blue-600"></i>
                Results
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-blue-100 dark:border-blue-900">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{result.label}</div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.value} {result.unit && <span className="text-sm text-gray-500">{result.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Breakdown */}
            {results.breakdown && results.breakdown.length > 0 && (
              <Card className="p-6 border-2 border-cyan-100 dark:border-cyan-900 shadow-lg">
                <h3 className="text-xl font-bold text-cyan-900 dark:text-cyan-100 mb-4 flex items-center">
                  <i className="fas fa-info-circle mr-3 text-cyan-600"></i>
                  Details
                </h3>
                <div className="space-y-2">
                  {results.breakdown.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.value} {item.unit && <span className="text-sm text-gray-500">{item.unit}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Info Box */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <i className="fas fa-lightbulb text-2xl text-blue-600 mt-1"></i>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Technology Calculator</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                This tool helps you calculate various technology metrics including network bandwidth, 
                file sizes, download times, security analysis, and cloud computing costs.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <SeoContentGenerator 
            title={title} 
            description={description} 
            categoryName="Technology" 
          />
        </div>
      </div>
    </div>
  );
}
