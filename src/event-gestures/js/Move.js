// TODO: Better way to sniff 'n' switch touch support?

var EVENT = ("ontouchstart" in Y.config.win && !Y.UA.chrome) ? {
        start: "touchstart",
        move: "touchmove",
        end: "touchend"
    } : {
        start: "mousedown",
        move: "mousemove",
        end: "mouseup"
    },

    START = "start",
    MOVE = "move",
    END = "end",

    _MOVE_START_HANDLE = "_msh",
    _MOVE_HANDLE = "_mh",
    _MOVE_END_HANDLE = "_meh",

    _DEL_MOVE_START_HANDLE = "_dmsh",
    _DEL_MOVE_HANDLE = "_dmh",
    _DEL_MOVE_END_HANDLE = "_dmeh",

    _MOVE_START = "_ms",
    _MOVE = "_m",

    MIN_TIME = "minTime",
    MIN_DISTANCE = "minDistance",
    OWNER_DOCUMENT = "ownerDocument",

    NODE_TYPE = "nodeType",

    _defArgsProcessor = function(args, delegate) {
        var iExtra = (delegate) ? 4 : 3;
        return args[iExtra] ? Y.merge(args.splice(iExtra,1)[0]) : {};
    },

    _getRoot = function(node, subscriber) {
        return subscriber._extra.root || (node.get(NODE_TYPE) === 9) ? node : node.get(OWNER_DOCUMENT);
    },

    define = Y.Event.define;

define('gesturemovestart', {

    on: function (node, subscriber, ce) {

        subscriber[_MOVE_START_HANDLE] = node.on(EVENT[START], 
            this._onStart,
            this,
            node,
            subscriber,
            ce);

    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;
        
        subscriber[_DEL_MOVE_START_HANDLE] = node.delegate(EVENT[START],
            function(e) {
                se._onStart(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_START_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_START_HANDLE] = null;
        }

    },

    detach: function (node, subscriber, ce) {
        var startHandle = subscriber[_MOVE_START_HANDLE];

        if (startHandle) {
            startHandle.detach();
            subscriber[_MOVE_START_HANDLE] = null;
        }
    },

    processArgs : function(args, delegate) {
        var params = _defArgsProcessor(args, delegate);

        if (!(MIN_TIME in params)) {
            params[MIN_TIME] = this.MIN_TIME;
        }

        if (!(MIN_DISTANCE in params)) {
            params[MIN_DISTANCE] = this.MIN_DISTANCE;
        }

        return params;
    },

    _onStart : function(e, node, subscriber, ce, delegate) {

        e.preventDefault();

        if (delegate) {
            node = e.currentTarget;
        }

        var origE = e,
            params = subscriber._extra,
            start = true,
            minTime = params.minTime,
            minDistance = params.minDistance,
            button = params.button,
            root = _getRoot(node, subscriber),
            startXY;

        if (e.touches) {
            start = (e.touches.length === 1);
            e = e.touches[0];

            e.target = e.target || origE.target;
            e.currentTarget = e.currentTarget || origE.currentTarget;
        } else {
            start = (button === undefined) || (button = e.button);
        }

        Y.log("gesturemovestart: params = button:" + button + ", minTime = " + minTime + ", minDistance = " + minDistance, "event-gestures");

        if (start) {

            if (minTime === 0 || minDistance === 0) {
                Y.log("gesturemovestart: No minTime or minDistance.", "event-gestures");
                this._start(e, node, ce, params);
            } else {

                startXY = [e.pageX, e.pageY];

                if (minTime > 0) {

                    Y.log("gesturemovestart: minTime specified. Setup timer.", "event-gestures");
                    Y.log("gesturemovestart: initialTime for minTime = " + new Date().getTime(), "event-gestures");
            
                    params._ht = Y.later(minTime, this, this._start, [e, node, ce, params]);

                    params._hme = root.on(EVENT[END], Y.bind(function() {
                        this._cancel(params);
                    }, this));
                }

                if (minDistance > 0) {

                    Y.log("gesturemovestart: minDistance specified. Setup native mouse/touchmove listener to measure distance.", "event-gestures");
                    Y.log("gesturemovestart: initialXY for minDistance = " + startXY, "event-gestures");

                    params._hm = root.on(EVENT[MOVE], Y.bind(function(em) {
                        if (Math.abs(em.pageX - startXY[0]) > minDistance || Math.abs(em.pageY - startXY[1]) > minDistance) {
                            Y.log("gesturemovestart: minDistance hit.", "event-gestures");
                            this._start(e, node, ce, params);
                        }
                    }, this));
                }                        
            }
        }
    },

    _cancel : function(params) {
        if (params._ht) {
            params._ht.cancel();
            params._ht = null;
        }
        if (params._hme) {
            params._hme.detach();
            params._hme = null;
        }
        if (params._hm) {
            params._hm.detach();
            params._hm = null;
        }
    },

    _start : function(e, node, ce, params) {

        if (params) {
            this._cancel(params);
        }

        e.type = "gesturemovestart";

        Y.log("gesturemovestart: Firing start: " + new Date().getTime(), "event-gestures");

        node.setData(_MOVE_START, e);
        ce.fire(e);
    },

    MIN_TIME : 0,
    MIN_DISTANCE : 0
});

define('gesturemove', {

    on : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            moveHandle = root.on(EVENT[MOVE], 
                this._onMove,
                this,
                node,
                subscriber,
                ce);

        subscriber[_MOVE_HANDLE] = moveHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;

        subscriber[_DEL_MOVE_HANDLE] = node.delegate(EVENT[MOVE],
            function(e) {
                se._onMove(e, node, subscriber, ce, true);
            },
            filter);
    },

    detach : function (node, subscriber, ce) {
        var moveHandle = subscriber[_MOVE_HANDLE];

        if (moveHandle) {
            moveHandle.detach();
            subscriber[_MOVE_HANDLE] = null;
        }
    },
    
    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_HANDLE] = null;
        }

    },

    processArgs : _defArgsProcessor,

    _onMove : function(e, node, subscriber, ce, delegate) {

        if (delegate) {
            node = e.currentTarget;
        }

        var move = subscriber._extra.standAlone || node.getData(_MOVE_START),
            origE = e;

        Y.log("onMove:" + move,"event-gestures");

        if (move) {

            if (e.touches) {
                move = (e.touches.length === 1);
                e = e.touches[0];

                e.target = e.target || origE.target;
                e.currentTarget = e.currentTarget || origE.currentTarget;
            }

            if (move) {
                
                Y.log("onMove2:" + move,"event-gestures");

                origE.preventDefault();
                e.type = "gesturemove";
                ce.fire(e);
            }
        }
    }
});

