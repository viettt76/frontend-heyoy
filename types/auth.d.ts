import { UserGender, UserRole } from './user';

export interface LoginDto {
    username: string;
    password: string;
}
export interface SignupDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: UserGender;
    role: UserRole;
}
