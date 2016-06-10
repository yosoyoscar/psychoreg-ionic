angular.module('psychoreg.controllers', [])

//.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthService) {
.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaImagePicker, AuthService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};
    $scope.registration = {};
    $scope.loggedIn = false;

    if(AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
    }
    else if ($scope.loginData && $scope.loginData.username && $scope.loginData.password){
        AuthService.login($scope.loginData);
    }

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        //console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        $scope.closeLogin();
    };
    
    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
      
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
    });
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthService.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
       
    $rootScope.$on('registration:Successful', function () {
        $localStorage.storeObject('userinfo',$scope.loginData);
    });
    
//    $ionicPlatform.ready(function() {
        /*var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };*/
        
/*          var pickoptions = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
          };*/
        
/*        $scope.pickImage = function() {
          $cordovaImagePicker.getPictures(pickoptions)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                      $scope.registration.imgSrc = results[0];
                  }
              }, function (error) {
                  // error getting photos
              });
        };*/
 
//    });
})

.controller('ChildrenController', ['$scope', '$rootScope', 'AuthService', 'Customer', 'Child', 'baseURL', function ($scope, $rootScope, AuthService, Customer, Child, baseURL) {

    $scope.baseURL = baseURL;
    $scope.hasChildren = true;
    $scope.firstTime = true;

    var loadChildren = function (){
        $scope.showMessage = true;
        $scope.message = 'Loading ...';
        $scope.children = [];
        Customer.findById({id: AuthService.getUsernameId()})
        .$promise.then(
            function (response) {
                var customer = response;
                Child.find()
                .$promise.then(
                function (response) {
                    //console.log('ChildrenController-customer.tokens:' + customer.tokens);
                    for (var i = response.length - 1; i >= 0; i--) {
                        //console.log('ChildrenController-response[' + i + '].token:' + response[i].token);
                        if (customer.tokens.indexOf(response[i].token) > -1){
                            $scope.children.push(response[i]);
                        }
                    }
                    if ($scope.children.length >= 1){
                        $scope.hasChildren = true;
                    }
                    else{
                        $scope.hasChildren = false;
                    }
                    $scope.showMessage = false;
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                    if (response.status == 401){
                        $scope.message = $scope.message + '. Please log in or register.';
                    }
                    $scope.showMessage = true;
                });
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                console.log('psychoreg-log:' + "Error: " + response.status + " " + response.statusText);
                $scope.showMessage = true;
            }
        );
    };

    if (AuthService.getUsernameId()){
        $scope.firstTime = false;
        loadChildren();
    };

    $rootScope.$on('login:Successful', function () {
        console.log('ChildrenController login received');
        $scope.firstTime = false;
        loadChildren();
    });
}])

.controller('BehavioursController', ['$scope', 'Child', 'Behaviour', '$stateParams', '$location', function ($scope, Child, Behaviour, $stateParams, $location) {

    $scope.hasBehaviuors = true;
    Child.findById({id: $stateParams.id})
        .$promise.then(
            function (response) {
                $scope.child = response;
                $scope.child.birthDate = new Date($scope.child.birthDate);
                //$scope.child.behaviours = Behaviour.find({ filter: { where: { childrenId: $stateParams.id } } })
                getBehaviours();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            }
        );
    
    getBehaviours = function() {
        Behaviour.find({ filter: { where: { childrenId: $stateParams.id } } })
        .$promise.then(
        function (response) {
            $scope.child.behaviours = response;
            if ($scope.child.behaviours.length >= 1){
                $scope.hasBehaviuors = true;
            }
            else{
                $scope.hasBehaviuors = false;
            }
        },
        function (response) {
            console.log("Error: " + response.status + " " + response.statusText);
        });
    };

    $scope.addBehaviour = function() {
        if ($scope.child.disorder == 'Sleep'){
            $location.path('/app/sleep/' + $stateParams.id);
        }
        if ($scope.child.disorder == 'Eating'){
            $location.path('/app/eating/' + $stateParams.id);
        }
        if ($scope.child.disorder == 'Encopresis'){
            $location.path('/app/encopresis/' + $stateParams.id);
        }
    };

    $scope.deleteBehaviour = function(behaviourId) {
        Behaviour.destroyById({id: behaviourId})
        .$promise.then(
            function (response) {
                //$scope.child.behaviours = Behaviour.find({ filter: { where: { childrenId: $stateParams.id } } });
                getBehaviours();
            },
            function (response) {
                console.log("Error: " + response.status + " " + response.statusText);
            }
        );
    }
}])

