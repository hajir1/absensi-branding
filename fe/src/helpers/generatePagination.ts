export const generatePagination = (
  current: number,
  total: number
) => {
  const pages: (number | string)[] = [];

  // kalau total sedikit
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i);
  }

  pages.push(0);

  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);

  // titik kiri
  if (start > 1) {
    pages.push("...");
  }

  // halaman tengah
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // titik kanan
  if (end < total - 2) {
    pages.push("...");
  }

  pages.push(total - 1);

  return pages;
};