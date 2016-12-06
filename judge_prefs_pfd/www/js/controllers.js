angular.module('starter.controllers', ['firebase','ionic'])

.controller('homeCtrl', function($scope, $state) {

  $scope.submitRoundReport = function() {
    $state.go('submitRoundReport');
  };

  $scope.searchJudges = function() {
    $state.go('search');
  };
})

.controller('submitRoundReportCtrl', function($ionicHistory, $firebaseArray, $scope, $rootScope, $state, $ionicPopup) {

  $scope.judge = {};

  $scope.rrNext = function(judge) {

    if (judge.firstName && judge.lastName && judge.rating && judge.speed && judge.winner && judge.extinction && judge.kritiks && judge.theory && judge.rebuttal) {
      var refJudges = new Firebase("https://judge-prefs-pfd.firebaseio.com/judges");
      var firstNameLower = judge.firstName.toLowerCase();
      var lastNameLower = judge.lastName.toLowerCase();
      var name = firstNameLower + " " + lastNameLower;

        refJudges.orderByChild('fullName').equalTo(name).once('value', function(snapshot) {
          var newJudge = {};

          if (snapshot.numChildren() === 0) {
            newJudge.fullName = name;
            newJudge.numReviews = 0;
            newJudge.aff_wr = 0;
            newJudge.phil = "No paradigm found";

            newJudge.rating = 0;
            newJudge.speed = 0;

            newJudge.extinction = {};
            newJudge.kritiks = {};
            newJudge.theory = {};
            newJudge.rebuttal = {};

            newJudge.extinction.yes = 0;
            newJudge.extinction.no = 0;
            newJudge.extinction.idk = 0;

            newJudge.kritiks.yes = 0;
            newJudge.kritiks.no = 0;
            newJudge.kritiks.idk = 0;

            newJudge.theory.yes = 0;
            newJudge.theory.no = 0;
            newJudge.theory.idk = 0;

            newJudge.rebuttal.yes = 0;
            newJudge.rebuttal.no = 0;
            newJudge.rebuttal.idk = 0;

            refJudges.push(newJudge);
          }
      });

      var ref = new Firebase("https://judge-prefs-pfd.firebaseio.com/user_uploads");

      judge.fullName = name;
      judge.firstName = null;
      judge.lastName = null;
      if ((judge.comments === undefined) || (judge.comments === "")) {
        judge.comments = "-1";
      }
      ref.push(judge);

      $ionicHistory.goBack(-1);
      var alertPopup = $ionicPopup.alert({title: "Round Report Submitted."});

    } else {
        var popup = $ionicPopup.alert({title: "Please enter all fields."});
    }
  };
})

.controller('searchCtrl', function($scope, $rootScope, $ionicPopup, $state) {

  $scope.finder = {};

  $scope.searchNext = function(finder) {
    if ($scope.finder.f && $scope.finder.l) {
      var ref = new Firebase("https://judge-prefs-pfd.firebaseio.com/judges");
      var firstNameLower = $scope.finder.f.toLowerCase();
      var lastNameLower = $scope.finder.l.toLowerCase();
      var name = firstNameLower + " " + lastNameLower;

      ref.orderByChild("fullName").equalTo(name).once("value", function(snapshot) {

        if (snapshot.numChildren() === 0) {
          var alertPopup6 = $ionicPopup.alert({title: "Judge Not Found."});
        } else {
          snapshot.forEach(function(childSnapshot) {
            $rootScope.result = {};

            $rootScope.result.first_name = firstNameLower.substring(0,1).toUpperCase() + firstNameLower.substring(1);
            $rootScope.result.last_name = lastNameLower.substring(0,1).toUpperCase() + lastNameLower.substring(1);
            $rootScope.result.speed = childSnapshot.child('speed').val();
            $rootScope.result.aff_wr = childSnapshot.child('aff_wr').val();
            $rootScope.result.rating = childSnapshot.child('rating').val();
            $rootScope.result.numReviews = childSnapshot.child('numReviews').val();
            $rootScope.result.phil = childSnapshot.child('phil').val();

            $rootScope.result.extinction = {};
            $rootScope.result.kritiks = {};
            $rootScope.result.theory = {};
            $rootScope.result.rebuttal = {};

            $rootScope.result.extinction.yes = childSnapshot.child('extinction').child('yes').val();
            $rootScope.result.extinction.no = childSnapshot.child('extinction').child('no').val();
            $rootScope.result.extinction.idk = childSnapshot.child('extinction').child('idk').val();

            $rootScope.result.kritiks.yes = childSnapshot.child('kritiks').child('yes').val();
            $rootScope.result.kritiks.no = childSnapshot.child('kritiks').child('no').val();
            $rootScope.result.kritiks.idk = childSnapshot.child('kritiks').child('idk').val();

            $rootScope.result.theory.yes = childSnapshot.child('theory').child('yes').val();
            $rootScope.result.theory.no = childSnapshot.child('theory').child('no').val();
            $rootScope.result.theory.idk = childSnapshot.child('theory').child('idk').val();

            $rootScope.result.rebuttal.yes = childSnapshot.child('rebuttal').child('yes').val();
            $rootScope.result.rebuttal.no = childSnapshot.child('rebuttal').child('no').val();
            $rootScope.result.rebuttal.idk = childSnapshot.child('rebuttal').child('idk').val();

            $state.go('searchresults');
          });
        }

      });

    } else {
      var alertPopup7 = $ionicPopup.alert({title: "Please enter full name."});
    }
  };
})

