<?php
use App\Http\Controllers\AdminAuth\ProfileController;
use App\Http\Controllers\AdminAuth\LoginController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
// use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MovieController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ChatBotController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// Route::get('movies/chatgpt-recommendations', [MovieController::class, 'chatGptRecommendations']);

// Route::get('/chatbot', [ChatBotController::class, 'index']); // Renders the chatbot page
// Route::post('/chatbot', [ChatBotController::class, 'chatbot']); // Handles chat messages



Route::get('/PaymentSuccess', function () {
    return Inertia::render('PaymentSuccess');
})->name('PaymentSuccess');

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

Route::get('/Watchlist', function () {
    return Inertia::render('Watchlist');
})->name('Watchlist');
Route::get('/Mohammad', function () {
    return Inertia::render('Mohammad');
})->name('Mohammad');
Route::get('/home', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/ContactPage', function () {
    return Inertia::render('ContactPage');
})->name('ContactPage');

Route::get('/SubscriptionPage', function () {
    return Inertia::render('SubscriptionPage');
})->name('SubscriptionPage');

// Route::get('/UserProfile/{user?}', function (Request $request) {
//     return Inertia::render('UserProfile', [
//         'user' => $request->user() // Pass the authenticated user by default
//     ])->name('UserProfile');
// })->middleware(['auth', 'verified']);

Route::get('/UserProfile', function () {
    return Inertia::render('UserProfile', [
        'user' => Auth::user(), 
    ]);
})->name('UserProfile')->middleware(['auth', 'verified']);

// Route::prefix('admin')->name('admin.')->group(function () {
//     // Guest routes
//     Route::middleware('guest:admin')->group(function () {
//         Route::get('login', [AuthController::class, 'showLogin'])->name('login');
//         Route::post('login', [AuthController::class, 'login'])->name('login.post');
//     });

//     // Protected admin routes
//     Route::middleware('auth:admin')->group(function () {
//         Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
//         Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        
//         // Movies CRUD
//         Route::resource('movies', MovieController::class);
//         Route::post('movies/{movie}/toggle-featured', [MovieController::class, 'toggleFeatured'])
//             ->name('movies.toggle-featured');
            
//         // Categories CRUD
//         Route::resource('categories', CategoryController::class);
        
//         // Reviews management
//         Route::resource('reviews', ReviewController::class)->except(['create', 'store']);
        
//         // Contact messages
//         Route::resource('contacts', ContactController::class)->except(['create', 'store']);
        
//         // User management
//         Route::resource('users', UserController::class)->except(['create', 'store']);
        
//         // Dashboard stats
//         Route::get('stats', [DashboardController::class, 'getStats'])->name('stats');
//     });
// });

Route::middleware('guest:admin')->group(function () {
    Route::get('admin/login', [LoginController::class, 'create'])->name('admin.login');
    Route::post('admin/login', [LoginController::class, 'store']);
});

Route::middleware('auth:admin')->group(function () {
    Route::post('admin/logout', [LoginController::class, 'destroy'])->name('admin.logout');
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');
});

Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/profile', [ProfileController::class, 'show']);
    Route::put('/admin/profile', [ProfileController::class, 'update']);
});

Route::middleware(['auth', 'csrf'])->group(function () {
    Route::apiResource('movies', MovieController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('users', UserController::class);
});

require __DIR__ . '/auth.php';
