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
if(!defined('__CHRIS_ENTRY_POINT__')) define('__CHRIS_ENTRY_POINT__', 666);

// include the configuration
if(!defined('CHRIS_CONFIG_PARSED'))
  require_once(dirname(dirname(dirname(__FILE__))).'/config.inc.php');

// include the simpletest chris framework
require_once (SIMPLETEST_CHRIS);
SimpleTest_Chris::setPreference();

// include the controller classes
require_once (joinPaths(CHRIS_CONTROLLER_FOLDER, 'pacs.class.php'));

class TestPACSClass extends UnitTestCase {

  /**
   * Test the ping method
   */

  //! [testPing()]
  public function testPing() {
    // ping a valid host (CHB)
    $server_ip = '134.174.12.21';
    $server_port = 104;

    $pacs_ping = new PACS($server_ip, $server_port);
    $result = $pacs_ping->ping();


    // should return 1 on success
    $this->assertTrue($result == 1);

    // ping unvalid host
    $server_port = 10;
    $pacs_ping2 = new PACS($server_ip, $server_port);
    $result2 = $pacs_ping2->ping();

    // should return 0 on failure
    $this->assertTrue($result2 == 0);
  }

  //! [testPing()]

  /**
   * Test the addParameter method
   */

  //! [testAddParameter()]
  public function testAddParameter() {
    $server_ip = '134.174.12.21';
    $server_port = 104;

    // we add not enough parameter (no user AE Title)
    $pacs_not_enough = new PACS($server_ip, $server_port);
    $pacs_not_enough->addParameter('PatientID', 4562009);
    $result_not_enough = $pacs_not_enough->queryStudy();

    // should return null
    $this->assertTrue($result_not_enough == null);

    // we add enough parameter: AE Title and Query Retrieve Level
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_enough = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_enough->addParameter('PatientID', 4562009);
    $result_enough = $pacs_enough->queryStudy();

    // should return an array containing a 'PatientID' array
    $this->assertTrue(gettype($result_enough['PatientID']) == 'array');

    // we add unknown parameters
    $pacs_fake = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_fake->addParameter('PatientID', 4562009);
    $pacs_fake->addParameter('FakeParameter','IAmAFakeParameter');
    $result_fake = $pacs_fake->queryStudy();

    // should return null
    $this->assertTrue($result_fake == null);
  }

  //! [testAddParameter()]

  /**
   * Test the queryStudy method
   */

  //! [testQueryStudy()]
  public function testQueryStudy() {
    // query on MRN
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_mrn = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_mrn->addParameter('PatientID', 4562009);
    $result_mrn = $pacs_mrn->queryStudy();

    // should return 4 results
    $this->assertTrue(count($result_mrn['PatientID']) == 4);

    // query on name
    $pacs_name = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_name->addParameter('PatientName', 'RONDO^RAJON');
    $result_name = $pacs_name->queryStudy();

    // should return 1 result
    $this->assertTrue(count($result_name['PatientName']) == 1);

    // query on MRN and name
    $pacs_mrn_name = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_mrn_name->addParameter('PatientID', 4562009);
    $pacs_mrn_name->addParameter('PatientName', 'RONDO^RAJON');
    $result_mrn_name = $pacs_mrn_name->queryStudy();

    // MRN should take over, 4 results should be returned then
    $this->assertTrue(count($result_mrn_name['PatientID']) == 4);

    // we add unknown parameters
    $pacs_fake = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_fake->addParameter('PatientID', 4562009);
    $pacs_fake->addParameter('FakeParameter','IAmAFakeParameter');
    $result_fake = $pacs_fake->queryStudy();

    // should return null
    $this->assertTrue($result_fake == null);

    // we add not enough parameter (no user AE Title)
    $pacs_not_enough = new PACS($server_ip, $server_port);
    $pacs_not_enough->addParameter('PatientID', 4562009);
    $result_not_enough = $pacs_not_enough->queryStudy();

    // should return null
    $this->assertTrue($result_not_enough == null);
  }

  //! [testQueryStudy()]
   
  /**
   * Test the querySeries method
   */

  //! [testQuerySeries()]
  public function testQuerySeries() {
    // query in StudyInstanceUID
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_siiud = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_siiud->addParameter('StudyInstanceUID', '1.2.840.113845.11.1000000001785349915.20120409172607.5904669');
    $result_siiud = $pacs_siiud->querySeries();

    // should return 34 results
    $this->assertTrue(count($result_siiud['StudyInstanceUID']) == 34);

    // query on unknown parameter
    $pacs_fake = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_fake->addParameter('FakeParameter','IAmAFakeParameter');
    $result_fake = $pacs_fake->querySeries();

    // should return an empty array
    $this->assertTrue($result_fake == null);

    // we add not enough parameter (no user AE Title)
    $pacs_not_enough = new PACS($server_ip, $server_port);
    $pacs_not_enough->addParameter('PatientID', 4562009);
    $result_not_enough = $pacs_not_enough->querySeries();

    // should return null
    $this->assertTrue($result_not_enough == null);
  }

