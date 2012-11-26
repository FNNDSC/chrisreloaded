#!/usr/bin/env python
#
# PACS pull plugin for ChRIS reloaded
#
#  _ __   __ _  ___ ___   _ __  _   _| | |
# | '_ \ / _` |/ __/ __| | '_ \| | | | | |
# | |_) | (_| | (__\__ \ | |_) | |_| | | |
# | .__/ \__,_|\___|___/ | .__/ \__,_|_|_|
# |_|                    |_|              
#
#
#
# (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
#                   Boston Children's Hospital
#
#              http://childrenshospital.org/FNNDSC/
#                        dev@babyMRI.org
#

# import the plugin.py superclass
import os, sys
sys.path.append( os.path.join(os.path.dirname(__file__), '../') )
from plugin import Plugin

class Fyborg( Plugin ):
  '''
  '''
  Plugin.AUTHORS = 'FNNDSC (dev@babyMRI.org)'
  Plugin.TITLE = 'Pacs query'
  Plugin.CATEGORY = 'PACS'
  Plugin.DESCRIPTION = 'Query data from your PACS - Needs some configuration with your PACS admin'
  Plugin.DOCUMENTATION = 'http://wiki'
  Plugin.LICENSE = 'Opensource (MIT)'
  Plugin.VERSION = '0.1'

  def run( self, options ):
    # do whatever
    print 'running pacs pull'

# ENTRYPOINT
if __name__ == "__main__":
  plugin = Fyborg()
  plugin.add_parameter( 'Input', Plugin.IMAGE, '--t1', action='store', dest='T1', help='the T1 scan' )
  plugin.add_parameter( 'Input', Plugin.IMAGE, '--dti', action='store', dest='DTI', help='the DTI scan' )
  plugin.add_parameter( 'Advanced', Plugin.INTEGER, '--radius', action='store', default=3, dest='Radius', help='the look-around Radius' )
  plugin.launch( sys.argv )
