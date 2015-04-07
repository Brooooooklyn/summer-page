/* jshint devel:true */
;(function(window, document, undefined) {
  'use strict';
  var summer = window.summer || (window.summer = {}),
      that = summer;
  that.views = {
    init: function() {
      var page  = document.querySelector('.page'),
          views = that.views,
          size  = views.getSize(page),
          width = size.width,
          height= size.height,
          page  = window.location.hash;
      views.height = height;
      views.width = width;
      if(page === "") {
        window.location.hash = '1';
      }else{
        views.pageInit(page);
      }
    },
    getSize: function(node) {
      var width = node.getBoundingClientRect().width,
          height= node.getBoundingClientRect().height;
      return {
        width : Math.ceil(width),
        height: Math.ceil(height)
      };
    },
    pageInit: function(page) {
      var page  = parseInt(page.slice(1)),
          pages = document.querySelectorAll('.page'),
          currentPage = document.querySelector('.page' + page);
      for (var i = pages.length - 1; i >= 0; i--) {
        pages[i].style.display = "none";
      };
      currentPage.style.display = "block";
    }
  };
  that.views.init();
  window.onhashchange = function() {
    that.views.init();
  }
})(window, document);