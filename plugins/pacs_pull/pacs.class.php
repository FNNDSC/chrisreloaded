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
// include the chris configuration
require_once (dirname(dirname(dirname ( __FILE__ ))).'/config.inc.php');
// include the PACS Pull configuration file
require_once (joinPaths(CHRIS_PLUGINS_FOLDER, 'pacs_pull/config.php'));

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
  // filter array
  static public function postFilter($type, $arrayToFilter, $arrayFilter);
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
   * @var string $findscu
   */
  private $findscu = null;

  /**
   * DCMTK MoveSCU binary location.
   *
   * @var string $movescu
   */
  private $movescu = null;

  /**
   * DCMTK EchoSCU binary location.
   *
   * @var string $echoscu
   */
  private $echoscu = null;

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
    $this->findscu = '/usr/bin/findscu';
    $this->movescu = '/usr/bin/movescu';
    $this->echoscu = '/usr/bin/echoscu';
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
  public function ping($timeout = 5){
    $command = $this->echoscu.' -to '.$timeout.' ';

    $this->_finishCommand($command);
    // execute the command, format it into a nice json and return it
    return $this->_executeAndFormat($command);
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
      $output = Array();
      foreach($target['StudyInstanceUID'] as $value){
        $query = $this->movescu;
        $query .= ' --aetitle '.$this->user_aet;
        $query .= ' --move '.DEST_AETITLE;
        $query .= ' --study ';
        $query .= ' -k QueryRetrieveLevel=STUDY';
        $query .= ' -k StudyInstanceUID='.$value;
        $query .= ' '.$this->server_ip;
        $query .= ' '.$this->server_port;
        $query .= ' 2>&1';

        // execute query
        $output[] = $query;

        shell_exec($query);
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
   * @return array containing command which have been executed.
   */
  public function moveSeries(){
    if ((array_key_exists('StudyInstanceUID',$this->command_param) && $this->command_param['StudyInstanceUID'] != null) && (array_key_exists('SeriesInstanceUID',$this->command_param) && $this->command_param['SeriesInstanceUID'] != null) && $this->user_aet != null)
    {
      $command = $this->movescu.' -S';
      $command .= ' --aetitle '.$this->user_aet;
      $command .= ' --move '.DEST_AETITLE;
      $command .= ' -k QueryRetrieveLevel=SERIES';
      $command .= ' -k StudyInstanceUID='.$this->command_param['StudyInstanceUID'];
      $command .= ' -k SeriesInstanceUID='.$this->command_param['SeriesInstanceUID'];
      $command .= ' '.$this->server_ip;
      $command .= ' '.$this->server_port;
      $command .= ' 2>&1';

      // execute query
      $output = shell_exec($command);
      return array('command' => $command,
          'output' => $output);
    }
    return array('command' => '',
        'output' => 'MoveSeries: Missing parameters (Requieres: StudyInstanceUID, SeriesInstanceUID, User AE Title)');
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
    $requiered_fields .= ' +P SeriesDescription';

    // Study Information
    $requiered_fields .= ' +P Modality';
    $requiered_fields .= ' +P StudyDescription';
    $requiered_fields .= ' +P StudyDate';
    $requiered_fields .= ' +P StationName';
    $requiered_fields .= ' +P PatientAge';

    // Patient information
    $requiered_fields .= ' +P PatientName';
    $requiered_fields .= ' +P PatientBirthDate';
    $requiered_fields .= ' +P PatientSex';
    $requiered_fields .= ' +P PatientID';

    $command = '/usr/bin/dcmdump '.$requiered_fields.' '.$filename;

    return PACS::_executeAndFormat($command);
  }

  static public function postFilter($type, $arrayToFilter, $arrayFilter){
    switch($type){
      case "study":
        $output = $arrayToFilter;
        if($arrayToFilter != null){
          // if one study contains the value to be filtered, delete it
          foreach ($arrayFilter as $key => $value){
            if(array_key_exists($key, $arrayToFilter) && $value !=""){
              foreach ($arrayToFilter[$key] as $key2 => $value2){
                // should do regex
                if(strpos($value2,$value) === false){
                  // delete this array
                  foreach ($arrayToFilter as $key3 => $value3){
                    unset($output[$key3][$key2]);
                  }
                }
              }
            }
          }
          // clean array indices
          foreach ($output as $key => $value){
            $output[$key] = array_values($value);
          }
        }

        return $output;
        break;
      case "series":
        break;
      case "image":
        break;
      case "all":
        // filter series and studies
        $output = $arrayToFilter[0];
        $output1 = $arrayToFilter[1];

        // if one series contains the values to be filtered on
        if($arrayToFilter[0] != null && $arrayToFilter[1] != null ){
          // if one series contains the value to be filtered, delete it
          foreach ($arrayFilter as $key => $value){

            if(array_key_exists($key, $arrayToFilter[0]) && $value !=""){
              foreach ($arrayToFilter[0][$key] as $key2 => $value2){
                // should do regex
                if(strpos($value2,$value) === false){
                  // get index related series
                  $index =  array_search($arrayToFilter[0]['StudyInstanceUID'][$key2], $output1['StudyInstanceUID']);
                  // if relates series exist, delete them
                  while($index !== false){
                    foreach ($output1 as $key4 => $value4){
                      unset($output1[$key4][$index]);
                    }
                    $index =  array_search($arrayToFilter[0]['StudyInstanceUID'][$key2], $output1['StudyInstanceUID']);
                  }
                  // delete this array
                  foreach ($arrayToFilter[0] as $key3 => $value3){
                    unset($output[$key3][$key2]);
                  }
                }
              }
            }

            if(array_key_exists($key, $arrayToFilter[1]) && $value !=""){
              foreach ($arrayToFilter[1][$key] as $key2 => $value2){
                // should do regex
                if(strpos($value2,$value) === false){
                  // delete this array
                  foreach ($arrayToFilter[1] as $key3 => $value3){
                    unset($output1[$key3][$key2]);
                  }
                }
              }
            }
          }
          // if we have studies with NO series, delete them
          foreach ($arrayToFilter[0]["StudyInstanceUID"] as $key2 => $value2){
            $index =  array_search($arrayToFilter[0]['StudyInstanceUID'][$key2], $output1['StudyInstanceUID']);
            // if doesnt exist, delete it
            if($index === false){
              foreach ($output as $key4 => $value4){
                unset($output[$key4][$key2]);
              }
            }
          }
        }

        // clean array indices
        // in study
        foreach ($output as $key => $value){
          $output[$key] = array_values($value);
        }
        // in series
        foreach ($output1 as $key => $value){
          $output1[$key] = array_values($value);
        }

        $output2 = Array();
        $output2[] = $output;
        $output2[] = $output1;

        return $output2;
        break;
      default:
        break;
    }
  }

  static public function AddPatient(&$db, &$process_file, &$patient_chris_id){
    $db->lock('patient', 'WRITE');

    if (array_key_exists('PatientID',$process_file))
    {
      $patientMapper = new Mapper('Patient');
      $patientMapper->filter('uid = (?)',$process_file['PatientID'][0]);
      $patientResult = $patientMapper->get();

      if(count($patientResult['Patient']) == 0)
      {
        // create patient model
        $patientObject = new Patient();
        //
        // get patient name
        //
        if(array_key_exists('PatientName',$process_file))
        {
          $patientObject->name = $process_file['PatientName'][0];
        }
        else{
          $patientObject->name = 'NoName';
        }
        //
        // get patient dob
        //
        if(array_key_exists('PatientBirthDate',$process_file))
        {
          $date = $process_file['PatientBirthDate'][0];
          $datetime =  substr($date, 0, 4).'-'.substr($date, 4, 2).'-'.substr($date, 6, 2);
          $patientObject->dob = $datetime;
        }
        else{
          $patientObject->dob = '0000-00-00';
        }
        //
        // get patient sex
        //
        if(array_key_exists('PatientSex',$process_file))
        {
          $patientObject->sex = $process_file['PatientSex'][0];
        }
        else{
          $patientObject->sex = 'NoSex';
        }
        //
        // get patient uid
        //
        $patientObject->uid = $process_file['PatientID'][0];

        // add the patient model and get its id
        $patient_chris_id = Mapper::add($patientObject);
      }
      else {
        // get patient id
        $patient_chris_id = $patientResult['Patient'][0]->id;
      }
    }
    else {
      echo 'Patient MRN not provided in DICOM file';
      // finish patient table lock
      $db->unlock();
      return 0;
    }
    // finish patient table lock
    $db->unlock();
    return 1;
  }

  static public function AddData(&$db, &$process_file, &$data_chris_id, &$series_description){
    $db->lock('data', 'WRITE');
    // Does data exist: SeriesInstanceUID
    if (array_key_exists('SeriesInstanceUID',$process_file))
    {
      // does data (series) exist??
      $dataMapper = new Mapper('Data');
      $dataMapper->filter('uid = (?)',$process_file['SeriesInstanceUID'][0] );
      $dataResult = $dataMapper->get();

      // if doesnt exist, add data
      if(count($dataResult['Data']) == 0)
      {
        // create object
        // create data model
        $dataObject = new Data();
        //
        // get data uid
        //
        $dataObject->uid = $process_file['SeriesInstanceUID'][0];
        //
        // get data name (protocol name)
        //
        if(array_key_exists('ProtocolName',$process_file))
        {
          $dataObject->name = sanitize($process_file['ProtocolName'][0]);
        }
        else{
          $dataObject->name = 'NoProtocolName';
        }
        //
        // get data description (series description)
        //
        if(array_key_exists('SeriesDescription',$process_file))
        {
          $dataObject->description = sanitize($process_file['SeriesDescription'][0]);
        }
        else{
          $dataObject->description = 'NoSeriesDescription';
        }
        $series_description = $dataObject->description.'-'.$dataObject->name;
        //
        // get data time ContentDate-ContentTime
        //
        // date
        $dataObject->time = PACS::getTime($process_file);
        //
        // add the data model to db and get its id
        //
        $data_chris_id = Mapper::add($dataObject);
      }
      else{
        // todo: update time and status here...!
        if($dataResult['Data'][0]->name == ''){
          if(array_key_exists('ProtocolName',$process_file))
          {
            $dataResult['Data'][0]->name = sanitize($process_file['ProtocolName'][0]);
          }
          else{
            $dataResult['Data'][0]->name = 'NoProtocolName';
          }
          $series_description = $dataResult['Data'][0]->description.'-'.$dataResult['Data'][0]->name;
          Mapper::update($dataResult['Data'][0], $dataResult['Data'][0]->id);
        }
        else{
          $series_description = $dataResult['Data'][0]->description.'-'.$dataResult['Data'][0]->name;
        }
        $data_chris_id = $dataResult['Data'][0]->id;
      }
    }
    else {
      echo 'Data UID not provided in DICOM file'.PHP_EOL;
      // finish data table lock
      $db->unlock();
      return 0;
    }
    // finish data table lock
    $db->unlock();
    return 1;
  }

  static public function AddStudy(&$db, &$process_file, &$study_chris_id, &$study_description){

    $db->lock('study', 'WRITE');
    // Does data exist: SeriesInstanceUID
    if (array_key_exists('StudyInstanceUID',$process_file))
    {
      // does study exist??
      $studyMapper = new Mapper('Study');
      $studyMapper->filter('uid = (?)',$process_file['StudyInstanceUID'][0] );
      $studyResult = $studyMapper->get();

      // if study doesn't exist, create it
      if(count($studyResult['Study']) == 0)
      {
        // create object
        // create data model
        $studyObject = new Study();
        //
        // get data uid
        //
        $studyObject->uid = $process_file['StudyInstanceUID'][0];
        //
        // get data name (series description)
        //
        if(array_key_exists('StudyDescription',$process_file))
        {
          $studyObject->description = sanitize($process_file['StudyDescription'][0]);
        }
        else{
          $studyObject->description = 'NoStudyDescription';
        }

        if(array_key_exists('Modality',$process_file))
        {
          $studyObject->modality = sanitize($process_file['Modality'][0]);
        }
        else{
          $studyObject->modality = 'NoModality';
        }

        if(array_key_exists('StudyDate',$process_file))
        {
          $studyObject->date = PACS::getDate($process_file);
        }

        $studyObject->age = PACS::getAge($process_file);
        $studyObject->location = PACS::getLocation($process_file);

        $study_description = formatStudy($studyObject->date, $studyObject->age, $studyObject->description);

        $study_chris_id = Mapper::add($studyObject);
      }
      else{
        // Content to be updated
        if($studyResult['Study'][0]->age == -1){
          //
          // get data name (series description)
          //
          if(array_key_exists('StudyDescription',$process_file))
          {
            $studyResult['Study'][0]->description = sanitize($process_file['StudyDescription'][0]);
          }
          else{
            $studyResult['Study'][0]->description = 'NoStudyDescription';
          }

          if(array_key_exists('Modality',$process_file))
          {
            $studyResult['Study'][0]->modality = sanitize($process_file['Modality'][0]);
          }
          else{
            $studyResult['Study'][0]->modality = 'NoModality';
          }

          $studyResult['Study'][0]->date = PACS::getDate($process_file);
          $studyResult['Study'][0]->age = PACS::getAge($process_file);
          $studyResult['Study'][0]->location = PACS::getLocation($process_file);

          $study_description = formatStudy($studyResult['Study'][0]->date, $studyResult['Study'][0]->age, $studyResult['Study'][0]->description);
          $study_chris_id = $studyResult['Study'][0]->id;

          Mapper::update($studyResult['Study'][0], $studyResult['Study'][0]->id);
        }
        // Content already up to date
        else{
          $study_chris_id = $studyResult['Study'][0]->id;
          $study_description = formatStudy($studyResult['Study'][0]->date, $studyResult['Study'][0]->age, $studyResult['Study'][0]->description);
        }
      }
    }
    else {
      echo 'Study UID not provided in DICOM file'.PHP_EOL;
      // finish data table lock
      $db->unlock();
      return 0;
    }
    // finish data table lock
    $db->unlock();
    return 1;
  }

  static public function getTime($process_file){
    $date = '';
    if(array_key_exists('ContentDate',$process_file) && strlen($process_file['ContentDate'][0]) == 8)
    {
      $raw_date = $process_file['ContentDate'][0];
      $date .=  substr($raw_date, 0, 4).'-'.substr($raw_date, 4, 2).'-'.substr($raw_date, 6, 2);
    }
    else{
      $date .= '0000-00-00';
    }
    //time
    $time = '';
    if(array_key_exists('ContentTime',$process_file) && strlen($process_file['ContentTime'][0]) == 8)
    {
      $raw_time = $process_file['ContentTime'][0];
      $time .=  substr($raw_time, 0, 2).':'.substr($raw_time, 2, 2).':'.substr($raw_time, 4, 2);
    }
    else{
      $time .= '00:00:00';
    }

    return $date.' '. $time;
  }

  static public function getDate($process_file){
    $date = '';
    if(array_key_exists('StudyDate',$process_file) && strlen($process_file['StudyDate'][0]) == 8)
    {
      $raw_date = $process_file['StudyDate'][0];
      $date .=  substr($raw_date, 0, 4).'-'.substr($raw_date, 4, 2).'-'.substr($raw_date, 6, 2);
    }
    else{
      $date .= '0000-00-00';
    }

    return $date;
  }

  static public function getAge($process_file){
    // should we use PatientAge tag???
    $age = '0';
    if(array_key_exists('ContentDate',$process_file) && array_key_exists('PatientBirthDate',$process_file) && strlen($process_file['PatientBirthDate'][0]) == 8)
    {
      $raw_bdate = $process_file['PatientBirthDate'][0];
      $bdate =  new DateTime(substr($raw_bdate, 0, 4).'-'.substr($raw_bdate, 4, 2).'-'.substr($raw_bdate, 6, 2));

      $raw_cdate = $process_file['ContentDate'][0];
      $cdate =  new DateTime(substr($raw_cdate, 0, 4).'-'.substr($raw_cdate, 4, 2).'-'.substr($raw_cdate, 6, 2));

      $raw_age = $bdate->diff($cdate);
      $age = $raw_age->days;
    }

    return $age;
  }

  static public function getLocation($process_file){
    $location = 'unknown';
    if(array_key_exists('StationName',$process_file))
    {
      $location = $process_file['StationName'][0];
    }
    return $location;
  }
}
?>
