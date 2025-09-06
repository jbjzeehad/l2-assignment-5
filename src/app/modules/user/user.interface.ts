export enum Role {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  picture?: string;
  isBlocked?: string;
  isActive?: string;
  isVerified?: string;
  role: Role;
}
