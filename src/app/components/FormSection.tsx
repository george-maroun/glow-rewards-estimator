import React from 'react';
import { FormData } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface FormSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (results: any) => void;
}

export const FormSection: React.FC<FormSectionProps> = ({ formData, handleInputChange, handleSliderChange, handleSubmit }) => {

  return (
    <form action={handleSubmit} className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Enter farm information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block">Zip code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="electricityPriceKWh" className="block">Electricity Price per kWh</label>
            <input
              type="number"
              id="electricityPriceKWh"
              name="electricityPriceKWh"
              value={formData.electricityPriceKWh}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block">DC Output (kW)</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="joiningDate" className="block">Joining Date</label>
            <input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="dilutionRate" className="block flex items-center">
              Dilution Rate: {formData.dilutionRate}
              <TooltipProvider>
                <Tooltip delayDuration={60}>
                  <TooltipTrigger>
                    <InfoIcon className="ml-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The dilution rate represents the expected frequency of enrollment of new solar farms in the Glow protocol. 
                      As new farms are added, rewards are divided between more farms. A higher rate indicates 
                      more farms are expected to join over time. A value of 1 represents the current frequency of 
                      new solar farm additions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <input
              type="range"
              id="dilutionRate"
              name="dilutionRate"
              min="-1"  // log10(0.1)
              max="1.3"  // log10(20)
              step="0.05"
              value={Math.log10(formData.dilutionRate)}
              onChange={(e) => {
                const logValue = parseFloat(e.target.value);
                const actualValue = Math.pow(10, logValue);
                handleSliderChange({
                  target: {
                    ...e.target,
                    value: actualValue.toFixed(2)
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Estimate Rewards
      </button>
    </form>
  );
};