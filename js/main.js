$(document).ready(function() {
  // handlebars
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  // variabili globali
  var searchBtn = $("#search-btn");
  var contRisultati = $(".result-container");

  // CODICE --------------------------------------------------------------------
  // al click sul bottone "CERCA"
  searchBtn.click(function() {
    // cancello tutto il contenuto delle precedenti ricerche
    contRisultati.html("");
    // salvo il valore inserito dall'utente e svuoto l'input
    var queryString = $("#input").val();
    $("#input").val("");
    contRisultati.append('<span>Risultati della ricerca per "' + queryString + '"</span><br>');

    cercaFilm(queryString);
    cercaSerie(queryString);

  });


  // DICHIARAZIONE FUNZIONI ----------------------------------------------------

  function cercaFilm(query) {
    var listaRisultati;
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: query,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        listaRisultati = data.results;
        stampaRisultati(listaRisultati, "Film");
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });
  }

  function cercaSerie(query) {
    var listaRisultati
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: query,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        listaRisultati = data.results;
        stampaRisultati(listaRisultati, "TV");
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });
  }

  // funzione output risultato ricerca
  function stampaRisultati(arrayOggetti, tipo) {
    var title, origTitle;

    if(arrayOggetti.length == 0) {
      if(tipo == "Film") {
        contRisultati.append("Nessun film trovato.<br>");
      } else {
        contRisultati.append("Nessuna serie TV trovata.<br>");
      }
    } else {
      for(var i=0; i < arrayOggetti.length; i++) {
        if (tipo == "Film") {
          title = arrayOggetti[i].title;
          origTitle = arrayOggetti[i].original_title;
        } else {
          title = arrayOggetti[i].name;
          origTitle = arrayOggetti[i].original_name;
        }

        var context = {
          poster: generatePoster(arrayOggetti[i].poster_path),
          titolo: title,
          titoloOriginale: origTitle,
          lingua: generateFlag(arrayOggetti[i].original_language),
          voto: votoInStelline(arrayOggetti[i].vote_average),
          tipo: tipo
        };

        var html = template(context);
        contRisultati.append(html);

        // controllo se il titolo è uguale al titolo originale nascondo
        // quest'ultimo
        if(context.titolo == context.titoloOriginale) {
          $(".movie-card").last().find(".original-title").hide();
        }
      }
    }
  }

  // funzione di output voto in stelline
  function votoInStelline(voto) {
    // trasformo il voto in un numero intero tra 1 e 5
    votoBase5 = Math.ceil((voto / 2));

    // creo una stringa di stelline dinamicamente in base al voto
    var stelline = "";
    // inserisco tante stelline piene quanto il numero del voto
    for (var i = 0; i < votoBase5; i++) {
      stelline += '<i class="fas fa-star"></i>';
    }
    // inserisco la rimanenza di stelline vuote fino ad averne 5
    for (var j = votoBase5; j < 5; j++) {
      stelline += '<i class="far fa-star"></i>';
    }

    return stelline;
  }

  // funzione di output bandierine lingue supportate
  function generateFlag(lingua) {
    var listaBandiere = ["it", "en"];

    var lang = "";

    if(listaBandiere.includes(lingua)) {
      lang = '<img src="img/' + lingua + '.svg" class="flag">';
    } else  {
      lang = lingua.toUpperCase();
    }

    return lang;
  }

  // funzione output poster
  function generatePoster(posterUrl) {
    var poster;
    if (posterUrl != null) {
      poster = 'https://image.tmdb.org/t/p/w342/' + posterUrl;
    } else {
      poster = 'img/nondisp.png';
    }

    return poster;
  }

});
