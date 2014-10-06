define(['lodash',
	'core/modules/cache/filters/cache'
],function(_){

	return {
		url:'/api/generic',
		globalEvents:{},
		filters:{
			'core/modules/cache/filters/cache':{
				templates:{
					'product.list':{
						store:'memory',
						duration:30 * 60 //30mins
					},
					'product.details':{
						store:'memory',
						duration:10 * 60 //10mins
					}
				}
			}
		}
	};
});