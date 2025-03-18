export type ActionType = 'win' | 'lose' | 'withdraw';

export interface WithdrawalRequest {
  id: string;
  walletAddress: string;
  amount: number;
  timestamp: Date;
  action: ActionType;
  status: WithdrawalStatus;
}

export type BulkAction = 'approve' | 'reject' | 'review';

export type WithdrawalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}