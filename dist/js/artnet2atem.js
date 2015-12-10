//"use strict";
//window.jQuery = window.$;

(function () {

	/*
		Artnet to ATEM daemon

		Author:
			Trippel-M levende bilder AS
			William Viker
			william@trippelm.no

	*/

	var debug					= require("debug")("main");
	var ATEM					= require('applest-atem');
	var atem					= new ATEM();
	var artnetsrv			= require('artnet-node/lib/artnet_server.js');
	var EventEmitter	= require("events").EventEmitter;
	var system				= new EventEmitter();

	var connected = 0;

	var lastOut1 = 0;
	var lastOut2 = 0;
	var lastOut3 = 0;

	atemIP				= "2.0.0.3";
	dmxChannel		= 1;
	dmxUniverse		= 10;
	dmxPhysical		= 1;

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

		// AUX1 switching
		if (msg.universe == dmxUniverse && connected) {
			if (lastOut2 != msg.data[dmxChannel+1]) {
				lastOut2 = msg.data[dmxChannel+1];
				debug("ATEM","Changing AUX 1 to input "+ msg.data[dmxChannel+1]);
				atem.changeAuxInput(1,msg.data[dmxChannel+1]);
			}
		}

		// AUX2 switching
		if (msg.universe == dmxUniverse && connected) {
			if (lastOut3 != msg.data[dmxChannel+2]) {
				lastOut3 = msg.data[dmxChannel+2];
				debug("ATEM","Changing AUX 2 to input "+ msg.data[dmxChannel+2]);
				atem.changeAuxInput(2,msg.data[dmxChannel+2]);
			}
		}

	});

	atem.on('stateChanged', function(err, state) {
		var connected = 0;
	});

	io.on('connection', function(socket){

		system.on("artnet",function(data) {
			socket.emit("artnet",data);
		});

		socket.on('disconnect', function(){
			debug("socket","disconnection");
		});

	});


});
