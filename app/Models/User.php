<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'phone',
        'avatar',
        'is_active',
        'deactivated_at',
        'deactivation_reason',
        'last_login',
    ];

    /**
     * Check if the user account is active.
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->is_active;
    }

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
        'deactivated_at' => 'datetime',
        'birthday' => 'date',
        'is_active' => 'boolean',
    ];

}
