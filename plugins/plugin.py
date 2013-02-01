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
import argparse
import sys

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

  def __init__( self ):
    '''
    The constructor of this plugin.
    '''
    super( Plugin, self ).__init__( description=Plugin.DESCRIPTION )
    self.add_argument( '--xml', action='store_true', dest='xml', default=False, help='show xml description of parameters (default: FALSE)' )
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

  def xml( self ):
    '''
    Generate the XML user interface for this
    plugin.
    '''
    xml = '<?xml version="1.0" encoding="utf-8"?>\n'

    # extra parameters for the executable
    executable_parameters = "";
    if self.status > 0:
      executable_parameters += ' status="' + str( self.status ) + '"'
    if self.memory > 0:
      executable_parameters+= ' memory="' + str( self.memory ) + '"'
      
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
    xml += '<parameters>\n'
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
          xml += '<constraints><step>0.1</step></constraints>'

        if parameter[3]:
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

    # store the parameter internally
    # (FIFO)
    self.__parameters[len( self.__panels ) - 1].append( [kwargs['dest'], type, flag, default, _help, values] )

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
      print( self.xml() )
    else:
      # run the plugin
      self.run( options )

