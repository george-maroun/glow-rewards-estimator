import { useState } from 'react';
import { FormData } from '../types';
import { getEstimate } from '../actions/actions';

export const useSolarFarmForm = () => {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 0.5,
    viewRewardsAfter: '1Y',
  });

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dilutionRate: parseFloat(e.target.value) });
  };

  const handleSubmit = async (formData:any) => {
    const results = await getEstimate(formData)
    setShowResults(true);
    setResults(results);
  };

  return { formData, handleInputChange, handleSliderChange, handleSubmit, showResults, results };
};