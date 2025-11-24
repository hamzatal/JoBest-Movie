<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\WatchedMoviesController;
use App\Http\Controllers\SubscriptionController;

/*
|----------------------------------------------------------------------
| API Routes
|----------------------------------------------------------------------
*/

// User Authentication
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ChatBot Routes
Route::post('/chatbot', [ChatBotController::class, 'chatbot']);

// Categories Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
});

// Contacts Routes
Route::prefix('contacts')->group(function () {
    Route::get('/', [ContactController::class, 'index']);
    Route::post('/', [ContactController::class, 'store']);
    Route::get('/{contact}', [ContactController::class, 'show']);
    Route::delete('/{contact}', [ContactController::class, 'destroy']);
});

// Movies Routes
Route::prefix('movies')->group(function () {
    Route::get('/', [MovieController::class, 'index']);
    Route::post('/', [MovieController::class, 'store']);
    Route::put('/{movie}', [MovieController::class, 'update']);
    Route::delete('/{movie}', [MovieController::class, 'destroy']);
    
    // Special movie endpoints
    Route::get('/featured', [MovieController::class, 'featured']);
    Route::get('/trending', [MovieController::class, 'trending']);
    Route::get('/random', [MovieController::class, 'random']);
    Route::get('/genre/{genre}', [MovieController::class, 'byGenre']);
    Route::get('/search/{query}', [MovieController::class, 'search']);
    Route::get('/chatgpt-recommendations/{userId}', [MovieController::class, 'chatGptRecommendations']);
});

Route::get('movie', [MovieController::class, 'show']); // Kept outside prefix to maintain original path

// Favorite Routes
Route::prefix('favorites')->group(function () {
    Route::get('/', [FavoriteController::class, 'index']);
    Route::post('/{movieId}', [FavoriteController::class, 'store']);
    Route::delete('/{movieId}', [FavoriteController::class, 'destroy']);
});

// Reviews Routes
Route::prefix('reviews')->group(function () {
    Route::get('/', [ReviewController::class, 'index']);
    Route::get('/create', [ReviewController::class, 'create']);
    Route::post('/{movieId}', [ReviewController::class, 'store']);
    Route::get('/{reviewId}/edit', [ReviewController::class, 'edit']);
    Route::delete('/{movieId}/{reviewId}', [ReviewController::class, 'destroy']);
});

// Watched Movies Routes
Route::prefix('watched-movies')->group(function () {
    Route::get('/', [WatchedMoviesController::class, 'index']);
    Route::post('/', [WatchedMoviesController::class, 'store']);
});

// Users Routes
Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('/{user}', [UserController::class, 'show']);
    Route::delete('/{user}', [UserController::class, 'destroy']);
});

// Subscription Routes
Route::get('/subscriptions/revenue', [SubscriptionController::class, 'getTotalRevenue']);