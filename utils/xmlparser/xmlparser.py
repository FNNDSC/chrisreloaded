#!/usr/bin/env python
#

# system imports
import argparse

# PARSE XML
from xml.dom import minidom
from xml.dom import Node
from xml.parsers.expat import ExpatError

"""
Helper
"""
def getText(nodelist):
    rc = []
    for node in nodelist:
        if node.nodeType == node.TEXT_NODE:
            rc.append(node.data)
    return ''.join(rc)

"""
Parser
"""
def parse(filename):
    """
    Parse the xml file
    """
    try:
        doc = minidom.parse(filename)
    except ExpatError:
        print('Ooooops.....\nCannot parse XML file.\nMake sure your input is valid.')
        # error
        return 0

    patientRecord_list = doc.getElementsByTagName('PatientRecord')

    for patientRecord in patientRecord_list:
        print('============\nNext Patient\n============')
        for node in patientRecord.childNodes:
            if node.nodeType == Node.ELEMENT_NODE:
                print('%s : %s' % (node.tagName, getText(node.childNodes)))
    # success
    return 1

"""
Main function
"""
if __name__ == "__main__":
    parser = argparse.ArgumentParser( description='This the Chris2 XML parser. We use it to parse a xml file then fill the database' )

    # build
    parser.add_argument( '-i', '--input',
                        action='store',
                        dest='input',
                        default='',
                        required=True,
                        help='XML file to be parsed.' )
                    
    options = parser.parse_args()

    parse(options.input)