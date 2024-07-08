/*############################## BETOLTES REGION ##############################*/

const hatterZene = new Audio('hopes_and_dreams.mp3');
hatterZene.load();
hatterZene.volume = 0.05;


let toggledVOlume = false;
function toggleVolume(){
    if (!toggledVOlume){
        document.getElementById('toggleVol').setAttribute('src', 'volume_off_icon.png');
        document.getElementById('toggleVol').setAttribute('width', '115px');
        hatterZene.volume = 0;
        toggledVOlume = !toggledVOlume;
    }else {
        hatterZene.volume = 0.05;
        document.getElementById('toggleVol').setAttribute('src', 'volume_on_icon.png')
        document.getElementById('toggleVol').setAttribute('width', '100px');
        toggledVOlume = !toggledVOlume;
    }
}
document.getElementById('toggleVol').addEventListener('click', toggleVolume);

const tntKatt = new Audio('minecraft_tnt_effect.mp3');
tntKatt.load();
tntKatt.volume = 0.075;

const sorEffekt = new Audio('minecraft_anvil_effect.mp3');
sorEffekt.load();
sorEffekt.volume = 0.075;

const timeEffekt = new Audio('minecraft_brewing_effect.mp3');
timeEffekt.load();
timeEffekt.volume = 0.075;

const doublerKatt = new Audio('minecraft_xp_effect.mp3')
doublerKatt.load();
doublerKatt.volume = 0.1;

const sikeresKatt = new Audio('minecraft_item_pickup_effect.mp3');
sikeresKatt.load();
sikeresKatt.volume = 0.2;

var kattOffset = false;
const canvas = document.getElementById('crashdownCanvas');
const ctx = canvas.getContext('2d');
const negyzetMeret = 40;
const sorok = 10;
const oszlopok = 10;
const negyzetSzinek = ['#FF1E1E', '#38E54D', '#EBF400', '#332FD0', '#E15FED'];
let grid = [];
let pontSzam = 0;
let szinek = [];

/*############################## BETOLTES REGION END ##############################*/

/*############################## EVENTLISTENER REGION ##############################*/

document.getElementById('toplistaHozzaadas').addEventListener('click', function () {
    const jatekosNev = document.getElementById('jatekosNev').value;
    const score = pontSzam;
    const szinValaszto = document.getElementById('colorSelect');

    if (jatekosNev.length <= 2) {
        alert("Túl rövid név! Minimum 3 karakter hosszú neved lehet.");
        document.getElementById('jatekosNev').value = "";
        return;
    }

    if (jatekosNev.length > 30) {
        alert("Túl hosszú név! Maximum 30 karakter hosszú neved lehet.");
        document.getElementById('jatekosNev').value = "";
        return;
    }

    if (score < 1000) {
        alert("Legalább 1000 pont szükséges ahhoz, hogy felkerülj a toplistára!");
        document.getElementById('jatekosNev').value = "";
        return;
    }


    // id generálás
    const JatekosId = Date.now();

    // adatok átadása JSON-hez toplistához
    const jatekosAdat = {id: JatekosId, name: jatekosNev, score: score, color: szinValaszto.value};
    const siker = toplistaHozzaadas(jatekosAdat);
    document.getElementById('jatekosNev').value = "";
    document.getElementById('jatekosNev').disabled = true;

    if (siker) {
        document.getElementById('jatekosNev').value = "";
        toplistaMegjelenites();
    } else {
        alert("Ez a név már szerepel a toplistán!");
    }
});

// adat felvitele JSONként localstoragebe
function toplistaHozzaadas(jatekosAdat) {
    let toplista = JSON.parse(localStorage.getItem('toplista')) || [];

    // Check if the name already exists in the leaderboard
    const letezoJatekosNev = toplista.find(i => i.name === jatekosAdat.name);

    if (letezoJatekosNev) {
        return false;
    }

    toplista.push(jatekosAdat);
    toplista.sort((a, b) => b.score - a.score); // szkriptnyelvek moment
    localStorage.setItem('toplista', JSON.stringify(toplista));
    return true;
}

// toplista megjelenitese
function toplistaMegjelenites() {
    let toplista = JSON.parse(localStorage.getItem('toplista')) || [];
    const toplistaLista = document.getElementById('toplistaLista');
    toplistaLista.innerHTML = ''; // Clear existing leaderboard

    toplista.forEach((elem, i) => {
        const listaElem = document.createElement('li');
        listaElem.textContent = `${i + 1}. ${elem.name}: ${elem.score} pont (${elem.color} szín)`;
        toplistaLista.appendChild(listaElem);
    });
}

