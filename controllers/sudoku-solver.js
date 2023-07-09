class SudokuSolver {

  validate(puzzleString) {

    return /^[0-9.]*$/.test(puzzleString)
  }

  getRowNumber(row){
    return row.charCodeAt() - 65
  }

  generateBoard(puzzleString){
    let board = [[],[],[],[],[],[],[],[],[]]
    let boardRow = -1
    for(let i = 0; i < puzzleString.length; i++){
      if(i % 9 == 0){
        boardRow += 1
      }
      board[boardRow].push(puzzleString[i])
    }
    return board
  }

  checkPlacement(board, coordinate, value){
    if(!/^[A-I][1-9]$/.test(coordinate)){
      return { error: 'Invalid coordinate'}
    }

    if (/[^1-9]/.test(value)){
      return { error: 'Invalid value' }
    }
    let row = coordinate.charCodeAt(0) - 65
    let col = Number(coordinate[1]) - 1

    let rows = this.checkRowPlacement(board, row, col, value)
    let cols = this.checkColPlacement(board, row, col, value)
    let reg = this.checkRegionPlacement(board, row, col, value)

    if(rows && cols && reg){
      return {valid: true}
    }else{
      let con = []
      let reason = ['row', 'column', 'region']
      let cons = [rows, cols, reg]
      cons.forEach((value, index) => {
        if(!value){con.push(reason[index])}
      })
      return {valid: false, conflict: con}
    }
  }

  checkRowPlacement(board, row, col, value) {
    for (let i = 0; i < 9; i++){
      if (board[row][i] == value && i != col){
        return false
      }
    }
    return true    
  }

  checkColPlacement(board, row, col, value) {
    for (let i = 0; i < 9; i++){
      if (board[i][col] == value && i != row){
        return false
      }
    }
    return true
  }

  checkRegionPlacement(board, row, col, value) {
    let boxTopRow = parseInt(row / 3) * 3
    let boxLeftColumn = parseInt(col / 3) * 3

    for (let i = boxTopRow; i < boxTopRow + 3; i++){
      for(let j = boxLeftColumn; j < boxLeftColumn + 3; j++){
        if(board[i][j] == value && i != row && j != col){
          return false
        }
      }
    }    
    return true    
  }

  solveFromCell(board, row, col){
    if (col == 9){
      col = 0
      row++
    }

    if (row == 9){
      return board
    }

    if (board[row][col] != "."){
      return this.solveFromCell(board, row, col + 1)
    }

    for (let i = 1; i < 10; i++){
      if (this.checkRowPlacement(board, row, col, i) && this.checkColPlacement(board, row, col, i) && this.checkRegionPlacement(board, row, col, i)){
        board[row][col] = i
        if (this.solveFromCell(board, row, col + 1) != false) {
          return this.solveFromCell(board, row, col + 1)
        }else{
          board[row][col] = "."
        }
      }
    }
    return false
  }

  solve(puzzleString) {

    let originalBoard = this.generateBoard(puzzleString)
    return this.solveFromCell(originalBoard, 0, 0)
  }
}

module.exports = SudokuSolver;