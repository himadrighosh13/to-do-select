
var app = angular.module("myMpp", ["ngRoute"]);

app.constant("APP_CONFIG", {
  'APP_ID': 'to-do-select',
  'DEFAULT_ROOMS': [
    { id: "1484305241567", n: "Getting Started" }
  ],
  'DEFAULT_TODOS': [
    { rId: "1484305241567", n: "Do Select One", c: false },
    { rId: "1484305241567", n: "Do Select Two", c: true },
    { rId: "1484305241567", n: "Do Select Three", c: true }
  ]
});

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/rooms.html',
      controller: 'roomsController'
    })
    .when('/room/:id', {
      templateUrl: 'pages/todo.html',
      controller: 'todosController'
    })
    .otherwise({
      template : "<h1>Page Not found.</h1>"
    });
});

app.service('DataService', ['APP_CONFIG', function(APP_CONFIG) {
  console.log("Running DataService...");
  var _self = this;
  this.data = JSON.parse(localStorage.getItem(APP_CONFIG.APP_ID));
  if(this.data === null) {
    // Set DataService with seeded data
    this.data = {
      rooms: APP_CONFIG.DEFAULT_ROOMS,
      todos: APP_CONFIG.DEFAULT_TODOS
    };
    // Set local storage with seeded data
    localStorage.setItem(APP_CONFIG.APP_ID, JSON.stringify(this.data));
  }

  this._setLocalStorage = function(data) {
    localStorage.setItem(APP_CONFIG.APP_ID, JSON.stringify(data));
  };

  this.insertRoom = function(room) {
    _self.data.rooms.unshift(room);
    _self._setLocalStorage(_self.data);
  };

  this.removeRoom = function(room) {
    _self.data.rooms.splice(_self.data.rooms.indexOf(room), 1);
    _self.data.todos = _self.data.todos.filter(function(item) { return item.rId !== room.id})
    _self._setLocalStorage(_self.data);
  };

  this.insertTodo = function(todo) {
    _self.data.todos.unshift(todo);
    _self._setLocalStorage(_self.data);
  };

  this.removeTodo = function(todo) {
    _self.data.todos.splice(_self.data.todos.indexOf(todo), 1);
    _self._setLocalStorage(_self.data);
  };

  this.saveData = function() {
    _self._setLocalStorage(_self.data);
  }

}]);

app.controller("todosController", ["$scope", "$routeParams", "$filter", "$location", 'DataService',
  function($scope, $routeParams, $filter, $location, DataService) {

    $scope.id = $routeParams.id || null;
    $scope.newTodo = '';
    var data = $scope.data = DataService.data;

    $scope.$watch('data', function() {
      $scope.roomName = $filter('filter')(data.rooms, {id: $scope.id})[0].n;
      $scope.todos = $filter('filter')(data.todos, {rId: $scope.id});
    }, true);

    $scope.addTodo = function() {
      if(!$scope.newTodo.trim()) {
        return;
      }

      var object = {
        id: new Date().getTime().toString(),
        rId: $scope.id,
        n: $scope.newTodo.trim(),
        c: false
      };

      DataService.insertTodo(object);
      $scope.newTodo = '';
    };

    $scope.removeTodo = function(todo) {
      DataService.removeTodo(todo);
    };

    $scope.toggleTodoAction = function(todo) {
      DataService.saveData();
    };

    $scope.getCompletePercentage = function() {
      var tCt = 0, cCt = 0;
      angular.forEach($scope.todos, function(item) { if(item.c) { cCt++; } tCt++; });
      return cCt / tCt * 100;
    };

    $scope.backToRooms = function() {
      $location.path('/');
    };
  }
]);

app.controller("roomsController", ["$scope", "$location", 'DataService',
  function($scope, $location, DataService) {

    $scope.newRoom = '';
    $scope.data = DataService.data;

    $scope.$watch('data', function() {
      $scope.rooms = $scope.data.rooms;
      $scope.todos = $scope.data.todos;
    });

    $scope.goToRoom = function(room) {
      $location.path('room/'+room.id);
    };

    $scope.addRoom = function() {
      if(!$scope.newRoom.trim()) {
        return;
      }
      var object = {
        id: new Date().getTime().toString(),
        n:  $scope.newRoom.trim()
      };

      DataService.insertRoom(object);
      $scope.newRoom = '';
    };

    $scope.removeRoom = function(room) {
      DataService.removeRoom(room);
    };

    $scope.getCompletedCount = function(roomId) {
      var completedTasks = $scope.todos.filter(function(item) { return item.rId === roomId && item.c });
      return completedTasks.length;
    };

    $scope.getTotalCount = function(roomId) {
      var tasks = $scope.todos.filter(function(item) { return item.rId === roomId });
      return tasks.length;
    };

    $scope.getCompletePercentage = function(roomId) {
      var tCt = 0, cCt = 0;
      angular.forEach($scope.todos, function(item) { if(item.rId === roomId) { if(item.c) { cCt++; } tCt++; } });
      return cCt / tCt * 100;
    };
}]);