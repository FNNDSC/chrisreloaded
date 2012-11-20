#!/usr/bin/env python
# 
# NAME
#
#	CMail_drive.py
#
# DESCRIPTION
#
# 	A simple 'driver' for a C_Mail class instance
#
# HISTORY
#
# 11 January 2007
# o Initial development implementation.
#

import C_mail

CMail = C_mail.C_mail()

lstr_to		= ['rudolph.pienaar@childrens.harvard.edu']
str_subject	= "test email"
str_body	= open("/chb/users/rudolphpienaar/.bashrc", 'r').read()
str_from        = "chris@chris.tch.harvard.edu"
lstr_attach	= ['./plugin.png', 'feed.png']

CMail.mstr_SMTPserver = "localhost"
CMail.send(     to=lstr_to, subject=str_subject, body=str_body, 
                sender=str_from, attach=lstr_attach)

