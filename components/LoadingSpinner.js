export default function LoadingSpinner({ size = 36 }) {
  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