toplistaMegjelenites();

document.getElementById('startNewGame').addEventListener('click', ujJatekInditasaFunc);

document.getElementById('startGameButton').addEventListener('click', function () {
    jatekInditasa();
    timer();
    this.disabled = true;
});

document.getElementById('addRowButton').addEventListener('click', addRow);

document.getElementById('colorSelect').addEventListener('change', function () {
    const selectedColorCount = parseInt(this.value);
    // selectColor
    //console.log('kivalasztott szin:', selectedColorCount);
});


document.addEventListener('DOMContentLoaded', function () {
    const selectedValue = localStorage.getItem('selectedColorCount') || '3'; // alapbol 3
    document.getElementById('colorSelect').value = selectedValue;
});
var remainingTime;

function pluszIdoPowerUp() {
    remainingTime += 15;
}

let vegeAJateknak = false;

const startNewGame = document.getElementById("startNewGame");

function ujJatekInditasaFunc() {
    window.location.reload();
}

startNewGame.addEventListener("click", ujJatekInditasaFunc);

/*############################## EVENTLISTENER REGION END ##############################*/

/*############################## FUGGVENY REGION ##############################*/
function getSzinek(mennyit) {
    szinek = [];
    for (let i = 0; i < mennyit; i++) {
        szinek[i] = negyzetSzinek[i];
    }
}

function addRow() {
    if (kattOffset) {
        return;
    }

    // szimpla uj sor az alapszinekbol
    const ujSor = [];
    for (let j = 0; j < oszlopok; j++) {
        ujSor[j] = {
            color: szinek[Math.floor(Math.random() * szinek.length)], marked: false
        };
    }

    // poweruppok
    const random = Math.random();
    // console.log("random: " + random);
    if (random < 0.075) {
        const cyanSquareIndex = Math.floor(Math.random() * oszlopok); // random indexre a sorban egy duplazo powerup
        ujSor[cyanSquareIndex] = {color: 'cyan', marked: false};
    }

    if (random > 0.95) {
        const pinkSquareIndex = Math.floor(Math.random() * oszlopok); // random indexre a sorban egy sor powerup
        ujSor[pinkSquareIndex] = {color: 'pink', marked: false};
    }

    if (random < 0.1) {
        const greenSquareIndex = Math.floor(Math.random() * oszlopok); // random indexre a sorban egy idő powerup
        ujSor[greenSquareIndex] = {color: 'darkgreen', marked: false};
    }

    if (random > 0.90) {
        const redSquareIndex = Math.floor(Math.random() * oszlopok); // random indexre a sorban egy bomba powerup
        ujSor[redSquareIndex] = {color: '#581845', marked: false};
    }

    // uj sor hozzadobasa a grid aljara
    grid.push(ujSor);

    // gridnek elso sorjat kihajitjuk
    grid.shift();

    drawGrid();
}


function drawGrid() {
    //ezzel tartjuk fent a gridnek a szepseget
    // "szepseget"

    hatterZene.play();
    grid.forEach((sor, i) => {
        sor.forEach((elem, j) => {

            //grid kiszinezese, fekete szelek hozzaadasa
            ctx.fillStyle = elem.color;
            ctx.fillRect(j * negyzetMeret, i * negyzetMeret, negyzetMeret, negyzetMeret);

            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.strokeRect(j * negyzetMeret, i * negyzetMeret, negyzetMeret, negyzetMeret);

            if (elem.color === 'cyan') {
                // ha cian, akkor legyen rajta PÉZ mert duplazza a pontot
                ctx.fillStyle = 'black';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('💵', j * negyzetMeret + 10, i * negyzetMeret + 25);
            }

            if (elem.color === 'pink') {
                // ha pink, legyen cunami mert torli a sort
                ctx.fillStyle = 'black';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('🌊', j * negyzetMeret + 10, i * negyzetMeret + 25);
            }

            if (elem.color === 'darkgreen') {
                // ha zold, hat robban
                ctx.fillStyle = 'black';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('💥', j * negyzetMeret + 10, i * negyzetMeret + 25);
            }
            if (elem.color === '#581845') {
                // Ha ilyen voroses, akkor +30mp
                ctx.fillStyle = 'black';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('⌛', j * negyzetMeret + 10, i * negyzetMeret + 25);
            }
        });
    });

    // for (let i = 0; i < sorok; i++) {
    //     for (let j = 0; j < oszlopok; j++) {
    //         if (i === 9 && grid[i][j].color === 'white') {
    //
    //         }
    //     }
    // }
}

