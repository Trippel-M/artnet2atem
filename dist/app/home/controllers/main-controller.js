(function () {
	var artnetcounter = {};
	var scope = {
		artnetcounter: artnetcounter,
		atemstatus: 'Disconnected',
		atemio: {
			'PGM': '?',
			'AUX1': '?',
			'AUX2': '?',
			'AUX3': '?'
		}
	};

	/* Har den her så den teller uavhengig av om siden står oppe */
	system.on("artnet", function (msg) {

			if (artnetcounter['Universe '+msg.universe] == undefined) {
				artnetcounter['Universe '+msg.universe] = 1;
			} else {
				artnetcounter['Universe '+msg.universe]++;
			}

	});

	angular.module('Home')
			.controller('mainController', ['$scope', '$rootScope', function($scope, $rootScope) {
					/* Link $scope sine variabler mot våre lokale "persistant" variabler */
					for (var key in scope) {
						$scope[key] = scope[key];
					}

				var artnet;
				system.on("artnet", artnet = function (msg) {
						/* Oppdater gui */
						$scope.$apply();
				});

				var atem_state;
				system.on("atem_state", atem_state = function(state) {
						/* atemstatus er en string, og ikke et objekt, så her må vi kopiere stringen selv, kun objekter som kopieres på referanse i js */
						$scope.atemstatus = state;
						scope.atemstatus = state;
				});
				// Få umiddelbar oppdatering
				system.emit('get_atem_state');

				var pgm_input;
				system.on("pgm_input", pgm_input = function(inx, name) {
						$scope.$apply(function () {
							$scope.atemio['PGM'] = name;
						});
				});

				var aux1_input;
				system.on("aux1_input", aux1_input = function(inx, name) {
						$scope.$apply(function () {
							$scope.atemio['AUX1'] = name;
						});
				});

				var aux2_input;
				system.on("aux2_input", aux2_input = function(inx, name) {
						$scope.$apply(function () {
							$scope.atemio['AUX2'] = name;
						});
				});

				var aux3_input;
				system.on("aux3_input", aux3_input = function(inx, name) {
						$scope.$apply(function () {
							$scope.atemio['AUX3'] = name;
						});
				});

				/* Vil ikke ha noe minnelekasjer nei */
				$scope.$on('$destroy', function () {
					system.removeListener('artnet', artnet);
					system.removeListener('atem_state', atem_state);
					system.removeListener('pgm_input', pgm_input);
					system.removeListener('aux1_input', aux1_input);
					system.removeListener('aux2_input', aux2_input);
					system.removeListener('aux3_input', aux3_input);
				});

			}]);
})();
