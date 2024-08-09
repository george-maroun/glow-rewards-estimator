import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto pl-8 pr-8 py-6 flex flex-row justify-between items-start">
      <div className=''>
        <h1 className="text-2xl font-bold mb-6">About</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Glow Rewards Estimator</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This website estimates the statistics and rewards in Glow tokens and USDC over four years for a hypothetical farm joining the Glow protocol at a given date.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6">
              <li>Enter the zip code, electricity price per kilowatt-hour at the farm&apos;s location, DC output in kilowatts, and the date of joining the protocol.</li>
              <li>Adjust the rate multiplier to increase or decrease the slope of the weekly farm count estimate curve.</li>
              <li>Click on "Estimate Rewards" to view the estimated stats for the farm: protocol fee, annual electricity production, annual carbon credit production, and rewards over four years.</li>
              <li>Adjust any input value and click on "Estimate Rewards" again to see how the rewards change.</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How Results Are Calculated</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Protocol fee:</h3>
            <p>The protocol fee is calculated as the present value of the electricity value over a 10-year commitment period, discounted at 11%. The formula can be expressed as:</p>
            <p className="my-2">PV = PMT * ((1 - (1 + r)^-n) / r)</p>
            <p>Where PV is the protocol fee, PMT is the average annual old electricity value, r is the discount rate (11%), and n is the number of periods (10 years).</p>

            <h3 className="font-semibold mt-4 mb-2">Annual Electricity Production:</h3>
            <p>power_production_per_year_mwh = dc_output_kw * avg_daily_peak_sun_hours * 365.25 / 1000</p>

            <h3 className="font-semibold mt-4 mb-2">Annual Carbon Credit Production:</h3>
            <p>annual_carbon_credits = carbon_credits_earned_per_mwh * power_production_per_week_kwh * weeks_per_year / 1000 * 0.65</p>

            <h3 className="font-semibold mt-4 mb-2">Weekly Glow Token Rewards:</h3>
            <p>weekly_glow_reward = total_weekly_glow_rewards * (protocol_fee / total_protocol_fee_per_week)</p>
            <p className='mt-2'>Where:</p>
            <ul className="list-disc ml-6">
              <li>total_weekly_glow_rewards is a constant = 175,000</li>
              <li>protocol_fee is the protocol fee of the hypothetical solar farm</li>
              <li>total_protocol_fee_per_week is the sum of protocol fees from all active farms that week</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Weekly USDC Rewards:</h3>
            <p>Weekly USDC rewards are calculated using a complex function that considers:</p>
            <ol className="list-decimal ml-6 mt-2">
              <li>The bonding curve amount</li>
              <li>Protocol fees collected over the past 208 weeks (excluding the most recent 16 weeks)</li>
              <li>The farm's carbon credit production relative to the total carbon credit production</li>
            </ol>
            <p className="mt-2">The exact calculation is:</p>
            <p className="my-2">weekly_usdc_rewards = usdc_pool_for_week * (carbon_credit_production / total_carbon_credits)</p>
            <p className='mt-2'>Where:</p>
            <ul className="list-disc ml-6">
              <li>usdc_pool_for_week is the average of the weekly protocol fees paid over the past 208 weeks (excluding the most recent 16 weeks)</li>
              <li>carbon_credit_production is the estimated number of carbon credit produced that week by the hypothetical farm</li>
              <li>total_carbon_credits is the sum of the estimated of of carbon credit produced by all active farms</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Weekly Electricity Value:</h3>
            <p>weekly_electricity_value = power_production_per_week_kwh * electricity_price_per_kwh * (1 + annual_percent_increase_in_electricity_price) ^ years_since_join_date</p>
            <p className='mt-2'>Where:</p>
            <ul className="list-disc ml-6">
              <li>power_production_per_week_kwh is the average weekly power production in kilowatt-hours</li>
              <li>annual_percent_increase_in_electricity_price is the electricity price per kWh, which increases annually based on the state's electricity price increase rate</li>
            </ul>
            <p className="mt-2">This calculation estimates the monetary value of the electricity produced by the solar installation each week.</p>
          </CardContent>
        </Card>
      </div>
      <div className=''>
        <Link href={'/'} className='font-semibold underline text-slate-600'>Home</Link>
      </div>
    </div>
  );
};

export default About;