function handleClick(event) {

    if (kattOffset) {
        return;
    }

    // pontos x es y koordinatak
    const x = Math.floor(event.offsetX / negyzetMeret);
    const y = Math.floor(event.offsetY / negyzetMeret);

    //ha feher negyzetre nyomunk, return
    if (grid[y][x].color === 'white') {
        return;
    }

    //ha cian, akkor hajtsuk vegre a powerupot
    if (grid[y][x].color === 'cyan') {
        // eltávolitjuk a cian negyzetet a pályáról
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        doublerKatt.pause();
        doublerKatt.currentTime = 0;
        doublerKatt.play();
        gridUjraRendezes();
        // najd megduplazzuk a pontszamot
        pontSzam *= 2;
        document.getElementById('score').textContent = pontSzam;
        // uj sor es palya szepites
        setTimeout(function () {
            addRow();

        }, 750); // ez a folyamatos kattintas miatt kell
        drawGrid();
    } else if (grid[y][x].color === 'pink') {
        // sortorles
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        sorEffekt.pause();
        sorEffekt.currentTime = 0;
        sorEffekt.play();
        gridUjraRendezes();
        pontSzam += 100;
        document.getElementById('score').textContent = pontSzam
        grid.splice(y, 1);
        const ujFeherSor = [];
        for (let j = 0; j < oszlopok; j++) {
            ujFeherSor.push({color: 'white', marked: false});
        }
        // mivel torlok, tetejere uj sor, implementald kesobb
        grid.unshift(ujFeherSor);
        setTimeout(function () {
            addRow();

        }, 750)
        drawGrid();
    } else if (grid[y][x].color === 'darkgreen') {
        robbantasPowerUp(x, y);
        tntKatt.pause();
        tntKatt.currentTime = 0;
        tntKatt.play();
        pontSzam += 90;
        document.getElementById('score').textContent = pontSzam;
        setTimeout(() => {
            addRow();
        }, 750);
        drawGrid();
    } else if (grid[y][x].color === '#581845') {
        grid[y][x].color = 'white';
        grid[y][x].marked = true;
        timeEffekt.pause();
        timeEffekt.currentTime = 0;
        timeEffekt.play();
        gridUjraRendezes();
        pluszIdoPowerUp();
        setTimeout(() => {
            addRow();
        }, 750);
        drawGrid();
    } else {
        // ha nem powerup negyzet
        const torlendoNegyzetek = getTorlendoNegyzetek(x, y, grid[y][x].color);
        //console.log("hossz: " + torlendoNegyzetek.length);
        if (torlendoNegyzetek.length >= 3) {
            sikeresKatt.pause();
            sikeresKatt.currentTime = 0;
            sikeresKatt.play();
            for (let i = 0; i < torlendoNegyzetek.length; i++) {
                grid[torlendoNegyzetek[i].y][torlendoNegyzetek[i].x].marked = true;
            }
            pontSzam += torlendoNegyzetek.length * 10;
            document.getElementById('score').textContent = pontSzam;
            // torlendoNegyzetek.forEach(negyzet => {
            //     grid[negyzet.y][negyzet.x].marked = true;
            // });

            gridUjraRendezes();
            setTimeout(function () {
                addRow();
            }, 750);

            drawGrid();
        }
    }


}

function robbantasPowerUp(x, y) {
    const startX = Math.max(0, x - 1);
    const endX = Math.min(oszlopok - 1, x + 1);
    const startY = Math.max(0, y - 1);
    const endY = Math.min(sorok - 1, y + 1);

    // a 4 sarka alapjan kijelolni a teruletet
    for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
            grid[i][j].color = 'white';
            grid[i][j].marked = true;
            robbantasTerulete(j, i, 'white');
        }
    }
    gridUjraRendezes();
}

function robbantasTerulete(x, y, color) {
    ctx.clearRect(x * negyzetMeret, y * negyzetMeret, negyzetMeret, negyzetMeret);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x * negyzetMeret, y * negyzetMeret, negyzetMeret, negyzetMeret);
    ctx.fillStyle = color;
    ctx.fillRect(x * negyzetMeret, y * negyzetMeret, negyzetMeret, negyzetMeret);
}

