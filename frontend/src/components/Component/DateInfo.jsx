export const formatRelativeTime = (dateString) => {
  if (!dateString) return "Yeni gönderi";

  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInHours = Math.floor(diffInSeconds / 3600);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) return "Şimdi";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
  if (diffInHours < 24) return `${diffInHours} sa önce`;
  if (diffInDays < 7) return `${diffInDays} gün önce`;
  if (diffInDays === 7) return "1 hafta önce";

  return date.toLocaleDateString("tr-TR");
};
