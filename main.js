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
