angular.module('modules.search.organisation', [
]);
angular.module('modules.search.organisation').

directive('organisationSearch', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            data        : '=',  // The data array, will default to []
            single      : '=?', // true || false - This will overwrite the first entry in the array
            noArray     : '=?', // true || false - This will make it an object not array of objects
            placeholder : '@?',
            searchText  : '=?',
            focus       : '=?',  // true || false - Autofocus
            organisationType : '@?', // school || company - sets the type on creation
        },
        template: require('./tpls/organisation-search.html'),
        controller : function ($scope, $http, OrganisationModalService){
            // Default data
            $scope.data = $scope.data || [];

            // Set the typeahead text
            if($scope.noArray && $scope.data && $scope.data.name){
                $scope.searchText = $scope.data.name;
            }
            else if($scope.single && $scope.data[0] && $scope.data[0].name){
                $scope.searchText = $scope.data[0].name;
            }

            $scope.search = function(name) {
                return $http({
                    url: '/api/v1/search',
                    params: {
                        type : 'organisation',
                        key : 'name',
                        value : name,
                        match : 'regex'
                    }
                }).then(function (response) {
                    // remove any organisations that are
                    // already added from the response
                    var result = response.data.filter(function (organisation) {
                        return !_.any($scope.existing, {
                            _id : organisation._id
                        });
                    });
                    result.push({
                        addNew     : true,
                        name       : (result.length === 0 ? 'Organisation not found. Create ' : 'None of these? Create ') + name,
                        searchText : name
                    })
                    return result;
                });
            }

            // Process Result
            $scope.processResult = function(result){
				if(result){
                    if(result.addNew){
                        $scope.create(null, result.searchText);
                        $scope.searchText = '';
                    }
                    else{
                        if($scope.noArray){
                            $scope.data = result;
                        }
                        else if ($scope.single) {
                            $scope.data[0] = result;
                            $scope.searchText = result.name;
                        } else {
                            $scope.data.push(result);
                            // Remove non-uniques
                            $scope.data = _.uniq($scope.data, '_id');
                            // clear the typeahead text on selection
                            $scope.searchText = '';
                        }
                    }
				}
            }

            // Create organisationNewModal
            $scope.create = function(event, name){
                var data = {
                    name : name,
                    organisationType : $scope.organisationType
                }
                OrganisationModalService.organisationNewModal(event, data).then(function(result) {
                    $scope.processResult(result);
                });
            };
        }
    };
});