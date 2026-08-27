export function DiscoverBottle() {
  return (
    <svg
      className="discover-bottle"
      viewBox="0 0 420 960"
      role="img"
      aria-label="Temporary Terrova bottle study, Edition 01"
    >
      <defs>
        <linearGradient id="bottleGlass" x1="0" x2="1">
          <stop offset="0" stopColor="#090d0a" />
          <stop offset="0.28" stopColor="#26362a" />
          <stop offset="0.52" stopColor="#405143" />
          <stop offset="0.72" stopColor="#1d2a21" />
          <stop offset="1" stopColor="#070a08" />
        </linearGradient>
        <linearGradient id="glassLight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.46" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="0.68" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="labelPaper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf9f3" />
          <stop offset="1" stopColor="#ddd5c7" />
        </linearGradient>
      </defs>

      <path
        fill="url(#bottleGlass)"
        d="M157 26h106v190c0 35 7 56 34 80 36 33 56 77 56 126v434c0 45-36 81-81 81H148c-45 0-81-36-81-81V422c0-49 20-93 56-126 27-24 34-45 34-80V26Z"
      />
      <path
        fill="url(#glassLight)"
        d="M183 48h37v183c0 54-15 82-42 108-23 22-36 57-36 93v393c0 25-10 47-27 62-10-11-16-26-16-42V423c0-41 17-77 46-104 29-27 38-54 38-101V48Z"
      />
      <rect x="147" y="10" width="126" height="56" rx="8" fill="#121712" />
      <rect x="137" y="484" width="146" height="238" rx="2" fill="url(#labelPaper)" />
      <path d="M159 507h102" stroke="#171714" strokeOpacity="0.34" />
      <text x="210" y="563" textAnchor="middle" fill="#171714" fontSize="22" letterSpacing="8">
        TERROVA
      </text>
      <text x="210" y="613" textAnchor="middle" fill="#632f3d" fontSize="12" letterSpacing="4">
        EDITION 01
      </text>
      <circle cx="210" cy="662" r="18" fill="none" stroke="#b65f43" strokeWidth="1.5" />
      <path d="M210 645v34M193 662h34" stroke="#b65f43" strokeWidth="1" />
      <text x="210" y="700" textAnchor="middle" fill="#171714" fontSize="9" letterSpacing="3">
        ATLANTIC EDGE
      </text>
    </svg>
  )
}
