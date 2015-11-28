# Artnet to ATEM

2015 (c) William Viker, Trippel-M levende bilder AS

## Installation
### Mac OSX

1. Download and install Node.JS from https://nodejs.org/
2. Download and install GIT version control http://git-scm.com/download/mac
3. Open the "Terminal" application
4. Run the following commands:
  * git clone git@github.com:willosof/artnet2atem.git
  * cd artnet2atem
  * npm install
5. Inside the artnet2atem/config folder there is a file named default.json, open this with a text editor and change the values to suit your needs.
6. To start the application, go back to Terminal, and type:
  * ./start.sh
7. Open browser (chrome, safari, firefox), and URL http://127.0.0.1:3000/ to preview incoming artnet data
