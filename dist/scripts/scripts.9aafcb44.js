"use strict";angular.module("hyenaCheckpointsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","angularMoment"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/:groupId",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/login",{controller:"LoginCtrl"}).when("/:groupId/checkpoint/:checkpointId",{templateUrl:"views/checkpoint.html",controller:"CheckpointCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://amber-heat-9947.firebaseio.com/").constant("APIKEY","MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("angularMomentConfig",{}).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"admin",editor:"editor",guest:"guest"}),angular.module("hyenaCheckpointsApp").controller("DashboardCtrl",["$rootScope","$scope","$routeParams","CheckpointService",function(a,b,c,d){var e=c.groupId;b.group=e,b.checkpoints=null;var f=d.sync(e,10);f.$bindTo(b,"checkpoints"),b.addCheckpoint=function(){var a={title:b.checkpointTitle,group_id:b.group,created_at:moment().format()},c=d.add(b.group,a);c.then(function(){b.checkpointTitle=""})}}]),angular.module("hyenaCheckpointsApp").controller("CheckpointCtrl",["$scope","$http","$routeParams","CheckpointService","UserService","APIPATH",function(a,b,c,d,e){var f=c.checkpointId;a.checkpoint=null;var g=c.groupId;a.group=g,console.log("Group ID",g);var h=d.get(g,f);h.$bindTo(a,"checkpoint"),a.checkinUser=function(){console.log("Checkin...",a.checkinNcard);var b=e.validate(a.checkinNcard);b.then(function(b){var c=b.data[0],e={user:c,created_at:moment().format()},f=d.checkin(a.checkpoint,e);f.then(function(b){console.log("Checkin Response",b),a.checkinNcard=""},function(a){console.log("Checkin error",a)})},function(a){console.log(a)})}}]),angular.module("hyenaCheckpointsApp").controller("LoginCtrl",["$scope","$rootScope","AUTH_EVENTS","AuthService",function(){console.log("LoginCtrl")}]),angular.module("hyenaCheckpointsApp").controller("ApplicationCtrl",["$rootScope","$scope","$location","$window","AuthService","UserService","Session","AUTH_EVENTS","USER_ROLES",function(a,b,c,d,e,f,g,h,i){b.currentUser=null,b.userRoles=i,b.isAuthorized=e.isAuthorized;var j=null;"undefined"!=typeof c.search().user?(j=f.get(c.search().user,"groups"),j.then(function(a){b.currentUser=a.data,g.createAuthSession(a.data.uni_auth)})):e.check()?e.user().then(function(a){b.currentUser=a.data}):e.login(),a.$on(h.notAuthenticated,function(){e.expire(),b.currentUser=null,e.login()}),b.setCurrentUser=function(a){b.currentUser=a},b.logoutCurrentUser=function(){e.logout()&&(b.currentUser=null,e.login())},b.toggleMainDrawer=function(){document.querySelector("unl-layout").toggleDrawer()}}]),angular.module("hyenaCheckpointsApp").service("CheckpointService",["FBURL","$firebase",function(a,b){var c=new Firebase(a),d={groupFirebaseRef:function(a){return c.child("groups/"+a+"/checkpoints")},get:function(a,c){return b(d.groupFirebaseRef(a).child(c)).$asObject()},sync:function(a,c){return b(d.groupFirebaseRef(a).limit(c)).$asObject()},add:function(a,c){return b(d.groupFirebaseRef(a)).$push(c)},checkin:function(a,c){return b(d.groupFirebaseRef(a.group_id).child(a.$id+"/checkins")).$push(c)}};return d}]),angular.module("hyenaCheckpointsApp").service("UserService",["APIPATH","APIKEY","$http",function(a,b,c){return{get:function(d,e){return"undefined"==typeof e&&(e=""),c.get(a+"users/"+d+"?with="+e+"&api_key="+b)},validate:function(d){return c.post(a+"users/validate?api_key="+b,{ids:[d]})}}}]),angular.module("hyenaCheckpointsApp").service("Session",function(){return{has:function(a){return!!sessionStorage.getItem(a)},get:function(a){return sessionStorage.getItem(a)},set:function(a,b){return sessionStorage.setItem(a,b)},unset:function(a){return sessionStorage.removeItem(a)},createAuthSession:function(a){return sessionStorage.setItem("auth",!0),sessionStorage.setItem("authUser",a),!0},destroyAuthSession:function(){sessionStorage.removeItem("auth"),sessionStorage.removeItem("authUser")}}}),angular.module("hyenaCheckpointsApp").service("AuthService",["$http","Session","UserService","APIKEY","APIPATH",function(a,b,c,d,e){var f={login:function(){b.set("currentRoute",window.location.href),window.location.replace(e+"users/login?api_key="+d+"&callback="+window.location.href)},logout:function(){return a.get(e+"users/logout?api_key="+d).then(function(a){console.log("Logout Response",a),f.expire()})},user:function(){var a=f.userId();return c.get(a,"groups")},userId:function(){return b.has("auth")?b.get("authUser"):!1},check:function(){return b.has("auth")},expire:function(){return!!b.destroyAuthSession()},isAuthorized:function(a){return angular.isArray(a)||(a=[a]),f.check()&&-1!==a.indexOf(b.userRole)}};return f}]),angular.module("hyenaCheckpointsApp").factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]);