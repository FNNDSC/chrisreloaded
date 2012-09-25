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
// prevent direct calls
if (!defined('__CHRIS_ENTRY_POINT__')) die('Invalid access.');

// interface
interface PACSInterface
{
  // constructor with 3 parameters
  public function __construct($server_ip, $server_port, $user_aet = null);
  // method to png server
  public function ping($timeout);
  // method to add parameters to the query
  public function addParameter($name, $value);
  // method to the query the PACS for a study
  public function queryStudy();
  // method to the query the PACS for a series
  public function querySeries();
  // method to the query the PACS for a series
  public function queryImage();
  // method to the query the PACS for a mrn studies, series and images
  public function queryAll($studyParameters, $seriesParameters, $imageParameters);
  // method to the retrieve study
  public function moveStudy();
  // method to the retrieve series
  public function moveSeries();
  // method to process result received by the listener
  static public function process($filename);
}

/**
 * Set of functionnalities to easily interact with the PACS.
 *
 * @example test.pacs.class.php
 *
 */
class PACS implements PACSInterface {

  /**
   * User AE Title
   *
   * @var string $user_aet
   */
  private $user_aet = null;

  /**
   * Server IP.
   *
   * @var string $server_ip
   */
  private $server_ip = null;

  /**
   * Server port.
   *
   * @var string $server_port
   */
  private $server_port = null;

  /**
   * Parameters to build the query command.
   *
   * @var string $command_param
   */
  private $command_param = Array();

  /**
   * DCMTK FindSCU binary location.
   *
   * @var string $command_findscu
   */
  private $command_findscu = null;

  /**
   * DCMTK MoveSCU binary location.
   *
   * @var string $command_movescu
   */
  private $command_movescu = null;

  /**
   * The constructor.
   * Instantiate a PACS object with the given parameters.
   *
   * @param[in] $server_ip IP of the PACS.
   * @param[in] $server_port Port of the PACS.
   * @param[in] $user_aet User AE Title.
   */
  public function __construct($server_ip, $server_port, $user_aet = null) {
    $this->server_ip = $server_ip;
    $this->server_port = $server_port;
    $this->user_aet = $user_aet;
    $this->findscu = joinPaths(CHRIS_DCMTK, 'findscu');
    $this->movescu = joinPaths(CHRIS_DCMTK, 'movescu');
  }

  /**
   * Ping the PACS.
   *
   * Ping the PACS to make sure the provided address and port are correct.
   *
   * @param[in] int $timeout number of seconds before timeout.
   * @return json string 1 if server has been successfully responded. 0 if server didn't answer within time.
   *
   * @snippet test.pacs.class.php testPing()
   */
  public function ping($timeout = 1){
    $server_name = gethostbyaddr($this->server_ip);

    // initiate a socket connnection to the PACS
    // @ to silence the warnings
    if ($fp = @fsockopen($server_name,$this->server_port, $errCode,$errStr,$timeout)) {
      //success
      return 1;
      fclose($fp);
    }
    else{
      // failure
      return 0;
      //return $errStr;
    }
  }

  /**
   * Add parameter to the command to be executed.
   *
   * @param[in] string $name Name of the parameter.
   * @param[in] string $value Value of the parameter.
   * @param[in] boolean $force Replace parameter if it is already defined.
   *
   * @snippet test.pacs.class.php testAddParameter()
   */
  public function addParameter($name, $value, $force = false){
    if (!array_key_exists($name,$this->command_param) || $force)
    {
      $this->command_param[$name] = $value;
    }
  }

  /**
   * Clean all the parameters from the command to be executed.
   */
  public function cleanParameter(){
    unset($this->command_param);
    $this->command_param = Array();
  }

