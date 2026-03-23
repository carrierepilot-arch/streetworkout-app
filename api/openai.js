export const config = { runtime: 'edge' };

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST only' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  const key = process.env.OPENAI_API_KEY || '';
  if (!key) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.text();
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: body
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}
