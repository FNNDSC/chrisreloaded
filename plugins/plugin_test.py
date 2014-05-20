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
import sys, os
import datetime as d
import smtplib
from email.mime.text import MIMEText

# include crun
sys.path.append(os.path.join(os.path.dirname(__file__), '../lib'))
from  _common import crun
from  _common import systemMisc as misc

class PluginTest():

    def __init__(self):

        self.parser = argparse.ArgumentParser(description='Run plugins after deployment.')
        self.parser.add_argument('--run', action='store_true', dest='run', default=False)
        self.parser.add_argument('--report', action='store_true', dest='report', default=False)
        self.parser.add_argument('--runandreport', action='store_true', dest='runandreport', default=False)

        # user that will ssh to the cluster to run tests
        # needs a passwordless ssh to the cluster
        self.user = {'name':'chris.test',
                     'password':'chris1234',
                     'directory':'/net/tautona/neuro/labs/grantlab/users/chris/users/chris.test',
                     'emailFrom':'chris.test@childrens.harvard.edu',
                     'emailTo':['nicolas.rannou@childrens.harvard.edu', 'jorge.bernal@childrens.harvard.edu', 'rudolph.pienaar@childrens.harvard.edu']}

        # data location
        self.data = {'dcmt1':'/net/tautona/neuro/labs/grantlab/users/chris/users/chris.test/data/dicom/t1',
                     'dcmt2':'/net/tautona/neuro/labs/grantlab/users/chris/users/chris.test/data/dicom/t2',
                     'dcmdti': '/net/tautona/neuro/labs/grantlab/users/chris/users/chris.test/data/dicom/diffusion',
                     'niit1': '/net/tautona/neuro/labs/grantlab/users/chris/users/chris.test/data/dicom/diffusion'}

        # location of the launcher
        self.launcher = '/neuro/users/chris/src/chrisreloaded_experimental/controller/launcher.php'

        # test to be run
        # ideally, each plugin should return the params and we should test all the combinations...
        self.plugins = [{'name':'mri_convert',
                         'executable':'/neuro/users/chris/src/chrisreloaded_experimental/plugins/mri_convert/mri_convert',
                         'args': '--input ' + self.data['dcmt1'] + ' --format nii',
                         'file': 't1.nii'},
                        {'name':'mri_deface',
                         'executable':'/neuro/users/chris/src/chrisreloaded_experimental/plugins/mri_deface/mri_deface',
                         'args': '--input ' + self.data['dcmt1'] + ' --format nii --prefix \"defaced-\" --extensions \"nii,mgz,dcm,mgh\"',
                         'file': 't1.nii'},
                        {'name':'tractography',
                         'executable':'/neuro/users/chris/src/chrisreloaded_experimental/plugins/tractography/tractography',
                         'args': '--dti ' + self.data['dcmdti'] + ' --anglethreshold 35 --recalgo FACT --immodel DTI --m1 DWI --m1lowerthreshold 0 --m1upperthreshold 1 --m2 FA --m2lowerthreshold 0 --m2upperthreshold 1 --b0 1',
                         'file': '4351904_log/tract_meta-stage-2-dcm2trk.bash/final-trackvis/4351904.trk'}]

    def launch(self):
        print '-->launch<--'
        options = vars(pluginTest.parser.parse_args())
        if options['run']:
            self.run()
        if options['report']:
            self.report()
        if options['runandreport']:
            self.runandreport()

    def run(self):
        # we can pass a list of names
        # default is all!
        # start all plugins
        
        print '-->run<--'
        
        # use crun to run all jobs
        shell = crun.crun()
        shell.echo(False)
        shell.echoStdOut(True)
        shell.echoStdErr(True)
        shell.detach(False)
        shell.waitForChild(True)

        for obj in self.plugins:
            # feedname is the date
            command = 'php ' + self.launcher
            command += ' --username=' + self.user['name']
            command += ' --password=' + self.user['password']
            command += ' --feedname=' + d.datetime.now().strftime("%Y%m%d%H%M%S")
            command += ' --feedid=-1'
            command += ' --command="' + obj['executable'] + ' ' + obj['args'] + ' --output {OUTPUT}"'
            print command
            shell(command)

    def findLatestFeed(self,pluginDir):
        latestFeed = ''
        feedID = 0
        for dir in os.listdir(pluginDir):
            splittedFile = dir.split('-')
            length = len(splittedFile) - 1
            if length > 0 :
                fileID = splittedFile[length]
                if int(fileID)  > feedID:
                    feedID = int(fileID)
                    latestFeed = dir
        
        return latestFeed

    def report(self):
        # we can pass a list of names
        # default is all!
        print '-->report<--'
        report = ''

        for obj in self.plugins:
            pluginDir = self.user['directory'] + '/' + obj['name']
 
            latestFeed = self.findLatestFeed(pluginDir);
            latestDirFull = pluginDir + '/' + latestFeed
            file = latestDirFull + '/' + obj['file']
            success = os.path.isfile(file)
            report += '<h3>' + obj['name'] + '</h3>'
            report += '<b>in directory</b></br><i>' + latestDirFull  + '</i></br>'
            report += '<b>looking for file</b></br><i>' + file + '</i></br>'
            if success == True:
                report += '<b>success?</b></br><b style="color:green">' + str(success) + '</b></br>'
            else:
                report += '<b>success?</b></br><b style="color:red">' + str(success) + '</b></br>'
            #not needed yet....
            # to allow wildcard
            #[n for n in glob(pattern) if os.path.isfile(n)]

        # email detailed report: last run
        message = 'From: ' + self.user['name'] + ' <' +  self.user['emailFrom'] + '>\n'
        message += 'To: ChRIS Administrators\n'
        message += 'MIME-Version: 1.0\n'
        message += 'Content-type: text/html\n'

        message += 'Subject: BCH plugin test results\n\n'

        message += report

        s = smtplib.SMTP('localhost')
        s.sendmail(self.user['emailFrom'], self.user['emailTo'], message)
        s.quit()


    def runandreport(self):
        #
        # leverage crun to wait for jobs PIDS to finish
        print '-->runandreport<--'
        print 'NOT IMPLEMENTED YET'

# ENTRYPOINT
if __name__ == "__main__":
    # parseargs
    pluginTest = PluginTest()
    pluginTest.launch()