  /**
   * Query PACS on studies.
   *
   * The query is built based on the $this->command_param.
   *
   * @return Array well formated array output based on the input parameters.
   * returns null is nothing was found for given command parmeters.
   *
   * $pacs->addParameter('StudyDate', $_POST['PACS_DAT']);
   * $pacs->addParameter('AccessionNumber', $_POST['PACS_ACC_NUM']);
   * $pacs->addParameter('QueryRetrieveLevel', $_POST['PACS_LEV']);
   * $pacs->addParameter('RetrieveAETitle', $_POST['USER_AET']);
   * $pacs->addParameter('ModalitiesInStudy', $_POST['PACS_MOD']);
   * $pacs->addParameter('StudyDescription', $_POST['PACS_STU_DES']);
   * $pacs->addParameter('PatientName', $_POST['PACS_NAM']);
   * $pacs->addParameter('PatientID', $_POST['PACS_MRN']);
   * $pacs->addParameter('PatientBirthDate', '');
   * $pacs->addParameter('StudyInstanceUID', $_POST['PACS_STU_UID']);
   *
   * returns
   *
   *{"StudyDate":["20120409","20120410","20120508","20120614"],"AccessionNumber":["22357404","22358447","22378058","22405112"],"QueryRetrieveLevel":["STUDY ","STUDY ","STUDY ","STUDY "],"RetrieveAETitle":["PACSDCM ","PACSDCM ","PACSDCM ","PACSDCM "],"ModalitiesInStudy":["MR","MR","US","US"],"StudyDescription":["MR-Brain w\/o Contrast + Spectroscopy","MR-Angiogram Head w\/o Contrast","US-Hips Infant DDH","US-Hips Infant DDH"],"PatientName":["ROECKER^GRAYSON ","ROECKER^GRAYSON ","ROECKER^GRAYSON ","ROECKER^GRAYSON "],"PatientID":["4562009 ","4562009 ","4562009 ","4562009 "],"PatientBirthDate":["20120407","20120407","20120407","20120407"],"StudyInstanceUID":["1.2.840.113845.11.1000000001785349915.20120409172607.5904669","1.2.840.113845.11.1000000001785349915.20120410221336.5906623","1.2.840.113845.11.1000000001785349915.20120508133531.5943861","1.2.840.113845.11.1000000001785349915.20120614100408.5992897"]}
   *
   * @snippet test.pacs.class.php testQueryStudy()
   */
  public function queryStudy(){
    if ($this->user_aet != null)
    {
      // build the command
      // dcmtk findcsu binaries
      // -xi: proposed transmission transfer syntaxes:
      // propose implicit VR little endian TS only
      $command = $this->findscu.' -xi';

      // if MRN provided, we query at Patient Root level (-P)
      if (array_key_exists('PatientID',$this->command_param) && $this->command_param['PatientID'] != '')
      {
        $command .= ' -P';
      }
      else{
        $command .= ' -S';
      }
      $command .= ' --aetitle '.$this->user_aet;

      // add base parameters
      $this->addParameter('QueryRetrieveLevel', 'STUDY');
      $this->addParameter('StudyInstanceUID', '');

      PACS::_parseParam($this->command_param, $command);

      $this->_finishCommand($command);
      
      echo $command;

      // execute the command, format it into a nice json and return it
      return $this->_executeAndFormat($command);
    }
    return null;
  }

  /**
   * Query PACS on series.
   *
   * The query is built based on the $this->command_param.
   *
   * @return Array well formated array output based on the input parameters.
   * returns null is nothing was found for given command parmeters.
   *
   * @snippet test.pacs.class.php testQuerySeries()
   */
  public function querySeries(){
    if ($this->user_aet != null)
    {
      // build the command
      // dcmtk findcsu binaries
      // -xi: proposed transmission transfer syntaxes:
      // propose implicit VR little endian TS only
      $command = $this->findscu.' -xi';
      $command .= ' -S';
      $command .= ' --aetitle '.$this->user_aet;

      // add base parameters
      $this->addParameter('QueryRetrieveLevel', 'SERIES');
      $this->addParameter('StudyInstanceUID', '');
      $this->addParameter('SeriesInstanceUID', '');

      PACS::_parseParam($this->command_param, $command);
      $this->_finishCommand($command);
      
      echo $command;

      return $this->_executeAndFormat($command);
    }
    return null;
  }

  /**
   * Query PACS on image.
   *
   * The query is built based on the $this->command_param.
   *
   * @return Array well formated array output based on the input parameters.
   * returns null is nothing was found for given command parmeters.
   *
   * @snippet test.pacs.class.php testQueryImage()
   */
  public function queryImage(){
    if ($this->user_aet != null)
    {
      // build the command
      // dcmtk findcsu binaries
      // -xi: proposed transmission transfer syntaxes:
      // propose implicit VR little endian TS only
      $command = $this->findscu.' -xi';
      $command .= ' -S';
      $command .= ' --aetitle '.$this->user_aet;

      // add base parameters
      $this->addParameter('QueryRetrieveLevel', 'IMAGE');
      $this->addParameter('StudyInstanceUID', '');
      $this->addParameter('SeriesInstanceUID', '');

      PACS::_parseParam($this->command_param, $command);

      $this->_finishCommand($command);

      echo $command;

      return $this->_executeAndFormat($command);
    }
    return null;
  }

