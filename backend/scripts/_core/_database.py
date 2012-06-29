#
# ChRIS reloaded - Python Database Interface
#
# (c) 2012 FNNDSC, Boston Children's Hospital
#

import MySQLdb

from _colors import Colors
import config

class Database( object ):
  '''
  '''

  def __init__( self ):
    '''
    '''
    self.__connection = None


  def connect( self ):
    '''
    Connect to the database.
    '''

    # connect
    self.__connection = MySQLdb.connect ( host=config.SQL_HOST,
                        user=config.SQL_USERNAME,
                        passwd=config.SQL_PASSWORD,
                        db=config.SQL_DATABASE )

    # grab the database version
    database_version = self.execute( 'SELECT VERSION()' )[0][0]

    print( Colors.ORANGE + 'Connected to ' + Colors.CYAN + config.SQL_HOST + Colors.ORANGE + ' running ' + Colors.CYAN + 'MySQL ' + str( database_version ) + Colors.ORANGE + '!' + Colors._CLEAR )


  def close( self ):
    '''
    Close the database connection.
    '''

    # only close if there is an open connection
    if self.__connection:
      self.__connection.close()


  def execute( self, query ):
    '''
    Execute a SQL query and return all results.
    '''

    # jump out if we are not connected
    if not self.__connection:
      print( Colors.RED + 'Not connected!' + Colors._CLEAR )
      return

    # grab a cursor
    cursor = self.__connection.cursor()
    cursor.execute( query )

    # .. and store the results
    results = cursor.fetchall()

    # close the cursor
    cursor.close()

    # and return everything
    return results
