export function LogoAgroMarket({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="AgroMarket Logo"
    >
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" className="text-primary/80" fill="currentColor" fillOpacity="0.08" />
      <circle cx="50" cy="50" r="41" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-primary/40" />
      {/* Hojas verdes envolventes */}
      <path
        d="M 22 50 C 22 28, 40 16, 50 16 C 42 26, 32 40, 32 54 C 32 68, 42 78, 50 82 C 34 80, 22 68, 22 50 Z"
        className="fill-success"
      />
      <path
        d="M 78 50 C 78 28, 60 16, 50 16 C 58 26, 68 40, 68 54 C 68 68, 58 78, 50 82 C 66 80, 78 68, 78 50 Z"
        className="fill-primary"
      />
      {/* Tallo central */}
      <path d="M 50 80 L 50 26" stroke="#C97C2C" strokeWidth="2.5" strokeLinecap="round" />
      {/* Granos de trigo */}
      <path d="M 50 24 C 47 21, 53 21, 50 24 Z" fill="#E0A253" />
      <path d="M 50 30 C 44 26, 45 22, 49 26 Z" fill="#C97C2C" />
      <path d="M 50 30 C 56 26, 55 22, 51 26 Z" fill="#E0A253" />
      <path d="M 50 38 C 43 34, 44 29, 49 33 Z" fill="#C97C2C" />
      <path d="M 50 38 C 57 34, 56 29, 51 33 Z" fill="#E0A253" />
      <path d="M 50 46 C 43 42, 44 37, 49 41 Z" fill="#C97C2C" />
      <path d="M 50 46 C 57 42, 56 37, 51 41 Z" fill="#E0A253" />
      <path d="M 50 54 C 44 50, 45 45, 49 49 Z" fill="#C97C2C" />
      <path d="M 50 54 C 56 50, 55 45, 51 49 Z" fill="#E0A253" />
      <path d="M 50 62 C 45 59, 46 54, 49 57 Z" fill="#C97C2C" />
      <path d="M 50 62 C 55 59, 54 54, 51 57 Z" fill="#E0A253" />
    </svg>
  );
}
