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



/* ---------Canvas Animation--------- */

const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);

//=========================================================================================== scene
var scene = new THREE.Scene();

//=========================================================================================== camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);


//=========================================================================================== canvas
renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true; //Shadow
renderer.shadowMapSoft = true; // Shadow
renderer.shadowMapType = THREE.PCFShadowMap; //Shadow
document.body.appendChild(renderer.domElement);

//=========================================================================================== add VR
renderer.setPixelRatio(window.devicePixelRatio); //VR
var effect = new THREE.StereoEffect(renderer); //VR
effect.setSize(window.innerWidth, window.innerHeight); //VR
var VR = false;

function toggleVR() {
    if (VR) {
        VR = false;
        camera.rotation.reorder('ZYX');
        camera.lookAt(0, 0, 0);
    } else {
        VR = true;
        controls = new THREE.DeviceOrientationControls(camera);
        requestFullscreen(document.documentElement);
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//=========================================================================================== resize
window.addEventListener("resize", function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


//=========================================================================================== fog
scene.fog = new THREE.FogExp2(new THREE.Color("black"), 0.0075);

//=========================================================================================== light
var sphereLight = new THREE.SphereGeometry(.05);
var sphereLightMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("white")
});
var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
sphereLightMesh.castShadow = true;
sphereLightMesh.position.set(0, 2.5, 0)
    //scene.add(sphereLightMesh);


var distance = 10;
var intensity = 2.5;

var pointLight2 = new THREE.PointLight(new THREE.Color('white'), intensity / 4, distance);
pointLight2.position.set(0, 0, -10.5);
scene.add(pointLight2);


var pointLight3 = new THREE.PointLight(new THREE.Color('#02a0ac'), intensity, distance);
pointLight3.position.set(0, 0, 5);
scene.add(pointLight3);


var pointLight4 = new THREE.PointLight(new THREE.Color('purple'), intensity, distance);
pointLight4.position.set(0, 0, 2.5);
scene.add(pointLight4);



var light = new THREE.DirectionalLight(new THREE.Color('white'), 1, 400);
light.position.set(0, .10, 4); //push ligth back to cast shadow
light.castShadow = true;
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default



//=========================================================================================== floor
var groundMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color('#fff'),
    specular: new THREE.Color('skyblue'),
    shininess: 50,
});
var groundGeo = new THREE.PlaneGeometry(200, 200);
var ground = new THREE.Mesh(groundGeo, groundMaterial);

ground.position.set(0, 0, 0);
ground.rotation.x = (-Math.PI / 2);
ground.receiveShadow = true;
scene.add(ground);



//===================================================== add model
var loader = new THREE.LegacyJSONLoader();
loader.load("https://raw.githubusercontent.com/baronwatts/models/master/rocks.js", function(geometry, materials) {

    new Array(100).fill(null).map((d, i) => {
        x = Math.cos(i / 100 * Math.PI * 2) * randnum(10, 50);
        z = randnum(0, 50);
        y = -.1;

        var obj = new THREE.Mesh(geometry, materials);
        obj.scale.set(1, 1, 1);
        obj.position.set(x, y, z);
        obj.rotateY(Math.PI / randnum(0, 180));
        scene.add(obj);
    });


});




//===================================================== add model
var loader = new THREE.LegacyJSONLoader();
loader.load("https://raw.githubusercontent.com/baronwatts/models/master/glacier.js", function(geometry, materials) {

    new Array(8).fill(null).map((d, i) => {
        x = Math.cos(i / 8 * Math.PI * 2) * randnum(50, 75);
        z = Math.sin(i / 8 * Math.PI * 2) * randnum(50, 75);
        y = 0;

        var obj = new THREE.Mesh(geometry, materials);
        obj.scale.set(12, randnum(2, 5), 12);
        obj.castShadow = true;
        obj.position.set(x, y, z);
        obj.rotateY(Math.PI / Math.random());
        scene.add(obj);
    });


});




//===================================================== add model
var loader = new THREE.LegacyJSONLoader();
loader.load("https://raw.githubusercontent.com/baronwatts/models/master/iceberg.js", function(geometry, materials) {
    var obj = new THREE.Mesh(geometry, materials);
    obj.scale.set(4, 1, 4);
    obj.castShadow = true;
    obj.position.set(-25, 0, 5);
    obj.rotateY(-Math.PI);
    scene.add(obj);
});




//===================================================== add sky particles
var textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = ''; //allow cross origin loading

const imageSrc = textureLoader.load('https://raw.githubusercontent.com/baronwatts/models/master/snowflake.png');
const shaderPoint = THREE.ShaderLib.points;

uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
uniforms.map.value = imageSrc;

var matts = new THREE.PointsMaterial({
    size: 0.75,
    color: new THREE.Color("skyblue"),
    map: uniforms.map.value,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.75
});

