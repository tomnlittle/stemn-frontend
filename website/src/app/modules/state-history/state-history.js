angular.module('modules.state-history', [
]);
angular.module('modules.state-history').

run(function ($rootScope, StateHistoryService) {
    $rootScope.$on('$stateChangeSuccess', StateHistoryService.processStateChange);
}).

service('StateHistoryService', function () {
    /******************************************************
    This service produces the stateHistory Array
    stateHistory = [{
        name   : 'state name',
        params : {state params},
    },{
        name   : 'state name',
        params : {state params},
    },{
        name   : 'state name',
        params : {state params},
    }]
    ******************************************************/
    var service = this;
    this.stateHistory       = [];
    this.processStateChange = processStateChange;

    //////////////////////////////////////

    function processStateChange(event, toState) {
        service.stateHistory.push({
            name   : toState.name,
            params : toState.params
        })
    }
});