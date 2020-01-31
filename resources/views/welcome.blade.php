<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Tic Tac Toe</title>

        <link rel="stylesheet" href="{{asset('assets/css/app.css')}}">

    </head>

    <body style="background: #eee;padding: 15px;">

    <div class="container">

        <div class="row">

            <div class="col-md-4 offset-md-2 wrapp game-board" id="board" style="text-align: center;">
                {{--    the name of the current player who is on the move    --}}
                <h3 class="tic-tac">Tic Tac Toe</h3>
                <h3 class="player" style="display: none;">Player <span></span></h3>

                {{--  game time   --}}
                <p class="time badge badge-secondary">00:00</p>
                {{--   BOARD      --}}
                <div class="row fields" style="padding: 15px;"></div>
                {{-- START BUTTON   --}}
                <button class="btn btn-primary" id="start">Start Game</button>
                {{--   REMATCH  --}}
                <div class="rematch-window" style="display: none;">
                    <p class="rematch-text">Igrac Marko je pobedio, zelite li da odigrate revans?</p>
                    <button class="btn btn-danger" id="rematch" >Rematch</button>

                </div>
{{--                <button class="btn btn-danger" id="restart">Restart</button>--}}
{{--                <button class="btn btn-danger" id="rematch" >Rematch</button>--}}

            </div>
            {{--   current player score   --}}
            <div class="col-md-4 offset-md-2 wrapp current-result">
                <h4>Rezultat <button id="all-result" class="float-right btn btn-primary btn-sm">Svi rezultatati</button></h4>
                <hr>
                <div class="clearfix text-center" id="currentScore" style="display: none;">
                    {{--    player 1   --}}
                    <div class="float-left "><span class="cp1 font-weight-bold"></span> <span class="cs1 badge badge-secondary">0</span></div>
                    {{--    player 12  --}}
                    <div class="float-right "> <span class="cs2 badge badge-secondary">0</span> <span class="cp2 font-weight-bold"></span> </div>


                </div>

                <div class="clearfix text-center" id="result">

                </div>

            </div>
            {{--  all scores  --}}
            <div class="col-md-6 offset-md-2 wrapp all-result" style="display: none;">
                <h4>Svi rezultati <button class="float-right btn btn-primary btn-sm" id="backToGame">Nazad</button></h4>
                <hr>
                {{--  all games  --}}
                <div class="games-data"></div>



        {{--  Pagination  --}}

                    <nav aria-label="Page navigation example" style="margin-top: 20px;">
                        <ul class="pagination">
                        </ul>
                    </nav>

            </div>
        </div>

    </div>

    <!-- START GAME MODAL -->

    <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Multyplayer</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">

                    <div>
                        <input type="radio" class="option-input radio" name="mode" value="1">Single
                        <input type="radio" class="option-input radio" name="mode" value="2">Multy
                    </div><br>

                    <div class="multyplayer" style="display: none;">
                        <label for="player1">Player1 Name</label>
                        <input type="text" class="form-control player1" >
                        <label for="player2">Player2 Name</label>
                        <input type="text" class="form-control player2">
                    </div>

                    <div class="singleplayer" style="display: none;">
                        <label for="player1">Player1 Name</label>
                        <input type="text" class="form-control player1">
                    </div>


                    <div class="error"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary start">Start</button>
                </div>
            </div>
        </div>
    </div>







    <script src="{{asset('assets/js/app.js')}}"></script>
    </body>
</html>
