(function() {
  'use strict';

  angular.module('Home', ['ngRoute']).

	run(
    [
      '$rootScope', function($rootScope) {

			$rootScope.path = '#/';

			$rootScope.$on(
        '$routeChangeSuccess',
        function (event, current, previous) {
					$rootScope.path = current.$$route ? current.$$route.originalPath : '';
			  }
      );

			$rootScope.loaded = true;
	   }
   ]
  )

  .directive(
    'back',
    [
      '$window',
      function($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
              elem.bind(
                'click',

                function () {
                  $window.location.href = "#/";
                }

              );
            }
        };

      }
    ]
  )

	.directive(
    'quit',
    [
      function() {

        return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
            elem.bind(
              'click',

              function () {
								var ipcRenderer = require('electron').ipcRenderer;
                ipcRenderer.send('quit', {});
              }

            );
          }
        };

      }
    ]
  );


})();
