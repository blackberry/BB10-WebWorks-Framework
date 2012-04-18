#BB10-WebWorks-Framework Setup
---------------------------

##Requirements
1. You must have node and npm installed and on your path

For Mac:
=======
1. git clone https://github.com/blackberry-webworks/BB10-WebWorks-Framework.git

3. cd BB10-WebWorks-Framework

4. git checkout next

5. ./configure (sudo ./configure if you get permission errors. Don't do this off the bat or your submodules will be created as root)

6. Run the unit tests:
	Run 'jake test' and check that jake runs and completes

7. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder


For Windows:
===========
1. git clone https://github.com/blackberry-webworks/BB10-WebWorks-Framework.git

2. cd BB10-WebWorks-Framework

3. git checkout next

4. Run configure.bat 

5. Run the unit tests:
    Run 'jake test' and check that jake runs and completes
    
6. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder
