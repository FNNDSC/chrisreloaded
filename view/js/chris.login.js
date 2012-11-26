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
          

          jQuery().toastmessage('showSuccessToast',
              '<h5>Logged out.</h5>' + 'Sayonara!');
          

        } else {
          
          // some easteregg
          alert('Hi ' + _command);
          
        }
      }
      
    });

// activate backstretch
jQuery.backstretch('view/gfx/background1.jpg');
