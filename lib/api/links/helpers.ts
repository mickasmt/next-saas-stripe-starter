import { parse } from 'node-html-parser';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export async function fetchOGData(url: string): Promise<OGData> {
  const init: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
    },
    mode: 'cors',
  };

  const res = await fetch(url, init);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const html = await res.text();
  const root = parse(html);
  const ogData: OGData = {
    title: root.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    description: root.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    image: root.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    url: root.querySelector('meta[property="og:url"]')?.getAttribute('content'),
  };

  return ogData;
}