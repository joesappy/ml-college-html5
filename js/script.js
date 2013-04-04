var ww = document.body.clientWidth;

var num = 0;

var menuHeight = 0;
var subHeight = 0;

var $nav = $('#nav');
var $wrapper = $('#wrapper');
var $mlVideo = $('#mlVideo');
var $overlayImg = $('.overlayImg');

var mobile = false;
var activePlay = false;

// ON LOAD
$(document).ready(function() {
	setTimeout(scrollTo,200,0,1)
	setTimeout(function(){
        $('footer').hide("slide", { direction: "down" }, 1000);}, 7000);

	adjustMenu();

	$mlVideo.css('display', "none");
	$mlVideo.animate({
		opacity: 0,
		scale: .75
	});
	$overlayImg.css('display', "none");
	$overlayImg.animate({ opacity: 0 });
});

// ON RESIZE
$(window).bind('resize orientationchange', function() {
	ww = document.body.clientWidth;
	adjustMenu();
});

var adjustMenu = function() {
	if (ww < 500) {				//	Mobile
		mobile = true;
		$('footer').show();
	} else if (ww >= 500) {		//	Browser
		mobile = false;

		for (var i = 1; i <= 5; i++) {
			$("#menu" + [i]).find('li:.backMain').remove();
		}
		for (var i = 1; i <= 3; i++) {
			$("#subMenu" + [i]).find('li:.backSub').remove();
		}
	}
};

// -------------------------
// Mobile specific FUNCTIONS
// -------------------------
// -------------------------
// Click listeners
// -------------------------

$('#activeMenu').on('click', function() {	// Main Menu Btn - Second Screen - nonMobile
	returnToMenu();
});

$('.backMain').on("click", function(e) {	// MOBILE - Return to Main Menu
	e.preventDefault();
	e.stopPropagation();

	if (mobile){
		$nav.css('left', "0");
		$wrapper.css('height', '345px');
	}
});

$('.backSub').on("click", function(e) {	// MOBILE - Return to Sub Menu
	e.preventDefault();
	e.stopPropagation();

	if (mobile){
		$nav.css('left', "-100%");
		$wrapper.css('height', menuHeight);
		$('#menu' + num).css('display', "block");
	}
});

$('.navigateTo').on("click", function(e) {	// MOBILE - Go to Sub Menu
	e.preventDefault();
	e.stopPropagation();

	var navIndex = $(this).closest('li').index() + 1;
	// console.log('Index: ' + navIndex);

	if (mobile){
		menuHeight = $("#menu" + navIndex).innerHeight();
		$wrapper.css('height', menuHeight);
		$nav.css('left', "-100%");

		$("#menu" + navIndex).css('display', "block").closest('li').siblings('li').find('ul').hide();
	}
});

$('.navigateSub').on("click", function(e) {	// MOBILE - Go to SubSub Menu
	e.preventDefault();
	e.stopPropagation();

	var subName = $(this).next().attr('id');
	var subIndex = +(subName.slice(-1));
	// console.log('Index: ' + subIndex);

	if (mobile){
		subHeight = $("#subMenu" + subIndex).innerHeight();
		$wrapper.css('height', subHeight);
		$nav.css('left', "-200%");

		$("#subMenu" + subIndex).css('display', "block").closest('li').siblings('li').find('ul').hide();
	}
});

$('.playVid').on("click", function(e) {		// Video SELECT & PLAY
	e.preventDefault();
	var vidSrc = $(this).attr("href");
	
	if (mobile) {
		videoPlayerMobile(vidSrc);
	} else {
		videoPlayer(vidSrc);
		if(!activePlay){
			dropSubMenu($(this));
		}
	}
});

// --------------------------
// Video Player Functionality
// --------------------------
var isFullScreen = false;
var mlPlayer = _V_("mlVideo");

function dropSubMenu(eMenu) {
	$('.nav').animate({
		left: '-400px'
	}, {
		duration: 500,
    	queue: true,
		complete: function() {
			$('#activeMenu').css('display', 'block')
			$('.nav').css('top', '65px');

			$('.top').css('display', 'none');
			eMenu.closest('.top').css('display', "block");

			$('.nav').addClass('vidMenu');
		}
	});
	setTimeout(function() {
		$('#activeMenu').show("slide", { direction: "left" }, 500);
		$('.nav').delay(500).animate({
			left: '-1px'
		}, {
			duration: 500,
			queue: false
		});
	}, 500);

	activePlay = true;
};

function videoPlayer(vidSrc){
	$mlVideo.css('display', "block");
	$mlVideo.animate({
		opacity: 1,
		scale: 1
	}, 250);

	$('.innerHead').addClass('blur');
	$overlayImg.css('display', "block");
	$overlayImg.animate({ opacity: 1 }, 250);
	$('header a.logo').animate({ top: 25 });
	
	mlPlayer.src(vidSrc);
	mlPlayer.play();
}


//	MOBILE Video Player
function videoPlayerMobile(vidSrc){
	$mlVideo.css('display', "block");
	$mlVideo.animate({
		opacity: 1,
		scale: 1
	}, 0);
	// $("#innerPage").css('display', "none");

	mlPlayer.src(vidSrc);
	mlPlayer.play();
	// mlPlayer.requestFullScreen();
};

var returnToMenu = function(){

	mlPlayer.pause();

	if (mobile) {
		// This
	}

	if (isFullScreen) { 
		$mlVideo.css('display', "none");
		$("#innerPage").css('display', "block");
		mlPlayer.cancelFullScreen();
	} else {
		$mlVideo.animate({
			opacity: 0,
			scale: .75
		}, 250, function() {
    		$mlVideo.css('display', "none");
  		});

		$('.innerHead').removeClass('blur');
		$overlayImg.animate({ opacity: 0 }, 250, function() {
			$overlayImg.css('display', "none");
		});

		$('header a.logo').animate({ top: 200 });	
		$('#activeMenu').hide("slide", { direction: "left" }, 500);
		$('.nav').animate({
			left: '-400px'
		}, {
			duration: 600,
    		queue: true,
			complete: function() {
				$('#activeMenu').css('display', 'none');
				$('.nav').removeClass('vidMenu');
				$('.nav').css('top', '240px');
				$('.top').css('display', 'block');
			}
		});

		setTimeout(function() {
			$('.nav').delay(700).animate({
				left: '0px'
			}, {
				duration: 500,
				queue: false
			});
		}, 500);

		activePlay = false;
	}
};

var returnFromEsc = function(){
	var mlPlayer = this;

	if (mobile) {
		// This
	}
	
	$mlVideo.css('display', "none");

	if (isFullScreen) {
		$("#innerPage").css('display', "block");

		mlPlayer.pause();
		mlPlayer.cancelFullScreen();
		isFullScreen = false;
	} else {
		$('.innerHead').removeAttr('id', 'blur');
		$('.overlay').removeAttr('id', 'overlayImg');
		$('header a.logo').css('top', '200px');

		isFullScreen = true;
	}
};

mlPlayer.addEvent("ended", returnToMenu);
// mlPlayer.addEvent("fullscreenchange", returnFromEsc);




















