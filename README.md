ChRIS reloaded
==============

Developed at Boston Children's Hospital in the Fetal-Neonatal Neuroimaging and Developmental Science Center, _ChRIS_ (**Ch**ildren's **R**esearch **I**ntegration **S**ystem), is a novel web-based data storage and data processing workflow manager that provides strict data security while also facilitating secure, realtime interactive collaboration over the Internet and internal Intranets. Although _ChRIS_ can manage any datatype, it is uniquely suited to medical image data, providing the ability to seamlessly collect data from typical sources found in hospitals (such as Picture Archive and Communications Systems, PACS), import from CDs/DVDs, users desktops, etc. _ChRIS_ not only manages data collection and organization, but it also provides a large (and expanding) library of pipelines to analyze imported data. This library is easily extensible via a simple plugin mechanism, and _ChRIS_ also provides the ability to directly interact with compute clusters for data analysis. Moreover, a wide variety of 2D, 3D, and 4D medical image data formats are natively supported and can be directly visualized and manipulated within the browser.

![alt_tag](https://raw.github.com/FNNDSC/chrisreloaded/master/doc/images/1_feed.png)

Using a modern Web 2.0 inspired design -- see Figure above -- the system focuses on simplicity -- both in ease of use and in accessibility. End users will immediately recognize a facebook/twitter/gmail inspired interface, with a central news-type “feed” containing a persistent record of activity in the system, and plugins that can process “feeds”. Plugins are the mechanism by which users create feeds, and plugins are available for importing data, performing various analytical processing on data, and also providing detailed visualization of data and results -- all within the single-context approach of the _ChRIS_ user interface. Actual processing of data is not usually performed by _ChRIS_, but by bundled applications that are connected to the feeds through a plugin mechanism. _ChRIS_ also provides the ability to natively integrate to High Performance Computing (HPC) resources, allowing users to process data on powerful clusters without needing to manage data and results or worry about the transfer and management of data between local computers and the remote HPC.

As seen in the Figure, a "feed" view on the right contains a historical log of activity feeds on the system, and in this particular view, a "Search" plugin or activity is shown on the right. This plugin can be used to search data that has already been downloaded into the _ChRIS_ system.

_ChRIS_ is an "end-to-end" web-based system for collecting, processing, and sharing raw and processing medical image data. It is loosely based on a "twitter"-type UI paradigm. Users have "feeds" that track interaction with the system. Feeds contain "posts" that are containers for data of any sort, i.e. raw DICOM images, Nifti volumes, FreeSurfer outputs, etc. _ChRIS_ also offers "plugins" that process "posts". Data within a post can be dragged into a plugin, and processed.

In most cases, the plugin will spawn a job out on an appropriately configured cluster resource. In the absence of a cluser, or for certain plugins (like filesystem access, search, and others) _ChRIS_ itself will run the job on the machine it is deployed on (i.e. the web server).


## Change log ##

### 2014 03 13 **r2.7** ###
* Fix bug on launching a batch and incorrect tracking of job status
* Add 'mosix_test' plugin (with runKey -- needed to actually run plugin)
* Add 'zip' plugin
* Run all commands though bash -c
* Update most of file system interactions are going though ssh, to do it as logged-in user
* FindSession orders pushed files by  mrn/study/series
* Pacs_push sends actions to dicom listener (emaillink)
* Pacs_push recursive push and anonymization fixed
* Update XTK to XTK Edge (2014-03-10) without reslicing for DICOM images

### 2014 02 10 **r2.6** ###
* Update list of characters to be sanitized ("'")
* Pacs_pull anonymize option (for demos)
* User-specific settings
* Pacs_push pushes all images, including the one in subdirectories
* Find_session v1.0 (for MGH folks)

### 2013 10 18 **r2.5** ###
* Add -k to CURL

### 2013 10 18 **r2.4** ###
* First version of the Viewer plugin
* Add Patient Sex to Pacs Pull plugin
* Update Feed status using CURLS + token
* Search for plugin
* Select feeds and apply group actions (tag, favorite, etc.)
* Search for feed on tags and plugins
* Tag feeds (and all underlying functionnalities)
* Drag and Drop/upload files to server (100MB/file max)
* New feeds color vanishes to hint user
* Fix connectome PATH issue (cmp not found)

### 2013 07 11 - **r2.3** ###
* Clean up the user interace (less padding, squared designed, dark grey/white theme) 
* Correct anonimyzation in PACS Push plugin

### 2013 06 12 - **r2.2** ###
* Update all plugins documentation
* Fix sanitize function (add white space stripping)
* Fix pacs_pull plugin (MRN bug: MRN string was not cleanned and might create bug if contains dangerous characters such as spaces)
* Fix pacs_pull plugin (MRN bug: where all data-sets are downloaded if MRN is provided)
* Add 'validate' plugin method
* Add link to chris website in the navigation toolbar
* Change search plugin category to system
* Enhance search plugin (0.3 - run as a regular plugin (do not run locally anymore))
* Enhance search plugin (0.3 - supports white spaces as 'OR' operator)
* Enhance search plugin (0.3 - only takes 1 search string)
* Enhance plugins interface
* Add about panel in plugins
* Show scrollbar in plugin panel only if needed
* Enhance hello world interactive to describe interaction with input data
* Enhance hello world interactive to showcases power of interactive plugins
* Introduce environment variables in config file for easy deployement/maintenance
* Fix several bugs

### 2013 05 07 - **r2.1** ###
* Add .error to files preview
* Clean up code
* Add "Hello World" interactive plugin
* Fix bug in PACMAN interactive plugin

### 2013 04 19 - **r2.0** ###
* Add interactive plugin support
* Add interactive Pacs Pull plugin
* Add PACMAN 
* Add onclick for the modal overlay which sometimes used to block the complete ChRIS application when an XTK preview failed.
* Fix all missing gfx errors in the console.
* Fix resizing issue when window height is so small that the statistics panel is hidden.

### 2013 04 15 - **r1.6** ###
* Fix critical bug where notes got lost when multiple lines of text was saved.

### 2013 04 09 - **r1.5** ###
* Introduce a step setting for Plugin.DOUBLE parameters
* Expose all parameters of the Fetal Motion Correction plugin
* Fix the fcMRI plugin
* Search on Series description rather than Study description

### 2013 04 01 - **r1.4** ###
* Fix permission issue to view Freesurfer working directory when running a recon-all
* Fix critical bug when sharing a feed 

### 2013 03 29 - **r1.3** ###
* Enhance style
* Integrate Slice:Drop for files and DICOM folders
* Fix bug in the mri_convert plugin which crashed when the input path was too long

### 2013 03 20 - **r1.2** ###
* Bug fixes (Mapper::add if id already exists)
* Get rid of deprecated chb-fsdev and chb-fsstable
* Add chris version in configuration file and in footer

### 2013 03 15 - **r1.1** ###

* Add `Google Analytics` support
* Easy login: all ldap users can login, the database will be updated accordingly

### 2013 03 13 - **r1.0** ###

* First release!
