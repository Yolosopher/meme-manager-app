const AVATAR_URL = process.env.EXPO_PUBLIC_AVATAR_URL as string;

export const getAvatarUrl = (email: string) => {
  return `${AVATAR_URL}/avatars/${email}`;
};
