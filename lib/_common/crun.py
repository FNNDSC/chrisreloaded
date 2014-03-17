#!/usr/bin/env python
# 
# NAME
#
#        crun
#
# DESCRIPTION
#
#        'crun' is functor family of scripts for running command line
#        apps on a cluster.
#
# HISTORY
#
# 25 January 2012
# o Initial design and coding.
#

# System imports
import os
import sys
import getpass
import socket

# FNNDSC imports
import systemMisc as misc
import C_mail

class crun(object):
    """
        This family of functor classes provides a unified interface
        to running shell-commands in several contexts:
        
            - locally on the underlying OS
            - remote host via ssh 
            - remote cluster via scheduler 

        If the baseclass is "run", no cluster scheduling is performed
        and a straightforward remote exec via ssh is executed.
        
        If a scheduler subclass is "run", the shell command is scheduled
        and executed on the cluster.
        
        If the parent caller does not need to explicitly wait on the child,
        the crun.detach() method will decouple the child completely. The
        parent would then need some child- or operation-specific 
        mechanism to determine if the child has finished executing.
        
        By default, the child will not detach and the parent will wait/block
        on the call.
    """    

    _dictErr = {
        'queueInfoFail'   : {
            'action'        : 'trying to access the scheduler queue, ',
            'error'         : 'no handler for this cluster type has been derived.',
            'exitCode'      : 10},
    }

    def description(self, *args):
        '''
        Get / set internal object description.
        '''
        if len(args):
            self._str_desc = args[0]
        else:
            return self._str_desc
    
    def FreeSurferUse(self, *args):
        if len(args):
            self._b_FreeSurferUse = args[0]
        else:
            return self._b_FreeSurferUse

    def FSversion(self, *args):
        if len(args):
            self._str_FSversion = args[0]
        else:
            return self._str_FSversion

    def FSdevsource(self, *args):
        if len(args):
            self._str_FSdevsource = args[0]
        else:
            return self._str_FSdevsource

    def FSdevsource(self, *args):
        if len(args):
            self._str_FSdevsource = args[0]
        else:
            return self._str_FSdevsource

    def sourceEnv(self, *args):
        self._b_sourceEnv       = True
        if len(args):
            self._b_sourceEnv   = args[0]

    def sourceEnvCmd(self, *args):
        if len(args):
            self._str_sourceEnvCmd = args[0]
        else:
            return self._str_sourceEnvCmd

    def FSinit(self, **kwargs):
        '''
        Get / set the FS related initialization parameters.

        Returns a dictionary of internal values if called as
        as getter. This allows for one crun object to be FSinit'd
        by another:

            crun1.FSinit(**crun2.FSinit())

        will assign <crun1> the FS internals of <crun2>. This assumes,
        obviously, that <crun2> has been initializes already with
        appropriate values  FS values.
        '''
        numArgs = 0
        for key, val in kwargs.iteritems():
            numArgs += 1
            if key == 'FSversion'       : self._str_FSversion           = val
            if key == 'FSdevsource'     : self._str_FSdevsource         = val
            if key == 'FSstablesource'  : self._str_FSstablesource      = val
        if not numArgs:
            return {
                'FSversion'             : self._str_FSversion,
                'FSdevsource'           : self._str_FSdevsource,
                'FSstablesource'        : self._str_FSstablesource
                }

    def FSsubjDir(self, **kwargs):
        '''
        This method is responsible for translating FS subject dirs 
        defined in a local filesystem to a corresponding dir on
        a remote filesystem that might have a different user
        home directory.
        '''
        numArgs = 0
        for key, val in kwargs.iteritems():
            numArgs += 1
            if key == 'localSubjDir':   str_localSubjdir = val
            if key == 'remoteHome':     str_remoteHome   = val
        if not numArgs:
            return self._str_FSsubjDir
        str_whoami      = getpass.getuser()
        l_dir = str_localSubjdir.split(str_whoami)
        if len(l_dir) > 1:
            str_rest = str_whoami.join(l_dir[1:])
            self._str_FSsubjDir = str_remoteHome + "/" + str_rest
        else:
            self._str_FSsubjDir = str_localSubjdir

    def FS_cmd(self, astr_cmd):
        '''
        Wraps the passed <astr_cmd> in FS-aware wrapping.
        This assumes that astr_cmd is fully qualified, i.e.
        if a scheduler prefix is required, this should already
        have been generated.

        <astr_cmd> is essentially the command just before
        a non-FS shell would have executed it.
        '''
        self._str_FScmd = "(cd %s ; " % self._str_FSsubjDir
        if self._str_FSversion  == 'dev':
            if len(self._str_FSdevsource):
                self._str_FScmd += self._str_FSdevsource + "; "
        else:
            if len(self._str_FSstablesource):
                self._str_FScmd += self._str_FSstablesource + "; "
        self._str_FScmd += astr_cmd + ")"
        return self._str_FScmd

        
    def __init__(self, **kwargs):

        #
        # Object desc block
        #
        self._str_desc                  = ''

        # FreeSurfer block. If "True", then each crun command will
        # be prefixed by a call to source the appropriate environment
        # and will also change directory to the FSsubjDir.
        #
        # Note that the FSsubjDir needs particular logic to deal with
        # cases where local and remote filesystem space have different
        # user home directories -- but the assumption is that remote
        # processes can access local directory space via some 
        # intermediate mechanism (NFS, ssh-tunnels, etc).
        self._b_FreeSurferUse           = False
        self._str_FSversion             ='dev'
        self._str_FSsubjDir             = ''
        self._str_FSdevsource           = '. ~/arch/scripts/chb-fs dev >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/chb-fs stable >/dev/null'
        self._str_FScmd                 = ''

        # Working directory spec. In what directory should the command
        # be executed? Depending on sub-classing (esp HPC subclassing)
        # the actual usage of the _str_workingDir might be assigned in
        # the HPC subclass.
        self._str_workingDir            = ''

        self._b_schedulerSet    = False
        self._b_waitForChild    = False         # Used for spawned processes, forces
                                                #+ blocking on main processing loop
                                                #+ if True.
        self._b_runCmd          = True          # Debugging flag
                                                #+ will only execute command
                                                #+ if flag is true

        self._b_disassociate    = False         # This disassociates the command from
                                                # its parent shell. Essentially, this
                                                # wraps the command in parentheses.

        self._b_detach          = False         # If True, detach process from
                                                #+ shell
        self._b_echoCmd         = False
        self._b_echoStdOut      = False
        self._b_echoStdErr      = False
        self._b_devnull         = False
        self._str_stdout        = ""
        self._str_stderr        = ""
        self._exitCode          = 0

        # Remote process shells (including HPC scheduler shells)
        self._b_sourceEnv       = False         # If true, add appropriate cmds
                                                #+ to source the remote shell's 
                                                #+ user env scripts
        self._str_sourceEnvCmd  = '. ~/.bashrc >/dev/null 2>/dev/null ; . ~/.bash_profile   >/dev/null 2>/dev/null '
        self._b_sshDo           = False
        self._b_sshDetach       = False         # An additional ssh-only detach
                                                #+ that, if true, detaches the
                                                #+ ssh command itself.
        self._b_singleQuoteCmd  = False         # If True, force enclose of
                                                #+ strcmd with single quotes
        self._str_remoteHost    = ""
        self._str_remoteUser    = ""
        self._str_remotePasswd  = ""
        self._str_remotePort    = "22"

        self._str_scheduleCmd   = ""
        self._str_scheduleArgs  = ""

        self._str_cmdPrefix     = ""            # Typically used for scheduler 
                                                #+ and args
        self._str_cmd           = ""            # Original "pure" command that 
                                                #+ is to be executed
        self._str_cmdSuffix     = ""            # Any suffixes, such as redirects, 
                                                #+ etc for this command.
        self._str_shellCmd      = ""            # The final cumulative shell 
                                                #+ cmd that will be executed.
        
        for key, value in kwargs.iteritems():
            if key == "remotePort":     self._str_remotePort    = value
            if key == "remoteHost":
                self._b_sshDo           = True
                l_remoteHost    = value.split(':')
                self._str_remoteHost = l_remoteHost[0]
                if len(l_remoteHost) == 2:
                    self._str_remotePort = l_remoteHost[1]
            if key == "remoteUser":     self._str_remoteUser    = value
            if key == "remotePasswd":   self._str_remotePasswd  = value
        
    
    def __call__(self, str_cmd, **kwargs):
        '''
        This "functor" is the heart of the crun object.

        The order of the following statements is critical in building up the
        correct final command string to be executed, especially as far as
        the correct quoting of the correct sub-part, the placement (or not)
        of remote environment sourcing, redirects, changing to working
        directories, etc.
        '''
        self._str_cmd           = str_cmd

        # The concept of "workingDir" is hpc-specific for any given command
        # and needs to set in each hpc functor. Here, it is only set
        # for cases when no scheduler is specified.
        if len(self._str_workingDir) and not self._b_schedulerSet:
            str_cmd = "cd %s ; %s" % (self._str_workingDir, str_cmd)

        self._str_cmdPrefix     = self._str_scheduleCmd + " " + \
                                  self._str_scheduleArgs
        if self._b_singleQuoteCmd:
            self._str_shellCmd  = self._str_cmdPrefix + (" %s%s%s" % (chr(39), str_cmd, chr(39)))
        else:
            self._str_shellCmd  = self._str_cmdPrefix + str_cmd
        self._str_shellCmd     += self._str_cmdSuffix
        if self._b_devnull:
            self._str_shellCmd += " >/dev/null 2>&1"
        if self._b_detach:      str_embeddedDetach      = "&"
        else:                   str_embeddedDetach      = ""
        if self._b_sshDetach:   str_sshDetach           = "&"
        else:                   str_sshDetach           = ""
        if self._b_FreeSurferUse:
            self._str_shellCmd = self.FS_cmd(self._str_shellCmd)
        if self._b_sourceEnv:
            self._str_shellCmd  = "%s ; %s" % ( self._str_sourceEnvCmd,
                                                self._str_shellCmd)
        self._str_shellCmd      = '%s %s' % (   self._str_shellCmd,
                                                str_embeddedDetach)
        if self._b_sshDo and len(self._str_remoteHost):
           self._str_shellCmd   = 'ssh -p %s %s@%s  "%s" %s' % (
                                                    self._str_remotePort,
                                                    self._str_remoteUser,
                                                    self._str_remoteHost,
                                                    self._str_shellCmd,
                                                    str_sshDetach)
        if self._b_disassociate:
            self._str_shellCmd  = "( %s ) &" % self._str_shellCmd
        ret                     = 0
        if self._b_detach and self._b_schedulerSet: self._str_shellCmd += " &"

        if self._b_echoCmd: sys.stdout.write('%s\n' % self._str_shellCmd)
        if self._b_runCmd:
            self._str_stdout, self._str_stderr, self._exitCode    = \
                    misc.shell(self._str_shellCmd, **kwargs)
        if self._b_echoStdOut: 
            sys.stdout.write(self._str_stdout)
            sys.stdout.flush()
        if self._b_echoStdErr: 
            sys.stderr.write(self._str_stderr)
            sys.stderr.flush()
        return self._str_stdout, self._str_stderr, self._exitCode
    

    def cmdSuffix(self, *args):
        if len(args):
            self._str_cmdSuffix = args[0]
        else:
            return self._str_cmdSuffix

    def cmdPrefix(self, *args):
        if len(args):
            self._str_cmdPrefix = args[0]
        else:
            return self._str_cmdPrefix

    def scheduleCmd(self, *args):
        if len(args):
            self._str_scheduleCmd = args[0]
        else:
            return self._str_scheduleCmd

    def scheduleArgs(self, *args):
        if len(args):
            self._str_scheduleArgs = args[0]
        else:
            return self._str_scheduleArgs

    def waitForChild(self, *args):
        self._b_waitForChild            = True
        if len(args):
            self._b_waitForChild        = args[0]

    def echo(self, *args):
        self._b_echoCmd         = True
        if len(args):
            self._b_echoCmd     = args[0]

    def echoStdOut(self, *args):
        self._b_echoStdOut      = True
        if len(args):
            self._b_echoStdOut  = args[0]
            
    def stdout(self):
        return self._str_stdout
            
    def stderr(self):
        return self._str_stderr
        
    def exitCode(self):
        return self._exitCode

    def echoStdErr(self, *args):
        self._b_echoStdErr      = True
        if len(args):
            self._b_echoStdErr  = args[0]
            
    def detach(self, *args):
        self._b_detach          = True
        if len(args):
            self._b_detach      = args[0]

    def disassociate(self, *args):
        self._b_disassociate    = True
        if len(args):
            self._b_disassociate = args[0]

    def devnull(self, *args):
        if len(args):
            self._b_sshDo       = args[0]
        else:
            return self._b_devnull
    
    def sshDetach(self, *args):
        self._b_sshDetach       = True
        if len(args):
            self._b_sshDetach   = args[0]

    def sshDo(self, *args):
        self._b_sshDo           = True
        if len(args):
            self._b_sshDo       = args[0]

    def dontRun(self, *args):
        self._b_runCmd          = False
        if len(args):
            self._b_runCmd      = args[0]

    def workingDir(self, *args):
        if len(args):
            self._str_workingDir = args[0]
        else:
            return self._str_workingDir

    def emailUser(self, *args):
        if len(args):
            self._str_emailUser = args[0]
        else:
            return self._str_emailUser

    def emailWhenDone(self, *args):
        if len(args):
            self._b_emailWhenDone = args[0]
        else:
            return self._b_emailWhenDone

    def remoteLogin_set(self, str_remoteUser, str_remoteHost, **kwargs):
        self.sshDo()
        for key, value in kwargs.iteritems():
            if key == 'remoteUser':     self._str_remoteUser    = value
            if key == 'remoteHost':     self._str_remoteHost    = value
            if key == 'remotePort':     self._str_remotePort    = value
            if key == "passwd":         self._str_remotePasswd  = value

