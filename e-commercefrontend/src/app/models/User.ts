import { Address } from "./Address";

export interface User {
     id: number;
  email: string;
  firstName: string;
  lastName: string;
  addresses: Address[];
  createdAt?: string;
  password:string;
}
