
import  Piece  from "./Piece";
import React from "react";

export type PieceType =
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

interface SquareProps {
    piece: PieceType;
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
    const selectedClass = isSelected ? "bg-sky-800" : "";
    const suggestedClass = isSuggested ? "bg-yellow-200" : "";
    return (
      <div
        className={`w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center ${bgColor} ${selectedClass} ${suggestedClass} cursor-pointer transition-all duration-300 ease-in-out hover:opacity-80`}
        onClick={onClick}
      >
        {piece && <Piece piece={piece} isWhite={piece.toUpperCase() === piece} />}
      </div>
    );
  };

  export default Square;