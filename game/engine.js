const tank = document.querySelector('.tank');
const enemy = document.querySelector('.img1');
let positionXtank = window.innerWidth / 2 - 25;
let maxY = window.innerHeight - 200;
const projectile = document.querySelector('.projectile');
let life = document.querySelector('.life');
let boom1 = document.querySelector('.boom');
let rema = document.querySelector('.reset');
life_in = 10
let spore1 = document.querySelector('.spore');
let spore = 0

let projectiles1 = []
let projectiles2 = []
let tanks = []
let I_am = [tank]

function boom(x, y) {
    clonedBoom = boom1.cloneNode(false);
    clonedBoom.style.top = `${y}px`;
    clonedBoom.style.left = `${x}px`;
    clonedBoom.style.display = 'block';
    document.body.appendChild(clonedBoom);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
    setTimeout(() => {
        clonedBoom.remove();
    }, 100);
}

function smoothMoveY(element, speed, stopY) {
    // Ïîëó÷àåì íà÷àëüíîå çíà÷åíèå top; åñëè åãî íåò, óñòàíàâëèâàåì 0.
    let initialY = parseFloat(getComputedStyle(element).top);
    if (isNaN(initialY)) {
        initialY = 0;
        element.style.top = "0px";
    }

    let startTime = null;
    let requestId; // èäåíòèôèêàòîð çàïðîñà àíèìàöèîííîãî êàäðà

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const deltaY = speed * (elapsed / 1000) * 50; // èçìåíåíèå ïîçèöèè â ïèêñåëÿõ çà ïðîøåäøåå âðåìÿ
        const newY = initialY + deltaY;

        element.style.top = newY + "px";

        // Ïðîâåðêà óñëîâèÿ îñòàíîâêè:
        // Åñëè äâèæåìñÿ âíèç (speed > 0) è íîâàÿ ïîçèöèÿ áîëüøå èëè ðàâíà stopY,
        // èëè åñëè äâèæåìñÿ ââåðõ (speed < 0) è íîâàÿ ïîçèöèÿ ìåíüøå èëè ðàâíà stopY,
        // òî óñòàíàâëèâàåì ïîçèöèþ ðîâíî â stopY è ïðåðûâàåì àíèìàöèþ.
        let h = false
        if (speed < 0) {
            if (checkCollisionsWithList(element, projectiles2)) {
                h = true
            }
        } else {
            if (checkCollisionsWithList(element, projectiles1)) {
                h = true
            }
        }
        if ((speed > 0 && newY >= stopY) || (speed < 0 && newY <= stopY) || (h)) {
            element.style.top = stopY + "px";
            cancelAnimationFrame(requestId);
            if (speed > 0) {
                removeObjectFromList(element, projectiles2);
            } else {
                removeObjectFromList(element, projectiles1);
            }
            element.remove();
            return;
        }

        requestId = requestAnimationFrame(step);
    }

    requestId = requestAnimationFrame(step);
}

function checkCollision(rect1, rect2) {
    const rect1Width = rect1.width || 50;
    const rect1Height = rect1.height || 50;

    const rect2Width = rect2.width || 100; 
    const rect2Height = rect2.height || 100;

    if (rect1.x < rect2.x + rect2Width &&
        rect1.x + rect1Width > rect2.x &&
        rect1.y < rect2.y + rect2Height &&
        rect1.y + rect1Height > rect2.y) {
        return true;
    }
    return false;
}

function removeObjectFromList(object, objectList) {
    const index = objectList.findIndex(obj => obj === object);
    if (index !== -1) {
        objectList.splice(index, 1);
    }
}

function checkCollisionsWithList(targetObject, objectList) {
    for (let obj of objectList) {
        if (checkCollision(targetObject, obj)) {
            return true;
        }
    }
    return false;
}

function decreaseHealth() {
    life_in = life_in - 1
    life.textContent = life_in
}

function isTouching(element1, element2, y, x) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    let f = false
    if (rect1.left - x < rect2.left + x && rect1.left + x > rect2.left - x) {
        if (rect1.top - y < rect2.top + y && rect1.top + y > rect2.top - y) {
            f = true
        }
    }
    return f
}

function getRandomValue(s, t) {
    return Math.random() * (t - s) + s;
}

