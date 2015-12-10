'use strict';

const electron = require('electron');
const ipcMain = require('electron').ipcMain;

var _ = require('lodash');
var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');
var externalWindow;


app.commandLine.appendSwitch('remote-debugging-port', '8315');
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1');

require('crash-reporter').start();


var debug       = require("debug")("main");
var ATEM        = require('applest-atem');
var atem        = new ATEM();
var artnetsrv   = require('artnet-node/lib/artnet_server.js');
var config      = require('config');
var dialog      = require('dialog');
var fs          = require('fs');
var EventEmitter = require("events").EventEmitter;
var system      = new EventEmitter();
var connected   = 0;
var lastOut1    = 0;
var lastOut2    = 0;
var lastOut3    = 0;

var atemIP      = config.get("atem_ip");
var dmxChannel  = config.get("artnet_start");
var dmxUniverse = config.get("artnet_uni");


dmxChannel--; //h4x

debug("atemConnect", "Connecting to ATEM");

atem.connect(atemIP);

atem.on('connect', function() {
  debug("atemConnect", "ATEM Connected");
  connected = 1;
});

var srv = artnetsrv.listen(6454, function(msg, peer) {
  system.emit("artnet",msg);

  if (debugArtnet) {
    debug("ArtNet", "Sequence "+msg.sequence+" Universe "+msg.universe+" Length "+msg.length);
  }

  // First channel - PGM switching
  if (msg.universe == dmxUniverse && connected) {
    if (lastOut1 != msg.data[0]) {
      lastOut1 = msg.data[dmxChannel+0];
      atem.changeProgramInput(msg.data[dmxChannel+0]);
      debug("ATEM","Changing PGM out to input "+msg.data[dmxChannel+0]);
      //atem.changePreviewInput(msg.data[dmxChannel+0]);
      //atem.autoTransition();
    }
  }


});













var mainWindow = null;

var options = {
  "debug": true,
  "version": "1.0.0",
  "views_dir": "views",
  "root_view": "index.html",
  "external_view": "external.html"
};

options = _.extend({
  // ADDITIONAL CUSTOM SETTINGS
}, options);

// ############################################################################################
// ############################################################################################

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if(process.platform !== 'darwins') { app.quit(); }
});

ipcMain.on('minimize', function (event, args) {
    app.minimize();
});

ipcMain.on('quit', function (event, args) {
    app.quit();
});

ipcMain.on("foobar", function (evnet, args) {
    console.log("foobar",args);
});

ipcMain.on('screen', function(event, args) {
  var electronScreen = electron.screen;
  var displays = electronScreen.getAllDisplays();

  console.log(args);

  if (args.command == 'close') {

      if (externalWindow) {
        externalWindow.close();
        externalWindow = undefined;
      }

  }

  else if (args.command == 'open') {
    externalWindow = new BrowserWindow({
      x: displays[args.display].bounds.x + 50,
      y: displays[args.display].bounds.y + 50
    });

    externalWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.external_view));
    externalWindow.on('closed', function () { externalWindow = undefined; });
  }

  event.sender.send('screenresult', 'ok');

});

app.on('ready', function() {

  mainWindow = new BrowserWindow( {
      width: 800,
      height: 600,
      frame: false,
      minWidth: 768,
      minHeight: 460
  });

  mainWindow.loadURL(path.join('file://', __dirname, options.views_dir, options.root_view));

  //if(options.debug) { mainWindow.openDevTools(); }

  mainWindow.on('closed', function() { mainWindow = null; });


});

// ############################################################################################
// ############################################################################################
