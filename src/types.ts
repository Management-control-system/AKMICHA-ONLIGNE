export type FabricCategory =
  | 'all'
  | 'cotton'
  | 'silk'
  | 'linen'
  | 'wool_cashmere'
  | 'velvet'
  | 'satin'
  | 'chiffon'
  | 'lace'
  | 'crepe'
  | 'denim_canvas'
  | 'thobe'
  | 'abaya'
  | 'dress'
  | 'suit'
  | 'curtains_upholstery';

export interface FabricColor {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  inStockMeters: number;
  image: string;
}

export interface Fabric {
  id: string;
  nameAr: string;
  nameEn: string;
  category: FabricCategory;
  typeAr: string;
  typeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  pricePerMeter: number;
  originalPricePerMeter?: number;
  samplePrice: number;
  minMeters: number;
  meterStep: number;
  widthCm: number; // e.g., 140cm or 150cm (58 inches)
  weightGsm: number; // g/m²
  compositionAr: string;
  compositionEn: string;
  drapeAr: string; // انسيابي، متوسط، متماسك
  stretchAr: string; // بدون ليكرا، مرن خفيف، مطاط
  seasonAr: string; // صيفي، شتوي، ربيعي، لجميع الفصول
  patternAr: string; // سادة، مقلم، منقوش، مطرز، مضلع
  originAr: string; // اليابان، إيطاليا، إنجلترا، مصر، فرنسا، الهند
  originEn: string;
  tags: string[];
  usesAr: string[]; // ثياب رجالية، فساتين سهرة، عبايات، ستائر، بدلات
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  featured?: boolean;
  colors: FabricColor[];
  galleryImages: string[];
  careInstructionsAr: string[];
}

export interface CartItem {
  id: string; // unique cart line id
  fabricId: string;
  fabricNameAr: string;
  fabricNameEn: string;
  fabricTypeAr: string;
  color: FabricColor;
  meters: number;
  isSampleOnly?: boolean;
  pricePerMeter: number;
  totalPrice: number;
  image: string;
  widthCm: number;
  cuttingInstructions?: string;
}

export type OrderStatus =
  | 'received'
  | 'cutting'
  | 'packing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  timestamp: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  createdAt: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  district?: string;
  addressDetails: string;
  cuttingNotes?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: 'online_card' | 'apple_pay' | 'cod';
  paymentStatus: 'paid' | 'pending_cod';
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  estimatedDeliveryDate: string;
}

export interface FilterState {
  searchQuery: string;
  category: FabricCategory;
  selectedColors: string[]; // color names or hexes
  selectedPatterns: string[];
  selectedSeasons: string[];
  selectedUses: string[];
  selectedOrigins: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export type CurrencyCode = 'SAR' | 'AED' | 'KWD' | 'USD' | 'DZD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbolAr: string;
  symbolEn: string;
  rateFromSAR: number;
}
