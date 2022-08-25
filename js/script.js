const header = document.querySelector('header');

/* ---------Sticky Navbar--------- */

function stickyNavbar() {
    // console.log('stickyNavbar');
    header.classList.toggle("scrolled", window.pageYOffset > 0);//pageYOffset is the scroll position of the page and toggles the class scrolled if the scroll position is greater than 0
    // console.log(window.pageYOffset > 0);

}

stickyNavbar()

window.addEventListener('scroll', stickyNavbar);


/* ---------Reveal Animation--------- */

let sr = ScrollReveal({
    duration: 2500,
    distance: '50px',
});

sr.reveal(".showcase-info",{ delay: 600 })
sr.reveal(".showcase-image",{origin:"top", delay: 700 })

/* ---------Canvas Animation--------- */

var c = document.getElementById("canv");
var $ = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;

function txt() {
  var t   =  "Better design,better experiences".split("").join(String.fromCharCode(0x2004));
  $.font = "3.5em Tangerine";
  $.fillStyle = 'hsla(257, 63%, 24%, 1)';//color of the text
  $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.5);
}

var rad = 250, til = 1, num = 5;
var alph = 0.9, pov = 100; 
var midX = w / 2, midY = h / 2;
var maxZ = pov - 2, cnt = til - 1; 
var _arr = {}, dump = {};//is the point in the circle? if so, return true
var spX = 0.1, spY = 0.1, spZ = 0.1;//draw the circle and the points on it
var grav = -0, psz = 5;//draw the circle and add the points to the array 
var xMid = 0, yMid = 0, zMid = -3 - rad;//draw the circle around the center
var dth = -750, ang = 0; //draw the circle and add the points to the array and the array to the canvas
var sp = 2 * Math.PI / 360;//is the point in the circle? if so, return true and add the point to the array and the canvas to draw the circle
anim();//anim is the function that is called to draw the circle and the points on it

function anim() {//fun
  window.requestAnimationFrame(anim);
  cnt++;
  if (cnt >= til) {
    cnt = 0;
    for (i = 0; i < num; i++) {
      theta = Math.random() * 2 * Math.PI;
      phi = Math.acos(Math.random() * 2 - 1);
      _x = rad * Math.sin(phi) * Math.cos(theta);
      _y = rad * Math.sin(phi) * Math.sin(theta);
      _z = rad * Math.cos(phi);
      var p = add(_x, yMid + _y, zMid + _z, 0.005 * _x, 0.002 * _y, 0.002 * _z);
      p.a = 120; p.b = 120; p.c = 460;
      p.va = 0; p.vb = alph; p.vc = 0;
      p.rem = 120 + Math.random() * 20;
      p.mvX = 0; p.mvY = grav; p.mvZ = 0;
    }
  }
  ang = (ang + sp) + (2 * Math.PI);
  sin = Math.sin(ang);//sin is the sine of the angle
  cos = Math.cos(ang);
  var g = $.createRadialGradient(c.width, c.width,0, c.height, c.height, c.width);
  g.addColorStop(0,'hsla(246,48%,65%,1)');//hsla is the hue, saturation, lightness, and alpha
  g.addColorStop(0.5, 'hsla(0,0%,95%,1)');//color of the circle
  g.addColorStop(1, 'hsla(255,255%,255%,1)');//color 
  $.fillStyle = g;
  $.fillRect(0, 0, w, h);
  p = _arr.first;
  while (p != null) {
    pnxt = p.next; p.go++;
    if (p.go > p.rem) {
      p.vx += p.mvX + spX * (Math.random() * 2 - 1);
      p.vy += p.mvY + spY * (Math.random() * 2 - 1);
      p.vz += p.mvZ + spZ * (Math.random() * 2 - 1);
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;
    }
    rotX = cos * p.x + sin * (p.z - zMid);
    rotZ = -sin * p.x + cos * (p.z - zMid) + zMid;
    m = pov / (pov - rotZ);
    p.px = rotX * m + midX;
    p.py = p.y * m + midY;
    if (p.go < p.a + p.b + p.c) {
      if (p.go < p.a)
        p.alpha = (p.vb - p.va) / p.a * p.go + p.va;
      else if (p.go < p.a + p.b)
        p.alpha = p.vb/2;
      else if (p.go < p.a + p.b + p.c)
        p.alpha = (p.vc - p.vb) / p.c * (p.go - p.a - p.b) + p.vb;
    } else
      p.end = true;
    if ((p.px > w) || (p.px < 0) || (p.py < 0) || (p.py > h) || (rotZ > maxZ))
      rng = true;
    else 
      rng = false;
    if (rng || p.end)fin(p);
    else {
      dalph = (1 - rotZ / dth);
      dalph = (dalph > 1) ? 1 : ((dalph < 0) ? 0 : dalph);
      $.fillStyle = 'hsla(242, 61%, 76%, '+p.alpha+')';//
      $.beginPath();
      $.fillRect(p.px, p.py, m*psz, m*psz);
      $.fill();
    }
    p = pnxt;
  }
  txt();
}

