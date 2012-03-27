#BB10 WebWorks Jasmine Functional Tests
#### Automated Testing on a Blackberry Tablet

### Requirements
- Playbook device/simulator
- node & npm

### Instructions
###### Setup
`~ ./configure`<br/>

###### Configuration
- Open `job.js` and edit the varibles `DEVICE_IP` & `DEVICE_PASSWORD` & `LOCAL_PACKAGER`
- Open `widget/config.xml` and edit 
  - `<content src="http://<server-hostname-ip>:3000">`
  - `<access uri="http://<server-hostname-ip>:3000">`
- Whitelist your features/extensions in `widget/config.xml`

###### Run server
`~ node app.js`

### How to use
###### Testing using Hudson
Send a HTTP GET request to 
`http://<server-hostname-ip>/run/<job-name-on-hudson>`
and expect response to be results of tests.
###### Testing on your local machine
- Make sure `LOCAL_PACKAGER` has been specified as the absolute path to your Webworks Packager
- Use Browser and visit site `http://<server-hostname-ip>/run`
