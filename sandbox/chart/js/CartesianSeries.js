Y.CartesianSeries = Y.Base.create("cartesianSeries", Y.Widget, [Y.Renderer], {
    /**
     * @private
     */
    _leftOrigin: null,

    /**
     * @private
     */
    _bottomOrigin: null,

    /**
     * @private
     */
    renderUI: function()
    {
        this._setCanvas();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis");
        if(xAxis)
        {
            xAxis.after("axisReady", Y.bind(this._xAxisChangeHandler, this));
            xAxis.after("axisUpdate", Y.bind(this._xAxisChangeHandler, this));
        }
        if(yAxis)
        {
            yAxis.after("axisReady", Y.bind(this._yAxisChangeHandler, this));
            yAxis.after("axisUpdate", Y.bind(this._yAxisChangeHandler, this));
        }
        this.after("xAxisChange", Y.bind(this.xAxisChangeHandler, this));
        this.after("yAxisChange", Y.bind(this.yAxisChangeHandler, this));
        this.after("stylesChange", Y.bind(this._updateHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this.draw();
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this.draw();
        }
    },

	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicartesianseries",
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	_xAxisChangeHandler: function(event)
	{
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	_yAxisChangeHandler: function(event)
	{
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight"),
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
            xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis"),
			xMax = xAxis.get("maximum"),
			xMin = xAxis.get("minimum"),
			yMax = yAxis.get("maximum"),
			yMin = yAxis.get("minimum"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			xData = xAxis.getDataByKey(xKey).concat(),
			yData = yAxis.getDataByKey(yKey).concat(),
			dataLength = xData.length, 	
            direction = this.get("direction"),
            i = 0;
        //Assuming a vertical graph has a range/category for its vertical axis.    
        if(direction === "vertical")
        {
            yData = yData.reverse();
        }
        this.get("graphic").setSize(w, h);
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding);
        this._bottomOrigin =  Math.round((dataHeight + topPadding) - (0 - yMin) * yScaleFactor);
        for (; i < dataLength; ++i) 
		{
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding));
			nextY = Math.round(((dataHeight + topPadding) - (yData[i] - yMin) * yScaleFactor));
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

	/**
	 * @private (override)
	 */
	draw: function()
    {
        var node = Y.Node.one(this._parentNode).get("parentNode"),
			w = node.get("offsetWidth"),
            h = node.get("offsetHeight");
        if  (!isNaN(w) && !isNaN(h) && w > 0 && h > 0)
		{
            this.setAreaData();
            this.drawSeries();
		}
	},
    
    /**
     * @private
     * @return {Object}
     * Creates an array of start, end and control points for splines. 
     */
    getCurveControlPoints: function(xcoords, ycoords) 
    {
		var outpoints = [],
            i = 1,
            l = xcoords.length - 1,
		    xvals = [],
		    yvals = [];
		
		
		// Too few points, need at least two
		if (l < 1) 
        {
			return null;
		} 
        
        outpoints[0] = {
            startx: xcoords[0], 
            starty: ycoords[0],
            endx: xcoords[1],
            endy: ycoords[1]
        };
        
		// Special case, the Bezier should be a straight line
        if (l === 1) 
        {
			outpoints[0].ctrlx1 = (2.0*xcoords[0] + xcoords[1])/3.0;  
			outpoints[0].ctrly2 = (2.0*ycoords[0] + ycoords[1])/3.0;
			outpoints[0].ctrlx2 = 2.0*outpoints[0].ctrlx1 - xcoords[0];
            outpoints[0].ctrly2 = 2.0*outpoints[0].ctrly1 - ycoords[0];
            return outpoints;
		}

		for (; i < l; ++i) 
        {
			outpoints.push({startx: Math.round(xcoords[i]), starty: Math.round(ycoords[i]), endx: Math.round(xcoords[i+1]), endy: Math.round(ycoords[i+1])});
			xvals[i] = 4.0 * xcoords[i] + 2*xcoords[i+1];
			yvals[i] = 4.0*ycoords[i] + 2*ycoords[i+1];
		}
		
		xvals[0] = xcoords[0] + (2.0 * xcoords[1]);
		xvals[l-1] = (8.0 * xcoords[l-1] + xcoords[l]) / 2.0;
		xvals = this.getControlPoints(xvals.concat());
        yvals[0] = ycoords[0] + (2.0 * ycoords[1]);
		yvals[l-1] = (8.0 * ycoords[l-1] + ycoords[l]) / 2.0;	
		yvals = this.getControlPoints(yvals.concat());
		
        for (i = 0; i < l; ++i) 
        {
			outpoints[i].ctrlx1 = Math.round(xvals[i]);
            outpoints[i].ctrly1 = Math.round(yvals[i]);
			
			if (i < l-1) 
            {
				outpoints[i].ctrlx2 = Math.round(2*xcoords[i+1] - xvals[i+1]);
                outpoints[i].ctrly2 = Math.round(2*ycoords[i+1] - yvals[i+1]);
			}
			else 
            {
				outpoints[i].ctrlx2 = Math.round((xcoords[l] + xvals[l-1])/2);
                outpoints[i].ctrly2 = Math.round((ycoords[l] + yvals[l-1])/2);
			}
		}
		
		return outpoints;	
	},

    /**
     * @private
     */
	getControlPoints: function(vals) 
    {
		var l = vals.length,
            x = [],
            tmp = [],
            b = 2.0,
            i = 1;
		x[0] = vals[0] / b;
		for (; i < l; ++i) 
        {
			tmp[i] = 1/b;
			b = (i < l-1 ? 4.0 : 3.5) - tmp[i];
			x[i] = (vals[i] - x[i-1]) / b;
		}
		
		for (i = 1; i < l; ++i) 
        {
			x[l-i-1] -= tmp[l-i] * x[l-i];
		}
		
		return x;
	},
   
    /**
     * @private
     * Adjusts coordinate values for stacked series.
     */
    _stackCoordinates: function() 
    {
        var direction = this.get("direction"),
            node = Y.Node.one(this._parentNode).get("parentNode"),
            h = node.get("offsetHeight"),
            order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            i = 0,
            len,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            prevXCoords,
            prevYCoords;
        if(order === 0)
        {
            return;
        }
        prevXCoords = seriesCollection[order - 1].get("xcoords").concat();
        prevYCoords = seriesCollection[order - 1].get("ycoords").concat();
        if(direction === "vertical")
        {
            len = prevXCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevXCoords[i]) && !isNaN(xcoords[i]))
                {
                    xcoords[i] += prevXCoords[i];
                }
            }
        }
        else
        {
            len = prevYCoords.length;
            for(; i < len; ++i)
            {
                if(!isNaN(prevYCoords[i]) && !isNaN(ycoords[i]))
                {
                    ycoords[i] = prevYCoords[i] - (h - ycoords[i]);
                }
            }
        }
    },

    /**
     * @private
     * Concatenates coordinate array with the correct coordinates for closing an area stack.
     */
    _getAllStackedCoordinates: function(coords)
    {
        var order = this.get("order"),
            type = this.get("type"),
            graph = this.get("graph"),
            direction = this.get("direction"),
            seriesCollection = graph.seriesTypes[type],
            prevCoords,
            allCoords = this.get(coords).concat(),
            first = allCoords[0];
        
        if(order > 0)
        {
            prevCoords = seriesCollection[order - 1].get(coords).concat();
            allCoords = allCoords.concat(prevCoords.concat().reverse());
            allCoords.push(allCoords[0]);
        }
        else
        {
            if(direction === "vertical")
            {
                if(coords === "xcoords")
                {
                    allCoords.push(this._leftOrigin);
                    allCoords.push(this._leftOrigin);
                }
                else
                {
                    allCoords.push(allCoords[allCoords.length-1]);
                    allCoords.push(first);
                }
            }
            else
            {
                if(coords === "xcoords")
                {
                    allCoords.push(allCoords[allCoords.length-1]);
                    allCoords.push(first);
                }
                else
                {
                    allCoords.push(this._bottomOrigin);
                    allCoords.push(this._bottomOrigin);
                }
            }
        }
        return allCoords;
    },

    /**
     * @private
     * @return Default styles for the widget
     */
    _getDefaultStyles: function()
    {
        return {padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }};
    }
}, {
ATTRS: {

	type: {		
  	    value: "cartesian"
    },
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
	    value:NaN
    },
	/**
	 * x coordinates for the series.
	 */
	xcoords: {
        value: null
	},
	/**
	 * y coordinates for the series
	 */
	ycoords: {
        value: null
	},
	graph: {
        value: null
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	xAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("xAxis");
		},
		
        lazyAdd: false
	},
	
	yAxis: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("yAxis");
		},
		
        lazyAdd: false
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the x-axis <code>Axis</code> instance.
	 */
	xKey: {
        value: null,

		validator: function(value)
		{
			return value !== this.get("xKey");
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the y-axis <code>Axis</code> instance.
	 */
	yKey: {
		value: null,

        validator: function(value)
		{
			return value !== this.get("yKey");
		}
	},

    direction: {
        value: "horizontal"
    }
}
});

