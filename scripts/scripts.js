const gameBoard = (() => {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    let board = new Array(9).fill('')

    const selectCell = (i, player) => {
        board[i] = player.symbol
    }

    const drawCell = (i, val, onclick) => {
        const c = document.createElement('button')
        c.className = 'board-cell'
        c.innerText = val
        c.onclick = () => onclick(i)
        c.id = `button-${i}`
        return c
    }

    const getFreeCells = () => {
        return board.reduce((arr, cell, i) => cell === '' ? [...arr, i] : arr, [])
    }

    const getHumanWinningCombos = () => {
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === humanPlayer.symbol).length > 1 && combo.filter(cell => board[cell] === '').length > 0)

    }
    const getRobotWinningCombos = () => {
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === aiPlayer.symbol).length > 1 && combo.filter(cell => board[cell] === '').length > 0)

    }

    const getCellValue = (i) => {
        return board[i]
    }

    const onWin = (player) => {
        const overlay = document.getElementById('overlay').className = 'visible'
        const winner = document.getElementById('winner').innerText = player.name + ' Won!'
        const robotWon = document.getElementById('robot-won')
        const humanWon = document.getElementById('human-won')
        if (!player.isHuman) robotWon.innerText = +robotWon.innerText + 1
        if (player.isHuman) humanWon.innerText = +humanWon.innerText + 1
        overlay.className = 'visible'
        winner.innerText = player.name + ' Won!'

    }


    const onTie = () => {
        const overlay = document.getElementById('overlay')
        const winner = document.getElementById('winner')
        overlay.className = 'visible'
        winner.innerText = 'There\'s a tie. Nobody won'
    }

    const gameEnded = () => {
        return gameState.isWon(board, winningCombinations) || gameState.isTied()
    }

    const clickEvent = (i) => {
        const player = gameState.getPlayer()
        if (board[i] === '' && !gameEnded()) {
            selectCell(i, player)
            if (gameState.isWon(board, winningCombinations)) {
                onWin(player)
            } else if (gameState.isTied()) {
                onTie()
            } else {
                gameState.togglePlayer()
            }
        }
        init()
    }

    const drawActive = () => {
        document.getElementById('active-player').innerText = gameState.getPlayer().name
    }
    const drawBoard = () => {
        const parent = document.getElementById('board-container')
        while (parent.hasChildNodes()) {
            parent.firstChild.remove()
        }
        board.forEach((cell, i) => {
            const c = drawCell(i, cell, clickEvent)
            parent.appendChild(c)
        })
    }

    const reset = () => {
        board = new Array(9).fill('')
        const overlay = document.getElementById('overlay')
        overlay.className = 'hidden'
        init()
    }

    const init = () => {
        drawActive()
        drawBoard()
        gameState.checkIfAi()
    }
    return {getCellValue, init, reset, getFreeCells, winningCombinations, getHumanWinningCombos, getRobotWinningCombos}
})()


const Player = (name, symbol, isHuman) => {

    return {name, isHuman, symbol}
}

const ai = (() => {
    const makeMove = () => setTimeout(() => {
        const robotCombos = gameBoard.getRobotWinningCombos()
        const humanCombos = gameBoard.getHumanWinningCombos()

        console.log(robotCombos, humanCombos)
        const winGame = robotCombos.map(combo => combo.filter(cell => gameBoard.getCellValue(cell) === '')[0])
        const sabotage = humanCombos.map(combo => combo.filter(cell => gameBoard.getCellValue(cell) === '')[0])
        console.log(winGame, sabotage)
        const free = winGame.length ? winGame : sabotage.length ? sabotage : gameBoard.getFreeCells()
        const cellNum = free[Math.floor(Math.random() * free.length)]
        const cell = document.getElementById(`button-${cellNum}`)
        cell && cell.click()
    }, 300)
    return {makeMove}
})()

const humanPlayer = Player('Human', '🦸‍♂️', true)

const aiPlayer = Player('Robot', '🤖', false)


const gameState = (() => {
    let activePlayer = Math.random() < 0.5 ? humanPlayer : aiPlayer

    const checkIfAi = () => {
        if (!activePlayer.isHuman) {
            ai.makeMove()
        }
    }
    const getPlayer = () => activePlayer

    const togglePlayer = () => {
        activePlayer = activePlayer === humanPlayer ? aiPlayer : humanPlayer
    }

    const reset = () => {
        activePlayer = Math.random() < 0.5 ? humanPlayer : aiPlayer
        gameBoard.reset()
    }

    const isWon = (board, winningCombinations) => {
        let i = 0
        while (i < winningCombinations.length) {
            let equal = true
            let j = 0
            while (j < winningCombinations[i].length && equal) {
                if (board[winningCombinations[i][j]] !== activePlayer.symbol) equal = false
                j++
            }
            if (equal) return true
            i++
        }
        return false
    }

    const isTied = () => {
        return !gameBoard.getFreeCells().length
    }

    return {getPlayer, togglePlayer, isTied, isWon, reset, checkIfAi}
})()


gameBoard.init()


