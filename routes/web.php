<?php

use App\Http\Controllers\AdminAuth\ProfileController as AdminProfileController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

//! MAIN PUBLIC ROUTES
//! These routes are accessible to all visitors without authentication

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

//! STATIC CONTENT PAGES
//! Company information and contact pages accessible to all users
Route::get('/about-us', function () {
    return Inertia::render('about-us');
})->name('about-us');

Route::get('/contact-us', function () {
    return Inertia::render('contact-us');
})->name('contact-us');

Route::get('/ContactPage', function () {
    return Inertia::render('ContactPage');
})->name('ContactPage');

//! PAYMENT AND SUBSCRIPTION ROUTES
//! Handling payment flows and subscription pages
Route::get('/PaymentSuccess', function () {
    return Inertia::render('PaymentSuccess');
})->name('PaymentSuccess');

Route::get('/SubscriptionPage', function () {
    return Inertia::render('SubscriptionPage');
})->name('SubscriptionPage');

//! PROCESS PAYMENTS
//! Routes for handling payment processing and callbacks
Route::post('/process-payment', 'PaymentController@processPayment')->name('process.payment');
Route::get('/payment-callback', 'PaymentController@handleCallback')->name('payment.callback');

//! INCLUDE AUTHENTICATION ROUTES
//! Includes routes from auth.php file for login, registration, password reset, etc.
require __DIR__ . '/auth.php';

//! AUTHENTICATED USER ROUTES
//! Routes that require user authentication and email verification
Route::middleware(['auth', 'verified'])->group(function () {
    //! USER DASHBOARD
    //! Main landing page after successful login
    Route::get('/home', function () {
        return Inertia::render('Home');
    })->name('home');

    //! USER PROFILE MANAGEMENT
    //! Routes for editing, updating, and deleting user profiles
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //! USER PROFILE PAGE
    //! Displays authenticated user data
    Route::get('/UserProfile', function () {
        return Inertia::render('UserProfile', [
            'user' => Auth::user(),
        ]);
    })->name('UserProfile');

    //! WATCHLIST FEATURE
    //! User's personal movie watchlist
    Route::get('/Watchlist', function () {
        return Inertia::render('Watchlist');
    })->name('Watchlist');
    
    //! WATCHLIST MANAGEMENT
    //! Routes for adding, removing, and managing watchlist items
    Route::post('/watchlist/add/{movie}', 'WatchlistController@add')->name('watchlist.add');
    Route::delete('/watchlist/remove/{movie}', 'WatchlistController@remove')->name('watchlist.remove');
    Route::get('/watchlist/items', 'WatchlistController@getItems')->name('watchlist.items');
    
    //! USER PREFERENCES
    //! Routes for managing user preferences and settings
    Route::get('/preferences', 'PreferenceController@edit')->name('preferences.edit');
    Route::patch('/preferences', 'PreferenceController@update')->name('preferences.update');
    
    //! CONTENT RECOMMENDATIONS
    //! Personalized movie recommendations for users
    Route::get('/recommendations', 'RecommendationController@index')->name('recommendations');
});

//! API ROUTES
//! Protected API routes for authenticated users
Route::middleware(['auth', 'csrf'])->group(function () {
    //! MOVIE MANAGEMENT API
    //! CRUD operations for movies
    Route::apiResource('movies', MovieController::class);
    
    //! CATEGORY MANAGEMENT API
    //! CRUD operations for categories
    Route::apiResource('categories', CategoryController::class);
    
    //! USER MANAGEMENT API
    //! CRUD operations for users
    Route::apiResource('users', UserController::class);
    
    //! SEARCH API
    //! Endpoints for searching movies and content
    Route::get('/search/movies', 'SearchController@movies')->name('search.movies');
    Route::get('/search/categories', 'SearchController@categories')->name('search.categories');
    
    //! RATING AND REVIEW API
    //! Endpoints for user ratings and reviews
    Route::post('/movies/{movie}/rate', 'RatingController@rate')->name('movies.rate');
    Route::post('/movies/{movie}/review', 'ReviewController@store')->name('movies.review');
    Route::get('/movies/{movie}/reviews', 'ReviewController@index')->name('movies.reviews');
});

//! CHATBOT API
//! Routes for interacting with the chatbot
Route::middleware(['auth'])->group(function() {
    Route::post('/chatbot/message', [ChatBotController::class, 'processMessage'])->name('chatbot.message');
    Route::get('/chatbot/history', [ChatBotController::class, 'getHistory'])->name('chatbot.history');
});

//! ADMIN AUTHENTICATION ROUTES
//! Routes for admin login (guest middleware)
Route::middleware('guest:admin')->group(function () {
    Route::get('admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('admin/login', [LoginController::class, 'store']);
});

//! ADMIN PROTECTED ROUTES
//! Routes requiring admin authentication
Route::middleware('auth:admin')->group(function () {
    //! ADMIN AUTHENTICATION
    //! Admin logout and dashboard access
    Route::post('admin/logout', [LoginController::class, 'destroy'])->name('admin.logout');
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    //! ADMIN PROFILE MANAGEMENT
    //! Routes for viewing and updating admin profiles
    Route::get('/admin/profile', [AdminProfileController::class, 'show']);
    Route::put('/admin/profile', [AdminProfileController::class, 'update']);
    
    //! CONTENT MANAGEMENT
    //! Admin routes for managing application content
    Route::get('/admin/movies', 'Admin\MovieController@index')->name('admin.movies');
    Route::get('/admin/categories', 'Admin\CategoryController@index')->name('admin.categories');
    
    //! USER MANAGEMENT
    //! Admin routes for managing users
    Route::get('/admin/users', 'Admin\UserController@index')->name('admin.users');
    Route::get('/admin/users/{user}', 'Admin\UserController@show')->name('admin.users.show');
    Route::put('/admin/users/{user}', 'Admin\UserController@update')->name('admin.users.update');
    
    //! ANALYTICS DASHBOARD
    //! Admin routes for viewing analytics
    Route::get('/admin/analytics', 'Admin\AnalyticsController@index')->name('admin.analytics');
    Route::get('/admin/analytics/users', 'Admin\AnalyticsController@users')->name('admin.analytics.users');
    Route::get('/admin/analytics/movies', 'Admin\AnalyticsController@movies')->name('admin.analytics.movies');
    
    //! SYSTEM SETTINGS
    //! Admin routes for configuring system settings
    Route::get('/admin/settings', 'Admin\SettingController@index')->name('admin.settings');
    Route::post('/admin/settings', 'Admin\SettingController@update')->name('admin.settings.update');
});

//! FALLBACK ROUTE
//! Catch-all route for handling 404 errors
Route::fallback(function () {
    return Inertia::render('Errors/404');
});
