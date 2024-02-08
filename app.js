document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const cells = document.querySelectorAll('.cell');
  const restartBtn = document.getElementById('restartBtn');
  let currentPlayer = 'X';
  let gameBoard = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  const checkWinner = (board) => {
      const winPatterns = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
      ];

      for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
              return true;
          }
      }

      return false;
  };

  const checkTie = (board) => {
      return board.every(cell => cell !== '');
  };

  const restartGame = () => {
      gameBoard = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      currentPlayer = 'X';

      cells.forEach(cell => {
          cell.textContent = '';
          cell.classList.remove('glow');
      });
  };

  const handleClick = (index) => {
      if (!gameBoard[index] && gameActive) {
          gameBoard[index] = currentPlayer;
          cells[index].textContent = currentPlayer;
          cells[index].classList.add('glow'); // Add glow effect

          if (checkWinner(gameBoard)) {
              alert(`Player ${currentPlayer} wins!`);
              gameActive = false;
          } else if (checkTie(gameBoard)) {
              alert('It\'s a tie!');
              gameActive = false;
          } else {
              currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
              if (currentPlayer === 'O') {
                  // Computer's turn
                  setTimeout(() => {
                      makeComputerMove();
                  }, 500);
              }
          }
      }
  };

  const makeComputerMove = () => {
      const winningMove = findWinningMove('O');
      const blockingMove = findWinningMove('X');

      if (winningMove !== -1) {
          // Computer has a winning move
          handleClick(winningMove);
      } else if (blockingMove !== -1) {
          // Block the opponent from winning
          handleClick(blockingMove);
      } else {
          // Play in a random available cell
          const availableCells = gameBoard.reduce((acc, cell, index) => {
              if (cell === '') {
                  acc.push(index);
              }
              return acc;
          }, []);

          const randomIndex = Math.floor(Math.random() * availableCells.length);
          const computerMove = availableCells[randomIndex];

          handleClick(computerMove);
      }
  };

  const findWinningMove = (player) => {
      // Check rows, columns, and diagonals for a winning move
      for (let i = 0; i < gameBoard.length; i++) {
          if (gameBoard[i] === '' && isWinningMove(i, player)) {
              return i;
          }
      }
      return -1;
  };

  const isWinningMove = (index, player) => {
      const tempBoard = [...gameBoard];
      tempBoard[index] = player;
      return checkWinner(tempBoard);
  };

  restartBtn.addEventListener('click', restartGame);

  cells.forEach((cell, index) => {
      cell.addEventListener('click', () => handleClick(index));
  });
});
