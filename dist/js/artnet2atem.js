(function(){


	var fs            = require('fs');
	var debug					= require("debug")("main");
	var ATEM					= require('applest-atem');
	var atem					= new ATEM();
	var artnetsrv     = require("artnet-node");

	var connected = 0;

	var lastOut1 = 0;
	var lastOut2 = 0;
	var lastOut3 = 0;
	var lastOut4 = 0;

//	system.emit("atem_connected",false);
	system.emit("atem_state","Connecting");

	var artnet_server;

	var atemIP;
	var dmxChannel;
	var dmxUniverse;

	system.on('get_atem_state', function () {
			setImmediate(function () {
				system.emit('atem_state', connected ? 'Connected' : 'Disconnected');
			});
	});


	system.on("config_updated", function() {
		fs.readFile(__dirname + '/../config.json', function (err, data) {
			var configx = JSON.parse(data);
			if (!err) {
				connected = 0;
				system.emit('atem_state', 'Disconnected');
				console.log("Config is:", configx);
				atemIP				= configx.atem_ip;
				dmxChannel		= configx.artnet_start;
				dmxChannel--;
				dmxUniverse		= configx.artnet_uni;

				atem.connect(atemIP, 9910);

				if (typeof artnet_server != 'undefined') {
					artnet_server.close();
				}

				artnet_server = artnetsrv.Server.listen(6454, configx.our_ip, artnet_data);
			} else {
				alert('Klarte ikke lese konfigurasjonsfilen!');
			}
		});
	});
	system.emit("config_updated");

	atem.on('connect', function() {
		system.emit("atem_state","Connected");
		connected = 1;
	});
	console.log("listening");

	var artnet_data = function(err, msg, peer) {

		if (err) {
			console.error(err);
			alert("ARTNET Error: " + err);
			return;
		}
		if (msg.type != 'ArtOutput') {
			// not artnet
		}

		else {

			system.emit("artnet",msg);

			if (msg.universe == dmxUniverse) {
				if (msg.data[dmxChannel+0] == 255) msg.data[dmxChannel+0] = 2001; // colorbars at full on pgm
				if (msg.data[dmxChannel+1] == 255) msg.data[dmxChannel+1] = 2001; // colorbars at full on aux1
				if (msg.data[dmxChannel+2] == 255) msg.data[dmxChannel+2] = 2001; // colorbars at full on aux2
				if (msg.data[dmxChannel+3] == 255) msg.data[dmxChannel+3] = 2001; // colorbars at full on aux3
			}

			// First channel - PGM switching
			if (msg.universe == dmxUniverse) {
				if (lastOut1 != msg.data[dmxChannel+0]) {
					lastOut1 = msg.data[dmxChannel+0];
					if (connected) atem.changeProgramInput(msg.data[dmxChannel+0]);
					//system.emit("pgm_input",msg.data[dmxChannel+0]);
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
					//system.emit("aux1_input",msg.data[dmxChannel+1]);
					if (connected) atem.changeAuxInput(0,msg.data[dmxChannel+1]);
				}
			}

			// AUX2 switching
			if (msg.universe == dmxUniverse) {
				if (lastOut3 != msg.data[dmxChannel+2]) {
					lastOut3 = msg.data[dmxChannel+2];
					console.log("ATEM","Changing AUX 2 to input "+ msg.data[dmxChannel+2]);
					//system.emit("aux2_input",msg.data[dmxChannel+2]);
					if (connected) atem.changeAuxInput(1,msg.data[dmxChannel+2]);
				}
			}

			// AUX3 switching
			if (msg.universe == dmxUniverse) {
				if (lastOut4 != msg.data[dmxChannel+3]) {
					lastOut4 = msg.data[dmxChannel+3];
					console.log("ATEM","Changing AUX 3 to input "+ msg.data[dmxChannel+3]);
					//system.emit("aux2_input",msg.data[dmxChannel+2]);
					if (connected) atem.changeAuxInput(2,msg.data[dmxChannel+3]);
				}
			}

		}
	};

	atem.on('stateChanged', function(err, state) {
			system.emit("pgm_input", state.video.programInput);
			system.emit("aux1_input", state.video.auxs[0]);
			system.emit("aux2_input", state.video.auxs[1]);
			system.emit("aux3_input", state.video.auxs[2]);
			system.emit("atem_state","Connected");
	});


})();
