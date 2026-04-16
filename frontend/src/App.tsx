import { useState } from "react";
import Game from "./pages/game";
import Login from "./pages/login";
import Lobbies from "./pages/lobbies";
import WaitingLobby from "./pages/waiting-lobby";

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "lobbies" | "waiting-lobby" | "board">("login");

  const handleLoginSuccess = () => {
    setCurrentPage("lobbies");
  };

  const handleStartGame = () => {
    setCurrentPage("waiting-lobby");
  };

  const handlePlayMatch = () => {
    setCurrentPage("board");
  };

  return (
    <main>
      {currentPage === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
      {currentPage === "lobbies" && <Lobbies onStartGame={handleStartGame} />}
      {currentPage === "waiting-lobby" && <WaitingLobby onStartGame={handlePlayMatch} />}
      {currentPage === "board" && <Game />}
    </main>
  );
}

export default App;
