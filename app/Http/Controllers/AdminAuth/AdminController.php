<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function getUsers(Request $request)
    {
        $query = User::select('id', 'name', 'email', 'is_active', 'created_at')
            ->orderBy('created_at', 'desc');

        // Handle search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Handle status filter
        if ($request->has('status') && $request->status) {
            $status = $request->status === 'active' ? 1 : 0;
            $query->where('is_active', $status);
        }

        $users = $query->paginate(10);

       

        return Inertia::render('Admin/UsersView', [
            'users' => $users,
        ]);
    }

    public function toggleUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active; // Toggle status
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "User {$user->name} has been {$status}.");
    }

    public function showContacts()
    {
        $messages = Contact::select('id', 'name', 'email', 'subject', 'message', 'is_read', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/ContactsView', [
            'messages' => $messages,
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->is_read = true;
        $contact->save();

        return redirect()->back()->with('success', 'Message marked as read.');
    }

    public function getAdminProfile()
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return redirect()->route('admin.login')->with('error', 'Unauthenticated');
        }

        $avatarUrl = $admin->avatar ? Storage::url($admin->avatar) : null;

        return Inertia::render('Admin/Profile', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'avatar' => $avatarUrl,
                'last_login' => $admin->last_login,
            ],
        ]);
    }

    public function updateAdminProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            return redirect()->route('admin.login')->with('error', 'Unauthenticated');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:admins,email,' . $admin->id,
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8',
            'avatar' => 'nullable|image|max:2048',
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];

        if ($request->currentPassword && $request->newPassword) {
            if (!Hash::check($request->currentPassword, $admin->password)) {
                return back()->withErrors(['currentPassword' => 'Current password is incorrect']);
            }
            $admin->password = Hash::make($validated['newPassword']);
        }

        if ($request->hasFile('avatar')) {
            if ($admin->avatar) {
                Storage::disk('public')->delete($admin->avatar);
            }
            $path = $request->file('avatar')->store('admin_images', 'public');
            $admin->avatar = $path;
        }

        $admin->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
