import { Icon } from '@iconify/react';

interface InstagramIconProps {
  size?: number;
  className?: string;
}

export default function InstagramIcon({ size = 24, className = "" }: InstagramIconProps) {
  return <Icon icon="mdi:instagram" width={size} height={size} className={className} />;
}