BBX-Framework Setup
---------------------------

For Mac:

1. Install Ripple

2. git clone https://github.com/blackberry-webworks/BBX-Framework.git

3. git checkout next

4. ./configure (sudo ./configure if you get permission errors)

5. cd BBX-Framework\dependencies\BBX-Emulator

6. Start emulator server on port 8472 with:
    jake 
7. Send a command to start Ripple with: 
    curl http://localhost:8472/webview/create
8. Check that Ripple starts up.

9. cd back to BBX-Framework\

10. Run 'jake test' and check that jake runs and completes