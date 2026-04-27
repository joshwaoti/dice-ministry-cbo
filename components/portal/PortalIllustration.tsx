type Variant = 'students' | 'documents' | 'users' | 'learning' | 'messages';

const variantLabel: Record<Variant, string> = {
  students: 'Students overview illustration',
  documents: 'Documents illustration',
  users: 'Admin users illustration',
  learning: 'Learning content illustration',
  messages: 'Messages illustration',
};

export function PortalIllustration({
  variant,
  className = '',
}: {
  variant: Variant;
  className?: string;
}) {
  const accent = variant === 'documents' ? '#F4A623' : '#E8621A';
  const secondary = variant === 'messages' ? '#0D7377' : '#0A1931';

  return (
    <svg viewBox="0 0 320 220" role="img" aria-label={variantLabel[variant]} className={className}>
      <defs>
        <linearGradient id={`panel-${variant}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="220" rx="28" fill="#F5F7FA" />
      <rect x="28" y="30" width="264" height="160" rx="22" fill={`url(#panel-${variant})`} />
      <rect x="48" y="52" width="224" height="18" rx="9" fill="#E5E7EB" />
      <rect x="48" y="84" width="82" height="84" rx="16" fill={secondary} opacity="0.92" />
      <rect x="144" y="84" width="56" height="84" rx="16" fill={accent} opacity="0.16" />
      <rect x="212" y="84" width="40" height="84" rx="16" fill="#0D7377" opacity="0.16" />
      <circle cx="89" cy="106" r="15" fill="#FFFFFF" opacity="0.9" />
      <rect x="66" y="126" width="46" height="18" rx="9" fill="#FFFFFF" opacity="0.9" />
      {variant === 'students' ? (
        <>
          <circle cx="172" cy="104" r="10" fill={accent} opacity="0.8" />
          <circle cx="226" cy="104" r="10" fill="#0D7377" opacity="0.8" />
          <rect x="156" y="124" width="32" height="12" rx="6" fill="#94A3B8" />
          <rect x="210" y="124" width="32" height="12" rx="6" fill="#94A3B8" />
        </>
      ) : null}
      {variant === 'documents' ? (
        <>
          <rect x="156" y="100" width="32" height="44" rx="8" fill="#FFFFFF" />
          <path d="M180 100V112H192" fill="none" stroke="#CBD5E1" strokeWidth="4" />
          <rect x="212" y="96" width="28" height="50" rx="8" fill="#FFFFFF" opacity="0.8" />
        </>
      ) : null}
      {variant === 'users' ? (
        <>
          <circle cx="173" cy="108" r="12" fill="#FFFFFF" />
          <path d="M160 136c3-9 10-13 13-13s10 4 13 13" fill="#FFFFFF" />
          <rect x="212" y="96" width="26" height="12" rx="6" fill={accent} />
          <rect x="212" y="116" width="18" height="10" rx="5" fill="#0D7377" />
        </>
      ) : null}
      {variant === 'learning' ? (
        <>
          <polygon points="167,100 190,114 167,128" fill="#FFFFFF" />
          <rect x="210" y="96" width="28" height="46" rx="10" fill="#FFFFFF" opacity="0.85" />
        </>
      ) : null}
      {variant === 'messages' ? (
        <>
          <rect x="154" y="96" width="46" height="26" rx="13" fill="#FFFFFF" />
          <rect x="180" y="126" width="46" height="26" rx="13" fill="#FFFFFF" opacity="0.85" />
          <circle cx="236" cy="99" r="7" fill={accent} />
        </>
      ) : null}
    </svg>
  );
}
