define(['lodash'],function(_){
	var SmartSpin = function(){};

	_.extend(SmartSpin.prototype,{
		createSpinner:function(el, options){
			options = options || {};

			var _this = this,
				$el = (_.isString(el)) ? $(el) : el,
				dataSpin = $el.data('spin'),
				dataOptions = {},
				$spinTarget = $el.children('.spin-target'),
				$container = $el.closest('.spin-container'),
				$altDataTarget = $container.find('.spin-target'),
				$target,color;

			// Get the options from the data-spin attr.
			if(dataSpin){
				_.each(dataSpin.split(';'), function(obj){
					var split = obj.split(':');
					dataOptions[split[0]] = split[1] || null;
				});
				if(dataSpin === 'overlay'){
					dataOptions.overlay = true;
					dataOptions.target = '#app-wrapper';
					dataOptions.size = "large";
				}
			}

			// Determine the actual target for our spinner
			if($spinTarget.length){
				$target = $spinTarget;
			}else if($altDataTarget.length){
				$target = $altDataTarget;
			}else if($container.length){
				$target = $container;
			}else if(dataOptions.target){
				$target = $(dataOptions.target);
			}else{
				$target = $el;
			}



			// We don't want more than one spinner in the element.
			if($target.children('.spinner').length){
				return;
			}





			// Determine the color of the spinner.
			if(dataOptions['color']){
				color = dataOptions['color'];
			}else if(options.color){
				color = options.color;
			}else{
				color = _this.colorSwitch($target);
			}

			// Check if we need to change the element's position.
			if($target.css('position') !== 'fixed' && $target.css('position') !== 'absolute' && $target.css('position') !== 'relative'){
				$target.css({'position':'relative'});
			}

			var opts = {
				lines: 7, // The number of lines to draw
				length: 2, // The length of each line
				width: 3, // The line thickness
				radius: 3, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: color, // #rgb or #rrggbb or array of colors
				speed: 1, // Rounds per second
				trail: 50, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spin-anim', // The CSS class to assign to the spinner
				zIndex: 2e9,
				position: 'absolute'  // element position
			};

			var presetSize = {
				tiny: { lines: 7, length: 2, width: 2, radius: 3 },
				small: { lines: 7, length: 4, width: 3, radius: 4 },
				medium: { lines: 8, length: 5, width: 3, radius: 5 },
				large: { lines: 10, length: 8, width: 4, radius: 8 }
			};

			_.extend(opts, options);

			if(dataOptions.size || options.size){
				_.extend(opts, presetSize[dataOptions.size || options.size]);
			}

			$target.append('<div class="spinner"></div>');

			if(dataOptions['overlay'] === null || dataOptions['overlay'] === "true" || options.overlay){
				$target.find('.spinner').css({background:_this.bgSwitch(color)});
			}

			var spinner = new Spinner(opts).spin();
			$target.find('.spinner').html(spinner.el);
			if(!$('#spinner-block-ui').length){
				$('body').append('<div id="spinner-block-ui"></div>');
			}

			return {};
		},
		colorSwitch: function (el) {
			var bgColor = $(el).css('color');
			return bgColor;
			/*var bgColor = $(el).css('background-color');
			 if(!bgColor || bgColor==='rgba(0, 0, 0, 0)'){
			 bgColor = $(el).parent().css('background-color');
			 }

			 if (bgColor !== 'rgba(0, 0, 0, 0)' && this.bgColorToNumber(bgColor) < 600) {//half is 382
			 return '#fff';
			 }
			 return '#000';*/
		},
		bgSwitch: function (color) {


			if (this.bgColorToNumber(color) < 382) {
				return 'rgba(255,255,255,0.5)';
			}
			return 'rgba(0, 0, 0, 0.2)';
		},
		/**
		 * this function returns an number from 0-765 on how much light is in the color (0 is black 765 white)
		 * @param color
		 * @returns integer 0-765
		 */
		bgColorToNumber: function (color) {

			if (color.indexOf('#') === 0) {
				var length = color.length,
					val = color.substr(1, length),
					splitVal = val.split("");
				if (length === 7) {
					//we have #ffffff format
					return parseInt(splitVal[0] + splitVal[1], 16) + parseInt(splitVal[2] + splitVal[3], 16) + parseInt(splitVal[4] + splitVal[5], 16);
				} else if (length === 4) {
					//we have #fff format
					return parseInt(splitVal[0] + splitVal[0], 16) + parseInt(splitVal[1] + splitVal[1], 16) + parseInt(splitVal[2] + splitVal[2], 16);
				}

			} else if (color.search("rgb") !== -1) {
				//bg = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(,\s*(\d+))?\)$/);
				var bg = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);//simpler then prev but no
				return Number(bg[1]) + Number(bg[2]) + Number(bg[3]);
			}

			return 765;//we where unable to calculate the color, set it to white

		}
	});

	return SmartSpin;
});