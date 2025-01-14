<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show()
    {
        $admin = Auth::guard('admin')->user();
        return response()->json($admin->only(['name', 'email']));
    }

    public function update(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'currentPassword' => 'required_with:newPassword',
            'newPassword' => 'nullable|min:12|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/',
            'newPassword_confirmation' => 'required_with:newPassword|same:newPassword'
        ]);

        if ($request->filled('currentPassword') && !Hash::check($request->currentPassword, $admin->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email']
        ];

        if ($request->filled('newPassword')) {
            $updateData['password'] = Hash::make($validated['newPassword']);
        }

        $admin->update($updateData);

        return response()->json(['message' => 'Profile updated successfully']);
    }
}