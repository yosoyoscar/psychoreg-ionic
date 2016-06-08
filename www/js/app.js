// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('psychoreg', ['ionic', 'ngCordova', 'psychoreg.controllers','psychoreg.services','lbServices'])

//.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
.run(function($ionicPlatform, $rootScope, $ionicLoading, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
/*      $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);*/
  });
    
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/children.html',
        controller: 'ChildrenController'
      }
    }
  })

  .state('app.behaviours', {
    url: '/behaviours/:id',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/behaviours.html',
        controller: 'BehavioursController'
      }
    }
  })

  .state('app.addchild', {
    url: '/addchild',
    views: {
      'mainContent': {
        templateUrl: 'templates/addChild.html',
        controller: 'AddChildController'
      }
    }
  })

  .state('app.sleep', {
    url: '/sleep/:id',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/sleep.html',
        controller: 'SleepController'
      }
    }
  })

  .state('app.eating', {
    url: '/eating/:id',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/eating.html',
        controller: 'EatingController'
      }
    }
  })

  .state('app.enconpresis', {
    url: '/encopresis/:id',
    cache:false,
    views: {
      'mainContent': {
        templateUrl: 'templates/encopresis.html',
        controller: 'EncopresisController'
      }
    }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
