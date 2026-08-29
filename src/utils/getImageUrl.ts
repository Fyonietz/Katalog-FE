export function getImageUrl(imagePath?: string): string {
  if (!imagePath) return "";
  // Jika imagePath sudah mengandung http/https, langsung kembalikan
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  // Pastikan penggabungan slash '/' rapi
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  
  return `${cleanBase}${cleanPath}`;
}
