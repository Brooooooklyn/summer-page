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
  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame;
  })();

  that.requestAnimFrame = requestAnimFrame;

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

  that.getSize = getSize;

  that.init = init;

  that.initWave = initWave;

})(window, document);