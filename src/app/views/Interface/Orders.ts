// app/interfaces/Order.ts
export interface Order {
  id: number;
  productType: string;
  quantity: number;
  farmerEmail: string;
  buyerName?: string; // optional if no buyer yet
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  orderTime: string; // ISO string from backend
}
