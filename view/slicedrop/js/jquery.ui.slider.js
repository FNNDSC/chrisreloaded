//
// http://stackoverflow.com/questions/5955343/drag-the-range-of-a-ui-input-range-slider/6095941#6095941
//
(function(jQuery, undefined) {

  jQuery
      .widget(
          "ui.dragslider",
          jQuery.ui.slider,
          {
            
            options: jQuery.extend({}, jQuery.ui.slider.prototype.options, {
              rangeDrag: false
            }),
            
            _create: function() {

              jQuery.ui.slider.prototype._create.apply(this, arguments);
              this._rangeCapture = false;
            },
            
            _mouseCapture: function(event) {

              var o = this.options;
              
              if (o.disabled) {
                return false;
              }
              
              if (event.target == this.range.get(0) && o.rangeDrag == true &&
                  o.range == true) {
                this._rangeCapture = true;
                this._rangeStart = null;
              } else {
                this._rangeCapture = false;
              }
              
              jQuery.ui.slider.prototype._mouseCapture.apply(this, arguments);
              
              if (this._rangeCapture == true) {
                this.handles.removeClass("ui-state-active").blur();
              }
              
              return true;
            },
            
            _mouseStop: function(event) {

              this._rangeStart = null;
              return jQuery.ui.slider.prototype._mouseStop.apply(this,
                  arguments);
            },
            
            _slide: function(event, index, newVal) {

              if (!this._rangeCapture) {
                return jQuery.ui.slider.prototype._slide.apply(this, arguments);
              }
              
              if (this._rangeStart == null) {
                this._rangeStart = newVal;
              }
              
              var oldValLeft = this.options.values[0], oldValRight = this.options.values[1], slideDist = newVal -
                  this._rangeStart, newValueLeft = oldValLeft + slideDist, newValueRight = oldValRight +
                  slideDist, allowed;
              
              if (this.options.values && this.options.values.length) {
                if (newValueRight > this._valueMax() && slideDist > 0) {
                  slideDist -= (newValueRight - this._valueMax());
                  newValueLeft = oldValLeft + slideDist;
                  newValueRight = oldValRight + slideDist;
                }
                
                if (newValueLeft < this._valueMin()) {
                  slideDist += (this._valueMin() - newValueLeft);
                  newValueLeft = oldValLeft + slideDist;
                  newValueRight = oldValRight + slideDist;
                }
                
                if (slideDist != 0) {
                  newValues = this.values();
                  newValues[0] = newValueLeft;
                  newValues[1] = newValueRight;
                  
                  // A slide can be canceled by returning false from the slide
                  // callback
                  allowed = this._trigger("slide", event, {
                    handle: this.handles[index],
                    value: slideDist,
                    values: newValues
                  });
                  
                  if (allowed !== false) {
                    this.values(0, newValueLeft, true);
                    this.values(1, newValueRight, true);
                  }
                  this._rangeStart = newVal;
                }
              }
              


            },
          

          /*
           * //only for testing purpose value: function(input) {
           * console.log("this is working!");
           * jQuery.ui.slider.prototype.value.apply(this,arguments); }
           */
          });
  
})(jQuery);
