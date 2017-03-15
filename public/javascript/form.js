var appUrl = window.location.origin;

var form = $('.pic-form');

var createPic = function (event) {
  event.preventDefault();
  var post = $.post(appUrl + '/api/pics', $('.pic-form').serialize());
  post.done(function (data) {
    $('.pic-form__input').val('');
    picForm.toggleClass('form--hidden');
    var newPic = createPicElement(data);
    $('.grid').prepend(newPic);
    $('.grid').imagesLoaded(onProgress).masonry('prepended', newPic);
  });
}


form.submit(createPic);