function fire_in(x, y, i) {
    const clonedroPectile = projectile.cloneNode(false);
    clonedroPectile.style.top = `${y + 40}px`;
    clonedroPectile.style.left = `${x + 100}px`;

    let rotate, max, k
    if (i) {
        rotate = 0
        max = 0
        k = -30
        projectiles1.push(clonedroPectile);
        
    } else {
        rotate = 180
        max = maxY
        k = 20
        projectiles2.push(clonedroPectile);
    }
    clonedroPectile.style.transform = `rotate(${rotate}deg)`
    clonedroPectile.style.display = 'block';
    document.body.appendChild(clonedroPectile);
    smoothMoveY(clonedroPectile, k, max);
    let life = true
    let tir = true
    let h0 = 70
    let h1 = 150


    setInterval(() => {
        if (!life) {
            
            if (i) {
                removeObjectFromList(clonedroPectile, projectiles1);
            } else {
                removeObjectFromList(clonedroPectile, projectiles2);
            }
            clonedroPectile.remove();
            return;
        }
        if (isTouching(clonedroPectile, tank, 20, 40) && !i) {
            if (tir) {
                tir = false
                boom(x + h0, y + h1);
            }
            life = false
            decreaseHealth();
            clonedroPectile.remove();
        }
        if (y - 0 > max && !i) {
            if (tir) {
                tir = false
                boom(x + h0, y + h1);
            }
            life = false
            clonedroPectile.remove();
        } else {
            if (y + 200 < max && i) {
                if (tir) {
                    tir = false
                    boom(x + h0, y + h1);
                }
                life = false
                clonedroPectile.remove();
            }
        }
    }, 100)
}

function createTank(r){
    const clonedTank = enemy.cloneNode(false);
    let positionY = 10;
    let positionX = getRandomValue(100, window.innerWidth - 100) - 200;
    tanks.push(clonedTank);
    setInterval(() => {
        clonedTank.style.top = `${positionY}px`;
        clonedTank.style.left = `${positionX}px`;
    }, 100);
    clonedTank.style.display = 'block';
    document.body.appendChild(clonedTank); 
    let dead = false
    let tir = true

    let fire = 0;
    let g = getRandomValue(1, 7);
    setInterval(() => {
        fire = fire + 1 
        if (dead) {
            
            if (tir) {
                tir = false
                boom(x + 90, y - 180);
            }
            removeObjectFromList(clonedTank, tanks)
            clonedTank.remove();
        }

        if (fire >= g && !dead) {
            fire_in(positionX, positionY, false);
            fire = 0;
            g = getRandomValue(3, 9);
        }

        if (isTouching(clonedTank, tank, 70, 50)) {
            spore = spore + 10
            dead = true
            decreaseHealth();

        }
        if (positionY + 50 < maxY){
            positionY = positionY + 10
        } else {
            dead = true
        }
        if (checkCollisionsWithList(clonedTank, projectiles1)) {
            spore = spore + 100
            dead = true
        }
    }, 100)
}

let r = 1
let reset = 0
let rar = true
let f = 0

setInterval(() => {
    if (f == 2000) {
        r = r * 1.1
        createTank(r)
        f = 0
    }
    f = f + 20
    spore = spore + 1
    spore1.textContent = spore
    if (life_in <= 0) {
        console.log(spore)
        const targetPage = "../spore/sp.html";
        const url = `${targetPage}?spore=${encodeURIComponent(spore)}`;
        window.location.href = url;
    }
}, 20);

document.addEventListener('keydown', function (event) {
    if (event.key == ' ') {
        if (reset == 0) {
            reset = 100
            tiy = tank.getBoundingClientRect();
            x = tiy.left - 80
            y = tiy.top - 50
            fire_in(x, y, true)
            rema.textContent = reset / 100
        }
        if (reset != 0 && rar) {
            rar = false
            let interval = setInterval(() => {
                rema.textContent = reset / 100

                if (reset > 0) {
                    reset--;
                } else {
                    rar = true
                    clearInterval(interval);
                    console.log("reset");
                }
            }, 1);
        }
    }
});
let moveLeft = false
let moveRight = false
const speed = 5;

document.addEventListener('keydown', function (event) {
    if (event.code === 'KeyA') {
    moveLeft = true;
    }
    if (event.code === 'KeyD') {
        moveRight = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'KeyA') {
    moveLeft = true;
    }
    if (event.code === 'KeyD') {
        moveRight = true;
    }
});

function moveTank() {
    tay = tank.getBoundingClientRect();

    if (moveLeft) {
        if (tay.left - speed - 82 > -50) {
        tank.style.left = (tay.left - speed - 82) + 'px';
        }
    }

    if (moveRight) {
        if (tay.left + speed - 55 < window.innerWidth - 200) {
            tank.style.left = (tay.left + speed - 55) + 'px';
        }
    }
    requestAnimationFrame(moveTank);
}

requestAnimationFrame(moveTank);
