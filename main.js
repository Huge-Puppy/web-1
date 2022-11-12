// print speed in letters per second
let printSpeed = 15;
// size of h1 letters in em
let h1LetterWidth = 1.2;
let h1LetterHeight = 2.0;

function moveH1Cursor(el, start, count) {
    return moveCursor(el, count, start, h1LetterWidth);
}

function cursorH1Return(el, start) {
    return cursorReturn(el, start, h1Letterheight);
}

// at a rate of printSpeed, move cursor to the right by one letter width
function moveCursor(el, count, start, width, noblink) {
    if (count == 0) {
        return;
    }
    if (count == 0 && noblink === undefined) {
        el.classList.add("blinker");
        return;
    }
    var currLeft = parseFloat(start.slice(0, start.length-2));
    var newLeft = currLeft + width;
    let formattedLeft = `${newLeft}em`;
    el.style.left = formattedLeft;
    setTimeout(() => moveCursor(el, count-1, formattedLeft, width), 1000/printSpeed, noblink)
}

// go down a line and to the start
function cursorReturn(el, startLeft, startTop, height) {
    el.style.left = startLeft;
    var currTop = parseFloat(startTop.slice(0, startTop.length-2));
    var newTop = currTop + height;
    let formattedTop = `${newTop}em`;
    el.style.top = formattedTop;
}

// at a rate of printSpeed, add letters to the element
function printText(text, el) {
    if (text == "") {
        return;
    }
    el.innerHTML += text.slice(0,1);
    setTimeout(() => printText(text.slice(1,text.length), el), 1000/printSpeed);
}

function animateLine(text, textEl, cursorEl, startLeft) {
    printText(text, textEl);
    moveCursor(cursorEl, text.length, startLeft, 1.2);
    return 1000 / printSpeed * text.length;
}

function lineReturn(container, response) {
    let newLine = document.createElement("h1");
    if (response) {
        newLine.innerHTML = "> ";
    }
    container.appendChild(newLine);
    return newLine;
}

function createNewLine(container, cursor, startLeft, startTop, height) {
    let newElement = lineReturn(container, true);
    cursorReturn(cursor, startLeft, startTop, height);
    return newElement;
}

function getAnswer(container, cursor, startLeft, startTop, height) {
    let line = createNewLine(container, cursor, startLeft, startTop, height)
    cursor.classList.add("blinker");
    // add listener that adds text as they type
    var timerId;
    container.addEventListener("keydown", getKeystrokes = (event) => {
        if (event.code == "Enter") {
            // destroy listener;
            container.removeEventListener("keydown", getKeystrokes);
            // TODO initiate loading sequence
            // TODO send request to api to get response
            // TODO create a new line
            // TODO print response on the line
            // TODO after printing call getAnswer
            return;
        }
        console.log(event.code);
        if (
            event.code == "MetaLeft" 
            || event.code == "MetaRight"
            || event.code == "AltRight"
            || event.code == "AltLeft"
            || event.code == "ControlLeft"
            || event.code == "Tab"
            || event.code == "ShiftLeft"
            || event.code == "ShiftRight"
            || event.code == "CapsLock"
        ) {
            return;
        }
        if (event.code == "Backspace") {
            var newLeft = parseFloat(startLeft.slice(0, startLeft.length-2)) + (1.2*line.innerHTML.length-6);
            moveCursor(cursor, 1, newLeft + "em", -1.2, true)
            line.innerHTML = line.innerHTML.slice(0, line.innerHTML.length -1)
            return;
        }
        window.typeEvent = event;
        // remove blink from cursor class
        cursor.classList.remove("blinker");
        // add timer that adds it again if typing stops, debounced. 
        if (timerId) {
            clearTimeout(timerId);
            cursor.classList.remove("blinker");
        }
        timerId = setTimeout(() => {
            cursor.classList.add("blinker");
        }, 500);
        // TODO wrap cursor when necessary
        // move cursor one space
        // get new startleft value
        var newLeft = parseFloat(startLeft.slice(0, startLeft.length-2)) + (1.2*line.innerHTML.length-6);
        moveCursor(cursor, 1, newLeft + "em", 1.2, true)
        line.innerHTML += event.key;
    });
}


// _____ EXECUTION ______ //
let body = document.getElementById("body");
let currLine = lineReturn(body);
let cursor = document.getElementById("cursor");

let delay = animateLine("Hi, I'm Jared Lambert.", currLine, cursor, "0.5em")
setTimeout(() => getAnswer(body, cursor, "2.9em","1.6em", 3.5), delay + 500);
// _____ EXECUTION ______ //