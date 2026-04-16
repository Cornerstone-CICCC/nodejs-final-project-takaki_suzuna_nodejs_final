type Props = {
    type: "h" | "v"; // Horizontal or vertical line
    active: string | null; // Owner name (player) if the line has been drawn, null if not
    onClick: () => void; // Handler when line is clicked
    zoom?: number; // Zoom level for scaling
};

// Map player names to their colors
const playerColors: Record<string, string> = {
    "P1": "bg-blue-500",  // P1 is blue
    "P2": "bg-red-500",   // P2 is red
};

// Line component - represents a drawable line between two dots
function Line({ type, active, onClick, zoom = 1 }: Props) {
    const base = "cursor-pointer transition"; // Always applied styles

    // Get the color based on who drew the line, or use gray if not drawn
    const lineColor = active ? playerColors[active] || "bg-white" : "bg-gray-400 hover:bg-gray-500 hover:scale-x-110";

    // Calculate dimensions based on zoom level
    const baseSize = 40; // Base size in pixels
    const scaledSize = baseSize * zoom;

    const style = type === "h"
        ? {
            height: '8px',
            width: `${scaledSize - 5}px`
        }
        : {
            width: '8px',
            height: `${scaledSize - 5}px`
        };

    // Line color changes based on owner
    return <div onClick={onClick} className={`${base} rounded ${lineColor}`} style={style} />;
}

export default Line;