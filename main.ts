const questions = [{
  "question": "You are waiting for you teacher before class, some kids decide to bully a small kid due to race",
  "good": "Step in",
  "bad": "Ignore the situation"
},
{
  "question": "Do you decide to..",
  "good": "Talk",
  "bad": "Fight"
}]


const rooms = {
  0: {
    "intro": "You have woken up in the middle of the forest",
    "details": "You look ahead and notice something dark"
  },
  1: {
    "intro": "You have entered a dark valley",
    "details": "its very quiet"
  }
}

const map = [
  [null,    1, null],
  [null,    0, null],
  [null, null, null]
]

class AdventureEngine {
  rooms: any
  map: any
  print: any
  width: number
  height: number
  startX: number
  startY: number
  stateX: number
  stateY: number

  constructor(rooms, map, width, height, startX, startY) {
    this.rooms = rooms
    this.map = map
    this.width = width
    this.height = height

    this.startX = startX
    this.startY = startY

    this.stateX = startX
    this.stateY = startY
  }

  submitCommand(command: string) {
    this.processCommand(command.split(' '))
  }

  processCommand(command: Array<string>) {
    if (command[0] === '?' || command[0] === 'help') {
      this.print('You can do the following things:')
      this.print('? or help: show this menu')
      this.print('look: have a look around')
      this.print('go <direction>: walk in that direction')
    } else if (command[0] === 'look') {
      this.look()
    } else if (command[0] === 'go' || command[0] === 'move' || command[0] === 'walk') {
      this.go(command[1])
    }
  }

  checkLegalPosition(posX, posY) {
    return !(posY < 0 || posY >= this.height || posX < 0 || posX >= this.width || this.map[posY][posX] === null)
  }

  go(direction: string) {
    if (direction === 'forwards' || direction === 'f' || direction === 'up' || direction === 'u') {
      const newStateY = this.stateY - 1
      if (this.checkLegalPosition(this.stateX, newStateY)) {
        this.stateY = newStateY
        this.printIntro()
      } else {
        this.print('I cannot go that way chump!')
      }
    } else if (direction === 'backwards' || direction === 'b' || direction === 'back') {
      const newStateY = this.stateY + 1
      if (this.checkLegalPosition(this.stateX, newStateY)) {
        this.stateY = newStateY
        this.printIntro()
      } else {
        this.print('I cannot go that way chump!')
      }
    } else if (direction === 'left' || direction === 'l') {
      const newStateX = this.stateX - 1
      if (this.checkLegalPosition(newStateX, this.stateY)) {
        this.stateX = newStateX
        this.printIntro()
      } else {
        this.print('I cannot go that way chump!')
      }
    } else if (direction === 'right' || direction === 'r') {
      const newStateX = this.stateX + 1
      if (this.checkLegalPosition(newStateX, this.stateY)) {
        this.stateX = newStateX
        this.printIntro()
      } else {
        this.print('I cannot go that way chump!')
      }
    }
  }

  look() {
    this.print(this.getRoom().details)
  }

  onPrint(func: any) {
    this.print = func
  }

  getRoom() {
    return this.rooms[this.map[this.stateY][this.stateX]]
  }

  printIntro() {
    this.print(this.getRoom().intro)
  }

  start() {
    this.printIntro()
  }
}

const game = new AdventureEngine(rooms, map, 3, 3, 1, 1)

const commandForm = document.getElementById('commandForm')
const commandInput: HTMLInputElement = <HTMLInputElement>document.getElementById('command')
const consoleList: HTMLUListElement = <HTMLUListElement>document.getElementById("console")

game.onPrint((text) => {
  const entry = document.createElement('li');
  entry.setAttribute('class', 'consoleText')
  entry.appendChild(document.createTextNode(text))
  consoleList.appendChild(entry)
})

commandForm.onsubmit = (event) => {
  event.preventDefault()
  game.submitCommand(commandInput.value)
  commandInput.value = ''
}

game.start()

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
