export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface TokenService {
  generate(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