class crun_hpc(crun):
    '''
    This is an "intermediary" class specialization that generalizes 
    data elements and methods common to high performance clusters.
    Specific cluster types derive from this class and typically 
    override the following:

    crun_hpc.scheduleArgs(...)
    crun_hpc.queueInfo(...)
    '''

    # class variables
    c_runCount  = 0

    def priority(self, *args):
        if len(args):
            self._priority      = args[0]
        else:
            return self._priority

    def queueName(self, *args):
        if len(args):
            self._str_queue = args[0]
        else:
            return self._str_queue

    def jobID(self, *args):
        if len(args):
            self._str_jobID = args[0]
        else:
            return self._str_jobID

    def jobInfoDir(self, *args):
        if len(args):
            self._str_jobInfoDir= args[0]
        else:
            return self._str_jobInfoDir

    def scheduleHostOnly(self, *args):
        if len(args):
            self._str_scheduleHostOnly = args[0]
            self._b_scheduleOnHostOnly = True
        else:
            return self._str_scheduleHostOnly

    def scheduleMaxQueue(self, *args):
        if len(args):
            self._str_maxQueue = args[0]
        else:
            return self._str_maxQueue

    def clusterName(self, *args):
        if len(args):
            self._str_clusterName = args[0]
        else:
            return self._str_clusterName

    def clusterType(self, *args):
        if len(args):
            self._str_clusterType = args[0]
        else:
            return self._str_clusterType

    def clusterScheduler(self, *args):
        if len(args):
            self._str_clusterScheduler = args[0]
        else:
            return self._str_clusterScheduler

    def schedulerStdOut(self, *args):
        if len(args):
            self._str_schedulerStdOut = args[0]
        else:
            return self._str_schedulerStdOut

    def schedulerStdErr(self, *args):
        if len(args):
            self._str_schedulerStdErr = args[0]
        else:
            return self._str_schedulerStdErr

    def __init__(self, **kwargs):
        '''
        Calls the base constructor and then sets some HPC-specific data.
        '''
        crun.__init__(self, **kwargs)

        self._b_schedulerSet            = True
        self._str_clusterName           = 'undefined'
        self._str_clusterType           = 'undefined'

        # The "name" of the queue to use
        self._str_queue                 = ''

        # Job ID and related stdout/stderr 
        self._str_jobID                 = ''
        # These define the stdout/stderr that schedulers will often use
        # to capture the outputs of executed applications.
        self._str_schedulerStdOut       = ''
        self._str_schedulerStdErr       = ''

        # Host subset spec
        self._b_scheduleOnHostOnly      = False
        self._str_scheduleHostOnly      = ''

        # email spec
        self._b_emailWhenDone           = False
        self._str_emailUser             = ''


    def __call__(self, str_cmd, **kwargs):
        '''
        If called, simply drops through to the base functor
        '''
        crun_hpc.c_runCount += 1
        return crun.__call__(self, str_cmd, **kwargs)

    def queueInfo(self, **kwargs):
        """
        Should never be called directly, but specialized 
        in a derived class.
        """
        print("crun_hpc::queueInfo()\nThis method should never be called!\n")
        sys.exit(10)
    

