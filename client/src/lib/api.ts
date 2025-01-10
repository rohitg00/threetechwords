export interface Explanation {
  provider: string;
  explanation: string;
}

export type Mode = 'fun' | 'frustrated' | 'normal' | 'kid';

export async function getExplanation(term: string, mode: Mode = 'normal'): Promise<Explanation[]> {
  const response = await fetch('/api/explain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ term, mode }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}