let board = [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null]
];

//solver
function solve() {
    //verify user input
    if (verifyValues()) {
        //solve
        if (solveSudoku(board, 0, 0)) {
            fillBoard(board);
             storeResult();
        } else {
            alert("Sudoku could not be resolved");
        }
    } else {
        alert("Provided data is not a solvable sudoku");
    }
}


// recursive algo
function solveSudoku(board, row, col) {

    const cell = findNextCell(board, row, col);
    row = cell[0];
    col = cell[1];

    // base case: if no empty cell
    if (row == -1) {
        //solved
        return true;
    }

    for (let value = 1; value <= 9; value++) {

        if (isRowOk(board, row, value, col) && isColOk(board, col, value, row) && isBoxOk(board, row, col, value)) {
            board[row][col] = value;
            if (solveSudoku(board, row, col)) {
                //valid
                return true;
            } else {
                //not valid
            }

            // mark cell as empty (with null)
            board[row][col] = null;
        }
    }

    return false;
}

function verifyValues() {
    //check rows
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let value = board [r][c];
            if (value !== null && !isRowOk(board, r, value, c)) {
                return false;
            }
        }
    }

    //check columns
    for (let c = 0; c < 9; c++) {
        for (let r = 0; r < 9; r++) {
            let value = board [r][c];
            if (value !== null && !isColOk(board, c, value, r)) {
                return false;
            }
        }
    }

    //check box
    for (let r = 0; r < 9; r += 3) {
        for (let c = 0; c < 9; c += 3) {
            let value = board [r][c];
            if (!isBoxOk(board, r, c, value)) {
                return false;
            }
        }
    }

    return true;
}


function findNextCell(board, row, col) {
    let done = false;
    const res = [-1, -1];

    while (!done) {
        if (row == 9) {
            done = true;
        } else {
            if (board[row][col] === null) {
                res[0] = row;
                res[1] = col;
                done = true;
            } else {
                if (col < 8) {
                    col++;
                } else {
                    row++;
                    col = 0;
                }
            }
        }
    }

    return res;
}

function isRowOk(board, row, value, columnIndexOfValue) {
    for (let col = 0; col < 9; col++) {
        if (col != columnIndexOfValue && board[row][col] == value) {
            return false;
        }
    }


    return true;
}

function isColOk(board, col, value, rowIndexOfValue) {
    for (let row = 0; row < 9; row++) {
        if (row != rowIndexOfValue && board[row][col] == value) {
            return false
        }
    }
    return true;
}

function isBoxOk(board, row, col, value) {
   let  startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            var calculatedRow = startRow + r;
            var calculatedColumn = startCol + c;
            if (value !== null) {
                if (calculatedRow == row && calculatedColumn == col) {
                    //skip
                } else if (board[calculatedRow][calculatedColumn] == value) {
                    return false;
                }
            }
        }
    }

    return true;
}

function storeResult() {
    fetch('https://localhost:7097/sendResult', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({"id": 0, "solution": board,})
    })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
  
        // DxDatagrid
        $(document).ready(function() {
            $("#dx-datagrid").dxDataGrid({
              dataSource: [board],
            });
          });     
}

function fillBoard(board) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const boardElement = board[r][c];
            if (boardElement != null) {
                const elementById = $('#cell' + r + '-' + c).val(boardElement);
                elementById.value = boardElement;


            }
        }
    }
}

function addValueToboard(value, id) {
    const strings = id.substring(4, 7).split('-');
    board [strings[0]] [strings [1]] = value;
}

$(document).ready(function () {
    let table = $('#table');

    for (let i = 0; i < 9; i++) {
        let tr = $('<tr></tr>');

        for (let j = 0; j < 9; j++) {
            let td = $('<td></td>');
            let input = $(`<input class="cell" type="number" min="1" max="9" id="cell${i}-${j}">`);
            td.append(input);
            tr.append(td);
        }

        table.append(tr);
    }

    $(".cell").change(function () {
        const value = $(this).val();
        const id = $(this).attr('id');
        addValueToboard(value, id);
    });
});

$('#button-resolve').on('click', solve);