.controller('searchresultsCtrl', function($scope, $rootScope, $state, $ionicModal, $ionicPopup, $filter) {

    $scope.first_name = $rootScope.result.first_name;
    $scope.last_name = $rootScope.result.last_name;

    $scope.numReviews = $rootScope.result.numReviews;

    var t = $scope.numReviews;
    if (t === 0) {
      t = 1;
    }

    $scope.speed = Math.round($rootScope.result.speed / t);
    $scope.rating = Math.round($rootScope.result.rating / t);
    $scope.aff_wr = Math.round($rootScope.result.aff_wr  / t * 100);

    if ($rootScope.result.numReviews === 0) {
      $scope.neg_wr = 0;
    } else {
      $scope.neg_wr = Math.round(100 - $scope.aff_wr);
    }

    if ($rootScope.result.phil == "I love Ashmita") {
      $scope.phil = "No paradigm found";
    }
    else {
      $scope.phil = $rootScope.result.phil;
    }

    $scope.extinction = {};
    $scope.kritiks = {};
    $scope.theory = {};
    $scope.rebuttal = {};

    $scope.extinction.yes = Math.round($rootScope.result.extinction.yes / t * 100);
    $scope.extinction.no = Math.round($rootScope.result.extinction.no / t * 100);
    $scope.extinction.idk = Math.round($rootScope.result.extinction.idk / t * 100);

    $scope.kritiks.yes = Math.round($rootScope.result.kritiks.yes / t * 100);
    $scope.kritiks.no = Math.round($rootScope.result.kritiks.no / t * 100);
    $scope.kritiks.idk = Math.round($rootScope.result.kritiks.idk / t * 100);

    $scope.theory.yes = Math.round($rootScope.result.theory.yes / t * 100);
    $scope.theory.no = Math.round($rootScope.result.theory.no / t * 100);
    $scope.theory.idk = Math.round($rootScope.result.theory.idk / t * 100);

    $scope.rebuttal.yes = Math.round($rootScope.result.rebuttal.yes / t * 100);
    $scope.rebuttal.no = Math.round($rootScope.result.rebuttal.no / t * 100);
    $scope.rebuttal.idk = Math.round($rootScope.result.rebuttal.idk / t * 100);

    var ref = new Firebase("https://judge-prefs-pfd.firebaseio.com/comments/");

    var name = $scope.first_name.toLowerCase() + " " + $scope.last_name.toLowerCase();

    $ionicModal.fromTemplateUrl('templates/comments.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.closeAdd = function() {
      $scope.modal.hide();
    };

    $scope.viewComments = function() {
      $scope.modal.show();
      ref.orderByChild("fullName").equalTo(name).once("value", function(snapshot) {

        if (snapshot.numChildren() === 0) {
          $ionicPopup.alert({title: "No Comments Found."}).then(function(res) {
            $scope.closeAdd();
          });
        } else {
          var comments = {};
          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key();
            var temp = {};
            temp.comment = childSnapshot.child("comments").val();
            var timestamp = childSnapshot.child('timestamp').val();
            temp.timestamp = $filter('date')(new Date(timestamp), 'M-d-yyyy');
            comments[key] = temp;
          });
          console.log(comments);
          $scope.comments = comments;
        }
      });
    };

});
