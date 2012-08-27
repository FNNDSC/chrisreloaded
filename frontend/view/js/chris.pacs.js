/* Formating function for row details */
function fnFormatDetails(oTable, data) {
  var numberOfResults = data.StudyInstanceUID.length;
  var i = 0;
  var content = '<table id="seriesResults" class="table table-bordered"><thead><tr><th>UID</th><th># files</th></tr></thead><tbody>';
  for (i = 0; i < numberOfResults; ++i) {
    content += '<tr class="parent pacsStudyRows" value="'
        + data.SeriesInstanceUID[i] + '">';
    content += '<td>' + data.SeriesInstanceUID[i] + '</td>';
    content += '<td>' + data.NumberOfSeriesRelatedInstances[i] + ' files</td>';
    content += '</tr>';
  }
  content += '</body></table>';
  return content;
}
function fnInitTable(tableName, nbColumn, icon) {
  /*
   * Insert a 'details' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<i class="' + icon + '"></i>';
  nCloneTd.className = "center";
  $('#' + tableName + 'Results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[0]);
  });
  $('#' + tableName + 'Results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
  });
  /*
   * Insert a 'download' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<i class="icon-circle-arrow-down download' + tableName
      + '"></i>';
  nCloneTd.className = "center";
  $('#' + tableName + 'Results thead tr').each(function() {
    this.insertBefore(nCloneTh, this.childNodes[nbColumn]);
  });
  $('#' + tableName + 'Results tbody tr').each(function() {
    this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[nbColumn]);
  });
  /*
   * Initialse DataTables, with no sorting on the 'details' column
   */
  var oTable = $('#' + tableName + 'Results')
      .dataTable(
          {
            "sDom" : "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
            "sPaginationType" : "bootstrap",
            "oLanguage" : {
              "sLengthMenu" : "_MENU_ records per page"
            },
            "aoColumnDefs" : [ {
              "bSortable" : false,
              "aTargets" : [ 0, nbColumn ]
            } ],
          });
  return oTable;
}
/* Formating function for row details */
$(document)
    .ready(
        function() {
          /*
           * $(".pacsRetrieve").click(function(event) { $.ajax({ type : "POST",
           * url : "controller/pacs_move.php", dataType : "json", data : {
           * USER_AET : $("#USER_AET").val(), SERVER_IP : $("#SERVER_IP").val(),
           * SERVER_POR : $("#SERVER_POR").val(), PACS_LEV : 'STUDY',
           * PACS_STU_UID : '', PACS_MRN : $("#PACS_MRN").val(), PACS_NAM :
           * $("#PACS_NAM").val(), PACS_MOD : $("#PACS_MOD").val(), PACS_DAT :
           * $("#PACS_DAT").val(), PACS_STU_DES : $("#PACS_STU_DES").val(),
           * PACS_ACC_NUM : $("#PACS_ACC_NUM").val() }, success : function(data) { }
           * }); });
           */
          /*
           * $('#example').dataTable({ "sDom" : "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>"
           * });
           */
          $("#PACS_QUERY")
              .click(
                  function(event) {
                    $
                        .ajax({
                          type : "POST",
                          url : "controller/pacs_query.php",
                          dataType : "json",
                          data : {
                            USER_AET : $("#USER_AET").val(),
                            SERVER_IP : $("#SERVER_IP").val(),
                            SERVER_POR : $("#SERVER_POR").val(),
                            PACS_LEV : 'STUDY',
                            PACS_MRN : $("#PACS_MRN").val(),
                            PACS_NAM : $("#PACS_NAM").val(),
                            PACS_MOD : $("#PACS_MOD").val(),
                            PACS_DAT : $("#PACS_DAT").val(),
                            PACS_STU_DES : '',
                            PACS_STU_UID : '',
                            PACS_ACC_NUM : ''
                          },
                          success : function(data) {
                            var content = '<table cellpadding="0" cellspacing="0" border="0" class="table table-striped table-bordered" id="quickResults">';
                            var numberOfResults = data.PatientID.length;
                            var i = 0;
                            content += '<thead><tr><th>PatientName</th><th>DateOfBirth</th><th>StudyDescription</th><th>StudyDate</th><th>Modality</th></tr></thead><tbody>';
                            for (i = 0; i < numberOfResults; ++i) {
                              content += '<tr class="parent pacsStudyRows" value="' + data.StudyInstanceUID[i] + '">';
                              content += '<td>' + data.PatientName[i] + '</td>';
                              content += '<td>' + data.PatientBirthDate[i] + '</td>';
                              content += '<td>' + data.StudyDescription[i] + '</td>';
                              content += '<td>' + data.StudyDate[i] + '</td>';
                              content += '<td>' + data.ModalitiesInStudy[i] + '</td>';
                              content += '</tr>';
                            }
                            content += '</tbody></table>';
                            $('#results_container').html(content);
                            var oTable = fnInitTable('quick', 6,
                                'icon-chevron-down');
                            $(".downloadquick").click(function(event) {
                              alert('PACS STUDY PULL TRIGERED!');
                            });
                            $('.icon-chevron-down').click(function() {
                              var nTr = $(this).parents('tr')[0];
                              var studyUID = nTr.getAttribute('value');
                              $.ajax({
                                type : "POST",
                                url : "controller/pacs_query.php",
                                dataType : "json",
                                data : {
                                  USER_AET : $("#USER_AET").val(),
                                  SERVER_IP : $("#SERVER_IP").val(),
                                  SERVER_POR : $("#SERVER_POR").val(),
                                  PACS_LEV : 'SERIES',
                                  PACS_STU_UID : studyUID
                                },
                                success : function(data) {
                                  alert('DATA RECEIVED');
                                  /*
                                   * $('#serieslist') .html(
                                   * fnFormatDetails(oTable, data)); var oTable =
                                   * fnInitTable( 'series', 3,
                                   * 'icon-chevron-left');
                                   * $('#slideInner').animate( { 'marginLeft' :
                                   * -$( "#slideshow").width() });
                                   * $(".icon-chevron-left").click(
                                   * function(event) {
                                   * $('#slideInner').animate({ 'marginLeft' : 0
                                   * }); }); $(".downloadseries") .click(
                                   * function(event) { alert('PACS SERIES PULL
                                   * TRIGERED!'); });
                                   */
                                }
                              });
                            });
                          }
                        });
                  });
          $(".pacsPing").click(function(event) {
            $.ajax({
              type : "POST",
              url : "controller/pacs_ping.php",
              dataType : "json",
              data : {
                USER_AET : $("#USER_AET").val(),
                SERVER_IP : $("#SERVER_IP").val(),
                SERVER_POR : $("#SERVER_POR").val()
              },
              success : function(data) {
                $('#pacsping').html(data);
              }
            });
          });
          /*
           * $(".pacsAdanced").click(function(event) { if
           * ($(".pacsadvanced").is(":visible")) { $(".pacsadvanced").hide(); }
           * else { $(".pacsadvanced").show(); } }); $(".pacsadvanced").hide(); //
           * pacs stuff var currentPosition = 0; var slideWidth =
           * $("#slideshow").width(); var slides = $('.slide'); var
           * numberOfSlides = slides.length; // Remove scrollbar in JS
           * $('#slidesContainer').css('overflow', 'hidden'); // Wrap all
           * .slides with #slideInner div slides.wrapAll('<div id="slideInner"></div>') //
           * Float left to display horizontally, readjust .slides // width
           * .css({ 'float' : 'left', 'width' : slideWidth }); // Set
           * #slideInner width equal to total width of all slides
           * $('#slideInner').css('width', slideWidth * numberOfSlides);
           */
        });