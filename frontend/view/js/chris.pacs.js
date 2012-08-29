/* Formating function for row details */
function fnFormatDetails(oTable, data) {
  var numberOfResults = data.StudyInstanceUID.length;
  var i = 0;
  var content = '<div class="studydetails-'
      + data.StudyInstanceUID[0].replace(/\./g, "_")
      + '" ><table id="seriesResults-'
      + data.StudyInstanceUID[0].replace(/\./g, "_")
      + '" class="table table-bordered" cellmarging="0" cellpadding="0" cellspacing="0" border="0"><thead><tr><th>Protocol</th><th class="span2"># files</th><th class="span1"></th><th class="span1"></th></tr></thead><tbody>';
  for (i = 0; i < numberOfResults; ++i) {
    content += '<tr class="parent pacsStudyRows" value="'
        + data.SeriesInstanceUID[i] + '">';
    content += '<td id="series-'
        + data.SeriesInstanceUID[i].replace(/\./g, "_") + '">'
        + data.SeriesInstanceUID[i] + '</td>';
    content += '<td>' + data.NumberOfSeriesRelatedInstances[i] + '</td>';
    content += '<td><button class="btn btn-success preview_series " type="button"><i class="icon-eye-open icon-white"></i></button></td>';
    content += '<td><button class="btn btn-info download_series " type="button"><i class="icon-circle-arrow-down icon-white"></i></button></td>';
    content += '</tr>';
  }
  content += '</body></table></div>';
  return content;
}
function fnInitTable(tableName, nbColumn, icon) {
  /*
   * Insert a 'details' column to the table
   */
  var nCloneTh = document.createElement('th');
  var nCloneTd = document.createElement('td');
  nCloneTd.innerHTML = '<span class="control"><i class="' + icon
      + '"></i></span>';
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
  nCloneTd.innerHTML = '<button class="btn btn-primary download_study" type="button"><i class="icon-circle-arrow-down icon-white download'
      + tableName + '"></i></button>';
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
            "aaSorting" : [ [ 1, 'desc' ] ]
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
          var anOpen = [];
          var anSeriesLoaded = [];
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
                              content += '<tr class="parent pacsStudyRows" value="'
                                  + data.StudyInstanceUID[i] + '">';
                              content += '<td>' + data.PatientName[i] + '</td>';
                              content += '<td>' + data.PatientBirthDate[i]
                                  + '</td>';
                              content += '<td>' + data.StudyDescription[i]
                                  + '</td>';
                              content += '<td>' + data.StudyDate[i] + '</td>';
                              content += '<td>' + data.ModalitiesInStudy[i]
                                  + '</td>';
                              content += '</tr>';
                            }
                            content += '</tbody></table>';
                            $('#results_container').html(content);
                            var oTable = fnInitTable('quick', 6,
                                'icon-chevron-down');
                            $(".download_study").click(function(event) {
                              alert('PACS STUDY PULL TRIGERED!');
                            });
                            $('.control')
                                .click(
                                    function() {
                                      var nTr = $(this).parents('tr')[0];
                                      var studyUID = nTr.getAttribute('value');
                                      var i = $.inArray(nTr, anOpen);
                                      if (i === -1) {
                                        $('i', this).attr('class',
                                            'icon-chevron-up');
                                        $
                                            .ajax({
                                              type : "POST",
                                              url : "controller/pacs_query.php",
                                              dataType : "json",
                                              data : {
                                                USER_AET : $("#USER_AET").val(),
                                                SERVER_IP : $("#SERVER_IP")
                                                    .val(),
                                                SERVER_POR : $("#SERVER_POR")
                                                    .val(),
                                                PACS_LEV : 'SERIES',
                                                PACS_STU_UID : studyUID
                                              },
                                              success : function(data2) {
                                                var nDetailsRow = oTable
                                                    .fnOpen(nTr,
                                                        fnFormatDetails(oTable,
                                                            data2), 'details');
                                                $(
                                                    "#seriesResults-"
                                                        + data2.StudyInstanceUID[0]
                                                            .replace(/\./g, "_"))
                                                    .dataTable(
                                                        {
                                                          "sDom" : "t",
                                                          "aaSorting" : [ [ 1,
                                                              'desc' ] ],
                                                          "bPaginate" : false,
                                                          "aoColumnDefs" : [ {
                                                            "bSortable" : false,
                                                            "aTargets" : [ 2, 3 ]
                                                          } ],
                                                        });
                                                anOpen.push(nTr);
                                                var numberOfResults = data2.StudyInstanceUID.length;
                                                var j = 0;
                                                for (j = 0; j < numberOfResults; ++j) {
                                                  $
                                                      .ajax({
                                                        type : "POST",
                                                        async : false,
                                                        url : "controller/pacs_query.php",
                                                        dataType : "json",
                                                        data : {
                                                          USER_AET : $(
                                                              "#USER_AET")
                                                              .val(),
                                                          SERVER_IP : $(
                                                              "#SERVER_IP")
                                                              .val(),
                                                          SERVER_POR : $(
                                                              "#SERVER_POR")
                                                              .val(),
                                                          PACS_LEV : 'IMAGE',
                                                          PACS_STU_UID : data2.StudyInstanceUID[j],
                                                          PACS_SER_UID : data2.SeriesInstanceUID[j]
                                                        },
                                                        success : function(
                                                            data3) {
                                                          var idseries = '#series-'
                                                              + data3.SeriesInstanceUID[0]
                                                                  .replace(
                                                                      /\./g,
                                                                      "_");
                                                          $(idseries)
                                                              .text(
                                                                  data3.ProtocolName[0]);
                                                        }
                                                      });
                                                }
                                              }
                                            });
                                      } else {
                                        $('i', this).attr('class',
                                            'icon-chevron-down');
                                        oTable.fnClose(nTr);
                                        anOpen.splice(i, 1);
                                      }
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