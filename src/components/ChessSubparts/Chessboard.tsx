import React from 'react'
import Square from './Square';
import { Board } from '@/screens/ChessGame';
import {Move} from '@/screens/ChessGame';
import mymusic from '@/assets/mymusic.wav';


interface ChessboardProps {
    board: Board;
    onSquareClick: (row: number, col: number) => void;
    selectedSquare: [number, number] | null;
    suggestedMove: Move | null;
    isGameStarted: boolean
  }

 

const Chessboard: React.FC<ChessboardProps> = ({
    board,
    onSquareClick,
    selectedSquare,
    suggestedMove,
    isGameStarted
  }) => {

    const HandleClick=(i:number,j:number)=>{

      onSquareClick(i, j);

      if(isGameStarted && selectedSquare !==null ){
      const audio =new Audio(mymusic);
      audio.play();
      }
      
  
    }

  

    return (
      <div className={`${isGameStarted?'opacity-100':"grayscale"} grid grid-cols-8 gap-0 border-8 border-emerald-900 rounded-lg shadow-2xl`}>
        
        {board.flatMap((row, i) =>
          row.map((piece, j) => (
            <Square
              key={`${i}-${j}`}
              piece={piece}
              isBlack={(i + j) % 2 === 1}
              onClick={() => HandleClick(i,j)}
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
  