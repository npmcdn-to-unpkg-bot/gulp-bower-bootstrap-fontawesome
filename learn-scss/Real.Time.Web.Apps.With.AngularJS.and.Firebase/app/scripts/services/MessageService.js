(function() {
  'use strict';

  angular
    .module('firebaseApp')
    .service('MessageService', MessageService);

  MessageService.$inject = ['$http','FBURL','$q', '$firebaseObject'];

  function MessageService($http,FBURL,$q, $firebaseObject){

    /*jshint validthis: true */
    var svc = this;

    var messagesRef = new Firebase(FBURL).child('messages');
    var fireMessage = $firebaseObject(messagesRef);

    var childAdded = function(limitNum,cb){
      messagesRef.startAt().limit(limitNum).on('child_added', function(snapshot){
        var val = snapshot.val();
        cb.call(this, {
          user: val.user,
          text: val.text,
          name: snapshot.name()
        });
      });
    };

    var addMessage = function(message){
      return fireMessage.$add(message);
    };

    var turnMessageOff = function(){
      messagesRef.off();
    };


    var pageNext = function(name, numberOfItems){
      var deferred = $q.defer();
      var messages = [];

      messagesRef.startAt(null, name).limit(numberOfItems).once('value', function(snapshot){
        snapshot.forEach(function(snapItem){
          var itemVal = snapItem.val();
          itemVal.name = snapItem.name();
          messages.push(itemVal);
        });
        deferred.resolve(messages);
      });
      return deferred.promise;
    };

    var pageBack = function(name, numberOfItems){
      var deferred = $q.defer();
      var messages = [];

      messagesRef.endAt(null, name).limit(numberOfItems).once('value', function(snapshot){
        snapshot.forEach(function(snapItem){
          var itemVal = snapItem.val();
          itemVal.name = snapItem.name();
          messages.push(itemVal);
        });
        deferred.resolve(messages);
      });
      return deferred.promise;
    };

    return {
      childAdded: childAdded,
      add: addMessage,
      off: turnMessageOff,
      pageNext: pageNext,
      pageBack: pageBack
    };
  }

})();
