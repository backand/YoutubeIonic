angular.module('SimpleRESTIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin() {
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin() {
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
            login.username = Backand.getUsername();
    }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        function socialSignIn(provider) {
            LoginService.socialSignIn(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        function socialSignUp(provider) {
            LoginService.socialSignUp(provider)
                .then(onValidLogin, onErrorInLogin);

        }

        onValidLogin = function(response){
            onLogin();
            login.username = response.data;
        }

        onErrorInLogin = function(rejection){
            login.error = rejection.data;
            $rootScope.$broadcast('logout');

        }


        login.username = '';
        login.error = '';
        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
        login.socialSignup = socialSignUp;
        login.socialSignin = socialSignIn;

    })

    .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService) {
        var vm = this;

        vm.signup = signUp;

        function signUp(){
            vm.errorMessage = '';

            LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
                .then(function (response) {
                    // success
                    onLogin();
                }, function (reason) {
                    if(reason.data.error_description !== undefined){
                        vm.errorMessage = reason.data.error_description;
                    }
                    else{
                        vm.errorMessage = reason.data;
                    }
                });
        }


        function onLogin() {
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }


        vm.email = '';
        vm.password ='';
        vm.again = '';
        vm.firstName = '';
        vm.lastName = '';
        vm.errorMessage = '';
    })

    .controller('DashboardCtrl', function ($scope, $http, Backand) {
      function fetchFromYoutube(q) {
        $scope.youtubeParams = {
          key: 'AIzaSyAnAi9xKNqI_xNGDKHtFZrInz5l_QkMqNs',
          type: 'video',
          maxResults: '5',
          part: 'id,snippet',
          q: q,
          order: 'viewCount'
        }

        $http.get('https://www.googleapis.com/youtube/v3/search', {params: $scope.youtubeParams}).success(function (response) {
          $scope.videos = [];
          angular.forEach(response.items, function (child) {
            console.log(child);
            $scope.videos.push(child);
          });
        });
      }


      fetchFromYoutube('messi');

      $scope.search = function(){
        fetchFromYoutube(this.query);
      }

      $scope.play = function(video){
         $http ({
          method: 'POST',
          url: Backand.getApiUrl() + '/1/objects/videoMetadata?returnObject=true',
          data: {
            videoId: video.id.videoId,
            thumbUrl: video.snippet.thumbnails.high.url,
            time: new Date()
          }
        });
      }
    });

