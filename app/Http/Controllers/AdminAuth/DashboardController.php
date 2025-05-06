<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
    {
        $admin = Auth::guard('admin')->user();

        $stats = [
            'users' => User::count(),
            'deactivated_users' => User::where('is_active', 0)->count(),
            'messages' => Contact::count(),
            'unread_messages' => Contact::where('is_read', 0)->count(),
        ];

        $latestUsers = User::select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $latestMessages = Contact::select('id', 'name', 'email', 'message', 'is_read', 'created_at')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'avatar' => $admin->image ? Storage::url($admin->image) : null,
            ],
            'stats' => $stats,
            'latest_users' => $latestUsers,
            'latest_messages' => $latestMessages,
        ]);
    }
}
