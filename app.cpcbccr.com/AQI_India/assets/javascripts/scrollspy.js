$(function () {
  var offset = 50;

  $("#navbar-id ul li a[href^='#']").on('click', function(e) {

    // prevent default anchor click behavior
    e.preventDefault();

    // store hash
    var hash = this.hash;

    // animate
    $('html, body').animate({
      scrollTop: $(this.hash).offset().top - offset
    }, 300, function(){

      // when done, add hash to url
      // (default click behaviour)
      //window.location.hash = hash;
    });

    return false;

  });

});
