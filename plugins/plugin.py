'''
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
'''
import  argparse
import  json
import  sys, os
import  itertools
# import  popen2, fcntl, select
# from    subprocess          import  *

from    _pymodules          import  message
from    _pymodules          import  misc

class Plugin( argparse.ArgumentParser ):
    '''
    The super class for all valid ChRIS plugins.
    '''
    IMAGE = 'image'
    INTEGER = 'integer'
    DOUBLE = 'double'
    BOOLEAN = 'boolean'
    STRING = 'string'
    COMBOBOX = 'string-enumeration'


    def inputDir(self, *args):
        '''
        get/set the plugin input directory name. This directory
        contains the data to be processed.
        
        If called with no arguments, will return the current 
        self._str_inputDir, otherwise will set the self variable. In this 
        case, the method performs a quick check on the validity of the 
        passed directory. If passed argument is not a valid directory
        string, set the internal self._b_inputDir to False.

        '''
        if len(args):
            if os.path.isdir(args[0]):
                self._str_inputDir  = args[0]
                self._b_inputDir    = True
            else:
                self._b_inputDir    = False
        else:
            return self._str_inputDir


    def outputDir(self, *args):
        '''
        get/set the plugin output directory name. This directory
        will contain the output result tree of the plugin.
        
        If called with no arguments, will return the current 
        self._str_outputDir, otherwise will set the self variable. In this 
        case, the method performs a quick check on the validity of the 
        passed directory. If passed argument is not a valid directory
        string, set the internal self._b_outputDir to False.

        '''
        if len(args):
            if os.path.isdir(args[0]):
                self._str_outputDir = args[0]
                self._b_outputDir   = True
            else:
                self._b_outputDir   = False
        else:
            return self._str_outputDir


    def log(self, *args):
        '''
        get/set the internal pipeline log message object.

        Caller can further manipulate the log object with object-specific
        calls.
        '''
        if len(args):
            self._log = args[0]
        else:
            return self._log

    
    def __init__( self ):
      '''
      The constructor of this plugin.
      '''
      super( Plugin, self ).__init__( description=Plugin.DESCRIPTION )
      self.add_argument( '--xml', action='store_true', dest='xml', default=False, help='show xml description of parameters (default: FALSE)' )
      self.add_argument( '--configuration', action='store', dest='configuration', default="", help='custom userconfiguration in JSON format (default: "")' )
      self.add_argument( '--icon', action='store_true', dest='icon', default=False, help='show the description of this plugin (default: FALSE)' )
      self.add_argument( '--description', action='store_true', dest='description', default=False, help='show the icon path of this plugin (default: FALSE)' )
      self.add_argument( '--output', action='store', dest='output', help='the output directory' )
    
      # the custom parameter list
      self.__panels = []
      self.__parameters = []
    
      # the initial status
      self.status = 0
      
      # the initial memory
      self.memory = 512
      
      # is it an interactive plugin
      self.interactive = False
    
      # file to track plugin data access
      self._str_historyFile = 'chris.history'
      
      # plugin input and output directory components, as well as misc
      # objects
      self._str_inputDir    = ''
      self._b_inputDir      = False
      self._str_outputDir   = ''
      self._b_outputDir     = False
      self._str_cmd         = ''
      self._log             = message.Message()
    
    def error( self, message ):
      '''
      The error handler if wrong commandline arguments
      are specified.
      '''
      print
      sys.stderr.write( 'ERROR: %s\n' % message )
      print
      self.print_help()
      sys.exit( 2 )
    
    def xml( self, configuration = "" ):
      '''
      Generate the XML user interface for this
      plugin.
      '''
    
      #read/format configuration;
      config = {}
      if(configuration != ""):
        config = json.loads(configuration);
    
      xml = '<?xml version="1.0" encoding="utf-8"?>\n'
    
      # extra parameters for the executable
      executable_parameters = "";
      if self.status > 0:
        executable_parameters += ' status="' + str( self.status ) + '"'
      if self.memory > 0:
        executable_parameters+= ' memory="' + str( self.memory ) + '"'
      if self.interactive == True:
        executable_parameters+= ' interactive="' + str( self.interactive ) + '"'
        
      xml += '<executable ' + executable_parameters + '>\n'
      xml += '<category>' + Plugin.CATEGORY + '</category>\n'
      xml += '<title>' + Plugin.TITLE + '</title>\n'
      xml += '<description>' + Plugin.DESCRIPTION + '</description>\n'
      xml += '<version>' + Plugin.VERSION + '</version>\n'
      xml += '<documentation-url>' + Plugin.DOCUMENTATION + '</documentation-url>\n'
      xml += '<license>' + Plugin.LICENSE + '</license>\n'
      xml += '<contributor>' + Plugin.AUTHORS + '</contributor>\n'
      xml += '<version>' + Plugin.VERSION + '</version>\n'
      
      # create the output channel
      xml += '<parameters hidden="true">\n'
      xml += '<label>Output Parameters</label>\n'
      xml += '<directory>\n'
      xml += '<channel>output</channel>\n'
      xml += '<longflag>output</longflag>\n'
      xml += '<label>The output folder</label>\n'
      xml += '<description>The output folder</description>\n'
      xml += '</directory>\n'
      xml += '</parameters>\n'
    
      # loop through the panels and their parameters
      for i, panel in enumerate( self.__panels ):
        parameters = self.__parameters[i]
    
        if panel.upper().find( 'ADVANCED' ) != -1:
          xml += '<parameters advanced="true">\n'
        elif panel.upper().find( 'HIDDEN' ) != -1:
          xml += '<parameters hidden="true">\n'
        else:
          xml += '<parameters>\n'
        xml += '<label>' + panel + '</label>\n'
    
        for parameter in parameters:
          p_type = parameter[1]
    
          tag = '<' + p_type + '>'
          end_tag = '</' + p_type + '>\n'
    
          xml += tag
          xml += '<label>' + parameter[0].replace( '_', ' ' ) + '</label>'
          xml += '<longflag>' + parameter[2] + '</longflag>'
    
          if p_type == self.DOUBLE:
            
            step = 0.1
            if parameter[6]:
              step = parameter[6]
            
            xml += '<constraints><step>'+str(step)+'</step></constraints>'
    
          if parameter[3]:
            # if element has a user specific configuration, use the provided value
            if parameter[2][2:] in config:
              xml += '<default>' + str( config[parameter[2][2:]] ) + '</default>'
            # else use the default value       
            else :
              xml += '<default>' + str( parameter[3] ) + '</default>'
    
    
          if parameter[4]:
            xml += '<description>' + str( parameter[4] ) + '</description>'
    
          if p_type == self.COMBOBOX and parameter[5]:
            # create element entries
            for e in parameter[5]:
              xml += '<element>' + str( e ) + '</element>'
    
          xml += end_tag
    
        xml += '</parameters>\n'
    
      xml += '</executable>'
    
      return xml
    
    def run( self, options ):
      '''
      Execute this plugin. Access to all passed
      options is available. 
      '''
      print( 'No action defined!' )
    
    def add_parameter( self, panel, type, *args, **kwargs ):
      '''
      Add a parameter to this plugin. The type let's the
      XML generator distinguish between different parameter
      types.
      
      Valid types so far:
        Plugin.IMAGE
      '''
      # store the panel name if it doesn't exist
      if not panel in self.__panels:
        self.__panels.append( panel )
        self.__parameters.append( [] )
    
      # grab the default value
      default = None
      _help = None
      if 'default' in kwargs:
        default = kwargs['default']
      if 'help' in kwargs:
        _help = kwargs['help']
    
      # grab the flag (required)
      flag = args[0]
    
      # check if we have values set (for a collection of choices)
      values = None
      if 'values' in kwargs:
        values = kwargs['values']
        del kwargs['values']
        
      step = None
      if 'step' in kwargs:
        step = kwargs['step']
        del kwargs['step']
    
      # store the parameter internally
      # (FIFO)
      self.__parameters[len( self.__panels ) - 1].append( [kwargs['dest'], type, flag, default, _help, values, step] )
    
      # add the argument to the parser
      self.add_argument( *args, **kwargs )
    
    def launch( self, args ):
      '''
      This method triggers the parsing of arguments.
      
      The run() method gets called if not
       --xml
      are specified.
      '''
      options = self.parse_args()
    
      if ( options.xml ):
        # print the xml
        if( options.configuration ):
          print( self.xml(options.configuration) )
        else:
          print( self.xml() )
      else:
        # run the plugin
        self.run( options )
    
    def validate(self, expected, provided, extension='dcm'):
        '''
        Convenience method that performs certain housekeeping
        pre-processing tasks.
        
        These tasks include:
        * getting directory or file name from a directory or a
          file name -- used to ensure that plugins that expect
          a directory input will still work when fed a file input.
        
        '''
        if expected == 'directory':
          # we were not provided a directory, get file parent directory
          if os.path.isfile(provided):
            provided = os.path.dirname(provided)
          return provided
        else:
          # we were not provided a directory, get file parent directory
          if os.path.isdir(provided):
            # find first file with good extension
            for files in os.listdir(provided):
              if files.endswith(extension):
                provided = os.path.join(provided, files)
                break
          return provided
      
    def history_mark(self, **kwargs):
        '''
        This method tracks operations and meta-information on data and
        processes.
        
        Its primary purposes is to provide a direct path linking an output
        feed directory to the input data that was used. In the case of 
        a DICOM data source, the tagging includes information such as the
        MRN, StudyDescription, and SeriesDescription. 
        
        Each plugin that operates on data in a directory will append to
        the history file. In this manner, it should always be possible to
        relate an output process to each operation that transformed it, all 
        the way back to the original source.
        
        PRECONDITIONS:
        * If input directory does not contain a history file, a new one
          is created.
        
        POSTCONDITIONS:
        * History file is 'tagged' with plugin specific info, and copied to
          output directory (which becomes the input directory for next
          processing block).
        
        '''
        
        _str_inputFileName  = ''
        _str_inputDir       = ''
        _str_outputDir      = ''
        for key, val in kwargs.iteritems():
            if key == 'inputfile'   : _str_inputFileName    = val
            if key == 'inputdir'    : _str_inputDir         = val   
            if key == 'outputdir'   : _str_outputDir        = val
        if len(_str_inputFileName):
            self.inputDir(os.path.dirname(_str_inputFileName))
        if len(_str_inputDir):
            self.inputDir(_str_inputDir)
        self.outputDir(_str_outputDir)

        log                 = self.log()
        log.to('%s/%s' % (self.outputDir(), self._str_historyFile), 
               filemode = 'a')
        log.syslog(True)
        
        _str_inputBasename, _str_inputExt = os.path.splitext(_str_inputFileName)
        if _str_inputExt == '.dcm':
            self.history_dcmInit(**kwargs)


    def history_dcmInit(self, **kwargs):
        '''
        Processes a DICOM file for meta information which is written 
        to the history file.
        
        PRECONDITIONS
        * inputfile ends in '.dcm'
        * log object has been created/initialized
        
        '''
        log = self.log()
        print('outputDir = %s' % self.outputDir())
        print('self._str_historyFile = %s' % self._str_historyFile)
        log.tagstring('DCMINFO--> ')

        _str_inputFileName  = ''
        for key, val in kwargs.iteritems():
            if key == 'inputfile'   : _str_inputFileName    = val
        if len(_str_inputFileName):
            fstr_dcmdump = lambda _str:\
                "dcmdump +P %s %s              |\
                 awk -F\[ '{print $2}'         |\
                 awk -F\] '{print $1}'         |\
                 sed 's/[]|&+=:;<{([)}> ]*//g' |\
                 tr -d '\n'" % \
                 (_str, _str_inputFileName)
            MRN,   stderr, exit     = \
                misc.shell(fstr_dcmdump('PatientID'))
            Study, stderr, code     = \
                misc.shell(fstr_dcmdump('StudyDescription'))
            Series, stderr, exit    = \
                misc.shell(fstr_dcmdump('SeriesDescription'))
            log('\n')
            log('%20s%60s\n' % ('MRN',    MRN))
            log('%20s%60s\n' % ('Study',  Study))
            log('%20s%60s\n' % ('Series', Series))
            log('\n')
            print('%s:%s:%s' % (MRN, Study, Series))
        else:
            misc.file_writeOnce(self._str_historyFile, 
                                  'No input file specified.\n')
        
            
    def history_pluginIndex(self, astr_historyFile):
        '''
        Parses the history file for the latex plugin tag, and determines
        the index.
        
        PRECONDITIONS
        * History file where a plugin tag is of format:

            PLUGIN_XYZ_
            
        The '-' before and after the plugin index are critical and used
        as validity check.
        
        POSTCONDITIONS
        * The 'index' of the latest plugin. This is found by parsing the
          final line of the history file, and parsing the 'PLUGIN_XX' string
          for 'XX'.
          
        RETURNS
        * The plugin index if found, or zero -- as ints.
        '''
        index = -1
        str_lastLine = misc.tail(astr_historyFile, 1)
        l = str_lastLine.split('_')
        if len(l) >= 3:
            str_index = l[1]
            index = int(str_index.split()[0])
        return index
        
    
    ## The following (mostly static) methods have been lifted from
    ## systemMisc.py and extend the Plugin class with some miscellaneous
    ## (typically filesystem-based) methods.
    
    ## start of http://code.activestate.com/recipes/52296/ }}}
    ## Some mods by RP
