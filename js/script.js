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
const prev_btn = document.querySelector('.prev-btn');
const next_btn = document.querySelector('.next-btn');

const links = document.querySelectorAll('.nav-links');

const toogle_btn = document.querySelector('.toggle-btn');

const hamburger = document.querySelector(".hamburger"); //selecting the hamburger icon

window.addEventListener('scroll', () => {
    activeLink();
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


// canvas

let creategrid = () => {

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
  
        //create individual divs
        let sqr = document.createElement('div');
        sqr.classList.add('square1');
  
        //random 90% chance 
        if (Math.random() > 0.90) 
          sqr.classList.add('popout');
        
        //add text to the squares
        sqr.innerHTML = (x + ' ' + y);
  
        //put coordinates as id in ths format: x-y
        sqr.setAttribute('id', x + '-' + y);
  
        //add to gridbox
        document.querySelector('.gridbox')
          .appendChild(sqr);	
      }
    }
  };
  //animate each squares
  let RandNum = (x) => {
    x.style.transform = "translateZ(" + Math.floor((Math.random() * 150) + 25) + "px)" + " rotateX(-75deg)";
    
    x.style.border ='2px solid #'+ Math.floor(Math.random()*16777215).toString(16);
    
    x.style.fontSize = '1.5rem';
    
  };
  //animate every second
  let Animate = setInterval( ()=> {
    let popout = Array.from( document
    .querySelectorAll('.popout') );
    
    popout.map(RandNum);
  }, 1000);
  
  creategrid();
//   Animate();


// //----------------Modal Pop Up Animation-------//

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


prev_btn.addEventListener('click', () => {
    if (currentIndex === 0) {
        currentIndex = 5
    } else {
        currentIndex--
    }
    // console.log(currentIndex);
    changeImage(currentIndex);
});

next_btn.addEventListener('click', () => {
    if (currentIndex === 5) {
        currentIndex = 0
    } else {
        currentIndex++
    }

    // console.log(currentIndex);
    changeImage(currentIndex);
});

function changeImage(index) {
    // console.log(index)
    images.forEach((img) =>
            img.classList.remove('showImage'))
        // console.log(images[index])
    images[index].classList.add('showImage')


}


//-----------------Modal Pop Up Animation-----------------//

const swiper = new Swiper('.swiper', {

    loop: true,
    speed: 500,
    autoplay: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },


});



//clock

const secondHand = document.querySelector('.second-hand');
const minsHand = document.querySelector('.min-hand');
const hourHand = document.querySelector('.hour-hand');

function setDate() {
    const now = new Date();

    const seconds = now.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    const mins = now.getMinutes();
    const minsDegrees = ((mins / 60) * 360) + ((seconds / 60) * 6) + 90;
    minsHand.style.transform = `rotate(${minsDegrees}deg)`;

    const hour = now.getHours();
    const hourDegrees = ((hour / 12) * 360) + ((mins / 60) * 30) + 90;
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
}

setInterval(setDate, 1000);

setDate();


//----------------Change Active link On Scroll-------//


function activeLink() {
    // console.log('activeLink')
    let sections = document.querySelectorAll('section[id]');
    // console.log(Array.from(sections))
    let passedSections = Array.from(sections).map((sct, i) => {
        return {
            y: sct.getBoundingClientRect().top - header.offsetHeight,
            id: i
        } //is the top of the section is in the viewport

    }).filter(sct => sct.y <= 0);
    // console.log(currSectionID)
    let currSectionID = passedSections.at(-1).id; //get the last section that is in the viewport
    // console.log(currSectionID)
    links.forEach((l) => l.classList.remove('active'));
    links[currSectionID].classList.add('active');

}

activeLink();

// visits locas storage

// const counter = document.getElementById("count");

// incrementVisitsCount();

// function incrementVisitsCount() {
//     let visits;

//     if (!localStorage.getItem("visits")) localStorage.setItem("visits", 1);
//     else {
//         visits = +localStorage.getItem("visits");
//         const incrementedCount = visits + 1;

//         localStorage.setItem("visits", incrementedCount);
//     }

//     counter.innerText = localStorage.getItem("visits");
// }


// visit Cookies
function nameDefined(ckie, nme) {
    var splitValues
    var i
    for (i = 0; i < ckie.length; ++i) {
        splitValues = ckie[i].split("=")
        if (splitValues[0] == nme) return true
    }
    return false
}

function delBlanks(strng) {
    var result = ""
    var i
    var chrn
    for (i = 0; i < strng.length; ++i) {
        chrn = strng.charAt(i)
        if (chrn != " ") result += chrn
    }
    return result
}

function getCookieValue(ckie, nme) {
    var splitValues
    var i
    for (i = 0; i < ckie.length; ++i) {
        splitValues = ckie[i].split("=")
        if (splitValues[0] == nme) return splitValues[1]
    }
    return ""
}

function insertCounter() {
    readCookie()
    displayCounter()
}

function displayCounter() {
    document.write('<p class="heading " ALIGN="CENTER"  >')
    document.write("This page was viewed ")
    if (counterPage == 1) document.write("the first time.")
    else document.write(counterPage + " times.")
    document.writeln('</p>')
}

function readCookie() {
    var cookie = document.cookie
    counterPage = 2543
    var chkdCookie = delBlanks(cookie) //are on the client computer
    var nvpair = chkdCookie.split(";")
    if (nameDefined(nvpair, "pageCount"))
        counterPage = parseInt(getCookieValue(nvpair, "pageCount"))
        ++counterPage
    var futdate = new Date()
    var expdate = futdate.getTime()
    expdate += 3600000 * 24 * 30 //expires in 1 hour
    futdate.setTime(expdate)

    var newCookie = "pageCount=" + counterPage
    newCookie += "; expires=" + futdate.toGMTString()
    window.document.cookie = newCookie
}
insertCounter();




// ----------------Change Page Theme-----------------//

let firstTheme = localStorage.getItem("dark");

// console.log(+firstThem);

changeTheme(+firstTheme);

function changeTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark");
        toogle_btn.classList.replace("uil-moon", "uil-sun")
        localStorage.setItem("dark", 1)
    } else {
        document.body.classList.remove("dark");
        toogle_btn.classList.replace("uil-sun", "uil-moon")
        localStorage.setItem("dark", 0)
    }
}

toogle_btn.addEventListener('click', () => {
    changeTheme(!document.body.classList.contains("dark"));
})


// ----------------Open & Close Navbar Menu-----------------//

hamburger.addEventListener('click', () => {
    document.body.classList.toggle("open");
    document.body.classList.toggle("stopScrolling");
})

links.forEach(link => link.addEventListener("click", () => {
    document.body.classList.remove("open");
    document.body.classList.remove("stopScrolling");

}))
