export interface Order {
  id: number;
  price: number;
  status: string;
  branchId: number;
  loanId: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  merchantId: number;
  products: any;
  sellsAgentId: number;
}