var geo = new THREE.Geometry();
for (var i = 0; i < 500; i++) {
    var star = new THREE.Vector3();
    geo.vertices.push(star);
}

var sparks = new THREE.Points(geo, matts);
sparks.scale.set(1, 1, 1);
scene.add(sparks);

sparks.geometry.vertices.map((d, i) => {
    d.y = randnum(15, 20);
    d.x = randnum(-75, 75);
    d.z = randnum(-75, 75);
});


//===================================================== add model
if (window.innerWidth > 768) {
    var leafs = [];
    loader = new THREE.LegacyJSONLoader();
    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/single-leaf.js', function(geometry, materials) {

        //create leafs
        new Array(500).fill(null).map((d, i) => {
            var matt = new THREE.MeshLambertMaterial({
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide,
                color: new THREE.Color('silver')
            });
            var particle = new THREE.Mesh(geometry, matt);
            particle.position.set(randnum(-10, randnum(10, 20)), 20, randnum(-20, 20));
            particle.scale.set(.5, .5, .5);
            particle.rotateY(Math.random() * 180);
            scene.add(particle);
            5
            leafs.push(particle);
        });

        leafs.map((d, i) => {
            //position
            if (i % 2 == 0) {
                leafs[i].position.y = 0;
            } else {
                TweenMax.to(leafs[i].position, 10, {
                    y: 0,
                    x: randnum(-10, 10),
                    ease: Power2.Linear,
                    delay: 0.025 * i,
                    repeat: -1
                }, 1);
            }
            //rotation
            if (i % 2 == 0) {
                leafs[i].rotation.y = 0;
            } else {
                TweenMax.to(leafs[i], 5, {
                    rotationY: '+=25',
                    ease: Power2.Linear,
                    delay: 0.025 * i,
                    repeat: -1
                }, 1);
            }

        }); //end leafs

    });

} //end if



//===================================================== models
var mixers = [];
var characterGroup = new THREE.Group();
scene.add(characterGroup);

loadModels();

function loadModels() {
    const loader = new THREE.GLTFLoader();

    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/PolarBear.glb', function(gltf) {
        var model = gltf.scene.children[0];
        model.position.set(4, 0, -10);
        model.scale.set(.025, .025, .025);
        model.rotateZ(Math.PI);

        var animation = gltf.animations[0];
        var mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);

        var action = mixer.clipAction(animation);
        action.play();

        gltf.scene.traverse(function(node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.material.side = THREE.DoubleSide;
            }
        });
        scene.add(model);
    });


    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/PolarBear.glb', function(gltf) {
        var model = gltf.scene.children[0];
        model.position.set(-2, 0, -10);
        model.scale.set(.025, .025, .025);


        var animation = gltf.animations[1];
        var mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);

        var action = mixer.clipAction(animation);
        action.play();

        gltf.scene.traverse(function(node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.material.side = THREE.DoubleSide;
            }
        });
        scene.add(model);
    });



    loader.load('https://raw.githubusercontent.com/baronwatts/models/master/PolarCub.glb', function(gltf) {
        var model = gltf.scene.children[0];
        model.position.set(25, 0, -15);
        model.scale.set(.05, .05, .05);
        model.rotateZ(-Math.PI);

        var animation = gltf.animations[0];
        var mixer = new THREE.AnimationMixer(model);
        mixers.push(mixer);

        var action = mixer.clipAction(animation);
        action.play();

        gltf.scene.traverse(function(node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true;
                node.material.side = THREE.DoubleSide;
            }
        });
        characterGroup.add(model);
    });



} //end loadModels




//=========================================================================================== model
loader = new THREE.LegacyJSONLoader();
loader.load('https://raw.githubusercontent.com/baronwatts/models/master/igloo.js', function(geometry, materials) {
    var matt = new THREE.MeshPhongMaterial({
        vertexColors: THREE.FaceColors,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        color: new THREE.Color('white'),
        specular: new THREE.Color('skyblue'),
        //specular: new THREE.Color('#333'),
        shininess: 50,
    });
    var wall = new THREE.Mesh(geometry, matt);
    wall.position.set(0, 0, 0);
    wall.rotateY(Math.PI);
    wall.scale.set(.1, .1, .1);
    scene.add(wall);
});






//=========================================================================================== full screen
var requestFullscreen = function(ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    } else {
        console.log('Fullscreen API is not supported.');
    }
}
var exitFullscreen = function(ele) {
    if (ele.exitFullscreen) {
        ele.exitFullscreen();
    } else if (ele.webkitExitFullscreen) {
        ele.webkitExitFullscreen();
    } else if (ele.mozCancelFullScreen) {
        ele.mozCancelFullScreen();
    } else if (ele.msExitFullscreen) {
        ele.msExitFullscreen();
    } else {
        console.log('Fullscreen API is not supported.');
    }
}


