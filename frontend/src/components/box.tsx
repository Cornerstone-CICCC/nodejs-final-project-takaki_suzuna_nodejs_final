type Props = {
    owner?: string; // Player name/identifier who completed this box (e.g., "P1", "P2")
};

// Map player names to their colors
const playerColors: Record<string, string> = {
    "P1": "bg-blue-500",  // P1 is blue
    "P2": "bg-red-500",   // P2 is red
};

// Box component - represents a cell that can be claimed when all 4 sides are drawn
function Box({ owner }: Props) {
    // Get the color based on the owner, or use empty if not owned
    const boxColor = owner ? playerColors[owner] || "bg-gray-500" : "";

    return (
        <div className="w-full h-full flex items-center justify-center">
            {/* Only show content if the box has been completed (owner exists) */}
            {owner && (
                <div className={`w-full h-full ${boxColor} flex items-center justify-center text-xs text-white`}>
                    {/* Display the owner's name/identifier */}
                    {owner}
                </div>
            )}
        </div>
    );
}

export default Box;