const gameboard = (() => {
    let board = new Array(9).fill('')

    const markCell = (num, player) => {
        if(board[num] === '') {
            board[num] = player.symbol
            drawBoard()
        }
    }

    const drawBoard = () => {
        const parent = document.getElementById('board-container')
        while(parent.hasChildNodes()) {
            parent.firstChild.remove()
        }
        board.forEach((cell, i) => {
            const c = document.createElement('div')
            c.className = 'board-cell'
            c.innerText = cell
            c.onclick = () => {
                markCell(i, gamestate.getActivePlayer())
                const won = gamestate.gameIsWon(board)
                if(won) {
                    const overlay = document.getElementById('overlay')
                    const winner = document.getElementById('winner')
                    overlay.className = 'visible'
                    winner.innerText = gamestate.getActivePlayer().symbol
                } else {
                    if(!gamestate.getRemainingTiles(board)) {
                        const overlay = document.getElementById('overlay')
                        const winner = document.getElementById('winner')
                        overlay.className = 'visible'
                        winner.innerText = 'Tie! Nobody'
                    }
                }
                gamestate.toggleActive()
            }
            parent.appendChild(c)
        })
    }

    const clearBoard = () => {
        board = new Array(9).fill('')
        const overlay = document.getElementById('overlay')
        overlay.className = 'hidden'
        drawBoard()
    }

    return {markCell, drawBoard, clearBoard}
})()

const Player = (symbol) => {
    let selected = []

    const reset = () => {
        selected = []
    }

    const select = (num) => {
        selected.push(num)
    }

    return {symbol, reset, select}
}

const x = Player('x')

const o = Player('o')


const gamestate = (() => {
    let activePlayer = Math.random() < 0.5 ? x : o

    const toggleActive = () => {
        activePlayer = activePlayer === x ? o : x
    }

    const getActivePlayer = () => {
        return activePlayer
    }

    const getRemainingTiles = (board) => {
        return board.filter(cell => cell === '').length
    }

    const gameIsWon = (board) => {
        const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
        let i = 0
        while(i < winningCombinations.length) {
            let equal = true
            let j = 0
            while(j < winningCombinations[i].length && equal){
                if(board[winningCombinations[i][j]] !== activePlayer.symbol) equal = false
                j++
            }
            if(equal) return true
            i++
        }
        return false
    }

    const reset = () => {
        activePlayer = Math.random() < 0.5 ? x : o
        gameboard.clearBoard()
    }

    return {getActivePlayer, toggleActive, gameIsWon, reset, getRemainingTiles}
})()




gameboard.drawBoard()