  /**
   * Query PACS on everything. (study, series, image)
   *
   * @param[in] $studyParameters parameters for the study query
   * @param[in] $seriesParameters parameters for the series query
   * @param[in] $imageParameters parameters for the image query
   *
   * @return Array well formated array output based on the input parameters.
   * Array[0] is the study results, Array[1] is the series results, Array[2] is the image results
   *
   * @snippet test.pacs.class.php testQueryAll()
   */
  public function queryAll($studyParameters, $seriesParameters, $imageParameters){

    // initiate arrays which will be returned
    $result = Array();
    // Study array
    $result[] = Array();
    // Series array
    $result[] = Array();
    // Image array
    $result[] = Array();

    // append query parameters and values
    foreach( $studyParameters as $key => $value)
    {
      $this->addParameter($key, $value);
    }
    $resultquery = $this->queryStudy();
    $this->_appendResults($result[0], $resultquery);

    // loop though studies
    if ($resultquery != null && array_key_exists('StudyInstanceUID',$resultquery))
    {
      foreach ($resultquery['StudyInstanceUID'] as $key => $studyvalue){
        $this->cleanParameter();
        foreach( $seriesParameters as $key => $value)
        {
          $this->addParameter($key, $value);
        }
        $this->addParameter('StudyInstanceUID', $studyvalue);

        $resultseries = $this->querySeries();
        $this->_appendResults($result[1], $resultseries);

        // loop though images
        if ($imageParameters != null && $resultseries != null &&  array_key_exists('StudyInstanceUID',$resultseries))
        {
          $j = 0;
          foreach ($resultseries['StudyInstanceUID'] as $key => $seriesvalue){
            $this->cleanParameter();
            foreach( $imageParameters as $key => $value)
            {
              $this->addParameter($key, $value);
            }
            $this->addParameter('StudyInstanceUID', $seriesvalue);
            $this->addParameter('SeriesInstanceUID', $resultseries['SeriesInstanceUID'][$j]);
            $resultimage = $this->queryImage();
            $this->_appendResults($result[2], $resultimage);
          }
          ++$j;
        }
      }
    }
    return $result;
  }

  /**
   * Convenience method to append array to another array.
   *
   * @param array $base array in which we will add data
   * @param array $toappend array which will be added to base
   *
   */
  private function _appendResults(&$base, &$toappend)
  {
    // if base is empty, don't append, just copy
    if(empty($base)){
      $base = $toappend;
    }
    // if base is not empty, append
    else{
      foreach ($toappend as $key => $value){
        $base[$key] = array_merge($base[$key], $toappend[$key]);
      }
    }
  }

  /**
   * Convenience method to finish the command to be executed. Append the command parameters, the PACS IP and the PACS port.
   *
   * @param string $command command to be finished.
   *
   */
  private function _finishCommand(&$command)
  {
    // add host and port
    $command .= ' '.$this->server_ip;
    $command .= ' '.$this->server_port;
    // redirect stderr to stdout since the useful information is inside stderr
    $command .= ' 2>&1';
  }

  /**
   * Convenience method to parse parameters and add it to the command.
   *
   * @param [in] array $param array containing parameters to be parsed.
   * @param  string $command command to update.
   *
   */
  static private function _parseParam(&$param, &$command){
    // append query parameters and values
    foreach( $param as $key => $value)
    {
      //if value provided
      if($value){
        $command .= ' -k "'.$key.'='.$value.'"';
      }
      // if value not provided
      else{
        $command .= ' -k '.$key;
      }
    }
  }

  /**
   * Convenience method to parse each output line.
   *
   * @param array $array array containing well formated output.
   * @param[in] string $lines array containing line to be parsed.
   * @param int  $i counter to keep track of line to be parsed.
   *
   */
  static private function _parseEOL(&$array, &$lines, &$i)
  {
    //check for error in result (if line starts with E)
    if(preg_match("/^E/", $lines[$i])){
      ++$i;
      return;
    }
    // begin of result line
    // increment counter by 4 to go to the result data
    if($lines[$i] == 'W: ---------------------------'){
      // go to data
      $i += 5;
      return;
    }

    // end of result data
    // increment counter by 2 to go to the next result line
    if($lines[$i] == 'W: '){
      // go to next result data
      ++$i;
      return;
    }

    // process result line

    // 1- get field (last word in line)
    $split_array = explode(' ', $lines[$i]);
    $split_num = count($split_array);
    $field = $split_array[$split_num-1];
    // add field to results array
    PACS::_addKey($array, $field);

    // 2- get value
    // value should be formated as follow
    // [VALUE]
    $tmpsplit = split('\[', $lines[$i]);
    // we didn't find any "[": no value was provided
    if(count($tmpsplit) == 1){
      $array[$field][] =  'nvp';
    }
    // else, finish splitting and append value to result array
    else{
      $value = split('\]', $tmpsplit[1]);
      $array[$field][] =  $value[0];
    }

    ++$i;
  }

