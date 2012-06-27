#!/usr/bin/env python

#
# ChRIS reloaded - The ultimate christifier!!
#
# (c) 2012 FNNDSC, Boston Children's Hospital
#

import os
import pprint
import re
import sys

from _core import *


class Christifier( object ):
  '''
  The Christifier.
  '''

  def run( self, options ):
    '''
    Pass the args and perform the actions.
    '''

    # by default, use the current working directory
    current_directory = os.getcwd()

    # if a directory is specified, use it
    if options.directory:
      current_directory = options.directory

    # let's now locate where we are

    # we can find either 'scan' or 'result' followed by a number after a slash
    matcher = re.compile( config.CHRIS_FILESYSTEM + 'scan' + os.sep + '\d+|' + config.CHRIS_FILESYSTEM + 'result' + os.sep + '\d+' )

    # apply the mask
    match_result = matcher.findall( current_directory )

    if not match_result:
      print( Colors.RED + 'Could not christify ' + Colors.CYAN + current_directory + Colors.RED + '!' )
      print( '' )
      sys.exit( 2 )

    # grab the type (scan or result) and the id
    match_result = match_result[0].split( os.sep )
    id = match_result[-1]
    type = match_result[-2]

    # now let's query the database
    database = Database()
    database.connect()
    if type == 'scan':
      pprint.pprint( database.execute( 'SELECT * FROM scan as s, patient as p WHERE s.id = ' + id + ' AND s.patient_id = p.id' ), sys.stdout, 2 )
    elif type == 'result':
      pprint.pprint( database.execute( 'SELECT * FROM result_scan as r, scan as s, patient as p WHERE r.result_id = ' + id + ' AND r.scan_id = s.id AND s.patient_id = p.id' ), sys.stdout, 2 )

    database.close()





#
# entry point
#
if __name__ == "__main__":
  entrypoint = Entrypoint( description=Colors.ORANGE + 'Query the ' + Colors.CYAN + 'ChRIS' + Colors.ORANGE + ' database for information on the current or a specified directory.' + Colors._CLEAR )

  # the arguments
  entrypoint.add_argument( '-d', '--directory', action='store', dest='directory', help='The directory to christify. DEFAULT: Current working directory.' )

  # .. parse them
  options = entrypoint.parse_args()

  christifier = Christifier()
  christifier.run( options )
