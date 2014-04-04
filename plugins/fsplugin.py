#!/usr/bin/env python
#
#                                                            _
# FREESURFER ABSTRACT PLUGIN SUPERCLASS
#
# (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
#                   Boston Children's Hospital
#
#              http://childrenshospital.org/FNNDSC/
#                        dev@babyMRI.org
#


# import the plugin.py superclass
import os, sys
sys.path.append(os.path.dirname(__file__))
from plugin import Plugin
#import utilities
import shutil, itertools, time, subprocess
from tempfile import mkdtemp
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib'))
from  _common import crun
from  _common import systemMisc as misc 


class FsPlugin(Plugin):
    '''
      Base class for Freesurfer plugins (makes it easier to create new
      Freesurfer plugins).
    '''

    def __init__(self):
        super(FsPlugin, self).__init__()
        self.tempdir = ''
        # List of full paths to the input files
        self.inputFilePaths = []
        # List of output file names (just their names, not the full output path)
        self.outputFileNames = []
        
    def copyDataToTempDir(self, options):
        # create temp dir and migrate data
        tempdir = mkdtemp('free', 'surf', os.environ['ENV_CLUSTER_TMP_DIR'])
        if os.path.isfile(options.input) and options.input.endswith('dcm'):
          # copy the directory content 
          copyDir = os.path.dirname(options.input)
          shutil.copytree(copyDir, tempdir + '/mri/' + os.path.basename(copyDir))
        elif os.path.isfile(options.input) and not options.input.endswith('dcm'):
          copyDir = os.path.dirname(options.input)
          os.mkdir(tempdir + '/mri/')
          os.mkdir(tempdir + '/mri/' + os.path.basename(copyDir))
          shutil.copy(options.input, tempdir + '/mri/' + os.path.basename(copyDir))
        else:
          copyDir = options.input
          shutil.copytree(copyDir, tempdir + '/mri/' + os.path.basename(copyDir))
        self.tempdir = tempdir
        # set list of input file paths
        l_extensions = options.extensions.split(',')
        self.inputFilePaths = self.getFilePaths(self.tempdir + '/mri/', l_extensions)
        # set list of output file names
        for filePath in self.inputFilePaths:
          if filePath.endswith('dcm'):
            # the output file name is the parent directory name
            basename_new = os.path.basename(os.path.dirname(filePath)) + '.' + options.format
          else:
            # grab just the file name
            basename = os.path.splitext(os.path.basename(filePath))[0]
            # add output extension
            basename_new = basename + '.' + options.format
          self.outputFileNames.append(basename_new)
      
    def removeTempDir(self):
        shutil.rmtree(self.tempdir)
    
    def execCmd(self, options, userErrStr='Plugin returned error!', cmdList=None):
        if (cmdList is None):
            raise ValueError("A list of cmd strings must be passed on")
        chrisRunDir = os.environ['ENV_CHRISRUN_DIR']
        cmdIds = []
        exitCodeFilePaths = [];
        envFile = open(chrisRunDir + '/chris.env')
        envStr = envFile.read()
        envFile.close()
        for cmd, outFileName in itertools.izip(cmdList, self.outputFileNames):  
          #create stderr, stdout, and exit code log for each cmd execution
          ix = outFileName.rfind('.')
          cmdId = outFileName[:ix]
          cmdIds.append(cmdId)
          out = '%s/%s' % (chrisRunDir, cmdId)
          exitCodeFilePaths.append(out + '-exitCode.log')
          cmd = '%s 2>%s.err >%s.std || (echo $? > %s-exitCode.log);touch %s.log' % (cmd, out, out, out, out)
          misc.file_writeOnce(out + '.run', envStr + '\n' + cmd)
          os.system('chmod 755 ' + out + '.run')
        remUser = os.environ['ENV_REMOTEUSER']
        clType = os.environ['ENV_CLUSTERTYPE']
        remHost = os.environ['ENV_REMOTEHOST']
        remUserId = os.environ['ENV_REMOTEUSERIDENTITY']
        if clType == 'MOSIX':
            shell = crun.crun_hpc_mosix(remoteUser=remUser, remoteHost=remHost, remoteUserIdentity=remUserId)
        elif clType == 'HP-LSF':
            shell = crun.crun_hpc_lsf(remoteUser=remUser, remoteHost=remHost, remoteUserIdentity=remUserId)
        elif clType == 'torque-based':
            shell = crun.crun_hpc_launchpad(remoteUser=remUser, remoteHost=remHost, remoteUserIdentity=remUserId)
        else:
            raise ValueError('Unknown cluster type')
        for cmdId in cmdIds:
          shell("/bin/bash " + chrisRunDir + '/' + cmdId + '.run', waitForChild=shell.waitForChild(), stdoutflush=True, stderrflush=True)
          time.sleep(0.5)
        #execute while loop until all cmds have written a file with a name cmdId.log in the chris run dir
        allHaveWritten = False
        while not allHaveWritten:
          dirList = os.listdir(chrisRunDir)
          #list of cmd ids found in the chris run dir 
          foundCmdIds = []
          for cmdId in cmdIds:
            for name in dirList:
              if name == cmdId + '.log':
                foundCmdIds.append(cmdId)
                #remove found dummy log file
                os.remove(chrisRunDir + '/' + name)
                break;
          if len(foundCmdIds) == len(cmdIds):
            allHaveWritten = True
          else:
            for cmdId in foundCmdIds:
              #remove already found ids
              cmdIds.remove(cmdId)
            time.sleep(10)
        for path, outFileName in itertools.izip(exitCodeFilePaths, self.outputFileNames):  
          # check for existence of chrisRunDir/cmdId-exitCode.log
          if os.path.isfile(path):
            rfile = open(path)
            if rfile.read(1) == "0":
              shutil.copyfile(os.path.join(self.tempdir, outFileName), os.path.join(options.output, outFileName))
            else:
              misc.file_writeOnce(os.path.join(chrisRunDir, 'ERROR-user-' + outFileName + '.err'), userErrStr + ' ' + outFileName)
            rfile.close()
          else:
            shutil.copyfile(os.path.join(self.tempdir, outFileName), os.path.join(options.output, outFileName))
            
