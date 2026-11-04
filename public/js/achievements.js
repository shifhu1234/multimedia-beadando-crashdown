/* ================================================================
   CRASHDOWN ARCADE - ACHIEVEMENTS, TITLES, AVATARS & USER STATS
   ================================================================ */

// ==================== MÉRFÖLDKÖVEK & JELVÉNYEK (36 DB) ====================
const ACHIEVEMENTS = [
  // 1. Kezdő & Pontszám mérföldkövek
  {
    id: "first_match",
    icon: "🎯",
    title: "Első Lépés",
    desc: "Törölj ki egy legalább 3 blokkból álló csoportot!",
  },
  {
    id: "first_500",
    icon: "⭐",
    title: "Kezdő Pontgyűjtő",
    desc: "Érj el legalább 500 pontot egy menetben!",
  },
  {
    id: "score_1500",
    icon: "🏅",
    title: "Haladó Törő",
    desc: "Érj el legalább 1 500 pontot egy meccsben!",
  },
  {
    id: "score_5000",
    icon: "🏆",
    title: "Pontvadász",
    desc: "Érj el legalább 5 000 pontot egyetlen játékban!",
  },
  {
    id: "score_10k",
    icon: "👑",
    title: "Crashdown Mester",
    desc: "Lépd át a 10 000 pontos álomhatárt!",
  },
  {
    id: "score_25k",
    icon: "🌌",
    title: "Galaktikus Bajnok",
    desc: "Érj el szédítő 25 000 pontot egy menetben!",
  },
  {
    id: "score_50k",
    icon: "💎",
    title: "Kozmikus Rekorder",
    desc: "Lépd át a felfoghatatlan 50 000 pontos rekordot!",
  },
  {
    id: "score_75k",
    icon: "🌌",
    title: "Kozmikus Legenda",
    desc: "Érj el szédítő 75 000 pontot egy menetben!",
  },
  {
    id: "score_100k",
    icon: "👑",
    title: "Halhatatlan Rekorder",
    desc: "Lépd át a mitikus 100 000 pontos álomhatárt egy menetben!",
  },

  // 1.2 Összesített pontszám mérföldkövek
  {
    id: "total_score_100k",
    icon: "💎",
    title: "Pontgyűjtő Titán",
    desc: "Gyűjts össze összesen legalább 100 000 összpontszámot a profilodon!",
  },
  {
    id: "total_score_500k",
    icon: "✨",
    title: "Félmilliós Legenda",
    desc: "Érj el összesen 500 000 pontot a játékaid során!",
  },
  {
    id: "total_score_1m",
    icon: "👑",
    title: "Pontmilliomos",
    desc: "Lépd át az 1 000 000 összesített rekord pontszámot!",
  },

  // 2. Kombók & Láncreakciók
  {
    id: "combo_x2",
    icon: "⚡",
    title: "Kombó Kezdő",
    desc: "Érj el 2×-es kombó szorzót gyors egymásutánban!",
  },
  {
    id: "combo_x3",
    icon: "⚡",
    title: "Kombó Guru",
    desc: "Pörgesd fel a szorzót legalább 3×-os értékre!",
  },
  {
    id: "combo_x4",
    icon: "🔥",
    title: "Lángoló Kezek",
    desc: "Érj el legalább 4×-es kombó szorzót játék közben!",
  },
  {
    id: "combo_x5",
    icon: "🔥",
    title: "Kombó Isten",
    desc: "Érd el a maximális 5×-ös kombó csúcsot!",
  },
  {
    id: "mega_clear",
    icon: "💥",
    title: "Mega Törlés",
    desc: "Takaríts el egyetlen kattintással legalább 8 blokkot!",
  },
  {
    id: "hyper_clear",
    icon: "⚡",
    title: "Kolosszus Törlés",
    desc: "Takaríts el legalább 12 blokkot egyetlen kattintással!",
  },

  // 3. Power-Up Mester
  {
    id: "tnt_boom",
    icon: "💣",
    title: "TNT Szakértő",
    desc: "Robbants fel egy 3×3-as TNT power-up blokkot!",
  },
  {
    id: "freeze_time",
    icon: "❄️",
    title: "Jégvarázs",
    desc: "Fagyaszd be az időt az Időfagyasztó Jégkockával!",
  },
  {
    id: "magnet_pull",
    icon: "🧲",
    title: "Szuper Mágnes",
    desc: "Ránts össze egy egész színt egy blokkba a Mágnessel!",
  },
  {
    id: "color_bomb",
    icon: "✦",
    title: "Szín-kataklizma",
    desc: "Tisztíts let egy teljes színt a Szín-bomba használatával!",
  },
  {
    id: "frenzy_master",
    icon: "⚡",
    title: "Dupla vagy Semmi",
    desc: "Aktiválj egy 2× Pontduplázó Frenzy időszakot!",
  },
  {
    id: "time_bonus",
    icon: "⌛",
    title: "Időutazó",
    desc: "Gyűjts be egy +5 másodperces extra idő blokkot!",
  },

  // 4. Power-up Gyűjtő mérföldkövek
  {
    id: "powerup_5",
    icon: "⚡",
    title: "Power-up Kezdő",
    desc: "Aktiválj összesen legalább 5 db power-upot!",
  },
  {
    id: "powerup_10",
    icon: "✨",
    title: "Power-up Gyűjtő",
    desc: "Aktiválj összesen legalább 10 db power-upot!",
  },
  {
    id: "powerup_25",
    icon: "💥",
    title: "Power-up Mester",
    desc: "Aktiválj összesen legalább 25 db power-upot!",
  },
  {
    id: "powerup_50",
    icon: "👑",
    title: "Power-up Titán",
    desc: "Aktiválj összesen legalább 50 db power-upot!",
  },
  {
    id: "powerup_100",
    icon: "⚡",
    title: "Power-up Fanatikus",
    desc: "Aktiválj összesen legalább 100 db power-upot a meccseid alatt!",
  },
  {
    id: "powerup_250",
    icon: "💥",
    title: "Power-up Vihar",
    desc: "Aktiválj összesen legalább 250 db power-upot!",
  },
  {
    id: "powerup_500",
    icon: "🌟",
    title: "Power-up Istenség",
    desc: "Aktiválj félelmetes 500 db power-upot!",
  },

  // 5. Stratégia & Játékmenet
  {
    id: "perfect_clear",
    icon: "✨",
    title: "Tiszta Pálya",
    desc: "Pucold le az utolsó szálig az egész táblát (0 blokk)!",
  },
  {
    id: "shuffle_master",
    icon: "⟳",
    title: "Új Esély",
    desc: "Használd a Pálya keverése funkciót szorult helyzetben!",
  },
  {
    id: "speed_demon",
    icon: "🐆",
    title: "Villám Kéz",
    desc: "Kattints legalább 8 sikeres csoportra 10 másodpercen belül!",
  },
  {
    id: "master_5_color",
    icon: "🌈",
    title: "Színkavalkád",
    desc: "Érj el legalább 2 000 pontot az 5 színű mester módban!",
  },

  // 6. Közösség, Mérkőzések & Játékidő
  {
    id: "inspect_profile",
    icon: "🔍",
    title: "Kíváncsi Szemek",
    desc: "Nézd meg egy másik játékos profilját a ranglistán!",
  },
  {
    id: "play_5_matches",
    icon: "🎮",
    title: "Gyakori Vendég",
    desc: "Játssz le legalább 5 teljes mérkőzést!",
  },
  {
    id: "matches_10",
    icon: "⚔️",
    title: "Harcedzett Zúzó",
    desc: "Játssz le legalább 10 teljes mérkőzést!",
  },
  {
    id: "play_20_matches",
    icon: "🔥",
    title: "Elhivatott Zúzó",
    desc: "Játssz le legalább 20 teljes mérkőzést!",
  },
  {
    id: "matches_50",
    icon: "🎖️",
    title: "Crashdown Veterán",
    desc: "Játssz le legalább 50 teljes mérkőzést!",
  },
  {
    id: "matches_100",
    icon: "🎖️",
    title: "Százados Veterán",
    desc: "Játssz le legalább 100 teljes mérkőzést!",
  },
  {
    id: "matches_250",
    icon: "⚔️",
    title: "Crashdown Örökös",
    desc: "Játssz le legalább 250 mérkőzést az arénában!",
  },
  {
    id: "play_time_1m",
    icon: "⏱️",
    title: "Bemelegítés",
    desc: "Játssz összesen legalább 1 percet a játékban!",
  },
  {
    id: "play_time_5m",
    icon: "⏳",
    title: "Kitartó Blokkozó",
    desc: "Játssz összesen legalább 5 percet!",
  },
  {
    id: "play_time_15m",
    icon: "⌛",
    title: "Időmester",
    desc: "Érj el legalább 15 perc összesített játékidőt!",
  },
  {
    id: "play_time_30m",
    icon: "🌌",
    title: "Crashdown Fanatikus",
    desc: "Tölts el legalább 30 percet a játékban!",
  },
  {
    id: "play_time_1h",
    icon: "⌛",
    title: "Időutazó Mester",
    desc: "Érj el legalább 1 óra (60 perc) összesített játékidőt!",
  },
  {
    id: "play_time_2h",
    icon: "🪐",
    title: "Megállíthatatlan",
    desc: "Tölts el legalább 2 órát (120 perc) az arénában!",
  },

  // 7. Játékmód Mesterek
  {
    id: "mode_chaos_win",
    icon: "🌀",
    title: "Káosz Túlélő",
    desc: "Érj el legalább 5 000 pontot a Káosz módban!",
  },
  {
    id: "mode_bomb_win",
    icon: "💣",
    title: "Bombaszakértő",
    desc: "Érj el legalább 5 000 pontot a Robbanás Mániában!",
  },
  {
    id: "mode_time_win",
    icon: "⏳",
    title: "Időfutam Bajnok",
    desc: "Érj el legalább 5 000 pontot az Időhajsza módban!",
  },
  {
    id: "mode_raw_win",
    icon: "🧱",
    title: "Tisztakezű Zseni",
    desc: "Érj el legalább 3 000 pontot a Nyers (power-up mentes) módban!",
  },

  // 8. Új Különleges Kihívások & Felfedezések
  {
    id: "all_modes_played",
    icon: "🎯",
    title: "Minden Mód Vándora",
    desc: "Játssz legalább egy meccset mind az 5 játékmódban!",
  },
  {
    id: "all_durations_played",
    icon: "⏱️",
    title: "Időfutár Mester",
    desc: "Játssz legalább egy meccset mind a 4 időkeretben!",
  },
  {
    id: "all_colors_played",
    icon: "🌈",
    title: "Színkavalkád Felfedező",
    desc: "Játssz meccset a 2, 3, 4 és 5 színű beállításban is!",
  },
  {
    id: "tnt_collector_25",
    icon: "💣",
    title: "TNT Szakértő Mester",
    desc: "Robbants fel legalább 25 db TNT blokkot a meccseid során!",
  },
  {
    id: "magnet_collector_25",
    icon: "🧲",
    title: "Mágnes Bűvész",
    desc: "Használj fel legalább 25 db mágnes power-upot!",
  },
  {
    id: "freeze_collector_25",
    icon: "❄️",
    title: "Jégvarázs Mester",
    desc: "Fagyaszd be az időt legalább 25 alkalommal!",
  },
  {
    id: "doubler_collector_25",
    icon: "⚡",
    title: "Duplázó Szenzáció",
    desc: "Aktiválj legalább 25 db 2× pontduplázó Frenzy-t!",
  },
  {
    id: "colorbomb_collector_25",
    icon: "✦",
    title: "Szín-Kataklizma Bajnok",
    desc: "Tisztíts le pályát 25 db szín-bomba segítségével!",
  },
  {
    id: "score_150k",
    icon: "🌠",
    title: "Abszolút Csúcsdöntő",
    desc: "Érj el 150 000 pontot egyetlen menetben!",
  },
  {
    id: "score_250k",
    icon: "🌌",
    title: "Kozmikus Fenség",
    desc: "Érj el szédítő 250 000 pontot egy menetben!",
  },
  {
    id: "matches_500",
    icon: "👑",
    title: "Crashdown Legenda",
    desc: "Játssz le félelmetes 500 teljes mérkőzést!",
  },
  {
    id: "total_score_5m",
    icon: "💎",
    title: "Multimilliomos Rekorder",
    desc: "Gyűjts össze összesen legalább 5 000 000 pontot a profilodon!",
  },
  {
    id: "massive_clear_16",
    icon: "💥",
    title: "Kolosszális Pusztítás",
    desc: "Törölj el legalább 16 blokkot egyetlen kattintással!",
  },
  {
    id: "lightning_combo_6",
    icon: "⚡",
    title: "Kombó Szuperszonikus",
    desc: "Pörgesd fel a szorzót 6×-os kombóig!",
  },
  {
    id: "marathon_15k",
    icon: "🏃",
    title: "Maratonista Zseni",
    desc: "Érj el legalább 15 000 pontot a 3 perces maratoni módban!",
  },
  {
    id: "sprint_5k",
    icon: "🐆",
    title: "Villámfutó Titán",
    desc: "Érj el legalább 5 000 pontot a 30 másodperces villámmódban!",
  },
];

