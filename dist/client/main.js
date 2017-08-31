var items = {
    0: {
        "description": "A Hat!"
    }
};
var rooms = {
    0: {
        "intro": "You have woken up in the middle of the forest",
        "return": "You are in the middle of the forest",
        "details": "You look ahead and notice something dark"
    },
    1: {
        "intro": "You have entered a dark valley",
        "details": "its very quiet, but you hear something on the left"
    },
    2: {
        "intro": "You walk up to a tree",
        "details": "You see a boy on the floor who seems hurt, you need to make a choice",
        "actions": {
            "help the boy": {
                "message": "The boy thanks you and give you a hat",
                "reward": 0
            },
            "leave him": {
                "message": "The boy pleads for help"
            }
        }
    }
};
var map = [
    [2, 1, null],
    [null, 0, null],
    [null, null, null]
];
var AdventureEngine = (function () {
    function AdventureEngine(rooms, map, width, height, startX, startY) {
        this.rooms = JSON.parse(JSON.stringify(rooms)); // deep copy
        this.map = map;
        this.width = width;
        this.height = height;
        this.startX = startX;
        this.startY = startY;
        this.stateX = startX;
        this.stateY = startY;
    }
    AdventureEngine.prototype.submitCommand = function (command) {
        if (this.roomActions() && this.parseActionCommand(command)) {
            return;
        }
        else {
            this.processCommand(command.split(' '));
        }
    };
    AdventureEngine.prototype.processCommand = function (command) {
        if (command[0] === '?' || command[0] === 'help') {
            this.print('You can do the following things:', 'gm');
            this.print('? or help: show this menu', 'action');
            this.print('look: have a look around', 'action');
            this.print('go <direction>: walk in that direction, where direction is north/east/south/west or n/e/s/w or left/right/forward/back', 'action');
        }
        else if (command[0] === 'look') {
            this.look();
        }
        else if (command[0] === 'go' || command[0] === 'move' || command[0] === 'walk') {
            this.go(command[1]);
        }
        else {
            this.print('I can\'t do that dave', 'gm');
        }
    };
    AdventureEngine.prototype.parseActionCommand = function (command) {
        var actionsObj = this.roomActions();
        if (actionsObj) {
            var actions = Object.keys(actionsObj).map(function (actionKey) { return actionKey.toLowerCase(); });
            for (var i = 0; i < actions.length; i++) {
                var actionKey = actions[i];
                if (command === actionKey) {
                    var action = actionsObj[actionKey];
                    this.getRoom().actionDone = true;
                    this.print(action.message, 'gm');
                    return true;
                }
            }
            return false;
        }
    };
    AdventureEngine.prototype.checkLegalPosition = function (posX, posY) {
        return !(posY < 0 || posY >= this.height || posX < 0 || posX >= this.width || this.map[posY][posX] === null);
    };
    AdventureEngine.prototype.roomActions = function () {
        return this.getRoom().actions;
    };
    AdventureEngine.prototype.handleActions = function () {
        var _this = this;
        var actionsObj = this.roomActions();
        if (actionsObj) {
            var actions = Object.keys(actionsObj);
            this.print("You are able to do the following actions:", 'gm');
            actions.forEach(function (actionKey) {
                var action = actionsObj[actionKey];
                _this.print(actionKey, 'action');
            });
        }
    };
    AdventureEngine.prototype.visitRoom = function (posX, posY) {
        if (this.checkLegalPosition(posX, posY)) {
            this.stateX = posX;
            this.stateY = posY;
            this.printIntro();
            this.markRoomVisited();
        }
        else {
            this.print('I cannot go that way chump!', 'gm');
        }
    };
    AdventureEngine.prototype.go = function (direction) {
        if (direction === 'forwards' || direction === 'forward' || direction === 'f' || direction === 'up' || direction === 'u' || direction === 'north' || direction === 'n') {
            var newStateY = this.stateY - 1;
            this.visitRoom(this.stateX, newStateY);
        }
        else if (direction === 'backwards' || direction === 'backward' || direction === 'b' || direction === 'back' || direction === 'south' || direction === 's') {
            var newStateY = this.stateY + 1;
            this.visitRoom(this.stateX, newStateY);
        }
        else if (direction === 'left' || direction === 'l' || direction === 'west' || direction === 'w') {
            var newStateX = this.stateX - 1;
            this.visitRoom(newStateX, this.stateY);
        }
        else if (direction === 'right' || direction === 'r' || direction === 'east' || direction === 'e') {
            var newStateX = this.stateX + 1;
            this.visitRoom(newStateX, this.stateY);
        }
    };
    AdventureEngine.prototype.look = function () {
        if (!this.getRoom().actionDone) {
            this.print(this.getRoom().details, 'gm');
            this.handleActions();
        }
        else {
            this.print('nothing left here', 'gm');
        }
    };
    AdventureEngine.prototype.onPrint = function (func) {
        this.print = func;
    };
    AdventureEngine.prototype.getRoom = function () {
        return this.rooms[this.map[this.stateY][this.stateX]];
    };
    AdventureEngine.prototype.printIntro = function () {
        var room = this.getRoom();
        if (room.visited && room["return"]) {
            this.print(room["return"], 'gm');
        }
        else {
            this.print(room.intro, 'gm');
        }
    };
    AdventureEngine.prototype.markRoomVisited = function () {
        this.getRoom().visited = true;
    };
    AdventureEngine.prototype.start = function () {
        this.printIntro();
        this.markRoomVisited();
    };
    return AdventureEngine;
}());
var game = new AdventureEngine(rooms, map, 3, 3, 1, 1);
var commandForm = document.getElementById('commandForm');
var commandInput = document.getElementById('command');
var consoleList = document.getElementById('console');
game.onPrint(function (text, textClass) {
    var entry = document.createElement('li');
    entry.setAttribute('class', "consoleText " + textClass);
    entry.appendChild(document.createTextNode(text));
    consoleList.appendChild(entry);
    consoleList.scrollTop = consoleList.scrollHeight;
});
commandForm.onsubmit = function (event) {
    event.preventDefault();
    var entry = document.createElement('li');
    entry.setAttribute('class', 'consoleText you');
    entry.appendChild(document.createTextNode(commandInput.value));
    consoleList.appendChild(entry);
    game.submitCommand(commandInput.value.toLowerCase());
    commandInput.value = '';
    consoleList.scrollTop = consoleList.scrollHeight;
};
game.start();
