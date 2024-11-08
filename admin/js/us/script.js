// Page Loader : hide loader when all are loaded
$(window).load(function () {
  "use strict";
  $(".wavy-wraper").addClass("hidden");
});

jQuery(document).ready(function ($) {
  "use strict";

  $("[type = submit]").click(function () {
    var post = $("textarea").val();
    $("<p class='post'>" + post + "</p>").appendTo("section");
  });

  // show comments
  $(".comment").on("click", function () {
    $(this).parents(".post-meta").siblings(".coment-area").slideToggle("slow");
  });

  // comments popup
  jQuery(window).on("load", function () {
    $(".show-comt").bind("click", function () {
      $(".pit-comet-wraper").addClass("active");
    });
  });
  // comments popup
  $(".add-pitrest > a, .pitred-links > .main-btn, .create-pst").on(
    "click",
    function () {
      $(".popup-wraper").addClass("active");
      return false;
    }
  );

  // share post popup
  $(".share-pst").on("click", function () {
    $(".popup-wraper2").addClass("active");
    return false;
  });
  $(".popup-closed, .cancel").on("click", function () {
    $(".popup-wraper2").removeClass("active");
  });

  //--- heart like and unlike
  var counter = 0;
  var animated = false;
  $(".heart").click(function () {
    if (!animated) {
      $(this).addClass("happy").removeClass("broken");
      animated = true;
      counter++;
      $(this).children("span").text(counter);
    } else {
      $(this).removeClass("happy").addClass("broken");
      animated = false;
      counter--;
      $(this).children("span").text(counter);
    }
  });
}); //document ready end
