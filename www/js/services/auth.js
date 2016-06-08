'use strict';

angular
  .module('psychoreg.services',[])
  //.constant("baseURL", "http://muppala-testing.eu-gb.mybluemix.net/")
  .constant("baseURL", "http://psychoreg.eu-gb.mybluemix.net/")
  //.constant("baseURL", "http://localhost:3000/")
  .factory('AuthService', ['Customer', '$q', '$rootScope', '$ionicPopup', 
    function(Customer, $q, $rootScope, $ionicPopup) {
    function login(loginData) {
      console.log('Doing login', loginData);
      return Customer
        .login(loginData)
        .$promise
        .then(function(response) {
          if (!response.user.psycho){
            $rootScope.currentUser = {
              id: response.user.id,
              tokenId: response.id,
              username: loginData.username
            };
            $rootScope.$broadcast('login:Successful');
          }
          else{
            var message = '<div><p> Mobile app only available for parents. Psychologists should use web app.</p></div>';
            
            var alertPopup = $ionicPopup.alert({
                  title: '<h4>Login Failed!</h4>',
                  template: message
            });

            alertPopup.then(function(res) {
                  console.log('Login Failed!');
            });
          }

        },
        function(response){
          console.log('psychoreg-log:' + JSON.stringify(response));

              var message = '<div><p>' +  response.data.error.message + 
                  '</p><p>' + response.data.error.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Login Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Login Failed!');
                });
        });
    }
      
    function isAuthenticated() {
        if ($rootScope.currentUser) {
            return true;
        }
        else{
            return false;
        }
    }
      
    function getUsername() {
        return $rootScope.currentUser.username;
    }

    function getUsernameId() {
      //console.log('$rootScope.currentUser:' + JSON.stringify($rootScope.currentUser));
      if($rootScope.currentUser){
        return $rootScope.currentUser.id;
      }
      else{
        return null;
      }
    }

    function logout() {
      return Customer
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
       });
    }

    function register(registerData) {
      return Customer
        .create({
         username: registerData.username,
         email: registerData.email,
         password: registerData.password,
         psycho: false
       })
       .$promise
      .then (function(response) {
          
        },
        function(response){
            
              var message = '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';
            
               var alertPopup = $ionicPopup.alert({
                    title: '<h4>Registration Failed!</h4>',
                    template: message
                });

                alertPopup.then(function(res) {
                    console.log('Registration Failed!');
                });

        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      getUsername: getUsername,
      getUsernameId: getUsernameId
    };
  }])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])
;