define('gesturemoveend', {

    on : function (node, subscriber, ce) {

        var root = _getRoot(node, subscriber),

            endHandle = root.on(EVENT[END], 
                this._onEnd, 
                this,
                node,
                subscriber, 
                ce);

        subscriber[_MOVE_END_HANDLE] = endHandle;
    },

    delegate : function(node, subscriber, ce, filter) {

        var se = this;

        subscriber[_DEL_MOVE_END_HANDLE] = node.delegate(EVENT[END],
            function(e) {
                se._onEnd(e, node, subscriber, ce, true);
            },
            filter);
    },

    detachDelegate : function(node, subscriber, ce, filter) {
        var handle = subscriber[_DEL_MOVE_END_HANDLE];

        if (handle) {
            handle.detach();
            subscriber[_DEL_MOVE_END_HANDLE] = null;
        }

    },

    detach : function (node, subscriber, ce) {
        var endHandle = subscriber[_MOVE_END_HANDLE];
    
        if (endHandle) {
            endHandle.detach();
            subscriber[_MOVE_END_HANDLE] = null;
        }
    },

    processArgs : _defArgsProcessor,

    _onEnd : function(e, node, subscriber, ce, delegate) {

        if (delegate) {
            node = e.currentTarget;
        }

        var moveEnd = subscriber._extra.standAlone || node.getData(_MOVE) || node.getData(_MOVE_START),
            origE = e;

        if (moveEnd) {

            if (e.changedTouches) {
                if (e.changedTouches.length === 1) {
                    e = e.changedTouches[0];

                    e.target = e.target || origE.target;
                    e.currentTarget = e.currentTarget || origE.currentTarget;
                    
                } else {
                    moveEnd = false;
                }
            }

            if (moveEnd) {
                origE.preventDefault();

                e.type = "gesturemoveend";
                ce.fire(e);

                node.clearData(_MOVE_START);
                node.clearData(_MOVE);
            }
        }
    }
});