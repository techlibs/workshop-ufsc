import {
  getMoviesByMood,
  getPopularMovies,
  movieAgent,
  searchMovies,
} from "../../../src/mastra/domains/movie";

// Test the real movie data integration
async function testRealMovieData() {
  console.log("🎬 Testing Real Movie Data Integration\n");

  // Test 1: Search for a specific movie
  console.log("Test 1: Searching for 'Dune'...");
  try {
    const searchResults = await searchMovies("Dune");
    console.log(`Found ${searchResults.length} results`);
    if (searchResults.length > 0) {
      console.log("First result:", {
        title: searchResults[0].title,
        year: searchResults[0].year,
        rating: searchResults[0].rating,
        providers: searchResults[0].providers.map((p) => p.name).join(", "),
      });
    }
  } catch (error) {
    console.error("Search test failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Get popular movies
  console.log("Test 2: Getting popular movies...");
  try {
    const popularMovies = await getPopularMovies(5);
    console.log(`Found ${popularMovies.length} popular movies:`);
    popularMovies.forEach((movie, index) => {
      console.log(
        `${index + 1}. ${movie.title} (${movie.year}) - Rating: ${movie.rating}`
      );
    });
  } catch (error) {
    console.error("Popular movies test failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Get movies by mood
  console.log("Test 3: Getting movies for 'adventurous' mood...");
  try {
    const moodMovies = await getMoviesByMood(["adventurous"]);
    console.log(`Found ${moodMovies.length} adventurous movies`);
    if (moodMovies.length > 0) {
      console.log(
        "First few:",
        moodMovies
          .slice(0, 3)
          .map((m) => m.title)
          .join(", ")
      );
    }
  } catch (error) {
    console.error("Mood movies test failed:", error);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Test the movie agent
  console.log("Test 4: Testing movie agent...");
  try {
    const response = await movieAgent.generate(
      "What are the best action movies available on Netflix right now?",
      {
        runtimeContext: new Map([["userId", "test-user"]]),
      }
    );
    console.log("Agent response:", response.text);
  } catch (error) {
    console.error("Agent test failed:", error);
  }
}

// Run the tests
console.log("Note: Make sure you have set TMDB_API_KEY in your .env file!\n");
testRealMovieData().catch(console.error);
