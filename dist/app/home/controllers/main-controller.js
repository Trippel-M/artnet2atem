var artnetcounter = {};

(function () {
		angular.module('Home')
			.controller('mainController', ['$scope', '$rootScope', function($scope, $rootScope) {

				system.on("artnet",function(msg) {

					if (artnetcounter['universe'+msg.universe] == undefined) {
						artnetcounter['universe'+msg.universe] = 1;
					} else {
						artnetcounter['universe'+msg.universe]++;
					}

					var dom = $("<div></div>");
					for (v in artnetcounter) {
						$("<span>"+v+" <b>"+artnetcounter[v]+"</b></div>").appendTo(dom);
					}

					$("#artnetcounter").html(dom);
				});
				system.on("atem_state", function(state) {
					$("#atemconnected").html(state);
				});

				system.on("pgm_input", function(inx) {
					$("#atem_pgm").html(inx);
				});

				system.on("aux1_input",function(inx) {
					$("#atem_aux1").html(inx);
				});

				system.on("aux2_input",function(inx) {
					$("#atem_aux2").html(inx);
				});

				system.on("aux3_input",function(inx) {
					$("#atem_aux3").html(inx);
				});


			}]);
})();
