/**
 * Calculates the Net Present Value (NPV) of an investment.
 * Assumes constant annual cash flow.
 * @param annualCashFlow The constant cash flow received each year.
 * @param discountRate The annual discount rate (e.g., 0.1 for 10%).
 * @param durationYears The number of years the cash flow is received.
 * @param initialInvestment The initial cost of the investment (a positive value).
 * @returns The Net Present Value.
 */
export function calculateNPV(
  annualCashFlow: number,
  discountRate: number,
  durationYears: number,
  initialInvestment: number
): number {
  if (discountRate <= -1) {
    // Avoid division by zero or negative results if r = -1 (or 1+r = 0)
    // This case is economically unusual but good to handle.
    // If discount rate is very low (e.g. close to -100%), PV can be very large.
    // For simplicity, let's return -Infinity or handle as an error.
    // Here, we'll assume discountRate > -1.
    // For discountRate = 0, formula simplifies to sum(CF) - initialInvestment
  }

  let presentValueOfCashFlows = 0;
  if (discountRate === 0) {
    presentValueOfCashFlows = annualCashFlow * durationYears;
  } else {
    for (let t = 1; t <= durationYears; t++) {
      presentValueOfCashFlows += annualCashFlow / Math.pow(1 + discountRate, t);
    }
  }
  
  return presentValueOfCashFlows - initialInvestment;
}

/**
 * Formats a number as currency (USD).
 * @param amount The number to format.
 * @returns A string representing the formatted currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
