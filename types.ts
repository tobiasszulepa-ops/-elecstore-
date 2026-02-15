
export interface DeviceBrand {
  id: string;
  name: string;
  logo?: string;
}

export interface RepairIssue {
  id: string;
  label: string;
  description: string;
  basePrice: number;
}

export interface QuoteRequest {
  brand: string;
  model: string;
  issue: string;
  customDetails?: string;
}

export interface QuoteResult {
  estimatedPriceRange: string;
  estimatedTime: string;
  explanation: string;
  partsAvailability: string;
  recommendations: string[];
}
