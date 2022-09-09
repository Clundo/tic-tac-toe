const gameBoard = (() => {
    const winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    let board = new Array(9).fill('')
    let isHardMode = false
    let isEasyMode = false
    let isExtremeMode = false

    const setHardMode = () => {
        isHardMode = true
        isEasyMode = false
        isExtremeMode = false
        const easyButton = document.getElementById('easy-button')
        const normalButton = document.getElementById('normal-button')
        const hardButton = document.getElementById('hard-button')
        const extremeButton = document.getElementById('extreme-button')

        extremeButton.className = 'inactive-button'
        easyButton.className = 'inactive-button'
        normalButton.className = 'inactive-button'
        hardButton.className = 'active-button'
    }

    const setEasyMode = () => {
        isHardMode = false
        isEasyMode = true
        isExtremeMode = false

        const easyButton = document.getElementById('easy-button')
        const normalButton = document.getElementById('normal-button')
        const hardButton = document.getElementById('hard-button')
        const extremeButton = document.getElementById('extreme-button')

        extremeButton.className = 'inactive-button'
        easyButton.className = 'active-button'
        normalButton.className = 'inactive-button'
        hardButton.className = 'inactive-button'
    }

    const setNormalMode = () => {
        isHardMode = false
        isEasyMode = false
        isExtremeMode = false

        const easyButton = document.getElementById('easy-button')
        const normalButton = document.getElementById('normal-button')
        const hardButton = document.getElementById('hard-button')
        const extremeButton = document.getElementById('extreme-button')

        extremeButton.className = 'inactive-button'
        easyButton.className = 'inactive-button'
        normalButton.className = 'active-button'
        hardButton.className = 'inactive-button'
    }

    const setExtremeMode = () => {
        isHardMode = false
        isEasyMode = false
        isExtremeMode = true

        const easyButton = document.getElementById('easy-button')
        const normalButton = document.getElementById('normal-button')
        const hardButton = document.getElementById('hard-button')
        const extremeButton = document.getElementById('extreme-button')

        extremeButton.className = 'active-button'
        easyButton.className = 'inactive-button'
        normalButton.className = 'inactive-button'
        hardButton.className = 'inactive-button'
    }

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
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === humanPlayer.symbol).length > 1 && combo.filter(cell => board[cell] === '').length === 1)[0] ?? []

    }
    const getRobotHalfCombos = () => {
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === aiPlayer.symbol).length === 1 && combo.filter(cell => board[cell] === '').length === 2)[0] ?? []
    }
    const getHumanHalfCombos = () => {
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === humanPlayer.symbol).length === 1 && combo.filter(cell => board[cell] === '').length === 2)[0] ?? []
    }
    const getRobotWinningCombos = () => {
        return winningCombinations.filter(combo => combo.filter(cell => board[cell] === aiPlayer.symbol).length > 1 && combo.filter(cell => board[cell] === '').length === 1)[0] ?? []
    }

    const getCellValue = (i) => {
        return board[i]
    }

    const onWin = (player) => {
        const overlay = document.getElementById('overlay')
        const winner = document.getElementById('winner')
        const robotWon = document.getElementById('robot-won')
        const humanWon = document.getElementById('human-won')
        if (!player.isHuman) {
            robotWon.innerText = +robotWon.innerText + 1
        }
        if (player.isHuman) {
            humanWon.innerText = +humanWon.innerText + 1
        }

        overlay.className = 'visible'
        winner.innerText = player.name + ' Won!'
    }


    const onTie = () => {
        const overlay = document.getElementById('overlay')
        const winner = document.getElementById('winner')
        overlay.className = 'visible'
        winner.innerText = 'Tie. Nobody won'


    }

    const gameEnded = () => {
        return gameState.isWon(board, winningCombinations) || gameState.isTied()
    }

    const getBoard = () => {

        return board
    }

    const clickEvent = (i) => {
        const player = gameState.getPlayer()

        if (board[i] === '' && !gameEnded()) {
            selectCell(i, player)
            if (gameState.isWon()) {
                onWin(player)
            } else if (gameState.isTied()) {
                onTie()
            } else {
                gameState.togglePlayer()
            }
        }
        init()
    }

    const drawActiveCell = () => {
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

    const init = async () => {
        if(isEasyMode) setEasyMode()
        if(isHardMode) setHardMode()
        if(isExtremeMode) setExtremeMode()
        if(!isHardMode && !isEasyMode && !isExtremeMode) setNormalMode()
        drawActiveCell()
        drawBoard()
        !gameEnded() && gameState.checkIfAi()
    }

    const getDifficulty = () => {
        return isEasyMode ? 0.1 : isHardMode ? 0.8 : isExtremeMode ? 1.0 : 0.5
    }
    const getWinningCombinations = () => {
        return winningCombinations
    }
    return {
        getRobotHalfCombos,
        getHumanHalfCombos,
        getCellValue,
        init,
        reset,
        getFreeCells,
        getWinningCombinations,
        getHumanWinningCombos,
        getRobotWinningCombos,
        getBoard,
        getDifficulty,
        setEasyMode,
        setNormalMode,
        setHardMode,
        setExtremeMode
    }
})()


const Player = (name, symbol, isHuman) => {

    return {name, isHuman, symbol}
}

const ai = (() => {


    const selectBestMove = () => {
        const freeCells = gameBoard.getFreeCells()
        const robotCombos = gameBoard.getRobotWinningCombos()
        const humanHalfCombos = gameBoard.getHumanHalfCombos()
        const humanCombos = gameBoard.getHumanWinningCombos()
        const robotHalfCombos = gameBoard.getRobotHalfCombos()

        const difficultyRating = Math.random()
        const difficulty = gameBoard.getDifficulty()
        const moves = difficultyRating > difficulty ? freeCells : robotCombos.length ? robotCombos : humanCombos.length ? humanCombos : robotHalfCombos.length ? robotHalfCombos : freeCells.includes(4) ? [4] : humanHalfCombos.length ? humanHalfCombos : freeCells

        return moves[Math.floor(Math.random() * moves.length)]
    }
    const makeMove = () => setTimeout(() => {
        const selected = selectBestMove()
        const cell = document.getElementById(`button-${selected}`)
        cell && cell.click()
    }, 100)

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

    const isWon = () => {
        const board = gameBoard.getBoard()
        const winningCombinations = gameBoard.getWinningCombinations()
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


