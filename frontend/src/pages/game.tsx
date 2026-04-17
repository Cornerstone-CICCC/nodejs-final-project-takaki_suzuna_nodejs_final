import Dot from "../components/dot";
import Line from "../components/line";
import Box from "../components/box";
import type { GameState, Room, User } from "../types/game";

interface GameProps {
  errorMessage: string;
  game: GameState;
  room: Room;
  user: User;
  onLeaveMatch: () => void;
  onMakeMove: (edgeId: string) => void;
}

const PLAYER_COLOR_CLASSES = [
  "bg-sky-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
];

function Game({
  errorMessage,
  game,
  room,
  user,
  onLeaveMatch,
  onMakeMove,
}: GameProps) {
  const gridSize = game.boardSize * 2 - 1;
  const edgeMap = new Map(game.edges.map((edge) => [edge.id, edge]));
  const boxMap = new Map(game.boxes.map((box) => [box.id, box]));
  const playerIndexMap = new Map(
    game.players.map((player, index) => [player.id, index]),
  );

  const getPlayerColor = (playerId: string | null) => {
    if (!playerId) {
      return undefined;
    }

    const index = playerIndexMap.get(playerId) ?? 0;
    return PLAYER_COLOR_CLASSES[index % PLAYER_COLOR_CLASSES.length];
  };

  const getPlayerName = (playerId: string | null) => {
    if (!playerId) {
      return "No one";
    }

    return (
      game.players.find((player) => player.id === playerId)?.username ??
      "Unknown"
    );
  };

  const isUsersTurn =
    game.currentTurnPlayerId === user.id && game.status === "playing";

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col overflow-hidden">
      <header className="bg-background flex justify-between items-center w-full px-4 md:px-6 py-3 md:py-4 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4 md:gap-8">
          <span className="text-lg md:text-2xl font-extrabold tracking-tight text-primary">
            Dots & Boxes
          </span>
          <div className="hidden md:block text-left">
            <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
              Room
            </p>
            <p className="font-bold">{room.roomCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
              Turn
            </p>
            <p className="font-bold">
              {getPlayerName(game.currentTurnPlayerId)}
            </p>
          </div>
          <button
            className="rounded-full px-4 py-2 text-sm font-semibold bg-surface-container-low hover:bg-surface-container transition-colors"
            onClick={onLeaveMatch}
            type="button"
          >
            Leave Board
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row gap-4 md:gap-6 max-w-[1600px] mx-auto w-full">
        <aside className="flex flex-col md:flex-row lg:flex-col gap-4 w-full lg:w-72 flex-shrink-0">
          {game.players.map((player) => (
            <div
              key={player.id}
              className="bg-surface-container-low rounded-lg p-4 flex-1 flex flex-col items-center shadow-md relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 ${getPlayerColor(player.id)}`}
              ></div>
              <div
                className={`w-20 h-20 rounded-full ${getPlayerColor(player.id)} p-1 mb-3 flex items-center justify-center text-white text-2xl font-black`}
              >
                {player.username.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="text-lg font-black text-on-surface">
                {player.username}
              </h2>
              <p className="text-xs font-semibold text-on-surface-variant mb-3">
                {player.id === user.id ? "You" : "Opponent"}
              </p>
              <div className="w-full space-y-2 mb-3">
                <div className="flex justify-between text-xs font-bold">
                  <span>Score</span>
                  <span className="text-primary text-lg">
                    {game.scores[player.id] ?? 0}
                  </span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getPlayerColor(player.id)}`}
                    style={{
                      width: `${((game.scores[player.id] ?? 0) / Math.max(1, game.boxes.length)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              {game.currentTurnPlayerId === player.id &&
                game.status === "playing" && (
                  <div className="bg-primary text-on-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Current Turn
                  </div>
                )}
              {game.status === "finished" &&
                game.winnerPlayerId === player.id && (
                  <div className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Winner
                  </div>
                )}
            </div>
          ))}
        </aside>

        <section className="flex-1 flex flex-col bg-surface-container rounded-lg md:rounded-xl overflow-hidden relative border border-outline-variant/15 min-h-[350px]">
          <div className="px-4 py-4 border-b border-outline-variant/10 text-left">
            <p className="text-sm font-semibold text-on-surface">
              {game.status === "finished"
                ? game.winnerPlayerId
                  ? `${getPlayerName(game.winnerPlayerId)} wins the match.`
                  : "The match ended in a tie."
                : isUsersTurn
                  ? "Your turn. Pick an unclaimed edge."
                  : `Waiting for ${getPlayerName(game.currentTurnPlayerId)} to move.`}
            </p>
            {errorMessage && (
              <p className="mt-2 text-sm font-medium text-red-600">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-2 md:p-6 overflow-auto">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(28px, 40px))`,
                gridTemplateRows: `repeat(${gridSize}, minmax(28px, 40px))`,
                placeItems: "center",
                gap: "0px",
              }}
            >
              {Array.from({ length: gridSize }).map((_, row) =>
                Array.from({ length: gridSize }).map((_, col) => {
                  const isDot = row % 2 === 0 && col % 2 === 0;
                  const isHorizontalEdge = row % 2 === 0 && col % 2 === 1;
                  const isVerticalEdge = row % 2 === 1 && col % 2 === 0;
                  const isBox = row % 2 === 1 && col % 2 === 1;
                  const key = `${row}-${col}`;

                  if (isDot) {
                    return <Dot key={key} />;
                  }

                  if (isHorizontalEdge) {
                    const edgeId = `H-${row / 2}-${(col - 1) / 2}`;
                    const edge = edgeMap.get(edgeId);

                    return (
                      <Line
                        key={key}
                        active={Boolean(edge?.claimedBy)}
                        colorClass={getPlayerColor(edge?.claimedBy ?? null)}
                        disabled={!isUsersTurn || game.status !== "playing"}
                        onClick={() => onMakeMove(edgeId)}
                        type="h"
                      />
                    );
                  }

                  if (isVerticalEdge) {
                    const edgeId = `V-${(row - 1) / 2}-${col / 2}`;
                    const edge = edgeMap.get(edgeId);

                    return (
                      <Line
                        key={key}
                        active={Boolean(edge?.claimedBy)}
                        colorClass={getPlayerColor(edge?.claimedBy ?? null)}
                        disabled={!isUsersTurn || game.status !== "playing"}
                        onClick={() => onMakeMove(edgeId)}
                        type="v"
                      />
                    );
                  }

                  if (isBox) {
                    const boxId = `B-${(row - 1) / 2}-${(col - 1) / 2}`;
                    const box = boxMap.get(boxId);
                    const owner = box?.claimedBy ?? undefined;

                    return (
                      <Box
                        key={key}
                        colorClass={getPlayerColor(owner ?? null)}
                        label={
                          owner
                            ? getPlayerName(owner).slice(0, 2).toUpperCase()
                            : undefined
                        }
                        owner={owner}
                      />
                    );
                  }

                  return <div key={key}></div>;
                }),
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Game;
