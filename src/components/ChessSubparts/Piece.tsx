import { PieceType } from "./Square";

export interface PieceProps {
    piece: Exclude<PieceType, null>;
    isWhite: boolean;
  }

export const pieces: Record<Exclude<PieceType, null>, string> = {
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

  export default Piece;