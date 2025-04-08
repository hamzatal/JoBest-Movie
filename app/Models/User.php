<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'phone',
        'location',
        'website',
        'birthday',
        'avatar',
        
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}





// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Foundation\Auth\User as Authenticatable;
// use Illuminate\Notifications\Notifiable;
// use Laravel\Sanctum\HasApiTokens;
// use Illuminate\Contracts\Auth\MustVerifyEmail;

// class User extends Authenticatable implements MustVerifyEmail
// {
//     use HasApiTokens, HasFactory, Notifiable;

//     /**
//      * The attributes that are mass assignable.
//      *
//      * @var array<int, string>
//      */
//     protected $fillable = [
//         'name',
//         'email',
//         'password',
//         'bio',
//         'phone',
//         'location',
//         'website',
//         'birthday',
//         'avatar',
//         'is_active',
//         'deactivated_at',
//         'deactivation_reason',
//         'last_login',
//     ];

//     /**
//      * The attributes that should be hidden for serialization.
//      *
//      * @var array<int, string>
//      */
//     protected $hidden = [
//         'password',
//         'remember_token',
//     ];

//     /**
//      * The attributes that should be cast.
//      *
//      * @var array<string, string>
//      */
//     protected $casts = [
//         // 'email_verified_at' => 'datetime',
//         'last_login' => 'datetime',
//         'deactivated_at' => 'datetime',
//         'birthday' => 'date',
//         'is_active' => 'boolean',
//     ];

//     /**
//      * Get all of the user's reviews.
//      */
//     public function reviews()
//     {
//         return $this->hasMany(Review::class);
//     }

//     /**
//      * Get all of the user's favorites.
//      */
//     public function favorites()
//     {
//         return $this->hasMany(Favorite::class);
//     }

//     /**
//      * Determine if the account is active.
//      * 
//      * @return bool
//      */
//     public function isActive()
//     {
//         return $this->is_active;
//     }

//     /**
//      * Deactivate the user account.
//      * 
//      * @param string|null $reason
//      * @return void
//      */
//     public function deactivate($reason = null)
//     {
//         $this->is_active = false;
//         $this->deactivated_at = now();
//         $this->deactivation_reason = $reason;
//         $this->save();
//     }

//     /**
//      * Reactivate the user account.
//      * 
//      * @return void
//      */
//     public function reactivate()
//     {
//         $this->is_active = true;
//         $this->deactivated_at = null;
//         $this->deactivation_reason = null;
//         $this->save();
//     }

//     /**
//      * Get the time since the user was registered.
//      * 
//      * @return string
//      */
//     public function memberSince()
//     {
//         return $this->created_at->diffForHumans();
//     }

//     /**
//      * Check if user has a profile picture.
//      * 
//      * @return bool
//      */
//     public function hasProfilePicture()
//     {
//         return !is_null($this->avatar);
//     }
// }