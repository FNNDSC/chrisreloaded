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
import sys, os
import json
from argparse import ArgumentParser
from ConfigParser import SafeConfigParser

class Plugin(ArgumentParser):
  '''
  The super class for all valid ChRIS plugins.
  '''

  AUTHORS = 'FNNDSC (dev@babyMRI.org)'
  TITLE = ''
  CATEGORY = ''
  DESCRIPTION = None
  DOCUMENTATION = ''
  LICENSE = ''
  VERSION = ''
  
  IMAGE = 'image'
  INTEGER = 'integer'
  DOUBLE = 'double'
  BOOLEAN = 'boolean'
  STRING = 'string'
  COMBOBOX = 'string-enumeration'

  def __init__(self):
    '''
    The constructor of this plugin.
    '''
    if Plugin.DESCRIPTION is None:
      raise ValueError("Plugin.DESCRIPTION must be set in your plugin code")
    super( Plugin, self ).__init__(description=Plugin.DESCRIPTION)
    self.add_argument( '--xml', action='store_true', dest='xml', default=False, help='show xml description of parameters (default: FALSE)' )
    self.add_argument( '--inputs', action='store_true', dest='inputs', default=False, help='show input parameters which should be copied (default: FALSE)' )
    self.add_argument( '--configuration', action='store', dest='configuration', default="", help='custom userconfiguration in JSON format (default: "")' )
    self.add_argument( '--icon', action='store_true', dest='icon', default=False, help='show the description of this plugin (default: FALSE)' )
    self.add_argument( '--description', action='store_true', dest='description', default=False, help='show the icon path of this plugin (default: FALSE)' )
    self.add_argument( '--output', action='store', dest='output', help='the output directory' )

    #chris-related environment variables
    if 'ENV_CHRISRUN_DIR' in os.environ:
      self.chrisRunDir = os.environ['ENV_CHRISRUN_DIR']
    else:
      self.chrisRunDir = ''
    if 'ENV_CLUSTERTYPE' in os.environ:
      self.clusterType = os.environ['ENV_CLUSTERTYPE']
    else:
      self.clusterType = ''  
    if 'ENV_REMOTEHOST' in os.environ:
      self.remoteHost = os.environ['ENV_REMOTEHOST']
    else:
      self.remoteHost = ''
    if 'ENV_REMOTEUSER' in os.environ:
      self.remoteUser = os.environ['ENV_REMOTEUSER']
    else:
      self.remoteUser = '' 
    if 'ENV_REMOTEUSERIDENTITY' in os.environ:
      self.remoteUserIdentity = os.environ['ENV_REMOTEUSERIDENTITY']
    else:
      self.remoteUserIdentity = '' 
    
    #read plugin configuration file containing the requiered plugin environment variables
    config = SafeConfigParser()
    config.optionxform = str
    current_dir = os.path.dirname(os.path.abspath(__file__))
    config.read(os.path.join(current_dir, 'plugin.conf'))
    self.envVars = config.defaults()
    
    # the custom parameter list
    self.__panels = []
    self.__parameters = []
    self.options = []

    # the initial status
    self.status = 0
    
    # the initial memory
    self.memory = 512

    # is it an inteactive plugin
    self.interactive = False

    # list of inputs to move
    self.inputs = ""    

  def error(self, message):
    '''
    The error handler if wrong commandline arguments
    are specified.
    '''
    print
    sys.stderr.write( 'ERROR: %s\n' % message )
    print
    self.print_help()
    sys.exit( 2 )

  def xml(self, configuration = ""):
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
            if p_type == self.COMBOBOX:
              xml += '<default>' + str( config[parameter[2][2:]][0] ) + '</default>'
            else :
              xml += '<default>' + str( config[parameter[2][2:]] ) + '</default>'
          # else use the default value       
          else :
            xml += '<default>' + str( parameter[3] ) + '</default>'


        if parameter[4]:
          xml += '<description>' + str( parameter[4] ) + '</description>'

        if p_type == self.COMBOBOX:
          if parameter[2][2:] in config:
            # create element entries
            for e in config[parameter[2][2:]]:
              xml += '<element>' + str( e ) + '</element>'
          elif parameter[5]:
            # create element entries
            for e in parameter[5]:
              xml += '<element>' + str( e ) + '</element>'

        xml += end_tag

      xml += '</parameters>\n'

    xml += '</executable>'

    return xml

  def run(self):
    '''
    Execute this plugin (abstract method in this class). 
    '''
    raise NotImplementedError("Plugin.run()")

  def add_parameter(self, panel, type, *args, **kwargs):
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

  def launch(self):
    '''
    This method triggers the parsing of arguments.   
    The run() method gets called if not
     --xml or --inputs
    are specified.
    '''
    options = self.parse_args()

    self.options = options
    if (options.xml):
      # print the xml
      if(options.configuration):
        print(self.xml(options.configuration))
      else:
        print(self.xml())
      return 

    if (options.inputs):
      # print the inputssounds OK to you
      print self.inputs
      return

    # run the plugin
    self.run()

  def validate(self, expected, provided, extension='dcm'):
      '''
      Convenience method to get directory or file name from a directory or a
      file name.
      We can use this method to ensure the plugin will work even the user
      provides a directory instead of a file and vice-versa
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

  def getFilePaths(self, rootDir, extensions=['dcm', 'nii', 'mgz']):
      '''
      Convenience method that searches the directory tree looking for input files with appropriate extensions
      and returns a list of file names.
      It only returns the first dcm file in a directory. For other extensions it returns all
      files in the directory.
      '''
      paths = []
      # find files with good extension within nested dirs
      queue = [rootDir]
      while queue:
        rootDir = queue.pop(0)
        dirList = os.listdir(rootDir)
        dcmFound = False
        for entry in dirList:
          path = os.path.join(rootDir, entry)
          if os.path.isfile(path):
            for extension in extensions:
              if path.endswith(extension):
                if (not extension == 'dcm') or (extension == 'dcm' and not dcmFound):
                  paths.append(path)
                  if extension == 'dcm':
                    dcmFound = True
                  break 
          else:
            queue.append(path)
      return paths

