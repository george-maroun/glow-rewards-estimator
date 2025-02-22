"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import estimateRewards from '../utils/estimateRewards';
import { getCarbonCredit } from '../actions/actions';
// import getLocationDataFromZipcode from '../utils/getLocationDataFromZipcode';
import getWeeksSinceStart from '../utils/getWeeksSinceStart';
import debounce from 'lodash/debounce';
import Link from 'next/link';

interface SolarFarmDashboardProps {
  weeklyFarmCount: Array<{ week: string; value: number }>;
  weeklyProtocolFees: any;
  auditData: any;
}

interface FormData {
  zipCode: string;
  capacity: number;
  joiningDate: string;
  dilutionRate: number;
  electricityPriceKWh: number;
}

interface CarbonCreditData {
  average_sunlight: number;
  average_carbon_certificates: number;
  state: string;
  city?: string;
}

const SolarFarmDashboard: React.FC<SolarFarmDashboardProps> = ({ weeklyFarmCount, weeklyProtocolFees, auditData }) => {
  const [formData, setFormData] = useState<FormData>({
    zipCode: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 1,
    electricityPriceKWh: 0.11,
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [carbonCreditData, setCarbonCreditData] = useState<CarbonCreditData | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const estimatedSlope = useMemo(() => {
    const startIndex = 16; // Start from the 17th entry (index 16)
    const relevantData = weeklyFarmCount.slice(startIndex);
    const n = relevantData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    
    relevantData.forEach(({ week, value }, index) => {
      const x = Number(week);
      const y = Number(value);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }, [weeklyFarmCount]);

  const avgProtocolFee = useMemo(() => {
    const totalFees = weeklyProtocolFees.reduce((sum: number, fee: any) => sum + fee.protocolFee, 0);
    return totalFees / weeklyProtocolFees.length;
  }, [weeklyProtocolFees]);

  // const avgWeeklyCarbonCredits = auditData.length ? auditData.reduce((acc:number, val:any) => acc + Number(val.summary.carbonFootprintAndProduction.adjustedWeeklyCarbonCredit), 0) / auditData.length : 0.08;

  const avgWeeklyCarbonCredits = useMemo(() => {
    return auditData?.length ? auditData.reduce((acc:number, val:any) => acc + Number(val.summary.carbonFootprintAndProduction.adjustedWeeklyCarbonCredit), 0) / auditData.length : 0.08;
  }, [auditData]);

  // const avgWeeklyCarbonCredits = 0.08;

  const fetchCarbonCreditData = useCallback(
    debounce(async (zipCode: string) => {
      if (zipCode.length !== 5) return;

      setIsLoading(true);
      try {
        const data = await getCarbonCredit(zipCode);
        if (data) {
          setCarbonCreditData(data);
          setIsRateLimited(false);
        } else {
          console.error('No data returned from getCarbonCredit');
        }
      } catch (error) {
        console.error('Error fetching carbon credit information:', error);
        if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
          setIsRateLimited(true);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.zipCode) {
      fetchCarbonCreditData(formData.zipCode);
    }
  }, [formData.zipCode, fetchCarbonCreditData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dilutionRate: parseFloat(e.target.value) }));
  };

  const handleSubmit = useCallback(async () => {
    if (isRateLimited) {
      return;
    }

    if (!carbonCreditData) {
      console.error('Carbon credit data not available');
      // alert user that carbon credit data is not available
      alert('Carbon credit data not available');
      return;
    }

    const joiningWeek = getWeeksSinceStart(formData.joiningDate);
    if (joiningWeek < 0) {
      console.error('Invalid joining date');
      // alert user that joining date is invalid
      alert('Joining date must be after 11/20/2023');
      return;
    }
    const endWeek = joiningWeek + 208;

    const input = {
      city: carbonCreditData.city,
      state: carbonCreditData.state,
      electricityPricePerKWh: formData.electricityPriceKWh,
      carbonCreditsPerMwh: carbonCreditData.average_carbon_certificates,
      dilutionRate: Number(formData.dilutionRate),
      joiningWeek,
      endWeek,
      estimatedSlope,
      avgPeakSunHours: carbonCreditData.average_sunlight,
      capacity: formData.capacity,
      pastProtocolFees: weeklyProtocolFees,
      avgProtocolFee,
      avgWeeklyCarbonCredits,
    };

    const estimatedResults = await estimateRewards(input);
    
    setResults(estimatedResults);
    setShowResults(true);
  }, [formData, carbonCreditData, estimatedSlope, weeklyProtocolFees, isRateLimited]);

  return (
    <div className="container mx-auto">
      <Link href={'/about'} className='font-semibold text-slate-500 flex gap-1 mb-8'>    
          <span className='underline'>About</span>
          <span className='text-slate-500'>📚</span>
        </Link>
      
      <h1 className="text-2xl font-bold mb-4">Glow Farm Rewards Estimator</h1>
      <p className="text-sm text-gray-600 mb-6 max-w-[800px]"><b>Disclaimer:</b> This website is community-build and is not affiliated with <a href='https://www.glow.org' className='underline' target='_blank'>Glow</a>. The information provided should not be considered as professional advice, and its accuracy depends on various factors and assumptions.</p>
      {isRateLimited && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>We are receiving too many requests at the moment. Please come back later.</p>
        </div>
      )}
      <FormSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
        handleSubmit={handleSubmit}
        disableSubmitButton={isRateLimited || !carbonCreditData || !formData.joiningDate}
      />
      {isLoading && (
        <div className='flex'>
          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2">Loading carbon credit data...</span>
        </div>
      )}
      {showResults && carbonCreditData &&
        <ResultsSection 
          weeklyFarmCount={weeklyFarmCount} 
          formData={formData} 
          results={results} 
          estimatedSlope={estimatedSlope}
        />
      }
    </div>
  );
};

export default SolarFarmDashboard;
