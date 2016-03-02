import Snap from 'snapsvg';
import {clone} from 'lodash';
import {createRandomRGB} from './helpers';

function createGrid(totalWidth, totalHeight, gridFactorWidth, gridFactorHeight) {
  let width = totalWidth/gridFactorWidth;
  let height = totalHeight/gridFactorHeight;
  let total = gridFactorHeight * gridFactorWidth;
  let shapes = [];

  for (let i = 0; i < total; i++) {
    if(i % gridFactorWidth !== 0) {
      let topleft     = [i*width, i*height];
    } else {

    }
    let topRight    = [topleft[0] + width, topleft[1]];
    let bottomLeft  = [topleft[0], topleft[1] + height];
    let bottomRight = [topleft[0] + width, topleft[1] + height];
    shapes.push([topleft, topRight, bottomRight, bottomLeft])
  }

  return shapes;
}

Snap.plugin( function( Snap, Element, Paper, global ) {
  Element.prototype.polyAnimate = function( destPoints, duration, easing, callback ) {
    var poly = this;
    Snap.animate( this.attr('points'), destPoints,
       function( val ){ poly.attr({ points: val }) }, duration, easing, callback)
    };
});

export const App = {
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

  updateValues(horizontals, verticals) {
    let newHoriz = clone(horizontals);
    let newVert = clone(verticals);

    for (let i = 1; i < (horizontals.length -1); i++) {
      let horizontal = horizontals[i];
      for (var j = 1; j < (horizontal.length -1); j++) {
        let factor = Math.random() < 0.5 ? -this.animationAmount : this.animationAmount;
        let randX = Math.floor(Math.random() * factor);
        let randY = Math.floor(Math.random() * factor);

        let x = horizontal[j][0] + randX;

        let y = horizontal[j][1] + randY;
        if(i === 6 && j === 6) {

        }
        newHoriz[i][j] = [x, y];
        newVert[j][i] = [x,y]
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
        stroke: createRandomRGB(0.75),
        strokeWidth: '1',
        fill: 'transparent'
      });
      vertLines.push(line);
    }

    for (let i = 0; i < verticals.length; i++) {
      let line = svg.polyline([].concat.apply([], verticals[i]));
      line.attr({
        id: `vertical${i}`,
        stroke: createRandomRGB(0.75),
        strokeWidth: '1',
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
    let horizontals = lines.horizLines;
    let verticals   = lines.vertLines;
    let newHoriz    = newLines.horizLines;
    let newVert     = newLines.vertLines;
    for (var i = 1; i < horizontals.length -1; i++) {
      verticals[i].polyAnimate([].concat.apply([], newHoriz[i]), 1000, mina.linear);
      horizontals[i].polyAnimate([].concat.apply([], newVert[i]), 1000, mina.linear);
    }
  },

  render(lines, horizontals, verticals) {
    let newLines = this.updateValues(horizontals, verticals);
    this.animateLines(this.lines, newLines);
  },

  init() {
    this.s = new Snap('#svg');
    console.log(window.innerWidth);
    let {horizontals, verticals} = this.createPoints(15,15,window.innerHeight,window.innerWidth);
    this.horizontals = horizontals;
    this.verticals = verticals;
    this.prevX = 0;
    this.animationAmount = 15;

    this.lines = this.drawLines(this.s, this.horizontals, this.verticals);

    let svgInt = setInterval(() => {
      this.render(this.lines, horizontals, verticals);
    }, 1000);

    window.stopAnimation = function() {
      clearInterval(svgInt);
    };


  }
}
