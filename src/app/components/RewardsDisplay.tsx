import React from 'react';

interface RewardsDisplayProps {
  viewRewardsAfter: string;
}

export const RewardsDisplay: React.FC<RewardsDisplayProps> = ({ viewRewardsAfter }) => {
  return (
    <div className="my-8">
      <h3 className="text-lg font-semibold mb-2">Total Rewards Received at {viewRewardsAfter}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        {/* <div className=""> */}
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold">Glow Tokens</h4>
            <p className="text-2xl">1.73M</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold">USDC</h4>
            <p className="text-2xl">12.2K</p>
          </div>
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="font-semibold">USD</h4>
            <p className="text-2xl">30.8K</p>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};