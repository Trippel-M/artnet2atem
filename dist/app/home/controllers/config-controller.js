(function () {
		var fs = require('fs');
		angular.module('Home')
			.controller('configController', ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.config = { };
				$scope.saved = false;

				fs.readFile(__dirname + '/../config.json', function (err, data) {
					console.log("Result reading file:", err, data, JSON.parse(data));
					if (!err) {

						var jdata = JSON.parse(data);

						$scope.$apply(function() {
								$scope.config = jdata;
						});

					} else {
							console.error(err);
					}
				});

				$scope.saveConfig = function () {
					console.log("Saving: ", $scope.config);

					fs.writeFile(__dirname + '/../config.json', JSON.stringify($scope.config), function (err) {
						if (err) {
							console.error(err);
						} else {
							$scope.saved = true;
							$scope.$apply();

							setTimeout(function () {
								$scope.saved = false;
								$scope.$apply();
							}, 1000);
						}
					});
				};
			}]);
})();
