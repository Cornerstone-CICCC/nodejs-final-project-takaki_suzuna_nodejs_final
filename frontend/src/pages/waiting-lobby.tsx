import type { ActivityItem, Room, User } from "../types/game";

interface WaitingLobbyProps {
  activity: ActivityItem[];
  busyAction:
    | "auth"
    | "create-room"
    | "join-room"
    | "start-game"
    | "logout"
    | null;
  canStartGame: boolean;
  errorMessage: string;
  room: Room;
  socketReady: boolean;
  user: User;
  onBack: () => void;
  onStartGame: () => void;
}

function WaitingLobby({
  activity,
  busyAction,
  canStartGame,
  errorMessage,
  room,
  socketReady,
  user,
  onBack,
  onStartGame,
}: WaitingLobbyProps) {
  const [host, guest] = room.players;
  const isHost = room.hostUserId === user.id;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(room.roomCode.slice(0, 8));
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-transparent flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="text-xl font-extrabold tracking-tight text-primary">
            Dots & Boxes
          </span>
        </div>
        <button
          className="rounded-full px-4 py-2 text-sm font-semibold bg-surface-container-low hover:bg-surface-container transition-colors"
          onClick={onBack}
          type="button"
        >
          Back to Lobbies
        </button>
      </nav>

      <main className="pt-20 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-1">
                  {room.players.length < room.maxPlayers
                    ? "Waiting for Opponent"
                    : "Lobby Ready"}
                </h1>
                <p className="text-on-surface-variant font-medium">
                  {socketReady
                    ? "Socket connected and synced with the room."
                    : "Finishing room connection..."}
                </p>
              </div>
              <div className="bg-surface-container-low rounded-lg px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 w-full md:w-auto">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-outline">
                    Lobby Code
                  </span>
                  <span className="text-xl md:text-2xl font-black text-primary tracking-widest">
                    {room.roomCode.slice(0, 8)}
                  </span>
                </div>
                <button
                  className="bg-primary-container text-on-primary-container p-2 md:p-3 rounded-full hover:scale-105 active:scale-95 transition-all"
                  onClick={() => void handleCopyCode()}
                  type="button"
                >
                  <span
                    className="material-symbols-outlined text-lg md:text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    content_copy
                  </span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-100 text-red-700 px-4 py-3 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[host, guest].map((player, index) => {
                const isFilled = Boolean(player);
                const isPlayerHost = player?.id === room.hostUserId;
                const isCurrentUser = player?.id === user.id;

                return (
                  <div
                    key={player?.id ?? `empty-${index}`}
                    className="relative group"
                  >
                    <div className="bg-surface-container-lowest rounded-lg md:rounded-xl p-6 md:p-8 flex flex-col items-center text-center shadow-md min-h-[280px]">
                      <div className="relative mb-4 md:mb-6">
                        <div
                          className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 p-1 flex items-center justify-center text-3xl font-black ${
                            isPlayerHost
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-secondary bg-secondary/10 text-secondary"
                          }`}
                        >
                          {player
                            ? player.username.slice(0, 2).toUpperCase()
                            : "?"}
                        </div>
                        {isPlayerHost && (
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[9px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-tighter">
                            HOST
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-on-surface mb-1">
                        {player?.username ?? "Guest Player"}
                      </h3>
                      <p className="text-on-surface-variant font-bold mb-6 text-sm md:text-base">
                        {isFilled
                          ? isCurrentUser
                            ? "You are in this lobby."
                            : "Connected and ready."
                          : "Waiting for connection..."}
                      </p>
                      <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-surface-dim/30 text-outline rounded-full font-bold text-xs md:text-sm">
                        <span className="material-symbols-outlined text-sm">
                          {isFilled ? "check_circle" : "hourglass_empty"}
                        </span>
                        {isFilled ? "CONNECTED" : "WAITING"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-3 md:gap-4 mt-2">
              <button
                className="w-full md:w-auto min-w-[280px] md:min-w-[320px] bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg md:text-xl font-black py-4 md:py-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!canStartGame || busyAction === "start-game"}
                onClick={onStartGame}
                type="button"
              >
                <span
                  className="material-symbols-outlined text-2xl md:text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                {busyAction === "start-game" ? "STARTING..." : "START MATCH"}
              </button>
              <p className="text-on-surface-variant text-xs md:text-sm font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-error">
                  info
                </span>
                {isHost
                  ? "Only the host can start, and the socket must be connected with two players present."
                  : "Waiting for the host to start the game."}
              </p>
            </div>
          </div>

          <aside className="w-full lg:w-80 flex flex-col h-96 md:h-[500px] lg:h-auto bg-surface-container-low rounded-lg md:rounded-xl overflow-hidden shadow-md border border-outline-variant/10">
            <div className="p-4 bg-surface-container-high flex items-center justify-center">
              <h4 className="font-black text-on-surface flex items-center gap-2 text-sm md:text-base">
                <span className="material-symbols-outlined text-primary text-center">
                  forum
                </span>
                Lobby Activity
              </h4>
            </div>
            <div className="flex-grow p-4 flex flex-col gap-3 overflow-y-auto bg-surface-container-low/50">
              {activity.length === 0 && (
                <div className="text-sm text-on-surface-variant text-center py-8">
                  Room updates will appear here.
                </div>
              )}
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest px-4 py-3 rounded-2xl shadow-sm text-left text-sm font-medium text-on-surface"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default WaitingLobby;
