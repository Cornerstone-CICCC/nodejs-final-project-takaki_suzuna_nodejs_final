type Props = { owner?: string; colorClass?: string; label?: string };

function Box({ owner, colorClass, label }: Props) {
  const boxColor = owner ? colorClass || "bg-primary/80" : "";

  return (
    <div className="w-full h-full flex items-center justify-center">
      {owner && (
        <div
          className={`w-full h-full ${boxColor} flex items-center justify-center text-xs font-bold text-white`}
        >
          {label || owner}
        </div>
      )}
    </div>
  );
}

export default Box;
