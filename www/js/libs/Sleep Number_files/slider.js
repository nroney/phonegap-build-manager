define([
	'lodash'
], function (_) {
	return {
		//template:{ 'tmplStaticSections':tmplStaticSections },
		//el:'#content',
		events: {
			'click a.slider-nav-link': 'navigateTo',
			'click a.next': 'slideNext',
			'click a.prev': 'slidePrev',
			'touchend ul': 'touchEnd',
			'touchmove ul': 'move',
			//ie10 events
			//'MSPointerMove ul': 'move',
			'click ul': 'click',
			//'MSPointerUp ul': 'touchEnd'
		},
		//when slides_per_page are zero we should set continuous=false , snapping kinda works but when we reach the end and try to go back it is messed up
		//also slides_per_page = 0,snap=false, the next buttons dont work correctly
		//when
		touchOffset: 0,
		initialized: false,
		imagesLoaded: function (callback) {
			var _this = this,
				$images = this.$el.find('li img'),
				total_images = $images.length,
				done = function(){
					_this.loadedImages++;
					if(_this.loadedImages>=total_images){
						callback.call(_this);
					}
				};
			if(total_images===0 ||  this.options.wait_for_images===false){
				callback.call(_this);
				return false;
			}
			_this.loadedImages = 0;
			_.each($images, function (img) {
				var image = new Image();
				image.onload = done;
				image.onerror = done;
				image.src = $(img).attr('src');
			});
			if (total_images === 0) {
				callback.call(_this);
			}
		},
		initialize: function (options) {
			var _this = this;

			//the reason we do not just do an undelegateEvents is that initialize is called before the delegateEvents
//			this.app.nextTick(function(){
//				if(!_this.imagesDoneLoading){
//					_this.undelegateEvents();
//				}
//			});
			this.options = _.extend({
				'autoClose':true,
				'autoResize':true,
				'interval': 0,				// Set to 0 for no timer
				'animate_speed': 300,
				'moveThreshold': 50,			// Set to 50 to avoid horrizontal moving issues with slide and with page scrolling (needs to be combined with preventDefault = false)
				'scrollThreshold': 50,			//this is for vertical scrolling and must be combined with preventDefault = false
				'swipeSpeed': 1,				// Speed needed for swipe to take effect
				'continuous': true,
				'wait_for_images': true,
				'slides_per_page': 1,			// null = as many fit (no snapping this way
				'snap': true,
				'touchslide': true,
				'preventDefault': false,			//this only has effect with touchslide true and it disables native scrolling
				'stopPropagation': true,		//this only has effect with touchslide true and it disables other scrolling such as iscroll,
				'customScrollable':false		//this is used together with scrollThreshold to scroll a container instead of the whole page if that is what is needed
				//callbacks
				//onInitialized
				//onChange
			}, options || {});
			this.cycle = [];
			this.autoClose = this.options.autoClose;

			//make sure we run the code after the images have been loaded
			this.imagesLoaded(function () {
				this.imagesDoneLoading = true;
				this.delegateEvents();
				this.$el.find('li').hide();
				var _this = this,
					$el = this.$el,
				//$wrapper = $el.children('.slider-container').length ?  $el.children('.slider-container') : $el,
					$wrapper = $el.find('.slider-container').length ?  $el.find('.slider-container') : $el,
					spp = this.options.slides_per_page,
					$container = $wrapper.children('ul'),
					$lis = $container.children('li'),
					item_total = $lis.length;
				_this.hasCssTranform = _this.cssTransformTest();
				_.bindAll(_this, 'updateSize', 'slideNext', 'translate');


				if (this.options.continuous) {
					//add first and last items to end/begining for the slide animation
					if (item_total > spp) {

						for (var i = 0; i < spp; i++) {

							$container.append($($lis[0 + i]).clone());
							$container.prepend($($lis[(item_total - 1) - i]).clone());
						}

						$lis = $container.children('li');

					}
				}

				$lis.css({
					'float': 'left'
				});



				//$el.css('overflow', 'hidden');
				$wrapper.css('overflow', 'hidden');


				this.$wrapper = $wrapper;
				this.$container = $container;
				this.position = 1;
				this.touchstart = false;
				this.scrollstart = false;
				this.total = item_total;
				this.$body = $('body');
				this.updateSize();
				this.updateSize();//this fixes the problem with the scrollbar showing after calculating (unless the new recalculation resizes the image to a point where scrollbars are no longer needed)


				this.setTimer();
				if(this.options.autoResize){
					$(window).on('resize', this.updateSize);
				}
				this.initialized = true;

				//ie10 support
				var touchTarget = this.$el[0];
				if (typeof touchTarget.style.msTouchAction !== 'undefined') {
					this.isIE = true;
					touchTarget.style.msTouchAction = "none";
				}

				this.onInitialized();
				this.showNav();



			});

		},

		showNav:function(){
			var $el = this.$el.find('.slider-nav');
			if($el.length){
				var html = '<ul>';
				for(var i = 1; i <= this.total; i++){
					html+='<li><a href="#" data-pos="'+i+'" class="'+(i===1 ? 'active ' : '')+'slider-nav-link">'+i+'</a></li>';
				}
				html +='</ul>';
				$el.html(html);
			}
		},
		navigateTo:function(e){
			if(!this.imagesDoneLoading){return;}
			var i = Number($(e.currentTarget).attr('data-pos'));

			this.slideTo(i,true);
			return false;
		},
		setPosition:function(position){
			// adding class 'active' to visible <li> element - Don / Kevin
			var $li = $('.slider-container > ul').children('li');
			$li.removeClass('active');
			$li.eq(position).addClass('active');

			var $links = $('.slider-nav-link');
			$links.removeClass('active');
			$links.eq(position-1).addClass('active');
			return false;
		},
		setTimer: function () {
			if (this.options.interval) {
				if (this.timerId) {
					clearInterval(this.timerId);
				}
				this.timerId = setInterval(this.slideNext, this.options.interval);
			}
		},
		move: function (e) {
			if(!this.imagesDoneLoading){return;}
			if (this.options.touchslide) {

				//var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				var touch = this.getTouch(e);

				if (this.options.preventDefault) {
					e.preventDefault();
				} else if (this.options.scrollThreshold > 0) {
					//this seems to throw a type error from our analytics (ios 7 only), since it is not vital to make slider work we wrap it in a try catch
					try{
						//this is the scrollThreshold code
						e.preventDefault();
						//the code here doesn't allow page scrolling unless you pass the scrollThreshold
						if (this.scrollstart === false) {
							this.scrollstart = touch.pageY;
						}


						var $body = this.options.customScrollable ? $(this.options.customScrollable) : this.$body;

						//the diff needs to take into account that the body is moving
						//console.log(touch.pageY)
						this.bodyStart = this.bodyStart ? this.bodyStart : $body.scrollTop();
						//we don't wont to calculate the diff for the body if we are not scrolling the body that is what the ternary is for
						var scrollDiff = touch.pageY - this.scrollstart + (this.options.customScrollable ? 0 :  this.bodyStart - this.$body.scrollTop()  );
						if (!this.scrollReady && (scrollDiff > this.options.scrollThreshold || scrollDiff < -this.options.scrollThreshold)) {
							this.scrollstart = touch.pageY;
							this.scrollReady = true;
							this.bodyStart = $body.scrollTop();
						} else if (this.scrollReady) {
							//manually scroll the page
							if(this.options.customScrollable){
								$body.scrollTop = this.bodyStart - scrollDiff;
							}else{
								window.scrollTo(0,this.bodyStart - scrollDiff);
							}

						}
					}catch(exception){

					}


				}

				if (this.options.stopPropagation) {
					e.stopPropagation();
				}

				clearInterval(this.timerId);//stop the timer while we are moving


				this.moving = true;//for ie so we disable any touchend events



				if (this.touchstart === false) {
					this.touchstart = touch.pageX;
				}
				var diff = (touch.pageX - this.touchstart) + this.touchOffset;

				//this is for speed caclulation for swipe
				if (this.cycle.length >= 2) {
					this.cycle.shift();
				}
				this.cycle.push({
					change: diff,
					time: Date.now()
				});

				if (!this.moveReady && (diff > this.options.moveThreshold || diff < -this.options.moveThreshold)) {
					this.moveReady = true;
					this.touchstart = touch.pageX;//reset touch start so it doesn't jump
				} else if (this.moveReady) {
					this.translate(this.position, false, diff);
				}


			}

		},
		touchEnd: function (e) {
			if(!this.imagesDoneLoading){return;}
			if (this.options.touchslide) {


				if (this.touchstart !== false) {//if not it was just a tap
					this.moveReady = false;
					this.scrollstart = false;
					this.scrollReady = false;
					this.bodyStart = false;

					e.preventDefault();
					if (this.options.stopPropagation) {
						e.stopPropagation();
					}

					var _this = this,
						$el = this.$el,
						sppOffset = this.options.continuous ? this.options.slides_per_page : 0,
						liWidth = this.itemWidth(),
						cycle = this.cycle,
						total = 0,
						time = 0,
						speed,
						swipeSpeed = this.options.swipeSpeed,
						pos = Math.round(this.options.currentPosition / liWidth) - sppOffset + 1;


					//calculate pixels/milisecond
					for (var i = 1; i < cycle.length; i++) {
						total += cycle[i].change;
					}
					time = cycle[cycle.length - 1].time - cycle[0].time;
					speed = total / time;
					if (speed > swipeSpeed) {
						pos = Math.floor(this.options.currentPosition / liWidth) - sppOffset + 1;
					} else if (speed < -swipeSpeed) {
						pos = Math.ceil(this.options.currentPosition / liWidth) - sppOffset + 1;
					}


					if (this.options.snap) {



						if (!this.options.continuous && !this.options.slides_per_page && this.options.currentPosition + $el.width() > (this.total - 0.5) * liWidth) {
							pos = this.total;
						}
						this.position = pos;
						this.translate(pos, true);


						//check if we are at a position out of bounds
						if (pos < 1 || pos > this.total) {
							this.position = pos < 1 ? this.total + pos : pos - this.total;
							//we need to wait though for the previous animation to be done...
							setTimeout(function () {
								_this.translate(_this.position, false);
							}, _this.options.animate_speed);

						}

						this.touchOffset = 0;
					} else {

						//var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
						var touch = this.getTouch(e);

						this.touchOffset += touch.pageX - this.touchstart;
						if (this.touchOffset > 0) {
							this.touchOffset = 0;
						} else if (this.touchOffset - $el.width() < -(liWidth * (this.total))) {

							this.touchOffset = -(liWidth * (this.total)) + $el.width();
						}

					}
					this.touchstart = false;



					this.setTimer();//reset the timer since we just moved manually
				}
				this.onChange();
			}

		},
		//this is a workaround for ie10 so it doesnt click when scrolling (this is only useful if we have bound
		// click events higher in the dom tree since we can prevent them from bubbling up)
		click: function () {
			if(!this.imagesDoneLoading){return;}
			//if we are sliding we want to prevent click events from firing in ie10 (the others dont fire a click event)
			if (this.moving === true && this.isIE) {
				this.moving = false;
				return false;
			}
			this.moving = false;

		},
		//ie10 support to get touch
		getTouch: function (e) {
			if (window.navigator.msPointerEnabled) {
				return e.originalEvent;
			} else {
				return (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]);
			}
		},
		updateSize: function () {
			var $el = this.$el,
				$container = this.$container,
				$lis = $container.children('li'),
				spp = this.options.slides_per_page,
				sppOffset = this.options.continuous ? spp : 0,
				item_width = this.itemWidth();

			if (this.options.slides_per_page) {
				$container.width(Math.ceil(((this.total + (2 * sppOffset))) * item_width));
				$lis.width(item_width);
				this.translate(this.position, false);
			} else {
				$container.width(item_width * this.total);
			}
			this.$el.find('li').show();
		},
		itemWidth: function () {

			if (!this.options.slides_per_page) {
				return this.$container.children('li').width();
			}
			return Math.floor(this.$wrapper.width() / this.options.slides_per_page);
		},
		translate: function (position, animate, diff) {
			var $el = this.$el,
				liWidth = this.itemWidth(),
				$container = this.$container,
				$lis = $container.children('li'),
				count = $lis.length,
				spp = this.options.slides_per_page,
				sppOffset = this.options.continuous ? spp : 0,
				speed = animate ? this.options.animate_speed + 'ms' : '0ms',
				move = ((liWidth * (position + sppOffset - 1)) - (diff ? diff : 0)),
				css = {};

			this.setPosition(position);

			//if the slides fit in the page we dont want to do any sliding
			if (count <= spp) {
				return;
			}

			if (move < 0) {
				if (!this.options.continuous) {
					move = 0;
				} else {
					this.touchstart = false;
					this.position = this.total - spp + 1;
					return this.translate(this.position, false, 0);
				}

			} else if (move > liWidth * (count - spp)) {
				if (!this.options.continuous) {
					move = liWidth * (count - spp);
				} else {
					this.touchstart = false;
					this.position = 1;
					return this.translate(1, false, 0);
				}

			}
			if (spp === 0 && (move + $el.width()) >= liWidth * count) {
				move = (liWidth * count) - $el.width();
			}

			this.options.currentPosition = move;

			if (this.hasCssTranform) {
				css["-" + this.cssPrefix + "-transform"] = 'translate3d(-' + move + 'px,0,0)';
				css["-" + this.cssPrefix + "-transition-duration"] = speed;
				css["-" + this.cssPrefix + "-backface-visibility"] = 'hidden';
				$container.css(css);
			} else {
				css["margin-left"] = -move;
				$container.css(css);
			}


		},
		//the slide methods will be used publicly
		slideNext: function () {
			if(!this.imagesDoneLoading){return;}
			if (!this.initialized || (!this.options.continuous && this.position >= (this.total - this.options.slides_per_page + 1))) {
				return false;
			}
			if (this.position < this.total) {
				this.position++;
				this.translate(this.position, true);
			} else {//we must go back to the begining
				//if the position is total+1 it means we where at the clone position so we must go to the begining + 1
				this.position = this.position === this.total + 1 ? 2 : 1;

				this.translate(this.position - 1, false);
				//then animate from the clone to the first item
				this.translate(this.position, true);
			}
			this.setTimer();//reset the timer since we just moved manually
			this.onChange();

			return false;
			//this.updateSize();
		},
		slidePrev: function () {
			if(!this.imagesDoneLoading){return;}
			if (!this.initialized || (!this.options.continuous && this.position <= 1)) {
				return false;
			}
			if (this.position > 1) {
				this.position--;
				this.translate(this.position, true);
			} else {//we must go to the end
				//if the position is zero it means we where at the clone position so we must go to the end minus 1
				this.position = this.position === 0 ? this.total - 1 : this.total;
				//move the slider to the next slide of our destination slide to animate properly
				this.translate(this.position + 1, false);
				//then animate from the clone to the last item
				this.translate(this.position, true);
			}
			this.setTimer();//reset the timer since we just moved manually
			this.onChange();
			return false;
		},
		slideTo: function (position, animate) {
			if (!this.initialized) {
				return false;
			}
			this.position = position;
			this.translate(position, animate);
			this.setTimer();
			this.onChange();
		},
		cssTransformTest: function () {
			var obj = document.createElement('div'),
				props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
			for (var i in props) {
				if (obj.style[props[i]] !== undefined) {
					this.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
					//slider.prop = "-" + slider.pfx + "-transform";
					return true;
				}
			}
			return false;
		},
		render: function () {

		},
		//callback handlers
		onChange: function () {
			if (this.options.onChange) {
				this.options.onChange(this, this.position);
			}
		},
		onInitialized: function () {
			if (this.options.onInitialized) {
				this.options.onInitialized(this);
			}
		},
		stop:function(){
			this.undelegateEvents();
			clearInterval(this.timerId);
		},
		start:function(){
			this.delegateEvents();
			this.setTimer();
		},
		/*
		 //this is now the default view cleaning behavior so there is no point in this
		 close:function(){
		 var _this = this;
		 _this.listenToOnce(_this.app,'controller.renderDone',function(){
		 _this.core.close.apply(_this);
		 });
		 },*/
		onClose: function (promise) {
			//console.log('on close firing');
			//things that need to be manually cleaned up
			this.stopListening();
			this.$el.empty();
			$(window).off('resize', this.updateSize);
			clearInterval(this.timerId);
		}
	};
});