function add(_x, _y, _z, vx0, vy0, vz0) {
  var np;
  if (dump.first != null) {
    np = dump.first;
    if (np.next != null) {
      dump.first = np.next;
      np.next.prev = null;
    } else dump.first = null;
  }
  else
    np = {};
  if (_arr.first == null) {
    _arr.first = np;
    np.prev = null;
    np.next = null;
  } else {
    np.next = _arr.first;
    _arr.first.prev = np;
    _arr.first = np;
    np.prev = null;
  }
  np.x = _x; np.y = _y; np.z = _z;
  np.vx = vx0; np.vy = vy0; np.vz = vz0;
  np.go = 0; np.end = false;
  if (Math.random() < 0.5) np.rt = true;
  else np.rt = false;
  return np;
}

function fin(p) {
  if (_arr.first == p) {
    if (p.next != null) {
      p.next.prev = null;
      _arr.first = p.next;
    } else _arr.first = null;
  } else {
    if (p.next == null) p.prev.next = null;
    else {
      p.prev.next = p.next;
      p.next.prev = p.prev;
    }
  }
  if (dump.first == null) {
    dump.first = p;
    p.prev = null;
    p.next = null;
  } else {
    p.next = dump.first;
    dump.first.prev = p;
    dump.first = p;
    p.prev = null;
  }
}
window.addEventListener('resize',function(){
  c.width = w = window.innerWidth;
  c.height = h = window.innerHeight;
}, false);

/*------Canvas 2-----*/

// var c = document.getElementById('canv');
// var w = c.width = window.innerWidth;
// var h = c.height = window.innerHeight;

// var $ = c.getContext('2d');
// var _x = w / 2;
// var _y = h / 2;

// var sc = 150;
// var num = 35;

// var midX = new Array(num);
// var midY = new Array(num);
// var rad = new Array(num);

// var msX = 0.0;
// var msY = 0.0;
// var _msX = 0.0;
// var _msY = 0.0;

// var invX = 0.0;
// var invY = 0.0;
// var _invX = 0.0;
// var _invY = 0.0;

// var spr = 0.95;
// var fric = 0.95;
// var flag = 1;
// var arr = [];
// var rint = 60;

// var draw = function() {
//   window.requestAnimationFrame(draw);
//   inv();
//   fill();
//   ring();
//   for(var j= 0; j < arr.length; j++) {
// 		arr[j].fade();
// 		arr[j].anim();
// 		arr[j]._draw();
// 	} 
// }
// var inv = function() {
//   invX = msX;
//   invY = msY;
//   _msX += (_invX - invX) * spr;
//   _msY += (_invY - invY) * spr;
//   _msX *= fric;
//   _msY *= fric;
//   _invX = invX;
//   _invY = invY;
//   invX += _msX;
//   invY += _msY;
// }

