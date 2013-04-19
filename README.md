ChRIS reloaded
==============

The Children's Hospital Radiology Information System.

### Change log ###

current - **r1.7**
* Add interactive plugin support
* Add interactive Pacs Pull plugin
* Add PACMAN 
* Add onclick for the modal overlay which sometimes used to block the complete ChRIS application when an XTK preview failed.
* Fix all missing gfx errors in the console.
* Fix resizing issue when window height is so small that the statistics panel is hidden.

2013 04 15 - **r1.6**
* Fix critical bug where notes got lost when multiple lines of text was saved.

2013 04 09 - **r1.5**
* Introduce a step setting for Plugin.DOUBLE parameters
* Expose all parameters of the Fetal Motion Correction plugin
* Fix the fcMRI plugin
* Search on Series description rather than Study description

2013 04 01 - **r1.4**
* Fix permission issue to view Freesurfer working directory when running a recon-all
* Fix critical bug when sharing a feed 

2013 03 29 - **r1.3**
* Enhance style
* Integrate Slice:Drop for files and DICOM folders
* Fix bug in the mri_convert plugin which crashed when the input path was too long

2013 03 20 - **r1.2**
* Bug fixes (Mapper::add if id already exists)
* Get rid of deprecated chb-fsdev and chb-fsstable
* Add chris version in configuration file and in footer

2013 03 15 - **r1.1**

* Add `Google Analytics` support
* Easy login: all ldap users can login, the database will be updated accordingly

2013 03 13 - **r1.0**

* First release!
