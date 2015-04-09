/* jshint devel:true */
;(function(window, document, undefined) {
  'use strict';
  var summer = window.summer || (window.summer = {}),
      that   = summer;
  that.views = {
    init: function() {
      var pageNode, size,
          views   = that.views,
          page    = window.location.hash,
          pageNum = parseInt(page.slice(1)),
          paint   = that.paint;
      pageNode = document.querySelector('.page' + pageNum);
      if(page === '') {
        window.location.hash = '1';
      }else{
        views.pageInit(pageNode);
      }
      size = views.getSize(pageNode);
      views.height = size.height;
      views.width = size.width;
      paint.init(pageNode, pageNum);
    },
    getSize: function(node) {
      var width = node.getBoundingClientRect().width,
          height= node.getBoundingClientRect().height;
      return {
        width : Math.ceil(width),
        height: Math.ceil(height)
      };
    },
    pageInit: function(pageNode) {
      var pages = document.querySelectorAll('.page'),
          currentPage = pageNode;
      for (var i = pages.length - 1; i >= 0; i--) {
        pages[i].style.display = 'none';
      }
      currentPage.style.display = 'block';
    },
    //针对屏幕尺寸改变的情况，重新计算宽高
    pageRepaint: function() {
      var views = that.views,
          paint = that.paint;
      paint.computedVal = {};
      views.init();
    },
    memberInit: function() {
      var memberNodes = document.querySelectorAll('.member'),
          memberNode  = memberNodes[0],
          size   = memberNode.getBoundingClientRect(),
          width  = size.width;
      for (var i = 0; i < memberNodes.length; i++) {
        memberNodes[i].style.height = width + 'px';
      }
    }
  };

  that.paint = {
    init: function(pageNode, pageNum) {
      var canvasNode = pageNode.getElementsByTagName('CANVAS')[0],
          views, paint, scale;
      if(canvasNode) {
        views = that.views;
        paint = that.paint;
        scale = window.devicePixelRatio;
        paint.scale = scale;
        canvasNode.width  = views.width * scale;
        canvasNode.height = views.height * scale;
        canvasNode.style.width = views.width + 'px';
        canvasNode.style.height= views.height + 'px';
        paint.drawPage(canvasNode, pageNum);
      }else {
        return;
      }
    },
    drawPage: function(canvasNode, pageNum) {
      var ctx = canvasNode.getContext('2d'),
          width = canvasNode.width,
          height= canvasNode.height,
          views = that.views;
      ctx.save();
      switch (pageNum) {
        case 1:

          break;
        case 2:
          drawPageTwo(ctx, width, height);
          break;
        case 3:
          drawPageThree(ctx, width, height);
          break;
        case 4:
          drawPageFour(ctx, width, height);
          break;
        case 5:
          drawPageFive(ctx, width, height);
          break;
        case 6:
          drawPageSix(ctx, width, height);
          break;
        case 7:
          views.memberInit();
          break;
      }
    },
    ctx : {},
    drawStack: function(context, style, drawFn) {
      var _context = that.paint.ctx[context] || (that.paint.ctx[context] = {}),
          stack = _context.stack || (_context.stack = []),
          drawList = _context.drawList || (_context.drawList = []);
      stack.push(style);
      drawList.push(drawFn);
    },
    applyDrawStack: function(context, ctx) {
      var ctxStack = context,
          tempStyle, tempDrawFn;
      for (var j = 0; j < ctxStack.drawList.length; j++) {
        tempDrawFn = ctxStack.drawList[j];
        tempStyle = ctxStack.stack[j];
        for(var key in tempStyle) {
          ctx[key] = tempStyle[key];
        }
        ctx.save();
        ctx.restore();
        tempDrawFn(ctx);
      }
    },
    worker: function(context, key, val) {
      var computedVal = that.paint.computedVal,
          _context = computedVal[context] || (computedVal[context] = {}),
          _val = _context[key];
      if(_val === undefined){
        _context[key] = val;
        return val;
      } else if(typeof(_val) === 'object' && _val.length) {
        if(val !== undefined){
          _context[key].push(val);
        }
        return _val;
      } else if(_val !== val){
        return false;
      } else{
        return val;
      }
    },
    computedVal: {}
  };

  function drawPageTwo(ctx, width, height) {
    var paint  = that.paint,
        drawStack = that.paint.drawStack,
        sectionWaveStyle = {fillStyle: '#359ED3', strokeStyle: '#359ED3'},
        ctxStack;
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page2', sectionWaveStyle, drawSectionWave);
    ctxStack = paint.ctx.page2;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawPageThree(ctx, width, height) {
    var paint = that.paint,
        drawStack = paint.drawStack,
        sectionWaveStyle = {fillStyle: '#BA6C9E', strokeStyle: '#BA6C9E'},
        ctxStack;
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page3', sectionWaveStyle, drawSectionWave);
    ctxStack = paint.ctx.page3;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawPageFour(ctx, width, height) {
    var paint  = that.paint,
        worker = paint.worker,
        sectionWaveStyle     = {fillStyle: '#A54989', strokeStyle: '#A54989'},
        sectionEngineerStyle = {fillStyle: '#0475BA', strokeStyle: '#0475BA'},
        sectionFrontendStyle = {fillStyle: '#359ED3', strokeStyle: '#359ED3'},
        sectionFilledStyle   = {fillStyle: '#A54989', strokeStyle: '#A54989'},
        sectionVisualStyle   = {fillStyle: '#BA6C9E', strokeStyle: '#BA6C9E'},
        sectionDesignStyle   = {fillStyle: '#C683B2', strokeStyle: '#C683B2'},
        drawStack = paint.drawStack,
        ctxStack;
    worker('page4', 'sectionDesignBegin', parseInt(height * 0.25));
    worker('page4', 'sectionDesignEnd', parseInt(height * 0.45));
    worker('page4', 'sectionVisualDesignerEnd', parseInt(height * 0.65));
    worker('page4', 'sectionFilledEnd', parseInt(height * 0.55));
    worker('page4', 'sectionEngineerLeftEnd', parseInt(height * 0.7));
    worker('page4', 'sectionEnginnerRightEnd', parseInt(height * 0.92));
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page4', sectionWaveStyle, drawSectionWave);
    drawStack('page4', sectionDesignStyle, drawSectionDesign);
    drawStack('page4', sectionVisualStyle, drawSectionVisual);
    drawStack('page4', sectionFilledStyle, drawSectionFilled);
    drawStack('page4', sectionFrontendStyle, drawSectionFrontend);
    drawStack('page4', sectionEngineerStyle, drawSectionEngineer);
    ctxStack = paint.ctx.page4;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawPageFive(ctx, width, height) {
    var paint = that.paint,
        worker= paint.worker,
        sectionWaveStyle = {fillStyle: '#0475BA', strokeStyle: '#0475BA'},
        lineStyle = {strokeStyle: '#0475BA', lineWidth: 4},
        drawStack = paint.drawStack,
        ctxStack;
    worker('page5', 'firstLineStart', parseInt(height * 0.4));
    worker('page5', 'firstLineEnd', parseInt(height * 0.42));
    worker('page5', 'secondLineStart', parseInt(height * 0.7));
    worker('page5', 'secondLineEnd', parseInt(height * 0.76));
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page5', lineStyle, drawPageFiveLine);
    drawStack('page5', sectionWaveStyle, drawSectionWave);
    ctxStack = paint.ctx.page5;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawPageSix(ctx, width, height) {
    var paint = that.paint,
        sectionWaveStyle = {fillStyle: '#15AD97', strokeStyle: '#15AD97'},
        drawStack = paint.drawStack,
        ctxStack;
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page6', sectionWaveStyle, drawSectionWave);
    ctxStack = paint.ctx.page6;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawSectionEngineer(ctx) {
    var height = ctx.canvas.height,
        width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page4;
    //绘制【工程师】区域背景
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, computedVal.sectionEnginnerRightEnd);
    ctx.lineTo(0, computedVal.sectionEngineerLeftEnd);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.fill();
  }

  function drawSectionFrontend(ctx) {
    var width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page4;
    //绘制【前端，后端，iOS，Android】区域背景
    ctx.beginPath();
    ctx.moveTo(0, computedVal.sectionEngineerLeftEnd);
    ctx.lineTo(width, computedVal.sectionEnginnerRightEnd);
    ctx.lineTo(width, computedVal.sectionFilledEnd);
    ctx.lineTo(0, computedVal.sectionVisualDesignerEnd);
    ctx.stroke();
    ctx.fill();
  }

  function drawSectionFilled(ctx) {
    var width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page4;
    //绘制填充部分
    ctx.beginPath();
    ctx.moveTo(0, computedVal.sectionVisualDesignerEnd);
    ctx.lineTo(width, computedVal.sectionFilledEnd);
    ctx.lineTo(width, computedVal.sectionDesignEnd);
    ctx.lineTo(0, computedVal.sectionVisualDesignerEnd);
    ctx.fill();
  }

  function drawSectionVisual(ctx) {
    var width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page4;
    //绘制【视觉设计师&交互设计师】区域的背景
    ctx.beginPath();
    ctx.moveTo(0, computedVal.sectionVisualDesignerEnd);
    ctx.lineTo(width, computedVal.sectionDesignEnd);
    ctx.lineTo(0, computedVal.sectionDesignBegin);
    ctx.lineTo(0, computedVal.sectionVisualDesignerEnd);
    ctx.stroke();
    ctx.fill();
  }

  function drawSectionDesign(ctx) {
    var width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page4;
    //绘制【设计师】区域的背景
    ctx.moveTo(0, 0);
    ctx.lineTo(0, computedVal.sectionDesignBegin);
    ctx.lineTo(width, computedVal.sectionDesignEnd);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fill();
  }

  function drawPageFiveLine(ctx) {
    var width = ctx.canvas.width,
        computedVal = that.paint.computedVal.page5;
    ctx.moveTo(0, computedVal.firstLineStart);
    ctx.lineTo(width, computedVal.firstLineEnd);
    ctx.moveTo(width, computedVal.secondLineStart);
    ctx.lineTo(0, computedVal.secondLineEnd);
    ctx.stroke();
  }

  function drawSectionWave(ctx) {
    var worker = that.paint.worker,
        computedVal = that.paint.computedVal,
        width = ctx.canvas.width,
        height= ctx.canvas.height,
        tempPoint,
        waveBegin,
        wavePoints;
    worker('wave', 'waveBegin', parseInt(height * 0.15));
    waveBegin = computedVal.wave.waveBegin;
    ctx.beginPath();
    ctx.moveTo(0, waveBegin);
    ctx.lineTo(0, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, waveBegin);
    wavePoints = worker('wave', 'wavePoints');
    if(wavePoints && wavePoints.length) {
      for (var i = 0; i < wavePoints.length; i++) {
        var x,y;
        tempPoint = wavePoints[i];
        x = tempPoint[0];
        y = tempPoint[1];
        ctx.lineTo(x, y);
      }
    }else {
      for(var _x = width; _x >= 0; _x--) {
        var _y = Math.sin(_x / 18) * 8 + waveBegin;
        tempPoint = [_x, _y];
        worker('wave', 'wavePoints', tempPoint);
        ctx.lineTo(_x, _y);
      }
    }
    ctx.stroke();
    ctx.fill();
  }

  // function setApplyButton(node) {
  //   var oldApplyNode = document.querySelector('.apply');
  // }


  window.onresize = function() {
    that.views.pageRepaint();
  };

  window.onload = function() {
    that.views.init();
  };
  window.onhashchange = function() {
    that.views.init();
  };
})(window, document);