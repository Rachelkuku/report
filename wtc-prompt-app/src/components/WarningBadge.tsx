interface WarningBadgeProps {
  type: 'error' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
}

export default function WarningBadge({ type, children }: WarningBadgeProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  const icons = {
    error: '●',
    warning: '▲',
    info: '●',
    success: '✓',
  };

  return (
    <div className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${styles[type]}`}>
      <span className="mt-0.5 text-xs">{icons[type]}</span>
      <span>{children}</span>
    </div>
  );
}
