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
  var searchBtn = $("#search-btn");

  searchBtn.click(function() {
    var queryString = $("#input").val();

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie",
      method: "GET",
      data: {
        api_key: "db123098e9fe123d1b0a79cc401c920d",
        query: queryString,
        language: "it-IT"
      },
      success: function(data, stato) {
        console.log(data);
      },
      error: function(richiesta, stato, errore) {
        console.log("ERRORE!");
      }
    });
  });





});
