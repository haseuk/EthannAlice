(function ($) {
  var iOS_check = !!navigator.platform && /iPad|iPhone|iPod|iPad Simulator|iPhone Simulator|iPod Simulatorss/.test(navigator.platform);

  $(window).ready(function () {
    var dir = $('html').attr('dir');
    var $this = this;
    $this._draggableInstance;
    $this._nav_panel = $('.bdi-local-activation-nav-panel-content');
    $this._menu = $('.bdi-local-activation-nav-panel-content > .bdi-local-activation-menu');
    $this._menuWrapper = $this._menu.parent();
    $this._menuItems = $this._menu.children();
    $this._menuWrapperWidth = 0;
    $this._menuWidth = $this._menu.width();
    $this._menuItemWidth = 0;
    $this._dirRTL = false;

    if (dir === 'rtl') {
      $this._dirRTL = true;
    }

    if(iOS_check) {
      $('body').addClass('mobile-ios');
    }

    // Mobile menu
    $this._navHeader = $('.bdi-local-activation-menu--main-wrapper');
    $this._navPanelToggle = $('.bdi-local-activation-nav-mobile-button.bdi-local-activation-nav-mobile-menu-button');
    $this._navPanelClose = $('.bdi-local-activation-nav-mobile-close-button');
    $this._navPanel = $('.bdi-local-activation-nav-panel');
    $this._buton_top = $('.bdi-local-activation-nav-panel').next('.bdi-local-activation-mobile-menu-button-top');
    $this._secondLevel = $('.bdi-local-activation-next-level');
    $this._tl = navPanelAnimation($this);

    footerLanguage();

    fixHeader();

    activeLink();

    $(window).resize(function () {
      fixHeader();

      if ($(window).width() >= 1024) {
        $('.bdi-local-activation-next-level').removeAttr('style');
        $('.bdi-local-activation-sub-menu-open').removeClass('sub-menu-open');
        $('.bdi-local-activation-nav-panel .main-footer').remove();
        $('.bdi-local-activation-nav-panel-content').css('left', '');

        handleWindowResize($this);
        initDraggable($this);
        handleVisiblity($this);
        secondLevelMenuLogos($this);
      }
      else {
        $('.bdi-local-activation-nav-panel-content').css({'width': ''});
        $('.bdi-local-activation-nav-panel-content .bdi-local-activation-menu').css({'width': '', 'transform': ''});
      }

      mobileMenu($this);
    });

    $this._progress = 0;

    setTimeout(function () {
      if ($(window).width() >= 1024) {
        handleWindowResize($this);
        initDraggable($this);
        handleVisiblity($this);
        secondLevelMenuLogos($this);
      }

      mobileMenu($this);
    }, 500);
  });

  var handleWindowResize = function ($this) {
    $this._menuWidth = $this._menu[0].offsetWidth;
    $this._menuWrapperWidth = $(window).width() - 180;
    $this._menuWrapper[0].style.width = $this._menuWrapperWidth + 'px';
    $this._menu[0].style.width = $this._menuWidth + 'px';

    if ($this._draggableInstance) {
      $this._draggableInstance.update();
    }
  };

  var initDraggable = function ($this) {
    // First level Menu
    if ($(window).width() < $this._menuWidth + 180) {
      $this._menuWrapper.removeClass('not-draggable');
      $this._menuWrapper.addClass('draggable');

      $this._draggableInstance = Draggable.create($this._menu, {
        type: 'x',
        bounds: $this._menuWrapper,
        edgeResistance: 1,
        dragClickables: true,
        onDrag: handleDrag.bind($this),
        onDragEnd: handleDragEnd.bind($this),
      })[0];
    }
    else {
      if ($this._draggableInstance) {
        $this._draggableInstance.disable();
        $this._menu[0].style.transform = 'none'
      }

      $this._menuWrapper.removeClass('draggable');
    }
  };

  var handleDrag = function () {
    if (this._draggableInstance.x >= this._draggableInstance.minX) {
      this._menuWrapper.addClass('js-scroll');
    }
    else {
      if (this._menuWrapper.hasClass('js-scroll')) {
        this._menuWrapper.removeClass('js-scroll');
      }
    }
  };

  var handleDragEnd = function () {
    var $this = this;

    secondLevelMenuFullWidth($this);
  };

  var handleVisiblity = function ($this) {
    var totalSpanActiveElement = 0;
    var activeElementFound = false;

    $this._menuItems.each(function () {
      if (!activeElementFound) {
        totalSpanActiveElement += $(this).outerWidth();
      }
      if ($(this).hasClass('bdi-local-activation-menu-item--active-trail')) {
        activeElementFound = true;
      }
    });

    if (totalSpanActiveElement > $this._menuWrapperWidth && activeElementFound) {
      var diffScroll = totalSpanActiveElement - $this._menuWrapperWidth;
      animateSlider($this, $this._menu, diffScroll, 0.7);
    }
  };

  var animateSlider = function ($this, item, x, duration) {
    if ($this._dirRTL) {
      x = ~x + 1;
    }

    TweenLite.to(item, duration, {
      x: -x,
      ease: Expo.easeOut,
    });
  };

  var fixHeader = function () {
    var didScroll = false;
    var lastScrollTop = 0;
    var delta = 5;
    var headerHeight = $('#header').outerHeight();

    $(window).on('scroll', function () {
      didScroll = true;
    });

    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    var hasScrolled = function () {
      var windowScroll = $(window).scrollTop();

      if (Math.abs(lastScrollTop - windowScroll) <= delta) {
        return;
      }

      if (windowScroll > lastScrollTop && windowScroll > headerHeight) {
        $('.main-header').removeClass('sticky').addClass('not-sticky')
      }
      else {
        if (windowScroll + $(window).height() < $(document).height()) {
          $('.main-header').removeClass('not-sticky').addClass('sticky')
        }
      }

      lastScrollTop = windowScroll;
    }
  };

  var navPanelAnimation = function ($this) {
    var MenuAnimation = new TimelineLite({
      paused: true
    });

    MenuAnimation.set($this._navPanel, {clearProps: 'x'});
    MenuAnimation.set($this._navPanelClose, {clearProps: 'x'});

    MenuAnimation.to($this._navPanel, .35, {
      ease: Expo.easeInOut,
      x: '0%',
    });

    MenuAnimation.to($this._navPanelToggle, .35, {
      x: $this._dirRTL ? '-100%' : '100%',
      ease: Expo.easeInOut
    }, '-=.35');

    MenuAnimation.to($this._navPanelClose, .35, {
      ease: Expo.easeInOut,
      x: '0%',
    }, '-=.35');

    return MenuAnimation;
  };

  var secondLevelMenuFullWidth = function ($this) {
    if ($(window).width() >= 1024) {
      $this._menuItems.each(function () {
        $(this).filter('.bdi-local-activation-show-full-width').children('.bdi-local-activation-next-level').each(function () {
          var current_position = $this._menu[0].getBoundingClientRect();
          if ($this._dirRTL) {
            if (current_position.left < 0) {
              $(this).css({
                'left': -current_position.left
              })
            }
          }
          else {
            if ($(window).width() != current_position.right) {
              $(this).css({
                'right': current_position.right - $(window).width()
              })
            }
          }
        });
      });
    }
  };

  var mobileMenu = function ($this) {
    $('.menu-item').removeClass('touched-link');

    if ($(window).width() < 1024) {
      var footer = $('#footer').clone();
      var other_footer = $('#footer').clone();
      if ($('#footer').length === 0) {
        $('.bdi-local-activation-nav-panel .bdi-local-activation-nav-panel-content').append(footer);
        $('.bdi-local-activation-nav-panel .bdi-local-activation-nav-panel-content .bdi-local-activation-next-level').append(other_footer);

        footerLanguage();
      }

      $this._menuItems.each(function () {
        $(this).not('.bdi-local-activation-show-full-width').children('.bdi-local-activation-next-level').each(function () {
          $(this).css({
            'left': '',
            'right': ''
          })
        });
      });
    }
    else {
      $('.bdi-local-activation-nav-panel').find('.bdi-local-activation-main-footer').remove();

      $this._menuItems.each(function () {
        $(this).not('.bdi-local-activation-show-full-width').children('.bdi-local-activation-next-level').each(function () {
          var current_position = $(this)[0].getBoundingClientRect();
          if ($this._dirRTL) {
            if (current_position.left < 0) {
              $(this).css({
                'left': '0',
                'right': 'auto'
              })
            }
          }
          else {
            if ($(window).width() < current_position.right) {
              $(this).css({
                'left': 'auto',
                'right': '0'
              })
            }
          }
        });
      });

      secondLevelMenuFullWidth($this);
    }

    firstLevelHolder($this);
    addEventListeners($this);
  };

  var addEventListeners = function ($this) {
    $this._navPanelToggle.on('click', handleMenuPanelToggleClick.bind($this, true));
    $this._navPanelClose.on('click', handleMenuPanelToggleClick.bind($this, false));

    $this._navPanel.scroll(function() {
      if ($(this).scrollTop() > 100) {
        $this._navHeader.addClass('button-to-top');
      }
      else {
        $this._navHeader.removeClass('button-to-top');
      }
    });

    $this._buton_top.on('click', function(e) {
      e.preventDefault();

      TweenLite.to($this._navPanel, .5, {
        scrollTo: 0,
      });

      return false;
    });
  };

  var handleMenuPanelToggleClick = function (isOpen) {
    if (isOpen) {
      $('body').addClass('mobile-menu-open');
      this._tl.play();
    }
    else {
      $('body').removeClass('mobile-menu-open');
      this._tl.reverse();
    }
  };

  var firstLevelHolder = function ($this) {
    $('.bdi-local-activation-first-level .bdi-local-activation-menu .bdi-local-activation-menu-item--expanded > a').on('touchstart', function (e) {
      if ($(window).width() >= 1024 && $(window).width() <= 1366) {
        $(this).parent().siblings().removeClass('touched-link');
        if ($(this).parent('.touched-link').length === 0) {
          e.preventDefault();
        }
        $(this).parent().addClass('touched-link');
      }
      else
        if ($(window).width() < 1024) {
          e.preventDefault();

          var $next_level = $(this).next('.bdi-local-activation-next-level');
          $(this).toggleClass('sub-menu-open');
          $next_level.toggleClass('sub-menu-open');
          toggleList($this, $this._nav_panel, $next_level);
          return false;
        }
        else {
          return true;
        }
    });

    $('.bdi-local-activation-nav-panel-content .bdi-local-activation-next-level .bdi-local-activation-service-back-link > a').on('click', function (e) {
      if ($(window).width() < 1024) {
        e.preventDefault();
        var $this_next_level = $(this).parents('.bdi-local-activation-next-level');
        $this_next_level.toggleClass('sub-menu-open');
        $this_next_level.prev().toggleClass('sub-menu-open');
        toggleList($this, $this._nav_panel, $this_next_level);
        return false;
      }
      else {
        return true;
      }
    });
  };

  var toggleList = function ($this, panel, element) {
    if (!element.hasClass('sub-menu-open')) {
      if ($this._dirRTL) {
        TweenLite.to(panel, .7, {
          right: '0%',
          ease: Expo.easeOut,
        });
      }
      else {
        TweenLite.to(panel, .5, {
          left: '0%',
          ease: Expo.easeOut,
        });
      }
      TweenLite.to(element, .7, {
        width: '0',
        ease: Expo.easeOut,
      });
    }
    else {
      if ($this._dirRTL) {
        TweenLite.to(panel, .7, {
          right: '-100%',
          ease: Expo.easeOut,
        });
      }
      else {
        TweenLite.to(panel, .7, {
          left: '-100%',
          ease: Expo.easeOut,
        });
      }
      TweenLite.to(element, .5, {
        width: '100vw',
        ease: Expo.easeOut,
      });
    }
  };

  var secondLevelMenuLogos = function ($this) {
    $('.bdi-local-activation-full-width-menu-wapper .bdi-local-activation-full-width-menu-wapper-inner', $this._menu).each(function () {
      var add_scroll = 0;
      var duration = .5;
      $('> .bdi-local-activation-menu', $(this)).each(function () {
        if ($(this).width() > $(this).parent().width()) {
          add_scroll = 1;
        }
      });
      if (add_scroll) {
        if ($this._dirRTL) {
          $(this).removeClass('flex-start');
          $(this).siblings('.bdi-local-activation-service-menu-left').css('left', '0');
          $(this).siblings('.bdi-local-activation-service-menu-right').css('right', '-110px');
          TweenLite.to($(this), duration, {
            scrollTo:{ x: 'max' }
          });
        }
        else {
          $(this).addClass('flex-start');
          $(this).siblings('.bdi-local-activation-service-menu-left').css('left', '-110px');
          $(this).siblings('.bdi-local-activation-service-menu-right').css('right', '0');
          TweenLite.to($(this), duration, {
            scrollTo:{ x: '0' }
          });
        }
      }
      else {
        $(this).removeClass('flex-start');
        $(this).siblings('.bdi-local-activation-service-menu-left').css('left', '-110px');
        $(this).siblings('.bdi-local-activation-service-menu-right').css('right', '-110px');
      }
    });

    $('.bdi-local-activation-full-width-menu-wapper .bdi-local-activation-menu-arrow', $this._menu).on('click', function (e) {
      var duration = .5;
      if ($(window).width() >= 1024) {
        $('.bdi-local-activation-full-width-menu-wapper-inner').css('overflow', 'scroll');

        var full_width_wrapper_inner = $(this).parent().siblings('.bdi-local-activation-full-width-menu-wapper-inner');
        if ($(this).parent().is('.bdi-local-activation-service-menu-left')) {
          TweenLite.to(full_width_wrapper_inner, duration, {
            scrollTo:{ x: '0' }
          });
          TweenLite.to($(this).parent(), duration, {
            left: '-110px'
          });
          TweenLite.to($(this).parent().siblings('.bdi-local-activation-service-menu-right'), duration, {
            right: '0'
          });
        }
        else {
          TweenLite.to(full_width_wrapper_inner, duration, {
            scrollTo:{ x: 'max' }
          });
          TweenLite.to($(this).parent(), duration, {
            right: '-110px'
          });
          TweenLite.to($(this).parent().siblings('.bdi-local-activation-service-menu-left'), duration, {
            left: '0'
          });
        }
        return false;
      }
      else {
        return true;
      }
    });

    $('.bdi-local-activation-kinder-submenu-display-image_full_width').on('mouseout', function (e) {
      $('.bdi-local-activation-full-width-menu-wapper-inner').css('overflow', 'hidden');
    });
  };

  var footerLanguage = function () {
    $('.bdi-local-activation-open-language').on('click', function () {
      $(this).next().toggleClass('is-opened')
    });
  };


  var activeLink = function () {
    $('.bdi-local-activation-menu--main a').each(function () {
      var isActive = 0;
      var matches = this.href.match(/\/[a-z]{2}\/[a-z]{2}\/([a-z]{2}\/([^\?\$\#]+))/);
      if (matches) {
        if (window.location.pathname.substr(7) === matches[1]) {
          isActive = 1;
        }
      }

      if (isActive) {
        $(this).addClass('is-active');
      }
    });
  };
})(jQuery);
