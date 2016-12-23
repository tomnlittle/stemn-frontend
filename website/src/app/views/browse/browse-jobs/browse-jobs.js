import jobStepTpl from 'ngtemplate!app/views/landing/landing-jobs/tpls/jobs-steps.html';
import './browse-jobs.scss';

angular.module('views.browse.jobs', [

]);
angular.module('views.browse.jobs').

config(function ($stateProvider) {
    $stateProvider.
    state('app.browse.jobs', {
        url: '/jobs?near[]&sort&order&parentType&parentId',
        template: require('./browse-jobs.html'),
        layout: {
            size: 'lg',
            footer: true
        },
        resolve: {
            fields: function(SearchService){
                return SearchService.search({
                    type: 'field',
                    page: 1,
                    size: 11,
                    sort: 'numJobs',
                    select: ['name','numJobs'],
                    key: 'name',
                }).then(function (response) {
                    return response.data
                });
            }
        },
        seo: function(resolve){
            return {
                title : "Aerospace Jobs - Simple 2 Click Application - STEMN",
            }
        },
        controller: 'BrowseJobsViewCtrl',
        data: {
            name: 'Jobs'
        }
    });
}).

controller('BrowseJobsViewCtrl', function(fields, $scope, $http, $timeout, HttpQuery, NewCreationsService, LocationService, Authentication, JobModalService, QueryParamsService, $stateParams, CoreLibrary){
    // Init
    LocationService.getLocation().then(function(location){
        $scope.location = location;
    })

    var maxRating;

    // Filters
    $scope.orderFilter = {
        model    : $stateParams.sort || 'organisations[0].name',
        reverse  : $stateParams.order ? ($stateParams.order == 'asc' ? true : false) : 'asc',
        onChange : function(value){
            delete $scope.query.params['near[]'];
            // If we are sorting by location
            if($scope.orderFilter.model == 'location[0].name' && $scope.location.latitude && $scope.location.longitude){
                sortByNear();
            }
            // Else we order by something else
            else{
                $scope.query.params.sort  = $scope.orderFilter.model;
                $scope.query.params.order = $scope.orderFilter.reverse ? 'asc' : 'dsc';
                $scope.query.updateQueryParams();
                $scope.query.refresh();
            }
        }
    };

    // scoped functions
    $scope.create = create;           // function()
    $scope.clearFilter = clearFilter; // function()
    $scope.sortByNear = sortByNear;   // function()

    $scope.jobStepTpl = jobStepTpl;

    // Main Query
    $scope.query = HttpQuery({
        url: '/api/v1/search',
        urlParams: ['near[]','sort', 'order', 'parentType', 'parentId'],
        params: {
            type       : 'job',
            size       : 20,
            key        : 'name',
            select     : ['name','organisation','location.name','pay','jobType','level', 'stub', 'organisations'],
            criteria   : {},
        },
    });

    if(Authentication.currentUser.isLoggedIn()){
        $scope.suggestedJobs = true;
        $scope.query.params.skills = Authentication.currentUser._id;
    }

    if($scope.location && $scope.location.latitude && $scope.location.longitude){
        $scope.orderFilter.model   = 'location[0].name';
        $scope.orderFilter.reverse = false;
        sortByNear();
    }
    else if(Authentication.currentUser.isLoggedIn()){
        $scope.orderFilter.model   = 'rating';
        $scope.orderFilter.reverse = false;
        $scope.query.params.sort   = 'rating';
        $scope.query.params.order  = 'dsc';
        $scope.query.more();
    }
    else{
        $scope.query.params.sort = 'organisations[0].name';
        $scope.query.params.order = 'asc';
        $scope.query.more();
    }

    // Filters
    $scope.searchFilter = {
        model: '',
        onChange: function(){
            $scope.query.params.criteria.organisationName = $scope.searchFilter.model ? '/'+$scope.searchFilter.model+'/i' : '';
            $scope.query.refresh();
        }
    }
    $scope.fieldFilter = {
        current: $stateParams.parentId || '',
        options: fields,
        change: function(input){
            $scope.query.params.parentType = 'field';
            $scope.query.params.parentId   = input;
            $scope.query.updateQueryParams();
            $scope.query.refresh();
        }
    };

    //////////////////////////////////////////////

    function create(event){
        JobModalService.createJob(event);
    }
    function sortByNear(){
        delete $scope.query.params.sort;
        delete $scope.query.params.order;
        $scope.query.params['near[]'] = [$scope.location.longitude, $scope.location.latitude];
        $scope.query.updateQueryParams();
        $scope.query.refresh();
    }

    function clearFilter() {
        $scope.searchFilter.model    = '';
        $scope.query.params.criteria = {};
        $scope.query.refresh();
    }


});
