function Feed(user, time, type, details) {
  this.user = user;
  this.time = time;
  this.type = type;
  this.details = details;
  this.main = '';
  var content = '<div class="feed">';
  // setup the preview
  content += '<div class="preview">';
  // setup the image
  content += '<div class="gfx"><img src="view/gfx/';
  switch (this.type) {
  case 'data-down':
    content += 'download500.png';
    this.main += 'Data downloaded from the PACS.';
    break;
  case 'data-up':
    content += 'upload500.png';
    this.main += 'Data uploaded to the PACS.';
    break;
  case 'pipeline-start':
    content += 'play500.png';
    this.main += 'Pipeline started.';
    break;
  default:
    break;
  }
  content += '" class="img-rounded">';
  content += '</div>';
  // setup the title
  content += '<div class="title">';
  // time
  content += '<div class="time">';
  content += this.time + ' ago';
  content += '</div>';
  // name
  content += '<div class="user">';
  content += this.user;
  content += '</div>';
  // close title
  content += '</div>';
  // setup the body
  content += '<div class="main">';
  // main
  content += '<div class="main">';
  content += this.main;
  content += '</div>';
  // more
  content += '<div class="more">';
  content += '<a>More</a>';
  content += '</div>';
  // close body
  content += '</div>';
  // close preview
  content += '</div>';
  content += this.parseDetails();
  // close feed
  content += '</div>';
  // append to feed-content
  jQuery('.feed_content').append(content);
}
Feed.prototype.parseDetails = function() {
  var content = '<div class="details">';
  switch (this.type) {
  case 'data-down':
    content += this.parseData();
    break;
  case 'data-up':
    content += this.parseData();
    break;
  case 'pipeline-start':
    content += this.parsePipeline();
    break;
  default:
    break;
  }
  content += '</div>';
  return content;
}
Feed.prototype.parseData = function() {
  //
  var content = '';
  var data_nb = this.details.Name.length;
  var i = 0;
  for (i = 0; i < data_nb; i++) {
    // css in show/hide div should be there
    content += '<div class="data" style="border-top: 1px solid;border-color: grey;margin-top: 5px;">';
    content += '<i class=" icon-chevron-down"></i>';
    content += this.details.Name[i];
    content += '<span class="pull-right"><i class="icon-star"></i><i class="icon-eye-open"></i><i class="icon-share"></i></span>';
    content += '</div>';
  }
  return content;
}
Feed.prototype.parsePipeline = function() {
  var content = '<div class="pipelines">';
  content += '<b>Pipeline:</b> <a href="pipelines.php">'
      + this.details.Pipeline + '</a><br/>';
  content += '<b>Settings:</b>' + this.details.Settings + '<br/>';
  // class based on %
  content += '<div class="progress progress-striped active" style="margin-bottom: 0px;">';
  content += '<div class="bar bar-success" style="width: '
      + this.details.Status + '%;">';
  content += '<b>' + this.details.Status + '% completed</b>';
  content += '</div>';
  content += '</div>';
  content += '</div>';
  return content;
}
jQuery(".more").live('click', function() {
  // modify
  //alert('Show details!');
  var details = jQuery(this).parent().parent().next();
  var hidden = details.is(':hidden');
  if (hidden) {
    details.show('blind', 500);
  } else {
    details.hide('blind', 500);
  }
});
// more to live
// slide up-down effect
/**
 * Setup the javascript when document is ready (finshed loading)
 */
jQuery(document).ready(function() {
  // create data details
  dataNicolas = {
    Name : null,
    Modality : null,
    Path : null
  };
  dataNicolas.Name = new Array();
  dataNicolas.Name.push('GADO_AXIAL_T1');
  dataNicolas.Name.push('AX_DWI');
  //nicolas = new Feed('Nicolas', '5mn', 'data-down', dataNicolas);
  // create data
  dataRudolph = {
    Pipeline : 'Tractography',
    Settings : 'angle-threshold = 50',
    Status : '100'
  };
  // Rudolph's feed
  // rudolph = new Feed('Rudolph', '15mn', 'pipeline-start', dataRudolph);
  // create pipeline details
  dataDaniel = {
    Pipeline : 'Motion Correction',
    Settings : '',
    Status : '70'
  };
  // Daniel's feed
  // daniel = new Feed('Daniel', '17mn', 'pipeline-start', dataDaniel);
  // create data details
  dataEllen = {
    Name : null,
    Modality : null,
    Path : null
  };
  dataEllen.Name = new Array();
  dataEllen.Name.push('RADIATION_ONCOLOGY_1');
  // Ellen's feed
  // ellen = new Feed('Ellen', '2 days', 'data-up', dataEllen);
});