#BB10-WebWorks-Framework Setup

##Requirements
1. You must have node and npm installed and on your path. [Download Here](http://nodejs.org/#download)

##Set Up:
1. git clone https://github.com/blackberry-webworks/BB10-WebWorks-Framework.git

2. cd BB10-WebWorks-Framework

3. Configuration:
    3.1 For Mac:
        ./configure (sudo ./configure if you get permission errors. Don't do this off the bat or your submodules will be created as root)
    3.2 For Windows:
        Run configure.bat 

4. Run the unit tests
	Run 'jake test' and check that jake runs and completes

5. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder

