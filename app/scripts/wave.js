;(function(window, document, undefined) {
  'use strict';
  var wave = window.wave || (window.wave = {
    init: undefined,
    getSize: undefined
  });

  var that = wave;

  function getSize (parentNode){
    var width, height;
    width = parentNode.getBoundingClientRect().width;
    height= parentNode.getBoundingClientRect().height;
    return {width: Math.ceil(width), height: Math.ceil(height)};
  }

  //如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
  // var requestAnimFrame = (function(){
  //   return  window.requestAnimationFrame       ||
  //           window.webkitRequestAnimationFrame ||
  //           window.mozRequestAnimationFrame    ||
  //           function( callback ){
  //             window.setTimeout(callback, 1000 / 60);
  //           };
  // })();

  function initWave() {
    var ctx = that.ctx;
    var canvas = that.canvas;
    var waveColor = 'rgb(34, 165, 144)';
    ctx.beginPath();
    ctx.strokeStyle = waveColor;
    ctx.moveTo(0, 100);
    ctx.bezierCurveTo(0, 0, canvas.width, 0, canvas.width, 100);
    ctx.stroke();
  }

  function init(parentNode, canvas) {
    var ctx = canvas.getContext('2d');
    var fillColor = 'rgb(255, 255, 255)';
    var size = getSize(parentNode);
    that.canvas = canvas;
    that.ctx = ctx;
    canvas.width = size.width;
    canvas.height= size.height;
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, size.width, size.height);
  }

  wave.init = init;

  wave.initWave = initWave;


  // //初始角度为0
  // var step = 0;
  // //定义三条不同波浪的颜色
  // var lines = ['rgba(34,165,144, 0.2)',
  //                'rgba(34,165,144, 0.2)',
  //                'rgba(34,165,144, 0.2)'];
  // function loop(){
  //     ctx.clearRect(0,0,canvas.width,canvas.height);
  //     step++;
  //     //画3个不同颜色的矩形
  //     for(var j = lines.length - 1; j >= 0; j--) {
  //         ctx.fillStyle = lines[j];
  //         //每个矩形的角度都不同，每个之间相差45度
  //         var angle = (step+j*45)*Math.PI/180;
  //         var deltaHeight   = Math.sin(angle) * 50;
  //         var deltaHeightRight   = Math.cos(angle) * 50;
  //         ctx.beginPath();
  //         ctx.moveTo(0, canvas.height/2+deltaHeight);
  //         ctx.bezierCurveTo(canvas.width /2, canvas.height/2+deltaHeight-50, canvas.width / 2, canvas.height/2+deltaHeightRight-50, canvas.width, canvas.height/2+deltaHeightRight);
  //         ctx.lineTo(canvas.width, canvas.height);
  //         ctx.lineTo(0, canvas.height);
  //         ctx.lineTo(0, canvas.height/2+deltaHeight);
  //         ctx.closePath();
  //         ctx.fill();
  //     }
  //     window.requestAnimFrame(loop);
  // }
  // loop();
})(window, document);