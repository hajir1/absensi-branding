export const toMinutes = (time: any) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const canAbsen = (shift: any) => {
  const now = new Date();

  const today = now
    .toLocaleDateString("id-ID", { weekday: "long" })
    .toUpperCase();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const mulaiMin = toMinutes(shift.mulai);
  const akhirMin = toMinutes(shift.akhir);

  const isSameDay = today === shift.hariName?.toUpperCase();

  let isInShift = false;

  if (akhirMin >= mulaiMin) {
    // shift normal
    isInShift = currentMinutes >= mulaiMin && currentMinutes <= akhirMin;
  } else {
    // shift malam
    isInShift = currentMinutes >= mulaiMin || currentMinutes <= akhirMin;
  }

  return isSameDay && isInShift;
};
