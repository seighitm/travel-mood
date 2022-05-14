export interface Token {
  token: string,
  userId: number,
  accessToken: string,
  refreshToken: string,
}

export type SaveTokenResponse = Pick<Token, 'token' | 'userId'>;

export type GenerateTokenResponse = Pick<Token, 'accessToken' | 'refreshToken'>;


