$(function () {
  //ask the server for songs, and then draw them
  getSongs();

  //listen for submit events and send new songs to the server
  $('form').on('submit', function (event) {
    event.preventDefault();

    var formData = $(this).serialize();

    $.ajax({
      type: 'POST',
      url: '/songs',
      data: formData,
      statusCode: {
        400: function () {
          alert('Someone else got here first!\nTry again!');      //this does not work.  Neither did error
        },
        418: function () {
          alert('You can\'t do a blank song you dummy!');
        }
      },
      success: getSongs,
      // error: function() {
      //   alert("That is totally unacceptable! \nTry again!");
      // }

    });

    $(this).find('input[type=text]').val('');
  });

  //listen for click events on remove buttons
  //this remove function somewhat works.  You cannot remove
  //more than one song at a time.
  $('tbody').on('click', 'button', function() {
    $(this).closest('tr').remove();
    var id = $(this).attr('id');
    var deleteObj = {'index': id};
    removeSongs(deleteObj);
  });


});
//Sends an object to the server.js file for deletion.  Also calls getSongs to
//reflect changes on the client side.
function removeSongs(deleteObj) {
  $.ajax({
    type: 'DELETE',
    url: '/songs',
    data: deleteObj,
    success: function () {
      getSongs();
    }
  });
}

//This function gets all the songs in the /songs url and fills in a table
function getSongs() {
  $.ajax({
    type: 'GET',
    url: '/songs',

    success: function(songs) {
      $('#songs').empty();
      songs.forEach(function(song) {
        var $tr = $('<tr></tr>');
        $tr.append('<td>' + song.title.toUpperCase() + '</td>');
        $tr.append('<td>' + song.artist.toUpperCase() + '</td>');
        $tr.append('<td>' + song.date + '</td>');
        $tr.append('<td>' + song.remover + '</td>');
        $('#songs').append($tr);
      });
    }
  });
}
