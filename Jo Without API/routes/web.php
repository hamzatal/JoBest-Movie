<?php
use App\Http\Controllers\AdminAuth\ProfileController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\MovieController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;

// Public routes - no authentication required
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/about-us', function () {
    return Inertia::render('about-us');
})->name('about-us');

Route::get('/contact-us', function () {
    return Inertia::render('contact-us');
})->name('contact-us');

Route::get('/ContactPage', function () {
    return Inertia::render('ContactPage');
})->name('ContactPage');

Route::get('/PaymentSuccess', function () {
    return Inertia::render('PaymentSuccess');
})->name('PaymentSuccess');

Route::get('/SubscriptionPage', function () {
    return Inertia::render('SubscriptionPage');
})->name('SubscriptionPage');

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/home', function () {
        return Inertia::render('Home');
    })->name('home');
    
    Route::get('/Watchlist', function () {
        return Inertia::render('Watchlist');
    })->name('Watchlist');
    
    Route::get('/UserProfile', function () {
        return Inertia::render('UserProfile', [
            'user' => Auth::user(), 
        ]);
    })->name('UserProfile');
});

// User profile management routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin auth routes
Route::middleware('guest:admin')->group(function () {
    Route::get('admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('admin/login', [LoginController::class, 'store']);
});

// Admin authenticated routes
Route::middleware('auth:admin')->group(function () {
    Route::post('admin/logout', [LoginController::class, 'destroy'])->name('admin.logout');
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
    
    // Admin profile routes
    Route::get('/admin/profile', [ProfileController::class, 'show']);
    Route::put('/admin/profile', [ProfileController::class, 'update']);
});

// API routes with auth and CSRF
Route::middleware(['auth', 'csrf'])->group(function () {
    Route::apiResource('movies', MovieController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('users', UserController::class);
});

require __DIR__ . '/auth.php';