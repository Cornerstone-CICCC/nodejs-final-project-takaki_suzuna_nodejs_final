import { useState, useEffect } from "react";
import Dot from "../components/dot";
import Line from "../components/line";
import Box from "../components/box";

interface GameProps {
    onGameEnd?: () => void;
}

function Game({ onGameEnd }: GameProps) {
    // Number of dots per side (6x6 dots)
    const size = 6;
    // Total grid size including lines (11x11 cells)
    const gridSize = size * 2 - 1;

    // State to track which horizontal lines are drawn and by whom
    const [hLines, setHLines] = useState<Record<string, string>>({});
    // State to track which vertical lines are drawn and by whom
    const [vLines, setVLines] = useState<Record<string, string>>({});
    // State to track which boxes are completed and by whom (owner name)
    const [boxes, setBoxes] = useState<Record<string, string>>({});
    // State to track the current player
    const [currentPlayer, setCurrentPlayer] = useState<"P1" | "P2">("P1");
    // State to track scores
    const [scores, setScores] = useState({ P1: 0, P2: 0 });
    // State for grid zoom
    const [zoomLevel, setZoomLevel] = useState(1);
    // State for turn timer
    const [timeLeft, setTimeLeft] = useState(60);
    // State to track game winner
    const [winner, setWinner] = useState<"P1" | "P2" | null>(null);
    const totalBoxes = 25; // 5x5 boxes

    // Timer effect
    useEffect(() => {
        if (winner) return; // Don't run timer if game is finished

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Change turn when time is up
                    const nextPlayer = currentPlayer === "P1" ? "P2" : "P1";
                    setCurrentPlayer(nextPlayer);
                    return 60; // Reset timer
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentPlayer, winner]);

    // Check if game is finished
    useEffect(() => {
        if (Object.keys(boxes).length === totalBoxes && !winner) {
            // Game finished, determine winner
            const p1Score = scores.P1;
            const p2Score = scores.P2;

            if (p1Score > p2Score) {
                setWinner("P1");
            } else if (p2Score > p1Score) {
                setWinner("P2");
            }
        }
    }, [boxes, scores, winner]);

    // Check if a box is completed by verifying all 4 sides are drawn
    const isBoxCompleteWithLines = (
        row: number,
        col: number,
        hLinesState: Record<string, string>,
        vLinesState: Record<string, string>
    ): boolean => {
        // Validate box position is within grid bounds
        if (row < 1 || row >= gridSize - 1 || col < 1 || col >= gridSize - 1) return false;
        // Verify this position is actually a box (odd coordinates)
        if (row % 2 !== 1 || col % 2 !== 1) return false;

        // Get the state of all 4 sides of the box
        const top = hLinesState[`${row - 1}-${col}`];
        const bottom = hLinesState[`${row + 1}-${col}`];
        const left = vLinesState[`${row}-${col - 1}`];
        const right = vLinesState[`${row}-${col + 1}`];
        // Box is complete only if all 4 sides are drawn
        return !!(top && bottom && left && right);
    };

    // Generic function to handle both horizontal and vertical line clicks
    const handleLineClick = (
        key: string,
        lineType: "h" | "v",
        currentLines: Record<string, string>,
        setCurrentLines: (lines: Record<string, string>) => void,
        otherLines: Record<string, string>,
        owner: string // Player name who claimed the box
    ) => {
        // Prevent deactivating a line that's already drawn (lines are permanent)
        if (currentLines[key]) return;

        console.log(`${lineType === "h" ? "Horizontal" : "Vertical"} line clicked: ${key}`);

        // Add the new line to state with the owner's name
        const newLines = { ...currentLines, [key]: owner };
        setCurrentLines(newLines);

        // Extract row and col from the key (format: "row-col")
        const [row, col] = key.split("-").map(Number);

        // Track if any box was completed this turn
        let boxCompleted = false;

        if (lineType === "h") {
            // Horizontal line affects boxes above and below
            const checkRow1 = row - 1;
            const checkRow2 = row + 1;

            if (isBoxCompleteWithLines(checkRow1, col, newLines, otherLines)) {
                console.log(`box claimed by ${owner}`);
                setBoxes(prev => ({ ...prev, [`${checkRow1}-${col}`]: owner }));
                setScores(prev => ({ ...prev, [owner as "P1" | "P2"]: prev[owner as "P1" | "P2"] + 1 }));
                boxCompleted = true;
            }
            if (isBoxCompleteWithLines(checkRow2, col, newLines, otherLines)) {
                console.log(`box claimed by ${owner}`);
                setBoxes(prev => ({ ...prev, [`${checkRow2}-${col}`]: owner }));
                setScores(prev => ({ ...prev, [owner as "P1" | "P2"]: prev[owner as "P1" | "P2"] + 1 }));
                boxCompleted = true;
            }
        } else {
            // Vertical line affects boxes to the left and right
            const checkCol1 = col - 1;
            const checkCol2 = col + 1;

            if (isBoxCompleteWithLines(row, checkCol1, otherLines, newLines)) {
                console.log(`box claimed by ${owner}`);
                setBoxes(prev => ({ ...prev, [`${row}-${checkCol1}`]: owner }));
                setScores(prev => ({ ...prev, [owner as "P1" | "P2"]: prev[owner as "P1" | "P2"] + 1 }));
                boxCompleted = true;
            }
            if (isBoxCompleteWithLines(row, checkCol2, otherLines, newLines)) {
                console.log(`box claimed by ${owner}`);
                setBoxes(prev => ({ ...prev, [`${row}-${checkCol2}`]: owner }));
                setScores(prev => ({ ...prev, [owner as "P1" | "P2"]: prev[owner as "P1" | "P2"] + 1 }));
                boxCompleted = true;
            }
        }

        // If no box was completed, switch to the next player
        if (!boxCompleted) {
            const nextPlayer = currentPlayer === "P1" ? "P2" : "P1";
            setCurrentPlayer(nextPlayer);
            console.log(`Turn passed to ${nextPlayer}`);
        }
    };

    // Handle horizontal line clicks
    const toggleH = (key: string) => {
        handleLineClick(key, "h", hLines, setHLines, vLines, currentPlayer);
    };

    // Handle vertical line clicks
    const toggleV = (key: string) => {
        handleLineClick(key, "v", vLines, setVLines, hLines, currentPlayer);
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col overflow-hidden">
            {/* TopNavBar */}
            <header className="bg-background flex justify-between items-center w-full px-4 md:px-6 py-3 md:py-4 z-50 border-b border-outline-variant/10">
                <div className="flex items-center gap-4 md:gap-8">
                    <span className="text-lg md:text-2xl font-extrabold tracking-tight text-primary">Dots & Boxes</span>
                    <nav className="hidden md:flex gap-4 md:gap-6 text-sm">
                        <a className="font-bold text-primary border-b-4 border-primary pb-1" href="#">
                            Lobbies
                        </a>
                        <a className="font-bold text-on-surface opacity-60 hover:opacity-100" href="#">
                            Leaderboard
                        </a>
                        <a className="font-bold text-on-surface opacity-60 hover:opacity-100" href="#">
                            Shop
                        </a>
                    </nav>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <button className="material-symbols-outlined text-primary hover:scale-105 transition-transform active:scale-95">
                        settings
                    </button>
                    <button className="material-symbols-outlined text-primary hover:scale-105 transition-transform active:scale-95">
                        help
                    </button>
                    <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-surface-container overflow-hidden border-2 border-primary-container">
                        <img
                            alt="Current player avatar"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2cNZ-Mrmf-ox9kB2N6784KLq95fq_iAlMfNJUMvkmvxNAweX0QoLofDaYvDxrIZr5XiJNabUk0Ord870_dfG-M6Di5HzycOsECyKHM9Q4YWKVRmVhmbUHeDA8kOXFVy2gUfDgmfGZdKOXy-kExEt5C4YHq-aCqEkdBshoS6RFe9EplRarqPuNSjZ8GwHUjh_1TEDMuNepYtFZKTC9n-mNw9ayxrfmEbBeyImAoSguso6rMoyKFBnAloAGI7XiOvjbLnb2AKYDIpc"
                        />
                    </div>
                </div>
            </header>

            {/* HUD: Active Info */}
            <div className="flex justify-center px-4 py-2 md:py-4 bg-surface-container-low/50 md:bg-transparent">
                <div className="hidden md:flex items-center gap-3 md:gap-6 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-surface-container-low shadow-md text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${currentPlayer === "P1" ? "bg-primary" : "bg-secondary"}`}></div>
                        <span className="font-bold">{currentPlayer}'s Turn</span>
                    </div>
                    <div className="w-px h-3 bg-outline-variant/30"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-on-surface-variant uppercase">Time</span>
                        <span className="font-mono font-bold tabular-nums">
                            {String(Math.floor(timeLeft / 60)).padStart(1, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                        </span>
                    </div>
                </div>
                {/* Mobile HUD */}
                <div className="md:hidden flex items-center gap-2 text-xs text-on-surface">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${currentPlayer === "P1" ? "bg-primary" : "bg-secondary"}`}></div>
                    <span className="font-bold">{currentPlayer}'s Turn</span>
                    <div className="w-px h-3 bg-outline-variant/30 mx-2"></div>
                    <span className="text-[10px] font-black text-on-surface-variant uppercase">Time</span>
                    <span className="font-mono font-bold tabular-nums">
                        {String(Math.floor(timeLeft / 60)).padStart(1, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </span>
                </div>
            </div>

            {/* Main Game Area */}
            <main className="flex-1 flex flex-col md:flex-row p-1 md:p-6 gap-2 md:gap-6 overflow-hidden">
                {/* Left Side Panel: Player One */}
                <aside className="hidden lg:flex flex-col w-64 gap-4 flex-shrink-0">
                    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col items-center shadow-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                        <div className="w-20 h-20 rounded-full bg-primary-container p-1 mb-3">
                            <img
                                alt="Player One"
                                className="w-full h-full rounded-full bg-surface"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsPiwo7nngEwamrC3JG4VzkeednjaG9ZcG9HpVBcPGVwLyOtp-WPFDA3jUxGYAZ9z5NOU-ppvdmmSmtsKoaQOXmH8PLrMJyPU_6IfPiCqfo9E1zOIV1pOtHzUjS_3kPtM4IivqGX0_oplqt22iYOwx4xqKj0B4zRXeYTc__dNIro7KnIQA93WOOJPlOkzdacGFgylQlxMc-dW2I20ABkyPdB4-xV7OjArar8ojYef5-ktafZPkphl5kSW5zMI37CkM-MGUDHqSN6E"
                            />
                        </div>
                        <h2 className="text-lg font-black text-on-surface">Player One</h2>
                        <p className="text-xs font-semibold text-primary mb-3">Rank: Grandmaster</p>
                        <div className="w-full space-y-2 mb-4">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Score</span>
                                <span className="text-primary text-lg">{scores.P1}</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all" style={{ width: `${(scores.P1 / totalBoxes) * 100}%` }}></div>
                            </div>
                        </div>
                        {currentPlayer === "P1" && (
                            <div className="bg-primary text-on-primary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                YOUR TURN
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Game Canvas */}
                <section className="flex-1 flex flex-col bg-surface-container rounded-lg md:rounded-xl overflow-hidden relative border border-outline-variant/15 min-h-[250px] md:min-h-[400px] lg:min-h-auto">
                    {/* The Grid Board */}
                    <div className="flex-1 flex items-center justify-center p-1 md:p-4 lg:p-8 overflow-auto">
                        <div
                            className="grid"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, ${30 * zoomLevel}px)`,
                                gridTemplateRows: `repeat(${gridSize}, ${30 * zoomLevel}px)`,
                                placeItems: "center",
                                gap: "0px"
                            }}
                        >
                            {Array.from({ length: gridSize }).map((_, row) =>
                                Array.from({ length: gridSize }).map((_, col) => {
                                    const isDot = row % 2 === 0 && col % 2 === 0;
                                    const isH = row % 2 === 0 && col % 2 === 1;
                                    const isV = row % 2 === 1 && col % 2 === 0;
                                    const isBox = row % 2 === 1 && col % 2 === 1;

                                    const key = `${row}-${col}`;

                                    if (isDot) return <Dot key={key} />;

                                    if (isH) {
                                        return (
                                            <Line
                                                key={key}
                                                type="h"
                                                active={hLines[key] || null}
                                                onClick={() => toggleH(key)}
                                                zoom={zoomLevel}
                                            />
                                        );
                                    }

                                    if (isV) {
                                        return (
                                            <Line
                                                key={key}
                                                type="v"
                                                active={vLines[key] || null}
                                                onClick={() => toggleV(key)}
                                                zoom={zoomLevel}
                                            />
                                        );
                                    }

                                    if (isBox) {
                                        return <Box key={key} owner={boxes[key]} />;
                                    }

                                    return <div key={key} />;
                                })
                            )}
                        </div>
                    </div>

                    {/* Action Floating Group */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button
                            onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : 1)}
                            className="hidden md:flex w-10 h-10 md:w-14 md:h-14 rounded-lg bg-surface-container-highest shadow-md items-center justify-center hover:scale-110 transition-transform active:scale-95">
                            <span className="material-symbols-outlined text-xs md:text-base">
                                {zoomLevel === 1 ? "zoom_in" : "zoom_out"}
                            </span>
                        </button>
                    </div>
                </section>

                {/* Right Side Panel: Player Two */}
                <aside className="hidden lg:flex flex-col w-64 gap-4 flex-shrink-0">
                    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col items-center shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-secondary"></div>
                        <div className="w-20 h-20 rounded-full bg-secondary-container p-1 mb-3">
                            <img
                                alt="Player Two"
                                className="w-full h-full rounded-full bg-surface"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALfWY9gF8D-O29ctnEHcl4_R9TIuqTzIR1sxV8iDOiNHYFwKVQdd3lQW0D1xeVy7rrtX9BxypytkL2sHbEMnPdNvjj2FPDDfLnvdjVlPkVHbfCd4gqhBhUP9fCQYnIhDgjU0qoxUHvU1bW-duXZguiVDZ7JrkMcMxRCgJCSqCoRZBBmtms4zolYdXfKbkcieByFIy_1500mJ8idfJ449Oeaik_y5hmgKQKorCAlUxAeqStIqImsZHTWhrhoQ6Tj0I2laA0HdXRSZo"
                            />
                        </div>
                        <h2 className="text-lg font-black text-on-surface">Player Two</h2>
                        <p className="text-xs font-semibold text-secondary mb-3">Rank: Master</p>
                        <div className="w-full space-y-2 mb-4">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Score</span>
                                <span className="text-secondary text-lg">{scores.P2}</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-secondary transition-all" style={{ width: `${(scores.P2 / totalBoxes) * 100}%` }}></div>
                            </div>
                        </div>
                        {currentPlayer === "P2" && (
                            <div className="bg-secondary text-on-secondary text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                YOUR TURN
                            </div>
                        )}
                    </div>

                    <div className="bg-surface-container-low rounded-lg p-4 flex flex-col gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Stats</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-surface p-2 rounded-lg border border-outline-variant/10">
                                <p className="text-[10px] uppercase font-bold text-outline">Boxes Left</p>
                                <p className="text-lg font-black">{25 - Object.keys(boxes).length}</p>
                            </div>
                            <div className="bg-surface p-2 rounded-lg border border-outline-variant/10">
                                <p className="text-[10px] uppercase font-bold text-outline">Avg Turn</p>
                                <p className="text-lg font-black">4s</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Mobile Bottom NavBar */}
            <nav className="md:hidden flex justify-around items-center bg-surface-container-highest px-4 py-2 border-t border-outline-variant/15">
                <button className="flex flex-col items-center gap-0.5 text-primary py-2">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        home
                    </span>
                    <span className="text-[10px] font-bold">Game</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-on-surface-variant opacity-60 py-2">
                    <span className="material-symbols-outlined text-sm">chat</span>
                    <span className="text-[10px] font-bold">Chat</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-on-surface-variant opacity-60 py-2">
                    <span className="material-symbols-outlined text-sm">leaderboard</span>
                    <span className="text-[10px] font-bold">Stats</span>
                </button>
                <button className="flex flex-col items-center gap-0.5 text-on-surface-variant opacity-60 py-2">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </nav>

            {/* Victory Modal */}
            {winner && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-background rounded-3xl p-8 md:p-12 w-full mx-4 md:max-w-md shadow-2xl flex flex-col items-center text-center">
                        {/* Winner Avatar */}
                        <div className="relative mb-6">
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface-container-high p-1 border-4 border-primary mb-2">
                                <img
                                    alt="Winner"
                                    className="w-full h-full rounded-full bg-surface"
                                    src={winner === "P1" ? "https://lh3.googleusercontent.com/aida-public/AB6AXuBsPiwo7nngEwamrC3JG4VzkeednjaG9ZcG9HpVBcPGVwLyOtp-WPFDA3jUxGYAZ9z5NOU-ppvdmmSmtsKoaQOXmH8PLrMJyPU_6IfPiCqfo9E1zOIV1pOtHzUjS_3kPtM4IivqGX0_oplqt22iYOwx4xqKj0B4zRXeYTc__dNIro7KnIQA93WOOJPlOkzdacGFgylQlxMc-dW2I20ABkyPdB4-xV7OjArar8ojYef5-ktafZPkphl5kSW5zMI37CkM-MGUDHqSN6E" : "https://lh3.googleusercontent.com/aida-public/AB6AXuALfWY9gF8D-O29ctnEHcl4_R9TIuqTzIR1sxV8iDOiNHYFwKVQdd3lQW0D1xeVy7rrtX9BxypytkL2sHbEMnPdNvjj2FPDDfLnvdjVlPkVHbfCd4gqhBhUP9fCQYnIhDgjU0qoxUHvU1bW-duXZguiVDZ7JrkMcMxRCgJCSqCoRZBBmtms4zolYdXfKbkcieByFIy_1500mJ8idfJ449Oeaik_y5hmgKQKorCAlUxAeqStIqImsZHTWhrhoQ6Tj0I2laA0HdXRSZo"}
                                />
                            </div>
                        </div>

                        {/* Victory Text */}
                        <h1 className={`text-4xl md:text-5xl font-black mb-2 ${winner === "P1" ? "text-primary" : "text-secondary"}`}>
                            Victory!
                        </h1>
                        <p className="text-on-surface-variant text-sm md:text-base mb-6">
                            You dominated the board
                        </p>

                        {/* Stats */}
                        <div className="flex gap-6 md:gap-8 mb-8 w-full justify-center">
                            <div className="flex flex-col items-center">
                                <p className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                                    Boxes Won
                                </p>
                                <p className={`text-3xl md:text-4xl font-black ${winner === "P1" ? "text-primary" : "text-secondary"}`}>
                                    {Object.values(boxes).filter(owner => owner === winner).length}
                                </p>
                            </div>
                        </div>

                        {/* Return to Lobby Button */}
                        <button
                            onClick={() => onGameEnd?.()}
                            className={`w-full py-3 md:py-4 rounded-full font-bold text-lg md:text-xl text-white transition-all active:scale-95 ${winner === "P1" ? "bg-primary hover:bg-primary-dark" : "bg-secondary hover:bg-secondary-dark"
                                }`}
                        >
                            Return to Lobby
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;
