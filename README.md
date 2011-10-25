BBX-Framework Setup
---------------------------

For Mac:

1. Install Ripple

2. git clone https://github.com/blackberry-webworks/BBX-Framework.git

3. cd BBX-Framework

4. git checkout next

5. ./configure (sudo ./configure if you get permission errors)

6. cd BBX-Framework\dependencies\BBX-Emulator

7. Start emulator server on port 8472 with:
    jake 
8. Send a command to start Ripple with: 
    curl http://localhost:8472/webview/create
9. Check that Ripple starts up.

10. cd back to BBX-Framework\

11. Run 'jake test' and check that jake runs and completes


For Windows:

1. Install Ripple

2. Follow npm install instructions:
    http://npmjs.org/doc/README.html#Installing-on-Windows-Experimental

3. git clone https://github.com/blackberry-webworks/BBX-Framework.git

4. cd BBX-Framework

5. git checkout next

6. Run configure.bat

7. Open git shell, navigate to BBX-Framework and run:
    git submodule update --init

8. Run the unit tests:
    jake test