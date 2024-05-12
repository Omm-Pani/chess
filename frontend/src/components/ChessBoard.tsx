import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

const ChessBoard = ({
  board,
  socket,
  chess,
  setBoard,
}: {
  chess: Chess;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);

  return (
    <div>
      {board.map((row, i) => {
        return (
          <div id={(8 - i).toString()} key={i} className="flex">
            {row.map((square, j) => {
              const squareId = (String.fromCharCode(j + 97) +
                (8 - i).toString()) as Square;
              return (
                <div
                  onClick={() => {
                    if (!from) {
                      setFrom(squareId);
                    } else {
                      socket.send(
                        JSON.stringify({
                          type: MOVE,
                          payload: { move: { from, to: squareId } },
                        })
                      );
                      setFrom(null);
                      chess.move({
                        from,
                        to: squareId,
                      });
                      setBoard(chess.board());
                      console.log({
                        from: from,
                        to: squareId,
                      });
                    }
                  }}
                  key={j}
                  id={String.fromCharCode(j + 97)}
                  className={`w-16 h-16 ${
                    (i + j) % 2 === 0 ? "bg-green-600" : "bg-green-100"
                  }`}
                >
                  {square ? (
                    <img src={`/pieces/${square.color}${square.type}.png`} />
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ChessBoard;
