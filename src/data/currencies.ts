import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  DZD: {
    code: 'DZD',
    symbolAr: 'د.ج',
    symbolEn: 'DZD',
    rateFromSAR: 1,
  },
  SAR: {
    code: 'SAR',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    rateFromSAR: 0.028,
  },
  AED: {
    code: 'AED',
    symbolAr: 'د.إ',
    symbolEn: 'AED',
    rateFromSAR: 0.027,
  },
  USD: {
    code: 'USD',
    symbolAr: '$',
    symbolEn: 'USD',
    rateFromSAR: 0.0075,
  },
  KWD: {
    code: 'KWD',
    symbolAr: 'د.ك',
    symbolEn: 'KWD',
    rateFromSAR: 0.0023,
  },
};

export function formatPrice(amount: number, currency: CurrencyCode = 'DZD'): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.DZD;
  
  if (currency === 'DZD') {
    // Clean Algerian Dinar integer formatting with comma separator
    const rounded = Math.round(amount);
    return `${rounded.toLocaleString('en-US')} ${cfg.symbolAr}`;
  }
  
  const converted = amount * (cfg.rateFromSAR || 1);
  return `${converted.toFixed(2)} ${cfg.symbolAr}`;
}

