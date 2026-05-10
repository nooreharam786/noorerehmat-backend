export type Role = "user" | "admin";
export type ApplicationStatus = "pending" | "selected" | "not_selected";
export type PaymentStatus = "pending" | "paid" | "failed";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type Applicant = {
  id: string;
  coverId: string;
  phone: string;
  stateCode: string;
  stateName: string;
  city: string;
  persons: number;
  entryFee: number;
  status: ApplicationStatus;
  paymentStatus: PaymentStatus;
  travellers: {
    id: string;
    fullName: string;
    phone: string;
  }[];
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export type DrawResult = {
  id: string;
  totalUsers: number;
  selectedCount: number;
  percentage: number | null;
  createdAt: string;
};

export type Stats = {
  totalUsers: number;
  totalApplicants: number;
  paidUsers: number;
  selectedUsers: number;
  lastDraw: DrawResult | null;
};

export type Feedback = {
  id: string;
  name: string;
  rating: number;
  message: string;
  location?: string | null;
  source: string;
  approved: boolean;
  createdAt: string;
};

export type PublicDocument = {
  id: string;
  title: string;
  description?: string | null;
  filename: string;
  kind: string;
  url: string;
  createdAt: string;
};

export type Paginated<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
