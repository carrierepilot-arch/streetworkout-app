// api/exercisedb.js — Vercel Edge Function — Proxy sécurisé vers ExerciseDB/RapidAPI
// La clé RAPIDAPI_KEY est stockée dans les variables d'environnement Vercel.
// Elle n'est JAMAIS exposée côté client.

export const config = { runtime: 'edge' };

const EXERCISEDB_BASE = 'https://exercisedb.p.rapidapi.com';
const EXERCISEDB_HOST = 'exercisedb.p.rapidapi.com';

const ALLOWED_ORIGINS = [
  'https://streetworkout-app.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

// Whitelist filters to prevent SSRF
const ALLOWED_FILTERS = ['bodyPart', 'target', 'equipment', 'all'];

const ALLOWED_BODY_PARTS = [
  'back', 'chest', 'shoulders', 'upper arms',
  'upper legs', 'lower legs', 'lower arms', 'waist', 'neck', 'cardio'
];

const ALLOWED_TARGETS = [
  'abs', 'biceps', 'delts', 'glutes', 'hamstrings', 'lats',
  'pectorals', 'quads', 'traps', 'triceps', 'upper back',
  'forearms', 'calves', 'serratus anterior', 'spine'
];

const ALLOWED_EQUIPMENT = [
  'body weight', 'barbell', 'dumbbell', 'cable',
  'kettlebell', 'band', 'medicine ball', 'stability ball',
  'assisted', 'weighted', 'pull-up bar'
];

export default async function handler(req) {
  const origin = req.headers.get('origin') || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured', exercises: [] }), {
      status: 200, // Don't break client
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(req.url);
  const filter = url.searchParams.get('filter') || 'all';
  const value  = url.searchParams.get('value') || '';
  const limit  = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0'), 0);

  // Whitelist filter type
  if (!ALLOWED_FILTERS.includes(filter)) {
    return new Response(JSON.stringify({ error: 'Invalid filter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Whitelist filter value
  if (filter !== 'all' && value) {
    const allowedValues = {
      bodyPart: ALLOWED_BODY_PARTS,
      target:   ALLOWED_TARGETS,
      equipment: ALLOWED_EQUIPMENT
    };
    if (!allowedValues[filter] || !allowedValues[filter].includes(value)) {
      return new Response(JSON.stringify({ error: 'Invalid filter value' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // Build ExerciseDB URL
  let exerciseDbUrl;
  if (filter === 'all') {
    exerciseDbUrl = `${EXERCISEDB_BASE}/exercises?limit=${limit}&offset=${offset}`;
  } else {
    exerciseDbUrl = `${EXERCISEDB_BASE}/exercises/${filter}/${encodeURIComponent(value)}?limit=${limit}&offset=${offset}`;
  }

  try {
    const response = await fetch(exerciseDbUrl, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': EXERCISEDB_HOST,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`ExerciseDB error: ${response.status}`);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600' // Cache CDN 1h
      }
    });
  } catch (e) {
    console.error('ExerciseDB proxy error:', e.message);
    return new Response(JSON.stringify({ error: 'Upstream error', exercises: [] }), {
      status: 200, // Don't break client — return empty gracefully
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
