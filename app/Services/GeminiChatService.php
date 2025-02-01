<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\DB;

class GeminiChatService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('GEMINI_API_KEY');
    }

    /**
     * Retrieve movie details from the database
     *
     * @param int $movieId
     * @return array|string
     */
    public function getMovieDetails($movieId)
    {
        $movie = DB::table('movies')->where('id', $movieId)->first();

        if ($movie) {
            return [
                'id' => $movie->id,
                'title' => $movie->title,
                'genre' => $movie->genre,
                'description' => $movie->description,
                'release_date' => $movie->release_date,
                'rating' => $movie->rating,
                'poster_url' => $movie->poster_url,
                'trailer_url' => $movie->trailer_url,
                'exists' => true
            ];
        }

        return ['exists' => false];
    }

    /**
     * Find similar movies based on genre or other criteria
     *
     * @param string $genre
     * @param int $excludeMovieId
     * @return array
     */
    public function findSimilarMovies($genre, $excludeMovieId)
    {
        return DB::table('movies')
            ->where('genre', $genre)
            ->where('id', '!=', $excludeMovieId)
            ->limit(3)
            ->get()
            ->map(function($movie) {
                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'genre' => $movie->genre,
                    'rating' => $movie->rating
                ];
            })
            ->toArray();
    }

    /**
     * Search for a movie and provide comprehensive response
     *
     * @param int $movieId
     * @return array
     */
    public function searchMovie($movieId)
    {
        $movieDetails = $this->getMovieDetails($movieId);

        if ($movieDetails['exists']) {
            $response = [
                'status' => 'found',
                'message' => 'Movie is available on our site!',
                'movie' => $movieDetails
            ];

            $similarMovies = $this->findSimilarMovies(
                $movieDetails['genre'],
                $movieDetails['id']
            );

            $response['similar_movies'] = $similarMovies;

            return $response;
        }

        try {
            $aiSuggestion = $this->askGemini(
                "Suggest a similar movie to the movie with ID $movieId. " .
                "Provide a brief description and why it might be interesting."
            );

            return [
                'status' => 'not_found',
                'message' => 'Unfortunately, this movie is not in our database.',
                'ai_suggestion' => $aiSuggestion
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'An error occurred while searching for the movie.',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Ask Google Gemini for a query
     *
     * @param string $message
     * @return string
     */
    public function askGemini($message)
    {
        try {
            $response = $this->client->post('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' . $this->apiKey, [
                'verify' => false,
                'json' => ['contents' => [['parts' => [['text' => $message]]]]],
                'headers' => ['Content-Type' => 'application/json'],
            ]);

            $responseBody = json_decode($response->getBody()->getContents(), true);
            return $responseBody['candidates'][0]['content']['parts'][0]['text'] ?? 'No response from Gemini API.';
        } catch (RequestException $e) {
            throw new \Exception('Error connecting to Gemini API: ' . $e->getMessage());
        }
    }
}
