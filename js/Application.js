/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    class TodoItem {
        constructor(title, completed) {
            this.title = title;
            this.completed = completed;
        }
    }
    todos.TodoItem = TodoItem;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true.
     */
    function todoFocus($timeout) {
        return {
            link: ($scope, element, attributes) => {
                $scope.$watch(attributes.todoFocus, newval => {
                    if (newval) {
                        $timeout(() => element[0].focus(), 0, false);
                    }
                });
            }
        };
    }
    todos.todoFocus = todoFocus;
    todoFocus.$inject = ['$timeout'];
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * Directive that executes an expression when the element it is applied to loses focus.
     */
    function todoBlur() {
        return {
            link: ($scope, element, attributes) => {
                element.bind('blur', () => { $scope.$apply(attributes.todoBlur); });
                $scope.$on('$destroy', () => { element.unbind('blur'); });
            }
        };
    }
    todos.todoBlur = todoBlur;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    const ESCAPE_KEY = 27;
    /**
     * Directive that cancels editing a todo if the user presses the Esc key.
     */
    function todoEscape() {
        return {
            link: ($scope, element, attributes) => {
                element.bind('keydown', (event) => {
                    if (event.keyCode === ESCAPE_KEY) {
                        $scope.$apply(attributes.todoEscape);
                    }
                });
                $scope.$on('$destroy', () => { element.unbind('keydown'); });
            }
        };
    }
    todos.todoEscape = todoEscape;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos_1) {
    'use strict';
    /**
     * Services that persists and retrieves TODOs from localStorage.
     */
    class TodoStorage {
        constructor() {
            this.STORAGE_ID = 'todos-angularjs-typescript';
        }
        get() {
            return JSON.parse(localStorage.getItem(this.STORAGE_ID) || '[]');
        }
        put(todos) {
            localStorage.setItem(this.STORAGE_ID, JSON.stringify(todos));
        }
    }
    todos_1.TodoStorage = TodoStorage;
})(todos || (todos = {}));
/// <reference path='../_all.ts' />
var todos;
(function (todos) {
    'use strict';
    /**
     * The main controller for the app. The controller:
     * - retrieves and persists the model via the todoStorage service
     * - exposes the model to the template and provides event handlers
     */
    class TodoCtrl {
        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor($scope, $location, todoStorage, filterFilter) {
            this.$scope = $scope;
            this.$location = $location;
            this.todoStorage = todoStorage;
            this.filterFilter = filterFilter;
            this.todos = $scope.todos = todoStorage.get();
            $scope.newTodo = '';
            $scope.editedTodo = null;
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            // watching for events/changes in scope, which are caused by view/user input
            // if you subscribe to scope or event with lifetime longer than this controller, make sure you unsubscribe.
            $scope.$watch('todos', () => this.onTodos(), true);
            $scope.$watch('location.path()', path => this.onPath(path));
            if ($location.path() === '')
                $location.path('/');
            $scope.location = $location;
        }
        onPath(path) {
            this.$scope.statusFilter = (path === '/active') ?
                { completed: false } : (path === '/completed') ?
                { completed: true } : {};
        }
        onTodos() {
            this.$scope.remainingCount = this.filterFilter(this.todos, { completed: false }).length;
            this.$scope.doneCount = this.todos.length - this.$scope.remainingCount;
            this.$scope.allChecked = !this.$scope.remainingCount;
            this.todoStorage.put(this.todos);
        }
        addTodo() {
            var newTodo = this.$scope.newTodo.trim();
            if (!newTodo.length) {
                return;
            }
            this.insertTodo(newTodo);
            this.$scope.newTodo = '';
        }
        editTodo(todoItem) {
            this.$scope.editedTodo = todoItem;
            // Clone the original todo in case editing is cancelled.
            this.$scope.originalTodo = angular.extend({}, todoItem);
        }
        revertEdits(todoItem) {
            this.todos[this.todos.indexOf(todoItem)] = this.$scope.originalTodo;
            this.$scope.reverted = true;
        }
        doneEditing(todoItem) {
            this.$scope.editedTodo = null;
            this.$scope.originalTodo = null;
            if (this.$scope.reverted) {
                // Todo edits were reverted, don't save.
                this.$scope.reverted = null;
                return;
            }
            todoItem.title = todoItem.title.trim();
            if (!todoItem.title) {
                this.removeTodo(todoItem);
            }
        }
        insertTodo(newTodo) {
            this.todos.unshift(new todos.TodoItem(newTodo, false));
        }
        removeTodo(todoItem) {
            this.todos.splice(this.todos.indexOf(todoItem), 1);
        }
        markAll(completed) {
            this.todos.forEach(todoItem => { todoItem.completed = completed; });
        }
        clearDoneTodos() {
            this.$scope.todos = this.todos = this.todos.filter(todoItem => !todoItem.completed);
        }
    }
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    TodoCtrl.$inject = [
        '$scope',
        '$location',
        'todoStorage',
        'filterFilter'
    ];
    todos.TodoCtrl = TodoCtrl;
})(todos || (todos = {}));
/// <reference path='_all.ts' />
/**
 * The main TodoMVC app module.
 *
 * @type {angular.Module}
 */
var todos;
(function (todos) {
    'use strict';
    var todomvc = angular.module('todomvc', [])
        .controller('todoCtrl', todos.TodoCtrl)
        .directive('todoBlur', todos.todoBlur)
        .directive('todoFocus', todos.todoFocus)
        .directive('todoEscape', todos.todoEscape)
        .service('todoStorage', todos.TodoStorage);
})(todos || (todos = {}));
/// <reference path='libs/jquery/jquery.d.ts' />
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path='models/TodoItem.ts' />
/// <reference path='interfaces/ITodoScope.ts' />
/// <reference path='interfaces/ITodoStorage.ts' />
/// <reference path='directives/TodoFocus.ts' />
/// <reference path='directives/TodoBlur.ts' />
/// <reference path='directives/TodoEscape.ts' />
/// <reference path='services/TodoStorage.ts' />
/// <reference path='controllers/TodoCtrl.ts' />
/// <reference path='Application.ts' />

//# sourceMappingURL=Application.js.map
