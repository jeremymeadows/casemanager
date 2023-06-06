export function random_string(length: number) {
  return Array(length)
    .fill(null)
    .map((_) =>
      ((Math.random() * 36) | 0)
        .toString(36)
        [Math.random() < 0.5 ? "toString" : "toUpperCase"]()
    )
    .join("");
}
