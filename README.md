ChRIS reloaded
==============

ChRIS: Children's Research Integration System.

ChRIS is an "end-to-end" web-based system for collecting, processing, and sharing raw and processing medical image data. It is loosely based on a "twitter"-type UI paradigm. Users have "feeds" that track interaction with the system. Feeds contain "posts" that are containers for data of any sort, i.e. raw DICOM images, Nifti volumes, FreeSurfer outputs, etc. ChRIS also offers "plugins" that process "posts". Data within a post can be dragged into a plugin, and processed.

In most cases, the plugin will spawn a job out on an appropriately configured cluster resource. In the simplest case, the job will simply run on the machine in which the ChRIS instance has been deployed.


## Change log ##

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
