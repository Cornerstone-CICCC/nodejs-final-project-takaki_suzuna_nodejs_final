import { useState } from "react";

interface WaitingLobbyProps {
    roomCode: string;
    onStartGame?: () => void;
}

function WaitingLobby({ roomCode, onStartGame }: WaitingLobbyProps) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { type: "player", player: "You", text: message }]);
            setMessage("");
        }
    };

    return (
        <div className="bg-background text-on-surface min-h-screen">
            {/* TopNavBar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background to-transparent flex justify-between items-center w-full px-6 py-4">
                <div className="flex items-center gap-6">
                    <span className="text-xl font-extrabold tracking-tight text-primary">Dots & Boxes</span>
                    <div className="hidden md:flex gap-4 items-center text-sm">
                        <a className="font-bold text-primary border-b-4 border-primary pb-1" href="#">
                            Home
                        </a>
                        <a className="font-bold text-on-surface opacity-60" href="#">
                            Lobbies
                        </a>
                        <a className="font-bold text-on-surface opacity-60" href="#">
                            Leaderboard
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="material-symbols-outlined text-sm text-on-surface opacity-60">
                        settings
                    </button>
                    <button className="material-symbols-outlined text-sm text-on-surface opacity-60">
                        help
                    </button>
                    <div className="h-8 w-8 rounded-full bg-primary-container overflow-hidden border-2 border-white">
                        <img
                            alt="Current player avatar"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiLI3NTCaWym08EC18-2BkRSJpjYX3ux5S5SLHHoBCPX1W5_SXbv2fk2Md1DdfajarsAh3JLOxD7sMHqysABf-N9HE9Xgm-sRrmhC-tT4V3Po0qwvE2P8gAZrxnWRfRY4IFGUFLNa3VxAFlKAcfjuSlRBxfdmOw9MF8D4j1Pt0RS6YC2EzNGoeiE2duhzpng97dUq3Hs0YaQzIG76pXUTJn3RitFuEAj3-13sUEbXWQrm0bBGHeWcHyJKyi0ec-_B4QgI2glLUGfg"
                        />
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* Main Lobby Content */}
                    <div className="flex-grow flex flex-col gap-6">
                        {/* Lobby Status Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-1">
                                    Waiting for Opponent
                                </h1>
                            </div>
                            <div className="bg-surface-container-low rounded-lg px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 w-full md:w-auto">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Lobby Code</span>
                                    <span className="text-xl md:text-2xl font-black text-primary tracking-widest">{roomCode}</span>
                                </div>
                                <button
                                    onClick={handleCopyCode}
                                    className={`${copied ? "bg-green-500" : "bg-primary-container"} text-on-primary-container p-2 md:p-3 rounded-full hover:scale-105 active:scale-95 transition-all`}>
                                    <span className="material-symbols-outlined text-lg md:text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        {copied ? "check" : "content_copy"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Player Slots */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {/* Player 1: Host */}
                            <div className="relative group">
                                <div className="bg-surface-container-lowest rounded-lg md:rounded-xl p-6 md:p-8 flex flex-col items-center text-center shadow-md">
                                    <div className="relative mb-4 md:mb-6">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-primary p-1">
                                            <img
                                                alt="Player One"
                                                className="w-full h-full rounded-full object-cover"
                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHVFVHHKr2DdKw3Vp6u2t5xyVWxK_kSDAFUvh-wbDGvDJfknDAtWZ_YJpwmdf7ouz_VPzrGxEyN5lX7x6GMIC1CRXDpVvjXh8Zq54Y0DHly2jdFYBzI6HWL1iFc6u_t2xrI_yyXx-Gc6qbiYojXpEMmuz5tiIf1zG48HQ4pCd0uZTxwwLRgd-hAZHEGfPR0G00SgmhqOgzhMrT1zDRr4mKfWfeZSNZBC8KtiJTWE1NCnC3QYrWu9gJZwgp9Fwqgs6QXLcT76mHue0"
                                            />
                                        </div>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[9px] md:text-[10px] font-black px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-tighter">
                                            HOST
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-on-surface mb-0.5 md:mb-1">
                                        Player One
                                    </h3>
                                    <p className="text-primary font-bold mb-3 md:mb-6 text-sm md:text-base">
                                        Grandmaster • Rank #42
                                    </p>
                                    <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary/10 text-primary rounded-full font-bold text-xs md:text-sm">
                                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            check_circle
                                        </span>
                                        READY
                                    </div>
                                </div>
                            </div>

                            {/* Player 2: Guest */}
                            <div className="relative group">
                                <div className="bg-surface-container-low rounded-lg md:rounded-xl p-6 md:p-8 flex flex-col items-center text-center border-2 border-dashed border-outline-variant/30">
                                    <div className="relative mb-4 md:mb-6">
                                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-surface-variant flex items-center justify-center text-outline-variant">
                                            <span className="material-symbols-outlined text-4xl md:text-6xl">person</span>
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-error-container rounded-full flex items-center justify-center text-on-error-container animate-pulse">
                                            <span className="material-symbols-outlined text-sm md:text-lg">hourglass_empty</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-on-surface opacity-40 mb-0.5 md:mb-1">
                                        Guest Player
                                    </h3>
                                    <p className="text-on-surface-variant font-bold mb-3 md:mb-6 italic text-sm md:text-base">
                                        Waiting for connection...
                                    </p>
                                    <div className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-surface-dim/30 text-outline rounded-full font-bold opacity-50 text-xs md:text-sm">
                                        <span className="material-symbols-outlined text-sm">radio_button_unchecked</span>
                                        NOT READY
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Start Match Action Area */}
                        <div className="flex flex-col items-center gap-3 md:gap-4 mt-2">
                            <button
                                onClick={onStartGame}
                                className="w-full md:w-auto min-w-[280px] md:min-w-[320px] bg-gradient-to-br from-primary to-primary-container text-on-primary text-lg md:text-xl font-black py-4 md:py-6 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-2xl md:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_arrow
                                </span>
                                START MATCH
                            </button>
                            <p className="text-on-surface-variant text-xs md:text-sm font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined text-base text-error">info</span>
                                Need 2 players to start the game
                            </p>
                        </div>
                    </div>

                    {/* Chat Sidebar */}
                    <aside className="w-full lg:w-80 flex flex-col h-96 md:h-[500px] lg:h-auto bg-surface-container-low rounded-lg md:rounded-xl overflow-hidden shadow-md border border-outline-variant/10">
                        <div className="p-4 bg-surface-container-high flex items-center justify-center">
                            <h4 className="font-black text-on-surface flex items-center gap-2 text-sm md:text-base">
                                <span className="material-symbols-outlined text-primary text-center">forum</span>
                                Lobby Chat
                            </h4>
                        </div>
                        <div className="flex-grow p-4 flex flex-col gap-3 overflow-y-auto bg-surface-container-low/50">
                            {messages.map((msg, idx) =>
                                msg.type === "system" ? (
                                    <div key={idx} className="text-center py-1">
                                        <span className="text-[9px] font-black text-outline uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded-full">
                                            System: {msg.text}
                                        </span>
                                    </div>
                                ) : (
                                    <div key={idx} className="flex flex-col gap-0.5 items-start">
                                        <span className="text-[10px] font-bold text-primary ml-2">{msg.player}</span>
                                        <div className="bg-surface-container-lowest px-3 md:px-4 py-2 md:py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-xs md:text-sm font-medium text-on-surface break-words">
                                            {msg.text}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="p-3 md:p-4 bg-surface-container-high">
                            <div className="relative flex gap-2">
                                <input
                                    className="flex-grow bg-surface-container-lowest border-none rounded-full px-4 py-2 md:py-3 text-xs md:text-sm font-medium focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline-variant"
                                    placeholder="Type a message..."
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all flex-shrink-0">
                                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        send
                                    </span>
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Decorative Background */}
            <div className="fixed top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10"></div>
            <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
        </div>
    );
}

export default WaitingLobby;