function getTorlendoNegyzetek(x, y, color) {
    const talaltNegyzetekTomb = [];
    const talaltNegyzetek = new Set();
    const sor = [{x, y}];

    while (sor.length > 0) {
        const {x, y} = sor.shift();

        if (x < 0 || x >= oszlopok || y < 0 || y >= sorok || grid[y][x].color !== color || talaltNegyzetek.has(`${x}:${y}`)) continue;

        talaltNegyzetek.add(`${x}:${y}`);
        //console.log('megtalalt: ' + `${x}, ${y}`)
        talaltNegyzetekTomb.push({x, y});

        sor.push({x: x - 1, y}); // balra
        sor.push({x: x + 1, y}); // jobbra
        sor.push({x, y: y - 1}); // fel
        sor.push({x, y: y + 1}); // le
    }
    return talaltNegyzetekTomb;
}


function gridUjraRendezes() {

    kattOffset = true;
        setTimeout(() => {
            kattOffset = false;
        }, 750);

    // AZ A BAJ, hogy rettenet hosszu lenne a kod, ha ez is benne lenne (powerupoknal, handleclicknel)
    // if (szinek.length === 2) {
    //     kattOffset = true;
    //     setTimeout(() => {
    //         // Idozito azert hogy ne lehessen spammelni a 2 szineset
    //         kattOffset = false;
    //     }, 1000);
    // } else {
    //     // 2-nel nagyobb szines gridek
    //     kattOffset = true;
    //     setTimeout(() => {
    //         kattOffset = false;
    //     }, 750);
    //
    // }

    for (let j = 0; j < oszlopok; j++) {
        let ures = 0;
        for (let i = sorok - 1; i >= 0; i--) {
            if (grid[i][j].marked) {
                grid[i][j].color = 'white';
                grid[i][j].marked = false;
                ures++;
            } else if (ures > 0 && grid[i][j].color !== 'white') {
                // animacio xdd
                animacio(i, j, ures);
            }
        }
    }
}

function animacio(startSor, startOszlop, tav) {
    if (szinek.length === 2){
        let lepes = 0;
        const eredetiSzin = grid[startSor][startOszlop].color;
        const eredetiX = startOszlop * negyzetMeret;
        const eredetiY = startSor * negyzetMeret;

        // jelenlegi negyzet eltuntetese
        ctx.clearRect(eredetiX, eredetiY, negyzetMeret, negyzetMeret);

        const animacioInterval = setInterval(() => {
            // jelenlegi negyzet eltuntetese
            ctx.clearRect(eredetiX, eredetiY, negyzetMeret, negyzetMeret);

            // uj pozicio Y-ra a negyzetnek
            // const ujY = startSor + lepes / 5;
            // const ujY = startSor + lepes / 1;
            const ujY = startSor + lepes / 5;


            // negyzet berajzolasa
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(startOszlop * negyzetMeret, ujY * negyzetMeret, negyzetMeret, negyzetMeret);
            ctx.fillStyle = eredetiSzin;
            ctx.fillRect(startOszlop * negyzetMeret, ujY * negyzetMeret, negyzetMeret, negyzetMeret);

            // ilyen blokkos mozgas le xd
            lepes++;

            // ha elerte a tavolasot a negyzet
            if (lepes >= tav * 5) {
                clearInterval(animacioInterval);
                // ami rajta volt szin
                grid[startSor + tav][startOszlop].color = eredetiSzin;
                grid[startSor][startOszlop].color = 'white';

                drawGrid();
            }
        }, 1000 / 120);
    }else{
        let lepes = 0;
        const eredetiSzin = grid[startSor][startOszlop].color;
        const eredetiX = startOszlop * negyzetMeret;
        const eredetiY = startSor * negyzetMeret;

        // jelenlegi negyzet eltuntetese
        ctx.clearRect(eredetiX, eredetiY, negyzetMeret, negyzetMeret);

        const animacioInterval = setInterval(() => {
            // jelenlegi negyzet eltuntetese
            ctx.clearRect(eredetiX, eredetiY, negyzetMeret, negyzetMeret);

            // uj pozicio Y-ra a negyzetnek
            // const ujY = startSor + lepes / 5;
            // const ujY = startSor + lepes / 1;
            const ujY = startSor + lepes / 7;


            // negyzet berajzolasa
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.strokeRect(startOszlop * negyzetMeret, ujY * negyzetMeret, negyzetMeret, negyzetMeret);
            ctx.fillStyle = eredetiSzin;
            ctx.fillRect(startOszlop * negyzetMeret, ujY * negyzetMeret, negyzetMeret, negyzetMeret);

            // ilyen blokkos mozgas le xd
            lepes++;

            // ha elerte a tavolasot a negyzet
            if (lepes >= tav * 7) {
                clearInterval(animacioInterval);
                // ami rajta volt szin
                grid[startSor + tav][startOszlop].color = eredetiSzin;
                grid[startSor][startOszlop].color = 'white';

                drawGrid();
            }
        }, 1000 / 120);
    }


}


