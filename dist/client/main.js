var questions = [{
        "question": "You are waiting for you teacher before class, some kids decide to bully a small kid due to race",
        "good": "Step in",
        "bad": "Ignore the situation"
    },
    {
        "question": "Do you decide to..",
        "good": "Talk",
        "bad": "Fight"
    }];
var rooms = {
    0: {
        "intro": "You have woken up in the middle of the forest",
        "details": "You look ahead and notice something dark"
    },
    1: {
        "intro": "You have entered a dark valley",
        "details": "its very quiet"
    }
};
var map = [
    [null, 1, null],
    [null, 0, null],
    [null, null, null]
];
var AdventureEngine = (function () {
    function AdventureEngine(rooms, map, width, height, startX, startY) {
        this.rooms = rooms;
        this.map = map;
        this.width = width;
        this.height = height;
        this.startX = startX;
        this.startY = startY;
        this.stateX = startX;
        this.stateY = startY;
    }
    AdventureEngine.prototype.submitCommand = function (command) {
        this.processCommand(command.split(' '));
    };
    AdventureEngine.prototype.processCommand = function (command) {
        if (command[0] === '?' || command[0] === 'help') {
            this.print('You can do the following things:');
            this.print('? or help: show this menu');
            this.print('look: have a look around');
            this.print('go <direction>: walk in that direction');
        }
        else if (command[0] === 'look') {
            this.look();
        }
        else if (command[0] === 'go' || command[0] === 'move' || command[0] === 'walk') {
            this.go(command[1]);
        }
    };
    AdventureEngine.prototype.checkLegalPosition = function (posX, posY) {
        return !(posY < 0 || posY >= this.height || posX < 0 || posX >= this.width || this.map[posY][posX] === null);
    };
    AdventureEngine.prototype.go = function (direction) {
        if (direction === 'forwards' || direction === 'f' || direction === 'up' || direction === 'u') {
            var newStateY = this.stateY - 1;
            if (this.checkLegalPosition(this.stateX, newStateY)) {
                this.stateY = newStateY;
                this.printIntro();
            }
            else {
                this.print('I cannot go that way chump!');
            }
        }
        else if (direction === 'backwards' || direction === 'b' || direction === 'back') {
            var newStateY = this.stateY + 1;
            if (this.checkLegalPosition(this.stateX, newStateY)) {
                this.stateY = newStateY;
                this.printIntro();
            }
            else {
                this.print('I cannot go that way chump!');
            }
        }
        else if (direction === 'left' || direction === 'l') {
            var newStateX = this.stateX - 1;
            if (this.checkLegalPosition(newStateX, this.stateY)) {
                this.stateX = newStateX;
                this.printIntro();
            }
            else {
                this.print('I cannot go that way chump!');
            }
        }
        else if (direction === 'right' || direction === 'r') {
            var newStateX = this.stateX + 1;
            if (this.checkLegalPosition(newStateX, this.stateY)) {
                this.stateX = newStateX;
                this.printIntro();
            }
            else {
                this.print('I cannot go that way chump!');
            }
        }
    };
    AdventureEngine.prototype.look = function () {
        this.print(this.getRoom().details);
    };
    AdventureEngine.prototype.onPrint = function (func) {
        this.print = func;
    };
    AdventureEngine.prototype.getRoom = function () {
        return this.rooms[this.map[this.stateY][this.stateX]];
    };
    AdventureEngine.prototype.printIntro = function () {
        this.print(this.getRoom().intro);
    };
    AdventureEngine.prototype.start = function () {
        this.printIntro();
    };
    return AdventureEngine;
}());
var game = new AdventureEngine(rooms, map, 3, 3, 1, 1);
var commandForm = document.getElementById('commandForm');
var commandInput = document.getElementById('command');
var consoleList = document.getElementById("console");
game.onPrint(function (text) {
    var entry = document.createElement('li');
    entry.setAttribute('class', 'consoleText');
    entry.appendChild(document.createTextNode(text));
    consoleList.appendChild(entry);
});
commandForm.onsubmit = function (event) {
    event.preventDefault();
    game.submitCommand(commandInput.value);
    commandInput.value = '';
};
game.start();
// const consoleList = document.getElementById("consoleList")
// const goodButton = document.getElementById("good")
// const badButton = document.getElementById("bad")
// let i = 0;
// consoleList.innerText = questions[i].question
// goodButton.innerText = questions[i].good
// badButton.innerText = questions[i].bad
// goodButton.onclick = (event) => {
//   i++
//   consoleList.innerText = questions[i].question
//   goodButton.innerText = questions[i].good
//   badButton.innerText = questions[i].bad
// }
// badButton.onclick = (event) => {
//   consoleList.innerText = "Wrong kiddo"
// }
