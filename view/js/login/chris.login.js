jQuery(document).ready(
    function() {

      // check if we should be sorry
      if (location.href.match(/(\?)(\w*.\w*)*/)) {
        
        var _command = location.href.match(/(\?)(\w*.\w*)*/)[0];
        _command = _command.replace('?', '').replace('/', ''); // replace any ?
        // or /
        
        if (_command == 'sorry') {
          
          jQuery().toastmessage('showErrorToast',
              '<h5>Login failed.</h5>' + 'Invalid credentials!');
          
        } else if (_command == 'logged_out') {
          
          var _goodbye = ['See ya', 'Sayonara', 'Au revoir', 'Auf wiedersehen', 'Vaarwel', 'Adios', 'Joi gin', 'Arrivederci', 'Chao', 'Adeus', 'Doviduvanje', 'G&uuml;le G&uuml;le'];
          
          
          jQuery().toastmessage('showSuccessToast',
              '<h5>Logged out.</h5>' + _goodbye[Math.floor(Math.random()*_goodbye.length)] + '!');
          

        } else {
          
          // some easteregg
          //alert('Hi ' + _command);
          
        }
      }
      
    });
