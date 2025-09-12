const currencyUtils = require('../../src/utils/currencyUtils');

describe('Currency Utilities', () => {
  describe('supportedCurrencies', () => {
    it('should contain all supported currencies', () => {
      expect(currencyUtils.supportedCurrencies).toBeDefined();
      expect(Object.keys(currencyUtils.supportedCurrencies).length).toBeGreaterThan(15);
      
      // Check a few specific currencies
      expect(currencyUtils.supportedCurrencies.USD).toBeDefined();
      expect(currencyUtils.supportedCurrencies.EUR).toBeDefined();
      expect(currencyUtils.supportedCurrencies.JPY).toBeDefined();
      expect(currencyUtils.supportedCurrencies.INR).toBeDefined();
    });
    
    it('should have correct structure for each currency', () => {
      const usd = currencyUtils.supportedCurrencies.USD;
      expect(usd).toHaveProperty('name');
      expect(usd).toHaveProperty('symbol');
      expect(usd).toHaveProperty('decimalPlaces');
      expect(usd).toHaveProperty('code');
      
      expect(usd.name).toBe('US Dollar');
      expect(usd.symbol).toBe('$');
      expect(usd.decimalPlaces).toBe(2);
      expect(usd.code).toBe('USD');
    });
  });
  
  describe('getAllCurrencies', () => {
    it('should return all supported currencies', () => {
      const currencies = currencyUtils.getAllCurrencies();
      expect(currencies).toEqual(currencyUtils.supportedCurrencies);
    });
  });
  
  describe('getCurrencyCodes', () => {
    it('should return an array of currency codes', () => {
      const codes = currencyUtils.getCurrencyCodes();
      expect(Array.isArray(codes)).toBe(true);
      expect(codes.length).toBeGreaterThan(15);
      expect(codes).toContain('USD');
      expect(codes).toContain('EUR');
      expect(codes).toContain('JPY');
    });
  });
  
  describe('isCurrencySupported', () => {
    it('should return true for supported currencies', () => {
      expect(currencyUtils.isCurrencySupported('USD')).toBe(true);
      expect(currencyUtils.isCurrencySupported('EUR')).toBe(true);
      expect(currencyUtils.isCurrencySupported('JPY')).toBe(true);
    });
    
    it('should return false for unsupported currencies', () => {
      expect(currencyUtils.isCurrencySupported('XYZ')).toBe(false);
      expect(currencyUtils.isCurrencySupported('')).toBe(false);
      expect(currencyUtils.isCurrencySupported(null)).toBe(false);
    });
  });
  
  describe('formatCurrencyAmount', () => {
    it('should format USD correctly', () => {
      expect(currencyUtils.formatCurrencyAmount(1234.56, 'USD')).toBe('$1,234.56');
      expect(currencyUtils.formatCurrencyAmount(0.5, 'USD')).toBe('$0.50');
      expect(currencyUtils.formatCurrencyAmount(1000000, 'USD')).toBe('$1,000,000.00');
    });
    
    it('should format JPY correctly (no decimal places)', () => {
      expect(currencyUtils.formatCurrencyAmount(1234.56, 'JPY')).toBe('¥1,235');
      expect(currencyUtils.formatCurrencyAmount(1000000, 'JPY')).toBe('¥1,000,000');
    });
    
    it('should throw error for unsupported currency', () => {
      expect(() => {
        currencyUtils.formatCurrencyAmount(100, 'XYZ');
      }).toThrow();
    });
  });
  
  describe('convertCurrency', () => {
    it('should convert USD to EUR correctly', () => {
      const result = currencyUtils.convertCurrency(100, 'USD', 'EUR');
      expect(result).toBe(85);
    });
    
    it('should convert EUR to USD correctly', () => {
      const result = currencyUtils.convertCurrency(85, 'EUR', 'USD');
      expect(result).toBe(100);
    });
    
    it('should convert between non-USD currencies correctly', () => {
      const result = currencyUtils.convertCurrency(100, 'EUR', 'GBP');
      // EUR to USD (100/0.85 = 117.65) then USD to GBP (117.65*0.73 = 85.88)
      expect(result).toBeCloseTo(85.88, 1);
    });
    
    it('should handle same currency conversion', () => {
      expect(currencyUtils.convertCurrency(100, 'USD', 'USD')).toBe(100);
      expect(currencyUtils.convertCurrency(100, 'EUR', 'EUR')).toBe(100);
    });
    
    it('should throw error for unsupported currencies', () => {
      expect(() => {
        currencyUtils.convertCurrency(100, 'XYZ', 'USD');
      }).toThrow();
      
      expect(() => {
        currencyUtils.convertCurrency(100, 'USD', 'XYZ');
      }).toThrow();
    });
  });
  
  describe('getCurrencyDetails', () => {
    it('should return details for a supported currency', () => {
      const usdDetails = currencyUtils.getCurrencyDetails('USD');
      expect(usdDetails).toEqual({
        name: 'US Dollar',
        symbol: '$',
        decimalPlaces: 2,
        code: 'USD'
      });
    });
    
    it('should return null for an unsupported currency', () => {
      expect(currencyUtils.getCurrencyDetails('XYZ')).toBeNull();
    });
  });
  
  describe('isValidAmountForCurrency', () => {
    it('should validate USD amounts correctly', () => {
      expect(currencyUtils.isValidAmountForCurrency(123.45, 'USD')).toBe(true);
      expect(currencyUtils.isValidAmountForCurrency(123.456, 'USD')).toBe(false);
      expect(currencyUtils.isValidAmountForCurrency(0, 'USD')).toBe(false);
      expect(currencyUtils.isValidAmountForCurrency(-10, 'USD')).toBe(false);
    });
    
    it('should validate JPY amounts correctly (no decimals)', () => {
      expect(currencyUtils.isValidAmountForCurrency(1234, 'JPY')).toBe(true);
      expect(currencyUtils.isValidAmountForCurrency(1234.5, 'JPY')).toBe(false);
    });
    
    it('should return false for unsupported currency', () => {
      expect(currencyUtils.isValidAmountForCurrency(100, 'XYZ')).toBe(false);
    });
  });
});

// Made with Bob