function jatekInditasa() {

    kattOffset = false;
    grid = [];
    pontSzam = 0;
    szinek = [];

    const selectedColorCount = parseInt(document.getElementById('colorSelect').value);
    document.getElementById('colorSelect').addEventListener('change', function () {
        // ha color select valtozik, jatek resi
        localStorage.setItem('selectedColorCount', this.value);
        if (kattOffset) {
            return;
        }
        pontSzam = 0;
        document.getElementById('score').textContent = pontSzam;
        ujJatekInditasaFunc();
    });


    //itt indul a real game inditas
    getSzinek(document.getElementById('colorSelect').value);

    // tomb inicializalasa sorokkal
    for (let i = 0; i < sorok; i++) {
        grid[i] = []
        for (let j = 0; j < oszlopok; j++) {
            grid[i][j] = '';
        }
    }

    //szinek beallitasa
    grid.forEach((sor, i) => {
        sor.forEach((elem, j) => {
            grid[i][j] = {
                color: szinek[Math.floor(Math.random() * szinek.length)], marked: false
            };
            //console.log(grid[i][j].color, grid[i][j].marked)

        });
    });


    const cianX = Math.floor(Math.random() * oszlopok);
    const cianY = Math.floor(Math.random() * sorok);
    grid[cianY][cianX].color = 'cyan';

    const pinkX = Math.floor(Math.random() * oszlopok);
    const pinkY = Math.floor(Math.random() * sorok);
    grid[pinkY][pinkX].color = 'pink';

    const pirosX = Math.floor(Math.random() * oszlopok);
    const pirosY = Math.floor(Math.random() * sorok);
    grid[pirosY][pirosX].color = '#581845';

    const zoldX = Math.floor(Math.random() * oszlopok);
    const ZoldY = Math.floor(Math.random() * sorok);
    grid[ZoldY][zoldX].color = 'darkgreen';

    // random generalas, de lehet konnyebben
    // for (let i = 0; i < sorok; i++) {
    //     for (let j = 0; j < oszlopok; j++) {
    //         const random = Math.random();
    //         if (random< 0.02) {
    //             grid[i][j].color = 'darkgreen';
    //         }
    //     }
    // }

    drawGrid();
    canvas.addEventListener('click', handleClick);
}

/*############################## FUGGVENY REGION END ##############################*/


/*############################## IDOZITO REGION ##############################*/
function timer() {
    const idozito = document.getElementById('timerDisplay');
    const lejartAzIdo = document.getElementById('timeUpMessage');
    const toplistaInput = document.getElementById('jatekosNev');
    const toplistaMegjelenites = document.getElementById('appear-leaderboard');
    const ujSorGomb = document.getElementById('addRowButton');
    const szinValaszto = document.getElementById('colorSelect');
    szinValaszto.disabled = true;
    ujSorGomb.disabled = false;
    remainingTime = 119; //mp
    toplistaInput.disabled = true;
    var timerInterval = setInterval(function () {
        const min = Math.floor(remainingTime / 60);
        const sec = remainingTime % 60;
        idozito.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        remainingTime--;

        if (remainingTime < 61) {
            idozito.style.color = 'darkorange';
        }

        if (remainingTime < 31) {
            idozito.style.color = 'red';
        }

        if (remainingTime < 0) {
            clearInterval(timerInterval);
            crashdownCanvas.style.cursor = 'not-allowed';
            lejartAzIdo.style.display = 'block';
            canvas.removeEventListener('click', handleClick);
            toplistaInput.disabled = false;
            toplistaMegjelenites.style.display = 'block';
            ujSorGomb.disabled = true;
            szinValaszto.disabled = false;
            //alert('Lejart az ido');
            vegeAJateknak = true;
        }
    }, 1000);
}

/*############################## IDOZITO REGION END ##############################*/
