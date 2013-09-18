var _MODALTAG_ = _MODALTAG_ || {};

// on open, load tags for this user and store then in an array
_MODALTAG_.tags = [];
_MODALTAG_.selectedTagID = '';
_MODALTAG_.feedID = null;
_MODALTAG_.modal = null;

_MODALTAG_.loadTags = function(){
  // xhr to server -> userid to get tags
  // push to server through API.php
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'api.php', true);

  var data = new FormData();
  data.append('action', 'get');
  data.append('what', 'tag');

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

      // clean gui
      var tagslist = document.querySelector('#tagslist');
      while (tagslist.hasChildNodes()) {
        tagslist.removeChild(tagslist.lastChild);
      }

      // update _MODALTAG_.tags
      tagslist.innerHTML = JSON.parse(xhr.responseText).result.tagshtml;
      _MODALTAG_.tags = JSON.parse(xhr.responseText).result.tags.Tag;
    }
  };

  // GO!
  xhr.send(data);
};

_MODALTAG_.load = function(feedID, modal){
  _MODALTAG_.selectedTagID = '';
  _MODALTAG_.modal = modal;
  _MODALTAG_.feedID = feedID;
  _MODALTAG_.loadTags();
}


_MODALTAG_.feedTagSuccess = function(tagid, feedid){
  // if not already applied, update ui
  if(tagid != -1){

    var tag = document.querySelector("#"+_MODALTAG_.selectedTagID).cloneNode(true);
    tag.classList.remove('inmodal');
    tag.classList.add('infeed');
    tag.style.border = 'none';

    var feed = document.querySelectorAll("[data-chris-feed_id='"+feedid+"']")[0];
    feed.children[0].children[1].children[0].insertBefore(tag);
  }   
}

_MODALTAG_.feedTag = function(){
  if(_MODALTAG_.selectedTagID != ''){

    // loop though ids!
    for (var i = 0; i < _MODALTAG_.feedID.length; i++) {
      (function(i){

        var feedID = _MODALTAG_.feedID[i];
        jQuery.ajax({
          type : "POST",
          url : "api.php",
          dataType : 'json',
          data : {
            action : 'set',
            what : 'tag',
            feedid : feedID,
            tagid : _MODALTAG_.selectedTagID.substring(4),
            remove : false
          },
          success : function(data) {
            _MODALTAG_.feedTagSuccess(data.result, feedID);
          }
        });
      })(i);
    }
    // close the modal
    _MODALTAG_.modal.modal('hide');
  }
}

_MODALTAG_.createTag = function(){
  // get color
  var tagcolor = document.querySelector('#tagcolor');
  // get name
  var tagname = document.querySelector('#tagname');
  if(tagname.value != ''){
    // replace white spaces
    tagname.value = tagname.value.replace(/ /g,"_");
    // if name do not exist
    var unique = true;
    // if name exists
    for (var i = 0; i < _MODALTAG_.tags.length; i++) {
      if(_MODALTAG_.tags[i] != null && tagname.value == _MODALTAG_.tags[i].name){
        unique = false;
        break;
      }
    };
   
    if(unique){
      // push to server through API.php
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'api.php', true);

      var data = new FormData();
      data.append('action', 'add');
      data.append('what', 'tag');
      data.append('tagname', tagname.value);
      data.append('tagcolor', tagcolor.value);

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

          var tagslist = document.querySelector('#tagslist');
          tagslist.innerHTML += JSON.parse(xhr.responseText).result.tagshtml;

          var tagid = JSON.parse(xhr.responseText).result.tags;

          // based on object size for now...
          var tagObj = {id:tagid,
            name:tagname.value,
            color:tagcolor.value};
          // add to list
          _MODALTAG_.tags.push(tagObj);
          // add to search combo box
          var tagslist1 = document.querySelector('#filtertagplugin optgroup');
          tagslist1.innerHTML += '<option value="'+tagname.value+'" data-backgroundcolor="'+JSON.parse(xhr.responseText).result.tagshtml.split('"')[13].split(' ')[1].split(';')[0]+'" data-color="'+JSON.parse(xhr.responseText).result.tagshtml.split('"')[13].split(' ')[3].split(';')[0]+'">'+tagname.value+'</option>';
        }
      };
      // GO!
      xhr.send(data);  
    }
    else{
      window.alert('Tag name already exists!');
    }
  }
  else{
    window.alert('Tag name is empty!');
  }
};