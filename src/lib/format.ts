export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `Rs${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `Rs${(amount / 100000).toFixed(1)}L`; // One decimal place for Lakhs per screenshot
  } else {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('PKR', 'Rs');
  }
}

export function formatCompactNumber(number: number): string {
  if (number >= 10000000) {
    return `${(number / 10000000).toFixed(1)}Cr`;
  } else if (number >= 100000) {
      return `${(number / 100000).toFixed(1)}L`;
  } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}k`;
  }
  return number.toString();
}
