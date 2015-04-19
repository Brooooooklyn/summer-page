/* jshint devel:true */
;(function(window, document, undefined) {
  'use strict';
  var summer = window.summer || (window.summer = {}),
      that   = summer,
      _shadowEle = document.createElement('div'),
      animationNodes = document.querySelectorAll('.pre-animation'),
      tips  = document.querySelector('.tips');
  that.views = {
    init: function() {
      var pageNode, size, pageNum,
          views    = that.views,
          pageNodes= document.querySelectorAll('.page'),
          len      = pageNodes.length;
      views.pageNodes = pageNodes;
      views.pageInit();
      pageNum = views.pageNum;
      pageNode = views.pageNode;
      size = views.getSize(pageNode);
      if(!size) {
        return;
      }
      views.height = size.height;
      views.width = size.width;

      if((views.width / views.height) > 0.6) {
        var phoneCase = document.querySelector('.phone-case');
        phoneCase.classList.add('show-phone-background');
        views.isWidthView = true;
        views.width = 328;
        views.height = 576;
      }

      views.memberInit();

      for(var x = 0; x < len; x++) {
        eventHandler.addHandler(pageNodes[x], 'tap', function() {
          return false;
        });
      }

      eventHandler.addHandler(tips, 'click',
        that.animate.paging.call(null, pageNum)
      );

      views.loadResources();

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
    pageInit: function() {
      var pageNode, pageNodes,
          _page  = window.location.hash,
          page   = (_page === '') ? '#1' : _page,
          pageNum= parseInt(page.slice(1)),
          views  = that.views,
          paint  = that.paint;
      pageNode = document.querySelector('.page' + pageNum);
      if(pageNum >= 0 && pageNum <= 7) {
        pageNodes = views.pageNodes;
        if(!pageNodes) {
          return;
        }
        for(var x = 0; x < pageNodes.length; x ++) {
          pageNodes[x].style.display = 'none';
        }
        pageNode.style.display = 'block';
        views.pageNum = pageNum;
        views.pageNode = pageNode;
      }
      paint.init(pageNode, pageNum);
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
          shoes = document.querySelector('.shoes'),
          artText = document.querySelector('.art-text');
      shoes.style.top = (119 / 200) * height - 50 + 'px';
      artText.style.width = height * 0.3 + 'px';
      artText.style.height = height * 0.3 - 6 + 'px';
    },
    pageFourInit: function() {
      var views = that.views,
          height= views.height,
          popsicle = document.querySelector('.page4-popsicle'),
          icecream = document.querySelector('.page4-ice-cream'),
          popsicleSize = 0.55,
          icecreamSize = 0.575,
          nodeHeight = height * 0.14;
      popsicle.style.height = nodeHeight + 'px';
      popsicle.style.width  = nodeHeight * popsicleSize + 'px';
      icecream.style.height = nodeHeight = 'px';
      icecream.style.width  = nodeHeight * icecreamSize + 'px';
    },
    pageSixInit: function() {
      var views  = that.views,
          height = views.height,
          size   = height * 0.8,
          listItems = document.querySelectorAll('.page6-body .list-item'),
          nodeHeight = 0,
          node, margin;
      for(var x = 0; x < listItems.length; x ++) {
        node = listItems[x];
        nodeHeight += node.getBoundingClientRect().height;
      }
      margin = (size - nodeHeight) / 5;
      for(var i = 0; i < listItems.length; i ++){
        node = listItems[i];
        node.style.marginBottom = margin + 'px';
      }
    },
    memberInit: function() {
      var memberNodes = document.querySelectorAll('.member'),
          views       = that.views,
          width       = views.width * 0.22,
          tempNode;
      if(that.views.member) {
        return;
      }
      for (var i = 0; i < memberNodes.length; i++) {
        tempNode = memberNodes[i];
        tempNode.style.height = width + 'px';
        tempNode.style.width  = width + 'px';
      }
      that.views.memeber = true;
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
      '../images/page7_logo.png',
      '../images/page7-member-ziqiu.png',
      '../images/page7-member-zitian.png',
      '../images/page7-member-xuanxuan.png',
      '../images/page7-member-jay.png',
      '../images/page7-member-yaqian.png',
      '../images/page7-member-junyuan.png',
      '../images/page7-member-cunzhi.png',
      '../images/page7-member-yuhan.png'
    ],
    /**
     * 预加载方法，内部会判断当前页面的hash来判断是刷新页面还是初始化页面
     * 如果是刷新页面，则在定向到loading page之后load完资源然后返回之前的页面
     * 如果是初始化页面则跳转到第一页
     * @return {[type]}
     */
    loadResources: function() {
      var views = that.views,
          tempImg, len, resources;
      resources = views.resources;

      views.resourcesCount = resources.length;

      if(views.resourcesLoaded !== views.resourcesCount) {
        window.location.hash = 0;
        len = views.resourcesCount;
        for (var i = len - 1; i >= 0; i--) {
          tempImg = new Image();
          tempImg.src = resources[i];
          eventHandler.addHandler(tempImg, 'load', imgLoaded);
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
        paint.route(canvasNode, pageNum);
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
    route: function(canvasNode, pageNum) {
      var ctx = canvasNode.getContext('2d'),
          width = canvasNode.width,
          height= canvasNode.height,
          views = that.views,
          animateFn;
      animateFn = that.animate.page;
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
          views.pageFourInit();
          drawPageFour(ctx, width, height);
          break;
        case 5:
          drawPageFive(ctx, width, height);
          break;
        case 6:
          views.pageSixInit();
          drawPageSix(ctx, width, height);
          break;
        case 7:
          var applyButton = document.querySelector('.apply-button'),
              _width      = views.width * 0.22;
          setApplyButton(applyButton, _width);
          break;
      }
      if(pageNum === 1){
        setTimeout(function() {
          preparationAnimate();
          animateFn();
        }, 400);
      } else {
        preparationAnimate();
        animateFn();
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
      if(_val === undefined && fn && !fn.length){
        if(!fn) {
          return undefined;
        }
        val = fn();
        _context[key] = val;
        return val;
      } else if(typeof(_val) === 'object' && _val.length === 0) {
        val = fn;
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

  that.animate = {
    page: function() {
      var page, animateClass, arrayList;
      page = that.views.pageNum;
      animateClass = document.querySelectorAll('.page' + page + ' .pre-animation');
      if(animateClass.length === 0) {
        return;
      }
      arrayList = animatedSequence(animateClass);
      applyAnimationByTime(arrayList);
    },
    lock: false,
    paging: function() {
      return function() {
        var currentPage, nextPage, num;
        num = that.views.pageNum;
        if(num < 7) {
          tips.style.display = 'none';
          currentPage = document.querySelector('.page' + num);
          nextPage = document.querySelector('.page' + (num + 1));
          removeClass(currentPage, 'bounceInUp');
          addClass(currentPage, 'fadeOutUp animated');
          that.paint.init(nextPage, num + 1);
          nextPage.style.display = 'block';
          addClass(nextPage, 'bounceInUp animated');
          eventHandler.oneHandler(currentPage, 'webkitAnimationEnd animationend', function() {
            currentPage.style.display = 'none';
            window.location.hash = num + 1;
            removeClass(currentPage, 'fadeOutUp animated');
          });
        }else {
          return;
        }
      };
    }
  };

  function imgLoaded() {
    var views = that.views,
        page, pageNum, _pageNum, len;
    len = views.resourcesCount;
    views.resourcesLoaded += 1;
    if(views.resourcesLoaded === len){
      page = window.location.hash;
      pageNum = page === '' ? 1 : parseInt(page.slice(1));
      _pageNum = pageNum === 0 ? 1 : pageNum;
      resourcesCompleted(_pageNum);
    }
  }

  function resourcesCompleted(pageNum) {
    var currentPageNode = document.querySelector('.page0');
    setTimeout(function() {
      addClass(currentPageNode, 'fade');
    }, 600);
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
        worker('wave', 'wavePoints', tempPoint);
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

  function animatedSequence(animateClassList) {
    var x, len, ele, nextEle, arrayList, arrayNode, iteratorFn;
    len = animateClassList.length;
    arrayList = {length: 0};
    for(x = 0; x < len; x++) {
      ele = animateClassList[x];
      if(x < len - 1){
        nextEle = animateClassList[x + 1];
      } else if(x === len - 1){
        nextEle = null;
      }
      iteratorFn = animationEndBind.call(null, ele);
      arrayNode = arrayList[x] = {
        key: x,
        ele: ele,
        nextEle: nextEle,
        iteratorFn: iteratorFn
      };
      arrayList.length += 1;
    }
    return arrayList;
  }

  function applyAnimationBySequence(arrayList) {
    var x, len, firstEle, currentNode, nextNode;
    len = arrayList.length;
    firstEle = arrayList[0].ele;
    addClass(firstEle, 'animated');
    firstEle.style.visibility = 'visible';
    for(x = 0; x < len; x++) {
      currentNode = arrayList[x].ele;
      nextNode = arrayList[x].nextEle;
      arrayList[x].iteratorFn.call(null, currentNode, nextNode, x);
    }
  }

  function applyAnimationByTime(arrayList) {
    var x, len, firstEle, lastNode, currentNode, delay;
    len = arrayList.length;
    firstEle = arrayList[0].ele;
    addClass(firstEle, 'animated');
    firstEle.style.visibility = 'visible';
    delay = 100;
    for(x = 1; x < len; x++) {
      currentNode = arrayList[x].ele;
      setTimeout(animationDelayBind.call(null, currentNode) ,delay * x);
    }
    lastNode = arrayList[len - 1].ele;
    eventHandler.oneHandler(lastNode, 'webkitAnimationEnd animationend', function() {
      setTimeout(function() {
        var pageNum = that.views.pageNum,
            pageNode= that.views.pageNode;
        if(pageNum < 7) {
          tips.style.display = 'block';
          eventHandler.swipeUpHandler(pageNode,
            that.animate.paging.call(null, pageNum)
          );
        }
      }, 200);
    });
  }

  function animationDelayBind(currentNode) {
    return function() {
      currentNode.style.visibility = 'visible';
      addClass(currentNode, 'animated');
    };
  }

  function animationEndBind(_ele) {
    return function(ele, nextEle, position) {
      eventHandler.oneHandler(_ele, 'webkitAnimationEnd animationend',
        animationCallback.call(null, ele, nextEle, position)
      );
    };
  }

  function animationCallback (ele, nextEle, position) {
    return function() {
      var lock;
      if(position === 0){
        that.animate.lock = true;
      }
      lock = that.animate.lock;
      if(lock) {
        removeClass(ele, 'animated');
        if(nextEle) {
          that.animate.lock = true;
          nextEle.style.visibility = 'visible';
          addClass(nextEle, 'animated');
        }else {
          that.animate.lock = false;
          setTimeout(function() {
            tips.style.display = 'block';
          }, 500);
        }
      }else {
        setTimeout(function() {
          tips.style.display = 'block';
        }, 500);
      }
    };
  }

  function preparationAnimate() {
    var tempNode;
    tips.style.display = 'none';
    that.animate.lock = false;
    for (var i = animationNodes.length - 1; i >= 0; i--) {
      tempNode = animationNodes[i];
      tempNode.style.visibility = 'hidden';
    }
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
        var _classList, len;
        if(!element || !className) {
          return;
        }
        _classList = className.split(' ');
        len = _classList.length;
        if(len) {
          for(var x = len - 1; x >= 0; x--) {
            element.classList.remove(_classList[x]);
          }
        }else {
          element.classList.remove(className);
        }
      };
      addClass = function(element, className) {
        var _classList, len;
        if(!element || !className) {
          return;
        }
        _classList = className.split(' ');
        len = _classList.length;
        if(len){
          for(var x = len - 1; x >= 0; x--) {
            element.classList.add(_classList[x]);
          }
        }else {
          element.classList.add(className);
        }
      };
    }else {
      removeClass = function(element, className){
        if(!element || !className) {
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
        var classNames, _classList, len;
        if(!element || !className) {
          return;
        }
        classNames = element.className.split(/\s+/);
        _classList = className.split(' ');
        if(_classList.length) {
          len = _classList.length;
          for(var x = len - 1; x >= 0; x++) {
            if(inArray(classNames, _classList[x])) {
              return;
            }else {
              classNames.push(_classList[x]);
            }
          }
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
    var ele = _shadowEle,
        eventList, len;
    if(ele.addEventListener) {
      return function(element , type , handler){
        eventList = type.split(' ');
        len = eventList.length;
        if(len) {
          for(var x = len - 1; x >= 0; x--) {
            element.addEventListener(eventList[x], handler, false);
          }
        }else {
          element.addEventListener(type , handler , false);
        }
      };
    }else if(ele.attachEvent) {
      return function(element , type , handler){
        eventList = type.split(' ');
        len = eventList.length;
        if(len) {
          for(var x = len - 1; x >= 0; x--) {
            element.attachEvent('on' + eventList[x], handler);
          }
        }else {
          element.attachEvent('on' + type , handler);
        }
      };
    }else{
      return function(element , type , handler){
        eventList = type.split(' ');
        len = eventList.length;
        if(len) {
          for(var x = len - 1; x >= 0; x--) {
            element['on' + eventList[x]] = handler;
          }
        }else {
          element['on' + type] = handler;
        }
      };
    }
  })();
  eventHandler.removeHandler = (function() {
    var ele = _shadowEle;
    if(ele.removeEventListener) {
      return function(element , type , handler) {
        element.removeEventListener(type , handler , false);
      };
    }else if(ele.detachEvent) {
      return function(element , type , handler) {
        element.detachEvent('on' + type , handler);
      };
    }else{
      return function(element , type) {
        element['on' + type] = null;
      };
    }
  })();

  eventHandler.oneHandler = function(element, type, handler) {
    var addHandler = eventHandler.addHandler,
        removeHandler = eventHandler.removeHandler;
    addHandler(element, type, function() {
      handler();
      removeHandler(element, type);
    });
  };

  eventHandler.swipeUpHandler = function(element, handler) {
    var startY,
        dist,
        threshold = -70,
        allowedTime = 500,
        elapsedTime,
        startTime;

    element.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0];
        dist = 0;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    }, false);

    element.addEventListener('touchmove', function(e){
        e.preventDefault();
    }, false);

    element.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0];
        dist = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        var swipeBol = (elapsedTime <= allowedTime && dist <= threshold);
        if(swipeBol) {
          handler();
        }else {
          return false;
        }
        e.preventDefault();
    }, false);
  };

  that.animate.applyAnimationBySequence = applyAnimationBySequence;

  window.onresize = function() {
    that.views.pageRepaint();
  };

  window.onload = function() {
    window.location.hash = '0';
    that.views.init();
  };
  window.onhashchange = function() {
    that.views.pageInit();
  };

})(window, document);