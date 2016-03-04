import Snap              from 'snapsvg';
import {clone, map}      from 'lodash';
import {createRandomRGB, isBetween} from './helpers';

Snap.plugin( function( Snap, Element, Paper, global ) {
  Element.prototype.polyAnimate = function( destPoints, duration, easing, callback ) {
    var poly = this;
    Snap.animate( this.attr('points'), destPoints,
       function( val ){ poly.attr({ points: val }) }, duration, easing, callback)
    };
});

export const App = {
  init() {
    this.maxWidth = window.innerWidth;
    this.maxHeight = window.innerHeight;
    let {horizontals, verticals} = this.createPoints(20,20,this.maxHeight,this.maxWidth);
    let svgInt;

    this.s                = new Snap('#svg');
    this.horizontals      = map(horizontals, clone);
    this.verticals        = map(verticals, clone);
    this.prevX            = 0;
    this.animationAmount  = 100;
    this.animationAmountX = 8;
    this.animationAmountY = 26;
    this.interval         = 5000;
    this.strokeWidth      = 1;
    this.lines            = this.drawLines(this.s, horizontals, verticals);

    this.render(this.lines, horizontals, verticals);
    svgInt = setInterval(() => {
      this.render(this.lines, horizontals, verticals);
    }, this.interval);

    window.stopAnimation = function() {
      clearInterval(svgInt);
    };
  },

  createPoints( horizontals, verticals, totalWidth, totalHeight) {
    let width = totalWidth/horizontals;
    let height = totalHeight/verticals;
    let points = [];
    let horizontalLines = [];
    let verticalLines = [];
    verticals += 1;
    horizontals += 1;
    for (let i = 0; i < horizontals; i++) {
      let line = [];
      for (let j = 0; j < verticals; j++) {
        line.push([i*height,j*width]);
      }
      horizontalLines.push(line);
    }
    for (let i = 0; i < verticals; i++) {
      let line = [];
      for (let j = 0; j < horizontals; j++) {
        line.push([j*height,i*width]);
      }
      verticalLines.push(line);
    }
    return {
      horizontals: horizontalLines,
      verticals: verticalLines,
    };
  },

  getNewValueInRange(current, min, max) {
    let factor = Math.floor(Math.random() < 0.5 ? -this.animationAmount : this.animationAmount);
    let newVal = current +  Math.floor(Math.random() * factor);

    if(isBetween(newVal, min, max)) {
      return newVal;
    } else {
      return this.getNewValueInRange(current, min, max);
    }
  },

  updateValues(horizontals, verticals) {
    // let newHoriz = map(horizontals, clone);
    // let newVert  = map(verticals, clone);
    let newHoriz = clone(horizontals);
    let newVert  = clone(verticals);

    for (let i = 1; i < (newHoriz.length -1); i++) {
      let horizontal = newHoriz[i];
      for (let j = 1; j < (horizontal.length -1); j++) {
        let x = this.getNewValueInRange(horizontal[j][0], 0 -this.animationAmount, this.maxWidth + this.animationAmount);
        let y = this.getNewValueInRange(horizontal[j][1], 0 -this.animationAmount, this.maxHeight + this.animationAmount);

        newHoriz[i][j] = [x, y];
        newVert[j][i] = [x,y];
      }
    }
    return {
      horizLines: newHoriz,
      vertLines: newVert
    }
  },

  drawLines(svg, horizontals, verticals){
    let vertLines = [];
    let horizLines = [];

    for (let i = 0; i < horizontals.length; i++) {
      let line = svg.polyline([].concat.apply([], horizontals[i]));
      line.attr({
        id: `horizontal${i}`,
        stroke: createRandomRGB(0.25),
        strokeWidth: this.strokeWidth,
        fill: 'transparent'
      });
      vertLines.push(line);
    }

    for (let i = 0; i < verticals.length; i++) {
      let line = svg.polyline([].concat.apply([], verticals[i]));
      line.attr({
        id: `vertical${i}`,
        stroke: createRandomRGB(0.25),
        strokeWidth: this.strokeWidth,
        fill: 'transparent'
      });
      horizLines.push(line);
    }

    return {
      vertLines: vertLines,
      horizLines: horizLines
    }
  },

  animateLines(lines, newLines) {
    let horizontalLines = lines.horizLines;
    let verticalLines   = lines.vertLines;
    let newHoriz        = newLines.horizLines;
    let newVert         = newLines.vertLines;

    for (let i = 1; i < horizontalLines.length -1; i++) {
      verticalLines[i].polyAnimate([].concat.apply([], newHoriz[i]), this.interval, mina.linear);
      horizontalLines[i].polyAnimate([].concat.apply([], newVert[i]), this.interval, mina.linear);
    }
  },

  render(lines, horizontals, verticals) {
    let newLines = this.updateValues(horizontals, verticals);
    this.animateLines(this.lines, newLines);
  }
}
