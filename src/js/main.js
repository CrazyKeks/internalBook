$(document).ready(function () {

  booksLiderInit();
  reviewsListWIdthCalc();

  function booksLiderInit() {
    var item = $('.bookSlider__item');
    var itemWidth = $(item[0]).width();
    var count = item.length;
    var allItem = itemWidth * count;
    var block = $('.bookSlider');
    var blockWidth = $('.bookSlider').outerWidth(true);
    var maxItemBlock = Math.floor(blockWidth / itemWidth);

    if (blockWidth < allItem) {
      $('.bookSlider').slick({
        slidesToShow: maxItemBlock,
        infinite: false,
      });
    }

  }

  $('.burgerMenu').on('click', function () {
    $(this).toggleClass('active');

    if ($(this).hasClass('active')){
      bgPopup(true);
      $('.header').css('display', 'inline-block');
      setTimeout(function () {
        $('.header').css('left', '0');
      }, 200)
    } else {
      $('.header').css('left', '-270px');
      setTimeout(function () {
        $('.header').css('display', 'none');
      }, 200)
      bgPopup(false);
    }
  });


  $(document).on('click','.backgroundPopup', function () {
    bgPopup(false);
    $('.burgerMenu').removeClass('active');
    $('.header').css('left', '-270px');
    setTimeout(function () {
      $('.header').css('display', 'none');
    }, 200);
  });

  function bgPopup(status) {
    if (status) {
      var overflow = $('<div>').addClass('backgroundPopup');
      $('body').append(overflow);
    } else {
      $(document).find('.backgroundPopup').remove();
    }
  }

  $('.userEditPage__form').on('submit', function (e) {
    e.preventDefault();
    validateForm($(this));
  });

  $('.userEditPage__btnCansel').on('click', function () {
    location.reload()
  });

  function validateForm(context) {
    var validateType = ['emailValidate', 'newPassword', 'newPasswordCheck', 'otherValidate'];
    for (var i = 0; i<validateType.length; i++) {
      var searchInput = context.find('.' + validateType[i]);
      searchInput.each(function () {
        validateInput($(this), validateType[i]);
      })
    }
    if (context.find('.errorValidate').length == 0) {
      console.log('send ajax');
    } else {
      console.log("fail validate");
    }
  }

  function validateInput(context, type) {
    switch (type) {
      case 'emailValidate':
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var input = context.find('input');
        if (pattern.test(input.val())) {
          context.removeClass('errorValidate');
        } else {
          context.addClass('errorValidate');
        }
        break;
      case 'newPassword':
        var password = context.find('input');
        var searchNewPasswordCheck = context.closest('form').find('.newPasswordCheck');
        var passwordCheck = searchNewPasswordCheck.find('input');
        if (password.val() == '' || (password.val() == passwordCheck.val())) {
          context.removeClass('errorValidate');
        } else {
          context.addClass('errorValidate');
        }
        break;
      case 'newPasswordCheck':
        var checkPassword = context.find('input');
        var searchFirstPassword = context.closest('form').find('.newPassword');
        var prevPassword = searchFirstPassword.find('input');

        if ((checkPassword.val() == prevPassword.val()) || prevPassword.val() == '') {
          context.removeClass('errorValidate');
        } else {
          context.addClass('errorValidate');
        }
        break;
      case 'otherValidate':
        var input = context.find('input');
        var valueInput = input.val().replace(/\s+/g, '');
        if (valueInput != '') {
          context.removeClass('errorValidate');
        } else {
          context.addClass('errorValidate');
        }
        break;
    }
  }

  function reviewsListWIdthCalc() {
    var container = $('.reviewsList');
    var containerWidth = container.width();
    var countCard = 1;
    if ($(window).width() > 1200) {
      countCard = 3;
    }
    if($(window).width() < 1200 && $(window).width() > 768) {
      countCard = 2;
    }
    var widthItem = (containerWidth / countCard) - 30;
    container.removeAttr('style');
    container.attr('style', 'column-width:' + widthItem + 'px;');
  }


});


$(document).resize(function () {
  reviewsListWIdthCalc();
});