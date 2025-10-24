// src/components/Spinner.jsx
const Spinner = ({ size = 10, color = "red-600", thickness = 20 }) => {
  return (
    <svg
      className={`animate-spin h-${size} w-${size}`}
      viewBox="0 0 50 50"
    >
      <circle
        className={`opacity-25`}
        cx="25"
        cy="25"
        r="20"
        stroke={`currentColor`}
        strokeWidth={thickness}
      />
      <path
        className={`opacity-75`}
        fill="currentColor"
        d="M25 5
           a 20 20 0 0 1 0 40
           a 20 20 0 0 1 0 -40"
        stroke={`url(#gradient)`}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`var(--tw-color-${color})`} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Spinner;
