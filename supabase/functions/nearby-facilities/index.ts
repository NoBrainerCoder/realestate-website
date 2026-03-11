import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

interface FacilityResult {
  metro_distance_km: number | null;
  schools_nearby: number;
  hospitals_nearby: number;
  supermarkets_nearby: number;
  colleges_nearby: number;
}

async function geocodeLocation(location: string): Promise<{ lat: number; lon: number } | null> {
  const res = await fetch(
    `${NOMINATIM_URL}/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
    { headers: { 'User-Agent': 'EcoNest/1.0' } }
  );
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

async function queryOverpass(lat: number, lon: number, radiusMeters: number, tags: string): Promise<number> {
  const query = `[out:json][timeout:10];(${tags.split('|').map(t => `node${t}(around:${radiusMeters},${lat},${lon});`).join('')});out count;`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const data = await res.json();
    return data.elements?.[0]?.tags?.total ? parseInt(data.elements[0].tags.total) : 0;
  } catch {
    return 0;
  }
}

async function findNearestMetro(lat: number, lon: number): Promise<number | null> {
  const query = `[out:json][timeout:10];(node["railway"="station"]["station"="subway"](around:10000,${lat},${lon});node["railway"="station"]["network"~"Metro|metro|METRO"](around:10000,${lat},${lon});node["station"="light_rail"](around:10000,${lat},${lon}););out body 1;`;
  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const data = await res.json();
    if (data.elements && data.elements.length > 0) {
      const el = data.elements[0];
      const dist = haversine(lat, lon, el.lat, el.lon);
      return Math.round(dist * 10) / 10;
    }
    return null;
  } catch {
    return null;
  }
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location } = await req.json();
    if (!location) {
      return new Response(JSON.stringify({ error: 'Location is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const coords = await geocodeLocation(location);
    if (!coords) {
      return new Response(JSON.stringify({ error: 'Could not geocode location' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const radius = 3000; // 3km

    const [metroDist, schools, hospitals, supermarkets, colleges] = await Promise.all([
      findNearestMetro(coords.lat, coords.lon),
      queryOverpass(coords.lat, coords.lon, radius, '["amenity"="school"]'),
      queryOverpass(coords.lat, coords.lon, radius, '["amenity"="hospital"]|["amenity"="clinic"]'),
      queryOverpass(coords.lat, coords.lon, radius, '["shop"="supermarket"]|["shop"="mall"]'),
      queryOverpass(coords.lat, coords.lon, radius, '["amenity"="college"]|["amenity"="university"]'),
    ]);

    const result: FacilityResult = {
      metro_distance_km: metroDist,
      schools_nearby: schools,
      hospitals_nearby: hospitals,
      supermarkets_nearby: supermarkets,
      colleges_nearby: colleges,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