//=========================================================================================== add tweening
//https://greensock.com/forums/topic/16993-threejs-properties/
Object.defineProperties(THREE.Object3D.prototype, {
    x: {
        get: function() {
            return this.position.x;
        },
        set: function(v) {
            this.position.x = v;
        }
    },
    y: {
        get: function() {
            return this.position.y;
        },
        set: function(v) {
            this.position.y = v;
        }
    },
    z: {
        get: function() {
            return this.position.z;
        },
        set: function(v) {
            this.position.z = v;
        }
    },
    rotationZ: {
        get: function() {
            return this.rotation.x;
        },
        set: function(v) {
            this.rotation.x = v;
        }
    },
    rotationY: {
        get: function() {
            return this.rotation.y;
        },
        set: function(v) {
            this.rotation.y = v;
        }
    },
    rotationX: {
        get: function() {
            return this.rotation.z;
        },
        set: function(v) {
            this.rotation.z = v;
        }
    }
});





//=========================================================================================== add Animation
let angle = 0,
    lastTime = null,
    u_frame = 0,
    clock = new THREE.Clock(),
    count = 0,
    prevTime = Date.now(),
    phase = 0;


function moveCharacter() {
    characterGroup.position.x < -85 ? (characterGroup.position.x = 85) : (characterGroup.position.x -= .15);
}

function moveLights() {
    phase += 0.03;
    sphereLightMesh.position.z = 5 - Math.cos(phase) * 5;
    sphereLightMesh.position.x = Math.sin(phase) * 5;
    pointLight3.position.copy(sphereLightMesh.position);

}



//===================================================== mouse
var mouseX = 0;
var mouseY = 0;
var zoomIn = 20;
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / zoomIn;
    mouseY = (event.clientY - window.innerHeight / 2) / zoomIn;
}


(function animate() {
    //update models
    const delta = clock.getDelta();
    mixers.forEach((mixer) => { mixer.update(delta * 1.25); });
    moveCharacter();
    moveLights();



    //VR Mode
    if (VR) {
        effect.render(scene, camera);
        controls.update();
        document.querySelector('.btn-group').classList.add('hide');
    } else {
        renderer.render(scene, camera);
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.lookAt(scene.position);
        document.querySelector('.btn-group').classList.remove('hide');
    }

    requestAnimationFrame(animate);

})();



//set camera position
camera.position.y = 3;
camera.position.z = -25;
camera.position.x = 50;
// -- -- --Portfolio Filter Animation-- -- -- - //
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


prev_btn.addEventListener('click', () => {
    if (currentIndex === 0) {
        currentIndex = 9
    } else {
        currentIndex--
    }
    // console.log(currentIndex);
    changeImage(currentIndex);
});

next_btn.addEventListener('click', () => {
    if (currentIndex === 9) {
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

const counter = document.getElementById("count");

incrementVisitsCount();

function incrementVisitsCount() {
    let visits;

    if (!localStorage.getItem("visits")) localStorage.setItem("visits", 1);
    else {
        visits = +localStorage.getItem("visits");
        const incrementedCount = visits + 1;

        localStorage.setItem("visits", incrementedCount);
    }

    counter.innerText = localStorage.getItem("visits");
}


// visit Cookies
// function nameDefined(ckie, nme) {
//     var splitValues
//     var i
//     for (i = 0; i < ckie.length; ++i) {
//         splitValues = ckie[i].split("=")
//         if (splitValues[0] == nme) return true
//     }
//     return false
// }

// function delBlanks(strng) {
//     var result = ""
//     var i
//     var chrn
//     for (i = 0; i < strng.length; ++i) {
//         chrn = strng.charAt(i)
//         if (chrn != " ") result += chrn
//     }
//     return result
// }

// function getCookieValue(ckie, nme) {
//     var splitValues
//     var i
//     for (i = 0; i < ckie.length; ++i) {
//         splitValues = ckie[i].split("=")
//         if (splitValues[0] == nme) return splitValues[1]
//     }
//     return ""
// }

// function insertCounter() {
//     readCookie()
//     displayCounter()
// }

// function displayCounter() {
//     document.write('<p class="text"  ALIGN="CENTER"  >')
//     document.write("You've visited this page ")
//     if (counters == 1) document.write("the first time.")
//     else document.write(counters + " times.")
//     document.writeln('</p>')
// }

// function readCookie() {
//     var cookie = document.cookie
//     counters = 0
//     var chkdCookie = delBlanks(cookie) //are on the client computer
//     var nvpair = chkdCookie.split(";")
//     if (nameDefined(nvpair, "pageCount"))
//         counters = parseInt(getCookieValue(nvpair, "pageCount"))
//         ++counters
//     var futdate = new Date()
//     var expdate = futdate.getTime()
//     expdate += 3600000 * 24 * 30 //expires in 1 hour
//     futdate.setTime(expdate)

//     var newCookie = "pageCount=" + counters
//     newCookie += "; expires=" + futdate.toGMTString()
//     window.document.cookie = newCookie
// }
// insertCounter();




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