  //! [testQuerySeries()]

  /**
   * Test the queryImage method
   */

  //! [testQueryImage()]
  public function testQueryImage() {
  }

  //! [testQueryImage()]
   
  /**
   * Test the queryAll method
   */

  //! [testQueryAll()]
  public function testQueryAll() {
    // query on MRN
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_all = new PACS($server_ip, $server_port, $user_aetitle);

    $study_parameter = Array();
    $study_parameter['PatientID'] = '2199064';

    $series_parameter = Array();
    $series_parameter['NumberOfSeriesRelatedInstances'] = '';

    $image_parameter = Array();
    $image_parameter['NumberOfSeriesRelatedInstances'] = '';
    $image_parameter['DeviceSerialNumber']= '';
    $image_parameter['ProtocolName']= '';
    //$image_parameter['SOPInstanceUID']= '';

    $result_all = $pacs_all->queryAll($study_parameter, $series_parameter, $image_parameter);

    // should return an array with all the results
    // $result_all[0] returns the Study results
    // $result_all[1] returns the Series results
    // $result_all[2] returns the Image results
    //$this->assertTrue(count($result_all) == 3);
  }

  //! [testQueryAll()]

  /**
   * Test the moveStudy method
   */

  //! [testMoveStudy()]
  public function testMoveStudy() {
    // move on MRN + Study Date
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_mrn = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_mrn->addParameter('PatientID', 4562009);
    $pacs_mrn->addParameter('StudyDate', 20120508);
    $result_mrn = $pacs_mrn->moveStudy();

    // should return null (no error message)
    $this->assertTrue($result_mrn == null);

    // we add unknown parameters
    $pacs_fake = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_fake->addParameter('PatientID', 4562009);
    $pacs_fake->addParameter('FakeParameter','IAmAFakeParameter');
    $result_fake = $pacs_fake->moveStudy();

    // should return error message
    $this->assertTrue($result_fake != null);

    // we add not enough parameter (no user AE Title)
    $pacs_not_enough = new PACS($server_ip, $server_port);
    $pacs_not_enough->addParameter('PatientID', 4562009);
    $result_not_enough = $pacs_not_enough->moveStudy();

    // should return error message
    $this->assertTrue($result_not_enough != null);
  }

  //! [testMoveStudy()]

  /**
   * Test the moveSeries method
   */

  //! [testMoveSeries()]
  public function testMoveSeries() {
    // move on MRN + Study Date
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs->addParameter('StudyInstanceUID', '1.2.840.113845.11.1000000001785349915.20120508133531.5943861');
    $pacs->addParameter('SeriesInstanceUID', '1.2.840.113619.2.256.896737926219.1336498845.3088');
    $result = $pacs->moveSeries();

    // should return null (no error message)
    $this->assertTrue($result == null);

    // missing StudyInstanceUID
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_miss_study = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_miss_study->addParameter('SeriesInstanceUID', '1.2.840.113619.2.256.896737926219.1336498845.3088');
    $result_miss_study = $pacs_miss_study->moveSeries();

    // should return an error message
    $this->assertTrue($result_miss_study != null);

    // missing SeriesInstanceUID
    $server_ip = '134.174.12.21';
    $server_port = 104;
    $user_aetitle = 'FNNDSC-CHRISDEV';
    $pacs_miss_series = new PACS($server_ip, $server_port, $user_aetitle);
    $pacs_miss_series->addParameter('StudyInstanceUID', '1.2.840.113845.11.1000000001785349915.20120508133531.5943861');
    $result_miss_series = $pacs_miss_series->moveSeries();

    // should return an error message
    $this->assertTrue($result_miss_series != null);

    // missing AE Title
    $pacs_missing_aetitle = new PACS($server_ip, $server_port);
    $pacs_missing_aetitle->addParameter('StudyInstanceUID', '1.2.840.113845.11.1000000001785349915.20120508133531.5943861');
    $pacs_missing_aetitle->addParameter('SeriesInstanceUID', '1.2.840.113619.2.256.896737926219.1336498845.3088');
    $result_missing_aetitle = $pacs_missing_aetitle->moveSeries();

    // should return null (no error message)
    $this->assertTrue($result_missing_aetitle != null);
  }

  //! [testMoveSeries()]
}
?>