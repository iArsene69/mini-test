<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'profile_picture',
        'name',
        'email',
        'address',
        'dob',
        'position',
        'salary',
        'join_date',
    ];

    protected function profilePicture(): Attribute
    {
        return Attribute::make(
            get: fn($profile_picture) => asset('api/storage/' . $profile_picture),
        );
    }
}
