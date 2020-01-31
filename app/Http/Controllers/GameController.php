<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function store(Request $request)
    {
        $user_agent = $request->header('User-Agent');

        $browser = Game::get_browser($user_agent);

        $os = Game::get_os($user_agent);

            Game::create([
               "ip"=>$request->ip(),
                "os"=>$os,
                "browser"=>$browser,
                "player1"=>json_encode($request->player1),
                "player2"=>json_encode($request->player2),
                "game_fields"=>json_encode($request->board),
                "duration"=>$request->gameTime,
                "winner"=>$request->winner
            ]);

            return "upisano";
    }

    public function show()
    {
        $games = Game::orderBy('created_at','desc')->get();

        return $games;
    }

}
