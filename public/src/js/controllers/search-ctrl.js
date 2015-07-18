/**
 * Search Controller
 */

var url = "http://10.16.20.212:8000";
angular.module('RDash')
    .controller('SearchCtrl', ['$http', '$scope', '$stateParams',SearchCtrl]);

function SearchCtrl($http, $scope, $stateParams) {
    var self = this;
    self.isDisabled = false;
    self.repos = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.list = {
        items: [],
        transports: []
    }

    if ($stateParams.id) {
        $http.get("https://iwana.firebaseio.com/journey/" + $stateParams.id + ".json")
        .success(function(res){
            self.list = JSON.parse(atob(res));
            updatePrice(self.list);
        })
    }

    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for repos... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? self.repos.filter(createFilterFor(query)) : self.repos,
            deferred;
        return results;
    }

    function searchTextChange(text) {}

    function selectedItemChange(item) {
        if (item != null) {
            self.list.items.push(angular.copy(item));
            if (self.list.items.length > 1) {
                self.list.transports.push({
                    isOpen: false,
                    choice: "fa-male"
                })
            }
            self.searchText = null;
            self.selectedItem = null;
            updatePrice(self.list);
        }
    }
    /**
     * Build `components` list of key/value pairs
     */
    function loadAll() {
        navigator.geolocation.getCurrentPosition(function(geo) {
            var lat = "" + geo.coords.latitude;
            var log = "" + geo.coords.longitude;
            $http.get([url, "api/nearby", lat, log].join("/"))
                .success(function(res) {
                    var repos = res;
                    self.repos = repos.map(function(repo) {
                        repo.value = repo.name.toLowerCase();
                        return repo;
                    });
                });
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
        };
    }

    $scope.removeItem = function(index) {
        self.list.items.splice(index, index);
        if (index != 0) {
            self.list.transports.splice(index - 1, index - 1);
        }
    }

    $scope.recommendJourney = function() {
        self.list = {
            items: [],
            transports: []
        }
        navigator.geolocation.getCurrentPosition(function(geo) {
            var lat = "" + geo.coords.latitude;
            var log = "" + geo.coords.longitude;
            $http.get([url, "api/getjourney", lat, log].join("/"))
                .success(function(res) {
                    for (var i in res) {
                        selectedItemChange(res[i]);
                    }
                });
        });
    }

    $scope.selectTransport = function(transport, choice, index) {
        transport.choice = choice;
        if (choice == "fa-underline") {

            var latA = "" + self.list.items[index - 1].location.coordinate.latitude;
            var logA = "" + self.list.items[index - 1].location.coordinate.longitude;
            var latB = "" + self.list.items[index].location.coordinate.latitude;
            var logB = "" + self.list.items[index].location.coordinate.longitude;

            $http.get([url, "api/uberprice", latA, logA, latB, logB].join("/"))
                .success(function(res) {
                    transport.price = res.prices[0].low_estimate;
                    updatePrice(self.list);
                });
        } else {
            transport.price = null;
        }
    }

    function updatePrice(newValue) {
        $scope.sum = 0;
        for (var i in newValue.items) {
            $scope.sum += newValue.items[i].price;
        }

        for (var i in newValue.transports) {
            if (newValue.transports[i].price) {
                $scope.sum += newValue.transports[i].price;
            }
        }
    }

    $scope.saveData = function() {
      var ref = new Firebase("https://iwana.firebaseio.com/journey");
      ref.push(btoa(JSON.stringify(self.list)));

      $http.post([url, "api/saveData"].join("/"), self.list)
      .success(function(res){
        console.log(res);
      })
    }
}