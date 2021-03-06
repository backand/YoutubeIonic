// Create your app with 'youtube-embed' dependency
var myApp = angular.module('myApp', ['youtube-embed', 'ngRoute', 'hljs', 'backand']);
myApp.config(function (BackandProvider) {
BackandProvider.setAppName('ionic6');
      BackandProvider.setSignUpToken('5d321418-f96b-4dfb-a91b-d6bb2be59ce7');
      BackandProvider.setAnonymousToken('89d2cc59-b927-457a-bcba-290d8d7395f9');
    BackandProvider.runSocket(true); //enable the web sockets that makes the database realtime

});

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'demo/the.html',
    controller: 'TheCtrl'
  })
  .when('/advanced', {
    templateUrl: 'demo/advanced.html',
    controller: 'AdvancedCtrl'
  })
  .otherwise('/');
}]).run(function ($rootScope, $window) {
  $rootScope.$on('$routeChangeSuccess', function () {
    $window.scrollTo(0, 0);
  });
});

// Inside your controller...
myApp.controller('TheCtrl', function ($scope, Backand) {
    $scope.playerVars = {
        controls: 1,
        autoplay: 1
    };
    Backand.on('playVideo', function (data) {
        //Get the 'items' object that have changed
        console.log(data);
        $scope.theBestVideo = data[0].Value;
    });

    // have a video ID
    $scope.theBestVideo = 'sMKoNBRZM1M';

    // or a URL
    $scope.anotherGoodOne = 'https://www.youtube.com/watch?v=18-xvIjH8T4';
});

myApp.controller('AdvancedCtrl', function ($scope) {

    $scope.specifiedTime = {
        url: 'https://www.youtube.com/watch?v=Im4TO03CuF8#t=10s',
        player: null
    };

    $scope.looper = {
        video: 'u2-ZGCoKh-I',
        player: null
    };

    $scope.$on('youtube.player.ended', function ($event, player) {
        if (player === $scope.looper.player) {
            player.playVideo();
        }
    });

    $scope.custom = {
        video: 'FGXDKrUoVrw',
        player: null,
        vars: {
            controls: 0
        }
    };

    $scope.conditional = {
        video: '-m-vVKHideI',
        visible: false,
        toggle: function () {
            this.visible = !this.visible;
        },
        vars: {
            autoplay: 1
        }
    };

    $scope.playlist = {
        vars: {
            list: 'PLISo53ifQd_iBPpybJay-SCAULHsoRicc'
        }
    };

    var first = 'biZLZZFb468';
    var second = 'lbVdyPZiOLM';
    $scope.dynamic = {
        video: first,
        change: function () {
            if ($scope.dynamic.video === first) {
                $scope.dynamic.video = second;
            } else {
                $scope.dynamic.video = first;
            }
        }
    };
});
