"use strict";angular.module("hyenaCheckpointsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","angularMoment"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/:groupId",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/login",{controller:"LoginCtrl"}).when("/:groupId/checkpoint/:checkpointId",{templateUrl:"views/checkpoint.html",controller:"CheckpointCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://amber-heat-9947.firebaseio.com/").constant("APIKEY","MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("angularMomentConfig",{}).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"admin",editor:"editor",guest:"guest"}),angular.module("hyenaCheckpointsApp").controller("DashboardCtrl",["$rootScope","$scope","$routeParams","CheckpointService","GroupService","Notification",function(a,b,c,d,e,f){var g=c.groupId;if(b.groupId=g,g&&!e.exists(g)){var h=e.get(g);h.then(function(a){var b={title:a.data.title,description:a.data.description};e.add(b)})}b.checkpoints=null,b.checkpoints=d.sync(g,10),b.addCheckpoint=function(){var a={title:b.checkpointTitle,created_at:moment().format()},c=d.add(b.groupId,a);c.then(function(){b.checkpointTitle="",f.show("Your checkpoint has been added successfully!","success")},function(a){console.log("Add checkpoint error:",a),f.show(a.message,"error")})},b.removeCheckpoint=function(a){var c=d.remove(b.groupId,a);c.then(function(){console.log("success"),f.show("Your checkpoint has been removed successfully!","success")},function(a){console.log("Remove checkpoint error:",a),f.show(a.message,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("CheckpointCtrl",["$scope","$http","$routeParams","CheckpointService","UserService","Notification","APIPATH",function(a,b,c,d,e,f){var g=c.checkpointId;a.checkpoint=null;var h=c.groupId;a.group=h;var i=d.get(h,g);i.$bindTo(a,"checkpoint"),a.checkinUser=function(){console.log("Checking in ID...",a.checkinNcard);var b=e.validate(a.checkinNcard);b.then(function(b){var c=b.data.users_validated[0],e={user:c,created_at:moment().format()},g=d.checkin(a.group,a.checkpoint.$id,e);g.then(function(){a.checkinNcard="",f.show("Thanks! You have been checked in!","success")},function(a){console.log("Checkin error",a),f.show(a.data,"error")})},function(a){console.log(a),f.show(a.data,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("LoginCtrl",["$scope","$rootScope","AUTH_EVENTS","AuthService",function(){console.log("LoginCtrl")}]),angular.module("hyenaCheckpointsApp").controller("ApplicationCtrl",["$rootScope","$scope","$location","$window","$routeParams","AuthService","UserService","Session","AUTH_EVENTS","USER_ROLES",function(a,b,c,d,e,f,g,h,i,j){b.currentUser=null,b.userRoles=j,b.isAuthorized=f.isAuthorized;if("undefined"!=typeof c.search().user){var k=c.search().user;c.url(c.path()),f.manualLogin(k).then(function(a){b.currentUser=a.data},function(a){console.log("Login Error",a)})}else f.check()?f.user().then(function(a){b.currentUser=a.data}):f.login();a.$on(i.notAuthenticated,function(){f.expire(),b.currentUser=null,f.login()}),b.setCurrentUser=function(a){b.currentUser=a},b.logoutCurrentUser=function(){f.logout()&&(b.currentUser=null,f.login())},b.toggleMainDrawer=function(){document.querySelector("unl-layout").toggleDrawer()},b.closeMainDrawer=function(){document.querySelector("unl-layout").closeDrawer()}}]),angular.module("hyenaCheckpointsApp").service("CheckpointService",["FBURL","$firebase",function(a,b){var c=new Firebase(a),d={groupFirebaseRef:function(a){return c.child("groups/"+a+"/checkpoints")},get:function(a,c){return b(d.groupFirebaseRef(a).child(c)).$asObject()},sync:function(a,c){return b(d.groupFirebaseRef(a).limit(c)).$asArray()},add:function(a,c){return b(d.groupFirebaseRef(a)).$push(c)},remove:function(a,c){return b(d.groupFirebaseRef(a)).$remove(c)},checkin:function(a,c,e){return b(d.groupFirebaseRef(a).child(c+"/checkins")).$push(e)}};return d}]),angular.module("hyenaCheckpointsApp").service("UserService",["APIPATH","APIKEY","$http",function(a,b,c){return{get:function(d,e){return"undefined"==typeof e&&(e=""),c.get(a+"users/"+d+"?with="+e+"&api_key="+b)},validate:function(d){return c.post(a+"users/validate?api_key="+b,{ids:[d]})}}}]),angular.module("hyenaCheckpointsApp").service("Session",function(){return{has:function(a){return!!sessionStorage.getItem(a)},get:function(a){return sessionStorage.getItem(a)},set:function(a,b){return sessionStorage.setItem(a,b)},unset:function(a){return sessionStorage.removeItem(a)},createAuthSession:function(a){return sessionStorage.setItem("auth",!0),sessionStorage.setItem("authUser",a),!0},destroyAuthSession:function(){sessionStorage.removeItem("auth"),sessionStorage.removeItem("authUser")}}}),angular.module("hyenaCheckpointsApp").service("AuthService",["$http","Session","UserService","APIKEY","APIPATH",function(a,b,c,d,e){var f={login:function(){b.set("currentRoute",window.location.href),window.location.replace(e+"users/login?api_key="+d+"&callback="+window.location.href)},manualLogin:function(a){var d=c.get(a,"groups");return d.then(function(){return b.createAuthSession(a)?f.user():!1})},logout:function(){return a.get(e+"users/logout?api_key="+d).then(function(a){console.log("Logout Response",a),f.expire()})},user:function(){var a=f.userId();return c.get(a,"groups")},userId:function(){return b.has("auth")?b.get("authUser"):!1},check:function(){return b.has("auth")},expire:function(){return!!b.destroyAuthSession()},isAuthorized:function(a){return angular.isArray(a)||(a=[a]),f.check()&&-1!==a.indexOf(b.userRole)}};return f}]),angular.module("hyenaCheckpointsApp").factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]),angular.module("hyenaCheckpointsApp").service("Notification",function(){var a={show:function(a,b){var c=document.querySelector("unl-toast");c.setAttribute("text",a),c.setAttribute("type",b),c.show()}};return a}),angular.module("hyenaCheckpointsApp").filter("user",["UserService",function(a){return function(b){var c=a.get(b);return c.then(function(){return"yes"})}}]),angular.module("hyenaCheckpointsApp").filter("toArray",function(){return function(a){return a instanceof Object?Object.keys(a).map(function(b){return Object.defineProperty(a[b],"$key",{enumerable:!1,value:b})}):a}}),angular.module("hyenaCheckpointsApp").service("GroupService",["APIPATH","APIKEY","$http","FBURL","$firebase",function(a,b,c,d,e){var f=new Firebase(d).child("groups");return{get:function(d,e){return"undefined"==typeof e&&(e=""),c.get(a+"groups/"+d+"?with="+e+"&api_key="+b)},exists:function(a){return!!e(f.child(a)).$asObject()},add:function(a){return e(f).$push(a)}}}]);