/**
 * Інтерфейс для даних користувача, що повертаються з Firebird.
 */
export interface FbUser {
  ID: number;
  IB_PWD: string;
  ID_GROUP: number;
  NAME_DISP: string; // so.NAME
  NAME_DISP_UK: string; // so.NAME_UKR
  NAME_RUK: string; // su.NAME
  ID_DISP: number; // so.is AS id_disp  <-- НОВЕ ПОЛЕ
}

export interface User {
  id: number;
  ID_GROUP: number;
  full_name: string;
  disp_name: string;
  id_disp: number;
}
export interface AuthUser {
  id: number;
  name: string;
  role_: number;
  full_name_ukr: string | null;
  display_name: string;
  id_disp: number;
}

export interface LoginRequest {
  userId: number;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// --- Інтерфейс Сервісу ---

/**
 * Інтерфейс для сервісу користувачів.
 */
export interface IUserService {
  getAllUsers(): Promise<AuthUser[]>;

  getUserByCredentials(LoginRequest): Promise<AuthUser | null>;
}
