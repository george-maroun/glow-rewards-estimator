function calculateProtocolFee(
  previousElectricityPrice: number,
  hoursOfSunlightPerDay: number,
  powerOutput: number
): number {

  const DAYS_PER_YEAR = 365.25;
  const PREVIOUS_ESCALATOR = 0.0187;
  const COMMITMENT_YEARS = 10;
  const CASHFLOW_DISCOUNT = 0.11;

  // Calculate First Year Electricity Old Price
  const firstYearElectricityOldPrice =
    previousElectricityPrice *
    hoursOfSunlightPerDay *
    powerOutput *
    DAYS_PER_YEAR;

  // Calculate Lifetime Old Electricity Value
  const lifetimeOldElectricityValue =
    firstYearElectricityOldPrice *
    ((1 - Math.pow(1 + PREVIOUS_ESCALATOR, COMMITMENT_YEARS)) /
      (1 - (1 + PREVIOUS_ESCALATOR)));

  // Calculate Protocol Cash Requirements (Present Value)
  const protocolFee = calculatePresentValue(
    CASHFLOW_DISCOUNT,
    COMMITMENT_YEARS,
    lifetimeOldElectricityValue / COMMITMENT_YEARS
  );

  return protocolFee;
}

function calculatePresentValue(
  rate: number,
  periods: number,
  payment: number
): number {
  return (payment * (1 - Math.pow(1 + rate, -periods))) / rate;
}

export default calculateProtocolFee;