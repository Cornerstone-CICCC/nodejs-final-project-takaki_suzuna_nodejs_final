import { useEffect, useMemo, useRef, useState } from "react";
import Game from "./pages/game";
import Login from "./pages/login";
import Lobbies from "./pages/lobbies";
import WaitingLobby from "./pages/waiting-lobby";
import { authApi, roomApi } from "./lib/api";
import { createGameSocket } from "./lib/socket";
import type { ActivityItem, GameState, Room, User } from "./types/game";

type Page = "loading" | "login" | "lobbies" | "waiting-lobby" | "board";

type RoomPlayerJoinedPayload = {
  roomCode: string;
  player: { id: string; username: string };
  players: Room["players"];
};

type RoomPlayerLeftPayload = {
  roomCode: string;
  userId: string;
  players: Room["players"];
};

function buildActivity(text: string): ActivityItem {
  return { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text };
}

function App() {
  const [page, setPage] = useState<Page>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [socket, setSocket] = useState<Awaited<
    ReturnType<typeof createGameSocket>
  > | null>(null);
  const [socketRoomCode, setSocketRoomCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [socketRefreshKey, setSocketRefreshKey] = useState(0);
  const [busyAction, setBusyAction] = useState<
    "auth" | "create-room" | "join-room" | "start-game" | "logout" | null
  >(null);
  const joinedRoomRef = useRef<string | null>(null);

  const canStartGame = useMemo(() => {
    if (!room || !user) {
      return false;
    }

    return (
      room.hostUserId === user.id &&
      room.players.length === room.maxPlayers &&
      socketRoomCode === room.roomCode
    );
  }, [room, socketRoomCode, user]);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await authApi.me();

        if (!isMounted) {
          return;
        }

        setUser(response.user);
        setPage("lobbies");
      } catch {
        if (!isMounted) {
          return;
        }

        setPage("login");
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setSocketRoomCode(null);
      joinedRoomRef.current = null;
      return;
    }

    let isActive = true;
    let createdSocket: Awaited<ReturnType<typeof createGameSocket>> | null =
      null;

    const connectSocket = async () => {
      try {
        const nextSocket = await createGameSocket();

        if (!isActive) {
          nextSocket.disconnect();
          return;
        }

        createdSocket = nextSocket;
        setSocket(nextSocket);
      } catch (error) {
        if (!isActive) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to connect to game server";
        setErrorMessage(message);
      }
    };

    void connectSocket();

    return () => {
      isActive = false;
      createdSocket?.disconnect();
    };
  }, [socketRefreshKey, user]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleRoomJoined = (nextRoom: Room) => {
      joinedRoomRef.current = nextRoom.roomCode;
      setSocketRoomCode(nextRoom.roomCode);
      setRoom(nextRoom);
      setErrorMessage("");

      if (nextRoom.status === "playing") {
        setPage("board");
        return;
      }

      setGame((currentGame) =>
        currentGame?.roomId === nextRoom.roomCode ? null : currentGame,
      );
      setPage("waiting-lobby");
    };

    const handleRoomPlayerJoined = (payload: RoomPlayerJoinedPayload) => {
      setRoom((currentRoom) => {
        if (!currentRoom || currentRoom.roomCode !== payload.roomCode) {
          return currentRoom;
        }

        return {
          ...currentRoom,
          players: payload.players,
          status:
            payload.players.length >= currentRoom.maxPlayers
              ? "full"
              : "waiting",
        };
      });
      setActivity((current) => [
        buildActivity(`${payload.player.username} joined the lobby.`),
        ...current,
      ]);
    };

    const handleRoomPlayerLeft = (payload: RoomPlayerLeftPayload) => {
      setRoom((currentRoom) => {
        if (!currentRoom || currentRoom.roomCode !== payload.roomCode) {
          return currentRoom;
        }

        return {
          ...currentRoom,
          players: payload.players,
          hostUserId:
            currentRoom.hostUserId === payload.userId && payload.players[0]
              ? payload.players[0].id
              : currentRoom.hostUserId,
          status:
            payload.players.length >= currentRoom.maxPlayers
              ? "full"
              : "waiting",
        };
      });
      setGame(null);
      setPage("waiting-lobby");
      setActivity((current) => [
        buildActivity("A player left the lobby."),
        ...current,
      ]);
    };

    const handleRoomError = (payload: { message: string }) => {
      setErrorMessage(payload.message);
    };

    const handleGameStarted = (nextGame: GameState) => {
      setGame(nextGame);
      setPage("board");
      setErrorMessage("");
      setActivity((current) => [
        buildActivity("The match has started."),
        ...current,
      ]);
    };

    const handleGameStateUpdated = (nextGame: GameState) => {
      setGame(nextGame);
      setErrorMessage("");
    };

    const handleGameFinished = (nextGame: GameState) => {
      setGame(nextGame);
      setActivity((current) => [
        buildActivity("The match is finished."),
        ...current,
      ]);
    };

    const handleGameError = (payload: { message: string }) => {
      setErrorMessage(payload.message);
    };

    socket.on("room:joined", handleRoomJoined);
    socket.on("room:player_joined", handleRoomPlayerJoined);
    socket.on("room:player_left", handleRoomPlayerLeft);
    socket.on("room:error", handleRoomError);
    socket.on("game:started", handleGameStarted);
    socket.on("game:state_updated", handleGameStateUpdated);
    socket.on("game:finished", handleGameFinished);
    socket.on("game:error", handleGameError);

    return () => {
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:player_joined", handleRoomPlayerJoined);
      socket.off("room:player_left", handleRoomPlayerLeft);
      socket.off("room:error", handleRoomError);
      socket.off("game:started", handleGameStarted);
      socket.off("game:state_updated", handleGameStateUpdated);
      socket.off("game:finished", handleGameFinished);
      socket.off("game:error", handleGameError);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !room?.roomCode) {
      return;
    }

    if (joinedRoomRef.current === room.roomCode) {
      return;
    }

    socket.emit("room:join", { roomCode: room.roomCode });
  }, [room?.roomCode, socket]);

  const handleAuthenticate = async (payload: {
    email: string;
    password: string;
    username?: string;
    mode: "login" | "signup";
  }) => {
    setBusyAction("auth");
    setErrorMessage("");

    try {
      const response =
        payload.mode === "login"
          ? await authApi.login(payload.email, payload.password)
          : await authApi.signup(
              payload.username ?? "",
              payload.email,
              payload.password,
            );

      setUser(response.user);
      setRoom(null);
      setGame(null);
      setActivity([]);
      setPage("lobbies");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      setErrorMessage(message);
    } finally {
      setBusyAction(null);
    }
  };

  const handleCreateRoom = async () => {
    setBusyAction("create-room");
    setErrorMessage("");

    try {
      const nextRoom = await roomApi.create();
      joinedRoomRef.current = null;
      setSocketRoomCode(null);
      setRoom(nextRoom);
      setGame(null);
      setActivity([
        buildActivity("Lobby created. Waiting for another player."),
      ]);
      setPage("waiting-lobby");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create room";
      setErrorMessage(message);
    } finally {
      setBusyAction(null);
    }
  };

  const handleJoinRoom = async (roomCode: string) => {
    setBusyAction("join-room");
    setErrorMessage("");

    try {
      const nextRoom = await roomApi.join(roomCode);
      joinedRoomRef.current = null;
      setSocketRoomCode(null);
      setRoom(nextRoom);
      setGame(null);
      setActivity([buildActivity(`Joined lobby ${nextRoom.roomCode}.`)]);
      setPage("waiting-lobby");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to join room";
      setErrorMessage(message);
    } finally {
      setBusyAction(null);
    }
  };

  const handleStartGame = () => {
    if (!socket || !room) {
      return;
    }

    setBusyAction("start-game");
    setErrorMessage("");
    socket.emit("game:start", { roomCode: room.roomCode });
    window.setTimeout(() => {
      setBusyAction((current) => (current === "start-game" ? null : current));
    }, 1200);
  };

  const handleMakeMove = (edgeId: string) => {
    if (!socket || !room) {
      return;
    }

    socket.emit("game:make_move", { roomCode: room.roomCode, edgeId });
  };

  const handleReturnToLobbies = () => {
    socket?.disconnect();
    setSocket(null);
    setRoom(null);
    setGame(null);
    setSocketRoomCode(null);
    joinedRoomRef.current = null;
    setErrorMessage("");
    setPage("lobbies");
    setSocketRefreshKey((current) => current + 1);
  };

  const handleLogout = async () => {
    setBusyAction("logout");

    try {
      await authApi.logout();
    } catch {
      // Ignore logout failures and continue clearing the local session.
    } finally {
      socket?.disconnect();
      setSocket(null);
      setUser(null);
      setRoom(null);
      setGame(null);
      setActivity([]);
      setSocketRoomCode(null);
      joinedRoomRef.current = null;
      setErrorMessage("");
      setBusyAction(null);
      setPage("login");
    }
  };

  if (page === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">
            Dots & Boxes
          </p>
          <p className="text-2xl font-semibold">Checking your session...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      {page === "login" && (
        <Login
          busy={busyAction === "auth"}
          errorMessage={errorMessage}
          onAuthenticate={handleAuthenticate}
        />
      )}
      {page === "lobbies" && user && (
        <Lobbies
          busyAction={busyAction}
          errorMessage={errorMessage}
          user={user}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onLogout={handleLogout}
        />
      )}
      {page === "waiting-lobby" && room && user && (
        <WaitingLobby
          activity={activity}
          busyAction={busyAction}
          canStartGame={canStartGame}
          errorMessage={errorMessage}
          room={room}
          socketReady={socketRoomCode === room.roomCode}
          user={user}
          onBack={handleReturnToLobbies}
          onStartGame={handleStartGame}
        />
      )}
      {page === "board" && room && game && user && (
        <Game
          errorMessage={errorMessage}
          game={game}
          room={room}
          user={user}
          onLeaveMatch={handleReturnToLobbies}
          onMakeMove={handleMakeMove}
        />
      )}
    </main>
  );
}

export default App;
