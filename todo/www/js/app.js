angular.module('todo', ['ionic'])
    /**
     * The Projects factory handles saving and loading projects
     * from local storage, and also lets us save and load the
     * last active project index.
     */
    .factory('Projects', function() {
        return {
            all: function() {
                var projectString = window.localStorage['projects'];
                if (projectString) {
                    return angular.fromJson(projectString);
                }
                return [];
            },
            save: function(projects) {
                window.localStorage['projects'] = angular.toJson(projects);
            },
            newProject: function(projectTitle) {
                // Add a new project
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            getLastActiveIndex: function() {
                return parseInt(window.localStorage['lastActiveProject']) || 0;
            },
            setLastActiveIndex: function(index) {
                window.localStorage['lastActiveProject'] = index;
            }
        }
    })

.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {

  // Load or initialize projects
  $scope.projects = Projects.all();

  // Grab the last active, or the first project
  $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

  $scope.newProject = function() {
    $scope.projectModal.show();
  };

  $scope.createProject = function(project) {
    var newProject = Projects.newProject(project.title);
    $scope.projects.push(newProject);
    Projects.save($scope.projects);
    $scope.selectProject(newProject, $scope.projects.length-1);
    $scope.projectModal.hide();
    project.title = "";
  };

  $scope.closeNewProject = function() {
    $scope.projectModal.hide();
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };

  // Create our task modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  // Create our project modal
  $ionicModal.fromTemplateUrl('new-project.html', function(modal) {
    $scope.projectModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeProject || !task) {
      return;
    }
    $scope.activeProject.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the projects
    Projects.save($scope.projects);

    task.title = "";
  };

  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

});
