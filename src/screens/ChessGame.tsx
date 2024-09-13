import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Crown,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Piece =
  | "K"
  | "Q"
  | "R"
  | "B"
  | "N"
  | "P"
  | "k"
  | "q"
  | "r"
  | "b"
  | "n"
  | "p"
  | null;
type Board = Piece[][];
type Turn = "white" | "black";
type Move = { from: [number, number]; to: [number, number] };

const pieces: Record<Exclude<Piece, null>, string> = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♙",
};

const initialBoard: Board = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

interface PieceProps {
  piece: Exclude<Piece, null>;
  isWhite: boolean;
}

const Piece: React.FC<PieceProps> = ({ piece, isWhite }) => {
  return (
    <div
      className={`text-4xl ${
        isWhite ? "text-white" : "text-black"
      } drop-shadow-md transition-transform hover:scale-110`}
    >
      {pieces[piece]}
    </div>
  );
};

interface SquareProps {
  piece: Piece;
  isBlack: boolean;
  onClick: () => void;
  isSelected: boolean;
  isSuggested: boolean;
}

const Square: React.FC<SquareProps> = ({
  piece,
  isBlack,
  onClick,
  isSelected,
  isSuggested,
}) => {
  const bgColor = isBlack ? "bg-emerald-800" : "bg-emerald-200";
  const selectedClass = isSelected ? "ring-4 ring-yellow-400" : "";
  const suggestedClass = isSuggested ? "bg-yellow-200" : "";
  return (
    <div
      className={`w-20 h-20 flex items-center justify-center ${bgColor} ${selectedClass} ${suggestedClass} cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80`}
      onClick={onClick}
    >
      {piece && <Piece piece={piece} isWhite={piece.toUpperCase() === piece} />}
    </div>
  );
};

interface ChessboardProps {
  board: Board;
  onSquareClick: (row: number, col: number) => void;
  selectedSquare: [number, number] | null;
  suggestedMove: Move | null;
}

const Chessboard: React.FC<ChessboardProps> = ({
  board,
  onSquareClick,
  selectedSquare,
  suggestedMove,
}) => {
  return (
    <div className="grid grid-cols-8 gap-0 border-8 border-emerald-900 rounded-lg shadow-2xl">
      {board.flatMap((row, i) =>
        row.map((piece, j) => (
          <Square
            key={`${i}-${j}`}
            piece={piece}
            isBlack={(i + j) % 2 === 1}
            onClick={() => onSquareClick(i, j)}
            isSelected={
              selectedSquare !== null &&
              selectedSquare[0] === i &&
              selectedSquare[1] === j
            }
            isSuggested={
              suggestedMove !== null &&
              ((suggestedMove.from[0] === i && suggestedMove.from[1] === j) ||
                (suggestedMove.to[0] === i && suggestedMove.to[1] === j))
            }
          />
        ))
      )}
    </div>
  );
};

