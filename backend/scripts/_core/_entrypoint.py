#
# ChRIS reloaded - The argument parser.
#
# (c) 2012 FNNDSC, Boston Children's Hospital
#

import argparse
import sys

from _colors import Colors
import config

class Entrypoint( argparse.ArgumentParser ):

  def __init__( self, description ):
    '''
    The constructor.
    '''
    print( '' )
    print( '     >> ' + Colors.PURPLE + ' ChRIS *reloaded* ' + Colors._CLEAR + ' <<' )
    print( '' )

    super( Entrypoint, self ).__init__( description )

  def error( self, message ):
    '''
    Use our own parser to always show help on errors.
    '''
    print( '' )
    sys.stderr.write( 'ERROR: %s\n' % message )
    print( '' )
    self.print_help()
    print( '' )
    sys.exit( 2 )
