define(['lodash' ], function (_) {
	return {
		//autoClose:true,
		data:{},
		max:{
			memory:200,
			//local and session should be set to a low number since the actual number gets enforced only whenever the browser storage limit is hit
			local:20,
			session:20
		},
		storeEnabled:typeof(Storage)!=='undefined',
		//initialize:function(){},
		getStore:function(store){
			//I added the and window.localStorage && .. because analytics showed some errors that they where undefined so just to be safe
			return typeof(Storage)!=='undefined' && window.localStorage && window.sessionStorage ? store : 'memory';
		},
		get:function(key,store,options){
			if(this.app.isNode){return false;}

			store = this.getStore(store) || 'memory';
			var data;
			if(store === '*'){
				data = this.memoryGet(key);
				if(!data){
					data = this.sessionGet(key);
				}
				if(!data){
					data = this.localGet(key);
				}
			}else{
				data = this[store+'Get'](key);
			}

			if(data){
				//data = data;
				if(data.expires > new Date().getTime()){
					return data.data;
				}
				//console.log('data has expired');
			}
			return null;

		},
		set:function(key,value,store,options){
			//DO NOT SAVE IN NODE it will be a huge memory leak
			if(this.app.isNode){return false;}

			store = this.getStore(store) || 'memory';
			var duration = options.duration || 60 * 60,
				data = {
					expires:new Date().getTime() + (duration * 1000),
					data:value
				};

			this[store+'Set'](key,data);
			this.checkMax();

		},
		memoryGet:function(key){
			return this.app.clone(this.data[key]);
		},
		localGet:function(key){
			var data = localStorage.getItem(key);
			return data ? JSON.parse(data) : data;
		},
		sessionGet:function(key){
			var data = sessionStorage.getItem(key);
			return data ? JSON.parse(data) : data;
		},
		memorySet:function(key,value){
			this.data[key] = this.app.clone(value);
		},
		localSet:function(key,value,skipReTry){
			try{
				localStorage.setItem(key,JSON.stringify(value));
			}catch(e){
				if(!skipReTry){
					//do a cleanUp and try again since there might be enough space now
					this.cleanUp('local');
					this.localSet(key,value,true);
				}
				//QUOTA_EXCEEDED_ERR
			}

		},
		sessionSet:function(key,value,skipReTry){
			try{
				sessionStorage.setItem(key,JSON.stringify(value));
			}catch(e){
				if(!skipReTry){
					//do a cleanUp and try again since there might be enough space now
					this.cleanUp('local');
					this.sessionSet(key,value,true);
				}
				//QUOTA_EXCEEDED_ERR
			}
		},
		memoryDelete:function(key){
			delete this.data[key];
		},
		localDelete:function(key){
			localStorage.removeItem(key);
		},
		sessionDelete:function(key){
			sessionStorage.removeItem(key);
		},
		checkMax:function(){
			if(_.keys(this.data).length > this.max.memory){
				this.cleanUp('memory');
			}

			//todo:I should remove these since the session and local cleanup are slow from the json parsing so the cleanUp for them will only run when they are out of memory, no reason to run it any other time
			/*if(localStorage.length > this.max.local){
				this.cleanUp('local');
			}
			if(sessionStorage.length > this.max.session){
				this.cleanUp('session');
			}*/

		},
		cleanUp:function(store){
			var _this=this,
				storage = store==='memory' ? this.data : window[store+'Storage'],
				max = this.max[store],
				timestamp = new Date().getTime(),
				i,key,data;

			var keys = [];
			//delete all expired data
			if(store==='memory'){
				_.each(this.data,function(data,key){

					if(data.expires < timestamp){
						this[store+'Delete'](key);
					}else{
						keys.push({
							key:key,
							expires:data.expires
						});
					}
				});
			}else{
				//start backwards because deleting will change indexes
				for(i = storage.length -1; i >= 0 ; i--) {
					key = storage.key(i);
					data = this[store+'Get'](key);

					if(data.expires < timestamp){
						this[store+'Delete'](key);
					}else{
						keys.push({
							key:key,
							expires:data.expires
						});
					}
				}
			}

			//we stored the keys with the expiration so that we can sort the entries by expiration to delete the ones
			//that are expiring sooner
			if(keys.length > max){
				keys = _.sortBy(keys,'expires');
				//delete oldest data to be in the max limit of records
				for(i = (keys.length -max) -1; i >= 0 ; i--){
					this[store+'Delete'](keys[i].key);
				}
			}



		}

	};
});