class crun_hpc_launchpad(crun_hpc):

    def __init__(self, **kwargs):
        crun_hpc.__init__(self, **kwargs)
        
        self._str_FSdevsource           = '. ~/arch/scripts/nmr-fs dev >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/nmr-fs stable >/dev/null'

        self._str_clusterName           = "launchpad"
        self._str_clusterType           = "torque-based"
        self._str_clusterScheduler      = 'qsub'

        self._b_emailWhenDone           = False

        self._str_emailUser             = "rudolph"
        self._str_jobID                 = ""
        if len(self._str_remoteUser):
            self._str_jobInfoDir    = "/pbs/%s" % self._str_remoteUser
        else:
            self._str_jobInfoDir    = "/pbs/%s" % self._str_emailUser
        self._b_singleQuoteCmd          = True
        self._str_queue                 = "max200"

        self._priority                  = 50
        self._str_scheduler             = 'pbsubmit'
        self._str_scheduleCmd           = ''
        self._str_scheduleArgs          = ''

    def __call__(self, str_cmd, **kwargs):
        self.scheduleArgs()
        if len(self._str_workingDir):
            str_cmd = "cd %s ; %s" % (self._str_workingDir, str_cmd)
        self._str_scheduleCmd       = self._str_scheduler
        return crun.__call__(self, str_cmd, **kwargs)
    
    def scheduleArgs(self, *args):
        if len(args):
            self._str_scheduleArgs      = args[0]
        else:
            self._str_scheduleArgs      = ''
            if len(self._str_jobID):
                self._str_scheduleArgs += "-O %s -E %s " % (
                                self._str_schedulerStdOut,
                                self._str_schedulerStdErr)
            if self._b_emailWhenDone and len(self._str_emailUser):
                self._str_scheduleArgs += "-m %s " % self._str_emailUser
            self._str_scheduleArgs     += "-q %s -c " % self._str_queue
        return self._str_scheduleArgs

    def queueInfo(self, **kwargs):
        """
        Returns a tuple:
            (number_of_jobs_pending,
             number_of_jobs_running, 
             number_of_jobs_scheduled, 
             number_of_jobs_completed)
        """
        if self._b_sshDo and len(self._str_remoteHost):
            shellQueue  = crun( remoteHost=self._str_remoteHost,
                                remotePort=self._str_remotePort,
                                remoteUser=self._str_remoteUser)
            str_user    = self._str_remoteUser
        else:
            shellQueue  = crun()
            str_user    = crun('whoami').stdout().strip()
        shellQueue('qstat | grep %s | wc -l ' % str_user)
        str_processInSchedulerCount     = shellQueue.stdout().strip()
        shellQueue("qstat | grep %s | awk '{print $5}' | grep 'C' | wc -l" %\
                    str_user)
        str_processCompletedCount       = shellQueue.stdout().strip()
        shellQueue("qstat | grep %s | awk '{print $5}' | grep 'R' | wc -l" %\
                    str_user)
        str_processRunningCount         = shellQueue.stdout().strip()
        shellQueue("qstat | grep %s | awk '{print $5}' | grep 'Q' | wc -l" %\
                    str_user)
        str_processPendingCount         = shellQueue.stdout().strip()
        return (str_processPendingCount,
                str_processRunningCount, 
                str_processInSchedulerCount,
                str_processCompletedCount)

