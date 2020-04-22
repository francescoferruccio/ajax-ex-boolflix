$(document).ready(function() {
  // handlebars
  var source = $("#movie-template").html();
  var template = Handlebars.compile(source);

  // variabili globali
  var searchBtn = $("#search-btn");
  var contRisultati = $(".result-container");

  // al click sul bottone "CERCA"
  searchBtn.click(function() {
    // cancello tutto il contenuto delle precedenti ricerche
    contRisultati.html("");
    // salvo il valore inserito dall'utente e svuoto l'input
    var queryString = $("#input").val();
    $("#input").val("");

    // chiamata ajax per film
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: queryString,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        var listaRisultati = data.results;

        stampaRisultati(listaRisultati, "Film");
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });

    // chiamata ajax per serie tv
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv",
      method: "GET",
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: queryString,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        var listaRisultati = data.results;

        stampaRisultati(listaRisultati, "TV");
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });
  });


  // DICHIARAZIONE FUNZIONI ----------------------------------------------------

  // funzione che estre le informazioni che mi servono dagli oggetti dell'array
  // e le stampa in pagina tramite handlebars
  // se non ci sono risultati stampa un messaggio in pagina
  function stampaRisultati(arrayOggetti, tipo) {
    var title, origTitle;

    if(arrayOggetti.length == 0) {
      contRisultati.append("Nessun risultato trovato.<br>");
    } else {
      for(var i=0; i < arrayOggetti.length; i++) {
        if (tipo == "Film") {
          title = arrayOggetti[i].title;
          origTitle = arrayOggetti[i].original_title;
        } else {
          title = arrayOggetti[i].name;
          origTitle = arrayOggetti[i].original_name;
        }

        // trasformo il voto in un numero intero tra 1 e 5
        var voto = arrayOggetti[i].vote_average;
        voto = Math.ceil((voto / 2));

        // creo una stringa di stelline dinamicamente in base al voto
        var stelline = "";
        // inserisco tante stelline piene quanto il numero del voto
        for (var j = 0; j < voto; j++) {
          stelline += '<i class="fas fa-star"></i>';
        }
        // inserisco la rimanenza di stelline vuote fino ad averne 5
        for (var k = voto; k < 5; k++) {
          stelline += '<i class="far fa-star"></i>';
        }

        console.log(stelline);

        var context = {
          titolo: title,
          titoloOriginale: origTitle,
          lingua: arrayOggetti[i].original_language.toUpperCase(),
          voto: stelline,
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



});
