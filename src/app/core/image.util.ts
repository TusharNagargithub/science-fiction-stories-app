export const IMAGEKIT_BASE = 'https://ik.imagekit.io/dev24/';

export function imageUrl(path: string | undefined | null): string {
  if (!path) {
    return '';
  }
  const trimmed = path.trim().split(/\s+/)[0];
  return `${IMAGEKIT_BASE}${trimmed}`;
}
