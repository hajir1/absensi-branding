export const generatePagination = (current: number, total: number) => {
  const pages = [];

  if (total <= 10) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  if (current > 4) pages.push("...");

  let start = Math.max(2, current - 2);
  let end = Math.min(total - 1, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) pages.push("...");

  pages.push(total);

  return pages;
};
