import {
  type BoardSize,
  type Box,
  type Edge,
  type GameState,
  type Player,
} from "../types/game.types";

export const DEFAULT_BOARD_SIZE: BoardSize = 6;

export function createHorizontalEdges(boardSize: number): Edge[] {
  const edges: Edge[] = [];

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize - 1; col += 1) {
      edges.push({
        id: `H-${row}-${col}`,
        orientation: "H",
        row,
        col,
        claimedBy: null,
      });
    }
  }

  return edges;
}

export function createVerticalEdges(boardSize: number): Edge[] {
  const edges: Edge[] = [];

  for (let row = 0; row < boardSize - 1; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      edges.push({
        id: `V-${row}-${col}`,
        orientation: "V",
        row,
        col,
        claimedBy: null,
      });
    }
  }

  return edges;
}

export function createBoxes(boardSize: number): Box[] {
  const boxes: Box[] = [];

  for (let row = 0; row < boardSize - 1; row += 1) {
    for (let col = 0; col < boardSize - 1; col += 1) {
      boxes.push({ id: `B-${row}-${col}`, row, col, claimedBy: null });
    }
  }

  return boxes;
}

export function createInitialScores(players: Player[]): Record<string, number> {
  return players.reduce<Record<string, number>>((scores, player) => {
    scores[player.id] = 0;
    return scores;
  }, {});
  // This will be { "playerId123" : 0, "playerId999": 0 }
}

export function createInitialGameState(
  roomId: string,
  players: Player[],
  boardSize: BoardSize = DEFAULT_BOARD_SIZE,
): GameState {
  if (players.length === 0) {
    throw new Error("At least one player is required to create a game");
  }

  return {
    roomId,
    boardSize,
    players: players.map((player) => ({ ...player })),
    // This is clonging the players, not copying the same references
    currentTurnPlayerId: players[0].id,
    edges: [
      ...createHorizontalEdges(boardSize),
      ...createVerticalEdges(boardSize),
    ],
    boxes: createBoxes(boardSize),
    scores: createInitialScores(players),
    status: "playing",
    winnerPlayerId: null,
  };
}
