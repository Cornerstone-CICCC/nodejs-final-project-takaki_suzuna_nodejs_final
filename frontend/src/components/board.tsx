type Point = {
    row: number;
    col: number;
};

function Board() {
    const size = 5;

    const points: Point[] = [];

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            points.push({ row, col });
        }
    }

    return (
        <div className="flex justify-center items-center mt-10">
            <div
                className="grid gap-20"
                style={{
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                }}
            >
                {points.map((p, i) => (
                    <div
                        key={i}
                        className="w-5 h-5 bg-white rounded-full"
                        style={{
                            gridRow: p.row + 1,
                            gridColumn: p.col + 1,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Board;