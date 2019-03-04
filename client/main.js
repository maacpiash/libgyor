$(document).ready(() => {
    // var req = new XMLHttpRequest();
    // req.overrideMimeType('application/json');
    var url = window.location.href;
    var index = null;
    if (url.lastIndexOf('?') != -1)
      index = url.split('?')[1].split('=')[1];
    // req.open('POST', 'http://localhost:4000/api/books/' + index, true);

    // req.send({

    // });

    $('#editForm').submit(function (event) {
      event.preventDefault();
      submitBook();
    });

    
  });