#!/usr/bin/env python
#
# Unit tests for the Fetal MRI Motion Correction plugin 
#
#
# (c) 2012 Fetal-Neonatal Neuroimaging & Developmental Science Center
#                   Boston Children's Hospital
#
#              http://childrenshospital.org/FNNDSC/
#                        dev@babyMRI.org
#

import unittest
import imp, os, sys
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, '../'))
from plugin import Plugin
fm = imp.load_source('fetalmoco', os.path.join(current_dir, 'fetal_moco'))

class FetalMocoTests(unittest.TestCase):
    """Test fixture"""
    def setUp(self):
          plugin = fm.FetalMoco()
          plugin.add_parameter( 'Input', Plugin.IMAGE, '--imagedir', action='store',
                                dest='ImageDir', help='The images directory' )
          plugin.launch()
          
    def testRun(self):
        self.failUnless(False)


if __name__ == '__main__':
    unittest.main()