// ==================== PROFILKÉPEK (AVATARS) RENDSZER ====================
const PROFILE_AVATARS = [
  { id: "avatar_default", symbol: "👤", name: "Alapértelmezett", achId: null },
  { id: "avatar_ice", symbol: "🧊", name: "Jégkristály", achId: "freeze_time" },
  {
    id: "avatar_fire",
    symbol: "🔥",
    name: "Főnix Láng",
    achId: "play_20_matches",
  },
  { id: "avatar_bomb", symbol: "💣", name: "Robbanófej", achId: "tnt_boom" },
  {
    id: "avatar_lightning",
    symbol: "⚡",
    name: "Neon Villám",
    achId: "hyper_clear",
  },
  { id: "avatar_magnet", symbol: "🧲", name: "Mágnes", achId: "magnet_pull" },
  {
    id: "avatar_crown",
    symbol: "👑",
    name: "Arany Korona",
    achId: "score_10k",
  },
  {
    id: "avatar_diamond",
    symbol: "💎",
    name: "Kozmikus Gyémánt",
    achId: "score_50k",
  },
  {
    id: "avatar_star",
    symbol: "✨",
    name: "Szupernóva",
    achId: "perfect_clear",
  },
  {
    id: "avatar_rainbow",
    symbol: "🌈",
    name: "Szivárvány Prizma",
    achId: "master_5_color",
  },
  {
    id: "avatar_speed",
    symbol: "🐆",
    name: "Villám Párduc",
    achId: "speed_demon",
  },
  { id: "avatar_galaxy", symbol: "🌌", name: "Kozmosz", achId: "score_25k" },
  {
    id: "avatar_sunset",
    symbol: "🌅",
    name: "Naplemente",
    achId: "powerup_10",
  },
  {
    id: "avatar_detective",
    symbol: "🕵️",
    name: "Detektív",
    achId: "inspect_profile",
  },
  {
    id: "avatar_hourglass",
    symbol: "⏳",
    name: "Homokóra",
    achId: "play_time_15m",
  },
  { id: "avatar_sword", symbol: "⚔️", name: "Lovagkard", achId: "matches_10" },
  {
    id: "avatar_flame_hand",
    symbol: "💥",
    name: "Plazmagömb",
    achId: "powerup_50",
  },
  {
    id: "avatar_aurora",
    symbol: "🌌",
    name: "Sarki Fény",
    achId: "powerup_100",
  },
  {
    id: "avatar_void",
    symbol: "🔮",
    name: "Misztikus Void",
    achId: "score_75k",
  },
  {
    id: "avatar_gold_emperor",
    symbol: "👑",
    name: "Császári Arany",
    achId: "score_100k",
  },
  {
    id: "avatar_clock",
    symbol: "⌛",
    name: "Örökkévalóság",
    achId: "play_time_1h",
  },
  {
    id: "avatar_century",
    symbol: "🎖️",
    name: "Százados",
    achId: "matches_100",
  },
  {
    id: "avatar_meteor",
    symbol: "🌠",
    name: "Hullócsillag",
    achId: "score_150k",
  },
  {
    id: "avatar_galaxy_core",
    symbol: "🪐",
    name: "Galaxis Mag",
    achId: "score_250k",
  },
  {
    id: "avatar_flame_phoenix",
    symbol: "🔥",
    name: "Főnix",
    achId: "lightning_combo_6",
  },
  {
    id: "avatar_legend_crown",
    symbol: "👑",
    name: "Örök Korona",
    achId: "matches_500",
  },
  {
    id: "avatar_speed_lightning",
    symbol: "⚡",
    name: "Villámfutó",
    achId: "sprint_5k",
  },
];

