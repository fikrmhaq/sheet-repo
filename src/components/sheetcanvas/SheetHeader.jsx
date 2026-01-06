function SheetInfoHeader({
  title,
  artist,
  transpose,
  difficulty,
  difficultyName,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">

      {/* Left: Title / Artist */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {artist}
        </span>
      </div>

      {/* Right: Meta info */}
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">

        {/* Transpose */}
        {
          transpose &&
          <div className="flex items-center gap-1">
            <span className="opacity-60">Transpose</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {transpose >= 0 ? `+${transpose}` : transpose}
            </span>
          </div>

        }
        {/* Divider */}
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

        {/* Difficulty */}
        <div className="flex items-center gap-1">
          <span className="opacity-60">Difficulty</span>
          <span className="font-medium text-violet-500">
            {difficultyName}
          </span>
          <span className="text-xs opacity-60">
            ({difficulty.toFixed(2)}★)
          </span>
        </div>

      </div>
    </div>
  );
}

export default SheetInfoHeader