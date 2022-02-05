


let baseurl = "http://192.168.0.114:8009"
var audioMp3 = new Audio();
var file_obj = null;
$('#chooseFile').bind('change', function () {
    var filename = $("#chooseFile").val();
    if (/^\s*$/.test(filename)) {
      $(".file-upload").removeClass('active');
      $("#noFile").text("No file chosen..."); 
    }
    else {
      $(".file-upload").addClass('active');
      let file = $("#chooseFile")[0].files[0]
     file_obj = file ; 
     sendFileToServer(file)

      $("#noFile").text(filename.replace("C:\\fakepath\\", "")); 

    }
  });
  
  // make genre prediction here
  $('#predict_btn').click(function(){ onPredictPressed() });

// on button predict
function onPredictPressed()
{
if(file_obj == null)
{
  launch_toast("Choose a file")
}
else{
getPredictionFromServer()
}
}


// get prediction from server
function getPredictionFromServer()
{
  var formData = new FormData();
  formData.append('file',file_obj)
  hidePredictBtn()
  showLoader()
  $.ajax({
      type: 'POST',
      contentType: false,
      processData: false, 
      url: baseurl + "/api/get/prediction/",
      data: formData,
      success: function(data){
          launch_toast(data["genre"])
          hideLoader()
          showPredictBtn()
      },
    });

}

// send file to server
function sendFileToServer(file)
{
    var formData = new FormData();
    formData.append('file',file)
    $.ajax({
        type: 'POST',
        contentType: false, 
        processData: false, 
        url: baseurl + "/api/get/path/",
        data: formData,
        success: function(data){
            console.log(data)
            audioMp3.src = baseurl+ data["path"];
            $('.audiosvg').click()
            playAudio()
        },
      });
}  



TweenMax.set('#ripple-circle circle', {scale:0.5, transformOrigin:'50% 50%'});
TweenMax.fromTo('#svg-line', 2, {x:-2.5}, {x:2.5,repeat:-1,ease:Elastic.easeInOut, yoyo:true});
TweenMax.fromTo('.loading-image', 2, {scale:1, autoAlpha:1}, {scale:0.75, autoAlpha:0.5, transformOrigin:'50% 50%',ease:Bounce.easeIn,yoyo:true, repeat:-1});
TweenMax.to('#inner-circ', 2, {rotation:360, transformOrigin:'50% 50%', repeat:-1});
TweenMax.to('#outer-circ', 4, {rotation:-360, transformOrigin:'50% 50%', repeat:-1});

$('.audiosvg').hover(function(){
	hoverCircle = $(this).find('#hover-circle .st4')
	$(hoverCircle).css({'fill': '#7691BA'});
  TweenMax.to('.play-text', 0.35, {autoAlpha: 1, y:-70, transformOrigin:'50% 50%', ease:Back.easeOut});
}, function(){
	$(hoverCircle).css({'fill': '#486CA3'});
  TweenMax.to('.play-text', 0.35, {autoAlpha: 0, y:0, transformOrigin:'50% 50%', ease:Back.easeIn});
});

$('.audiosvg').click(function(){
	var spinDisc = $(this).find('#svg-audio');
	var rippleCircle = $(this).find('#ripple-circle circle');
	var activeBox = $(this).prev();
	TweenMax.set(spinDisc, {rotation:0, transformOrigin:'50% 50%'});
	TweenMax.to(spinDisc, 2, {rotation:360, transformOrigin:'50% 50%',repeat:-1,ease:Linear.easeNone});
	TweenMax.staggerTo(rippleCircle, 2.1, {scale:20, transformOrigin:'50% 50%', autoAlpha: 0, repeat:-1, ease:Linear.easeNone},0.7);
	$(activeBox).show();
  TweenMax.set('.play-text', {autoAlpha: 0, y:0, transformOrigin:'50% 50%'});
  TweenMax.set('.pause-text', {autoAlpha: 0, y:0, transformOrigin:'50% 50%'});
});

$('.active-box').click(function(){
	$(this).hide();
	TweenMax.killTweensOf($(this).next().find('#svg-audio'));
	TweenMax.killTweensOf($(this).next().find('#ripple-circle circle'));
	TweenMax.set('#ripple-circle circle', {scale:0.5, transformOrigin:'50% 50%'});
  TweenMax.set('.play-text', {autoAlpha: 0, y:0, transformOrigin:'50% 50%'});
  TweenMax.set('.pause-text', {autoAlpha: 0, y:0, transformOrigin:'50% 50%'});
});