class crun_hpc_lsf(crun_hpc):

    def __init__(self, **kwargs):
        crun_hpc.__init__(self, **kwargs)

        self._str_FSdevsource           = '. ~/arch/scripts/nmr-fs dev  >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/nmr-fs stable >/dev/null'

        self._str_clusterName           = "erisone"
        self._str_clusterType           = "HP-LSF"
        self._str_clusterScheduler      = 'bsub'

        self._b_emailWhenDone           = False

        self._str_jobID                 = ""
        self._str_jobInfoDir            = "~/lsf/output"
        self._b_singleQuoteCmd          = True
        self._str_emailUser             = "rudolph.pienaar@childrens.harvard.edu"
        self._str_queue                 = "normal"

        self._priority                  = 50
        self._str_scheduler             = 'bsub'
        self._str_scheduleCmd           = ''
        self._str_scheduleArgs          = ''

    def __call__(self, str_cmd, **kwargs):
        if len(self._str_workingDir):
            str_cmd = "cd %s ; %s" % (self._str_workingDir, str_cmd)
        self._str_scheduleCmd           = self._str_scheduler
        self.scheduleArgs()
        return crun.__call__(self, str_cmd, **kwargs)
    
    def scheduleArgs(self, *args):
        '''
        If called without any arguments, rebuilds the scheduler arguments
        from scratch.
        '''
        if len(args):
            self._str_scheduleArgs      = args[0]
        else:
            self._str_scheduleArgs      = ''
            if self._b_scheduleOnHostOnly:
                self._str_scheduleArgs += "-m %s%s%s " % (
                    chr(39), self._str_scheduleHostOnly, chr(39)
                )
            if self._b_emailWhenDone and len(self._str_emailUser):
                self._str_scheduleArgs += "-u %s -N " % self._str_emailUser
            if len(self._str_jobID):
                self._str_scheduleArgs += "-S 20000 -J %s " % self._str_jobID
                self._str_scheduleArgs += "-o %s -e %s " % (
                                self._str_schedulerStdOut,
                                self._str_schedulerStdErr)
            self._str_scheduleArgs     += "-q %s " % self._str_queue
        return self._str_scheduleArgs

    def queueInfo(self, **kwargs):
        """
        Returns a tuple:
            (number_of_jobs_pending,
             number_of_jobs_running, 
             number_of_jobs_scheduled, 
             number_of_jobs_completed)
        """
        if self._b_sshDo and len(self._str_remoteHost):
            shellQueue  = crun( remoteHost=self._str_remoteHost,
                                remotePort=self._str_remotePort,
                                remoteUser=self._str_remoteUser)
            str_user    = self._str_remoteUser
        else:
            shellQueue  = crun()
            str_user    = crun('whoami').stdout().strip()
        shellQueue.echo(False)
        shellQueue.echoStdOut(False)
        shellQueue('bjobs | grep -v USER | wc -l ')
        str_processInSchedulerCount     = shellQueue.stdout().strip()
        shellQueue("bjobs | grep -v USER | awk '{print $3}' | grep 'RUN' | wc -l")
        str_processRunningCount         = shellQueue.stdout().strip()
        shellQueue("bjobs | grep -v USER | awk '{print $3}' | grep 'PEND' | wc -l")
        str_processPendingCount         = shellQueue.stdout().strip()
        if not len(str_processInSchedulerCount):        str_processInSchedulerCount     = '0'
        if not len(str_processRunningCount):            str_processRunningCount         = '0'
        if not len(str_processPendingCount):            str_processPendingCount		= '0'
        completedCount                  = int(str_processInSchedulerCount) - \
                                          int(str_processRunningCount) - \
                                          int(str_processPendingCount)
        str_processCompletedCount       = str(completedCount)                                
        return (str_processPendingCount,
                str_processRunningCount, 
                str_processInSchedulerCount,
                str_processCompletedCount)

