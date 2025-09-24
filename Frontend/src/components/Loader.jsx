const Loader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-t-2 border-brand-accent ${sizeClasses[size]}`}></div>
  );
};

export default Loader;