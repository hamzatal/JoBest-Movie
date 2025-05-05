<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if ($request->header('X-Inertia')) {
            // For Inertia requests, return a redirect that Inertia can handle
            if ($request->is('admin/*') || $request->routeIs('admin.*')) {
                return route('admin.login');
            }
            return route('login');
        }

        if (!$request->expectsJson()) {
            if ($request->is('admin/*') || $request->routeIs('admin.*')) {
                return route('admin.login');
            }
            return route('login');
        }

        return null; // Let Laravel handle JSON responses
    }

    protected function unauthenticated($request, array $guards)
    {
        if ($request->header('X-Inertia')) {
            // Return a 409 Conflict with a redirect location for Inertia
            abort(redirect()->route($request->is('admin/*') || $request->routeIs('admin.*') ? 'admin.login' : 'login'));
        }

        parent::unauthenticated($request, $guards);
    }
}
