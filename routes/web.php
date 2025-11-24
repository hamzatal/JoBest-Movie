<?php

use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\AdminAuth\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminAuth\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

//! ==================== MOVIE PLAYER ROUTE (UPDATED) ====================

Route::get('/watch/{tmdbId}', function ($tmdbId) {
    $apiKey = env('TMDB_API_KEY');
    $response = Http::get("https://api.themoviedb.org/3/movie/{$tmdbId}", [
        'api_key' => $apiKey,
        'language' => 'en-US',
    ]);
    $movieData = $response->json();
    $movieTitle = $movieData['title'] ?? 'Unknown Movie';
    return Inertia::render('MoviePlayer', [
        'tmdbId' => $tmdbId,
        'movieTitle' => $movieTitle,
    ]);
})->where('tmdbId', '[0-9]+')->name('movie.watch');

//! ==================== MAIN PUBLIC ROUTES ====================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

//! ==================== STATIC CONTENT PAGES ====================
Route::get('/about-us', fn() => Inertia::render('about-us'))->name('about-us');
Route::get('/ContactPage', fn() => Inertia::render('ContactPage'))->name('ContactPage');

//! ==================== PAYMENT AND SUBSCRIPTION ROUTES ====================
Route::get('/PaymentSuccess', fn() => Inertia::render('PaymentSuccess'))->name('PaymentSuccess');
Route::get('/SubscriptionPage', fn() => Inertia::render('SubscriptionPage'))->name('SubscriptionPage');
Route::post('/process-payment', 'PaymentController@processPayment')->name('process.payment');
Route::get('/payment-callback', 'PaymentController@handleCallback')->name('payment.callback');

//! ==================== INCLUDE AUTHENTICATION ROUTES ====================
require __DIR__ . '/auth.php';

//! ==================== AUTHENTICATED USER ROUTES ====================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', fn() => Inertia::render('Home'))->name('home');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::delete('/profile', [ProfileController::class, 'deactivate'])->name('profile.deactivate');
    Route::post('/profile/reactivate', [ProfileController::class, 'reactivate'])->name('profile.reactivate');

    Route::get('/UserProfile', fn() => Inertia::render('UserProfile', ['user' => Auth::user()]))->name('UserProfile');

    Route::get('/Watchlist', fn() => Inertia::render('Watchlist'))->name('Watchlist');
    Route::post('/watchlist/add/{movie}', 'WatchlistController@add')->name('watchlist.add');
    Route::delete('/watchlist/remove/{movie}', 'WatchlistController@remove')->name('watchlist.remove');
    Route::get('/watchlist/items', 'WatchlistController@getItems')->name('watchlist.items');
});

//! ==================== ADMIN AUTHENTICATION ROUTES ====================
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [LoginController::class, 'create'])->name('login');
        Route::post('login', [LoginController::class, 'store']);
    });

    Route::middleware('auth:admin')->group(function () {
        Route::post('logout', [LoginController::class, 'destroy'])->name('logout');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        //? Admin Profile
        Route::get('profile', [AdminController::class, 'getAdminProfile'])->name('profile');
        Route::put('profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update');
        Route::post('profile', [AdminController::class, 'updateAdminProfile'])->name('profile.update.post');

        //? Contact Messages
        Route::get('messages', [AdminController::class, 'showContacts'])->name('messages');
        Route::get('contacts', [AdminController::class, 'showContacts'])->name('contacts');
        Route::patch('messages/{id}/read', [AdminController::class, 'markAsRead'])->name('messages.read');

        //? Users Management
        Route::get('users', [AdminController::class, 'getUsers'])->name('users');
        Route::post('users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus'])->name('users.toggle-status');
    });
});

//! ==================== FALLBACK ROUTE ====================
Route::fallback(fn() => Inertia::render('Errors/404'));
Route::get('/404', fn() => Inertia::render('Errors/404'))->name('404');
