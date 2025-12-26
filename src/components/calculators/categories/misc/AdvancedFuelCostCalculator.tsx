"use client"

import { useState, useEffect } from "react"
import { Fuel, MapPin, Users, Car } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"
import { FuelCostSeoContent } from "@/components/calculators/seo/MiscSeo"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AdvancedFuelCostCalculator() {
  const [distance, setDistance] = useState(100)
  const [mileage, setMileage] = useState(15)
  const [fuelPrice, setFuelPrice] = useState(100)
  const [isRoundTrip, setIsRoundTrip] = useState(false)
  const [passengers, setPassengers] = useState(1)
  const [otherCosts, setOtherCosts] = useState(0) // Tolls, Parking
  
  const [result, setResult] = useState<any>(null)

  const calculateCost = () => {
    const totalDistance = isRoundTrip ? distance * 2 : distance
    const fuelNeeded = totalDistance / mileage
    const fuelCost = fuelNeeded * fuelPrice
    const totalTripCost = fuelCost + otherCosts
    const costPerPerson = totalTripCost / passengers
    const costPerKm = totalTripCost / totalDistance

    setResult({
      totalDistance,
      fuelNeeded: fuelNeeded.toFixed(2),
      fuelCost: Math.round(fuelCost),
      totalTripCost: Math.round(totalTripCost),
      costPerPerson: Math.round(costPerPerson),
      costPerKm: costPerKm.toFixed(2)
    })
  }

  useEffect(() => {
    calculateCost()
  }, [distance, mileage, fuelPrice, isRoundTrip, passengers, otherCosts])

  return (
    <FinancialCalculatorTemplate
      title="Trip Cost Calculator"
      description="Calculate total trip cost including fuel, tolls, and split per person."
      icon={Car}
      calculate={calculateCost}
      onClear={() => {
        setDistance(100)
        setMileage(15)
        setFuelPrice(100)
        setPassengers(1)
        setOtherCosts(0)
        setIsRoundTrip(false)
      }}
      seoContent={<FuelCostSeoContent />}
      inputs={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="One-Way Distance" 
              value={distance} 
              onChange={setDistance} 
              suffix="km" 
              min={1} 
              max={10000} 
            />
            <InputGroup 
              label="Vehicle Mileage" 
              value={mileage} 
              onChange={setMileage} 
              suffix="km/L" 
              min={1} 
              max={100} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup 
              label="Fuel Price" 
              value={fuelPrice} 
              onChange={setFuelPrice} 
              prefix="₹" 
              suffix="/L" 
              min={1} 
              max={200} 
            />
            <InputGroup 
              label="Tolls & Parking" 
              value={otherCosts} 
              onChange={setOtherCosts} 
              prefix="₹" 
              min={0} 
              max={10000} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-base">Round Trip</Label>
                <p className="text-xs text-muted-foreground">Calculate for return journey too</p>
              </div>
              <Switch checked={isRoundTrip} onCheckedChange={setIsRoundTrip} />
            </div>

            <InputGroup 
              label="Number of Travelers" 
              value={passengers} 
              onChange={setPassengers} 
              min={1} 
              max={50} 
            />
          </div>
        </div>
      }
      result={result && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard 
              label="Total Trip Cost" 
              value={`₹${result.totalTripCost.toLocaleString()}`} 
              type="highlight" 
            />
            <ResultCard 
              label="Cost Per Person" 
              value={`₹${result.costPerPerson.toLocaleString()}`} 
              type="success" 
            />
            <ResultCard 
              label="Fuel Needed" 
              value={`${result.fuelNeeded} Liters`} 
              type="default" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultCard 
              label="Total Distance" 
              value={`${result.totalDistance} km`} 
              type="default" 
            />
            <ResultCard 
              label="Cost per km" 
              value={`₹${result.costPerKm}`} 
              type="default" 
            />
          </div>
        </div>
      )}
    />
  )
}
