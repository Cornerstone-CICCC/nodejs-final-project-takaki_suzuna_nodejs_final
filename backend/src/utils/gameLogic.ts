import { type Box, type Edge, type GameState } from "../types/game.types";

export class GameLogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GameLogicError";
  }
}

export function findEdgeById(edges: Edge[], edgeId: string): Edge | undefined {
  return edges.find((edge) => edge.id === edgeId);
}

export function isPlayerInGame(
  gameState: GameState,
  playerId: string,
): boolean {
  return gameState.players.some((player) => player.id === playerId);
}

export function isPlayersTurn(gameState: GameState, playerId: string): boolean {
  return gameState.currentTurnPlayerId === playerId;
}

export function isEdgeUnclaimed(edge: Edge): boolean {
  return edge.claimedBy === null;
}

export function areAllEdgesClaimed(edges: Edge[]): boolean {
  return edges.every((edge) => edge.claimedBy !== null);
}

export function calculateWinner(scores: Record<string, number>): string | null {
  const entries = Object.entries(scores);

  if (entries.length === 0) {
    return null;
  }

  let winnerPlayerId: string | null = null;
  let highestScore = Number.NEGATIVE_INFINITY;
  let isTie = false;

  for (const [playerId, score] of entries) {
    if (score > highestScore) {
      highestScore = score;
      winnerPlayerId = playerId;
      isTie = false;
      continue;
    }

    if (score === highestScore) {
      isTie = true;
    }
  }

  return isTie ? null : winnerPlayerId;
}

export function getCandidateBoxIds(edge: Edge, boardSize: number): string[] {
  const candidateBoxIds: string[] = [];

  if (edge.orientation === "H") {
    if (edge.row > 0) {
      candidateBoxIds.push(`B-${edge.row - 1}-${edge.col}`);
    }

    if (edge.row < boardSize - 1) {
      candidateBoxIds.push(`B-${edge.row}-${edge.col}`);
    }
  } else {
    if (edge.col > 0) {
      candidateBoxIds.push(`B-${edge.row}-${edge.col - 1}`);
    }

    if (edge.col < boardSize - 1) {
      candidateBoxIds.push(`B-${edge.row}-${edge.col}`);
    }
  }

  return candidateBoxIds;
}

export function getRequiredEdgeIdsForBox(box: Box): string[] {
  return [
    `H-${box.row}-${box.col}`,
    `H-${box.row + 1}-${box.col}`,
    `V-${box.row}-${box.col}`,
    `V-${box.row}-${box.col + 1}`,
  ];
}

export function isBoxCompleted(box: Box, edges: Edge[]): boolean {
  const edgeLookup = new Map(edges.map((edge) => [edge.id, edge]));

  return getRequiredEdgeIdsForBox(box).every((edgeId) => {
    const edge = edgeLookup.get(edgeId);
    return edge?.claimedBy !== null;
  });
}

function findBoxById(boxes: Box[], boxId: string): Box | undefined {
  return boxes.find((box) => box.id === boxId);
}

function getNextPlayerId(
  gameState: GameState,
  currentPlayerId: string,
): string {
  const currentIndex = gameState.players.findIndex(
    (player) => player.id === currentPlayerId,
  );

  if (currentIndex === -1) {
    throw new GameLogicError("Player is not part of this game");
  }

  const nextIndex = (currentIndex + 1) % gameState.players.length;
  return gameState.players[nextIndex].id;
}

export function applyMove(
  gameState: GameState,
  playerId: string,
  edgeId: string,
): GameState {
  if (gameState.status !== "playing") {
    throw new GameLogicError("Game is not in playing state");
  }

  if (!isPlayerInGame(gameState, playerId)) {
    throw new GameLogicError("Player is not part of this game");
  }

  if (!isPlayersTurn(gameState, playerId)) {
    throw new GameLogicError("It is not this player's turn");
  }

  const targetEdge = findEdgeById(gameState.edges, edgeId);
  if (!targetEdge) {
    throw new GameLogicError("Edge does not exist");
  }

  if (!isEdgeUnclaimed(targetEdge)) {
    throw new GameLogicError("Edge is already claimed");
  }

  const nextEdges = gameState.edges.map((edge) =>
    edge.id === edgeId ? { ...edge, claimedBy: playerId } : { ...edge },
  );
  const nextBoxes = gameState.boxes.map((box) => ({ ...box }));
  const nextScores = { ...gameState.scores };

  const claimedEdge = findEdgeById(nextEdges, edgeId);
  if (!claimedEdge) {
    throw new GameLogicError("Claimed edge could not be found");
  }

  const completedBoxIds: string[] = [];

  for (const boxId of getCandidateBoxIds(claimedEdge, gameState.boardSize)) {
    const box = findBoxById(nextBoxes, boxId);

    if (!box || box.claimedBy !== null) {
      continue;
    }

    if (!isBoxCompleted(box, nextEdges)) {
      continue;
    }

    box.claimedBy = playerId;
    nextScores[playerId] = (nextScores[playerId] ?? 0) + 1;
    completedBoxIds.push(box.id);
  }

  const allEdgesClaimed = areAllEdgesClaimed(nextEdges);
  const status = allEdgesClaimed ? "finished" : gameState.status;
  const winnerPlayerId = allEdgesClaimed
    ? calculateWinner(nextScores)
    : gameState.winnerPlayerId;
  const currentTurnPlayerId =
    completedBoxIds.length > 0 || allEdgesClaimed
      ? playerId
      : getNextPlayerId(gameState, playerId);

  return {
    ...gameState,
    players: gameState.players.map((player) => ({ ...player })),
    edges: nextEdges,
    boxes: nextBoxes,
    scores: nextScores,
    currentTurnPlayerId,
    status,
    winnerPlayerId,
  };
}
