/**
 * CRASHDOWN ARCADE - CATALOG & REWARD SORT UTILITIES
 * Egységes katalógus- és jutalomrendező segédfüggvények
 */

export function sortCatalogItems(
  items,
  sortMode,
  unlockedCheck,
  nameKey = "name",
  specialKey = "isSpecial",
) {
  const arr = [...items];
  if (!sortMode || sortMode === "default") return arr;

  if (sortMode === "mythic_first") {
    arr.sort((a, b) => {
      const mA = a.isMythic ? 1 : 0;
      const mB = b.isMythic ? 1 : 0;
      if (mA !== mB) return mB - mA;
      const sA = a[specialKey] ? 1 : 0;
      const sB = b[specialKey] ? 1 : 0;
      if (sA !== sB) return sB - sA;
      return String(a[nameKey] || "").localeCompare(
        String(b[nameKey] || ""),
        "hu",
      );
    });
  } else if (sortMode === "special_first") {
    arr.sort((a, b) => {
      const sA = a[specialKey] ? 1 : 0;
      const sB = b[specialKey] ? 1 : 0;
      if (sA !== sB) return sB - sA;
      return String(a[nameKey] || "").localeCompare(
        String(b[nameKey] || ""),
        "hu",
      );
    });
  } else if (sortMode === "unlocked_first") {
    arr.sort((a, b) => {
      const uA = unlockedCheck(a) ? 1 : 0;
      const uB = unlockedCheck(b) ? 1 : 0;
      if (uA !== uB) return uB - uA;
      return String(a[nameKey] || "").localeCompare(
        String(b[nameKey] || ""),
        "hu",
      );
    });
  } else if (sortMode === "locked_first") {
    arr.sort((a, b) => {
      const uA = unlockedCheck(a) ? 1 : 0;
      const uB = unlockedCheck(b) ? 1 : 0;
      if (uA !== uB) return uA - uB;
      return String(a[nameKey] || "").localeCompare(
        String(b[nameKey] || ""),
        "hu",
      );
    });
  } else if (sortMode === "alpha_asc") {
    arr.sort((a, b) =>
      String(a[nameKey] || "").localeCompare(String(b[nameKey] || ""), "hu"),
    );
  } else if (sortMode === "alpha_desc") {
    arr.sort((a, b) =>
      String(b[nameKey] || "").localeCompare(String(a[nameKey] || ""), "hu"),
    );
  } else if (sortMode === "reward_first") {
    arr.sort((a, b) => {
      const rA =
        typeof a.hasReward === "boolean"
          ? a.hasReward
            ? 1
            : 0
          : a.reward
            ? 1
            : 0;
      const rB =
        typeof b.hasReward === "boolean"
          ? b.hasReward
            ? 1
            : 0
          : b.reward
            ? 1
            : 0;
      if (rA !== rB) return rB - rA;
      return String(a[nameKey] || "").localeCompare(
        String(b[nameKey] || ""),
        "hu",
      );
    });
  }

  return arr;
}
