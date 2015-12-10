(function () {
		var fs = require('fs');
		angular.module('Home')
			.controller('configController', ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.config = { };
				$scope.saved = false;

				fs.readFile(__dirname + '/../config.json', function (err, data) {
					if (!err) {

						var jdata = JSON.parse(data);

						$scope.$apply(function() {
								$scope.config = jdata;
						});

					} else {
							console.error(err);
							alert(err);
					}
				});

				$scope.saveConfig = function () {
					fs.writeFile(__dirname + '/../config.json', JSON.stringify($scope.config), function (err) {
						if (err) {
							console.error(err);
						} else {
							$scope.saved = true;
							$scope.$apply();

							system.emit("config_updated");


							setTimeout(function () {
								$scope.saved = false;
								$scope.$apply();
								window.location.href = "#/";
							}, 100);
						}
					});
				};
			}]);
})();
