// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo
// scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
// bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

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

    // effettuo la chiamata ajax passandogli il valore della ricerca dinamicamente
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

        // estraggo le informazioni che mi servono dagli oggetti dell'array
        // e le stampo in pagina tramite handlebars
        for(var i=0; i < listaRisultati.length; i++) {
          console.log(listaRisultati[i]);
          var context = {
            titolo: listaRisultati[i].title,
            titoloOriginale: listaRisultati[i].original_title,
            lingua: listaRisultati[i].original_language.toUpperCase(),
            voto: listaRisultati[i].vote_average
          };

          var html = template(context);
          contRisultati.append(html);
        }
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE! Codice: " + richiesta.status);
      }
    });
  });





});
