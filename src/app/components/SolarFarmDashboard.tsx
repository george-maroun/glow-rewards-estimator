"use client"
import React from 'react';
import { FormSection } from './FormSection';
import { ResultsSection } from './ResultsSection';
import { useSolarFarmForm } from '../hooks/useSolarFarmForm';

const SolarFarmDashboard: React.FC = () => {
  const { formData, handleInputChange, handleSliderChange, handleSubmit, showResults } = useSolarFarmForm();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Solar Farm Rewards Estimator</h1>
      <FormSection 
        formData={formData}
        handleInputChange={handleInputChange}
        handleSliderChange={handleSliderChange}
        handleSubmit={handleSubmit}
      />
      {showResults && <ResultsSection formData={formData} />}
    </div>
  );
};

export default SolarFarmDashboard;

// "use client"
// import React, { useState } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// interface FormData {
//   location: string;
//   capacity: number;
//   joiningDate: string;
//   dilutionRate: number;
//   viewRewardsAfter: string;
// }

// const SolarFarmDashboard: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     location: '',
//     capacity: 0,
//     joiningDate: '',
//     dilutionRate: 0.5,
//     viewRewardsAfter: '1Y',
//   });

//   const [showResults, setShowResults] = useState(false);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, dilutionRate: parseFloat(e.target.value) });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setShowResults(true);
//     // Here you would typically call an API or perform calculations
//   };

//   // Mock data for charts
//   const mockChartData = [
//     { name: '2024', value: 100 },
//     { name: '2025', value: 200 },
//     { name: '2026', value: 300 },
//     { name: '2027', value: 400 },
//     { name: '2028', value: 500 },
//   ];

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Solar Farm Rewards Estimator</h1>
//       <form onSubmit={handleSubmit} className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Enter farm information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="location" className="block">Location</label>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={formData.location}
//               onChange={handleInputChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="capacity" className="block">Solar Farm Capacity (watts)</label>
//             <input
//               type="number"
//               id="capacity"
//               name="capacity"
//               value={formData.capacity}
//               onChange={handleInputChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="joiningDate" className="block">Joining Date</label>
//             <input
//               type="date"
//               id="joiningDate"
//               name="joiningDate"
//               value={formData.joiningDate}
//               onChange={handleInputChange}
//               className="w-full border rounded px-2 py-1"
//               required
//             />
//           </div>
//           <div>
//             <label htmlFor="dilutionRate" className="block">Dilution Rate: {formData.dilutionRate}</label>
//             <input
//               type="range"
//               id="dilutionRate"
//               name="dilutionRate"
//               min="0"
//               max="1"
//               step="0.01"
//               value={formData.dilutionRate}
//               onChange={handleSliderChange}
//               className="w-full"
//             />
//           </div>
//           <div>
//             <label htmlFor="viewRewardsAfter" className="block">View Rewards After</label>
//             <select
//               id="viewRewardsAfter"
//               name="viewRewardsAfter"
//               value={formData.viewRewardsAfter}
//               onChange={handleInputChange}
//               className="w-full border rounded px-2 py-1"
//             >
//               <option value="6M">6 Months</option>
//               <option value="1Y">1 Year</option>
//               <option value="2Y">2 Years</option>
//               <option value="3Y">3 Years</option>
//               <option value="4Y">4 Years</option>
//               <option value="10Y">10 Years</option>
//             </select>
//           </div>
//         </div>
//         <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
//           Estimate Rewards
//         </button>
//       </form>

//       {showResults && (
//         <div className="results">
//           <h2 className="text-xl font-semibold mb-4">Rewards</h2>
//           <div className="my-8">
//             <h3 className="text-lg font-semibold mb-2">Total Rewards Received at {formData.viewRewardsAfter}</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-gray-100 p-4 rounded">
//                 <h4 className="font-semibold">Glow Tokens</h4>
//                 <p className="text-2xl">1.73M</p>
//               </div>
//               <div className="bg-gray-100 p-4 rounded">
//                 <h4 className="font-semibold">USDC</h4>
//                 <p className="text-2xl">12.2K</p>
//               </div>
//               <div className="bg-gray-100 p-4 rounded">
//                 <h4 className="font-semibold">USD</h4>
//                 <p className="text-2xl">30.8K</p>
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Number of Solar Farms Over Time</h3>
//               <LineChart width={500} height={300} data={mockChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="value" stroke="#8884d8" />
//               </LineChart>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Cumulative Rewards in Glow Tokens</h3>
//               <LineChart width={500} height={300} data={mockChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="value" stroke="#82ca9d" />
//               </LineChart>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Cumulative Rewards in USDC</h3>
//               <LineChart width={500} height={300} data={mockChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="value" stroke="#ffc658" />
//               </LineChart>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold mb-2">Cumulative Value of Electricity Produced</h3>
//               <LineChart width={500} height={300} data={mockChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="value" stroke="#ff7300" />
//               </LineChart>
//             </div>
//           </div>
          
//         </div>
//       )}
//     </div>
//   );
// };

// export default SolarFarmDashboard;