interface TimerProps {
  time: number;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ time, isActive }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return (
    <div
      className={`text-sm sm:text-base md:text-lg lg:text-2xl font-mono font-bold ${
        isActive ? `${minutes<1?"text-white bg-red-800":"text-emerald-500 bg-black"} rounded-sm` : "text-gray-500"
      } transition-colors duration-300`}
    >
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
};

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(
    null
  );
  const [turn, setTurn] = useState<Turn>("white");
  const [moveHistory, setMoveHistory] = useState<Board[]>([initialBoard]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [whiteTime, setWhiteTime] = useState<number>(600);
  const [blackTime, setBlackTime] = useState<number>(600);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [suggestedMove, setSuggestedMove] = useState<Move | null>(null);
  const [winner, setWinner] = useState<Turn | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

  useEffect(() => {
    if (currentMove < moveHistory.length) {
      setBoard(moveHistory[currentMove]);
    }
  }, [currentMove, moveHistory]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameStarted && !isGameOver) {
      timer = setInterval(() => {
        if (turn === "white") {
          setWhiteTime((prev) => {
            if (prev === 0) {
              clearInterval(timer);
              setIsGameOver(true);
              setWinner("black");
              setShowWinModal(true);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime((prev) => {
            if (prev === 0) {
              clearInterval(timer);
              setIsGameOver(true);
              setWinner("white");
              setShowWinModal(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [turn, isGameOver, isGameStarted]);

  const isValidMove = (
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): boolean => {
    const piece = board[fromRow][fromCol];
    const toPiece = board[toRow][toCol];

    if (!piece) return false;

    if (
      toPiece &&
      toPiece.toLowerCase() === toPiece &&
      piece.toLowerCase() === piece
    )
      return false;
    if (
      toPiece &&
      toPiece.toUpperCase() === toPiece &&
      piece.toUpperCase() === piece
    )
      return false;

    const direction = piece === piece.toUpperCase() ? -1 : 1;

    switch (piece.toLowerCase()) {
      case "p":
        if (fromCol === toCol && !toPiece) {
          if (toRow === fromRow + direction) return true;
          if (
            (fromRow === 1 && piece === "p") ||
            (fromRow === 6 && piece === "P")
          ) {
            if (
              toRow === fromRow + 2 * direction &&
              !board[fromRow + direction][fromCol]
            )
              return true;
          }
        }
        if (Math.abs(fromCol - toCol) === 1 && toRow === fromRow + direction) {
          if (toPiece) return true;
          if (
            (fromRow === 3 && piece === "P") ||
            (fromRow === 4 && piece === "p")
          ) {
            const lastMove = moveHistory[moveHistory.length - 1];
            if (
              lastMove &&
              lastMove[toRow - direction][toCol] ===
                (piece === "P" ? "p" : "P") &&
              lastMove[fromRow][toCol] === null &&
              board[fromRow][toCol] === (piece === "P" ? "p" : "P")
            ) {
              return true;
            }
          }
        }
        return false;
      case "r":
        return fromRow === toRow || fromCol === toCol;
      case "n":
        return (
          (Math.abs(fromRow - toRow) === 2 &&
            Math.abs(fromCol - toCol) === 1) ||
          (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2)
        );
      case "b":
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol);
      case "q":
        return (
          fromRow === toRow ||
          fromCol === toCol ||
          Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)
        );
      case "k":
        if (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1)
          return true;
        if (Math.abs(fromCol - toCol) === 2 && fromRow === toRow) {
          const rookCol = toCol > fromCol ? 7 : 0;
          const rookPiece = board[fromRow][rookCol];
          if (
            rookPiece === (piece === "K" ? "R" : "r") &&
            !hasKingMoved(turn) &&
            !hasRookMoved(turn, rookCol)
          ) {
            const step = toCol > fromCol ? 1 : -1;
            for (let col = fromCol + step; col !== rookCol; col += step) {
              if (board[fromRow][col] !== null) return false;
            }
            for (let col = fromCol; col !== toCol + step; col += step) {
              if (isSquareUnderAttack(fromRow, col, turn)) return false;
            }
            return true;
          }
        }
        return false;
      default:
        return false;
    }
  };

  const hasKingMoved = (color: Turn): boolean => {
    const kingMoves = moveHistory.slice(1).some((boardState) => {
      const king = color === "white" ? "K" : "k";
      return boardState[color === "white" ? 7 : 0][4] !== king;
    });
    return kingMoves;
  };

  const hasRookMoved = (color: Turn, rookCol: number): boolean => {
    const rookMoves = moveHistory.slice(1).some((boardState) => {
      const rook = color === "white" ? "R" : "r";
      return boardState[color === "white" ? 7 : 0][rookCol] !== rook;
    });
    return rookMoves;
  };

  const isSquareUnderAttack = (
    row: number,
    col: number,
    defendingColor: Turn
  ): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (
          piece &&
          (defendingColor === "white"
            ? piece === piece.toLowerCase()
            : piece === piece.toUpperCase())
        ) {
          if (isValidMove(i, j, row, col)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const findKing = (color: Turn): [number, number] | null => {
    const king = color === "white" ? "K" : "k";
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] === king) {
          return [i, j];
        }
      }
    }
    return null;
  };

  const isKingInCheck = (color: Turn): boolean => {
    const kingPosition = findKing(color);
    if (!kingPosition) return false;
    return isSquareUnderAttack(kingPosition[0], kingPosition[1], color);
  };

  const canAnyPieceMove = (color: Turn): boolean => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (
          piece &&
          (color === "white"
            ? piece === piece.toUpperCase()
            : piece === piece.toLowerCase())
        ) {
          for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
              if (isValidMove(i, j, x, y)) {
                const newBoard = board.map((row) => [...row]);
                newBoard[x][y] = newBoard[i][j];
                newBoard[i][j] = null;
                if (!isKingInCheck(color)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (color: Turn): boolean => {
    return isKingInCheck(color) && !canAnyPieceMove(color);
  };

  const isStalemate = (color: Turn): boolean => {
    return !isKingInCheck(color) && !canAnyPieceMove(color);
  };

  const handleSquareClick = (i: number, j: number) => {
    if (isGameOver || !isGameStarted) return;

    if (selectedSquare) {
      const [si, sj] = selectedSquare;
      if (i !== si || j !== sj) {
        if (isValidMove(si, sj, i, j)) {
          const newBoard = board.map((row) => [...row]);
          const capturedPiece = newBoard[i][j];
          newBoard[i][j] = newBoard[si][sj];
          newBoard[si][sj] = null;

          if (newBoard[i][j]?.toLowerCase() === "p") {
            if (
              (turn === "white" && i === 0) ||
              (turn === "black" && i === 7)
            ) {
              newBoard[i][j] = turn === "white" ? "Q" : "q"; // Auto-promote to queen for simplicity
            }

            if (
              Math.abs(si - i) === 1 &&
              Math.abs(sj - j) === 1 &&
              !capturedPiece
            ) {
              newBoard[si][j] = null; // Remove the captured pawn
            }
          } else if (
            newBoard[i][j]?.toLowerCase() === "k" &&
            Math.abs(sj - j) === 2
          ) {
            const rookFromCol = j > sj ? 7 : 0;
            const rookToCol = j > sj ? j - 1 : j + 1;
            newBoard[i][rookToCol] = newBoard[i][rookFromCol];
            newBoard[i][rookFromCol] = null;
          }

          setBoard(newBoard);
          setMoveHistory([...moveHistory.slice(0, currentMove + 1), newBoard]);
          setCurrentMove(currentMove + 1);
          const nextTurn = turn === "white" ? "black" : "white";
          setTurn(nextTurn);
          setSuggestedMove(null);

          if (isCheckmate(nextTurn)) {
            setWinner(turn);
            setIsGameOver(true);
            setShowWinModal(true);
          } else if (isStalemate(nextTurn)) {
            setWinner(null);
            setIsGameOver(true);
            setShowWinModal(true);
          }
        }
      }
      setSelectedSquare(null);
    } else if (board[i][j]) {
      const piece = board[i][j];
      if (
        piece &&
        ((turn === "white" && piece.toUpperCase() === piece) ||
          (turn === "black" && piece.toLowerCase() === piece))
      ) {
        setSelectedSquare([i, j]);
      }
    }
  };

  const handleUndo = () => {
    if (currentMove > 0) {
      setCurrentMove(currentMove - 1);
      setTurn(turn === "white" ? "black" : "white");
      setSuggestedMove(null);
    }
  };

  const handleRedo = () => {
    if (currentMove < moveHistory.length - 1) {
      setCurrentMove(currentMove + 1);
      setTurn(turn === "white" ? "black" : "white");
      setSuggestedMove(null);
    }
  };

  const handleReset = useCallback(() => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setTurn("white");
    setMoveHistory([initialBoard]);
    setCurrentMove(0);
    setWhiteTime(600);
    setBlackTime(600);
    setIsGameOver(false);
    setIsGameStarted(false);
    setSuggestedMove(null);
    setWinner(null);
    setShowWinModal(false);
  }, []);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  const suggestMove = () => {
    const currentPlayerPieces =
      turn === "white"
        ? ["P", "R", "N", "B", "Q", "K"]
        : ["p", "r", "n", "b", "q", "k"];
    const possibleMoves: Move[] = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (currentPlayerPieces.includes(board[i][j] as string)) {
          for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
              if (isValidMove(i, j, x, y)) {
                possibleMoves.push({ from: [i, j], to: [x, y] });
              }
            }
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      const randomMove =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      setSuggestedMove(randomMove);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br rounded-lg bg-white flex items-center justify-center p-2">
      <Card className="w-full bg-white shadow-2xl flex">
        <CardHeader className="bg-emerald-900 w-1/4 rounded-xl">
          <CardTitle className="lg:text-4xl text-xl sm:text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text inline-block bg-gradient-to-r from-blue-500 via-yellow-300 to-blue-900  font-serif">
            Chess Game
          </CardTitle>
          <div className="flex flex-col gap-3">
          <div className={`text-xl flex items-center justify-center ${isGameStarted?"flex":"hidden"}  font-serif font-semibold bg-emerald-100 px-6 py-3 rounded-full text-emerald-800`}>
            {isGameStarted
              ? `Turn: ${turn === "white" ? "White" : "Black"}`
              : ""}
          </div>
          <div className="flex flex-col gap-2 lg:flex-row justify-center items-center bg-emerald-100 p-2 rounded-lg">
            <Timer
              time={whiteTime}
              isActive={isGameStarted && turn === "white"}
            />
            <Crown
              className={`w-8 h-8${
                turn === "white" ? "text-yellow-500" : "text-gray-400"
              }`}
            />
            <Timer
              time={blackTime}
              isActive={isGameStarted && turn === "black"}
            />
          </div>
          </div>
          <CardFooter className="flex flex-col gap-5 justify-center items-center p-6 font-serif">
          {!isGameStarted && (
            <Button
              variant="whitebtn"
              onClick={handleStartGame}
              className="hover:bg-emerald-600 hover:text-white"

              
            >
              <Play className="me-2 h-5 w-5" /> Start Game
            </Button>
          )}
          <Button
            onClick={handleUndo}
            disabled={!isGameStarted || currentMove === 0}
            variant="whitebtn"
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Undo
          </Button>
          <Button
            onClick={handleRedo}
            disabled={!isGameStarted || currentMove === moveHistory.length - 1}
            variant="whitebtn"
          >
            Redo <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            onClick={handleReset}
            variant="whitebtn"
            className="hover:bg-red-600 hover:text-white"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="whitebtn"
                  onClick={suggestMove}
                  disabled={!isGameStarted || isGameOver}
                  className="hover:bg-yellow-500 hover:text-white"

                >
                  <Lightbulb className="mr-2 h-5 w-5" /> Suggest Move
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to get a move suggestion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
        </CardHeader>
        
        <CardContent className="flex w-3/4 h-screen items-center space-y-6 p-8">
          
          <Chessboard
            board={board}
            onSquareClick={handleSquareClick}
            selectedSquare={selectedSquare}
            suggestedMove={suggestedMove}
          />
        </CardContent>
       
        

      </Card>

      <Dialog open={showWinModal} onOpenChange={setShowWinModal}>
        <DialogContent className="absolute bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-emerald-700 mb-4">
              {winner
                ? `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`
                : "It's a Draw!"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-xl text-gray-700">
            {winner
              ? `Congratulations to the ${winner} player for winning the game!`
              : "The game has ended in a draw. Well played by both sides!"}
          </DialogDescription>
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleReset}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full text-lg"
            >
              Play Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChessGame;