  /**
   * Convenience method to initiate array for given key.
   *
   * If the key already exists, do not do anything.
   *
   * @param array $output array to be updated.
   * @param string $key key to be added.
   *
   */
  static private function _addKey(&$output, &$key)
  {
    if (!array_key_exists($key,$output))
    {
      $output[$key] = Array();
    }
  }


  /**
   * Convenience method to execute the command and format the output.
   *
   * @param[in] string $command command to execute.
   *
   * @return Array well formated array output based on the input parameters.
   * returns null is nothing was found for given command parmeters.
   *
   */
  static private function _executeAndFormat(&$command)
  {
    // execute query
    $command_output = shell_exec($command);

    // parse output
    // split each line output
    $lines = split("\n", $command_output);
    $i = 0;
    $count = count($lines) - 1;
    $output = Array();

    while ($i < $count) {
      PACS::_parseEOL($output, $lines, $i);
    }

    // return null if array is enpty (prolly a wrong parameter)
    if(empty($output)){
      return null;
    }

    return $output;
  }

  /**
   * Retrieve Study from the PACS.
   *
   * The command is built based on the $this->command_param.
   * It performs a classic query and retrieves the returned StudyUIDs.
   *
   * @snippet test.pacs.class.php testMoveStudy()
   *
   * @return string null if success or error message if failure
   */
  public function moveStudy(){

    // execute query to get related StudyUID
    $target = $this->queryStudy();

    // Retrieve all Studies by StudyUID
    if ($target != null)
    {
      $output = '';
      foreach($target['StudyInstanceUID'] as $value){
        $query = $this->movescu;
        $query .= ' --aetitle '.$this->user_aet;
        $query .= ' --move '.$this->user_aet;
        $query .= ' --study ';
        $query .= ' -k "QueryRetrieveLevel=STUDY"';
        $query .= ' -k "StudyInstanceUID='.$value.'"';
        $query .= ' '.$this->server_ip;
        $query .= ' '.$this->server_port;
        $query .= ' 2>&1';

        // execute query
        echo $query;
        $output .= shell_exec($query);
      }
      return $output;
    }
    return 'PACS Study Query failed';
  }

  /**
   * Retrieve Series from the PACS.
   *
   * The command is built based on the $this->command_param.
   * StudyInstanceUID and SeriesInstanceUID must have been provided.
   *
   * @snippet test.pacs.class.php testMoveStudy()
   *
   * @return string null if success or error message if failure
   */
  public function moveSeries(){
    if ((array_key_exists('StudyInstanceUID',$this->command_param) && $this->command_param['StudyInstanceUID'] != null) && (array_key_exists('SeriesInstanceUID',$this->command_param) && $this->command_param['SeriesInstanceUID'] != null) && $this->user_aet != null)
    {
      $command = $this->movescu.' -S';
      $command .= ' --aetitle '.$this->user_aet;
      $command .= ' --move '.$this->user_aet;
      $command .= ' -k "QueryRetrieveLevel=SERIES"';
      $command .= ' -k "StudyInstanceUID='.$this->command_param['StudyInstanceUID'].'"';
      $command .= ' -k "SeriesInstanceUID='.$this->command_param['SeriesInstanceUID'].'"';
      $command .= ' '.$this->server_ip;
      $command .= ' '.$this->server_port;
      $command .= ' 2>&1';

      // execute query
      $output = shell_exec($command);
      return $output;
    }
    return 'MoveSeries: Missing parameters (Requieres: StudyInstanceUID, SeriesInstanceUID, User AE Title)';
  }

  // process data once something has been received by the listener
  static public function process($filename){
    // Image information
    $requiered_fields = '+P StudyInstanceUID';
    $requiered_fields .= ' +P SeriesInstanceUID';
    $requiered_fields .= ' +P SOPInstanceUID';
    $requiered_fields .= ' +P ProtocolName';
    $requiered_fields .= ' +P ContentDate';
    $requiered_fields .= ' +P ContentTime';
    $requiered_fields .= ' +P InstanceNumber';

    // Patient information
    $requiered_fields .= ' +P PatientName';
    $requiered_fields .= ' +P PatientBirthDate';
    $requiered_fields .= ' +P PatientSex';
    $requiered_fields .= ' +P PatientID';

    $command = CHRIS_DCMTK.'dcmdump '.$requiered_fields.' '.$filename;

    return PACS::_executeAndFormat($command);
  }
}
?>