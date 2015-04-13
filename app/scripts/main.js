/* jshint devel:true */
;(function(window, document, undefined) {
  'use strict';
  var summer = window.summer || (window.summer = {}),
      that   = summer,
      body   = document.body,
      _shadowEle = document.createElement('div');
  that.views = {
    init: function() {
      var pageNode, size,
          views   = that.views,
          page    = window.location.hash,
          pageNum = parseInt(page.slice(1)),
          paint   = that.paint;
      pageNode = document.querySelector('.page' + pageNum);
      if(page === '') {
        pageNum = 1;
        window.location.hash = 0;
      }else{
        views.pageInit(pageNode);
      }
      size = views.getSize(pageNode);
      if(!size) {
        return;
      }
      views.height = size.height;
      views.width = size.width;
      paint.init(pageNode, pageNum);
    },
    getSize: function(node) {
      var width, height;
      if(!node) {
        return;
      }
      width = node.getBoundingClientRect().width;
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
    pageOneInit: function() {
      var views = that.views,
          height= views.height,
          shoes = document.querySelector('.shoes');
      shoes.style.top = (119 / 200) * height - 50 + 'px';
    },
    memberInit: function() {
      var memberNodes = document.querySelectorAll('.member'),
          memberNode  = memberNodes[0],
          size   = memberNode.getBoundingClientRect(),
          width  = size.width,
          applyButton = memberNodes[4];
      for (var i = 0; i < memberNodes.length; i++) {
        memberNodes[i].style.height = width + 'px';
      }
      setApplyButton(applyButton, width);
    },
    /**
     * 需要预加载的内容放在这里
     * @type {Array}
     */
    resources: [
      '../images/page1_art_text.png',
      '../images/page1_shoes.png',
      '../images/page1_logo.png',
      '../images/page1_footer.jpg',
      '../images/page2_icon_t.png',
      '../images/page2_icon_location.png',
      '../images/page2_icon_people.png',
      '../images/page3_icon_t.png',
      '../images/page3_icon_talk.png',
      '../images/page3_icon_today.png',
      '../images/page4_ice_cream.png',
      '../images/page4_popsicle.png',
      '../images/page5_icon_umbrella.png',
      '../images/page5_icon_machine.png',
      '../images/page5_icon_boat.png',
      '../images/page6_icon_star.png',
      '../images/page6_icon_bulb.png',
      '../images/page6_icon_humburg.png',
      '../images/page6_icon_message.png',
      '../images/page6_icon_smile.png',
      '../images/page7_background.png',
      '../images/page7_logo.png'
    ],
    /**
     * 预加载方法，内部会判断当前页面的hash来判断是刷新页面还是初始化页面
     * 如果是刷新页面，则在定向到loading page之后load完资源然后返回之前的页面
     * 如果是初始化页面则跳转到第一页
     * @return {[type]}
     */
    loadResources: function() {
      var views = that.views,
          page, pageNum, tempImg, len, resources;
      resources = views.resources;

      page = window.location.hash;
      pageNum = page === '' ? 1 : parseInt(page.slice(1));

      views.resourcesCount = resources.length;

      if(views.resourcesLoaded !== views.resourcesCount) {
        window.location.hash = 0;
        len = views.resourcesCount;
        for (var i = len - 1; i >= 0; i--) {
          tempImg = new Image();
          tempImg.src = resources[i];
          eventHandler.addHandler(tempImg, 'load', function(){
            imgLoaded(len, pageNum);
          });
        }
      }else {
        return;
      }
    },
    resourcesLoaded: 0
  };


  that.paint = {
    /**
     * cavas的init方法，计算出页面宽高，并设置当前页面canvas节点的宽高
     * @param  pageNode {Node Object} 当前页面容器节点
     * @param  pageNum  {Int} 当前页码，用于决定初始化哪一个页面的canvas
     * @return {null}
     */
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
    /**
     * 类似于route的功能，根据传入的页码来调用分别对应各页的canvas绘制方法
     * @param  canvasNode {Node Object} canvas 节点对象
     * @param  pageNum    {Int} 页码
     * @return {null}
     * @todo 路由的功能需要提取为公共的方法而不是canvas绘图的方法
     *       这样设置会导致一个页面不包含canvas节点时无法在这里的路由中设置对应的页面初始化方法
     */
    drawPage: function(canvasNode, pageNum) {
      var ctx = canvasNode.getContext('2d'),
          width = canvasNode.width,
          height= canvasNode.height,
          views = that.views;
      ctx.save();
      switch (pageNum) {
        case 1:
          views.pageOneInit();
          drawPageOne(ctx, width, height);
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
    /**
     * ctx 保存着各个页面的canvas绘图样式上下文信息和绘图方法栈
     * @type {Object}
     */
    ctx : {},
    /**
     * 这个方法用来将方法参数中的canvas style和绘图方法压入ctx栈中，但是并不马上执行
     * 只有在需要绘图时调用applyDrawStack方法才会执行
     * 这样做的好处是可以让每次绘图单独使用自己的canvas样式，不会影响到后续的绘图。
     * 缺点是必须显式的对每次绘图进行样式设置，即使它的样式跟上一次绘图的样式一致
     * @param  context {String} 设置绘图方法与样式栈的上下文，页面单独使用的绘图方法设置为pagen
     * @param  style   {Object} 设置绘图的样式，其属性必须与canvasNode.getContext('2d')中属性同名
     * @param  drawFn  {Function} 绘图方法
     * @return {null}
     */
    drawStack: function(context, style, drawFn) {
      var _context = that.paint.ctx[context] || (that.paint.ctx[context] = {}),
          stack = _context.stack || (_context.stack = []),
          drawList = _context.drawList || (_context.drawList = []);
      stack.push(style);
      drawList.push(drawFn);
    },
    /**
     * 执行ctx栈中的绘图方法，并对相应的方法应用相应的样式
     * @param  context {String} page 页码
     * @param  ctx     {Canvas context Object} 当前canvas上下文
     * @return {null}
     */
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
    /**
     * worker是用来共享绘图数据的，是为了避免重复的计算
     * @param  context {String} 保存这些信息的上下文，pagen
     * @param  key     {String} key
     * @param  fn      {Function} 计算函数，已经取到值就不计算
     * @return {Number or Array}
     */
    worker: function(context, key, fn) {
      var computedVal = that.paint.computedVal,
          _context = computedVal[context] || (computedVal[context] = {}),
          _val = _context[key],
          val;
      if(_val === undefined){
        if(!fn) {
          return undefined;
        }
        val = fn();
        console.log(val);
        _context[key] = val;
        return val;
      } else if(typeof(_val) === 'object' && _val.length === 0) {
        val = fn();
        if(val !== undefined){
          _context[key].push(val);
        }
        return _val;
      } else{
        return undefined;
      }
    },
    computedVal: {}
  };

  function imgLoaded(len, page) {
    var views = that.views,
        pageNum;
    views.resourcesLoaded += 1;
    pageNum = page === 0 ? 1 : page;
    if(views.resourcesLoaded === len){
      resourcesCompleted(pageNum);
    }
  }

  function resourcesCompleted(pageNum) {
    var currentPageNode = document.querySelector('.page0');
    addClass(currentPageNode, 'fade');
    eventHandler.addHandler(currentPageNode, 'transitionend', function() {
      window.location.hash = pageNum;
    });
    eventHandler.addHandler(currentPageNode, 'webkitTransitionEnd', function() {
      window.location.hash = pageNum;
    });
  }

  function drawPageOne(ctx, width, height) {
    var paint              = that.paint,
        drawStack          = paint.drawStack,
        worker             = paint.worker,
        sectionTopStyle    = {fillStyle: '#37BFA8', strokeStyle: '#37BFA8'},
        sectionBottomStyle = {fillStyle: '#21A590', strokeStyle: '#21A590'},
        ctxStack;
    worker('page1', 'sectionTopBegin', function() {
      return parseInt(height * 0.45);
    });
    worker('page1', 'sectionTopEnd', function() {
      return parseInt(height * 0.6);
    });
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
    drawStack('page1', sectionTopStyle, drawPage1SectionTop);
    drawStack('page1', sectionBottomStyle, drawPage1SectionBottom);
    ctxStack = paint.ctx.page1;
    paint.applyDrawStack(ctxStack, ctx);
  }

  function drawPageTwo(ctx, width, height) {
    var paint  = that.paint,
        drawStack = paint.drawStack,
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
    worker('page4', 'sectionDesignBegin', function() {
      return parseInt(height * 0.25);
    });
    worker('page4', 'sectionDesignEnd', function(){
      return parseInt(height * 0.45);
    });
    worker('page4', 'sectionVisualDesignerEnd', function() {
      return parseInt(height * 0.65);
    });
    worker('page4', 'sectionFilledEnd', function() {
      return parseInt(height * 0.55);
    });
    worker('page4', 'sectionEngineerLeftEnd', function() {
      return parseInt(height * 0.7);
    });
    worker('page4', 'sectionEnginnerRightEnd', function() {
      return parseInt(height * 0.92);
    });
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
    worker('page5', 'firstLineStart', function(){
      return parseInt(height * 0.4);
    });
    worker('page5', 'firstLineEnd', function() {
      return parseInt(height * 0.42);
    });
    worker('page5', 'secondLineStart', function() {
      return parseInt(height * 0.7);
    });
    worker('page5', 'secondLineEnd', function() {
      return parseInt(height * 0.76);
    });
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

  function drawPage1SectionTop(ctx) {
    var width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page1;
    ctx.beginPath();
    ctx.moveTo(0, computedVal.sectionTopBegin);
    ctx.lineTo(width, computedVal.sectionTopEnd);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.fill();
  }

  function drawPage1SectionBottom(ctx) {
    var height = ctx.canvas.height,
        width  = ctx.canvas.width,
        computedVal = that.paint.computedVal.page1;
    ctx.beginPath();
    ctx.moveTo(0, computedVal.sectionTopBegin);
    ctx.lineTo(width, computedVal.sectionTopEnd);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.stroke();
    ctx.fill();
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
    worker('wave', 'waveBegin', function() {
      return parseInt(height * 0.15);
    });
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
        worker('wave', 'wavePoints', function() {
          return tempPoint;
        });
        ctx.lineTo(_x, _y);
      }
    }
    ctx.stroke();
    ctx.fill();
  }

  function setApplyButton(node, width) {
    var oldApplyNode   = document.querySelector('.apply'),
        applyChildNode1= document.createElement('SPAN'),
        applyChildNode2= document.createElement('SPAN'),
        applyTextNode1 = document.createTextNode('点击'),
        applyTextNode2 = document.createTextNode('申请'),
        tempNode       = document.createDocumentFragment(),
        childNodeHeight, parentHeight, margin, fontSize;
    removeChildren(oldApplyNode);
    removeClass(oldApplyNode, 'apply');
    applyChildNode1.appendChild(applyTextNode1);
    applyChildNode2.appendChild(applyTextNode2);
    tempNode.appendChild(applyChildNode1);
    tempNode.appendChild(applyChildNode2);
    node.appendChild(tempNode);
    addClass(node, 'apply');
    parentHeight = width;
    childNodeHeight = applyChildNode1.getBoundingClientRect().height;
    margin = (0.95 * parentHeight - childNodeHeight * 2) / 2;
    fontSize = parentHeight / 4;
    node.style.fontSize = fontSize + 'px';
    applyChildNode1.style.marginTop = margin + 'px';
  }

  function removeChildren(parentNode) {
    var childNodes, len;
    if(!parentNode) {
      return;
    }
    childNodes = parentNode.childNodes;
    if(!childNodes) {
      return;
    }
    len = childNodes.length;
    while(len > 0) {
      parentNode.removeChild(childNodes[0]);
      len = childNodes.length;
    }
  }


  var removeClass, addClass, inArray;

  (function() {
    var arr = [];
    if(arr.indexOf) {
      inArray = function(array, val) {
        var index = array.indexOf(val);
        if(index !== -1){
          return true;
        }else {
          return false;
        }
      };
    }else {
      inArray = function(array, val) {
        for(var i = 0; i < array.length; i ++) {
          if(array[i] === val){
            return true;
          }
        }
        return false;
      };
    }
  })();

  (function() {
    var node = _shadowEle;
    if(node.classList) {
      removeClass = function(element, className){
        if(!element) {
          return;
        }
        element.classList.remove(className);
      };
      addClass = function(element, className) {
        if(!element) {
          return;
        }
        element.classList.add(className);
      };
    }else {
      removeClass = function(element, className){
        if(!element) {
          return;
        }
        var classNames = element.className.split(/\s+/),
            position = -1,
            i, len;
        for(i = 0, len = classNames.length; i < len; i++) {
          if(classNames[i] === className) {
            position = i;
            break;
          }
        }
        classNames.splice(position, 1);
        element.className = classNames.join(' ');
      };
      addClass = function(element, className) {
        var classNames = element.className.split(/\s+/);
        if(inArray(classNames, className)) {
          return;
        }else {
          classNames.push(className);
        }
        element.className = classNames.join(' ');
      };
    }
  })();

  var eventHandler = {
    addHandler: undefined,
    removeHandler: undefined
  };

  eventHandler.addHandler = (function() {
    var ele = _shadowEle;
    if(ele.addEventListener) {
      return function(element , type , handler){
        element.addEventListener(type , handler , false);
      };
    }else if(ele.attachEvent) {
      return function(element , type , handler){
        element.attachEvent("on" + type , handler)
      };
    }else{
      return function(element , type , handler){
        element["on" + type] = handler;
      };
    };
  })();
  eventHandler.removeHandler = (function() {
    var ele = _shadowEle;
    if(ele.removeEventListener) {
      return function(element , type , handler) {
        element.removeEventListener(type , handler , false);
      };
    }else if(element.detachEvent) {
      return function(element , type , handler) {
        element.detachEvent("on" + type , handler);
      };
    }else{
      return function(element , type , handler) {
        element["on" + type] = null;
      };
    };
  })();

  that.views.loadResources();

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