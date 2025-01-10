export type Mode = 'fun' | 'frustrated' | 'normal' | 'kid';

export interface Explanation {
  provider: string;
  explanation: string;
}

export interface ExplanationRequest {
  term: string;
  mode: Mode;
}