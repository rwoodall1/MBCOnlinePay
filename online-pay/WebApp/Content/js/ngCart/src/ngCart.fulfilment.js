
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function($injector){

        this._obj = {
            service : undefined,
            settings : undefined
        };

        this.setService = function(service){
            this._obj.service = service;
        };

        this.setSettings = function(settings){
            this._obj.settings = settings;
        };

        this.checkout = function(){
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
              return provider.checkout(this._obj.settings);

        }

    }])


.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart){
    this.checkout = function(){

        var deferred = $q.defer();

        $log.info(ngCart.toObject());
        deferred.resolve({
            cart:ngCart.toObject()
        });

        return deferred.promise;
    }
 }])

.service('ngCart.fulfilment.http', ['$q','$http', 'ngCart', function($q, $http, ngCart){
    this.checkout = function (settings) {
        console.log(ngCart.toObject())
        return  $http.post(settings.url, ngCart.toObject());
    }
 }])


.service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function($http, ngCart){


}]);
