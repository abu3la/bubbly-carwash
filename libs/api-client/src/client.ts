let baseUrl = 'http://localhost:8787';

/** Called once at app startup; each app injects its own API origin. */
export function configureApi(options: { baseUrl: string }): void {
  baseUrl = options.baseUrl.replace(/\/$/, '');
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new ApiError(response.status, body || response.statusText);
  }
  return response.json() as Promise<T>;
}
