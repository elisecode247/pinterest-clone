var appUrl = window.location.origin;

var form = $('.pic-form');

var createPic = function (event) {
  event.preventDefault();
  var post = $.post(appUrl + '/api/pics', $('.pic-form').serialize());
  post.done(function (data) {
    $('.pic-form__input').val('');
    picForm.toggleClass('form--hidden');
    var newPic = createPicElement(data);
    $('.grid').append(newPic);
    $('.grid').imagesLoaded().progress(onProgress).fail(function () {
      console.log('all images loaded, at least one is broken');
    }).always(function(){
      $('.grid').masonry('layout');
    })
     $('.grid').masonry('prepended',newPic, true);
     
  });
}


form.submit(createPic);