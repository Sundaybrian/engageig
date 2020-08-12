export interface User {
  id: string;
  firstName: string;
  surName: string;
  middleName?: string;
  email: string;
  isAdmin: boolean;
  idNumber: number;
  phoneNumber: string;
}
