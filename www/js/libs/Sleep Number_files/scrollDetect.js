define(['lodash'],function(_){

	return {
		autoClose: true,
		initialize: function(options){
			var _this = this,
				isInView = false;

			this.options = options;

			_.bindAll(this, 'scrollDetection');

			$(options.scrollEl).on('scroll.scrollDetect', _this.scrollDetection);

		},
		scrollDetection: function() {
			var options = this.options,
				isInViewCheck = this.isElementVisible(options);

			if(isInViewCheck){
				if(!isInView){
					isInView = true;
					options.callback && options.callback();
				}

			} else {
				isInView = false;
			}

		},
		isElementVisible: function(options) {
			var eap,
				el		 = options.inViewEl,
				rect     = el.getBoundingClientRect(),
				docEl    = document.documentElement,
				vWidth   = window.innerWidth || docEl.clientWidth,
				vHeight  = window.innerHeight || docEl.clientHeight,
				efp      = function (x, y) { return document.elementFromPoint(x, y); },
				contains = "contains" in el ? "contains" : "compareDocumentPosition",
				has      = contains == "contains" ? 1 : 0x10;

			// Return false if it's not in the viewport
			if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top - (options.scrollOffset)  > vHeight) {
				return false;
			} else {
				return true;
			}

			// NOTE: Not really needed for now
			// Return true if any of its four corners are visible
			/*
			 return (
			 (eap = efp(rect.left,  rect.top)) == el || el[contains](eap) == has
			 ||  (eap = efp(rect.right, rect.top)) == el || el[contains](eap) == has
			 ||  (eap = efp(rect.right, rect.bottom)) == el || el[contains](eap) == has
			 ||  (eap = efp(rect.left,  rect.bottom)) == el || el[contains](eap) == has
			 );
			 */
		},
		onClose: function(){
			$(this.options.scrollEl).off('scroll.scrollDetect', this.scrollDetection);
		}
	};
});