const header = document.querySelector('header');

const first_skill = document.querySelector('.skill:first-child');
const sk_counters = document.querySelectorAll('.counter span');
const progress_bars = document.querySelectorAll('.skill svg circle');

const ml_section = document.querySelector('.milestones');
const ml_counters = document.querySelectorAll('.number span');

const prt_section = document.querySelector('.portfolio');
const zoom_icons = document.querySelectorAll('.zoom-icon');
const moda_overlay = document.querySelector('.modal-overlay');
const images = document.querySelectorAll('.images img');


window.addEventListener('scroll', () => {
    if (!skillsPlayed) skillsCounter();
    if (!mlPlayed) mlCounter()
});

/* ---------Sticky Navbar--------- */

function stickyNavbar() {
    // console.log('stickyNavbar');
    header.classList.toggle("scrolled", window.pageYOffset > 0); //pageYOffset is the scroll position of the page and toggles the class scrolled if the scroll position is greater than 0
    // console.log(window.pageYOffset > 0);

}

stickyNavbar()

window.addEventListener('scroll', stickyNavbar);

function updateCount(num, maxNum) {
    let currentNum = +num.innerText;
    // console.log(currentNum);
    if (currentNum < maxNum) {
        num.innerText = currentNum + 1;
        setTimeout(() => {
            updateCount(num, maxNum);
        }, 12);
    }
}




/* ---------Reveal Animation--------- */

let sr = ScrollReveal({
    duration: 2500,
    distance: '50px',
});

sr.reveal(".showcase-info", { delay: 600 })
sr.reveal(".showcase-image", { origin: "top", delay: 700 })


/* ---------Skills Progress Bar Animation--------- */

function hasReached(el) {
    let topPosition = el.getBoundingClientRect().top;

    if (window.innerHeight >= topPosition + el.offsetHeight) return true;
    else return false;
}


let skillsPlayed = false;

function skillsCounter() {
    if (!hasReached(first_skill)) return;

    skillsPlayed = true;

    sk_counters.forEach((counter, i) => {
            let target = counter.dataset.target;
            // console.log(typeof target);
            let strokeValue = 426 - 426 * (target / 100);
            // console.log(strokeValue);
            progress_bars[i].style.setProperty('--target', strokeValue);

            setTimeout(() => {
                updateCount(counter, target);
            }, 400);
        })
        // console.log('skillsCounter');
    progress_bars.forEach((p) => (p.style.animation = 'progress 2s ease-in-out forwards'))
}

/* ---------Services Counter Animation--------- */

let mlPlayed = false;

function mlCounter() {
    if (!hasReached(ml_section)) return;
    mlPlayed = true;
    // console.log('mlCounter');
    ml_counters.forEach((ctr) => {
        // console.log(ctr);
        let target = +ctr.dataset.target;

        setTimeout(() => {
            updateCount(ctr, target)
        }, 400);
    })
}



/* ---------Canvas Animation--------- */

let c = document.getElementById("canv");
let $ = c.getContext("2d");
let w = c.width = window.innerWidth;
let h = c.height = window.innerHeight;

function txt() {
    let t = "Better design,better experiences".split("").join(String.fromCharCode(0x2004));
    $.font = "3.5em Tangerine";
    $.fillStyle = 'hsla(257, 63%, 24%, 1)'; //color of the text
    $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.5);
}

let rad = 250,
    til = 1,
    num = 5;
let alph = 0.9,
    pov = 100;
let midX = w / 2,
    midY = h / 2;
let maxZ = pov - 2,
    cnt = til - 1;
let _arr = {},
    dump = {};
let spX = 0.1,
    spY = 0.1,
    spZ = 0.1; //draw the circle and the points on it
let grav = -0,
    psz = 5; //draw the circle and add the points to the array 
let xMid = 0,
    yMid = 0,
    zMid = -3 - rad; //draw the circle around the center
let dth = -750,
    ang = 0; //draw the circle and add the points to the array and the array to the canvas