// Segédfüggvény tiszta szövegekhez (szimbólumok és emojik eltávolítása a jutalom leírásokhoz)
function cleanSymbolText(str) {
  if (!str) return "";
  return str
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/\[speciális\]/gi, "")
    .replace(/\(speciális\)/gi, "")
    .replace(/✨|🌟|👑|⚡|🔥|💥|🌌|🌈|💎|🔰|⭐|🏆|🌋|🐆|❄️|🧲|✦|⏱️|⏳|⌛|🎖️|⚔️|🛡️|🔍|🎮|📈|🎯|💣|🌀|🧱|🏃|🪐|🌠/g, "")
    .trim();
}

// Egységes jutalmak lekérése tiszta sémával:
// Profilkép: <szimbolum>
// Rangcím: <rangcim> (ha speciális: (speciális))
// Téma: <témanév> (ha speciális: (speciális))
// Név szín: <színnév> (ha speciális: (speciális))
function getAchievementRewards(achId) {
  const rewList = [];
  const linkedAv =
    typeof PROFILE_AVATARS !== "undefined"
      ? PROFILE_AVATARS.find((av) => av.achId === achId)
      : null;
  const linkedTitle =
    typeof PROFILE_TITLES !== "undefined"
      ? PROFILE_TITLES.find((t) => t.achId === achId)
      : null;
  const linkedTheme =
    typeof THEMES_CATALOG !== "undefined"
      ? THEMES_CATALOG.find((th) => th.achId === achId)
      : null;
  const linkedColor =
    typeof NAME_COLORS_CATALOG !== "undefined"
      ? NAME_COLORS_CATALOG.find((c) => c.achId === achId)
      : null;

  if (linkedAv) {
    rewList.push({
      type: "avatar",
      text: `Profilkép: ${linkedAv.symbol}`,
    });
  }
  if (linkedTitle) {
    const cleanTitle = cleanSymbolText(linkedTitle.name);
    const spec = linkedTitle.isSpecial ? " (speciális)" : "";
    rewList.push({
      type: "title",
      text: `Rangcím: ${cleanTitle}${spec}`,
    });
  }
  if (linkedTheme) {
    const cleanTheme = cleanSymbolText(linkedTheme.name);
    const spec = linkedTheme.isSpecial ? " (speciális)" : "";
    rewList.push({
      type: "theme",
      text: `Téma: ${cleanTheme}${spec}`,
    });
  }
  if (linkedColor) {
    const cleanColor = cleanSymbolText(linkedColor.name);
    const spec = linkedColor.isSpecial ? " (speciális)" : "";
    rewList.push({
      type: "color",
      text: `Név szín: ${cleanColor}${spec}`,
    });
  }

  return rewList;
}

