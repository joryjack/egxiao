(function(w){

document.addEventListener('plusready',function(){
	console.log("Immersed-UserAgent: "+navigator.userAgent);
},false);

var immersed = 30;
var ms=(/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
if(ms&&ms.length>=3){
	immersed=parseFloat(ms[2]);
}
w.immersed=immersed;

if(!immersed){
	return;
}
var t=document.getElementById('header');
t&&(t.style.paddingTop=immersed+'px',t.style.background='#00b2c2',t.style.color='#FFF');
t=document.getElementById('content');
t&&(t.style.marginTop=immersed+'px');
t=document.getElementById('dcontent');
t&&(t.style.marginTop=immersed+'px');
t=document.getElementById('map');
t&&(t.style.marginTop=immersed+'px');

})(window);