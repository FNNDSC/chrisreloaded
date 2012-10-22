#!/usr/bin/env python
#
# Fyborg plugin for ChRIS reloaded
#
#   ___         __
# .'  _|.--.--.|  |--..-----..----..-----.
# |   _||  |  ||  _  ||  _  ||   _||  _  |
# |__|  |___  ||_____||_____||__|  |___  |
#       |_____|                    |_____|
#
# THE ULTIMATE SCALAR MAPPING FRAMEWORK FOR TRACKVIS (.TRK) FILES
#
# (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
#                   Boston Children's Hospital
#
#              http://childrenshospital.org/FNNDSC/
#                        dev@babyMRI.org
#

# import the plugin.py superclass
import sys
sys.path.append( '../' )
from plugin import Plugin

class Fyborg( Plugin ):
  '''
  '''
  Plugin.AUTHORS = 'FNNDSC (dev@babyMRI.org)'
  Plugin.TITLE = 'Fyborg'
  Plugin.CATEGORY = 'Diffusion'
  Plugin.DESCRIPTION = 'Fyborg - the ultimate Scalar Mapping Framework for TrackVis (.trk) Files'
  Plugin.DOCUMENTATION = 'http://wiki'
  Plugin.LICENSE = 'Opensource (MIT)'
  Plugin.VERSION = '0.1'
  Plugin.ICON = 'gfx.png'

  def run( self, options ):
    # do whatever
    print 'running fyborg'

# ENTRYPOINT
if __name__ == "__main__":
  plugin = Fyborg()
  plugin.add_parameter( Plugin.IMAGE, '--t1', action='store', dest='T1', help='the T1 scan' )
  plugin.add_parameter( Plugin.IMAGE, '--dti', action='store', dest='DTI', help='the DTI scan' )
  plugin.launch( sys.argv )