// ==================== RANGCÍMEK (PROFILE TITLES) RENDSZER ====================
// A rangcímek nevei tiszták, szimbólumok nélkül, egységes felépítéssel
const PROFILE_TITLES = [
  {
    id: "title_beginner",
    name: "Kezdő Blokktörő",
    desc: "Alapértelmezett kezdő rangcím minden játékosnak",
    achId: null,
    isSpecial: false,
    isUnlocked: (stats, achSet) => true,
  },
  {
    id: "title_advanced",
    name: "Haladó Játékos",
    desc: "Érj el legalább 1 500 pontot vagy játssz 3 meccset",
    achId: null,
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 1500 || stats.totalMatches >= 3,
  },
  {
    id: "title_champion",
    name: "Crashdown Bajnok",
    desc: "Érj el legalább 5 000 pontot egy meccsben",
    achId: "score_5000",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 5000 || achSet.has("score_5000"),
  },
  {
    id: "title_grandmaster",
    name: "Crashdown Nagymester",
    desc: "Lépd át a 10 000 pontos álomhatárt",
    achId: "score_10k",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 10000 || achSet.has("score_10k"),
  },
  {
    id: "title_legend",
    name: "Galaktikus Legenda",
    desc: "Érj el szédítő 25 000 pontot",
    achId: "score_25k",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 25000 || achSet.has("score_25k"),
  },
  {
    id: "title_cosmic",
    name: "Kozmikus Rekorder",
    desc: "Lépd át az 50 000 pontos csúcsot",
    achId: "score_50k",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 50000 || achSet.has("score_50k"),
  },
  {
    id: "title_combo_mage",
    name: "Kombó Mágus",
    desc: "Érd el a maximális 5×-ös kombó szorzót",
    achId: "combo_x5",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("combo_x5"),
  },
  {
    id: "title_titan",
    name: "Titán Zúzó",
    desc: "Takaríts el legalább 12 blokkot egyetlen kattintással",
    achId: "hyper_clear",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("hyper_clear"),
  },
  {
    id: "title_speed",
    name: "Villámkezű",
    desc: "Kattints legalább 8 sikeres csoportra 10 másodpercen belül",
    achId: "speed_demon",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("speed_demon"),
  },
  {
    id: "title_color_master",
    name: "Színmester",
    desc: "Érj el legalább 2 000 pontot az 5 színű mester módban",
    achId: "master_5_color",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("master_5_color"),
  },
  {
    id: "title_demolition",
    name: "Robbantómester",
    desc: "Használj TNT robbantást vagy Szín-bombát",
    achId: "tnt_boom",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("tnt_boom") || achSet.has("color_bomb"),
  },
  {
    id: "title_ice_lord",
    name: "Jégkirály",
    desc: "Fagyaszd meg az időt az Időfagyasztóval",
    achId: "freeze_time",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("freeze_time"),
  },
  {
    id: "title_magnet_force",
    name: "Mágneses Erőmű",
    desc: "Ránts össze egy egész színt a Szuper Mágnessel",
    achId: "magnet_pull",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("magnet_pull"),
  },
  {
    id: "title_perfectionist",
    name: "Tökéletesség Híve",
    desc: "Takarítsd le a teljes táblát 0 blokkra",
    achId: "perfect_clear",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("perfect_clear"),
  },
  {
    id: "title_time_bender",
    name: "Időhajlító",
    desc: "Játssz legalább 10 percet vagy gyűjts időbónuszt",
    achId: "time_bonus",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 600 || achSet.has("time_bonus"),
  },
  {
    id: "title_veteran",
    name: "Veterán Blokktörő",
    desc: "Játssz le legalább 5 teljes meccset",
    achId: "play_5_matches",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 5 || achSet.has("play_5_matches"),
  },
  {
    id: "title_devoted",
    name: "Zúzó Legenda",
    desc: "Játssz le legalább 20 teljes mérkőzést",
    achId: "play_20_matches",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 20 || achSet.has("play_20_matches"),
  },
  {
    id: "title_power_novice",
    name: "Energikus Zúzó",
    desc: "Aktiválj legalább 5 power-upot",
    achId: "powerup_5",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("powerup_5"),
  },
  {
    id: "title_power_collector",
    name: "Power-up Mágus",
    desc: "Aktiválj legalább 10 power-upot",
    achId: "powerup_10",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("powerup_10"),
  },
  {
    id: "title_power_master",
    name: "Power-up Varázsló",
    desc: "Aktiválj legalább 25 power-upot",
    achId: "powerup_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("powerup_25"),
  },
  {
    id: "title_power_titan",
    name: "Power-up Titán",
    desc: "Aktiválj legalább 50 power-upot",
    achId: "powerup_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("powerup_50"),
  },
  {
    id: "title_inspector",
    name: "Profil Kutató",
    desc: "Nézd meg egy másik játékos profilját a ranglistán",
    achId: "inspect_profile",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("inspect_profile"),
  },
  {
    id: "title_time_1m",
    name: "Bemelegítő Bajnok",
    desc: "Játssz legalább 1 percet a játékban",
    achId: "play_time_1m",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 60 || achSet.has("play_time_1m"),
  },
  {
    id: "title_time_5m",
    name: "Kitartó Blokkozó",
    desc: "Játssz legalább 5 percet a játékban",
    achId: "play_time_5m",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 300 || achSet.has("play_time_5m"),
  },
  {
    id: "title_time_15m",
    name: "Időúr",
    desc: "Érj el legalább 15 perc összesített játékidőt",
    achId: "play_time_15m",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 900 || achSet.has("play_time_15m"),
  },
  {
    id: "title_time_30m",
    name: "Crashdown Fanatikus",
    desc: "Érj el legalább 30 perc összesített játékidőt",
    achId: "play_time_30m",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 1800 || achSet.has("play_time_30m"),
  },
  {
    id: "title_matches_10",
    name: "Harcedzett Zúzó",
    desc: "Játssz le legalább 10 teljes mérkőzést",
    achId: "matches_10",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 10 || achSet.has("matches_10"),
  },
  {
    id: "title_matches_50",
    name: "Crashdown Veterán",
    desc: "Játssz le legalább 50 teljes mérkőzést",
    achId: "matches_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 50 || achSet.has("matches_50"),
  },
  {
    id: "title_combo_x4",
    name: "Lángoló Kezek",
    desc: "Érj el legalább 4×-es kombó szorzót",
    achId: "combo_x4",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("combo_x4"),
  },
  {
    id: "title_powerup_100",
    name: "Power-up Fanatikus",
    desc: "Aktiválj legalább 100 db power-upot",
    achId: "powerup_100",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("powerup_100"),
  },
  {
    id: "title_matches_100",
    name: "Százados Zúzó",
    desc: "Játssz le legalább 100 teljes mérkőzést",
    achId: "matches_100",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 100 || achSet.has("matches_100"),
  },
  {
    id: "title_play_1h",
    name: "Időutazó Mester",
    desc: "Érj el legalább 1 óra összesített játékidőt",
    achId: "play_time_1h",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      stats.totalPlaytimeSeconds >= 3600 || achSet.has("play_time_1h"),
  },
  {
    id: "title_chaos_lord",
    name: "Káosz Ura",
    desc: "Érj el legalább 5 000 pontot a Káosz módban",
    achId: "mode_chaos_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("mode_chaos_win"),
  },
  {
    id: "title_bomb_master",
    name: "Mesterbombázó",
    desc: "Érj el legalább 5 000 pontot a Robbanás Mániában",
    achId: "mode_bomb_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("mode_bomb_win") || achSet.has("tnt_collector_25"),
  },
  {
    id: "title_time_master",
    name: "Időhajhász",
    desc: "Érj el legalább 5 000 pontot az Időhajsza módban",
    achId: "mode_time_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("mode_time_win"),
  },
  {
    id: "title_purist",
    name: "Tisztakezű Zseni",
    desc: "Érj el legalább 3 000 pontot a Nyers módban",
    achId: "mode_raw_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("mode_raw_win"),
  },
  {
    id: "title_tnt_master",
    name: "Bomba Szakértő",
    desc: "Robbants fel legalább 25 db TNT blokkot",
    achId: "tnt_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("tnt_collector_25"),
  },
  {
    id: "title_magnet_expert",
    name: "Mágnes Mester",
    desc: "Használj fel legalább 25 db mágnes power-upot",
    achId: "magnet_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("magnet_collector_25"),
  },
  {
    id: "title_freeze_lord",
    name: "Fagyasztó Úr",
    desc: "Fagyaszd be az időt legalább 25 alkalommal",
    achId: "freeze_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("freeze_collector_25"),
  },

  // SPECIÁLIS RANGCÍMEK (Ragyogó, animált színátmenetes címek, tiszta névvel)
  {
    id: "title_cosmic_destroyer",
    name: "Kozmikus Pusztító",
    desc: "Érj el legalább 75 000 pontot egy meccsben",
    achId: "score_75k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 75000 || achSet.has("score_75k"),
  },
  {
    id: "title_golden_emperor",
    name: "Halhatatlan Blokkuralkodó",
    desc: "Lépd át a 100 000 pontos álomhatárt egy menetben!",
    achId: "score_100k",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 100000 || achSet.has("score_100k"),
  },
  {
    id: "title_firestorm_god",
    name: "Tűzvihar Istenség",
    desc: "Aktiválj legalább 500 db power-upot!",
    achId: "powerup_500",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("powerup_500"),
  },
  {
    id: "title_infinite_legend",
    name: "Végtelen Krónikás",
    desc: "Játssz le legalább 250 mérkőzést az arénában!",
    achId: "matches_250",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 250 || achSet.has("matches_250"),
  },
  {
    id: "title_millionaire",
    name: "Pontmilliomos",
    desc: "Gyűjts össze összesen legalább 1 000 000 pontot a profilodon!",
    achId: "total_score_1m",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      (stats.totalScore || 0) >= 1000000 || achSet.has("total_score_1m"),
  },
  {
    id: "title_peak_breaker",
    name: "Abszolút Csúcsdöntő",
    desc: "Érj el legalább 150 000 pontot egy menetben!",
    achId: "score_150k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 150000 || achSet.has("score_150k"),
  },
  {
    id: "title_cosmic_majesty",
    name: "Kozmikus Fenség",
    desc: "Érj el legalább 250 000 pontot egy meccsben!",
    achId: "score_250k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.bestScore >= 250000 || achSet.has("score_250k"),
  },
  {
    id: "title_supersonic_combo",
    name: "Szuperszonikus Kombó",
    desc: "Pörgesd fel a kombó szorzót legalább 6×-os kombóig!",
    achId: "lightning_combo_6",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("lightning_combo_6"),
  },
  {
    id: "title_colossus_destroyer",
    name: "Kolosszális Pusztító",
    desc: "Törölj el legalább 16 blokkot egyetlen kattintással!",
    achId: "massive_clear_16",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("massive_clear_16"),
  },
  {
    id: "title_mythic_legend",
    name: "Örökös Crashdown Legenda",
    desc: "Játssz le legalább 500 mérkőzést az arénában!",
    achId: "matches_500",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      stats.totalMatches >= 500 || achSet.has("matches_500"),
  },
  {
    id: "title_multimillionaire",
    name: "Multimilliomos Rekorder",
    desc: "Lépd át az 5 000 000 összesített pontszámot!",
    achId: "total_score_5m",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) =>
      (stats.totalScore || 0) >= 5000000 || achSet.has("total_score_5m"),
  },
  {
    id: "title_sprint_titan",
    name: "Villámfutó Titán",
    desc: "Érj el legalább 5 000 pontot a 30 másodperces villámmódban!",
    achId: "sprint_5k",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("sprint_5k"),
  },
];

