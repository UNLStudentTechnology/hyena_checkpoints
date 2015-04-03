"use strict";angular.module("hyenaCheckpointsApp",["ngAnimate","ngCookies","ngResource","ngSanitize","ngTouch","ui.router","angularMoment","hyenaAngular","ngTagsInput","ngStorage","ngCsv"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){a.state("unl-layout",{templateUrl:"views/layouts/unl-layout.html",data:{requireAuth:!0}}).state("unl-layout-kiosk",{templateUrl:"views/layouts/unl-layout-kiosk.html",data:{requireAuth:!1}}).state("unl-layout.checkpoints",{url:"/:groupId",templateUrl:"views/main.html",controller:"MainCtrl"}).state("unl-layout.checkpoint_new",{url:"/:groupId/checkpoint/new",templateUrl:"views/new.html",controller:"NewCtrl"}).state("unl-layout.checkpoint_settings",{url:"/:groupId/checkpoint/:checkpointId/settings",templateUrl:"views/settings.html",controller:"SettingsCtrl"}).state("unl-layout.checkpoint_view",{url:"/:groupId/checkpoint/:checkpointId",templateUrl:"views/checkpoint.html",controller:"CheckpointCtrl"}).state("unl-layout-kiosk.checkpoint_kiosk",{url:"/:groupId/checkpoint/:checkpointId/kiosk",templateUrl:"views/checkpoint_kiosk.html",controller:"CheckpointCtrl"}),b.otherwise("/"),c.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://amber-heat-9947.firebaseio.com/").constant("APIKEY","MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("PLATFORM_ROOT","http://st-studio.unl.edu/hyena_platform/public/").constant("AUTH_SCOPE","groups"),angular.module("hyenaCheckpointsApp").controller("MainCtrl",["$rootScope","$scope","$stateParams","CheckpointService","FirebaseGroupService","Notification",function(a,b,c,d,e){var f=c.groupId;b.groupId=a.currentGroupId=f,angular.isDefined(f)&&""!==f&&e.existsOrAdd(f),""!==f&&(b.checkpoints=d.groupCheckpoints(f,10).$asArray())}]),angular.module("hyenaCheckpointsApp").controller("CheckpointCtrl",["$scope","$rootScope","$stateParams","UserService","GroupService","CheckpointService","Notification",function(a,b,c,d,e,f,g){function h(b){f.check(j,b).then(function(a){a?g.show("Sorry! You are already checked in.","error"):f.checkIn(j,b).then(function(){g.show("Thanks! You have been checked in!","success")},function(){g.show("Sorry! There was an error checking you in.","error")})},function(a){console.log("Check() Error",a),g.show("Sorry! There was an error checking you in.","error")}),a.doingCheckin=!1,a.checkinNcard="",a.checkinForm.$setPristine()}a.doingCheckin=!1,a.sortField="created_at",a.sortDirection=!0;var i=c.groupId;a.groupId=b.currentGroupId=i;var j=a.checkpointId=c.checkpointId,k=f.get(j).$asObject();k.$bindTo(a,"checkpoint"),a.checkins=f.checkins(j).$asArray(),a.csvHeaders=["Check In Time","First Name","Last Name","Blackboard Username","Year","Major","College"],a.toggleSort=function(){a.sortDirection=!a.sortDirection},a.checkInUser=function(){a.doingCheckin=!0,d.validate(a.checkinNcard).then(function(b){var c=b.data.users_validated[0];e.hasUser(i,c).then(function(){h(c)},function(){if(1!=a.checkpoint.non_members)a.checkinNcard="",a.checkinForm.$setPristine(),a.doingCheckin=!1,g.show("Sorry! You are not a member of this group.","error");else if(h(c),angular.isDefined(a.checkpoint.add_to_group)&&1==a.checkpoint.add_to_group){var b=e.usersAdd(i,{users:[c]});b.then(function(){console.log("User added to group.")})}})},function(b){a.checkinNcard="",a.checkinForm.$setPristine(),a.doingCheckin=!1,console.log(b),g.show(b.data.message,"error")})},a.getExportArray=function(){return f.exportCheckins(a.checkins)}}]),angular.module("hyenaCheckpointsApp").controller("SettingsCtrl",["$scope","$rootScope","$stateParams","CheckpointService","Notification",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f;var g=a.checkpointId=c.checkpointId,h=d.get(g).$asObject();h.$bindTo(a,"checkpoint"),a.showRemoveModal=function(){e.showModal("Remove Checkpoint","#modal-checkpoint-remove")},a.removeCheckpoint=function(){d.remove(g).then(function(){e.hideModal(),e.show("Your checkpoint has been removed successfully!","success"),a.go("/"+f,"animate-slide-left")},function(a){e.hideModal(),console.log("Remove checkpoint error:",a),e.show(a.message,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("NewCtrl",["$scope","$rootScope","$stateParams","Notification","CheckpointService",function(a,b,c,d,e){var f=c.groupId;a.groupId=b.currentGroupId=f,a.checkpoint={created_at:moment().format(),group_id:parseInt(f),non_members:1,add_to_group:0},a.createCheckpoint=function(){e.add(a.checkpoint,f).then(function(b){console.log(b);var c=b.key();a.go("/"+f+"/checkpoint/"+c),d.show("Your checkpoint has been created successfully!","success")},function(a){console.log("Create Checkpoint Error",a),d.show("There was an error creating your checkpoint.","error")})}}]),angular.module("hyenaCheckpointsApp").service("CheckpointService",["$firebase","$q","AppFirebase",function(a,b,c){var d=c.getRef(),e={get:function(b){return b=b.trim(),a(d.child("/checkpoints/"+b))},groupCheckpoints:function(b,c){c=c||20,b=parseInt(b);var e=d.child("checkpoints").orderByChild("group_id").equalTo(b).limitToFirst(c);return a(e)},add:function(b,c){return a(d.child("checkpoints")).$push(b).then(function(b){return a(d.child("/groups/"+c+"/checkpoints")).$set(b.key(),!0),b})},remove:function(b){return b=b.trim(),a(d.child("/checkpoints/"+b)).$remove()},checkIn:function(b,c){var e={created_at:moment().format(),checkpoint_id:b,user:c};return a(d.child("/checkins")).$push(e)},checkins:function(b){return a(d.child("/checkins").orderByChild("checkpoint_id").equalTo(b))},check:function(c,e){var f=b.defer(),g=a(d.child("/checkins").orderByChild("checkpoint_id").equalTo(c)).$asArray();return g.$loaded().then(function(a){for(var b=0;b<a.length;b++)a[b].user===e&&f.resolve(!0);f.resolve(!1)},function(a){console.error("CheckpointService.check()",a),f.reject("Error getting checkins.")}),f.promise},exportCheckins:function(a){var b=angular.copy(a);console.log(b);for(var c=0;c<b.length;c++)delete b[c].$id,delete b[c].$priority,delete b[c].checkpoint_id,b[c].first_name=b[c].user.first_name,b[c].last_name=b[c].user.last_name,b[c].uni_auth=b[c].user.uni_auth,b[c].uni_year=b[c].user.uni_year,b[c].uni_major=b[c].user.uni_major,b[c].uni_college=b[c].user.uni_college,delete b[c].user;return b}};return e}]);