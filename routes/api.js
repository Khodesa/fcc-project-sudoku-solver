'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;

      if(!puzzle || !coordinate || !value){
        return res.json({ error: 'Required field(s) missing' })
      }

       if(!puzzle){
        return res.json({ error: 'Required field missing' });
      }

      let correctInput = solver.validate(puzzle)

      if(!correctInput){
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if(puzzle.length != 81){
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }

      let board = solver.generateBoard(puzzle)

      let solution = solver.checkPlacement(board, coordinate, value)

      return res.json(solution)

      let checkedRow = solver.checkRowPlacement(board, coordinate[0], coordinate[1], value);
      let checkedCol = solver.checkColPlacement(board, coordinate[0], coordinate[1], value);
      let checkedRegion = solver.checkRegionPlacement(board, coordinate[0], coordinate[1], value);

      

      let conflict = []
      if(!checkedRow){conflict.push("row")}
      if(!checkedCol){conflict.push("column")}
      if(!checkedRegion){conflict.push("region")}

      if(checkedRow && checkedCol && checkedRegion){
        return res.json({valid: true})
      }else{
        return res.json({valid: false, conflict: conflict})
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {

      let puzzle = req.body.puzzle;

      if(!puzzle){
        return res.json({ error: 'Required field missing' });
      }

      let correctInput = solver.validate(puzzle)

      if(!correctInput){
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      if(puzzle.length != 81){
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      let board = solver.generateBoard(puzzle)

      let solution = solver.solve(puzzle);
      if(solution){
        let ss = ''
        for(let i = 0; i < solution.length; i++){
          for(let j = 0; j < solution[i].length; j++){
            ss += solution[i][j].toString()
          }
        }
        return res.json({solution: ss})
      }else{
        return res.json({error: 'Puzzle cannot be solved'})
      }

    });
};