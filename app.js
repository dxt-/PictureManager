var myPictureManager = angular.module('myPictureManager', ['ui.router', 'ngResource']);

myPictureManager.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

    .state('home', {
        url:         '/home',
        templateUrl: 'partials/home.html'
    })

    .state('home.list', {
        url:         '/list',
        templateUrl: 'partials/photos-list.html',
        controller: 'PhotosController'
    })

    .state('photos/:id', {
        url:         '/photos/:id',
        templateUrl: 'partials/photo.html',
        controller: 'PhotoController'
    })

    .state('add', {
        url:         '/add',
        templateUrl: 'partials/photo-add.html',
        controller: 'PhotosController'
    });

});

myPictureManager.controller('PhotosController', function($scope, $resource, $stateParams, $state) {


    // Get Photos List
    var Photos = $resource('http://jsonplaceholder.typicode.com/photos');

    Photos.query().$promise.then(function(photos) {
        $scope.photos = photos;
    });


    // Get Albums List
    var Albums = $resource('http://jsonplaceholder.typicode.com/albums');

    Albums.query()
    .$promise.then(function(albums) {
        $scope.albums = albums;
    });

    $scope.submit = function() {
        // Add Photo
        var Photo = $resource('http://jsonplaceholder.typicode.com/photos/:photoId', { photoId: $stateParams.id });

        Photo.save({url: $scope.url, albumTitle: $scope.albumTitle})
        .$promise.then(function(photo) {
            console.log(photo);
            $state.reload();
            return Photo;
        });
    };

});

myPictureManager.controller('PhotoController', function($scope, $resource, $stateParams, $state) {

    // Get Photo
    var Photo = $resource('http://jsonplaceholder.typicode.com/photos/:photoId',
        { photoId: $stateParams.id },
        { 'update': { method:'PUT' }}
    );

    Photo.get().$promise.then(function(photo) {
        $scope.photo = photo;
    });

    $scope.delete = function() {
        Photo.delete().$promise.then(function(photo) {
            console.log(photo);
            $state.reload();
            return Photo;
        });
    }

    $scope.edit = function() {
        // On update l'url de l'image
        Photo.update({url: "http://placehold.it/600/b0f7cc"}).$promise.then(function(photo) {
            console.log(photo);
            $state.reload();
            return Photo;
        });
    }

});