// var txt = function() {
//   var t0 = "Better design".split("").join(String.fromCharCode(0x2004));
//   var t = "better experiences".split("").join(String.fromCharCode(0x2004));
//   $.font = "3em Economica";
//   $.fillStyle = 'hsla(246, 38%, 47%, .55)';
//   $.fillText(t0, (c.width - $.measureText(t0).width) * 0.5, c.height * 0.45);
//   $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.55);
//   return t;
// }
// var fill = function() {
//   $.globalCompositeOperation= 'source-over';
//   var g_ = $.createLinearGradient(c.width + c.width, c.height + c.height * 1.5, c.width + c.width, 1);
//   g_.addColorStop(0, ' hsla(220, 95%, 10%, .55)');
//   g_.addColorStop(0.5, 'hsl(253deg 72% 18%) 89%');
//   g_.addColorStop(1, 'hsla(0, 0%, 5%, 1)');
//   $.fillStyle = g_;
//   $.fillRect(0, 0, w, h);
//   $.globalCompositeOperation= 'lighter';
//   txt();
// }

// var ring = function() {
//   for (i = 0; i < num; i++) {
//     var currX = midX[i];
//     var currY = midY[i];
//     var currRad = rad[i];
//     var dx = currX + invX;
//     var dy = currY + invY;
//     var s = 1 / (dx * dx + dy * dy - currRad * currRad);
//     ix = dx * s + (currX * flag);
//     iy = -dy * s + (currY * flag);
//     var irad = currRad * s;
//     var g = $.createRadialGradient(ix * sc + _x,
//       iy * sc + _y,
//       irad,
//       ix * sc + _x,
//       iy * sc + _y,
//       irad * sc)
//     g.addColorStop(0, 'hsla(176, 95%, 95%, 1)');
//     g.addColorStop(0.5, 'hsla(201, 95%, 45%, .5)');
//     g.addColorStop(1, 'hsla(0, 0%, 0%, 0)');
//     $.fillStyle = g;
//     $.beginPath();
//     $.arc(ix * sc + _x, iy * sc + _y, irad * sc, 0, Math.PI * 2.0, true);
//     $.fill();
//   }
// };

// for(var j = 0; j < 150; j++) {
// 		arr[j] = new stars();
// 		arr[j].reset();
// 	}

// function stars() {
// 	this.s = {tlap:8000, maxx:5, maxy:2, rmax:5, rt:1, dx:960, dy:540, mvx:4, mvy: 4, rnd:true, twinkle:true};
// 	this.reset = function() {
// 		this.x = (this.s.rnd ? w*Math.random() : this.s.dx);
// 		this.y = (this.s.rnd ? h*Math.random() : this.s.dy);
// 		this.r = ((this.s.rmax-1)*Math.random()) + .5;
// 		this.dx = (Math.random()*this.s.maxx) * (Math.random() < .5 ? -1 : 1);
// 		this.dy = (Math.random()*this.s.maxy) * (Math.random() < .5 ? -1 : 1);
// 		this.tw = (this.s.tlap/rint)*(this.r/this.s.rmax);
// 		this.rt = Math.random()*this.tw;
// 		this.s.rt = Math.random()+1;
// 		this.cs = Math.random()*.2+.4;
// 		this.s.mvx *= Math.random() * (Math.random() < .5 ? -1 : 1);
// 		this.s.mvy *= Math.random() * (Math.random() < .5 ? -1 : 1);
// 	}
// 	this.fade = function() {
// 		this.rt += this.s.rt;
// 	}
// 	this._draw = function() {
// 		if(this.s.twinkle && (this.rt <= 0 || this.rt >= this.tw)) this.s.rt = this.s.rt*-1;
// 		else if(this.rt >= this.tw) this.reset();
// 		var o = 1-(this.rt/this.tw);
// 		$.beginPath();
// 		$.arc(this.x,this.y,this.r,0,Math.PI*2,true);
// 		$.closePath();
// 		var rad = this.r*o;
// 		var g = $.createRadialGradient(this.x,this.y,0,this.x,this.y,(rad <= 0 ? 1 : rad));
// 		g.addColorStop(0.0, 'hsla(255,255%,255%,'+o+')');
// 		g.addColorStop(this.cs, 'hsla(201, 95%, 25%,'+(o*.6)+')');
// 		g.addColorStop(1.0, 'hsla(201, 95%, 45%,0)');
// 		$.fillStyle = g;
// 		$.fill();
// 	}

