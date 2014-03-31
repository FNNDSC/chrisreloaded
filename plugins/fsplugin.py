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
import shutil, itertools
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
        shell = crun.crun()
        shell.echo(False)
        shell.echoStdOut(True)
        shell.echoStdErr(True)
        shell.detach(False)
        shell.waitForChild(True)
        for cmd, outFileName in itertools.izip(cmdList, self.outputFileNames):
          shell(cmd)
          if str(shell.exitCode()) != "0":
            misc.file_writeOnce(os.path.join(chrisRunDir, 'ERROR-dev-' + outFileName + '.err'), 'Plugin returned error!\n%s' % shell.stderr())
            misc.file_writeOnce(os.path.join(chrisRunDir, 'ERROR-user-' + outFileName + '.err'), userErrStr + ' ' + outFileName)
          else:
            shutil.copyfile(os.path.join(self.tempdir, outFileName), os.path.join(options.output, outFileName))
        
