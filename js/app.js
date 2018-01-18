var app = angular.module('AppCrud', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "pages/list.html",
        controller: "ListCustomerCtrl"
    })
    .when("/new", {
        templateUrl : "pages/save.html",
        controller: "NewCustomerCtrl"
    })
    .when("/view", {
        templateUrl : "pages/view.html",
        controller: "ViewCustomerCtrl"
    })

    .when("/update", {
        templateUrl : "pages/save.html",
        controller: "UpdateCustomerCtrl"
    });
});

app.service('CustomerService', function() {

    var setItem = function(key, json) {
        var data = JSON.stringify(json);
        localStorage.setItem(key, data);
    };

    var getItem = function(key) {
        var data = localStorage.getItem(key);
        if (data) {
            return JSON.parse(data);
        }
    }

    var getPosts = function() {
        return getItem('posts') || [];
    }

    var setPosts = function(data) {
        setItem('posts', data);
    }

    return {
        list: function() {
            return getPosts();
        },
        find: function(id) {
            var posts = getPosts();
            var length = posts.length;
            if (length > 0) {
                for (var i=0; i<length; i++) {
                    if (posts[i].customerId == id) {
                        return posts[i];
                    }
                }
            }
            return null;
        },
        save: function(data) {
            var posts = getPosts();
            var length = posts.length;

            if (data.customerId) {
                for (var i=0; i<length; i++) {
                    if (posts[i].customerId == data.customerId) {
                        posts[i] = data;
                    }
                }
            } else {
                data.customerId = length + 1;
                posts.push(data);
            };

            setPosts(posts);
        }
    };
});

app.controller('ListCustomerCtrl', function($scope, CustomerService) {
    $scope.customers = [];

    $scope.listCustomer = function() {
        $scope.customers = CustomerService.list();
    };

    $scope.listCustomer();
});

app.controller('NewCustomerCtrl', function($scope, CustomerService, $location) {
    $scope.customer = {};

    $scope.saveCustomer = function() {
        CustomerService.save($scope.customer);
        $scope.customer = {};
        $location.path("/");
    };
});

app.controller('ViewCustomerCtrl', function($scope, CustomerService, $location) {
    $scope.customer = {};

    $scope.showCustomer = function() {
        var query = $location.search();
        if (query && query.customerId) {
            var id = query.customerId;
            $scope.customer = CustomerService.find(id);
            console.log("showCustomer: ", $scope.customer);
        }
    };

    $scope.showCustomer();
});

app.controller('UpdateCustomerCtrl', function($scope, CustomerService, $location) {
    $scope.customer = {};

    $scope.showCustomer = function() {
        var query = $location.search();
        if (query && query.customerId) {
            var id = query.customerId;
            $scope.customer = CustomerService.find(id);
            console.log("showCustomer: ", $scope.customer);
        }
    };

    $scope.saveCustomer = function() {
        CustomerService.save($scope.customer);
        $scope.customer = {};
        $location.path("/");
    };

    $scope.showCustomer();
});