$('.active-box').hover(function(){
	hoverCircle = $(this).parent().find('#hover-circle .st4')
	$(hoverCircle).css({'fill': '#7691BA'});
  TweenMax.to('.pause-text', 0.35, {autoAlpha: 1, y:-70, transformOrigin:'50% 50%', ease:Back.easeOut});
}, function(){
	$(hoverCircle).css({'fill': '#486CA3'});
  TweenMax.to('.pause-text', 0.35, {autoAlpha: 0, y:0, transformOrigin:'50% 50%', ease:Back.easeIn});
});

// var audioMp3 = new Audio();
// audioMp3.src = 'http://www.qingli.life/music/Beyond_Jupiter.mp3';

function playAudio(){
  audioMp3.play();
  // $('.audiosvg').click()
}

function pauseAudio(){
	audioMp3.pause();
}

$('.circles').click(function(){
	TweenMax.to('.socialmedia-overlay', 1, {css:{'top':0},ease:Bounce.easeOut});
	TweenMax.to('.fa-angle-up', 0.5, {autoAlpha: 1, ease:Power2.easeOut,delay:1});
	TweenMax.staggerFrom('.socialmedia-content div', 0.5, {scale:0.1, transformOrigin:'50% 50%', autoAlpha: 0, ease:Back.easeOut, delay:0.75},0.5);
})
$('.fa-angle-up').click(function(){
	TweenMax.to('.socialmedia-overlay', 0.5, {css:{'top':'-100%'},ease:Power2.easeInOut});
	TweenMax.to(this, 0.5, {autoAlpha: 0, ease:Power2.easeOut});
})



$('.button--bubble').each(function() {
    var $circlesTopLeft = $(this).parent().find('.circle.top-left');
    var $circlesBottomRight = $(this).parent().find('.circle.bottom-right');
  
    var tl = new TimelineLite();
    var tl2 = new TimelineLite();
  
    var btTl = new TimelineLite({ paused: true });
  
    tl.to($circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
    tl.to($circlesTopLeft.eq(0), 0.1, { scale: 0.2, x: '+=6', y: '-=2' });
    tl.to($circlesTopLeft.eq(1), 0.1, { scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
    tl.to($circlesTopLeft.eq(2), 0.1, { scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
    tl.to($circlesTopLeft.eq(0), 1, { scale: 0, x: '-=5', y: '-=15', opacity: 0 });
    tl.to($circlesTopLeft.eq(1), 1, { scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
    tl.to($circlesTopLeft.eq(2), 1, { scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');
  
    var tlBt1 = new TimelineLite();
    var tlBt2 = new TimelineLite();
    
    tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
    tlBt1.add(tl);
  
    tl2.set($circlesBottomRight, { x: 0, y: 0 });
    tl2.to($circlesBottomRight, 1.1, { x: 30, y: 30, ease: SlowMo.ease.config(0.1, 0.7, false) });
    tl2.to($circlesBottomRight.eq(0), 0.1, { scale: 0.2, x: '-=6', y: '+=3' });
    tl2.to($circlesBottomRight.eq(1), 0.1, { scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
    tl2.to($circlesBottomRight.eq(2), 0.1, { scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
    tl2.to($circlesBottomRight.eq(0), 1, { scale: 0, x: '+=5', y: '+=15', opacity: 0 });
    tl2.to($circlesBottomRight.eq(1), 1, { scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
    tl2.to($circlesBottomRight.eq(2), 1, { scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');
    
    tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: 45 });
    tlBt2.add(tl2);
  
    btTl.add(tlBt1);
    btTl.to($(this).parent().find('.button.effect-button'), 0.8, { scaleY: 1.1 }, 0.1);
    btTl.add(tlBt2, 0.2);
    btTl.to($(this).parent().find('.button.effect-button'), 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);
  
    btTl.timeScale(2.6);
  
    $(this).on('mouseover', function() {
      btTl.restart();
    });
  });


// hide loader
function hideLoader()
{
$("#loader_container").hide()
}

// show loader
function showLoader()
{
$("#loader_container").show()
}

// hide Predict btn
function hidePredictBtn()
{
$("#predict_btn_container").hide()
}

// show predict btn 
function showPredictBtn()
{
$("#predict_btn_container").show()
}

  
hideLoader()
        

function launch_toast(msg) {
  $("#desc").html(msg)
  var x = document.getElementById("toast")
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}