.controller('AddChildController', ['$scope', 'Child', 'Customer', 'AuthService', '$location', function ($scope, Child, Customer, AuthService, $location) {

    $scope.newToken = '';
    $scope.addChild = function(newToken) {
        $scope.newToken = newToken;
        Child.find({ where: { token: $scope.newToken } } )
        .$promise.then(
            function (response) {
                var child = response;

                Customer.findById({id: AuthService.getUsernameId()},
                  function(customer) {
                        console.log('AddChildController-customer:' + JSON.stringify(customer));
                        console.log('$scope.newToken:' + $scope.newToken);
                        if (customer.tokens){
                            if (customer.tokens.indexOf($scope.newToken) < 0){
                                customer.tokens.push($scope.newToken);
                            }
                        }
                        else{
                            customer.tokens = [$scope.newToken];
                        }
                        console.log('AddChildController-customer.tokens:' +  customer.tokens);
                        Customer.prototype$updateAttributes({id: AuthService.getUsernameId(),'tokens': customer.tokens}, function(err, instance) {
                            console.log(err || instance);
                          });
                        $location.path('/app/');
                  });


            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
                console.log('AddChildController-Error:' + JSON.stringify(response))
            }
        );
    }
}])

.controller('SleepController', ['$scope', 'Behaviour', '$stateParams', '$rootScope', '$ionicHistory', function ($scope, Behaviour, $stateParams, $rootScope, $ionicHistory) {

    $scope.behaviour = {what:'wakeup', who:'mother',  where:'home', mood:'neutral', quantity:'nill'};
    $scope.behaviour.date = new Date();
    $scope.behaviour.date.setSeconds(0);
    $scope.behaviour.date.setMilliseconds(0);

    $scope.insertBehaviour = function() {
        $scope.behaviour.childrenId = $stateParams.id;
        $scope.behaviour.customerId = $rootScope.currentUser.id;
        //console.log('Sleep behaviour:' + JSON.stringify($scope.behaviour));
        Behaviour.create($scope.behaviour);
        $ionicHistory.goBack();
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

}])

.controller('EatingController', ['$scope', 'Behaviour', '$stateParams', '$rootScope', '$ionicHistory', function ($scope, Behaviour, $stateParams, $rootScope, $ionicHistory) {

    $scope.behaviour = {what:'lunch', who:'mother', where:'home', mood:'neutral', quantity:'all'};
    $scope.behaviour.date = new Date();
    $scope.behaviour.date.setSeconds(0);
    $scope.behaviour.date.setMilliseconds(0);

    $scope.insertBehaviour = function() {
        $scope.behaviour.childrenId = $stateParams.id;
        $scope.behaviour.customerId = $rootScope.currentUser.id;
        //console.log('Eating behaviour:' + JSON.stringify($scope.behaviour));
        Behaviour.create($scope.behaviour);
        $ionicHistory.goBack();
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

}])

.controller('EncopresisController', ['$scope', 'Behaviour', '$stateParams', '$rootScope', '$ionicHistory', function ($scope, Behaviour, $stateParams, $rootScope, $ionicHistory) {

    $scope.behaviour = {what:'poo', who:'mother', where:'home', mood:'neutral', quantity:'few'};
    $scope.behaviour.date = new Date();
    $scope.behaviour.date.setSeconds(0);
    $scope.behaviour.date.setMilliseconds(0);

    $scope.insertBehaviour = function() {
        $scope.behaviour.childrenId = $stateParams.id;
        $scope.behaviour.customerId = $rootScope.currentUser.id;
        //console.log('Encopresis behaviour:' + JSON.stringify($scope.behaviour));
        Behaviour.create($scope.behaviour);
        $ionicHistory.goBack();
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

}])

;