(function () {
	angular.module('Home')

			.config(function ($routeProvider) {

				$routeProvider.when('/config', {
					templateUrl: 'pages/config/index.html',
					controller: 'configController',
					controllerAs: 'config'
				});

				$routeProvider.when('/', {
					templateUrl: 'pages/main/index.html',
					controller: 'mainController',
					controllerAs: 'main'
				});

				$routeProvider.otherwise({
					redirectTo: '/'
				});

			});
})();