let recentSuccessfulClicks = [];
let currentAchievementFilter = "all";

function getUnlockedAchievements() {
  try {
    const raw = localStorage.getItem("crashdown_achievements");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function checkAchievement(id) {
  const list = getUnlockedAchievements();
  const set = new Set(list);
  if (set.has(id)) return;

  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (!ach) return;

  set.add(id);
  localStorage.setItem("crashdown_achievements", JSON.stringify([...set]));

  const currentUser = window.authService?.getCurrentUser();
  if (currentUser && currentUser.displayName) {
    updatePlayerStatsRecord(currentUser.displayName, 0, "3", 0);
  }

  triggerHaptic("success");
  playSound(sikeresKatt);
  if (typeof showToast === "function") {
    showToast(`🏆 Jelvény feloldva: ${ach.icon} ${ach.title}!`, "success");
  }

  updateAchievementsUI();
}

function updateAchievementsUI() {
  const unlockedList = getUnlockedAchievements();
  const unlockedSet = new Set(unlockedList);
  const totalCount = ACHIEVEMENTS.length;
  const unlockedCount = unlockedList.length;
  const lockedCount = totalCount - unlockedCount;
  const percent = Math.round((unlockedCount / totalCount) * 100);

  const countEl = document.getElementById("unlockedAchievementsCount");
  const totalEl = document.getElementById("totalAchievementsCount");
  if (countEl) countEl.textContent = unlockedCount;
  if (totalEl) totalEl.textContent = totalCount;

  const summaryCountEl = document.getElementById("achievementsSummaryCount");
  const totalSummaryCountEl = document.getElementById(
    "achievementsTotalSummaryCount",
  );
  const percentEl = document.getElementById("achievementsPercent");
  const progressFill = document.getElementById("achievementsProgressFill");

  if (summaryCountEl) summaryCountEl.textContent = unlockedCount;
  if (totalSummaryCountEl) totalSummaryCountEl.textContent = totalCount;
  if (percentEl) percentEl.textContent = `${percent}%`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  const fAll = document.getElementById("achFilterAllCount");
  const fUn = document.getElementById("achFilterUnlockedCount");
  const fLock = document.getElementById("achFilterLockedCount");
  if (fAll) fAll.textContent = totalCount;
  if (fUn) fUn.textContent = unlockedCount;
  if (fLock) fLock.textContent = lockedCount;

  const listContainer = document.getElementById("achievementsList");
  if (!listContainer) return;

  listContainer.innerHTML = ACHIEVEMENTS.map((ach) => {
    const isUnlocked = unlockedSet.has(ach.id);
    const shouldHide =
      (currentAchievementFilter === "unlocked" && !isUnlocked) ||
      (currentAchievementFilter === "locked" && isUnlocked);

    const rewList = getAchievementRewards(ach.id);
    const rewardSnippet =
      rewList.length > 0
        ? `<div class="ach-card-reward-tag"><strong>Jutalmak:</strong><br>${rewList.map((r) => r.text).join("<br>")}</div>`
        : "";

    return `
            <div class="achievement-card ${isUnlocked ? "unlocked" : "locked"} ${shouldHide ? "card-filtered-out" : ""}" data-ach-id="${ach.id}" data-unlocked="${isUnlocked ? "1" : "0"}">
                <div class="ach-card-header">
                    <div class="achievement-icon-wrap">${ach.icon}</div>
                    <span class="achievement-status">${isUnlocked ? "Feloldva ✓" : "🔒 Zárolva"}</span>
                </div>
                <div class="achievement-info">
                    <strong>${ach.title}</strong>
                    <small>${ach.desc}</small>
                    ${rewardSnippet}
                </div>
            </div>
        `;
  }).join("");

  if (typeof updateThemeSelectUI === "function") {
    updateThemeSelectUI();
  }
}

function applyAchievementFilter(filter) {
  currentAchievementFilter = filter;
  const listContainer = document.getElementById("achievementsList");
  if (!listContainer) return;

  const cards = listContainer.querySelectorAll(".achievement-card");
  cards.forEach((card) => {
    const isUnlocked = card.getAttribute("data-unlocked") === "1";
    if (filter === "all") {
      card.classList.remove("card-filtered-out");
    } else if (filter === "unlocked") {
      card.classList.toggle("card-filtered-out", !isUnlocked);
    } else if (filter === "locked") {
      card.classList.toggle("card-filtered-out", isUnlocked);
    }
  });
}

// Játékos profil statisztika frissítése és tárolása
function updatePlayerStatsRecord(
  username,
  score,
  colorCount,
  durationSeconds,
  modifier,
) {
  if (!username) return;
  try {
    const key = "crashdown_player_profiles";
    const profiles = JSON.parse(localStorage.getItem(key) || "{}");
    const p = profiles[username] || {
      username: username,
      totalMatches: 0,
      totalPlaytimeSeconds: 0,
      totalScore: 0,
      bestScore: 0,
      achievements: [],
      modes: {},
      durations: {},
      modifierStats: {},
      durationStats: {},
      history: [],
      chosenTitle: null,
      chosenAvatar: "avatar_default",
      chosenNameColor: "name_white",
    };

    if (!p.history) p.history = [];
    if (!p.modes) p.modes = {};
    if (!p.modifierStats) p.modifierStats = {};
    if (!p.durationStats) p.durationStats = {};

    const numericScore = parseInt(score, 10) || 0;
    const durSec = parseInt(durationSeconds, 10) || 60;
    const modKey = modifier || "normal";
    const cKey = String(colorCount || "3");

    if (numericScore > 0 || durSec > 0) {
      p.totalMatches = (p.totalMatches || 0) + 1;
      p.totalPlaytimeSeconds = (p.totalPlaytimeSeconds || 0) + durSec;
      p.totalScore = (p.totalScore || 0) + numericScore;
      if (numericScore > (p.bestScore || 0)) p.bestScore = numericScore;

      // Színmód statisztika
      if (!p.modes[cKey]) p.modes[cKey] = { matches: 0, bestScore: 0 };
      p.modes[cKey].matches += 1;
      if (numericScore > p.modes[cKey].bestScore)
        p.modes[cKey].bestScore = numericScore;

      // Játékmód statisztika
      if (!p.modifierStats[modKey])
        p.modifierStats[modKey] = { matches: 0, bestScore: 0, totalScore: 0 };
      p.modifierStats[modKey].matches += 1;
      p.modifierStats[modKey].totalScore += numericScore;
      if (numericScore > p.modifierStats[modKey].bestScore)
        p.modifierStats[modKey].bestScore = numericScore;

      // Időtartam statisztika
      const dKey = String(durSec);
      if (!p.durationStats[dKey])
        p.durationStats[dKey] = { matches: 0, bestScore: 0, totalScore: 0 };
      p.durationStats[dKey].matches += 1;
      p.durationStats[dKey].totalScore += numericScore;
      if (numericScore > p.durationStats[dKey].bestScore)
        p.durationStats[dKey].bestScore = numericScore;

      p.history.unshift({
        score: numericScore,
        color: cKey,
        modifier: modKey,
        duration: durSec,
        timestamp: new Date().toISOString(),
      });
      if (p.history.length > 10) {
        p.history = p.history.slice(0, 10);
      }
    }

    const currentUser = window.authService?.getCurrentUser();
    if (currentUser && currentUser.displayName === username) {
      p.achievements = getUnlockedAchievements();
      p.chosenTitle =
        localStorage.getItem("crashdown_chosen_title") || p.chosenTitle;
      p.chosenAvatar =
        localStorage.getItem("crashdown_chosen_avatar") ||
        p.chosenAvatar ||
        "avatar_default";
      p.chosenNameColor =
        localStorage.getItem("crashdown_chosen_name_color") ||
        p.chosenNameColor ||
        "name_white";
    }

    // Mérkőzésszám mérföldkövek
    if (p.totalMatches >= 5) checkAchievement("play_5_matches");
    if (p.totalMatches >= 10) checkAchievement("matches_10");
    if (p.totalMatches >= 20) checkAchievement("play_20_matches");
    if (p.totalMatches >= 50) checkAchievement("matches_50");
    if (p.totalMatches >= 100) checkAchievement("matches_100");
    if (p.totalMatches >= 250) checkAchievement("matches_250");
    if (p.totalMatches >= 500) checkAchievement("matches_500");

    // Játékidő mérföldkövek
    if (p.totalPlaytimeSeconds >= 60) checkAchievement("play_time_1m");
    if (p.totalPlaytimeSeconds >= 300) checkAchievement("play_time_5m");
    if (p.totalPlaytimeSeconds >= 900) checkAchievement("play_time_15m");
    if (p.totalPlaytimeSeconds >= 1800) checkAchievement("play_time_30m");
    if (p.totalPlaytimeSeconds >= 3600) checkAchievement("play_time_1h");
    if (p.totalPlaytimeSeconds >= 7200) checkAchievement("play_time_2h");

    // Összesített pontszám mérföldkövek
    if (p.totalScore >= 100000) checkAchievement("total_score_100k");
    if (p.totalScore >= 500000) checkAchievement("total_score_500k");
    if (p.totalScore >= 1000000) checkAchievement("total_score_1m");
    if (p.totalScore >= 5000000) checkAchievement("total_score_5m");

    // Pontszám rekord mérföldkövek
    if (numericScore >= 500) checkAchievement("first_500");
    if (numericScore >= 1500) checkAchievement("score_1500");
    if (numericScore >= 5000) checkAchievement("score_5000");
    if (numericScore >= 10000) checkAchievement("score_10k");
    if (numericScore >= 25000) checkAchievement("score_25k");
    if (numericScore >= 50000) checkAchievement("score_50k");
    if (numericScore >= 75000) checkAchievement("score_75k");
    if (numericScore >= 100000) checkAchievement("score_100k");
    if (numericScore >= 150000) checkAchievement("score_150k");
    if (numericScore >= 250000) checkAchievement("score_250k");

    // Mód szerinti győzelmek / jó eredmények
    if (modKey === "chaos" && numericScore >= 5000)
      checkAchievement("mode_chaos_win");
    if (modKey === "bomb_frenzy" && numericScore >= 5000)
      checkAchievement("mode_bomb_win");
    if (modKey === "time_rush" && numericScore >= 5000)
      checkAchievement("mode_time_win");
    if (modKey === "no_powerups" && numericScore >= 3000)
      checkAchievement("mode_raw_win");

    // Időtartam rekordok
    if (durSec === 30 && numericScore >= 5000) checkAchievement("sprint_5k");
    if (durSec === 180 && numericScore >= 15000) checkAchievement("marathon_15k");

    // Változatosság mérföldkövek (minden mód, minden időtartam, minden színszám)
    const all5Modes = ["normal", "chaos", "bomb_frenzy", "time_rush", "no_powerups"];
    if (all5Modes.every((m) => p.modifierStats[m] && p.modifierStats[m].matches > 0)) {
      checkAchievement("all_modes_played");
    }
    const allDurations = ["30", "60", "90", "180"];
    if (allDurations.every((d) => p.durationStats[d] && p.durationStats[d].matches > 0)) {
      checkAchievement("all_durations_played");
    }
    const allColors = ["2", "3", "4", "5"];
    if (allColors.every((c) => p.modes[c] && p.modes[c].matches > 0)) {
      checkAchievement("all_colors_played");
    }

    profiles[username] = p;
    localStorage.setItem(key, JSON.stringify(profiles));

    if (
      window.databaseService &&
      typeof window.databaseService.savePlayerProfile === "function"
    ) {
      window.databaseService.savePlayerProfile(username, p).catch(() => {});
    }
  } catch (e) {
    console.error("Hiba a játékos statisztika mentésekor:", e);
  }
}

function regisztraljPowerupHasznalatot(type = null) {
  let count = parseInt(
    localStorage.getItem("crashdown_powerup_count") || "0",
    10,
  );
  count += 1;
  localStorage.setItem("crashdown_powerup_count", count);
  if (count >= 5) checkAchievement("powerup_5");
  if (count >= 10) checkAchievement("powerup_10");
  if (count >= 25) checkAchievement("powerup_25");
  if (count >= 50) checkAchievement("powerup_50");
  if (count >= 100) checkAchievement("powerup_100");
  if (count >= 250) checkAchievement("powerup_250");
  if (count >= 500) checkAchievement("powerup_500");

  if (type) {
    const key = `crashdown_powerup_${type}_count`;
    let tCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, tCount);
    if (type === "tnt" && tCount >= 25) checkAchievement("tnt_collector_25");
    if (type === "magnet" && tCount >= 25) checkAchievement("magnet_collector_25");
    if (type === "freeze" && tCount >= 25) checkAchievement("freeze_collector_25");
    if (type === "doubler" && tCount >= 25) checkAchievement("doubler_collector_25");
    if (type === "colorbomb" && tCount >= 25) checkAchievement("colorbomb_collector_25");
  }
}

function getPlayerProfileStats(username, allScores = [], onlineProfile = null) {
  let profile = null;
  try {
    const profiles = JSON.parse(
      localStorage.getItem("crashdown_player_profiles") || "{}",
    );
    if (profiles[username]) {
      profile = { ...profiles[username] };
    } else {
      const matchKey = Object.keys(profiles).find(
        (k) => k.toLowerCase() === String(username).toLowerCase(),
      );
      if (matchKey) {
        profile = { ...profiles[matchKey] };
      }
    }
  } catch (e) {}

  const playerScores = allScores.filter(
    (s) => s.name && s.name.toLowerCase() === String(username).toLowerCase(),
  );

  if (!profile) {
    profile = {
      username: username,
      totalMatches: 0,
      totalPlaytimeSeconds: 0,
      totalScore: 0,
      bestScore: 0,
      achievements: [],
      modes: {},
      durations: {},
      modifierStats: {},
      durationStats: {},
      history: [],
      chosenTitle: null,
      chosenAvatar: "avatar_default",
      chosenNameColor: "name_white",
    };
  }

  // Ha a ranglistán szerepel a játékos egyedi testreszabása, vegyük figyelembe
  playerScores.forEach((s) => {
    if (
      (!profile.chosenAvatar || profile.chosenAvatar === "avatar_default") &&
      s.chosenAvatar
    ) {
      profile.chosenAvatar = s.chosenAvatar;
    }
    if (!profile.chosenTitle && s.chosenTitle) {
      profile.chosenTitle = s.chosenTitle;
    }
    if (
      (!profile.chosenNameColor || profile.chosenNameColor === "name_white") &&
      s.chosenNameColor
    ) {
      profile.chosenNameColor = s.chosenNameColor;
    }
  });
  if (!profile.history) profile.history = [];
  if (!profile.modes) profile.modes = {};
  if (!profile.modifierStats) profile.modifierStats = {};
  if (!profile.durationStats) profile.durationStats = {};

  // Online profil adatainak összefésülése
  if (onlineProfile) {
    if (
      onlineProfile.history &&
      Array.isArray(onlineProfile.history) &&
      onlineProfile.history.length > 0
    ) {
      profile.history = onlineProfile.history;
    }
    if (
      onlineProfile.achievements &&
      Array.isArray(onlineProfile.achievements) &&
      onlineProfile.achievements.length > 0
    ) {
      profile.achievements = Array.from(
        new Set([
          ...(profile.achievements || []),
          ...onlineProfile.achievements,
        ]),
      );
    }
    if (onlineProfile.chosenTitle)
      profile.chosenTitle = onlineProfile.chosenTitle;
    if (onlineProfile.chosenAvatar)
      profile.chosenAvatar = onlineProfile.chosenAvatar;
    if (onlineProfile.chosenNameColor)
      profile.chosenNameColor = onlineProfile.chosenNameColor;
    if ((onlineProfile.bestScore || 0) > (profile.bestScore || 0))
      profile.bestScore = onlineProfile.bestScore;
    if ((onlineProfile.totalMatches || 0) > (profile.totalMatches || 0))
      profile.totalMatches = onlineProfile.totalMatches;
    if ((onlineProfile.totalScore || 0) > (profile.totalScore || 0))
      profile.totalScore = onlineProfile.totalScore;
    if (
      (onlineProfile.totalPlaytimeSeconds || 0) >
      (profile.totalPlaytimeSeconds || 0)
    )
      profile.totalPlaytimeSeconds = onlineProfile.totalPlaytimeSeconds;
    if (onlineProfile.modifierStats) {
      profile.modifierStats = {
        ...profile.modifierStats,
        ...onlineProfile.modifierStats,
      };
    }
    if (onlineProfile.durationStats) {
      profile.durationStats = {
        ...profile.durationStats,
        ...onlineProfile.durationStats,
      };
    }
  }

  // Statisztikák kiegészítése a meccsek listájából
  let aggTotalScore = profile.totalScore || 0;
  playerScores.forEach((s) => {
    const sc = parseInt(s.score, 10) || 0;
    if (sc > (profile.bestScore || 0)) profile.bestScore = sc;

    const cKey = String(s.color || "3");
    if (!profile.modes[cKey])
      profile.modes[cKey] = { matches: 0, bestScore: 0 };
    profile.modes[cKey].matches += 1;
    if (sc > profile.modes[cKey].bestScore) profile.modes[cKey].bestScore = sc;

    const mKey = s.modifier || "normal";
    if (!profile.modifierStats[mKey])
      profile.modifierStats[mKey] = { matches: 0, bestScore: 0, totalScore: 0 };
    profile.modifierStats[mKey].matches += 1;
    profile.modifierStats[mKey].totalScore += sc;
    if (sc > profile.modifierStats[mKey].bestScore)
      profile.modifierStats[mKey].bestScore = sc;

    const dKey = String(s.duration || "60");
    if (!profile.durationStats[dKey])
      profile.durationStats[dKey] = { matches: 0, bestScore: 0, totalScore: 0 };
    profile.durationStats[dKey].matches += 1;
    profile.durationStats[dKey].totalScore += sc;
    if (sc > profile.durationStats[dKey].bestScore)
      profile.durationStats[dKey].bestScore = sc;
  });

  if (profile.totalMatches < playerScores.length) {
    profile.totalMatches = playerScores.length;
  }
  if (profile.totalPlaytimeSeconds === 0 && playerScores.length > 0) {
    playerScores.forEach((s) => {
      profile.totalPlaytimeSeconds += parseInt(s.duration, 10) || 60;
    });
  }

  // Ha totalScore még mindig 0, számoljuk ki a meccsekből
  if (!profile.totalScore || profile.totalScore === 0) {
    if (playerScores.length > 0) {
      profile.totalScore = playerScores.reduce(
        (sum, s) => sum + (parseInt(s.score, 10) || 0),
        0,
      );
    } else if (profile.history && profile.history.length > 0) {
      profile.totalScore = profile.history.reduce(
        (sum, h) => sum + (parseInt(h.score, 10) || 0),
        0,
      );
    }
  }

  // Ha az előzmények üresek, de vannak meccsei a ranglistán, töltsük be azokat!
  if (!profile.history || profile.history.length === 0) {
    profile.history = playerScores
      .map((s) => ({
        score: parseInt(s.score, 10) || 0,
        color: String(s.color || "3"),
        modifier: s.modifier || "normal",
        duration: parseInt(s.duration, 10) || 60,
        timestamp: s.timestamp || new Date().toISOString(),
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }

  // Ha nincsenek szinkronizált mérföldkövei, a statisztikái alapján következtessük ki
  if (!profile.achievements || profile.achievements.length === 0) {
    const inferred = [];
    if (profile.bestScore >= 500) inferred.push("first_500");
    if (profile.bestScore >= 1500) inferred.push("score_1500");
    if (profile.bestScore >= 5000) inferred.push("score_5000");
    if (profile.bestScore >= 10000) inferred.push("score_10k");
    if (profile.bestScore >= 25000) inferred.push("score_25k");
    if (profile.bestScore >= 50000) inferred.push("score_50k");
    if (profile.bestScore >= 75000) inferred.push("score_75k");
    if (profile.bestScore >= 100000) inferred.push("score_100k");
    if (profile.totalMatches >= 5) inferred.push("play_5_matches");
    if (profile.totalMatches >= 10) inferred.push("matches_10");
    if (profile.totalMatches >= 20) inferred.push("play_20_matches");
    if (profile.totalMatches >= 50) inferred.push("matches_50");
    if (profile.totalMatches >= 100) inferred.push("matches_100");
    if (profile.totalMatches >= 250) inferred.push("matches_250");
    if (profile.totalPlaytimeSeconds >= 60) inferred.push("play_time_1m");
    if (profile.totalPlaytimeSeconds >= 300) inferred.push("play_time_5m");
    if (profile.totalPlaytimeSeconds >= 900) inferred.push("play_time_15m");
    if (profile.totalPlaytimeSeconds >= 1800) inferred.push("play_time_30m");
    if (profile.totalPlaytimeSeconds >= 3600) inferred.push("play_time_1h");
    if (profile.totalPlaytimeSeconds >= 7200) inferred.push("play_time_2h");
    profile.achievements = inferred;
  }

  const currentUser = window.authService?.getCurrentUser();
  if (
    currentUser &&
    currentUser.displayName &&
    currentUser.displayName.toLowerCase() === username.toLowerCase()
  ) {
    profile.achievements = getUnlockedAchievements();
    profile.chosenTitle =
      localStorage.getItem("crashdown_chosen_title") || profile.chosenTitle;
    profile.chosenAvatar =
      localStorage.getItem("crashdown_chosen_avatar") ||
      profile.chosenAvatar ||
      "avatar_default";
    profile.chosenNameColor =
      localStorage.getItem("crashdown_chosen_name_color") ||
      profile.chosenNameColor ||
      "name_white";
  }

  const achSet = new Set(profile.achievements || []);

  // Rangcím meghatározása:
  // Alapjáraton mindig az alapértelmezett kezdő blokktörő marad,
  // és CSAKIS akkor változik meg, ha a játékos maga átállítja a profilján!
  let activeTitle = null;
  if (profile.chosenTitle) {
    const foundTitle = PROFILE_TITLES.find((t) => t.id === profile.chosenTitle);
    if (foundTitle && foundTitle.isUnlocked(profile, achSet)) {
      activeTitle = foundTitle;
    }
  }
  profile.activeTitle = activeTitle || PROFILE_TITLES[0];

  // Profilkép (Avatar) meghatározása
  let activeAvatar = null;
  if (profile.chosenAvatar) {
    const foundAv = PROFILE_AVATARS.find((a) => a.id === profile.chosenAvatar);
    if (foundAv && (!foundAv.achId || achSet.has(foundAv.achId))) {
      activeAvatar = foundAv;
    }
  }
  profile.activeAvatar = activeAvatar || PROFILE_AVATARS[0];

  // Név szín meghatározása
  let activeNameColor = null;
  const nameColorCatalog =
    typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
  if (profile.chosenNameColor) {
    const foundCol = nameColorCatalog.find(
      (c) => c.id === profile.chosenNameColor,
    );
    if (foundCol && (!foundCol.achId || achSet.has(foundCol.achId))) {
      activeNameColor = foundCol;
    }
  }
  profile.activeNameColor =
    activeNameColor ||
    nameColorCatalog[0] || {
      id: "name_white",
      name: "Klasszikus Fehér",
      className: "name-color-white",
    };

  return profile;
}
