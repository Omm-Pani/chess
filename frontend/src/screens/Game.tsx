import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import ChessBoard from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setChess(new Chess());
          setBoard(chess.board());
          setStarted(true);
          break;
        case MOVE:
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        case GAME_OVER:
          break;
      }
    };
  });

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full flex justify-center">
            <ChessBoard
              board={board}
              socket={socket}
              setBoard={setBoard}
              chess={chess}
            />
          </div>
          <div className="col-span-2 bg-slate-800 w-full flex justify-center">
            <div className="pt-8">
              {!started && (
                <Button
                  onClick={() => {
                    socket.send(JSON.stringify({ type: INIT_GAME }));
                  }}
                >
                  Play
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
