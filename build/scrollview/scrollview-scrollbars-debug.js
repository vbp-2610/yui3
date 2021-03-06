YUI.add('scrollview-scrollbars', function(Y) {

/**
 * Adds support for scrollbars inside a scrollview
 *
 * @module scrollview
 * @submodule scrollbars-plugin
 */
 
var _classNames = Y.ScrollView.CLASS_NAMES,
    NATIVE_TRANSITIONS = Y.Transition.useNative;

/**
 * Scrollview plugin that adds scroll indicators to the scrollview
 *
 * @class ScrollbarsPlugin
 */
function ScrollbarsPlugin() {
    ScrollbarsPlugin.superclass.constructor.apply(this, arguments);
}

/**
 * The identity of the plugin
 *
 * @property ScrollbarsPlugin.NAME
 * @type String
 * @default 'scrollbars-plugin'
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.NAME = 'scrollbars-plugin';
    
/**
 * The plugin namespace property
 *
 * @property ScrollbarsPlugin.NS
 * @type String
 * @default 'scrollbars'
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.NS = 'scrollbars';

/**
 * Common HTML template for vertical/horizontal scrollbars
 *
 * @property ScrollbarsPlugin.SCROLLBAR_TEMPLATE
 * @type String
 * @static
 */
ScrollbarsPlugin.SCROLLBAR_TEMPLATE = [
    '<div>',
    '<span class="' + _classNames.child + ' ' + _classNames.top + '"></span>',
    '<span class="' + _classNames.child + ' ' + _classNames.middle + '"></span>',
    '<span class="' + _classNames.child + ' ' + _classNames.bottom + '"></span>',
    '</div>'
].join('');

/**
 * ATTRS for scrollbars plugin
 *
 * @property ScrollbarsPlugin.ATTRS
 * @type Object
 * @readOnly
 * @protected
 * @static
 */
ScrollbarsPlugin.ATTRS = {
    
    /**
     * Vertical scrollbar node
     *
     * @attribute verticalNode
     * @type Y.Node
     */
    verticalNode: {
		setter: '_setVerticalNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    },

    /**
     * Horizontal scrollbar node
     *
     * @attribute horizontalNode
     * @type Y.Node
     */
    horizontalNode: {
		setter: '_setHorizontalNode',
        value: Y.Node.create(ScrollbarsPlugin.SCROLLBAR_TEMPLATE)
    }
};

Y.namespace("Plugin").ScrollViewScrollbars = Y.extend(ScrollbarsPlugin, Y.Plugin.Base, {

    /**
     * Designated initializer
     *
     * @method initializer
     */    
    initializer: function() {
        this._host = this.get("host");
        
        this.afterHostMethod('_uiScrollY', this._update);
        this.afterHostMethod('_uiScrollX', this._update);
        this.afterHostMethod('_uiDimensionsChange', this._hostDimensionsChange);
        this.doAfter('scrollEnd', this.flash);
    },

    /**
     * Set up the DOM nodes for the scrollbars. This method is invoked whenver the
     * host's _uiDimensionsChange fires, giving us the opportunity to remove un-needed
     * scrollbars, as well as add one if necessary.
     *
     * @method _hostDimensionsChange
     * @protected
     */    
    _hostDimensionsChange: function() {
        var host = this._host,
            boundingBox = host.get('boundingBox'),

            verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            
            verticalNodeInDoc = verticalNode.inDoc(),
            horizontalNodeInDoc = horizontalNode.inDoc(),

            basic = (Y.UA.ie && Y.UA.ie <= 8) ? host.getClassName("scrollbar", "basic") : "";

        // Vertical
        if(host._scrollsVertical && !verticalNodeInDoc) {
            boundingBox.append(verticalNode);
            verticalNode.addClass(basic);
        } else if(!host._scrollsVertical && verticalNodeInDoc) {
            verticalNode.remove();
        }

        // Horizontal
        if(host._scrollsHorizontal && !horizontalNodeInDoc) {
            boundingBox.append(horizontalNode);
            horizontalNode.addClass(basic);
        } else if(!host._scrollsHorizontal && horizontalNodeInDoc) {
            horizontalNode.remove();
        }

        this._update();
        
        Y.later(500, this, 'flash', true);
    },
    
    /**
     * Position and resize the scroll bars according to the content size
     *
     * @method _update
     * @param currentPos {Number} The current scrollX or scrollY value (not used here, but passed by default from _uiScrollX/_uiScrollY)
     * @param duration {Number} Number of ms of animation (optional) - used when snapping to bounds
     * @param easing {String} Optional easing equation to use during the animation, if duration is set
     * @protected
     */
    _update: function(currentPos, duration, easing) {
        var host = this._host,
            cb = host.get('contentBox'),
            scrollSize = 0,
            scrollPos = 1,
            transform,
            transformX,
            transformY,
            transition,
            height = host.get('height'),
            width = host.get('width'),
            scrollHeight = host._scrollHeight || cb.get('scrollHeight'),
            scrollWidth = host._scrollWidth || cb.get('scrollWidth'),
            verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            currentX = host.get('scrollX') * -1,
            currentY = host.get('scrollY') * -1,
            node;

        if(!this._showingScrollBars) {
            this.show();
        }

        if(horizontalNode && scrollHeight <= height) {
            this.hide();
            return;
        }

        if(verticalNode) {
            scrollSize = Math.floor(height * (height/scrollHeight));
            scrollPos = Math.floor((currentY/(scrollHeight - height) ) * (height-scrollSize)) * -1;

            if(scrollSize > height) {
                scrollSize = 1;
            }

            if (NATIVE_TRANSITIONS) {
                transform = 'translate(0, '+scrollPos+'px)';
            } else {
                transformX = 0;
                transformY = scrollPos;
            }

            if(scrollPos > (height - scrollSize)) {
                scrollSize = scrollSize - (scrollPos - (height - scrollSize));
            }

            if(scrollPos < 0) {
                if (NATIVE_TRANSITIONS) {
                    transform = 'translate(0,0)';
                } else {
                    transformX = 0;
                    transformY = 0;
                }

                scrollSize = scrollSize + scrollPos;
            }

            duration = duration || 0;

            if(this.verticalScrollSize != (scrollSize-8)) {
                this.verticalScrollSize = (scrollSize-8);

                node = verticalNode.get('children').item(1);
                
                transition = {
                    duration : duration/1000                                
                };

                if(NATIVE_TRANSITIONS) {
                    transition.transform = 'translate(0,0) scaleY('+(scrollSize-8)+')';
                } else {
                    transition.top = 4;
                    //transition.right = 0;
                    transition.height = (scrollSize-8);
                }

                node.transition(transition);
            }

            transition = {
                duration : duration/1000
            };
             
            if (NATIVE_TRANSITIONS) {
                transition.transform = transform;
            } else {
                //transition.right = transformX;
                transition.top = transformY;
            }

            verticalNode.transition(transition);

            transition = {
                duration : duration/1000
            };

            if (NATIVE_TRANSITIONS) {
                transition.transform = 'translate(0,'+(scrollSize-10)+'px)'; 
            } else {
                //transition.right = 0;
                transition.top = scrollSize-4;
            }

            verticalNode.get('children').item(2).transition(transition);

        }

        if(horizontalNode) {

            scrollSize = Math.floor(width * (width/scrollWidth));
            scrollPos = Math.floor((currentX/(scrollWidth - width) ) * (width-scrollSize)) * -1;

            if(scrollSize > width) {
                scrollSize = 1;
            }

            if (NATIVE_TRANSITIONS) {
                transform = 'translate('+scrollPos+'px, 0)';
            } else {
                transformX = scrollPos;
                transformY = 0;
            }

            if(scrollPos > (width - scrollSize))
            {
                scrollSize = scrollSize - (scrollPos - (width - scrollSize));
            }

            if(scrollPos < 0)
            {
                if (NATIVE_TRANSITIONS) {
                    transform = 'translate(0,0)';
                } else {
                    transformX = 0;
                    transformY = 0;
                }

                scrollSize = scrollSize + scrollPos;
            }

            duration = duration || 0;

            if(this.horizontalScrollSize != (scrollSize-16)) {
                this.horizontalScrollSize = (scrollSize-16);

                node = horizontalNode.get('children').item(1);

                transition = {
                    duration : duration/1000                                
                };

                if(NATIVE_TRANSITIONS) {
                    transition.transform = 'translate(0,0) scaleX('+(scrollSize-16)+')';
                } else {
                    //transition.bottom = 0;
                    transition.left = 4;
                    transition.width = (scrollSize-16);
                }

                node.transition(transition);
            }

            transition = {
                duration : duration/1000
            };
             
            if (NATIVE_TRANSITIONS) {
                transition.transform = transform;
            } else {
                //transition.bottom = transformY;
                transition.left = transformX;
            }

            horizontalNode.transition(transition);

            transition = {
                duration : duration/1000
            };

            if (NATIVE_TRANSITIONS) {
                transition.transform = 'translate('+(scrollSize-12)+'px,0)'; 
            } else {
                //transition.bottom = 0;
                transition.left = scrollSize-12;
            }

            horizontalNode.get('children').item(2).transition(transition);
        }                
    },
    
    /**
     * Show the scroll bar indicators
     *
     * @method show
     * @param animated {Boolean} Whether or not to animate the showing 
     */
    show: function(animated) {
        this._show(true, animated);
    },

    /**
     * Hide the scroll bar indicators
     *
     * @method hide
     * @param animated {Boolean} Whether or not to animate the hiding
     */
    hide: function(animated) {
        this._show(false, animated);
    },

    /**
     * Hide/Show implementation method
     * 
     * @method _show
     * @param {Object} show
     * @param {Object} animated
     */
    _show : function(show, animated) {
        var verticalNode = this.get('verticalNode'),
            horizontalNode = this.get('horizontalNode'),
            transition = {
                duration : (animated) ? 0.6 : 0,
                opacity : (show) ? 1 : 0
            };

        this._showingScrollBars = show;

        if(this._flashTimer) {
            this._flashTimer.cancel();
        }

        if(verticalNode) {
            verticalNode.transition(transition);
        }

        if(horizontalNode) {
            horizontalNode.transition(transition);
        }
    },

    /**
     * Momentarily flash the scroll bars to indicate current scroll position
     *
     * @method flash
     */
    flash: function() {
        var shouldFlash = false,
            host = this._host;

        if(host._scrollsVertical && (host._scrollHeight > host.get('height'))) {
            shouldFlash = true;
        }

        if(host._scrollsHorizontal && (host._scrollWidth > this.get('host').get('width'))) {
            shouldFlash = true;
        }
        
        if(shouldFlash) {
            this.show(true);
            this._flashTimer = Y.later(800, this, 'hide', true);
        }
    },

    /**
     * Setter for the verticalNode ATTR
     *
     * @method _setVerticalNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setVerticalNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.vertical);
        }
        return node;
    },

    /**
     * Setter for the horizontalNode ATTR
     *
     * @method _setHorizontalNode
     * @param node {Y.Node} The Y.Node instance for the scrollbar
     * @protected
     */
    _setHorizontalNode: function(node) {
        node = Y.one(node);
        if(node) {
            node.addClass(_classNames.scrollbar);
            node.addClass(_classNames.horizontal);
        }
        return node;
    }

});


}, '@VERSION@' ,{skinnable:true, requires:['plugin']});
