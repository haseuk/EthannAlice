var currentPage = 0;

$(window).load(function(e){
  $(document).ready(function(e){

    if( $(".pageCnt").length > 0 ){
      pageInit();
    }


  });
});

function pageInit(){

  //index slide1

  var currentPage = 1;
  var slideCnt1_index = 0;
  var totalSlides1 = $('.slideCnt.n1 .swiper-slide').length;
  var mySwiper = new Swiper('.slideCnt.n1 .swiper-container',{
    autoplay : false,
    autoplayDisableOnInteraction : false,
    speed : 300,
    loop:true,
    grabCursor: true,
    paginationClickable: false,
    onInit : function(e){
      $('.slideCnt.n1 .btnL').bind('click', function(e){
        mySwiper.swipePrev()
        e.preventDefault()
      })
      $('.slideCnt.n1 .btnR').bind('click', function(e){
        //console.log(currentPage);
        mySwiper.swipeNext()
        e.preventDefault()
      })

      if ( getParameter("page") != undefined)
      {
        console.log()
        mySwiper.swipeTo(getParameter("page"), 0);
      }

    },
    onSlideChangeEnd : function(e){
      //console.log(e.activeIndex);
      currentPage = e.activeIndex;
      resize();
    }
  })




  function resize(){
    //return;
    $("html, body, .wrap, .content, .swiper-container, .pageCnt .swiper-slide").css({"height" : $(".pageCnt .swiper-slide:eq(" + currentPage + ") img").height()})
    console.log(currentPage);
    console.log($(".pageCnt .swiper-slide:eq(" + currentPage + ") img").height())
  }

  $(window).resize(function(e){
    resize();
  })

  setTimeout( function(){
    resize();
  }, 500);

  setTimeout( function(){
      $(window).scrollTop(1)
    }
    , 600 );

  $(".btnHome").bind("click", function(e){
    mySwiper.swipeTo(0, 10);
    e.preventDefault();
  });

  $(".mainPage a").bind("click", function(e){
    var targetP = $(this).attr("goto");
    mySwiper.swipeTo(targetP, 10);
    e.preventDefault();
  });


}


var getParameter = function (param) {
  var returnValue;
  var url = location.href;
  var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');
  for (var i = 0; i < parameters.length; i++) {
    var varName = parameters[i].split('=')[0];
    if (varName.toUpperCase() == param.toUpperCase()) {
      returnValue = parameters[i].split('=')[1];
      return decodeURIComponent(returnValue);
    }
  }
};
