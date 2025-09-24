import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const SocialIcons = () => {
  const iconClasses = "w-6 h-6 text-gray-400 hover:text-brand-accent transition-colors duration-300";

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex">
      <div className="flex flex-col space-y-6">
        <a href="#" aria-label="Instagram"><Instagram className={iconClasses} /></a>
        <a href="#" aria-label="Facebook"><Facebook className={iconClasses} /></a>
        <a href="#" aria-label="Twitter"><Twitter className={iconClasses} /></a>
        <a href="#" aria-label="Gmail"><Mail className={iconClasses} /></a>
      </div>
    </div>
  );
};

export default SocialIcons;