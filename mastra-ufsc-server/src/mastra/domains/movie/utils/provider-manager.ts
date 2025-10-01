import { Movie, Provider } from "./movie-data";

export interface UserPreferences {
  userId: string;
  providers: Provider["name"][];
  preferredGenres: string[];
  dislikedGenres: string[];
  preferredLanguages: string[];
  watchHistory: string[]; // movie IDs
  ratings: Record<string, number>; // movieId -> rating
  lastUpdated: Date;
}

// In-memory storage for user preferences (in production, use database)
const userPreferences = new Map<string, UserPreferences>();

export class ProviderManager {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  private getPreferences(): UserPreferences {
    if (!userPreferences.has(this.userId)) {
      userPreferences.set(this.userId, {
        userId: this.userId,
        providers: ["Netflix", "Apple TV", "HBO Max", "Stremio"], // Default all providers
        preferredGenres: [],
        dislikedGenres: [],
        preferredLanguages: ["Portuguese", "English"],
        watchHistory: [],
        ratings: {},
        lastUpdated: new Date(),
      });
    }
    return userPreferences.get(this.userId)!;
  }

  private savePreferences(prefs: UserPreferences): void {
    prefs.lastUpdated = new Date();
    userPreferences.set(this.userId, prefs);
  }

  setProviders(providers: Provider["name"][]): void {
    const prefs = this.getPreferences();
    prefs.providers = providers;
    this.savePreferences(prefs);
  }

  getProviders(): Provider["name"][] {
    return this.getPreferences().providers;
  }

  addToWatchHistory(movieId: string): void {
    const prefs = this.getPreferences();
    if (!prefs.watchHistory.includes(movieId)) {
      prefs.watchHistory.push(movieId);
      this.savePreferences(prefs);
    }
  }

  rateMovie(movieId: string, rating: number): void {
    const prefs = this.getPreferences();
    prefs.ratings[movieId] = rating;
    this.savePreferences(prefs);
  }

  updateGenrePreferences(liked: string[], disliked: string[]): void {
    const prefs = this.getPreferences();

    // Add liked genres if not already present
    liked.forEach((genre) => {
      if (!prefs.preferredGenres.includes(genre)) {
        prefs.preferredGenres.push(genre);
      }
      // Remove from disliked if it was there
      const dislikedIndex = prefs.dislikedGenres.indexOf(genre);
      if (dislikedIndex > -1) {
        prefs.dislikedGenres.splice(dislikedIndex, 1);
      }
    });

    // Add disliked genres if not already present
    disliked.forEach((genre) => {
      if (!prefs.dislikedGenres.includes(genre)) {
        prefs.dislikedGenres.push(genre);
      }
      // Remove from liked if it was there
      const likedIndex = prefs.preferredGenres.indexOf(genre);
      if (likedIndex > -1) {
        prefs.preferredGenres.splice(likedIndex, 1);
      }
    });

    this.savePreferences(prefs);
  }

  filterMoviesByUserProviders(movies: Movie[]): Movie[] {
    const userProviders = this.getProviders();

    return movies.filter((movie) =>
      movie.providers.some(
        (provider) =>
          userProviders.includes(provider.name) && provider.type === "stream"
      )
    );
  }

  getPersonalizedScore(movie: Movie): number {
    const prefs = this.getPreferences();
    let score = movie.rating * 10; // Base score from rating

    // Boost for preferred genres
    const preferredGenreBoost =
      movie.genres.filter((g) => prefs.preferredGenres.includes(g)).length * 5;

    // Penalty for disliked genres
    const dislikedGenrePenalty =
      movie.genres.filter((g) => prefs.dislikedGenres.includes(g)).length * 10;

    // Boost for highly rated similar movies
    const similarMoviesBoost =
      Object.entries(prefs.ratings).filter(([_, rating]) => rating >= 4)
        .length > 0
        ? 5
        : 0;

    // Apply popularity factor
    score += movie.popularity / 10;

    // Apply boosts and penalties
    score += preferredGenreBoost;
    score -= dislikedGenrePenalty;
    score += similarMoviesBoost;

    // Ensure score is between 0 and 100
    return Math.max(0, Math.min(100, score));
  }

  getRecommendationInsights(): string {
    const prefs = this.getPreferences();
    const insights: string[] = [];

    if (prefs.preferredGenres.length > 0) {
      insights.push(
        `You seem to enjoy ${prefs.preferredGenres.slice(0, 3).join(", ")} content`
      );
    }

    if (prefs.watchHistory.length > 5) {
      insights.push(
        `Based on your watch history of ${prefs.watchHistory.length} titles`
      );
    }

    if (prefs.providers.length < 4) {
      insights.push(`Showing content from ${prefs.providers.join(", ")}`);
    }

    return insights.join(". ");
  }
}

// Provider information
export const providerInfo = {
  Netflix: {
    description: "Wide variety of movies, series, and originals",
    monthlyPrice: 39.9,
    features: ["4K content", "Multiple profiles", "Download for offline"],
  },
  "Apple TV": {
    description: "Premium content with rental and purchase options",
    monthlyPrice: 14.9,
    features: ["4K HDR", "Family sharing", "Apple originals"],
  },
  "HBO Max": {
    description: "Premium HBO content and Warner Bros movies",
    monthlyPrice: 34.9,
    features: ["Same-day premieres", "HBO originals", "4K content"],
  },
  Stremio: {
    description: "Free streaming aggregator with various sources",
    monthlyPrice: 0,
    features: ["Multiple sources", "Torrent support", "Add-ons"],
  },
};

export function formatProviderOptions(movie: Movie): string {
  const streamingOptions = movie.providers.filter((p) => p.type === "stream");
  const rentOptions = movie.providers.filter((p) => p.type === "rent");
  const buyOptions = movie.providers.filter((p) => p.type === "buy");

  let formatted = "";

  if (streamingOptions.length > 0) {
    formatted += `**Stream on:** ${streamingOptions.map((p) => `${p.name} (${p.quality})`).join(", ")}\n`;
  }

  if (rentOptions.length > 0) {
    formatted += `**Rent:** ${rentOptions.map((p) => `${p.name} - R$${p.price?.toFixed(2)} (${p.quality})`).join(", ")}\n`;
  }

  if (buyOptions.length > 0) {
    formatted += `**Buy:** ${buyOptions.map((p) => `${p.name} - R$${p.price?.toFixed(2)} (${p.quality})`).join(", ")}\n`;
  }

  return formatted;
}