class crun_hpc_lsf_crit(crun_hpc_lsf):

    def __init__(self, **kwargs):
        crun_hpc_lsf.__init__(self, **kwargs)

        self._str_FSdevsource           = '. ~/arch/scripts/chb-fs dev centos >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/chb-fs stable >/dev/null'

        self._str_clusterName           = "HP-crit"
        self._str_clusterType           = "HP-LSF"
        self._str_clusterScheduler      = 'bsub'

        self._b_emailWhenDone           = False

        self._str_jobID                 = ""
        self._str_jobInfoDir            = "~/lsf/output"
        self._b_singleQuoteCmd          = True
        self._str_emailUser             = "rudolph.pienaar@childrens.harvard.edu"
        self._str_queue                 = "high_priority"

        self._priority                  = 50
        self._str_scheduler             = 'bsub'
        self._str_scheduleCmd           = ''
        self._str_scheduleArgs          = ''

        
class crun_hpc_mosix(crun_hpc):

    def __init__(self, **kwargs):
        crun_hpc.__init__(self, **kwargs)

        self._str_FSdevsource           = '. ~/arch/scripts/chb-fs dev >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/chb-fs stable >/dev/null'

        self._str_clusterName           = "PICES"
        self._str_clusterType           = "MOSIX"
        self._str_clusterScheduler      = 'mosbatch'

        self._b_emailWhenDone           = False

        self._str_jobID                 = ""
        self._str_jobInfoDir            = "~/tmp"
        self._b_singleQuoteCmd          = False
        self._str_emailUser             = "rudolph.pienaar@childrens.harvard.edu"
        self._str_queue                 = "normal"

        self._priority                  = 50
        self._str_scheduler             = 'mosbatch'
        self._str_scheduleCmd           = ''
        self._str_scheduleArgs          = ''
        
    def __call__(self, str_cmd, **kwargs):
        self.scheduleArgs()
        if len(self._str_workingDir):
            self._str_scheduleCmd       = "cd %s ; %s" %\
                (self._str_workingDir, self._str_scheduler)
        else:
            self._str_scheduleCmd       = self._str_scheduler
        return crun.__call__(self, str_cmd, **kwargs)


    def scheduleArgs(self, *args):
        if len(args):
            self._str_scheduleArgs      = args[0]
        else:
            # Need to check if jobID is integer... other clusters allow
            # ids to be alphanumeric...
            #if len(self._str_jobID):
                #self._str_scheduleArgs += "-J%s " % self._str_jobID
            self._str_scheduleArgs      = ''
            self._str_scheduleArgs     += "-q%d " % self._priority
            if self._b_scheduleOnHostOnly:
                self._str_scheduleArgs += "-r%s " % self._str_scheduleHostOnly
            else:
                self._str_scheduleArgs += "-b "
            if len(self._str_schedulerStdOut) or len(self._str_schedulerStdErr):
                self._str_cmdSuffix = ''
            if len(self._str_schedulerStdOut):
                self._str_cmdSuffix += " >%s " % self._str_schedulerStdOut
            if len(self._str_schedulerStdErr):
                self._str_cmdSuffix += " 2>%s " % self._str_schedulerStdErr
        return self._str_scheduleArgs


    def email_send(self):
        '''
        The MOSIX scheduler doesn't have the capacity to email users when jobs
        are completed. This method will generate and send an email to the
        internally class-defined recipient. It is typically called from the
        self.queueInfo() method once all scheduled jobs are complete.
        '''
        CMail   = C_mail.C_mail()

        str_from        = "PICES"
        str_subject     = "PICES job status"
        str_desc        = ''
        if len(self._str_desc):
            str_desc    = '''

        This batch of jobs has the following internal description:

        <--%s-->

        ''' % self._str_desc
        str_body        = """
        Dear %s --

        The scheduled batch of jobs you sent to PICES have
        all completed, and no jobs remain in the scheduler.

        %s

        Please consult any relevant output files relating
        to your job.

        <EOM/NRN>
        
        """ % (self.emailUser(), str_desc)
        CMail.mstr_SMTPserver = "johannesburg"
        CMail.send(     to      = self.emailUser().split(','),
                        sender  = str_from,
                        subject = str_subject,
                        body    = str_body)

    def queueInfo(self, **kwargs):
        """
        Returns a tuple:
            (number_of_jobs_pending,
             number_of_jobs_running, 
             number_of_jobs_scheduled, 
             number_of_jobs_completed)
        """
        
        for key, val in kwargs.iteritems():
            if key == 'blockProcess':   str_blockProcess = val
        if self._b_sshDo and len(self._str_remoteHost):
            shellQueue  = crun( remoteHost=self._str_remoteHost,
                                remotePort=self._str_remotePort,
                                remoteUser=self._str_remoteUser)
            str_user    = self._str_remoteUser
        else:
            shellQueue  = crun()
            str_user    = crun('whoami').stdout().strip()
        shellQueue.echo(False)
        shellQueue.echoStdOut(False)
        shellQueue('mosq listall | grep %s | grep %s | wc -l ' % (str_blockProcess, str_user))
        str_processInSchedulerCount     = shellQueue.stdout().strip()
        shellQueue("mosq listall | grep %s | grep %s | grep 'RUN' | wc -l" %\
                    (str_blockProcess, str_user))
        str_processRunningCount         = shellQueue.stdout().strip()
        shellQueue("mosq listall | grep %s | grep %s | awk '{print $5}' | grep -v 'RUN' | wc -l" %\
                    (str_blockProcess, str_user))
        str_processPendingCount         = shellQueue.stdout().strip()
        if not len(str_processInSchedulerCount):        str_processInSchedulerCount     = '0'
        if not len(str_processRunningCount):            str_processRunningCount         = '0'
        completedCount                  = int(str_processInSchedulerCount) - \
                                          int(str_processRunningCount)
        str_processCompletedCount       = str(completedCount)
        str_processCompletedCount       = shellQueue.stdout().strip()
        if str_processInSchedulerCount == '0': self.email_send()
        return (str_processPendingCount,
                str_processRunningCount, 
                str_processInSchedulerCount,
                str_processCompletedCount)