// 	this.anim = function() {
// 		this.x += (this.rt/this.tw)*this.dx;
// 		this.y += (this.rt/this.tw)*this.dy;
// 		if(this.x > w || this.x < 0) this.dx *= -1;
// 		if(this.y > h || this.y < 0) this.dy *= -1;
// 	}
// }
// var set = function() {
//   var radi = Math.PI * 2.0 / num;
//   for (i = 0; i < num; i++) {
//     midX[i] = Math.cos(radi * i);
//     midY[i] = Math.sin(radi * i);
//     rad[i] = 0.1;
//   }
//   draw();
// }
// window.addEventListener('mousemove', function(e) {
//   msX = (e.clientX - _x) / sc;
//   msY = (e.clientY - _y) / sc;
// }, false);

// window.addEventListener('touchmove', function(e) {
//   e.preventDefault();
//   msX = (e.touches[0].clientX - _x) / sc;
//   msY = (e.touches[0].clientY - _y) / sc;
// }, false);

// window.addEventListener('resize', function() {
//   c.width = w = window.innerWidth;
//   c.height = h = window.innerHeight;
//   draw();
// }, true);

// set();


             // face

             var site = site || {};
             site.window = $(window);
             site.document = $(document);
             site.Width = site.window.width();
             site.Height = site.window.height();
             
            //  var Background = function() {
             
             
             
             Background.headparticle = function() {   
             
                if ( !Modernizr.webgl ) {
                   alert('Your browser dosent support WebGL');
                }
             
                var camera, scene, renderer;
                var mouseX = 0, mouseY = 0;
                var p;
             
                var windowHalfX = site.Width / 2;
                var windowHalfY = site.Height / 2;
             
                Background.camera = new THREE.PerspectiveCamera( 35, site.Width / site.Height, 1, 2000 );
                Background.camera.position.z = 300;
             
                // scene
                Background.scene = new THREE.Scene();
             
                // texture
                var manager = new THREE.LoadingManager();
                manager.onProgress = function ( item, loaded, total ) {
                   //console.log('webgl, twice??');
                   //console.log( item, loaded, total );
                };
             
             
                // particles
                var p_geom = new THREE.Geometry();
                var p_material = new THREE.ParticleBasicMaterial({
                   color: 0xFFFFFF,
                   size: 1.5
                });
             
                // model
                var loader = new THREE.OBJLoader( manager );
                loader.load( 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/40480/head.obj', function ( object ) {
             
                   object.traverse( function ( child ) {
             
                      if ( child instanceof THREE.Mesh ) {
             
                         // child.material.map = texture;
             
                         var scale = 8;
             
                         $(child.geometry.vertices).each(function() {
                            p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
                         })
                      }
                   });
             
                   Background.scene.add(p)
                });
             
                p = new THREE.ParticleSystem(
                   p_geom,
                   p_material
                );
             
                Background.renderer = new THREE.WebGLRenderer({ alpha: true });
                Background.renderer.setSize( site.Width, site.Height );
                Background.renderer.setClearColor(0x000000, 0);
             
                $('.particlehead').append(Background.renderer.domElement);
                $('.particlehead').on('mousemove', onDocumentMouseMove);
                site.window.on('resize', onWindowResize);
             
                function onWindowResize() {
                   windowHalfX = site.Width / 2;
                   windowHalfY = site.Height / 2;
                   //console.log(windowHalfX);
             
                   Background.camera.aspect = site.Width / site.Height;
                   Background.camera.updateProjectionMatrix();
             
                   Background.renderer.setSize( site.Width, site.Height );
                }
             
                function onDocumentMouseMove( event ) {
                   mouseX = ( event.clientX - windowHalfX ) / 2;
                   mouseY = ( event.clientY - windowHalfY ) / 2;
                }
             
                Background.animate = function() { 
             
                   Background.ticker = TweenMax.ticker;
                   Background.ticker.addEventListener("tick", Background.animate);
             
                   render();
                }
             
                function render() {
                   Background.camera.position.x += ( (mouseX * .5) - Background.camera.position.x ) * .05;
                   Background.camera.position.y += ( -(mouseY * .5) - Background.camera.position.y ) * .05;
             
                   Background.camera.lookAt( Background.scene.position );
             
                   Background.renderer.render( Background.scene, Background.camera );
                }
             
                render();
             
                Background.animate();
             };
             
             
             Background.headparticle();
 
