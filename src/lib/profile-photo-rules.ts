export function profilePhotoCount(album: string[], portrait: string, ownPrefix: string, pendingPortrait = false) {
  const photos = new Set(album);
  if (pendingPortrait) return photos.size + 1;
  if (portrait.startsWith(ownPrefix)) photos.add(portrait);
  return photos.size;
}
