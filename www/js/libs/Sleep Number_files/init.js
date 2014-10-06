/**
 * The init model is a global model thus it is not under any module but in the global models folder
 */
define(['lodash'],function(_){

	return {
		autoClose:false,
		url:'/api/init',
		globalEvents:{},
		filters:{}
	};
});