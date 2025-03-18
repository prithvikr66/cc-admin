import { BulkAction } from './withdrawal';

export interface Transaction {
  id: string;
  action: BulkAction;
  requestIds: string[];
  timestamp: Date;
  performedBy: string; // In a real app, this would be the actual user
  signature?: string; // Solana transaction signature
}