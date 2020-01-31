$(document).ready(function () {

    //all combinations
    var combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    //player 1
    var player1 = {
        name: "Player 1",
        ox: '',
        score: 0,
        player:1
    };

    //player2
    var player2 = {
        name: "",
        ox: '',
        score: 0,
        player:2
    };

    //computer
    var computer = {
        name: "Computer",
        ox: '',
        score: 0,
        player:2
    }

    //who is the player on the move
    var play;
    //game mode
    var mod = null;
    //is game over
    var gameOver = true;
    //remaining empty fields
    var remainingFields = 9;
    //game duration
    var gameTime = 0;
    //
    var timeInterval;
    //fields
    var board = [];



    //adds fields on the board
    $(function () {
        var fields = $('.fields');

        var temp = '';

        for (var i = 0; i < 9; i++) {

            temp = '<div class="col-md-4 field col-4" data-id="' + i + '"></div>';
            fields.append(temp);
        }
   ;

    });


    //choose mode
    $('input[name="mode"]').on('input', function () {

        mod = $(this).val();
        $('.error').html('');

        if (mod == 2) {

            $('.singleplayer').hide();
            $('.multyplayer').show();
        }else if(mod == 1){

            $('.multyplayer').hide();
            $('.singleplayer').show();
        }
    });


    //start game
    $(document).on('click', '#start', function () {

        $('.modal').modal('show');
    });


    //playing game
    $(document).on('click', '.field', function () {
    console.log(gameOver);
        //if game over
        if (!gameOver) {

            //if game mode is multyplayer
            if (mod == 2) {

                //if field is empty and if the number of fields remaining is greater than zero
                if (emptyField($(this)) && remainingFields > 0) {

                    //Fill the field which player has clicked on
                    $(this).html("<h1>" + play.ox + "</h1>");
                    remainingFields--;

                    //if the game has a winner
                    if (checkWinner()) {
                        endGame();

                    }

                    //if the game is a draw
                    if(remainingFields == 0 && !checkWinner()){
                        endGame();
                    }

                    //who is on the move
                    play == player1 ? play = player2 : play = player1;

                    $('.player span').text(play.name);

                }

                //if game mode is singleplayer
            } else if (mod == 1) {

                //if field is empty
                if (emptyField($(this))) {
                    //Fill the field which player has clicked on
                    $(this).html("<h1>" + player1.ox + "</h1>");
                    remainingFields--;



                    setTimeout(function () {

                        //computer move
                        computerRadnomTurn()
                        remainingFields--;
                        //if the game has a winner
                        if (checkWinner()) {

                            endGame();
                        }

                        //if the game is a draw
                        if(remainingFields < 1 && !checkWinner()){
                            endGame();
                        }

                    }, 500);
                }
            }
        }

    });

    //start game
    function start() {
        if(mod == null){
            return;
        }
        var turn = [player1, player2];
        // who plays first
        var random = Math.floor((Math.random() * 2));

        //if game mode is multyplayer
        if (mod == 2) {

            player1.ox = 'x';
            player2.ox = 'o';
            play = player1;
                //showing the player who plays first
            $('.player span').text(play.name);

            gameOver = false;
            $('.cp1').text(player1.name);
            $('.cp2').text(player2.name);
        //if game mode is singleplayer
        } else if (mod == 1) {
            player1.ox = 'x';
            computer.ox = 'o';

            //player 1 playing first
            $('.player span').text(player1.name);
            gameOver = false;
            $('.cp1').text(player1.name);
            $('.cp2').text(computer.name);
        }


        //start game time
        time();
        $('#start').hide();
        $('.tic-tac').hide();
        $('.player').show();
    }

    //end game

    function endGame() {


            var winner = ''; //who is a winner
            //if game mode is multyplater
            if(mod == 2){
                //checking the player's character on the winning combination
                // player1.ox == checkWinner() ? winner = player1 : winner = player2;
                if(player1.ox == checkWinner()){
                    winner = player1;

                }else if(player2.ox == checkWinner()){
                    winner = player2;

                }
                //if game mode is singleplayer
            }else if(mod == 1){
                //checking the player's character on the winning combination
                if(computer.ox == checkWinner()){
                    winner = computer
                }else if(player1.ox == checkWinner()){
                    winner = player1;
                }
                player2 = computer;
            }

            //increasing the score of the winner
            winner.score++;
            saveGame(winner);

        gameOver = true;

        //stop game time
        clearInterval(timeInterval);
        $('.cs'+winner.player).text(winner.score);

        //ajax post for game result
        $.post('/api/store',{
            board:$('.fields').html(),
            gameTime,
            player1,
            player2,
            winner:winner.player
        }).done(function (data) {
            console.log(data);
        });

        //button for rematch
        $('#rematch').show();

        //if the game is a draw
        if(remainingFields < 1 && !checkWinner()){

            $('.rematch-text').html('<b>Nereseno!</b> Zelite li da odigrate revans?');
            $('.rematch-window').fadeIn();
            return;
        }

        $('.rematch-text').html('Pobednik je igrac '+'<b>'+winner.name+'</b>'+', zelite li da odigrate revans?');
        $('.rematch-window').fadeIn();
    }

    //winner
    function saveGame(w,l){
        var temp = '';

         // temp += '<div class="clearfix"></div>';
         temp+='<div class="current-score-card row" style="margin-top: 20px;">';
         temp +='<div class="col-md-4 p1">'+player1.name+'<br>';
         if(player1.name == w.name){
             temp+='<span class="badge badge-success">winner</span>';
         }else if(player2.name == w.name){
             temp+='<span class="badge badge-danger">loser</span>';
         }else{
             temp+='<span class="badge badge-info">draw</span>';
         }
         temp+='</div>';
         temp +='<div class="col-md-4"><img height="30" width="30" src="https://i.ya-webdesign.com/images/versus-png-2.png" alt=""></div>';
         temp +=' <div class="col-md-4 p2">'+player2.name +'<br>';
        if(player2.name == w.name){
            temp+='<span class="badge badge-success">winner</span>';
        }else if (player1.name == w.name) {
            temp+='<span class="badge badge-danger">loser</span>';
        }else{
            temp+='<span class="badge badge-info">draw</span>';

        }
         temp+='</div>';
         temp+= '</div>';

        var table = $('#result');
        table.prepend(temp);
    }

    //check winner
    function checkWinner() {

        //all fields
        var fields = $('.fields .field');


        //row 1
        if (fields.eq(0).text() == fields.eq(1).text() && fields.eq(1).text() == fields.eq(2).text()) {

            if(fields.eq(0).text() && fields.eq(1).text() && fields.eq(2).text()){
                fields.eq(0).addClass('winComb');
                fields.eq(1).addClass('winComb');
                fields.eq(2).addClass('winComb');

            }
            return fields.eq(0).text();
        }
        //row 2
        if (fields.eq(3).text() == fields.eq(4).text() && fields.eq(4).text() == fields.eq(5).text()) {

            if(fields.eq(3).text() && fields.eq(4).text() && fields.eq(5).text()){
                fields.eq(3).addClass('winComb');
                fields.eq(4).addClass('winComb');
                fields.eq(5).addClass('winComb');

            }
            return fields.eq(3).text();
        }
        //row 3
        if (fields.eq(6).text() == fields.eq(7).text() && fields.eq(7).text() == fields.eq(8).text()) {
            if(fields.eq(6).text() && fields.eq(7).text() && fields.eq(8).text()){
                fields.eq(6).addClass('winComb');
                fields.eq(7).addClass('winComb');
                fields.eq(8).addClass('winComb');

            }
            return fields.eq(6).text();
        }
        //column 1
        if (fields.eq(0).text() == fields.eq(3).text() && fields.eq(3).text() == fields.eq(6).text()) {
            if(fields.eq(0).text() && fields.eq(3).text() && fields.eq(6).text()){
                fields.eq(0).addClass('winComb');
                fields.eq(3).addClass('winComb');
                fields.eq(6).addClass('winComb');

            }
            return fields.eq(0).text();
        }
        //column 2
        if (fields.eq(1).text() == fields.eq(4).text() && fields.eq(4).text() == fields.eq(7).text()) {
            if(fields.eq(1).text() && fields.eq(4).text() && fields.eq(7).text()){
                fields.eq(1).addClass('winComb');
                fields.eq(4).addClass('winComb');
                fields.eq(7).addClass('winComb');

            }
            return fields.eq(1).text();
        }
        //column 3
        if (fields.eq(2).text() == fields.eq(5).text() && fields.eq(5).text() == fields.eq(8).text()) {
            if(fields.eq(2).text() && fields.eq(5).text() && fields.eq(8).text()){
                fields.eq(2).addClass('winComb');
                fields.eq(5).addClass('winComb');
                fields.eq(8).addClass('winComb');

            }
            return fields.eq(2).text();
        }

        //diagonal from first to last field
        if (fields.eq(0).text() == fields.eq(4).text() && fields.eq(4).text() == fields.eq(8).text()) {
            if(fields.eq(0).text() && fields.eq(4).text() && fields.eq(8).text()){
                fields.eq(0).addClass('winComb');
                fields.eq(4).addClass('winComb');
                fields.eq(8).addClass('winComb');

            }
            return fields.eq(0).text();
        }
        //diagonals from the third to the sixth field
        if (fields.eq(2).text() == fields.eq(4).text() && fields.eq(4).text() == fields.eq(6).text()) {
            if(fields.eq(2).text() && fields.eq(4).text() && fields.eq(6).text()){
                fields.eq(2).addClass('winComb');
                fields.eq(4).addClass('winComb');
                fields.eq(6).addClass('winComb');

            }
            return fields.eq(2).text();
        }



    }
    

    
    $('#rematch').click(function rematch() {

        //replacing the player who plays first
       if(player1.ox == 'x'){
           player1.ox = 'o';
           player2.ox = 'x';
       }else{
           player1.ox = 'x';
           player2.ox = 'o';
       }

        if(player1.ox == 'x'){
            play = player1;
        }else{
            play = player2;
        }

        restart();
        start();
        $('.rematch-window').hide();


    });

    //is field empty

    function emptyField(field) {

        if (field.text() == '') {
            return true;
        } else {
            return false;
        }

    }

    //if the user has 2 characters in the fields for the winning combination
    //the function checks if the third field is free
    function emptyFieldtoWin(fields) {
        //loop combs fields with 2 same characters
        for (var i = 0; i < fields.length; i++) {

            for (var w = 0; w < JSON.parse(fields[i].comb).length; w++) {
                var search = findField(JSON.parse(fields[i].comb)[w]);

                if (emptyField(search)) {
                    return search;
                }
            }
        }
        return false
    }

    //potential combinations
    function potentialCombinations(player) {
        //id of all the fields where the player has his char
        var combFields = [];
        // all fields
        var fields = $('.fields .field');
        //possible combinations the player can play
        var playerCombination = [];

        //all player fileds
        for (var i = 0; i < fields.length; i++) {

            //if the field contains the player character
            if (fields.eq(i).text() == player.ox) {

                combFields.push(fields.eq(i).data('id'));
            }
        }


        if (combFields.length > 0) {
            //loop all the fields where the player has his char
            for (var i = 0; i < combFields.length; i++) {

                //loop all combinations
                for (var w = 0; w < combinations.length; w++) {

                    //if the user's field is contained in some combinations
                    if (combinations[w].includes(combFields[i])) {

                        var search = playerCombination.find(function (el) {
                            return el.comb == JSON.stringify(combinations[w]);
                        });

                        if (search) {
                            search.num++;

                        } else {
                            playerCombination.push({
                                comb: JSON.stringify(combinations[w]),
                                num: 1
                            });
                        }

                    }
                }
            }

            return playerCombination;

        }
        return combFields;

    }

    //if one field is missing the player to wins
    function lastFieldToWin(fieldsArr) {
        var fields = [];

        for (var i = 0; i < fieldsArr.length; i++) {
            if (fieldsArr[i].num == 2) {
                fields.push(fieldsArr[i]);
            }
        }

        return fields;
    }

    //find field

    function findField(id) {
        var fields = $('.fields .field');
        for (var i = 0; i < fields.length; i++) {
            if (fields.eq(i).data('id') == id) {
                return fields.eq(i);
            }
        }
    }

    //computer turn
    function computerRadnomTurn() {

        //central field
        var centre = findField(4);

        //if central field empty
        if (emptyField(centre)) {
            centre.html("<h1>" + computer.ox + "</h1>");
            return;
        }

        //computer
        var computerCombinations = potentialCombinations(computer);
        var computerLastField = lastFieldToWin(computerCombinations);
        var isComputerLastFieldEmpty = emptyFieldtoWin(computerLastField);

        //human
        var humanCombinations = potentialCombinations(player1);
        var humanLastField = lastFieldToWin(humanCombinations);
        var isHumanLastFieldEmpty = emptyFieldtoWin(humanLastField);

        if (isComputerLastFieldEmpty) {
            isComputerLastFieldEmpty.html("<h1>" + computer.ox + "</h1>");

            return;
        }

        if (isHumanLastFieldEmpty) {
            isHumanLastFieldEmpty.html("<h1>" + computer.ox + "</h1>");

            return;
        }

        var fields = $('.fields .field');

        if(remainingFields > 0){

            if(fields.eq(3).text()){
                if(!fields.eq(6).text()){
                    fields.eq(6).html("<h1>" + computer.ox + "</h1>");
                    return;
                }
            }
            if(fields.eq(5).text()){
                if(!fields.eq(8).text()){
                    fields.eq(8).html("<h1>" + computer.ox + "</h1>");
                    return;
                }
            }
            smartMove(fields);
        }
    }

    //smart move
    function smartMove(fields){
        for (var i = 0; i < fields.length; i++) {
            if (emptyField(fields.eq(i))) {
                fields.eq(i).html("<h1>" + computer.ox + "</h1>");

                return;
            }
        }
    }

    //restart game
    $(document).on('click', '#restart', function () {
        restart();
    });

    //restart function
    function restart() {
        var fields = $('.fields .field');

        for (var i = 0; i < fields.length; i++) {
            fields.eq(i).text('');
            fields.eq(i).removeClass('winComb');
        }

        remainingFields = 9;
        gameOver = true;
        clearInterval(timeInterval);
        gameTime = 0;
        $('.time').text('00:00');



    }

    //game time
    function time() {
        timeInterval = setInterval(function () {
            gameTime++;

            var m = Math.floor(gameTime / 60);
            var s = gameTime - (m * 60);

            if (m < 10) {
                m = '0' + m;
            }

            if (s < 10) {
                s = '0' + s
            }

            $('.time').text(m + ':' + s);
        }, 1000);
    }


    //validation form for multyplayer
    $(document).on('click','.start',function() {


        var error = [];

        if(mod == null){
            return;
        }


        if(mod == 2){
            var mp1 = $('.multyplayer .player1').val();
            var mp2 = $('.multyplayer .player2').val();

            if (mp1 == mp2) {
                error.push('Imena igraca ne smeju da budu ista!');
            }


            if (mp1.trim() == '' || mp2.trim() == '') {
                error.push('Imena igraca ne smeju da budu prazna!');
            }


            if (mp1.length < 3 || mp2.length < 3) {
                error.push('Imena igraca moraju da sadrze bar 3 slova!');
            }

            player1.name = mp1;
            player2.name = mp2;

        }else if(mod == 1){
            var sp1 = $('.singleplayer .player1').val();


            if (sp1.trim() == '') {

                error.push('Ime igraca ne sme da ude prazno!');
            }

            if (sp1.length < 3) {
                error.push('Ime igraca mora da sadrzi najmanje 3 slova!');
            }

            player1.name = sp1;
            player2.name = computer.name;
        }


        var temp = '';

        if (error.length > 0) {
            error.forEach(function (el) {
                temp += "<small class='text-muted'>" + el + "</small><br>";

            });
            $('.error').html(temp);
            return;
        }



        $('.cp1').text(player1.name);
        $('.cp2').text(player2.name);

        $('#currentScore').show();

        start();
        $('.modal').modal('hide')

    });


});
