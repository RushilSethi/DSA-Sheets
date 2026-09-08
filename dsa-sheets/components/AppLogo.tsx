import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export function AppLogo({ size = 40, className, priority = false }: AppLogoProps) {
  return (
    <Image
      src="/logo_small.png"
      alt="DSA Sheets"
      width={size}
      height={size}
      className={cn('shrink-0', className)}
      priority={priority}
    />
  );
}
