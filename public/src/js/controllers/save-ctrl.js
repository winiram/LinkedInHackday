/**
 * Master Controller
 */

angular.module('RDash')
    .controller('SaveCtrl', ['$http', '$location', SaveCtrl]);

function SaveCtrl($http, $location) {
	var self = this;
	self.data = {};
	$http.get("https://iwana.firebaseio.com/journey.json")
		.success(function(res){
			for (var i in res) {
				self.data[i] = JSON.parse(atob(res[i]));
			}
		});

	self.view = function(id) {
		// $location.path('/save')
		$location.path("/detail/"+id);
		// $location.search("id", id);
	}
}