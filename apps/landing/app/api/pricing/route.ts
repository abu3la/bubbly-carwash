/** Read-only adapter to the existing public catalogue. No design fixtures as fallback. */
export async function GET() {
  const base = process.env.BUBBLES_API_URL ?? 'https://sama-api-dev.taz2886.workers.dev';
  try {
    const response = await fetch(`${base}/catalogue`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Catalogue unavailable');
    const data = await response.json();
    if (!Array.isArray(data.services) || !Array.isArray(data.plans))
      throw new Error('Invalid catalogue');
    return Response.json({ services: data.services, plans: data.plans });
  } catch {
    return Response.json({ error: 'catalogueUnavailable' }, { status: 502 });
  }
}
