import { useState } from "react";
import createLobbyImg from "../assets/create-lobby.png";
import joinLobbyImg from "../assets/join-lobby.png";
import type { User } from "../types/game";

interface LobbiesProps {
  busyAction:
    | "auth"
    | "create-room"
    | "join-room"
    | "start-game"
    | "logout"
    | null;
  errorMessage: string;
  user: User;
  onCreateRoom: () => Promise<void>;
  onJoinRoom: (roomCode: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

function Lobbies({
  busyAction,
  errorMessage,
  user,
  onCreateRoom,
  onJoinRoom,
  onLogout,
}: LobbiesProps) {
  const [roomCode, setRoomCode] = useState("");

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-transparent">
        <nav className="flex justify-between items-center w-full px-4 md:px-6 py-4 md:py-3">
          <div className="flex items-center gap-6">
            <span className="text-xl font-extrabold tracking-tight text-primary">
              Dots & Boxes
            </span>
            <div className="hidden md:flex gap-4 items-center text-sm">
              <span className="font-bold text-primary border-b-4 border-primary pb-1">
                Lobbies
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                Signed in
              </p>
              <p className="font-bold">{user.username}</p>
            </div>
            <button
              className="rounded-full px-4 py-2 text-sm font-semibold bg-surface-container-low hover:bg-surface-container transition-colors disabled:opacity-70"
              disabled={busyAction === "logout"}
              onClick={() => void onLogout()}
              type="button"
            >
              {busyAction === "logout" ? "Signing out..." : "Logout"}
            </button>
          </div>
        </nav>
      </header>

      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary-container/20 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-secondary-container/30 blur-[100px] rounded-full -z-10"></div>

      <main className="pt-24 md:pt-20 pb-24 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="text-center mb-6 md:mb-8 space-y-1 md:space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
              Ready for Battle?
            </h1>
            <p className="text-on-surface-variant text-xs md:text-sm lg:text-base max-w-2xl mx-auto px-2">
              Create a lobby as host or enter a code from another player to
              join.
            </p>
          </div>

          {errorMessage && (
            <div className="max-w-2xl mx-auto rounded-2xl bg-red-100 text-red-700 px-4 py-3 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
            <div className="group relative bg-surface-container-low rounded-lg p-4 md:p-6 flex flex-col justify-between min-h-[240px] md:min-h-[280px] shadow-md hover:bg-surface-container transition-colors duration-300">
              <div className="space-y-3">
                <div className="w-full h-24 md:h-32 rounded-lg overflow-hidden relative bg-surface-container-highest">
                  <img
                    alt="Create Lobby Visual"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={createLobbyImg}
                  />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-on-surface mb-0.5 md:mb-1">
                    Create Lobby
                  </h2>
                  <p className="text-on-surface-variant text-xs md:text-xs leading-relaxed">
                    Host a room, share the code, and start when your opponent
                    arrives.
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-4">
                <button
                  className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-full bg-gradient-to-br from-primary to-primary-fixed text-on-primary font-bold text-xs md:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md group-hover:shadow-primary/20 hover:brightness-110 disabled:opacity-70 disabled:cursor-wait"
                  disabled={busyAction === "create-room"}
                  onClick={() => void onCreateRoom()}
                  type="button"
                >
                  <span>
                    {busyAction === "create-room"
                      ? "Creating..."
                      : "Start Hosting"}
                  </span>
                  <span
                    className="material-symbols-outlined text-base md:text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>

            <div className="group relative bg-surface-container-highest/50 backdrop-blur-xl rounded-lg p-4 md:p-6 flex flex-col justify-between min-h-[240px] md:min-h-[280px] shadow-sm hover:bg-surface-container-highest transition-colors duration-300">
              <div className="space-y-3">
                <div className="w-full h-24 md:h-32 rounded-lg overflow-hidden relative bg-surface-container-highest">
                  <img
                    alt="Join Lobby Visual"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={joinLobbyImg}
                  />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-on-surface mb-0.5 md:mb-1">
                    Join Lobby
                  </h2>
                  <p className="text-on-surface-variant text-xs md:text-xs leading-relaxed">
                    Paste a code and jump directly into a private match.
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-4 space-y-2">
                <div className="relative">
                  <input
                    className="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-lg bg-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-secondary text-on-surface font-semibold text-xs md:text-sm placeholder:text-on-surface-variant uppercase"
                    maxLength={40}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Room Code..."
                    type="text"
                    value={roomCode}
                  />
                </div>
                <button
                  className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs md:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:brightness-90 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={!roomCode.trim() || busyAction === "join-room"}
                  onClick={() => void onJoinRoom(roomCode)}
                  type="button"
                >
                  <span>
                    {busyAction === "join-room" ? "Joining..." : "Join"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Lobbies;
