import React from 'react';
import { FormData } from '../types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface FormSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (results: any) => void;
  disableSubmitButton: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({ formData, handleInputChange, handleSliderChange, handleSubmit, disableSubmitButton }) => {

  return (
    <form action={handleSubmit} className="mb-8 mt-4">
      <h2 className="text-xl font-semibold mb-2">Enter farm information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block">Zip Code</label>
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
              Rate Multiplier: {formData.dilutionRate}
              <TooltipProvider>
                <Tooltip delayDuration={60}>
                  <TooltipTrigger>
                    <InfoIcon className="ml-2 h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The rate multiplier is a factor that increases or decreases the rate of new farms joining the Glow protocol.
                      The rate at which new farms join the protocol affects the rewards received.
                      A multiplier of 1 means the rate of new farms joining over time is the same as the current (historic) rate.
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
      <button 
        type="submit" 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        disabled={disableSubmitButton}
      >
        Estimate Rewards
      </button>
    </form>
  );
};