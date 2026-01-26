import { api } from "@/lib/api-client";
import { setToken } from "@/lib/auth";
import type { AuthResponse } from "./login";

export interface PreRegisterRequest {
  name: string;
  email: string;
}

export interface SignUpRequest {
  code: string;
  name: string;
  email: string;
  password: string;
  state: string;
  city: string;
}

export async function preRegister({ name, email }: PreRegisterRequest) {
  await api.post("/pre-register", {
    name,
    email,
  });
}

export async function register({
  code,
  name,
  email,
  password,
  state,
  city,
}: SignUpRequest) {
  const response = await api.post<AuthResponse>("/register", {
    code,
    name,
    email,
    password,
    state,
    city,
  });

  setToken(response.data.token);

  return response.data;
}
