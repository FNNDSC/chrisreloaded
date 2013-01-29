<?php
/**
 *
 *            sSSs   .S    S.    .S_sSSs     .S    sSSs
 *           d%%SP  .SS    SS.  .SS~YS%%b   .SS   d%%SP
 *          d%S'    S%S    S%S  S%S   `S%b  S%S  d%S'
 *          S%S     S%S    S%S  S%S    S%S  S%S  S%|
 *          S&S     S%S SSSS%S  S%S    d* S  S&S  S&S
 *          S&S     S&S  SSS&S  S&S   .S* S  S&S  Y&Ss
 *          S&S     S&S    S&S  S&S_sdSSS   S&S  `S&&S
 *          S&S     S&S    S&S  S&S~YSY%b   S&S    `S*S
 *          S*b     S*S    S*S  S*S   `S%b  S*S     l*S
 *          S*S.    S*S    S*S  S*S    S%S  S*S    .S*P
 *           SSSbs  S*S    S*S  S*S    S&S  S*S  sSS*S
 *            YSSP  SSS    S*S  S*S    SSS  S*S  YSS'
 *                         SP   SP          SP
 *                         Y    Y           Y
 *
 *                     R  E  L  O  A  D  E  D
 *
 * (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
 *                   Boston Children's Hospital
 *
 *              http://childrenshospital.org/FNNDSC/
 *                        dev@babyMRI.org
 *
 */

// we define a valid entry point
define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
require_once ('../../config.inc.php');

// include the template class
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'security.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'data.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'feed.controller.php'));
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'user.controller.php'));

// validate the credentials
if (!SecurityC::login()) {
  // invalid credentials
  // destroy the session
  session_destroy();
  die("Access denied.");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="">
<meta name="author" content="">

<link href="../../view/css/bootstrap.min.css" rel="stylesheet">
<link href="../../view/css/jquery-ui-1.8.23.css" rel="stylesheet">

<link href="jquery.dataTables.css" rel="stylesheet">
<link href="pacs.css" rel="stylesheet">
</head>

<body style='background: url("../../view/gfx/background1.jpg")'>

 <div class="container"
  style="margin: 0px auto; padding: 60px 14px 14px 14px; background-image: url(https://twimg0-a.akamaihd.net/a/1344442772/t1/img/wash-white-30.png);">
  <div class="tabbable well">
   <ul class="nav nav-tabs">
    <li class="active"><a href="#tab0" data-toggle="tab">Retrieve data</a>
    </li>
    <li><a href="#tab2" data-toggle="tab">Settings</a></li>
   </ul>
   <div class="tab-content">
    <div class="tab-pane active" id="tab0">
     <div class='row-fluid'>
      <div class='span12'>
       <div class='well'>
        <h2 style="border-bottom: 1px solid; border-color: lightgrey;">Parameters</h2>
        <form id="pacs_form" class="form-inline">
         <input id='PACS_MRN' type="text" class="input-small ssearch"
          placeholder="MRN" value=''> <input id='PACS_NAM' type="text"
          class="input-small ssearch" placeholder="Name" value=''> <input
          id='PACS_DAT' type="text" class="input-small ssearch"
          placeholder="Study Date" value=''>

         <button id="SEARCH" class="btn btn-primary">Query</button>
         <button id="PULL" class="btn btn-success pull-right">Pull
          Selection</button>
         <div id="show_advanced" style="padding-top: 10px;">
          <i class="icon-chevron-down"></i><b>Advanced parameters</b>
         </div>
         <div id="pacs_advanced"
          style="display: none; padding-top: 10px; margin-bottom: -15px; border-top: 1px solid; border-color: lightgrey;">
          <form id="pacs_aform" class="form-inline">
           <input id='PACS_MOD' type="text" class="input-small ssearch"
            placeholder="Modality" value='MR'> <input id='PACS_PSAET'
            type="text" class="input-small asearch"
            placeholder="StationAETitle" value=''> <input
            id='PACS_STU_DES' type="text" class="input-small ssearch"
            placeholder="Study Description" value=''> <input
            id='PACS_SER_DES' type="text" class="input-small ssearch"
            placeholder="Series Description" value=''>
          </form>
         </div>
        </form>

       </div>
      </div>
     </div>
     <div id="PACS-RESULTS" class='row-fluid' style="display: none">
      <div class='span12'>
       <div class='well'>
        <h2>
         Results:
         <div class="btn-group" data-toggle="buttons-radio">
          <button id="STUDY_VIEW" type="button" class="btn btn-primary">Study</button>
          <button id="SERIES_VIEW" type="button"
           class="btn btn-primary active">Series</button>
         </div>
        </h2>
        <div id='SC-RESULTS' class='row-fluid'></div>
       </div>
      </div>
     </div>
    </div>
    <div class="tab-pane" id="tab2">

     <div class='row-fluid'>
      <div class='span6 well'>
       <h1 style="border-bottom: 1px solid; border-color: lightgrey;">
        <img src='view/gfx/jigsoar-icons/dark/48_download.png'
         class="img-rounded">Download
       </h1>
       <div>
        IP / Host Name: <input id='SERVER_IP' type="text"
         value='134.174.12.21' />
       </div>
       <div>
        Port: <input id='SERVER_POR' type="text" value='104' />
       </div>
      </div>
      <div class='span6 well'>
       <h1 style="border-bottom: 1px solid; border-color: lightgrey;">
        <img src='view/gfx/jigsoar-icons/dark/48_users.png'
         class="img-rounded"> User
       </h1>
       AE Title: <input id='USER_AET' type="text"
        value='FNNDSC-CHRISTEST'>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>

 <script type="text/javascript" src="../../view/js/jquery.min.js"></script>
 <script type="text/javascript"
  src="../../view/js/jquery-ui-1.8.23.custom.min.js"></script>
 <script type="text/javascript" src="../../view/js/bootstrap.min.js"></script>

 <script type="text/javascript" src="../../view/js/jquery.backstretch.min.js"></script>

 <script type="text/javascript"
  src="query.dataTables.min.js"></script>
 <script type="text/javascript" src="DT_bootstrap.js"></script>

 <!-- CHRIS PACS -->
 <script type="text/javascript" src="chris.pacs.class.js"></script>
</body>
</html>
