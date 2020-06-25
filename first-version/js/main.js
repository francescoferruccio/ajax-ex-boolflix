$(document).ready(function() {
  // handlebars
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  // variabili globali
  var searchBtn = $("#search-btn");
  var contRisultati = $(".result-container");

  // CODICE --------------------------------------------------------------------

  // al click sul bottone "CERCA" eseguo la ricerca
  searchBtn.click(function() {
    // cancello tutto il contenuto delle precedenti ricerche
    contRisultati.html("");
    // salvo il valore inserito dall'utente e svuoto l'input
    var queryString = $("#input").val();
    $("#input").val("");
    $(".recap-ricerca").text('Risultati della ricerca per "' + queryString + '".');

    // chiamata ajax per film
    ricerca(queryString, "Film");
    // chiamata ajax per serie TV
    ricerca(queryString, "TV");
  });

  // alla pressione del tasto INVIO eseguo la ricerca
  $("#input").keydown(function(event) {
    if (event.which == 13) {
      // cancello tutto il contenuto delle precedenti ricerche
      contRisultati.html("");
      // salvo il valore inserito dall'utente e svuoto l'input
      var queryString = $("#input").val();
      $("#input").val("");
      $(".recap-ricerca").text('Risultati della ricerca per "' + queryString + '".');

      // chiamata ajax per film
      ricerca(queryString, "Film");
      // chiamata ajax per serie TV
      ricerca(queryString, "TV");
    }
  })


  // DICHIARAZIONE FUNZIONI ----------------------------------------------------

  // funzione di ricerca che effettua la chiamata ajax e stampa i risultati
  // in pagina
  function ricerca(query, tipo) {
    var endPoint, listaRisultati;

    // cambio l'endpoint della chiamata in base al tipo ricercato
    if(tipo === "Film") {
      endPoint = 'https://api.themoviedb.org/3/search/movie';
    } else if (tipo === "TV") {
      endPoint = 'https://api.themoviedb.org/3/search/tv';
    }

    $.ajax({
      url: endPoint,
      method: "GET",
      data: {
        url: endPoint,
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: query,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        listaRisultati = data.results;
        stampaRisultati(listaRisultati, tipo);
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
          tipo: tipo,
          trama: generateOverview(arrayOggetti[i].overview)
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

    $(".poster").each( function() {
      var self = $(this);

      if (self.attr("src") === "img/nondisp.png") {
        self.siblings(".titoloNonDisp").addClass("visible");
      }
    });
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
      poster = 'https://image.tmdb.org/t/p/w342' + posterUrl;
    } else {
      poster = 'img/nondisp.png';
    }

    return poster;
  }

  // funzione output trama
  function generateOverview(trama) {
    var result;

    if(trama === "") {
      result = "Descrizione non disponibile";
    } else {
      result = trama;
    }

    // se la descrizione è troppo lunga la riduco a 300 caratteri
    if(result.length > 300) {
      result = trama.slice(0, 300) + "... (continua)";
    }

    return result;
  }
});
