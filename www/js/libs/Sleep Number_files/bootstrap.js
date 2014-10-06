/**
 * Controllers do not need to be added to the dependencies since they can be loaded async since they are loaded from
 * app.dispatch and not directly through the factory. Also controllers get automatically added by grunt to the built
 * javascript files. All other modules need to be included in the dependencies before you can create instances of them
 * with the factory.
 * If you are using the attachModules remember to include all the non-controller modules in the dependencies array.
 *
 */
define([
	'lodash',

	//you must manually add any used core modules controllers for the build process. They are not added automatically
	//like project controllers to allow for the flexibility of versioning core modules and for project specific overrides
	//most likely you do not need to change these
	'core/modules/service/controller',

	//project specific modules (controllers get included automatically so no need to include them)
	'base/models/init',
	'modules/global/classes/util',
	'modules/global/classes/cookies'
], function   (_) {
	return function(app,callback){
		//attach modules that need to be used without triggers (i.e. they have util methods that return values). You
		//will be able to access them by calling this.app.modules[module path or moduleName if it exists in module definition]
		app.attachModules({
			common:{
				//'modules/global/global',
				//forms need to be preloaded since they are needed sync for the base model in the parse where it
				'modules/forms/controller':'controller',
				'modules/global/classes/util':'object',
				'modules/global/classes/cookies':'object'
			},
			node:{

			},
			browser:{
				'modules/widgets/controller':'controller',
				'modules/analytics/controller':'controller'
			}
		},function(){

			// run any global code in here
			//create the init model, pass in true in the 4th parameter to save the model instance so we can get it with factory.model.get('base/models/init')

			var initModel = app.factory.model.create('base/models/init',null,null,true);
			//initModel.set(initModel.parse(JSON.parse("{\"errors\":[],\"resultset\":{\"actions\":{\"search\":{\"showRequiredStars\":false,\"url\":\"\/api\/generic\",\"action\":\"\/search\/controller.jsp\",\"form\":{\"f\":{\"value\":\"Taxonomy\/ZALES\/3740873\",\"type\":\"select\",\"options\":[{\"label\":\"Zales\",\"value\":\"Taxonomy\/ZALES\/3740873\"},{\"label\":\"Zales Outlet\",\"value\":\"Taxonomy\/ZALES\/3720530\"}],\"group\":\"default\"},\"fbc\":{\"value\":\"0\",\"type\":\"hidden\",\"group\":\"default\"},\"search\":{\"value\":\"\",\"type\":\"text\",\"placeholder\":\"Keyword or item #\",\"key\":\"kw\",\"group\":\"default\"}}},\"emailForm\":{\"showRequiredStars\":false,\"url\":\"\/api\/generic\",\"action\":\"http:\/\/em.zales.com\/pub\/rf\",\"form\":{\"datetime\":{\"value\":\"December 17, 2013 3:26:54 PM EST\",\"type\":\"hidden\",\"group\":\"default\"},\"contest\":{\"value\":\"zales_nocontest\",\"type\":\"hidden\",\"group\":\"default\"},\"emailPref\":{\"value\":\"y\",\"type\":\"hidden\",\"group\":\"default\"},\"_ri_\":{\"value\":\"X0Gzc2X%3DWQpglLjHJlYQGh7tNMzgzfMJkEIzbzcwWYWtmL9PPnVwjpnpgHlpgneHmgJoXX0Gzc2X%3DWQpglLjHJlYQGsyNkzbFCsbWHmgSl7u6nITKzaBO\",\"type\":\"hidden\",\"group\":\"default\"},\"Z_OPTIN_SRC\":{\"value\":\"FOOTER\",\"type\":\"hidden\",\"group\":\"default\"},\"email\":{\"value\":\"\",\"type\":\"text\",\"placeholder\":\"Enter Email Address\",\"key\":\"EMAIL_ADDRESS_\",\"validation\":\"required|email\",\"group\":\"default\"},\"x\":{\"key\":\"x\",\"value\":\"37\",\"type\":\"hidden\"},\"y\":{\"key\":\"y\",\"value\":\"6\",\"type\":\"hidden\"}}}},\"promos\":[{\"href\":\"\/category\/index.jsp?categoryId=13337244\",\"src\":\"http:\/\/ZALES.imageg.net\/cms_widgets\/21\/87\/2187548_assets\/Zales20131216H1a.jpg\"},{\"href\":\"\/category\/index.jsp?categoryId=13337244\",\"src\":\"http:\/\/ZALES.imageg.net\/cms_widgets\/21\/87\/2187548_assets\/Zales20131216H2.jpg\"}],\"carousel\":[],\"menu\":[{\"name\":\"Wedding\",\"href\":\"\/category\/index.jsp?categoryId=13337262\",\"subs\":[{\"name\":\"SHOP\",\"subs\":[{\"name\":\"Engagement\",\"href\":\"\/family\/index.jsp?categoryId=3045659&cp=13337262\"},{\"name\":\"Wedding Bands\",\"href\":\"\/family\/index.jsp?categoryId=3280879&cp=13337262\"},{\"name\":\"Anniversary\",\"href\":\"\/family\/index.jsp?categoryId=3096958&cp=13337262\"},{\"name\":\"Promise Rings\",\"href\":\"\/family\/index.jsp?categoryId=2109181&cp=13337262\"},{\"name\":\"Wedding Gifts\",\"href\":\"\/family\/index.jsp?categoryId=12942218&cp=13337262\"}]},{\"name\":\"EXCLUSIVE COLLECTIONS\",\"subs\":[{\"name\":\"Vera Wang LOVE\",\"href\":\"\/category\/index.jsp?categoryId=12134615&cp=13337262\"},{\"name\":\"Arctic Brilliance\",\"href\":\"\/family\/index.jsp?categoryId=12361058&cp=13337262\"}]}]},{\"name\":\"Rings\",\"href\":\"\/category\/index.jsp?categoryId=13337264\",\"subs\":[{\"name\":\"SHOP BY MATERIAL\",\"subs\":[{\"name\":\"Diamond\",\"href\":\"\/shop\/index.jsp?categoryId=3261685&cp=13337264\"},{\"name\":\"Gemstone\",\"href\":\"\/shop\/index.jsp?categoryId=3261687&cp=13337264\"},{\"name\":\"Pearl\",\"href\":\"\/shop\/index.jsp?categoryId=3261688&cp=13337264\"},{\"name\":\"Gold\",\"href\":\"\/shop\/index.jsp?categoryId=13339987&cp=13337264\"},{\"name\":\"Silver\",\"href\":\"\/shop\/index.jsp?categoryId=13339988&cp=13337264\"},{\"name\":\"Stainless Steel\",\"href\":\"\/shop\/index.jsp?categoryId=13339989&cp=13337264\"},{\"name\":\"Titanium\",\"href\":\"\/shop\/index.jsp?categoryId=13339991&cp=13337264\"},{\"name\":\"Tungsten\",\"href\":\"\/shop\/index.jsp?categoryId=13339992&cp=13337264\"},{\"name\":\"Cobalt\",\"href\":\"\/shop\/index.jsp?categoryId=13339972&cp=13337264\"}]},{\"name\":\"Gender\",\"subs\":[{\"name\":\"Child\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=PAD&fv=Gender%2FChild%27s&fd=Child%27s&&fbc=1&fbn=Gender|Child\'s\"},{\"name\":\"Ladies\'\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=PAD&fv=Gender%2FLadies%27&fd=Ladies%27&&fbc=1&fbn=Gender|Ladies\'\"},{\"name\":\"Men\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=PAD&fv=Gender%2FMen%27s&fd=Men%27s&&fbc=1&fbn=Gender|Men\'s\"},{\"name\":\"Unisex\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=PAD&fv=Gender%2FUnisex&fd=Unisex&&fbc=1&fbn=Gender|Unisex\"}]},{\"name\":\"Price\",\"subs\":[{\"name\":\"Under $50\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00000000%7E-%7E00004999&fd=Under+%2450&&fbc=1&fbn=StorePrice|Under $50\"},{\"name\":\"$50.00 - $99.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00005000%7E-%7E00009999&fd=%2450.00+-+%2499.00&&fbc=1&fbn=StorePrice|$50.00 - $99.00\"},{\"name\":\"$100.00 - $249.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00010000%7E-%7E00024999&fd=%24100.00+-+%24249.00&&fbc=1&fbn=StorePrice|$100.00 - $249.00\"},{\"name\":\"$250.00 - $499.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00025000%7E-%7E00049999&fd=%24250.00+-+%24499.00&&fbc=1&fbn=StorePrice|$250.00 - $499.00\"},{\"name\":\"$500.00 - $749.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00050000%7E-%7E00074999&fd=%24500.00+-+%24749.00&&fbc=1&fbn=StorePrice|$500.00 - $749.00\"},{\"name\":\"$750.00 - $999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00075000%7E-%7E00099999&fd=%24750.00+-+%24999.00&&fbc=1&fbn=StorePrice|$750.00 - $999.00\"},{\"name\":\"$1,000.00 - $1,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00100000%7E-%7E00199999&fd=%241%2C000.00+-+%241%2C999.00&&fbc=1&fbn=StorePrice|$1,000.00 - $1,999.00\"},{\"name\":\"$2,000.00 - $2,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00200000%7E-%7E00299999&fd=%242%2C000.00+-+%242%2C999.00&&fbc=1&fbn=StorePrice|$2,000.00 - $2,999.00\"},{\"name\":\"$3,000.00 - $4,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00300000%7E-%7E00499999&fd=%243%2C000.00+-+%244%2C999.00&&fbc=1&fbn=StorePrice|$3,000.00 - $4,999.00\"},{\"name\":\"Over $5,000.00\",\"href\":\"\/family\/index.jsp?categoryId=2109136&fg=&ff=StorePrice&fv=00500000%7E-%7E999999999999&fd=Over+%245%2C000.00&&fbc=1&fbn=StorePrice|Over $5,000.00\"}]},{\"name\":\"POPULAR STYLES\",\"subs\":[{\"name\":\"Engagement\",\"href\":\"\/family\/index.jsp?categoryId=3045659&cp=13337264\"},{\"name\":\"Bridal Sets\",\"href\":\"\/family\/index.jsp?categoryId=2137035&cp=13337264\"},{\"name\":\"Wedding Bands\",\"href\":\"\/family\/index.jsp?categoryId=3280879&cp=13337264\"},{\"name\":\"Trio Collection\",\"href\":\"\/family\/index.jsp?categoryId=3637056&cp=13337264\"},{\"name\":\"Solitaire Enhancers\",\"href\":\"\/shop\/index.jsp?categoryId=3280878&cp=13337264\"},{\"name\":\"Promise Rings\",\"href\":\"\/family\/index.jsp?categoryId=2109181&cp=13337264\"},{\"name\":\"Three Stone\",\"href\":\"\/shop\/index.jsp?categoryId=2109182&cp=13337264\"},{\"name\":\"Fashion\",\"href\":\"\/shop\/index.jsp?categoryId=3261684&cp=13337264\"},{\"name\":\"Mother\'s & Family\",\"href\":\"\/shop\/index.jsp?categoryId=30078696&cp=13337264\"},{\"name\":\"Class Rings\",\"href\":\"\/family\/index.jsp?categoryId=2073098&cp=13337264\"},{\"name\":\"Personalized\",\"href\":\"\/family\/index.jsp?categoryId=3261690&cp=13337264\"}]}]},{\"name\":\"Necklaces\",\"href\":\"\/category\/index.jsp?categoryId=13337268\",\"subs\":[{\"name\":\"SHOP BY MATERIAL\",\"subs\":[{\"name\":\"Diamond\",\"href\":\"\/shop\/index.jsp?categoryId=3263544&cp=13337268\"},{\"name\":\"Gemstone\",\"href\":\"\/shop\/index.jsp?categoryId=3263546&cp=13337268\"},{\"name\":\"Pearl\",\"href\":\"\/shop\/index.jsp?categoryId=3263547&cp=13337268\"},{\"name\":\"Gold\",\"href\":\"\/shop\/index.jsp?categoryId=3263548&cp=13337268\"},{\"name\":\"Silver\",\"href\":\"\/shop\/index.jsp?categoryId=3263549&cp=13337268\"},{\"name\":\"Stainless Steel\",\"href\":\"\/shop\/index.jsp?categoryId=13339997&cp=13337268\"}]},{\"name\":\"Gender\",\"subs\":[{\"name\":\"Child\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=PAD&fv=Gender%2FChild%27s&fd=Child%27s&&fbc=1&fbn=Gender|Child\'s\"},{\"name\":\"Ladies\'\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=PAD&fv=Gender%2FLadies%27&fd=Ladies%27&&fbc=1&fbn=Gender|Ladies\'\"},{\"name\":\"Men\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=PAD&fv=Gender%2FMen%27s&fd=Men%27s&&fbc=1&fbn=Gender|Men\'s\"},{\"name\":\"Unisex\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=PAD&fv=Gender%2FUnisex&fd=Unisex&&fbc=1&fbn=Gender|Unisex\"}]},{\"name\":\"Price\",\"subs\":[{\"name\":\"Under $50\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00000000%7E-%7E00004999&fd=Under+%2450&&fbc=1&fbn=StorePrice|Under $50\"},{\"name\":\"$50.00 - $99.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00005000%7E-%7E00009999&fd=%2450.00+-+%2499.00&&fbc=1&fbn=StorePrice|$50.00 - $99.00\"},{\"name\":\"$100.00 - $249.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00010000%7E-%7E00024999&fd=%24100.00+-+%24249.00&&fbc=1&fbn=StorePrice|$100.00 - $249.00\"},{\"name\":\"$250.00 - $499.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00025000%7E-%7E00049999&fd=%24250.00+-+%24499.00&&fbc=1&fbn=StorePrice|$250.00 - $499.00\"},{\"name\":\"$500.00 - $749.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00050000%7E-%7E00074999&fd=%24500.00+-+%24749.00&&fbc=1&fbn=StorePrice|$500.00 - $749.00\"},{\"name\":\"$750.00 - $999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00075000%7E-%7E00099999&fd=%24750.00+-+%24999.00&&fbc=1&fbn=StorePrice|$750.00 - $999.00\"},{\"name\":\"$1,000.00 - $1,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00100000%7E-%7E00199999&fd=%241%2C000.00+-+%241%2C999.00&&fbc=1&fbn=StorePrice|$1,000.00 - $1,999.00\"},{\"name\":\"$2,000.00 - $2,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00200000%7E-%7E00299999&fd=%242%2C000.00+-+%242%2C999.00&&fbc=1&fbn=StorePrice|$2,000.00 - $2,999.00\"},{\"name\":\"$3,000.00 - $4,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00300000%7E-%7E00499999&fd=%243%2C000.00+-+%244%2C999.00&&fbc=1&fbn=StorePrice|$3,000.00 - $4,999.00\"},{\"name\":\"Over $5,000.00\",\"href\":\"\/family\/index.jsp?categoryId=2109139&fg=&ff=StorePrice&fv=00500000%7E-%7E999999999999&fd=Over+%245%2C000.00&&fbc=1&fbn=StorePrice|Over $5,000.00\"}]},{\"name\":\"POPULAR STYLES\",\"subs\":[{\"name\":\"Chains\",\"href\":\"\/shop\/index.jsp?categoryId=3263550&cp=13337268\"},{\"name\":\"Lockets\",\"href\":\"\/shop\/index.jsp?categoryId=3263551&cp=13337268\"},{\"name\":\"Hearts\",\"href\":\"\/shop\/index.jsp?categoryId=3263553&cp=13337268\"},{\"name\":\"Crosses\",\"href\":\"\/shop\/index.jsp?categoryId=3263554&cp=13337268\"},{\"name\":\"Whimsical\",\"href\":\"\/shop\/index.jsp?categoryId=3556446&cp=13337268\"},{\"name\":\"Journey\",\"href\":\"\/family\/index.jsp?categoryId=3263552&cp=13337268\"},{\"name\":\"Personalized\",\"href\":\"\/family\/index.jsp?categoryId=3263557&cp=13337268\"}]}]},{\"name\":\"Earrings\",\"href\":\"\/category\/index.jsp?categoryId=13337270\",\"subs\":[{\"name\":\"SHOP BY MATERIAL\",\"subs\":[{\"name\":\"Diamond\",\"href\":\"\/shop\/index.jsp?categoryId=3263622&cp=13337270\"},{\"name\":\"Gemstone\",\"href\":\"\/shop\/index.jsp?categoryId=3263623&cp=13337270\"},{\"name\":\"Pearl\",\"href\":\"\/shop\/index.jsp?categoryId=3263624&cp=13337270\"},{\"name\":\"Gold\",\"href\":\"\/shop\/index.jsp?categoryId=3263625&cp=13337270\"},{\"name\":\"Silver\",\"href\":\"\/shop\/index.jsp?categoryId=3263630&cp=13337270\"}]},{\"name\":\"Gender\",\"subs\":[{\"name\":\"Child\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=PAD&fv=Gender%2FChild%27s&fd=Child%27s&&fbc=1&fbn=Gender|Child\'s\"},{\"name\":\"Ladies\'\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=PAD&fv=Gender%2FLadies%27&fd=Ladies%27&&fbc=1&fbn=Gender|Ladies\'\"},{\"name\":\"Men\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=PAD&fv=Gender%2FMen%27s&fd=Men%27s&&fbc=1&fbn=Gender|Men\'s\"},{\"name\":\"Unisex\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=PAD&fv=Gender%2FUnisex&fd=Unisex&&fbc=1&fbn=Gender|Unisex\"}]},{\"name\":\"Price\",\"subs\":[{\"name\":\"Under $50\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00000000%7E-%7E00004999&fd=Under+%2450&&fbc=1&fbn=StorePrice|Under $50\"},{\"name\":\"$50.00 - $99.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00005000%7E-%7E00009999&fd=%2450.00+-+%2499.00&&fbc=1&fbn=StorePrice|$50.00 - $99.00\"},{\"name\":\"$100.00 - $249.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00010000%7E-%7E00024999&fd=%24100.00+-+%24249.00&&fbc=1&fbn=StorePrice|$100.00 - $249.00\"},{\"name\":\"$250.00 - $499.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00025000%7E-%7E00049999&fd=%24250.00+-+%24499.00&&fbc=1&fbn=StorePrice|$250.00 - $499.00\"},{\"name\":\"$500.00 - $749.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00050000%7E-%7E00074999&fd=%24500.00+-+%24749.00&&fbc=1&fbn=StorePrice|$500.00 - $749.00\"},{\"name\":\"$750.00 - $999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00075000%7E-%7E00099999&fd=%24750.00+-+%24999.00&&fbc=1&fbn=StorePrice|$750.00 - $999.00\"},{\"name\":\"$1,000.00 - $1,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00100000%7E-%7E00199999&fd=%241%2C000.00+-+%241%2C999.00&&fbc=1&fbn=StorePrice|$1,000.00 - $1,999.00\"},{\"name\":\"$2,000.00 - $2,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00200000%7E-%7E00299999&fd=%242%2C000.00+-+%242%2C999.00&&fbc=1&fbn=StorePrice|$2,000.00 - $2,999.00\"},{\"name\":\"$3,000.00 - $4,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00300000%7E-%7E00499999&fd=%243%2C000.00+-+%244%2C999.00&&fbc=1&fbn=StorePrice|$3,000.00 - $4,999.00\"},{\"name\":\"Over $5,000.00\",\"href\":\"\/family\/index.jsp?categoryId=2109138&fg=&ff=StorePrice&fv=00500000%7E-%7E999999999999&fd=Over+%245%2C000.00&&fbc=1&fbn=StorePrice|Over $5,000.00\"}]},{\"name\":\"POPULAR STYLES\",\"subs\":[{\"name\":\"Solitaire Studs\",\"href\":\"\/shop\/index.jsp?categoryId=3263627&cp=13337270\"},{\"name\":\"Fashion Studs\",\"href\":\"\/shop\/index.jsp?categoryId=3263629&cp=13337270\"},{\"name\":\"Hoop\",\"href\":\"\/shop\/index.jsp?categoryId=3263631&cp=13337270\"},{\"name\":\"Drop\",\"href\":\"\/shop\/index.jsp?categoryId=3263632&cp=13337270\"},{\"name\":\"Personalized\",\"href\":\"\/family\/index.jsp?categoryId=3263634&cp=13337270\"}]}]},{\"name\":\"Bracelets\",\"href\":\"\/category\/index.jsp?categoryId=13337271\",\"subs\":[{\"name\":\"SHOP BY MATERIAL\",\"subs\":[{\"name\":\"Diamond\",\"href\":\"\/shop\/index.jsp?categoryId=3263652&cp=13337271\"},{\"name\":\"Gemstone\",\"href\":\"\/shop\/index.jsp?categoryId=3263653&cp=13337271\"},{\"name\":\"Pearl\",\"href\":\"\/shop\/index.jsp?categoryId=3263654&cp=13337271\"},{\"name\":\"Gold\",\"href\":\"\/shop\/index.jsp?categoryId=3263655&cp=13337271\"},{\"name\":\"Silver\",\"href\":\"\/shop\/index.jsp?categoryId=3263657&cp=13337271\"},{\"name\":\"Stainless Steel\",\"href\":\"\/shop\/index.jsp?categoryId=13340000&cp=13337271\"}]},{\"name\":\"Gender\",\"subs\":[{\"name\":\"Child\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=PAD&fv=Gender%2FChild%27s&fd=Child%27s&&fbc=1&fbn=Gender|Child\'s\"},{\"name\":\"Ladies\'\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=PAD&fv=Gender%2FLadies%27&fd=Ladies%27&&fbc=1&fbn=Gender|Ladies\'\"},{\"name\":\"Men\'s\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=PAD&fv=Gender%2FMen%27s&fd=Men%27s&&fbc=1&fbn=Gender|Men\'s\"},{\"name\":\"Unisex\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=PAD&fv=Gender%2FUnisex&fd=Unisex&&fbc=1&fbn=Gender|Unisex\"}]},{\"name\":\"Price\",\"subs\":[{\"name\":\"Under $50\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00000000%7E-%7E00004999&fd=Under+%2450&&fbc=1&fbn=StorePrice|Under $50\"},{\"name\":\"$50.00 - $99.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00005000%7E-%7E00009999&fd=%2450.00+-+%2499.00&&fbc=1&fbn=StorePrice|$50.00 - $99.00\"},{\"name\":\"$100.00 - $249.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00010000%7E-%7E00024999&fd=%24100.00+-+%24249.00&&fbc=1&fbn=StorePrice|$100.00 - $249.00\"},{\"name\":\"$250.00 - $499.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00025000%7E-%7E00049999&fd=%24250.00+-+%24499.00&&fbc=1&fbn=StorePrice|$250.00 - $499.00\"},{\"name\":\"$500.00 - $749.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00050000%7E-%7E00074999&fd=%24500.00+-+%24749.00&&fbc=1&fbn=StorePrice|$500.00 - $749.00\"},{\"name\":\"$750.00 - $999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00075000%7E-%7E00099999&fd=%24750.00+-+%24999.00&&fbc=1&fbn=StorePrice|$750.00 - $999.00\"},{\"name\":\"$1,000.00 - $1,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00100000%7E-%7E00199999&fd=%241%2C000.00+-+%241%2C999.00&&fbc=1&fbn=StorePrice|$1,000.00 - $1,999.00\"},{\"name\":\"$2,000.00 - $2,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00200000%7E-%7E00299999&fd=%242%2C000.00+-+%242%2C999.00&&fbc=1&fbn=StorePrice|$2,000.00 - $2,999.00\"},{\"name\":\"$3,000.00 - $4,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00300000%7E-%7E00499999&fd=%243%2C000.00+-+%244%2C999.00&&fbc=1&fbn=StorePrice|$3,000.00 - $4,999.00\"},{\"name\":\"Over $5,000.00\",\"href\":\"\/family\/index.jsp?categoryId=2109140&fg=&ff=StorePrice&fv=00500000%7E-%7E999999999999&fd=Over+%245%2C000.00&&fbc=1&fbn=StorePrice|Over $5,000.00\"}]},{\"name\":\"POPULAR STYLES\",\"subs\":[{\"name\":\"Persona Beads\",\"href\":\"\/category\/index.jsp?categoryId=11526501&cp=13337271\"},{\"name\":\"Bangles & Cuffs\",\"href\":\"\/family\/index.jsp?categoryId=3263670&cp=13337271\"},{\"name\":\"Charm Bracelets\",\"href\":\"\/shop\/index.jsp?categoryId=3263659&cp=13337271\"},{\"name\":\"Anklets\",\"href\":\"\/shop\/index.jsp?categoryId=3263662&cp=13337271\"},{\"name\":\"Personalized\",\"href\":\"\/family\/index.jsp?categoryId=3263665&cp=13337271\"}]}]},{\"name\":\"Watches\",\"href\":\"\/category\/index.jsp?categoryId=13337272\",\"subs\":[{\"name\":\"FEATURED BRANDS\",\"subs\":[{\"name\":\"88 RUE DU RHONE\",\"href\":\"\/family\/index.jsp?categoryId=15843006&cp=13337272\"},{\"name\":\"Bulova\",\"href\":\"\/family\/index.jsp?categoryId=2071113&cp=13337272\"},{\"name\":\"Citizen\",\"href\":\"\/family\/index.jsp?categoryId=2071109&cp=13337272\"},{\"name\":\"Citizen: The Signature Collection\",\"href\":\"\/family\/index.jsp?categoryId=12396681&cp=13337272\"},{\"name\":\"Drive from Citizen\",\"href\":\"\/family\/index.jsp?categoryId=21537166&cp=13337272\"},{\"name\":\"ESQ Movado\",\"href\":\"\/family\/index.jsp?categoryId=2071110&cp=13337272\"},{\"name\":\"ESQ One\",\"href\":\"\/family\/index.jsp?categoryId=20261906&cp=13337272\"},{\"name\":\"Invicta\",\"href\":\"\/family\/index.jsp?categoryId=3451400&cp=13337272\"},{\"name\":\"Movado\",\"href\":\"\/family\/index.jsp?categoryId=2071111&cp=13337272\"},{\"name\":\"Seiko\",\"href\":\"\/family\/index.jsp?categoryId=3079642&cp=13337272\"},{\"name\":\"Timex\",\"href\":\"\/family\/index.jsp?categoryId=24444806&cp=13337272\"},{\"name\":\"Tissot\",\"href\":\"\/family\/index.jsp?categoryId=15843056&cp=13337272\"},{\"name\":\"Victorinox Swiss Army\",\"href\":\"\/family\/index.jsp?categoryId=20262256&cp=13337272\"}]},{\"name\":\"ONLINE ONLY\",\"subs\":[{\"name\":\"Anne Klein\",\"href\":\"\/family\/index.jsp?categoryId=10817423&cp=13337272\"},{\"name\":\"Caravelle by Bulova\",\"href\":\"\/family\/index.jsp?categoryId=3007182&cp=13337272\"},{\"name\":\"Pulsar\",\"href\":\"\/family\/index.jsp?categoryId=11790079&cp=13337272\"},{\"name\":\"Skagen\",\"href\":\"\/family\/index.jsp?categoryId=4041066&cp=13337272\"},{\"name\":\"Personalized\",\"href\":\"\/family\/index.jsp?categoryId=2146785&cp=13337272\"}]},{\"name\":\"Gender\",\"subs\":[{\"name\":\"Ladies\'\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=PAD&fv=Gender%2FLadies%27&fd=Ladies%27&&fbc=1&fbn=Gender|Ladies\'\"},{\"name\":\"Men\'s\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=PAD&fv=Gender%2FMen%27s&fd=Men%27s&&fbc=1&fbn=Gender|Men\'s\"},{\"name\":\"Unisex\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=PAD&fv=Gender%2FUnisex&fd=Unisex&&fbc=1&fbn=Gender|Unisex\"}]},{\"name\":\"Price\",\"subs\":[{\"name\":\"$50.00 - $99.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00005000%7E-%7E00009999&fd=%2450.00+-+%2499.00&&fbc=1&fbn=StorePrice|$50.00 - $99.00\"},{\"name\":\"$100.00 - $249.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00010000%7E-%7E00024999&fd=%24100.00+-+%24249.00&&fbc=1&fbn=StorePrice|$100.00 - $249.00\"},{\"name\":\"$250.00 - $499.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00025000%7E-%7E00049999&fd=%24250.00+-+%24499.00&&fbc=1&fbn=StorePrice|$250.00 - $499.00\"},{\"name\":\"$500.00 - $749.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00050000%7E-%7E00074999&fd=%24500.00+-+%24749.00&&fbc=1&fbn=StorePrice|$500.00 - $749.00\"},{\"name\":\"$750.00 - $999.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00075000%7E-%7E00099999&fd=%24750.00+-+%24999.00&&fbc=1&fbn=StorePrice|$750.00 - $999.00\"},{\"name\":\"$1,000.00 - $1,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00100000%7E-%7E00199999&fd=%241%2C000.00+-+%241%2C999.00&&fbc=1&fbn=StorePrice|$1,000.00 - $1,999.00\"},{\"name\":\"$2,000.00 - $2,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00200000%7E-%7E00299999&fd=%242%2C000.00+-+%242%2C999.00&&fbc=1&fbn=StorePrice|$2,000.00 - $2,999.00\"},{\"name\":\"$3,000.00 - $4,999.00\",\"href\":\"\/family\/index.jsp?categoryId=2135336&fg=&ff=StorePrice&fv=00300000%7E-%7E00499999&fd=%243%2C000.00+-+%244%2C999.00&&fbc=1&fbn=StorePrice|$3,000.00 - $4,999.00\"}]}]},{\"name\":\"Collections\",\"href\":\"\/category\/index.jsp?categoryId=13337273\",\"subs\":[{\"name\":\"EXCLUSIVE COLLECTIONS\",\"subs\":[{\"name\":\"Vera Wang LOVE\",\"href\":\"\/category\/index.jsp?categoryId=12134615&cp=13337273\"},{\"name\":\"Celebration Diamond\",\"href\":\"\/category\/index.jsp?categoryId=3280798&cp=13337273\"},{\"name\":\"Candy Colored Diamonds\",\"href\":\"\/family\/index.jsp?categoryId=16037176&cp=13337273\"},{\"name\":\"The Heart Within\",\"href\":\"\/family\/index.jsp?categoryId=28474626&cp=13337273\"},{\"name\":\"Persona Beads\",\"href\":\"\/category\/index.jsp?categoryId=11526501&cp=13337273\"},{\"name\":\"Sirena\",\"href\":\"\/family\/index.jsp?categoryId=10796801&cp=13337273\"},{\"name\":\"Juno Lucina\",\"href\":\"\/family\/index.jsp?categoryId=23683356&cp=13337273\"},{\"name\":\"Effy\",\"href\":\"\/family\/index.jsp?categoryId=16142996&cp=13337273\"},{\"name\":\"Past Present Future\",\"href\":\"\/family\/index.jsp?categoryId=21355206&cp=13337273\"},{\"name\":\"AVA Nadri\",\"href\":\"\/family\/index.jsp?categoryId=16143546&cp=13337273\"},{\"name\":\"Arctic Brilliance\",\"href\":\"\/family\/index.jsp?categoryId=12361058&cp=13337273\"},{\"name\":\"TEENYTINY\",\"href\":\"\/family\/index.jsp?categoryId=24723826&cp=13337273\"},{\"name\":\"Shaquille O\'Neal\",\"href\":\"\/family\/index.jsp?categoryId=16143206&cp=13337273\"},{\"name\":\"ASPCA Collection\",\"href\":\"\/family\/index.jsp?categoryId=13264161&cp=13337273\"},{\"name\":\"Cherished Promise\",\"href\":\"\/family\/index.jsp?categoryId=4484537&cp=13337273\"},{\"name\":\"Honora\",\"href\":\"\/family\/index.jsp?categoryId=12277575&cp=13337273\"},{\"name\":\"Blue Lagoon by Mikimoto\",\"href\":\"\/family\/index.jsp?categoryId=3406963&cp=13337273\"},{\"name\":\"Triton\",\"href\":\"\/family\/index.jsp?categoryId=3900398&cp=13337273\"}]},{\"name\":\"ONLINE COLLECTIONS\",\"subs\":[{\"name\":\"Online Exclusives\",\"href\":\"\/family\/index.jsp?categoryId=3900663&cp=13337273\"},{\"name\":\"Infinity Collection\",\"href\":\"\/family\/index.jsp?categoryId=18115156&cp=13337273\"},{\"name\":\"Sideways Collection\",\"href\":\"\/family\/index.jsp?categoryId=24968006&cp=13337273\"},{\"name\":\"Platinaire\",\"href\":\"\/family\/index.jsp?categoryId=13085646&cp=13337273\"},{\"name\":\"J Goodman\",\"href\":\"\/family\/index.jsp?categoryId=3728715&cp=13337273\"},{\"name\":\"Edward Mirell\",\"href\":\"\/family\/index.jsp?categoryId=3341209&cp=13337273\"},{\"name\":\"Amore La Vita\",\"href\":\"\/family\/index.jsp?categoryId=4410526&cp=13337273\"},{\"name\":\"Hero Hearts\",\"href\":\"\/family\/index.jsp?categoryId=12277573&cp=13337273\"},{\"name\":\"Stackable Expressions\",\"href\":\"\/family\/index.jsp?categoryId=11855568&cp=13337273\"}]},{\"name\":\"POPULAR CATEGORIES\",\"subs\":[{\"name\":\"Brilliant Values\",\"href\":\"\/family\/index.jsp?categoryId=2549930&cp=13337273\"},{\"name\":\"New Arrivals\",\"href\":\"\/family\/index.jsp?categoryId=3103754&cp=13337273\"},{\"name\":\"Top Rated Products\",\"href\":\"\/family\/index.jsp?categoryId=3004464&cp=13337273\"},{\"name\":\"Promise Rings\",\"href\":\"\/family\/index.jsp?categoryId=2109181&cp=13337273\"},{\"name\":\"Right Hand Rings\",\"href\":\"\/family\/index.jsp?categoryId=11377285&cp=13337273\"},{\"name\":\"Colored Diamonds \",\"href\":\"\/category\/index.jsp?categoryId=4450768&cp=13337273\"},{\"name\":\"Silver & Diamonds\",\"href\":\"\/family\/index.jsp?categoryId=3373009&cp=13337273\"},{\"name\":\"Whimsical\",\"href\":\"\/family\/index.jsp?categoryId=3136118&cp=13337273\"},{\"name\":\"Birthstones\",\"href\":\"\/category\/index.jsp?categoryId=2251087&cp=13337273\"},{\"name\":\"Giftware\",\"href\":\"\/family\/index.jsp?categoryId=3611994&cp=13337273\"},{\"name\":\"Accessories\",\"href\":\"\/family\/index.jsp?categoryId=2261884&cp=13337273\"},{\"name\":\"Children\'s\",\"href\":\"\/shop\/index.jsp?categoryId=13340011&cp=13337273\"},{\"name\":\"Men\'s\",\"href\":\"\/shop\/index.jsp?categoryId=13340012&cp=13337273\"}]}]},{\"name\":\"Clearance\",\"href\":\"\/family\/index.jsp?categoryId=2059712\",\"subs\":[]}],\"template\":\"home\",\"layout\":\"default\",\"redirect\":\"\/\",\"pageUrl\":\"http:\/\/www.zales.com\/\",\"outlet\":{\"actions\":{},\"promos\":[{\"href\":\"\/category\/index.jsp?categoryId=13337244\",\"src\":\"http:\/\/ZALES.imageg.net\/cms_widgets\/21\/87\/2187548_assets\/Zales20131216H1a.jpg\"},{\"href\":\"\/category\/index.jsp?categoryId=13337244\",\"src\":\"http:\/\/ZALES.imageg.net\/cms_widgets\/21\/87\/2187548_assets\/Zales20131216H2.jpg\"}],\"carousel\":[],\"menu\":[{\"name\":\"Wedding\",\"href\":\"\/family\/index.jsp?categoryId=12614408\",\"subs\":[]},{\"name\":\"Rings\",\"href\":\"\/family\/index.jsp?categoryId=2073110\",\"subs\":[]},{\"name\":\"Necklaces\",\"href\":\"\/family\/index.jsp?categoryId=2073124\",\"subs\":[]},{\"name\":\"Earrings\",\"href\":\"\/family\/index.jsp?categoryId=2073109\",\"subs\":[]},{\"name\":\"Bracelets\",\"href\":\"\/family\/index.jsp?categoryId=2073123\",\"subs\":[]},{\"name\":\"Special Reserve\",\"href\":\"\/family\/index.jsp?categoryId=24605156\",\"subs\":[]},{\"name\":\"Clearance\",\"href\":\"\/family\/index.jsp?categoryId=3773429\",\"subs\":[]},{\"name\":\"Previously Owned\",\"href\":\"\/family\/index.jsp?categoryId=4218967\",\"subs\":[]}],\"template\":\"home\",\"layout\":\"outlet\",\"redirect\":\"\/category\/index.jsp?categoryId=3720530\",\"pageUrl\":\"http:\/\/www.zales.com\/category\/index.jsp?categoryId=3720530\"}},\"success\":true}")));
			//callback();
			initModel.fetch({
				success:function(){
					callback();
				}
			});
		});
	};
});