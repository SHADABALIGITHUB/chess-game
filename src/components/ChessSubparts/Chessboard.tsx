import React from 'react'
import Square from './Square';
import { Board } from '@/screens/ChessGame';
import {Move} from '@/screens/ChessGame';


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

  export default Chessboard;
  