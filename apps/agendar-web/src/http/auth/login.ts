import { api } from "@/lib/api-client";
import { setToken } from "@/lib/auth";

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type AuthResponse = {
  token: string;
};

export async function login({ email, password, rememberMe }: SignInRequest) {
  const response = await api.post<AuthResponse>("/login", { email, password });

  setToken(response.data.token, rememberMe);

  return response.data;
}