class crun_hpc_mosix_HPtest(crun_hpc_mosix):

    def __init__(self, **kwargs):
        crun_hpc_mosix.__init__(self, **kwargs)

        self._str_FSdevsource           = '. ~/arch/scripts/chb-fs dev >/dev/null'
        self._str_FSstablesource        = '. ~/arch/scripts/chb-fs stable >/dev/null'

        self._str_clusterName           = "HPtest"

        self._b_emailWhenDone           = False

        self._str_jobID                 = ""
        self._str_jobInfoDir            = "~/tmp"
        self._b_singleQuoteCmd          = False
        self._str_emailUser             = "rudolph.pienaar@childrens.harvard.edu"
        self._str_queue                 = "normal"

        self._priority                  = 50
        self._str_scheduler             = 'mosbatch'
        self._str_scheduleCmd           = ''
        self._str_scheduleArgs          = ''


class crun_mosixbash(crun):
    def __init__(self, **kwargs):
        self._b_schedulerSet     = True
        crun.__init__(self, **kwargs)
        self._str_scheduleCmd   = 'mosix_run.bash'
        self._str_scheduleArgs  = '-c'
        self._b_singleQuoteCmd  = True
        
    def __call__(self, str_cmd):
        return crun.__call__(self, str_cmd)


if __name__ == '__main__':

    # Create the crun instance
    #shell       = crun()
    #shell       = crun_hpc_mosix(remoteUser="rudolphpienaar", remoteHost="rc-twice")
    shell       = crun(remoteUser="rudolphpienaar", remoteHost="rc-drno")

    # Grab the command line args defining the app and args that need to be 
    # scheduled
    str_cmd     = ""
    for arg in sys.argv[1:len(sys.argv)]:
        str_cmd = str_cmd + " " + arg
    
    # Set some parameters for this shell
    shell.echo()
    shell.echoStdOut()
    shell.detach()
    # shell.dontRun()

    # And now run it!
    misc.tic()
    shell(str_cmd)
    print "Elapsed time = %f seconds" % misc.toc()
    
    
