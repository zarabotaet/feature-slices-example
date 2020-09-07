export function parseColor(hex) {
  const color = hex.substring(1);
  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;
  return r * 0.213 + g * 0.715 + b * 0.072 < 0.8 ? '#fff' : '#000';
}
