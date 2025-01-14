<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Models\User;

class MohammadController extends Controller
{
    //
    //api/mohammad/user/id/reviews
    function mohammad ($userId) {
        try{
            $mohammad = User::findOrFail($userId);

            $reviews = $mohammad->reviews()->get();

            return response()->json($reviews, 200);
        }
        catch(QueryException $e){
            throw new HttpException(500, $e->getMessage());
        }
    }
}
