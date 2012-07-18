<html>
  <head>
    <script type="text/javascript">
      function showHint(str) {
        if (str.length == 0) {
          document.getElementById("txtHint").innerHTML = "";
          return;
        }
        xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
          }
        }
        xmlhttp.open("GET", "../search.class.php?field=" + str, true);
        xmlhttp.send();
      }
    </script>
  </head>
  <body>

    <p>
      <b>Start typing a search pattern in the input field below:</b>
    </p>
    <form>
      Search:
      <input type="text" onkeyup="showHint(this.value)" size="20" />
      <Input type = 'Checkbox' Name ='or' value ="o"/>
    </form>
    <p>
      Query:<span id="txtHint"></span>
    </p>

  </body>
</html>