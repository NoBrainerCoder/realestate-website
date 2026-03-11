import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Leaf, Train, School, Hospital, ShoppingCart, GraduationCap, TrendingUp, Award, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SmartPropertyInsightsProps {
  property: {
    location: string;
    solar_panels?: boolean | null;
    rainwater_harvesting?: boolean | null;
    waste_management?: boolean | null;
    green_certified?: boolean | null;
    energy_efficiency_rating?: number | null;
    eco_rating?: number | null;
  };
}

interface FacilityData {
  metro_distance_km: number | null;
  schools_nearby: number;
  hospitals_nearby: number;
  supermarkets_nearby: number;
  colleges_nearby: number;
}

function calculateEcoScore(property: SmartPropertyInsightsProps['property']): number {
  if (property.eco_rating != null) return property.eco_rating;
  
  let score = 0;
  if (property.solar_panels) score += 2;
  if (property.rainwater_harvesting) score += 2;
  if (property.waste_management) score += 1.5;
  if (property.green_certified) score += 2;
  if (property.energy_efficiency_rating) {
    score += (property.energy_efficiency_rating / 5) * 2.5;
  }
  return Math.min(10, Math.round(score * 10) / 10);
}

function calculateAreaScore(data: FacilityData): number {
  let score = 0;

  // Metro proximity (0-2.5 points)
  if (data.metro_distance_km !== null) {
    if (data.metro_distance_km <= 1) score += 2.5;
    else if (data.metro_distance_km <= 3) score += 2;
    else if (data.metro_distance_km <= 5) score += 1.5;
    else if (data.metro_distance_km <= 10) score += 0.5;
  }

  // Schools (0-2 points)
  score += Math.min(2, data.schools_nearby * 0.3);

  // Hospitals (0-2 points)
  score += Math.min(2, data.hospitals_nearby * 0.5);

  // Supermarkets (0-1.5 points)
  score += Math.min(1.5, data.supermarkets_nearby * 0.3);

  // Colleges (0-2 points)
  score += Math.min(2, data.colleges_nearby * 0.5);

  return Math.min(10, Math.round(score * 10) / 10);
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'text-eco-high';
  if (score >= 5) return 'text-eco-mid';
  return 'text-eco-low';
}

function getScoreBg(score: number): string {
  if (score >= 8) return 'bg-eco-high/10 border-eco-high/20';
  if (score >= 5) return 'bg-eco-mid/10 border-eco-mid/20';
  return 'bg-eco-low/10 border-eco-low/20';
}

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  return (
    <div className={`flex flex-col items-center p-4 rounded-xl border ${getScoreBg(score)}`}>
      <Icon className={`h-6 w-6 mb-1.5 ${getScoreColor(score)}`} />
      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
      <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
    </div>
  );
}

function FacilityItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

const SmartPropertyInsights = ({ property }: SmartPropertyInsightsProps) => {
  const { data: facilities, isLoading } = useQuery({
    queryKey: ['nearby-facilities', property.location],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('nearby-facilities', {
        body: { location: property.location },
      });
      if (error) throw error;
      return data as FacilityData;
    },
    staleTime: 1000 * 60 * 30, // 30 min cache
    retry: 1,
  });

  const ecoScore = calculateEcoScore(property);
  const areaScore = facilities ? calculateAreaScore(facilities) : null;
  const finalScore = areaScore !== null
    ? Math.round(((ecoScore * 0.4) + (areaScore * 0.6)) * 10) / 10
    : null;

  return (
    <div className="bg-background rounded-2xl p-6 shadow-card">
      <h3 className="text-xl font-semibold mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Smart Property Insights
      </h3>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <ScoreCard label="Eco Score" score={ecoScore} icon={Leaf} />
        {isLoading ? (
          <>
            <div className="flex flex-col items-center p-4 rounded-xl border bg-muted/30">
              <Skeleton className="h-6 w-6 mb-1.5 rounded-full" />
              <Skeleton className="h-7 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl border bg-muted/30">
              <Skeleton className="h-6 w-6 mb-1.5 rounded-full" />
              <Skeleton className="h-7 w-10 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </>
        ) : (
          <>
            <ScoreCard label="Area Score" score={areaScore ?? 0} icon={BarChart3} />
            <ScoreCard label="Final Score" score={finalScore ?? 0} icon={Award} />
          </>
        )}
      </div>

      {/* Nearby Facilities */}
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Nearby Facilities (3 km radius)
      </h4>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : facilities ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <FacilityItem
            icon={Train}
            label="Nearest Metro"
            value={facilities.metro_distance_km !== null ? `${facilities.metro_distance_km} km away` : 'No metro found within 10 km'}
          />
          <FacilityItem
            icon={School}
            label="Schools"
            value={`${facilities.schools_nearby} found nearby`}
          />
          <FacilityItem
            icon={Hospital}
            label="Hospitals & Clinics"
            value={`${facilities.hospitals_nearby} found nearby`}
          />
          <FacilityItem
            icon={ShoppingCart}
            label="Supermarkets & Malls"
            value={`${facilities.supermarkets_nearby} found nearby`}
          />
          <FacilityItem
            icon={GraduationCap}
            label="Colleges & Universities"
            value={`${facilities.colleges_nearby} found nearby`}
          />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Could not load nearby facility data for this location.</p>
      )}

      {/* Score Insight */}
      {finalScore !== null && (
        <p className="mt-4 text-sm text-muted-foreground italic border-t pt-3">
          {finalScore >= 8
            ? '🌟 Excellent property — strong eco features and great area connectivity.'
            : finalScore >= 5
            ? '👍 Good property — decent sustainability and area infrastructure.'
            : '📋 This property has room for improvement in sustainability and connectivity.'}
        </p>
      )}
    </div>
  );
};

export default SmartPropertyInsights;
