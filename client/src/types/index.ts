export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isApproved: boolean;
  workingGroup: 'Smart Click' | 'F.E.' | 'Customs';
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  partNumber: string;
  category: 'RPM' | 'Utility Panel' | 'Handheld' | 'Other';
  workingGroup: 'Smart Click' | 'F.E.' | 'Customs';
  quantity: number;
  barcode: string;
  lastUpdated: string;
}

export interface CheckoutItem {
  id: string;
  quantity: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  workingGroup: 'Smart Click' | 'F.E.' | 'Customs';
} 