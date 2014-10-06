
define([
	'lodash'
], function (_) {
	return {
		autoClose: false,
		preLoadScript:true,//if set to true this will load the script without an event firing
		src: '//s.btstatic.com/tag.js#site=J392Td4', // This will get loaded before any of these methods run.
		initialize: function () {
		},
		afterScriptLoaded: function () {
		},
		onClose: function () {
		}
	};
});