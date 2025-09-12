/**
 * Currency utilities for payment processing
 */

// List of supported currencies with their details
const supportedCurrencies = {
  USD: {
    name: 'US Dollar',
    symbol: '$',
    decimalPlaces: 2,
    code: 'USD'
  },
  EUR: {
    name: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
    code: 'EUR'
  },
  GBP: {
    name: 'British Pound',
    symbol: '£',
    decimalPlaces: 2,
    code: 'GBP'
  },
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
    decimalPlaces: 2,
    code: 'INR'
  },
  JPY: {
    name: 'Japanese Yen',
    symbol: '¥',
    decimalPlaces: 0, // JPY typically doesn't use decimal places
    code: 'JPY'
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimalPlaces: 2,
    code: 'CAD'
  },
  AUD: {
    name: 'Australian Dollar',
    symbol: 'A$',
    decimalPlaces: 2,
    code: 'AUD'
  },
  CNY: {
    name: 'Chinese Yuan',
    symbol: '¥',
    decimalPlaces: 2,
    code: 'CNY'
  },
  CHF: {
    name: 'Swiss Franc',
    symbol: 'Fr',
    decimalPlaces: 2,
    code: 'CHF'
  },
  SGD: {
    name: 'Singapore Dollar',
    symbol: 'S$',
    decimalPlaces: 2,
    code: 'SGD'
  },
  NZD: {
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    decimalPlaces: 2,
    code: 'NZD'
  },
  MXN: {
    name: 'Mexican Peso',
    symbol: 'Mex$',
    decimalPlaces: 2,
    code: 'MXN'
  },
  BRL: {
    name: 'Brazilian Real',
    symbol: 'R$',
    decimalPlaces: 2,
    code: 'BRL'
  },
  ZAR: {
    name: 'South African Rand',
    symbol: 'R',
    decimalPlaces: 2,
    code: 'ZAR'
  },
  HKD: {
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    decimalPlaces: 2,
    code: 'HKD'
  },
  SEK: {
    name: 'Swedish Krona',
    symbol: 'kr',
    decimalPlaces: 2,
    code: 'SEK'
  },
  NOK: {
    name: 'Norwegian Krone',
    symbol: 'kr',
    decimalPlaces: 2,
    code: 'NOK'
  },
  DKK: {
    name: 'Danish Krone',
    symbol: 'kr',
    decimalPlaces: 2,
    code: 'DKK'
  },
  AED: {
    name: 'United Arab Emirates Dirham',
    symbol: 'د.إ',
    decimalPlaces: 2,
    code: 'AED'
  },
  SAR: {
    name: 'Saudi Riyal',
    symbol: '﷼',
    decimalPlaces: 2,
    code: 'SAR'
  }
};

// Exchange rates relative to USD (as of a specific date)
// In a production environment, these would be fetched from an API
const exchangeRates = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  INR: 74.5,
  JPY: 110.2,
  CAD: 1.25,
  AUD: 1.35,
  CNY: 6.45,
  CHF: 0.92,
  SGD: 1.35,
  NZD: 1.42,
  MXN: 20.1,
  BRL: 5.25,
  ZAR: 14.8,
  HKD: 7.78,
  SEK: 8.65,
  NOK: 8.75,
  DKK: 6.32,
  AED: 3.67,
  SAR: 3.75
};

/**
 * Get all supported currencies
 * @returns {Object} Object containing all supported currencies
 */
const getAllCurrencies = () => {
  return supportedCurrencies;
};

/**
 * Get list of currency codes
 * @returns {Array} Array of currency codes
 */
const getCurrencyCodes = () => {
  return Object.keys(supportedCurrencies);
};

/**
 * Check if a currency is supported
 * @param {string} currencyCode - The currency code to check
 * @returns {boolean} True if the currency is supported
 */
const isCurrencySupported = (currencyCode) => {
  return supportedCurrencies.hasOwnProperty(currencyCode);
};

/**
 * Format amount according to currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code
 * @returns {string} Formatted amount with currency symbol
 */
const formatCurrencyAmount = (amount, currencyCode = 'USD') => {
  if (!isCurrencySupported(currencyCode)) {
    throw new Error(`Currency ${currencyCode} is not supported`);
  }

  const currency = supportedCurrencies[currencyCode];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces
  });

  return formatter.format(amount);
};

/**
 * Convert amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @returns {number} Converted amount
 */
const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (!isCurrencySupported(fromCurrency) || !isCurrencySupported(toCurrency)) {
    throw new Error('One or both currencies are not supported');
  }

  // Convert to USD first (if not already in USD)
  const amountInUSD = fromCurrency === 'USD' ? amount : amount / exchangeRates[fromCurrency];
  
  // Then convert from USD to target currency
  const convertedAmount = toCurrency === 'USD' ? amountInUSD : amountInUSD * exchangeRates[toCurrency];
  
  // Round to appropriate decimal places
  const decimalPlaces = supportedCurrencies[toCurrency].decimalPlaces;
  return parseFloat(convertedAmount.toFixed(decimalPlaces));
};

/**
 * Get currency details by code
 * @param {string} currencyCode - The currency code
 * @returns {Object|null} Currency details or null if not found
 */
const getCurrencyDetails = (currencyCode) => {
  return supportedCurrencies[currencyCode] || null;
};

/**
 * Validate amount format for a specific currency
 * @param {number|string} amount - The amount to validate
 * @param {string} currencyCode - The currency code
 * @returns {boolean} True if the amount format is valid for the currency
 */
const isValidAmountForCurrency = (amount, currencyCode = 'USD') => {
  if (!isCurrencySupported(currencyCode)) {
    return false;
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return false;
  }

  const currency = supportedCurrencies[currencyCode];
  const decimalPlaces = currency.decimalPlaces;
  
  // Check if the amount has the correct number of decimal places
  const amountStr = numAmount.toString();
  const decimalPart = amountStr.includes('.') ? amountStr.split('.')[1] : '';
  
  return decimalPart.length <= decimalPlaces;
};

module.exports = {
  supportedCurrencies,
  exchangeRates,
  getAllCurrencies,
  getCurrencyCodes,
  isCurrencySupported,
  formatCurrencyAmount,
  convertCurrency,
  getCurrencyDetails,
  isValidAmountForCurrency
};

// Made with Bob
