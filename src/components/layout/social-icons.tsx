import {
  IconBrandBluesky,
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
  IconBrandTelegram,
} from '@tabler/icons-react';
import type { SocialLinkItem } from '@/config/social-config';

const iconMap: Record<
  SocialLinkItem['key'],
  React.ComponentType<{ className?: string }>
> = {
  github: IconBrandGithub,
  twitter: IconBrandX,
  blueSky: IconBrandBluesky,
  mastodon: IconBrandMastodon,
  discord: IconBrandDiscord,
  youtube: IconBrandYoutube,
  linkedin: IconBrandLinkedin,
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  tiktok: IconBrandTiktok,
  telegram: IconBrandTelegram,
  email: IconMail,
};

export function SocialIcon({
  iconKey,
  className,
}: {
  iconKey: SocialLinkItem['key'];
  className?: string;
}) {
  const Icon = iconMap[iconKey];
  if (!Icon) return null;
  return <Icon className={className} />;
}
