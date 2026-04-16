import { useState } from "react";
import createLobbyImg from "../assets/create-lobby.png";
import joinLobbyImg from "../assets/join-lobby.png";

interface LobbiesProps {
    onStartGame?: () => void;
}

function Lobbies({ onStartGame }: LobbiesProps) {
    const [roomCode, setRoomCode] = useState("");

    return (
        <div className="bg-background text-on-surface min-h-screen">
            {/* Top NavBar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-transparent">
                <nav className="flex justify-between items-center w-full px-4 md:px-6 py-4 md:py-3">
                    <div className="flex items-center gap-6">
                        <span className="text-xl font-extrabold tracking-tight text-primary">Dots & Boxes</span>
                        <div className="hidden md:flex gap-4 items-center text-sm">
                            <a className="font-bold text-primary border-b-4 border-primary pb-1" href="#">
                                Lobbies
                            </a>
                            <a className="font-bold text-on-surface opacity-60 hover:opacity-100" href="#">
                                Leaderboard
                            </a>
                            <a className="font-bold text-on-surface opacity-60 hover:opacity-100" href="#">
                                History
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="material-symbols-outlined text-sm text-on-surface opacity-60 hover:opacity-100">
                            help
                        </button>
                        <button className="material-symbols-outlined text-sm text-on-surface opacity-60 hover:opacity-100">
                            settings
                        </button>
                        <div className="h-8 w-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <img
                                alt="Current player avatar"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf7cqo7gbbyFjY12KZFLJgNOiH-tFIVL8mlUyQb3245tD6BYntLbOYq1oPbbYdIn1DYcIJSoR6OMNsTXwJMmnSMO--dnfcCowLfedLeEQYncS-j03viJzxu34WrrYBa0RWRicF2BCjkrNpXq_trTN1SfDYIgyO4Uvu5RcEKXckd7VrquSfiPGa1Fgt2-cgswgqkhld-McIiuH6yZ9nEk13XOepFivd-lF3cGdyy-gWm-ENMbEPVBRNGr9NG8ZRlatYfS7ecZ7VAA8"
                            />
                        </div>
                    </div>
                </nav>
            </header>

            {/* Decoration Blobs */}
            <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary-container/20 blur-[120px] rounded-full -z-10"></div>
            <div className="fixed bottom-[-5%] left-[-5%] w-[30vw] h-[30vw] bg-secondary-container/30 blur-[100px] rounded-full -z-10"></div>

            {/* Main Content */}
            <main className="pt-24 md:pt-20 pb-24 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col gap-6 md:gap-8">
                    {/* Header Section */}
                    <div className="text-center mb-6 md:mb-8 space-y-1 md:space-y-2">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface">
                            Ready for Battle?
                        </h1>
                        <p className="text-on-surface-variant text-xs md:text-sm lg:text-base max-w-2xl mx-auto px-2">
                            Choose your path: Create a private match or join a public lobby to find a challenger.
                        </p>
                    </div>

                    {/* Room Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
                    {/* Create Lobby Card */}
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
                                    Host a match, set rules, invite friends via code.
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 md:mt-4">
                            <button
                                onClick={onStartGame}
                                className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-full bg-gradient-to-br from-primary to-primary-fixed text-on-primary font-bold text-xs md:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md group-hover:shadow-primary/20 hover:brightness-110">
                                <span>Start Hosting</span>
                                <span className="material-symbols-outlined text-base md:text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Join Lobby Card */}
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
                                    Browse games or enter a code to play.
                                </p>
                            </div>
                        </div>
                        <div className="mt-3 md:mt-4 space-y-2">
                            <div className="relative">
                                <input
                                    className="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-lg bg-surface border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-secondary text-on-surface font-semibold text-xs md:text-sm placeholder:text-on-surface-variant"
                                    placeholder="Room Code..."
                                    type="text"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value)}
                                />
                            </div>
                            <button className="w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs md:text-sm flex items-center justify-center gap-2 active:scale-95 transition-all hover:brightness-90">
                                <span>Join</span>
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </main>

            {/* Mobile Bottom NavBar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-lg border-t border-outline-variant/15 px-6 py-2 flex justify-around items-center z-50">
                <button className="flex flex-col items-center gap-1 text-on-surface opacity-60 hover:opacity-100 transition-opacity text-xs">
                    <span className="material-symbols-outlined text-sm">home</span>
                    <span className="font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-primary text-xs">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        swords
                    </span>
                    <span className="font-bold">Lobbies</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-on-surface opacity-60 hover:opacity-100 transition-opacity text-xs">
                    <span className="material-symbols-outlined text-sm">leaderboard</span>
                    <span className="font-bold">Board</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-on-surface opacity-60 hover:opacity-100 transition-opacity text-xs">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span className="font-bold">Profile</span>
                </button>
            </nav>
        </div>
    );
}

export default Lobbies;
