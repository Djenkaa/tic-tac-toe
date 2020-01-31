$(document).ready(function () {


    var dataPerPage = 4;
    var currentPage = 1;
    var skip = (currentPage-1) * dataPerPage;
    var end = currentPage * dataPerPage;


    //go to all results
    $(document).on('click','#all-result',function () {
        $('.wrapp').hide();
        $('.all-result').show();
        games_data();

    });

    //go back to the game
    $(document).on('click','#backToGame', function () {
       $('.wrapp').hide();
       $('.game-board').show();
       $('.current-result').show();
    });


    //get all games data

    function games_data() {
        $.get('/api/games').done(function (data) {
           console.log(data);

           var temp = '';
           var games ='';

           if(end > data.length){
               games = data.length;
           }else{
               games = end
           }

           for(var i = skip; i<games; i++){
               temp+='<div class="row" style="margin-top: 20px;">';
               temp+=' <div class="col-md-4 font-weight-bold">'+JSON.parse(data[i].player1).name;
               temp+=' <span class="badge badge-primary">'+JSON.parse(data[i].player1).ox.toUpperCase()+'</span><br>';

               if(JSON.parse(data[i].player1).player == data[i].winner){
                   temp+='<img height="50" width="60" src="/assets/img/winner.png" alt="">';
               }
               if(data[i].winner == null){
                   temp+='<img height="60" width="60" src="/assets/img/equal.png" alt="">';
               }

               temp+='</div>';
               temp+=' <div class="col-md-4 text-center">';
               temp+='<p><span class="badge badge-secondary">'+timeParser(data[i].duration)+'</span></p>';
               temp+='<div class="row result">';
               temp+=JSON.parse(data[i].game_fields);
               temp+='</div>';
               temp+='</div>';
               temp+='<div class="col-md-4 text-right font-weight-bold">';
               temp+=' <span class="badge badge-danger result-char">'+JSON.parse(data[i].player2).ox.toUpperCase()+'</span> '+JSON.parse(data[i].player2).name+'<br>';
               if(JSON.parse(data[i].player2).player == data[i].winner){
                   temp+='<img height="50" width="60" src="/assets/img/winner.png" alt="">';
               }
               if(data[i].winner == null){
                   temp+='<img height="60" width="60" src="/assets/img/equal.png" alt="">';
               }
               temp+='</div>';
               temp+='</div>';

           }

           $('.games-data').html(temp);

           var pagination='';
           var totalPage = Math.ceil(data.length / dataPerPage);

           for (var i = 0; i<totalPage; i++){
               pagination+=`<li class="page-item ${i+1 == currentPage ? 'active' : ''}"><a class="page-link" href="${i+1}">${i+1}</a></li>`;
           }

           $('.pagination').html(pagination);

        });
    }

    //parse game time
    function timeParser(time) {

        var m = Math.floor(time/60);
        var s = time - (m*60);

        if(m<10){
            m='0'+m;
        }

        if(s<10){
            s='0'+s;
        }

        return `${m}:${s}`;
    }

    //page selection

    $(document).on('click','.pagination li a',function (e) {
        e.preventDefault();
        var page = $(this).attr('href');

        currentPage = page;
        skip = (currentPage-1) * dataPerPage;
        end = currentPage * dataPerPage;

        games_data();

    });

});