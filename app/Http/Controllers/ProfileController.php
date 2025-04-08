<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\PasswordUpdateRequest;
use App\Http\Requests\DeactivateAccountRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        // Update last login timestamp
        if (!session()->has('login_tracked')) {
            $user->last_login = Carbon::now();
            $user->save();
            session(['login_tracked' => true]);
        }
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio,
                'phone' => $user->phone,
                'location' => $user->location,
                'website' => $user->website,
                'birthday' => $user->birthday,
                'avatar' => $user->avatar ? Storage::url($user->avatar) : null,
                'created_at' => $user->created_at,
                'last_login' => $user->last_login,
                'is_active' => $user->is_active,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Update the user's profile data
        $user->fill($request->validated());

        // Handle email verification if the email is changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete the old avatar if it exists
            if ($user->avatar && Storage::exists($user->avatar)) {
                Storage::delete($user->avatar);
            }

            // Store the new avatar
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }

        // Save the updated user data
        $user->save();

        return Redirect::route('profile.edit')->with('status', 'Profile updated successfully.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return Redirect::route('profile.edit', ['tab' => 'security'])->with('status', 'Password updated successfully.');
    }

    /**
     * Deactivate the user's account (soft delete).
     */
    public function deactivate(DeactivateAccountRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        // Store deactivation reason if provided
        if ($request->deactivation_reason) {
            $user->deactivation_reason = $request->deactivation_reason;
        }
        
        // Mark account as inactive
        $user->is_active = false;
        $user->deactivated_at = Carbon::now();
        $user->save();
        
        // Logout
        Auth::logout();
        
        // Invalidate the session and regenerate the token
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return Redirect::to('/')->with('status', 'Your account has been deactivated.');
    }
    
    /**
     * Reactivate a deactivated user account.
     */
    public function reactivate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        
        // Find the deactivated user
        $user = \App\Models\User::where('email', $credentials['email'])
            ->where('is_active', false)
            ->first();
            
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records or the account is not deactivated.',
            ]);
        }
        
        // Reactivate the account
        $user->is_active = true;
        $user->deactivated_at = null;
        $user->deactivation_reason = null;
        $user->save();
        
        // Log the user in
        Auth::login($user);
        
        return Redirect::intended('/dashboard')->with('status', 'Your account has been reactivated.');
    }
}