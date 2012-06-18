#BB10-WebWorks-Framework

##Prerequisites
1. Install node and npm and add to path. [Download Here](http://nodejs.org/dist/v0.6.10/)
2. Install BlackBerry Native SDK. [Download Here](https://bdsc.webapps.blackberry.com/native/)
3. Install CMake. [Download Here](http://www.cmake.org/cmake/resources/software.html)
4. Add BlackBerry Native SDK bin directory to path. i.e. *Installation Directory*\host\win32\x86\usr\bin
5. Add CMake bin to path. i.e. *Installation Directory*\bin
6. Add Git bin to path. i.e. *Installation Directory*\bin [Windows only]

##Setup and Build
1. git clone https://github.com/blackberry-webworks/BB10-WebWorks-Framework.git
2. cd BB10-WebWorks-Framework
3. git checkout next
4. Configuration:
    - For Mac:
        ./configure
    - For Windows:
        bash configure (run from command prompt)
5. Run 'jake test' and check that jake runs and completes
6. Setup bbndk environment variable
    - For Mac:
        Add "source *installation directory here*/bbndk-env.sh" to your bash profile
    - For Windows:
        Run *BBNDK Installation Directory*\bbndk-env.bat.
7. Run 'jake' or 'jake build' and check that the output folder is created under the "target/zip" subfolder. If on windows, run jake from command prompt.
