import React from 'react';
import { FormData } from '../types';

interface FormSectionProps {
  formData: FormData;
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
            <label htmlFor="location" className="block">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
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
            <label htmlFor="capacity" className="block">AC Output (kW)</label>
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
            <label htmlFor="avgPeakSunHours" className="block">Average Peak Sun Hours</label>
            <input
              type="number"
              id="avg_peak_sun_hours"
              name="avgPeakSunHours"
              value={formData.avgPeakSunHours}
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
            <label htmlFor="dilutionRate" className="block">Dilution Rate: {formData.dilutionRate}</label>
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
          {/* <div>
            <label htmlFor="viewRewardsAfter" className="block">View Rewards After</label>
            <select
              id="viewRewardsAfter"
              name="viewRewardsAfter"
              value={formData.viewRewardsAfter}
              onChange={handleInputChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="6M">6 Months</option>
              <option value="1Y">1 Year</option>
              <option value="2Y">2 Years</option>
              <option value="3Y">3 Years</option>
              <option value="4Y">4 Years</option>
              <option value="10Y">10 Years</option>
            </select>
          </div> */}
        </div>
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Estimate Rewards
      </button>
    </form>
  );
};