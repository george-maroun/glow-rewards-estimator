interface ProtocolFeeEntry {
  week: number;
  protocolFee: number;
  synthetic?: boolean;
}

interface FeeDistributionStats {
  meanFee: number;
  medianFee: number;
  stdFee: number;
  minFee: number;
  maxFee: number;
  zeroFeeProbability: number;
  numWeeks: number;
  numNonZeroWeeks: number;
}

class ProtocolFeeModel {
  private static readonly DEFAULT_SEED = 42;
  
  /**
   * Generate synthetic protocol fee data based on historical patterns
   */
  static modelProtocolFees(
    historicalData: ProtocolFeeEntry[],
    numWeeksToGenerate: number,
    seed: number = ProtocolFeeModel.DEFAULT_SEED
  ): ProtocolFeeEntry[] {
    // Sort data by week
    const sortedData = [...historicalData].sort((a, b) => a.week - b.week);
    
    // Calculate non-zero fees statistics
    const nonZeroFees = sortedData
      .filter(entry => entry.protocolFee > 0)
      .map(entry => entry.protocolFee);
    
    // Probability of a non-zero fee week
    const probNonZero = nonZeroFees.length / sortedData.length;
    
    // Calculate log-normal distribution parameters
    const logFees = nonZeroFees.map(fee => Math.log(fee));
    const mu = this.mean(logFees);
    const sigma = this.standardDeviation(logFees);
    
    // Initialize random number generator with seed
    const random = this.createSeededRandom(seed);
    
    // Generate synthetic data
    const syntheticData: ProtocolFeeEntry[] = [];
    const lastWeek = Math.max(...sortedData.map(entry => entry.week));
    
    for (let i = 0; i < numWeeksToGenerate; i++) {
      const newWeek = lastWeek + i + 1;
      
      // Decide if this week has a fee
      if (random() < probNonZero) {
        // Generate fee from log-normal distribution
        // Using Box-Muller transform for normal distribution
        const u1 = random();
        const u2 = random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        const randomLogFee = mu + sigma * z;
        const fee = Math.exp(randomLogFee);
        
        syntheticData.push({
          week: newWeek,
          protocolFee: Number(fee.toFixed(2)),
          synthetic: true
        });
      } else {
        syntheticData.push({
          week: newWeek,
          protocolFee: 0,
          synthetic: true
        });
      }
    }
    
    return syntheticData;
  }
  
  /**
   * Analyze the distribution of historical protocol fees
   */
  static analyzeFeeDistribution(
    historicalData: ProtocolFeeEntry[]
  ): FeeDistributionStats {
    const nonZeroFees = historicalData
      .filter(entry => entry.protocolFee > 0)
      .map(entry => entry.protocolFee);
    
    return {
      meanFee: this.mean(nonZeroFees),
      medianFee: this.median(nonZeroFees),
      stdFee: this.standardDeviation(nonZeroFees),
      minFee: Math.min(...nonZeroFees),
      maxFee: Math.max(...nonZeroFees),
      zeroFeeProbability: 
        historicalData.filter(entry => entry.protocolFee === 0).length / 
        historicalData.length,
      numWeeks: historicalData.length,
      numNonZeroWeeks: nonZeroFees.length
    };
  }
  
  /**
   * Statistical helper functions
   */
  private static mean(values: number[]): number {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
  
  private static median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
  
  private static standardDeviation(values: number[]): number {
    const avg = this.mean(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(this.mean(squareDiffs));
  }
  
  /**
   * Create a seeded random number generator
   */
  private static createSeededRandom(seed: number): () => number {
    return function() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
  }
}

// Example usage
// const historicalData: ProtocolFeeEntry[] = [
//   { week: 4, protocolFee: 10676 },
//   { week: 5, protocolFee: 36718.38 },
//   // ... rest of your data
// ];

// // Generate 12 weeks of synthetic data
// const syntheticData = ProtocolFeeModel.modelProtocolFees(historicalData, 12);

// // Analyze the historical distribution
// const stats = ProtocolFeeModel.analyzeFeeDistribution(historicalData);

export { ProtocolFeeModel, type ProtocolFeeEntry, type FeeDistributionStats };