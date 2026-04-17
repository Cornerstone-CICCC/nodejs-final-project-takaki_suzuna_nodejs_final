import { useState } from "react";
import Game from "./pages/game";
import Login from "./pages/login";
import Lobbies from "./pages/lobbies";
import WaitingLobby from "./pages/waiting-lobby";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "lobbies" | "waiting-lobby" | "board">("login");
  const [roomCode, setRoomCode] = useState<string>("");

  const generateRoomCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const part1 = Array.from({ length: 2 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
    const part2 = Array.from({ length: 4 }, () => characters[Math.floor(Math.random() * characters.length)]).join("");
    return `${part1}-${part2}`;
  };

  const handleLoginSuccess = () => {
    setCurrentPage("lobbies");
  };

  const handleStartGame = () => {
    // Generate room code only on first entry to waiting lobby
    if (!roomCode) {
      setRoomCode(generateRoomCode());
    }
    setCurrentPage("waiting-lobby");
  };

  const handlePlayMatch = () => {
    setCurrentPage("board");
  };

  const handleGameEnd = () => {
    setCurrentPage("waiting-lobby");
  };

  return (
    <main>
      {currentPage === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === "lobbies" && <Lobbies onStartGame={handleStartGame} />}
      {currentPage === "waiting-lobby" && <WaitingLobby roomCode={roomCode} onStartGame={handlePlayMatch} />}
      {currentPage === "board" && <Game onGameEnd={handleGameEnd} />}
    </main>
  );
}

export default App;
