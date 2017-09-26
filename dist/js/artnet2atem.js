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

	var inputName = {
		0: 'Black',
		1: 'Input 1',
		2: 'Input 2',
		3: 'Input 3',
		4: 'Input 4',
		5: 'Input 5',
		6: 'Input 6',
		7: 'Input 7',
		8: 'Input 8',
		9: 'Input 9',
		10: 'Input 10',
		11: 'Input 11',
		12: 'Input 12',
		13: 'Input 13',
		14: 'Input 14',
		15: 'Input 15',
		16: 'Input 16',
		17: 'Input 17',
		18: 'Input 18',
		19: 'Input 19',
		20: 'Input 20',
		1000: 'Color Bars',
		2001: 'Color 1',
		2002: 'Color 2',
		3010: 'Media Player 1',
		3011: 'Media Player 1 Key',
		3020: 'Media Player 2',
		3021: 'Media Player 2 Key',
		4010: 'Key 1 Mask',
		4020: 'Key 2 Mask',
		4030: 'Key 3 Mask',
		4040: 'Key 4 Mask',
		5010: 'DSK 1 Mask',
		5020: 'DSK 2 Mask',
		6000: 'Super Source',
		7001: 'Clean Feed 1',
		7002: 'Clean Feed 2',
		8001: 'Auxilary 1',
		8002: 'Auxilary 2',
		8003: 'Auxilary 3',
		8004: 'Auxilary 4',
		8005: 'Auxilary 5',
		8006: 'Auxilary 6',
		10010: 'ME 1 Prog',
		10011: 'ME 1 Prev',
		10020: 'ME 2 Prog',
		10021: 'ME 2 Prev'
	};

	var dmxInputNumber = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		1000,
		2001,
		2002,
		3010,
		3011,
		3020,
		3021,
		4010,
		4020,
		4030,
		4040,
		5010,
		5020,
		6000,
		7001,
		7002,
		8001,
		8002,
		8003,
		8004,
		8005,
		8006,
		10010,
		10011,
		10020,
		10021
	];

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

				// First channel - PGM switching
				if (lastOut1 != msg.data[dmxChannel+0] && dmxInputNumber[msg.data[dmxChannel+0]] !== undefined) {
					lastOut1 = msg.data[dmxChannel+0];
					if (connected) atem.changeProgramInput(dmxInputNumber[msg.data[dmxChannel+0]]);

					console.log("ATEM","Changing PGM out to " + inputName[dmxInputNumber[msg.data[dmxChannel+0]]]);
				}

				// AUX1 switching
				if (lastOut2 != msg.data[dmxChannel+1] && dmxInputNumber[msg.data[dmxChannel+1]] !== undefined) {
					lastOut2 = msg.data[dmxChannel+1];
					console.log("ATEM","Changing AUX 1 to " + inputName[dmxInputNumber[msg.data[dmxChannel+0]]]);
					if (connected) atem.changeAuxInput(0,dmxInputNumber[msg.data[dmxChannel+1]]);
				}

				// AUX2 switching
				if (lastOut3 != msg.data[dmxChannel+2] && dmxInputNumber[msg.data[dmxChannel+2]] !== undefined) {
					lastOut3 = msg.data[dmxChannel+2];
					console.log("ATEM","Changing AUX 2 to "+ inputName[dmxInputNumber[msg.data[dmxChannel+2]]]);
					if (connected) atem.changeAuxInput(1,dmxInputNumber[msg.data[dmxChannel+2]]);
				}

				// AUX3 switching
				if (lastOut4 != msg.data[dmxChannel+3] && dmxInputNumber[msg.data[dmxChannel+3]] !== undefined) {
					lastOut4 = msg.data[dmxChannel+3];
					console.log("ATEM","Changing AUX 3 to "+ inputName[dmxInputNumber[msg.data[dmxChannel+3]]]);
					if (connected) atem.changeAuxInput(2,dmxInputNumber[msg.data[dmxChannel+3]]);
				}

			}
		}
	};

	atem.on('stateChanged', function(err, state) {
			system.emit("pgm_input", state.video.ME[0].programInput, inputName[state.video.ME[0].programInput]);
			system.emit("aux1_input", state.video.auxs[0], inputName[state.video.auxs[0]]);
			system.emit("aux2_input", state.video.auxs[1], inputName[state.video.auxs[1]]);
			system.emit("aux3_input", state.video.auxs[2], inputName[state.video.auxs[2]]);
			system.emit("atem_state","Connected");
	});


})();
