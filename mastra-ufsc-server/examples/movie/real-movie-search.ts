// Example: Search for movies with real data from TMDB and JustWatch

import { searchMovies } from "../../src/mastra/domains/movie";

async function searchForMovie() {
  // Make sure you have TMDB_API_KEY in your .env file!

  console.log("🔍 Searching for movies about 'super hero' on Netflix...\n");

  const results = await searchMovies("super hero", {
    providers: ["Netflix"],
    minRating: 7.0,
    type: "movie",
  });

  console.log(`Found ${results.length} movies:\n`);

  results.slice(0, 5).forEach((movie, index) => {
    console.log(`${index + 1}. ${movie.title} (${movie.year})`);
    console.log(`   Rating: ${movie.rating}/10`);
    console.log(`   Genres: ${movie.genres.join(", ")}`);
    console.log(
      `   Available on: ${movie.providers.map((p) => p.name).join(", ")}`
    );
    console.log("");
  });
}

searchForMovie().catch(console.error);
