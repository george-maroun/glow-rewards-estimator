import { useState } from 'react';
import { FormData } from '../types';

export const useSolarFarmForm = () => {
  const [formData, setFormData] = useState<FormData>({
    location: '',
    capacity: 0,
    joiningDate: '',
    dilutionRate: 0.5,
    viewRewardsAfter: '1Y',
  });

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, dilutionRate: parseFloat(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
    // API call or calculations would go here
  };

  return { formData, handleInputChange, handleSliderChange, handleSubmit, showResults };
};
