(function ($) {
  var ease              = {
    cubicInOut: function (n) {
      return n < .5 ? 4 * n * n * n : .5 * Math.pow(2 * n - 2, 3) + 1
    }
  };
  var MenuShape         = function () {
    var t;

    function i(i) {
      t = this, this.elm = i, this.path = i.querySelectorAll("path"), this.numPoints = 4, this.duration = 800, this.delayPointsArray = [], this.delayPointsMax = 180, this.delayPerPath = 70, this.timeStart = Date.now(), this.isOpened = !1, this.isAnimating = !1
    }

    return i.prototype.toggle = function () {
      this.isAnimating = !0;
      for (var i = Math.random() * Math.PI * 2, e = 0; e < this.numPoints; e++) {
        var s                    = e / (this.numPoints - 1) * Math.PI * 2;
        this.delayPointsArray[e] = (Math.sin(s + i) + 1) / 2 * this.delayPointsMax
      }
      !1 === this.isOpened ? this.open() : (this.isOpened = !1, setTimeout(function () {
        t.close()
      }, 200))
    }, i.prototype.open = function () {
      this.isOpened = !0, this.elm.classList.add("is-opened"), this.timeStart = Date.now(), this.renderLoop()
    }, i.prototype.close = function () {
      this.isOpened = !1, this.elm.classList.remove("is-opened"), this.timeStart = Date.now(), this.renderLoop()
    }, i.prototype.updatePath = function (t) {
      for (var i = [], e = 0; e < this.numPoints; e++) {
        i[e] = 100 * ease.cubicInOut(Math.min(Math.max(t - this.delayPointsArray[e], 0) / this.duration, 1));
      }
      var s = "";
      s += this.isOpened ? "M 0 0 V " + i[0] + " " : "M 0 " + i[0] + " ";
      for (e = 0; e < this.numPoints - 1; e++) {
        var n = (e + 1) / (this.numPoints - 1) * 100,
            h = n - 1 / (this.numPoints - 1) * 100 / 2;
        s += "C " + h + " " + i[e] + " " + h + " " + i[e + 1] + " " + n + " " + i[e + 1] + " "
      }
      return s += this.isOpened ? "V 0 H 0" : "V 100 H 0"
    }, i.prototype.render = function () {
      if (this.isOpened) {
        for (var t = 0; t < this.path.length; t++) {
          this.path[t].setAttribute("d", this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * t)));
        }
      }
      else {
        for (t = 0; t < this.path.length; t++) {
          this.path[t].setAttribute("d", this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - t - 1))))
        }
      }
    }, i.prototype.renderLoop = function () {
      this.render(), Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax ? requestAnimationFrame(function () {
        t.renderLoop()
      }) : this.isAnimating = !1
    }, i
  }();
  var csspositionsticky = function () {
    var t = "position:", i = " -webkit- -moz- -o- -ms- ".split(" "),
        e                  = document.createElement("a").style;
    return e.cssText = t + i.join("sticky;" + t).slice(0, -t.length), -1 !== e.position.indexOf("sticky")
  }
  var isTouchCapable    = 'ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
  var matchmedia        = function (mq) {
    return window.matchMedia(mq).matches;
  };
  var lastScroll = 0;

  var freezeBody = function (toggle) {
    var $body = $("body");
    var canToggle = (toggle !== undefined) ? (toggle) : true;
    if (canToggle) {
      setTimeout(function () {
        lastScroll = $(window).scrollTop();
      },1000);
    }

    if (toggle !== undefined) {
      $body.toggleClass('blockScroll', !!canToggle);
    } else {
      $body.addClass('blockScroll');
    }
    if (!canToggle){
      $(window).scrollTop(lastScroll);
    }
  };

  var html           = $("html");
  var elmOverlay     = document.querySelector('.shape-overlays');
  var overlay        = new MenuShape(elmOverlay);
  window.menuOverlay = overlay;
  html.addClass(isTouchCapable ? 'no-hover touchevents' : 'has-hover no-touchevents');

  jQuery(document).ready(function () {

    $(".navToggle").on("click", function () {
      if (overlay.isAnimating) {
        return false;
      }
      overlay.toggle();
      if (overlay.isOpened === true) {
        setTimeout(function () {
          html.addClass('menu-opened');
        }, 500);

        $(window).trigger('menuOpened');
      }
      else {
        html.addClass('menu-outing');
        setTimeout(function () {
          html.removeClass('menu-opened menu-outing');
        }, 500);
        $(window).trigger('menuClosed');
      }

      html.removeClass('search-active');
    });

    var has_active = $(".menu--main > ul > li.in-active-trail");

    if (matchmedia('(max-width: 767px)')) {
      if (has_active.length === 0) {
        $(".menu--main > ul > li:last-child").addClass('opened');
      }
    }

    if (!isTouchCapable) {
      $(".m-item .hoverText").each(function () {
        var txt = $(this).data('hover-text');
        $(this).attr('data-hover-text', '').append('<div class="htxt">' + txt + '</div>');
      });
    }

    $(document).on("click", ".has-c > a", function (e) {

      if (isTouchCapable && matchmedia('(min-width: 768px)')) {
        if (!$(this).parent().hasClass('opened')) {
          e.preventDefault();
          $(this).parent().addClass('opened')
        }
        $(this).parent().siblings().removeClass('opened')
      }
      else if ($(e.target).is('.icn')) {
        var parent = $(this).parent();
        e.preventDefault();
        parent.siblings().removeClass('opened in-active-trail');

        if (parent.hasClass('in-active-trail')) {
          parent.removeClass('opened in-active-trail')
        }
        else {
          parent.toggleClass('opened')
        }
      }
    });


    if (!csspositionsticky) {

      var dif   = 64;
      var fixed = false;

      $(window).on("scroll", function () {

        if ($(this).scrollTop() >= dif) {
          if (!fixed) {
            fixed = true;
            html.addClass('hfixed');
          }
        }
        else {
          if (fixed) {
            fixed = false;
            html.removeClass('hfixed');
          }
        }

      });

    }

    $(document).on("click", ".toggleLang", function () {

      var $html = $("html");
      $html.removeClass('search-active');
      if ($html.hasClass('lang-active')) {
        $html.removeClass('lang-active');
        freezeBody(false);
      }
      else {
        $html.addClass('lang-active');
        freezeBody(true);
      }
      if (!window.Nutella.isMobile()) {
        $(window).scrollTop(0);
      }
    });

    if (matchmedia('(min-width: 768px)')){
      $(".has-image-menu .image.lazyload").each(function () {
        var img = $('img', this);
        $(this).css('background-image', 'url('+ img.data('src') +')');
        img.remove();
      });
    }else{
      $(".m-group .image.lazyload").each(function () {
        var img = $('img', this);
        $(this).css('background-image', 'url('+ img.data('src') +')');
        img.remove();
      });
    }

  });

})(jQuery);

