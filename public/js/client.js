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
      success: getSongs
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


function getSongs() {
  $.ajax({
    type: 'GET',
    url: '/songs',
    statusCode: {
      400: function () {
        console.log('nope');
      }
    },
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
