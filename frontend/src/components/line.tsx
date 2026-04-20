type Props = {
    type: "h" | "v";
    active: boolean;
    colorClass?: string;
    onClick: () => void;
    zoom?: number;
    disabled?: boolean;
};

function Line({ type, active, colorClass, onClick, zoom = 1, disabled = false }: Props) {
    const baseSize = 40;
    const lineColor = active
        ? colorClass || "bg-primary"
        : disabled
            ? "bg-slate-300/70"
            : "bg-slate-400 hover:bg-slate-500";
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

    return (
        <button
            type="button"
            aria-label={type === "h" ? "Claim horizontal edge" : "Claim vertical edge"}
            className={`rounded transition ${disabled || active ? "cursor-default" : "cursor-pointer"} ${lineColor}`}
            disabled={disabled || active}
            onClick={onClick}
            style={style}
        />
    );
}

export default Line;
