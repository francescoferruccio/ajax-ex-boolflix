$(document).ready(function() {
  // handlebars
  var movieSource = $("#movie-template").html();
  var movieTemplate = Handlebars.compile(movieSource);

  var staffSource = $("#staff-template").html();
  var staffTemplate = Handlebars.compile(staffSource);

  var selectSource = $("#select-template").html();
  var selectTemplate = Handlebars.compile(selectSource);
  // variabili globali
  var searchBtn = $("#search-btn");
  var contRisultati = $(".result-container");
  // var listaGeneriMovie, listaGeneriTv;

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

  // al click su una qualsiasi card apro la rispettiva modale
  $(".result-container").on("click", ".movie-card", function() {
    var id=$(this).data("id");
    $(this).find(".modale").toggle();

    var type = $(this).data("type");

    // cerco attori e regista del film cliccato
    cercaStaff(id, type);
  });

  $("#genre-select").change(function() {
    var filtro = $(this).val();
    $(".movie-card").each(function() {
      var thisGeneri = "" + $(this).data("genere");
      var arrayGeneri = thisGeneri.split(",");
      if(arrayGeneri.includes(filtro)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    }
  )
  });

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
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: query,
        language: "it-IT"
      },
      success: function(data, stato) {
        // salvo l'array di oggetti
        listaRisultati = data.results;
        getGenreList(listaRisultati, tipo);
        stampaRisultati(listaRisultati, tipo);
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });
  }

  // funzione output risultato ricerca
  function stampaRisultati(arrayOggetti, tipo) {
    var title, origTitle, release, type;

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
          release = arrayOggetti[i].release_date;
          type = "movie";
        } else {
          title = arrayOggetti[i].name;
          origTitle = arrayOggetti[i].original_name;
          release = arrayOggetti[i].first_air_date;
          type = "tv";
        }

        var context = {
          id: arrayOggetti[i].id,
          type: type,
          genre: arrayOggetti[i].genre_ids,
          poster: generatePoster(arrayOggetti[i].poster_path),
          titolo: title,
          titoloOriginale: origTitle,
          lingua: generateFlag(arrayOggetti[i].original_language),
          voto: votoInStelline(arrayOggetti[i].vote_average),
          anno: generateAnno(release),
          tipo: tipo,
          trama: generateOverview(arrayOggetti[i].overview, "riassunto"),
          tramaCompleta: generateOverview(arrayOggetti[i].overview, "completa"),
          backdrop: genrateBackdrop(arrayOggetti[i].backdrop_path)
        };

        $(".top-result").addClass("visible");

        var html = movieTemplate(context);
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
  function generateOverview(trama, tipo) {
    var result;

    if(trama === "") {
      result = "Descrizione non disponibile";
    } else {
      result = trama;
    }

    // se la descrizione è troppo lunga la riduco a 300 caratteri
    if(result.length > 300 && tipo === "riassunto") {
      result = trama.slice(0, 300) + "... (continua)";
    }

    return result;
  }

  // funzione output sfondo modale
  function genrateBackdrop(sfondo) {
    var result;

    if (sfondo == null) {
      result = "";
    } else {
      result = '<img src="https://image.tmdb.org/t/p/w1280' + sfondo + '">';
    }

    return result;
  }

  // funzione output anno
  function generateAnno(releaseDate) {
    var anno;

    if (releaseDate == undefined) {
      anno = "Dato non disponibile";
    } else {
      anno = releaseDate.slice(0, 4);
    }

    return anno;
  }

  // funzione output attori
  function cercaStaff(movieID, tipo) {
    $(".credits").html("");

    $.ajax({
      url: 'https://api.themoviedb.org/3/' + tipo + '/' + movieID + '/credits',
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
      },
      method: "GET",
      success: function (data, stato) {
        var movie = data.cast;

        for(var i = 0; i < movie.length; i++) {
          var personaggio = movie[i].character;
          var foto = movie[i].profile_path;

          if(personaggio === "") {
            personaggio = "non disponibile"
          }

          if(foto === null) {
            foto = 'img/attore.jpg';
          } else {
            foto = 'https://image.tmdb.org/t/p/w185' + movie[i].profile_path;
          }

          var context = {
            staffImg: foto,
            staffName: movie[i].name,
            staffCharacter: personaggio
          };
          var html = staffTemplate(context);

          $(".credits").append(html);
        }
      },
      error: function (richiesta, stato, errore) {
        console.log("ERRORE", richiesta, stato, errore);
      }
    }
    );
  }

  // funzione che richiede la lista dei generi all'api
  function getGenreList(listaFilm, tipo) {
    var endPoint;

    if(tipo === "Film") {
      endPoint = "https://api.themoviedb.org/3/genre/movie/list";
    } else if (tipo === "TV") {
      endPoint = "https://api.themoviedb.org/3/genre/tv/list";
    }

    $.ajax({
      url: endPoint,
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        language: "it-IT"
      },
      method: "GET",
      success: function(data, stato) {
        var listGenre = data.genres;

        createSelect(listGenre);
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE");
      }
    });
  }

  // funzione che inserisce la lista dei generi restituita dall'api nella select
  function createSelect(generi) {
    for(var i=0; i < generi.length; i++) {
      var context = {
        idGenre: generi[i].id,
        nameGenre: generi[i].name
      };

      var html = selectTemplate(context);

      $("#genre-select").append(html);
    }
  }
});