#     @staticmethod
#     def makeNonBlocking(fd):
#         fl = fcntl.fcntl(fd, fcntl.F_GETFL)
#         try:
#             fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NDELAY)
#         except AttributeError:
#             fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NDELAY)
#             
#     @staticmethod
#     def shell(command, **kwargs):
#         """
#             Runs 'command' on the underlying shell and keeps the stdout and
#             stderr stream separate.
#      
#             Returns [stdout, stderr, exitCode]
#         """
#         b_stdoutflush       = False
#         b_stderrflush       = False
#         b_waitForChild      = True
#         for key, val in kwargs.iteritems():
#             if key == 'stdoutflush':        b_stdoutflush   = val
#             if key == 'stderrflush':        b_stderrflush   = val
#             if key == 'waitForChild':       b_waitForChild  = val
#         child = popen2.Popen3(command, 1) # capture stdout and stderr from command
#         child.tochild.close()             # don't need to talk to child
#         outfile = child.fromchild 
#         outfd = outfile.fileno()
#         errfile = child.childerr
#         errfd = errfile.fileno()
#         Plugin.makeNonBlocking(outfd)            # don't deadlock!
#         Plugin.makeNonBlocking(errfd)
#         outdata = errdata = ''
#         outeof = erreof = 0
#         while b_waitForChild:
#             ready = select.select([outfd,errfd],[],[]) # wait for input
#             if outfd in ready[0]:
#                 outchunk = outfile.read()
#                 if b_stdoutflush: sys.stdout.write(outchunk)
#                 if outchunk == '': outeof = 1
#                 outdata = outdata + outchunk
#             if errfd in ready[0]:
#                 errchunk = errfile.read()
#                 if b_stderrflush: sys.stderr.write(errchunk)
#                 if errchunk == '': erreof = 1
#                 errdata = errdata + errchunk
#             if outeof and erreof: break
#             select.select([],[],[],.1) # give a little time for buffers to fill
#         err = child.wait()
#         return outdata, errdata, err
#     
#     @staticmethod
#     def shellne(command):
#         """
#             Runs 'commands' on the underlying shell; any stderr is echo'd to the
#             console.
#      
#             Raises a RuntimeException on any shell exec errors.
#         """
#             
#         child = os.popen(command)
#         data = child.read()
#         err = child.close()
#         if err:
#             raise RuntimeError, '%s failed w/ exit code %d' % (command, err)
#         return data
#     ## end of http://code.activestate.com/recipes/52296/ }}}
#     
#     @staticmethod
#     def mkdir(newdir, mode=0775):
#         """
#         works the way a good mkdir should :)
#             - already exists, silently complete
#             - regular file in the way, raise an exception
#             - parent directory(ies) does not exist, make them as well
#         """
#         if os.path.isdir(newdir):
#             pass
#         elif os.path.isfile(newdir):
#             raise OSError("a file with the same name as the desired " \
#                           "dir, '%s', already exists." % newdir)
#         else:
#             head, tail = os.path.split(newdir)
#             if head and not os.path.isdir(head):
#                 mkdir(head)
#             #print "_mkdir %s" % repr(newdir)
#             if tail:
#                 os.mkdir(newdir)
#                 #print "chmod %d %s" % (mode, newdir)
#                 #os.chmod(newdir, mode)
#     
#     # From stackoverflow, answered Sep 25 '08 at 21:43 by S.Lott
#     # http://stackoverflow.com/questions/136168/get-last-n-lines-of-a-file-with-python-similar-to-tail
#     @staticmethod
#     def tail( f, window=20 ):
#         BUFSIZ = 1024
#         f.seek(0, 2)
#         bytes = f.tell()
#         size = window
#         block = -1
#         data = []
#         while size > 0 and bytes > 0:
#             if (bytes - BUFSIZ > 0):
#                 # Seek back one whole BUFSIZ
#                 f.seek(block*BUFSIZ, 2)
#                 # read BUFFER
#                 data.append(f.read(BUFSIZ))
#             else:
#                 # file too small, start from begining
#                 f.seek(0,0)
#                 # only read what was not read
#                 data.append(f.read(bytes))
#             linesFound = data[-1].count('\n')
#             size -= linesFound
#             bytes -= BUFSIZ
#             block -= 1
#         return '\n'.join(''.join(data).splitlines()[-window:])         
#         
#     @staticmethod
#     def file_exists(astr_fileName):
#         try:
#             fd = open(astr_fileName)
#             if fd: fd.close()
#             return True
#         except IOError:
#             return False
#     
#     @staticmethod
#     def file_writeOnce(astr_fileName, astr_val, **kwargs):
#         '''
#         Simple "one-shot" writer. Opens <astr_fileName>
#         and saves <astr_val> to file, then closes
#         file.
#         '''
#         
#         _str_mode = 'w'
#         for key, val in kwargs.iteritems():
#             if key == 'mode':   _str_mode   = val
#         
#         FILE = open(astr_fileName, _str_mode)
#         FILE.write(astr_val)
#         FILE.close()
