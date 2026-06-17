import { RecommendationScore, TripRequest } from '../../src/types';
import { getLocalDiscoveryData } from './travelData';

/**
 * Intelligent Algorithmic Personalization Recommendation Engine
 */
export function generatePersonalizedRecommendations(req: TripRequest): RecommendationScore[] {
  const rawDiscoveries = getLocalDiscoveryData(req.destinationCity, req.destinationCountry);
  
  return rawDiscoveries.map(item => {
    let scoreMultiplier = 1.0;
    let customReason = item.reason;

    // Apply Traveler Profile factors
    if (req.ageGroup === 'family' && item.place.toLowerCase().includes('pub')) {
      scoreMultiplier *= 0.8;
      customReason += ` (Adjusted: Less optimal for children, but boasts great food walks).`;
    } else if (req.ageGroup === 'family' && item.place.toLowerCase().includes('park')) {
      scoreMultiplier *= 1.25;
      customReason = `Perfect for multi-generational walks with comfortable benches and stroller accessibility.`;
    }

    // Apply style factors
    if (req.travelStyle === 'relaxed' && item.place.toLowerCase().includes('climb')) {
      scoreMultiplier *= 0.7;
    } else if (req.travelStyle === 'active' && item.place.toLowerCase().includes('climb')) {
      scoreMultiplier *= 1.30;
      customReason = `An excellent target for high-energy explorers wanting outstanding aerial photography positions.`;
    }

    // Apply Budget factors
    if (req.budget === 'luxury' && item.price_level === '$') {
      customReason += ` (Exceptional budget find: provides high-quality authentic contrast to premium dining options).`;
    } else if (req.budget === 'economy' && item.price_level === '$$$') {
      scoreMultiplier *= 0.75;
      customReason += ` (Note: High ticket value, best reserved for a special celebration night).`;
    }

    // Apply specific interest matches
    req.interests.forEach(interest => {
      const match = interest.toLowerCase();
      if (item.place.toLowerCase().includes(match) || item.reason.toLowerCase().includes(match)) {
        scoreMultiplier *= 1.25;
        customReason = `Direct Interest Match: Fits your specific curiosity on "${interest}" spectacularly. ${customReason}`;
      }
    });

    const finalScore = Math.min(99, Math.max(60, Math.round(item.score * scoreMultiplier)));

    return {
      ...item,
      score: finalScore,
      reason: customReason
    };
  }).sort((a, b) => b.score - a.score);
}
