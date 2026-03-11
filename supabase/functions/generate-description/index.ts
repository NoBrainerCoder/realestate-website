import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyData } = await req.json();
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Generate a compelling, professional property description for the following property in Hyderabad, India:

Property Type: ${propertyData.property_type}
Location: ${propertyData.location}
Bedrooms: ${propertyData.bedrooms} BHK
Bathrooms: ${propertyData.bathrooms}
Area: ${propertyData.area} sq ft
Furnishing: ${propertyData.furnishing}
Age: ${propertyData.age}
Amenities: ${propertyData.amenities?.join(', ') || 'None specified'}
Sustainability: ${[
  propertyData.solar_panels && 'Solar Panels',
  propertyData.rainwater_harvesting && 'Rainwater Harvesting',
  propertyData.waste_management && 'Waste Management',
  propertyData.green_certified && 'Green Certified',
].filter(Boolean).join(', ') || 'None specified'}

Write a description that:
1. Highlights the key features and benefits
2. Describes the location advantages
3. Mentions nearby facilities and connectivity
4. Highlights sustainability features if available
5. Creates an inviting tone for potential buyers/renters
6. Is between 100-150 words
7. Uses professional real estate language

Description:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a professional real estate copywriter specializing in Indian property markets with expertise in eco-friendly and sustainable properties.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const description = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-description function:', error);
    return new Response(
      JSON.stringify({ error: 'AI service temporarily unavailable. Please try again later.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
