"use strict";angular.module("hyenaCheckpointsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","angularMoment"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/:groupId",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/login",{controller:"LoginCtrl"}).when("/:groupId/checkpoint/:checkpointId",{templateUrl:"views/checkpoint.html",controller:"CheckpointCtrl"}).when("/:groupId/checkpoint/:checkpointId/settings",{templateUrl:"views/checkpoint_settings.html",controller:"CheckpointSettingsCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://amber-heat-9947.firebaseio.com/").constant("APIKEY","MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("angularMomentConfig",{}).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"admin",editor:"editor",guest:"guest"}),angular.module("hyenaCheckpointsApp").controller("DashboardCtrl",["$rootScope","$scope","$routeParams","CheckpointService","GroupService","Notification",function(a,b,c,d,e,f){var g=c.groupId;b.groupId=g,angular.isDefined(g)&&e.existsOrAdd(g),b.checkpoints=null,b.checkpoints=d.sync(g,10),b.addCheckpoint=function(){var a={title:b.checkpointTitle,created_at:moment().format()},c=d.add(b.groupId,a);c.then(function(){b.checkpointTitle="",f.show("Your checkpoint has been added successfully!","success")},function(a){console.log("Add checkpoint error:",a),f.show(a.message,"error")})},b.removeCheckpoint=function(a){var c=d.remove(b.groupId,a);c.then(function(){console.log("success"),f.show("Your checkpoint has been removed successfully!","success")},function(a){console.log("Remove checkpoint error:",a),f.show(a.message,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("CheckpointCtrl",["$scope","$http","$routeParams","CheckpointService","UserService","GroupService","Notification","APIPATH",function(a,b,c,d,e,f,g){function h(b){var c={user:b,created_at:moment().format()},e=d.checkin(a.group,a.checkpoint.$id,c);e.then(function(){a.checkinNcard="",g.show("Thanks! You have been checked in!","success")},function(a){console.log("Checkin error",a),g.show(a.data,"error")})}var i=c.checkpointId;a.checkpoint=null;var j=c.groupId;a.group=j;var k=d.get(j,i);a.checkpoint=k,k.$watch(function(){a.checkpoint.checkins=e.getUserRelations(a.checkpoint.checkins)}),a.checkinUser=function(){console.log("Checking in ID...",a.checkinNcard);var b=e.validate(a.checkinNcard);b.then(function(b){var c=b.data.users_validated[0],d=f.hasUser(a.group,c);d.then(function(){h(c)},function(){if(a.checkpoint.non_members){h(c);var b=f.addUser(a.group,c);b.then(function(){console.log("User added to group.")})}else a.checkinNcard="",g.show("Sorry! You are not a member of this group.","error")})},function(a){console.log(a),g.show(a.data,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("LoginCtrl",["$scope","$rootScope","AUTH_EVENTS","AuthService",function(){console.log("LoginCtrl")}]),angular.module("hyenaCheckpointsApp").controller("ApplicationCtrl",["$rootScope","$scope","$location","$window","$routeParams","AuthService","UserService","Session","AUTH_EVENTS","USER_ROLES",function(a,b,c,d,e,f,g,h,i,j){b.currentUser=null,b.userRoles=j,b.isAuthorized=f.isAuthorized;if("undefined"!=typeof c.search().user){var k=c.search().user;c.url(c.path()),f.manualLogin(k).then(function(a){b.currentUser=a.data},function(a){console.log("Login Error",a)})}else f.check()?f.user().then(function(a){b.currentUser=a.data}):f.login();a.$on(i.notAuthenticated,function(){f.expire(),b.currentUser=null,f.login()}),b.setCurrentUser=function(a){b.currentUser=a},b.logoutCurrentUser=function(){f.logout()&&(b.currentUser=null,f.login())},b.toggleMainDrawer=function(){document.querySelector("unl-layout").toggleDrawer()},b.closeMainDrawer=function(){document.querySelector("unl-layout").closeDrawer()}}]),angular.module("hyenaCheckpointsApp").service("CheckpointService",["FBURL","$firebase",function(a,b){var c=new Firebase(a),d={groupFirebaseRef:function(a){return c.child("groups/"+a+"/checkpoints")},get:function(a,c){return b(d.groupFirebaseRef(a).child(c)).$asObject()},sync:function(a,c){return b(d.groupFirebaseRef(a).limit(c)).$asArray()},add:function(a,c){return b(d.groupFirebaseRef(a)).$push(c)},update:function(a,c,e){return b(d.groupFirebaseRef(a).child(c)).$update(e)},remove:function(a,c){return b(d.groupFirebaseRef(a)).$remove(c)},checkin:function(a,c,e){return b(d.groupFirebaseRef(a).child(c+"/checkins")).$push(e)}};return d}]),angular.module("hyenaCheckpointsApp").service("UserService",["APIPATH","APIKEY","$http","toArrayFilter",function(a,b,c,d){return{get:function(d,e){return angular.isUndefined(e)&&(e=""),c.get(a+"users/"+d+"?with="+e+"&api_key="+b)},validate:function(d){return c.post(a+"users/validate?api_key="+b,{ids:[d]})},getUserRelations:function(e,f){if(angular.isUndefined(e))return!1;angular.isUndefined(f)&&(f="user"),e=d(e);for(var g=[],h="",i=0;i<e.length;i++)g.push(e[i][f]),h+=e[i][f]+",";h=h.substring(0,h.length-1);var j=c.get(a+"users?ids="+h+"&api_key="+b);return j.then(function(a){for(var b=0;b<a.data.length;b++)e[b][f]=a.data[b]}),e}}}]),angular.module("hyenaCheckpointsApp").service("Session",function(){return{has:function(a){return!!sessionStorage.getItem(a)},get:function(a){return sessionStorage.getItem(a)},set:function(a,b){return sessionStorage.setItem(a,b)},unset:function(a){return sessionStorage.removeItem(a)},createAuthSession:function(a){return sessionStorage.setItem("auth",!0),sessionStorage.setItem("authUser",a),!0},destroyAuthSession:function(){sessionStorage.removeItem("auth"),sessionStorage.removeItem("authUser")}}}),angular.module("hyenaCheckpointsApp").service("AuthService",["$http","Session","UserService","APIKEY","APIPATH",function(a,b,c,d,e){var f={login:function(){b.set("currentRoute",window.location.href),window.location.replace(e+"users/login?api_key="+d+"&callback="+window.location.href)},manualLogin:function(a){var d=c.get(a,"groups");return d.then(function(){return b.createAuthSession(a)?f.user():!1})},logout:function(){return a.get(e+"users/logout?api_key="+d).then(function(a){console.log("Logout Response",a),f.expire()})},user:function(){var a=f.userId();return c.get(a,"groups")},userId:function(){return b.has("auth")?b.get("authUser"):!1},check:function(){return b.has("auth")},expire:function(){return!!b.destroyAuthSession()},isAuthorized:function(a){return angular.isArray(a)||(a=[a]),f.check()&&-1!==a.indexOf(b.userRole)}};return f}]),angular.module("hyenaCheckpointsApp").factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]),angular.module("hyenaCheckpointsApp").service("Notification",function(){var a={show:function(a,b){var c=document.querySelector("unl-toast");c.setAttribute("text",a),c.setAttribute("type",b),c.show()}};return a}),angular.module("hyenaCheckpointsApp").filter("user",["UserService",function(a){return function(b){var c=a.get(b);return c.then(function(){return"yes"})}}]),angular.module("hyenaCheckpointsApp").filter("toArray",function(){return function(a){return a instanceof Object?Object.keys(a).map(function(b){return Object.defineProperty(a[b],"$key",{enumerable:!1,value:b})}):a}}),angular.module("hyenaCheckpointsApp").service("GroupService",["APIPATH","APIKEY","$http","FBURL","$firebase",function(a,b,c,d,e){var f=new Firebase(d).child("groups"),g={get:function(d,e){return angular.isUndefined(e)&&(e=""),c.get(a+"groups/"+d+"?with="+e+"&api_key="+b)},exists:function(a){var b=e(f.child(a)).$asObject();return b.$loaded(function(){return null!==b.$value})},add:function(a,b){return e(f).$set(b,a)},addUser:function(d,e){return c.post(a+"groups/"+d+"/users?api_key="+b,{users:[e]})},hasUser:function(d,e){return c.get(a+"groups/"+d+"/users/"+e+"?api_key="+b)},existsOrAdd:function(a){var b=g.exists(a);b.then(function(b){if(!b){var c=g.get(a);c.then(function(b){var c={title:b.data.title,description:b.data.description};g.add(c,a).then(function(a){console.log("Group added to Firebase",a)})})}})}};return g}]),angular.module("hyenaCheckpointsApp").controller("CheckpointSettingsCtrl",["$scope","$routeParams","CheckpointService","Notification",function(a,b,c,d){var e=b.checkpointId;a.checkpoint=null;var f=b.groupId;a.group=f;var g=c.get(f,e);g.$bindTo(a,"checkpoint"),g.$watch(function(){a.checkpointTitle=g.title,a.nonMembers=g.non_members});var h=document.getElementById("non-members-checkbox");h.addEventListener("change",function(){angular.isDefined(a.nonMembers)&&(a.nonMembers=!a.nonMembers,a.updateSettings())}),a.updateSettings=function(){if(angular.isUndefined(a.checkpointTitle))return!1;var b={title:a.checkpointTitle,non_members:a.nonMembers};c.update(f,e,b).then(function(){},function(a){console.log("Checkpoint update error",a),d.show(a.data,"error")})}}]);