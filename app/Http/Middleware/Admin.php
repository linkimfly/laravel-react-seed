<?php

namespace App\Http\Middleware;

use Closure;
use Auth;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
		$permit_level_arr = ['dev', 'admin'];
		if (!in_array(Auth::user()->level, $permit_level_arr)) {
            return redirect('/');
        }
        return $next($request);
    }
}
