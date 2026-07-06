/* ===== 城市站点实时嵌入交互 ===== */
(function(){
  'use strict';

  function initLiveSites(){
    var frame=document.getElementById('liveSiteFrame');
    var overlay=document.getElementById('liveSiteOverlay');
    var wrap=document.getElementById('liveSiteFrameWrap');
    var tabs=document.querySelectorAll('.live-tab');
    var pins=document.querySelectorAll('.city-pin.live-pin');
    if(!frame) return;

    var sites=[
      'https://sanxia.opencsg.com/',
      'https://openeast.opencsg.com/',
      'https://occ.opencsg.hk/',
      'https://sg.opencsg.com/',
      'https://aihub.caict.ac.cn/',
      'https://modelhub.lgdg.cc/'
    ];
    var currentIdx=0;
    var autoTimer=null;
    var AUTO_INTERVAL=8000;
    var userInteracted=false;

    function setSite(idx,fromUser){
      if(idx<0||idx>=sites.length) return;
      currentIdx=idx;
      var url=sites[idx];
      frame.src=url;
      if(overlay) overlay.classList.add('hidden');
      tabs.forEach(function(t,i){t.classList.toggle('active',i===idx)});
      pins.forEach(function(p){
        var ps=p.getAttribute('data-site');
        p.classList.toggle('active',ps===url);
      });
      if(fromUser){
        userInteracted=true;
        stopAuto();
        setTimeout(startAuto,20000);
      }
    }

    function startAuto(){
      if(autoTimer) return;
      autoTimer=setInterval(function(){
        if(!document.hidden && isVisible(wrap)){
          var next=(currentIdx+1)%sites.length;
          setSite(next,false);
        }
      },AUTO_INTERVAL);
    }
    function stopAuto(){
      if(autoTimer){clearInterval(autoTimer);autoTimer=null;}
    }

    function isVisible(el){
      if(!el) return false;
      var r=el.getBoundingClientRect();
      var vh=window.innerHeight||document.documentElement.clientHeight;
      return r.top<vh && r.bottom>0;
    }

    // Tab click
    tabs.forEach(function(tab,i){
      tab.addEventListener('click',function(){
        setSite(i,true);
      });
    });

    // Pin click
    pins.forEach(function(pin){
      pin.addEventListener('click',function(){
        var url=pin.getAttribute('data-site');
        var idx=sites.indexOf(url);
        if(idx>=0) setSite(idx,true);
      });
    });

    // Overlay click to start
    if(overlay){
      overlay.addEventListener('click',function(){
        setSite(0,true);
      });
    }

    // Pause when slide not visible
    document.addEventListener('slidechange',function(){
      if(isVisible(wrap)){startAuto();}
      else{stopAuto();}
    });

    // Intersection observer for visibility
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting){startAuto();}
          else{stopAuto();}
        });
      },{threshold:0.2});
      io.observe(wrap);
    }

    // Start with first site after a short delay
    setTimeout(function(){
      if(!userInteracted) setSite(0,false);
    },1500);
    startAuto();
  }

  // Init on DOM ready
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',initLiveSites);
  }else{
    initLiveSites();
  }
})();
