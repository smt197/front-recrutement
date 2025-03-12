export interface ParamsEmailVerify {
  id: string;
  hash: string;
  uuid: string;
  expires : string;
  signature: string;
}
