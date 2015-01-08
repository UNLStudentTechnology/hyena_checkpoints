"use strict";angular.module("hyenaCheckpointsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngStorage","firebase","angularMoment"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/:groupId",{templateUrl:"views/main.html",controller:"DashboardCtrl"}).when("/:groupId/checkpoint/:checkpointId",{templateUrl:"views/checkpoint.html",controller:"CheckpointCtrl"}).when("/:groupId/checkpoint/:checkpointId/settings",{templateUrl:"views/checkpoint_settings.html",controller:"CheckpointSettingsCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).constant("FBURL","https://amber-heat-9947.firebaseio.com/").constant("APIKEY","MTZhYThmNDhiOTdhNzI2YmUyN2NkYWZk").constant("APIPATH","http://st-studio.unl.edu/hyena_platform/public/api/1.0/").constant("angularMomentConfig",{}).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"admin",editor:"editor",guest:"guest"}),angular.module("hyenaCheckpointsApp").factory("AppFirebase",["FBURL","$firebase","$firebaseAuth",function(a,b,c){var d=new Firebase(a),e={getRef:function(){return d},getAuthRef:function(){return c(d)},authenticate:function(a){var b=c(d);return b.$authWithCustomToken(a)}};return e}]),angular.module("hyenaCheckpointsApp").controller("DashboardCtrl",["$rootScope","$scope","$routeParams","CheckpointService","GroupService","Notification",function(a,b,c,d,e,f){b.selectedCheckpoint=null;var g=c.groupId;b.groupId=a.currentGroupId=g,angular.isDefined(g)&&e.existsOrAdd(g),b.checkpoints=null,b.checkpoints=d.sync(g,10).$asArray(),b.addCheckpoint=function(){if(!angular.isUndefined(b.checkpointTitle)&&""!==b.checkpointTitle){var a={title:b.checkpointTitle,created_at:moment().format(),non_members:!0},c=d.add(b.groupId,a);c.then(function(){b.checkpointTitle="",b.newCheckpointForm.$setPristine(),f.show("Your checkpoint has been added successfully!","success")},function(a){console.log("Add checkpoint error:",a),f.show(a.message,"error")})}},b.removeCheckpoint=function(){var a=d.remove(b.groupId,b.selectedCheckpoint);a.then(function(){f.hideModal(),f.show("Your checkpoint has been removed successfully!","success")},function(a){f.hideModal(),console.log("Remove checkpoint error:",a),f.show(a.message,"error")})},b.confirmRemoveCheckpoint=function(a){b.selectedCheckpoint=a,f.showModal("Delete Checkpoint","#modal-checkpoint-delete")}}]),angular.module("hyenaCheckpointsApp").controller("CheckpointCtrl",["$scope","$http","$routeParams","CheckpointService","UserService","GroupService","Notification","APIPATH",function(a,b,c,d,e,f,g){function h(b){var c={user:b,created_at:moment().format()},e=d.checkin(a.group,a.checkpoint.$id,c);e.then(function(){g.show("Thanks! You have been checked in!","success")},function(a){console.log("Checkin error",a),g.show("Sorry! You are already checked in!","error")}),a.checkinNcard="",a.checkinUserForm.$setPristine()}var i=c.checkpointId;a.checkpoint=a.checkins=null;var j=c.groupId;a.group=j,a.currentGroupId=j,a.checkpoint=d.get(j,i).$asObject(),a.checkins=d.checkins(j,i).$asArray(),a.checkinUser=function(){console.log("Checking in ID...",a.checkinNcard);var b=e.validate(a.checkinNcard);b.then(function(b){var c=b.data.users_validated[0],d=f.hasUser(a.group,c);d.then(function(){h(c)},function(){if(a.checkpoint.non_members){h(c);var b=f.addUser(a.group,c);b.then(function(){console.log("User added to group.")})}else a.checkinNcard="",a.checkinUserForm.$setPristine(),g.show("Sorry! You are not a member of this group.","error")})},function(b){a.checkinNcard="",a.checkinUserForm.$setPristine(),console.log(b),g.show(b.data,"error")})}}]),angular.module("hyenaCheckpointsApp").controller("ApplicationCtrl",["$rootScope","$scope","$location","$window","$routeParams","$firebase","AuthService","UserService","AppFirebase","Notification","FBURL","AUTH_EVENTS",function(a,b,c,d,e,f,g,h,i,j,k,l){if(b.appLoaded=null,b.currentUser=null,a.currentGroupId=0,angular.isDefined(c.search().token)){b.appLoaded=!0;var m=c.search().token;c.url(c.path());{i.authenticate(m).then(function(a){g.manualLogin(a.uid,m,"groups").then(function(a){b.currentUser=a.data},function(a){console.log("Login failed:",a)})},function(a){console.error("Login failed:",a)})}}else g.check()&&null!==i.getAuthRef().$getAuth()?(b.appLoaded=!0,g.user("groups").then(function(a){b.currentUser=a.data})):(g.login(),j.showModal("Please log in","#modal-content-login"));b.$watch("currentUser",function(a,b){null===b||!angular.isUndefined(a)&&null!==a?null!==b&&j.hideModal():j.showModal("Please log in","#modal-content-login")}),a.$on(l.notAuthenticated,function(){g.expire(),b.currentUser=null,g.login()}),b.setCurrentUser=function(a){b.currentUser=a},b.logOutCurrentUser=function(){b.currentUser=null,g.logout()},b.logIn=function(){g.check()||g.login()},b.toggleMainDrawer=function(){document.querySelector("unl-layout").toggleDrawer()},b.closeMainDrawer=function(){document.querySelector("unl-layout").closeDrawer()},b.showLoginWindow=function(){j.setModalContent("#modal-content-login")},b.closeModal=function(){j.hideModal()},b.go=function(a,e){b.pageAnimationClass="undefined"==typeof e?"animate-slide-right":e,"back"===a?(b.pageAnimationClass="animate-slide-left",d.history.back()):c.path(a)}}]),angular.module("hyenaCheckpointsApp").controller("CheckpointSettingsCtrl",["$scope","$routeParams","CheckpointService","Notification",function(a,b,c,d){var e=b.checkpointId;a.checkpoint=null;var f=b.groupId;a.group=f,a.currentGroupId=f;var g=c.get(f,e).$asObject();g.$bindTo(a,"checkpoint"),g.$watch(function(){a.checkpointTitle=g.title,a.nonMembers=g.non_members});var h=document.getElementById("non-members-checkbox");h.addEventListener("change",function(){angular.isDefined(a.nonMembers)&&(a.nonMembers=!a.nonMembers,a.updateSettings())}),a.updateSettings=function(){if(!angular.isUndefined(a.checkpointTitle)&&""!==a.checkpointTitle){var b={title:a.checkpointTitle,non_members:a.nonMembers};c.update(f,e,b).then(function(){},function(a){console.log("Checkpoint update error",a),d.show(a.data,"error")})}}}]),angular.module("hyenaCheckpointsApp").service("CheckpointService",["$firebase","Session","AppFirebase",function(a,b,c){var d=c.getRef(),e={groupFirebaseRef:function(a){return d.child("groups/"+a+"/checkpoints")},get:function(b,c){return a(e.groupFirebaseRef(b).child(c))},sync:function(b,c){return a(e.groupFirebaseRef(b).limit(c))},add:function(b,c){return a(e.groupFirebaseRef(b)).$push(c)},update:function(b,c,d){return a(e.groupFirebaseRef(b).child(c)).$update(d)},remove:function(b,c){return a(e.groupFirebaseRef(b)).$remove(c)},checkin:function(b,c,d){return a(e.groupFirebaseRef(b).child(c+"/checkins")).$set(d.user,d)},checkins:function(b,c){return a(e.groupFirebaseRef(b).child(c+"/checkins"))}};return e}]),angular.module("hyenaCheckpointsApp").service("UserService",["APIPATH","APIKEY","$http","toArrayFilter",function(a,b,c,d){return{get:function(d,e){return angular.isUndefined(e)&&(e=""),c.get(a+"users/"+d+"?with="+e+"&api_key="+b)},validate:function(d){return c.post(a+"users/validate?api_key="+b,{ids:[d]})},getUserRelations:function(e,f){if(angular.isUndefined(e))return!1;angular.isUndefined(f)&&(f="user"),e=d(e);for(var g=[],h="",i=0;i<e.length;i++)g.push(e[i][f]),h+=e[i][f]+",";h=h.substring(0,h.length-1);var j=c.get(a+"users?ids="+h+"&api_key="+b);return j.then(function(a){for(var b=0;b<a.data.length;b++)e[b][f]=a.data[b]}),e}}}]),angular.module("hyenaCheckpointsApp").service("Session",["AppFirebase",function(){return{has:function(a){return!!sessionStorage.getItem(a)},get:function(a){return sessionStorage.getItem(a)},set:function(a,b){return sessionStorage.setItem(a,b)},unset:function(a){return sessionStorage.removeItem(a)},createAuthSession:function(a,b){return sessionStorage.setItem("auth",!0),sessionStorage.setItem("authUser",a),sessionStorage.setItem("authToken",b),!0},destroyAuthSession:function(){sessionStorage.removeItem("auth"),sessionStorage.removeItem("authUser"),sessionStorage.removeItem("authToken")}}}]),angular.module("hyenaCheckpointsApp").service("AuthService",["$http","$sessionStorage","$localStorage","UserService","APIKEY","APIPATH","AppFirebase",function(a,b,c,d,e,f,g){var h=g.getRef(),i={login:function(){b.currentRoute=window.location.href,window.location.replace(f+"users/login?api_key="+e+"&callback="+window.location.href)},manualLogin:function(a,b,c){angular.isUndefined(c)&&(c="");var e=d.get(a,c);return e.then(function(){return i.createAuthSession(a,b)?i.user(c):!1})},logout:function(){i.expire(),window.location.replace(f+"users/logout?api_key="+e)},createAuthSession:function(a,b){return c.auth=!0,c.authUser=a,c.authToken=b,!0},user:function(a){angular.isUndefined(a)&&(a="");var b=i.userId();return d.get(b,a)},userId:function(){return c.auth?c.authUser:!1},authToken:function(){return c.authToken},check:function(){return!!c.auth},expire:function(){angular.isDefined(h)&&h.unauth(),delete c.auth,delete c.authUser,delete c.authToken}};return i}]),angular.module("hyenaCheckpointsApp").factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]),angular.module("hyenaCheckpointsApp").service("Notification",function(){var a={show:function(a,b){var c=document.querySelector("unl-toast");c.setAttribute("text",a),c.setAttribute("type",b),c.show()},showModal:function(a,b){var c=document.querySelector("#unl-modal"),d=document.querySelector(b);c.setAttribute("heading",a),c.contents=d,c.show()},hideModal:function(){var a=document.querySelector("#unl-modal");a.close()},setModalContent:function(a){var b=document.querySelector("#unl-modal"),c=document.querySelector(a);b.contents=c}};return a}),angular.module("hyenaCheckpointsApp").service("GroupService",["APIPATH","APIKEY","$http","$firebase","AppFirebase",function(a,b,c,d,e){var f=e.getRef().child("groups"),g={get:function(d,e){return angular.isUndefined(e)&&(e=""),c.get(a+"groups/"+d+"?with="+e+"&api_key="+b)},exists:function(a){var b=d(f.child(a)).$asObject();return b.$loaded(function(){return null!==b.$value})},add:function(a,b){return d(f).$set(b,a)},addUser:function(d,e){return c.post(a+"groups/"+d+"/users?api_key="+b,{users:[e]})},hasUser:function(d,e){return c.get(a+"groups/"+d+"/users/"+e+"?api_key="+b)},existsOrAdd:function(a){var b=g.exists(a);b.then(function(b){if(!b){var c=g.get(a);c.then(function(b){var c={title:b.data.title,description:b.data.description};g.add(c,a).then(function(a){console.log("Group added to Firebase",a)})})}})}};return g}]),angular.module("hyenaCheckpointsApp").filter("user",["UserService",function(a){var b=function(b){a.getUserRelations(b);return b};return b.$stateful=!0,b}]),angular.module("hyenaCheckpointsApp").filter("toArray",function(){return function(a){return a instanceof Object?Object.keys(a).map(function(b){return Object.defineProperty(a[b],"$key",{enumerable:!1,value:b})}):a}}),angular.module("hyenaCheckpointsApp").directive("user",["UserService",function(a){return{restrict:"A",scope:{userValue:"=userModel"},link:function(b){b.userValue;b.$watch("userValue",function(c){angular.isDefined(c)&&!angular.isObject(c)&&a.get(c).then(function(a){b.userValue=a.data})})}}}]);