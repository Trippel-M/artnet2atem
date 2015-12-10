(function(){


	var debug					= require("debug")("main");
	var ATEM					= require('applest-atem');
	var atem					= new ATEM();
	var artnetsrv     = require("artnet-node");

	var connected = 0;

	var lastOut1 = 0;
	var lastOut2 = 0;
	var lastOut3 = 0;

	system.emit("atem_connected",false);

	var atemIP;
	var dmxChannel;
	var dmxUniverse;


	system.on("config_updated", function() {
		var configx	= require('config');
		atemIP				= configx.atem_ip;
		dmxChannel		= configx.artnet_start;
		dmxChannel--;
		dmxUniverse		= configx.artnet_uni;
		atem.connect(atemIP, 9910);

	});
	system.emit("config_updated");

	atem.on('connect', function() {
		system.emit("atem_connected",true);
		connected = 1;
	});
	console.log("listening");

	var srv = artnetsrv.Server.listen(6454, function(err, msg, peer) {

		if (msg.type != 'ArtOutput') {
			// not artnet
		}

		else {

			system.emit("artnet",msg);

			// First channel - PGM switching
			if (msg.universe == dmxUniverse) {
				if (lastOut1 != msg.data[0]) {
					lastOut1 = msg.data[dmxChannel+0];
					if (connected) atem.changeProgramInput(msg.data[dmxChannel+0]);
					system.emit("pgm_input",msg.data[dmxChannel+0]);
					console.log("ATEM","Changing PGM out to input "+msg.data[dmxChannel+0]);
					//atem.changePreviewInput(msg.data[dmxChannel+0]);
					//atem.autoTransition();
				}
			}

			// AUX1 switching
			if (msg.universe == dmxUniverse) {
				if (lastOut2 != msg.data[dmxChannel+1]) {
					lastOut2 = msg.data[dmxChannel+1];
					console.log("ATEM","Changing AUX 1 to input "+ msg.data[dmxChannel+1]);
					system.emit("aux1_input",msg.data[dmxChannel+1]);
					if (connected) atem.changeAuxInput(1,msg.data[dmxChannel+1]);
				}
			}

			// AUX2 switching
			if (msg.universe == dmxUniverse) {
				if (lastOut3 != msg.data[dmxChannel+2]) {
					lastOut3 = msg.data[dmxChannel+2];
					console.log("ATEM","Changing AUX 2 to input "+ msg.data[dmxChannel+2]);
					system.emit("aux2_input",msg.data[dmxChannel+2]);
					if (connected) atem.changeAuxInput(2,msg.data[dmxChannel+2]);
				}
			}

		}
	});

	atem.on('stateChanged', function(err, state) {
		var connected = 0;
	});


})();