let sp = 2 * Math.PI / 360; //is the point in the circle? if so, return true and add the point to the array and the canvas to draw the circle
anim(); //anim is the function that is called to draw the circle and the points on it

function anim() { //fun
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
            let p = add(_x, yMid + _y, zMid + _z, 0.005 * _x, 0.002 * _y, 0.002 * _z); //add the points to the array
            p.a = 120;
            p.b = 120;
            p.c = 460;
            p.va = 0;
            p.vb = alph;
            p.vc = 0;
            p.rem = 500 + Math.random() * 20; //is the point in the circle narastaet kak tolka narastio raskrivaet
            p.mvX = 0;
            p.mvY = grav;
            p.mvZ = 0;
        }
    }
    ang = (ang + sp) + (2 * Math.PI);
    sin = Math.sin(ang); //sin is the sine of the angle
    cos = Math.cos(ang);
    let g = $.createRadialGradient(c.width, c.width, 0, c.height, c.height, c.width);
    g.addColorStop(0, 'hsla(246,48%,65%,1)'); //hsla is the hue, saturation, lightness, and alpha
    g.addColorStop(0.5, 'hsla(0,0%,95%,1)'); //color of the circle
    g.addColorStop(1, 'hsla(255,255%,255%,1)'); //color 
    $.fillStyle = g;
    $.fillRect(0, 0, w, h);
    p = _arr.first;
    while (p != null) {
        pnxt = p.next;
        p.go++;
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
                p.alpha = p.vb / 2;
            else if (p.go < p.a + p.b + p.c)
                p.alpha = (p.vc - p.vb) / p.c * (p.go - p.a - p.b) + p.vb;
        } else
            p.end = true;
        if ((p.px > w) || (p.px < 0) || (p.py < 0) || (p.py > h) || (rotZ > maxZ))
            rng = true;
        else
            rng = false;
        if (rng || p.end) fin(p);
        else {
            dalph = (1 - rotZ / dth);
            dalph = (dalph > 1) ? 1 : ((dalph < 0) ? 0 : dalph);
            $.fillStyle = 'hsla(242, 61%, 76%, ' + p.alpha + ')'; //
            $.beginPath();
            $.fillRect(p.px, p.py, m * psz, m * psz);
            $.fill();
        }
        p = pnxt;
    }
    txt();
}

function add(_x, _y, _z, vx0, vy0, vz0) {
    let np;
    if (dump.first != null) {
        np = dump.first;
        if (np.next != null) {
            dump.first = np.next;
            np.next.prev = null;
        } else dump.first = null;
    } else
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
    np.x = _x;
    np.y = _y;
    np.z = _z;
    np.vx = vx0;
    np.vy = vy0;
    np.vz = vz0;
    np.go = 0;
    np.end = false;
    if (Math.random() > 1000) np.rt = true;
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

window.addEventListener('resize', function() {
    c.width = w = window.innerWidth;
    c.height = h = window.innerHeight;
}, false);


//----------------Portfolio Filter Animation-------//
//take form https://www.kunkalabs.com/mixitup/docs/get-started/

let mixer = mixitup('.portfolio-gallery', {
    selectors: {
        target: '.prt-card',
    },
    animation: {
        duration: 500,
    }
});



//----------------Modal Pop Up Animation-------//

let currentIndex = 0;



zoom_icons.forEach((icn, i) =>
    icn.addEventListener('click', () => {
        prt_section.classList.add('open');
        // console.log(prt_section);
        document.body.classList.add('stopScrolling');
        currentIndex = i;
        // console.log(currentIndex);
        changeImage(currentIndex)
    }));

moda_overlay.addEventListener('click', () => {
    prt_section.classList.remove('open')
    document.body.classList.remove('stopScrolling')
});


function changeImage(index) {
    console.log(index)
    images.forEach((img) =>
        img.classList.remove('showImage'))
    console.log(images[index])
    images[index].classList.add('showImage')


}