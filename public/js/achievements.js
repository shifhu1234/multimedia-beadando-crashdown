/* ================================================================
   CRASHDOWN ARCADE - ACHIEVEMENTS, TITLES, AVATARS & USER STATS
   ================================================================ */

// ==================== MÉRFÖLDKÖVEK & JELVÉNYEK (36 DB) ====================
const ACHIEVEMENTS = [
  {
    id: "ach_first_click",
    icon: "🎯",
    title: "Első Kattintás",
    desc: "Töröld el az első érvényes blokkcsoportodat a pályán!",
  },
  {
    id: "ach_score_200",
    icon: "⭐",
    title: "Első Pontok",
    desc: "Érj el legalább 200 pontot egy menetben!",
  },
  {
    id: "ach_score_800",
    icon: "🏅",
    title: "Pontgyűjtő Felfedező",
    desc: "Érj el legalább 800 pontot egy menetben!",
  },
  {
    id: "ach_matches_1",
    icon: "🎮",
    title: "Első Menet",
    desc: "Fejezz be egy teljes mérkőzést az arénában!",
  },
  {
    id: "ach_play_time_15s",
    icon: "⏱️",
    title: "Kezdő Lépések",
    desc: "Játssz legalább 15 másodpercet az arénában!",
  },
  {
    id: "ach_combo_x2",
    icon: "⚡",
    title: "Kombó Kezdő",
    desc: "Érj el 2×-es kombó szorzót gyors egymásutánban!",
  },
  {
    id: "ach_combo_x3",
    icon: "⚡",
    title: "Kombó Guru",
    desc: "Pörgesd fel a szorzót legalább 3×-os értékre!",
  },
  {
    id: "ach_frenzy_active",
    icon: "🔥",
    title: "Frenzy Láz",
    desc: "Aktiválj legalább egy Frenzy 2× pontduplázó időszakot!",
  },
  {
    id: "ach_time_bonus_catch",
    icon: "⌛",
    title: "Időmentő",
    desc: "Gyűjts be egy +5s extra idő blokkot!",
  },
  {
    id: "ach_shuffle_board",
    icon: "⟳",
    title: "Újraelosztás",
    desc: "Keverd újra a tábla blokkjait szorult helyzetben!",
  },
  {
    id: "ach_powerup_first_any",
    icon: "✨",
    title: "Első Erőforrás",
    desc: "Aktiválj bármilyen különleges power-up blokkot!",
  },
  {
    id: "ach_cleared_100_blocks",
    icon: "💥",
    title: "Százas Zúzó",
    desc: "Pucolj el legalább 100 blokkot a játékaid során!",
  },
  {
    id: "ach_color_change_event",
    icon: "🎨",
    title: "Témaváltó",
    desc: "Próbálj ki egy másik színtémát a játékban!",
  },
  {
    id: "ach_sound_toggle",
    icon: "🔊",
    title: "Audiofil",
    desc: "Állítsd be a játék hangerejét a csúszkával!",
  },
  {
    id: "ach_history_check",
    icon: "📜",
    title: "Krónika Kutató",
    desc: "Nézd meg a meccselőzményeidet a profilodon!",
  },
  {
    id: "ach_score_500",
    icon: "🍬",
    title: "Édes Kezdet",
    desc: "Érj el legalább 500 pontot egy menetben!",
  },
  {
    id: "ach_score_1000",
    icon: "🎖️",
    title: "Ezer Pontos Határ",
    desc: "Lépd át az 1 000 pontot egy menetben!",
  },
  {
    id: "ach_score_1500",
    icon: "🌌",
    title: "Haladó Törő",
    desc: "Érj el legalább 1 500 pontot egy meccsben!",
  },
  {
    id: "ach_score_5000",
    icon: "🏆",
    title: "Pontvadász Bajnok",
    desc: "Érj el legalább 5 000 pontot egyetlen menetben!",
  },
  {
    id: "ach_score_7500",
    icon: "👑",
    title: "Arany Pontvadász",
    desc: "Érj el legalább 7 500 pontot egy menetben!",
  },
  {
    id: "ach_score_10k",
    icon: "👑",
    title: "Crashdown Mester",
    desc: "Lépd át a 10 000 pontos álomhatárt!",
  },
  {
    id: "ach_score_15k",
    icon: "💎",
    title: "Kristály Zúzó",
    desc: "Érj el szédítő 15 000 pontot egy menetben!",
  },
  {
    id: "ach_score_25k",
    icon: "🌌",
    title: "Galaktikus Bajnok",
    desc: "Érj el legalább 25 000 pontot egyetlen meccsben!",
  },
  {
    id: "ach_score_35k",
    icon: "✨",
    title: "Asztrális Csillag",
    desc: "Lépd át a 35 000 pontos csúcseredményt!",
  },
  {
    id: "ach_score_50k",
    icon: "💎",
    title: "Kozmikus Rekorder",
    desc: "Lépd át a felfoghatatlan 50 000 pontos rekordot!",
  },
  {
    id: "ach_score_60k",
    icon: "💠",
    title: "Gyémánt Fény",
    desc: "Érj el legalább 60 000 pontot egy menetben!",
  },
  {
    id: "ach_score_75k",
    icon: "🔮",
    title: "Kozmikus Legenda",
    desc: "Érj el szédítő 75 000 pontot egy menetben!",
  },
  {
    id: "ach_score_85k",
    icon: "🪐",
    title: "Csillagközi Pusztító",
    desc: "Érj el félelmetes 85 000 pontot egy menetben!",
  },
  {
    id: "ach_score_90k",
    icon: "🌌",
    title: "Void Fényörvény",
    desc: "Érj el legalább 90 000 pontot egyetlen meccsben!",
  },
  {
    id: "ach_score_100k",
    icon: "👑",
    title: "Halhatatlan Rekorder",
    desc: "Lépd át a mitikus 100 000 pontos álomhatárt!",
  },
  {
    id: "ach_score_110k",
    icon: "🔱",
    title: "Arany Trónörökös",
    desc: "Érj el legalább 110 000 pontot egy menetben!",
  },
  {
    id: "ach_score_125k",
    icon: "👑",
    title: "Birodalmi Császár",
    desc: "Lépd át a 125 000 pontos gigantikus csúcsot!",
  },
  {
    id: "ach_score_150k",
    icon: "🌠",
    title: "Abszolút Csúcsdöntő",
    desc: "Érj el legalább 150 000 pontot egy menetben!",
  },
  {
    id: "ach_score_200k",
    icon: "☄️",
    title: "Hullócsillag Vihar",
    desc: "Lépd át a szédületes 200 000 pontos határt!",
  },
  {
    id: "ach_score_250k",
    icon: "🌌",
    title: "Kozmikus Fenség",
    desc: "Érj el felfoghatatlan 250 000 pontot egyetlen meccsben!",
  },
  {
    id: "ach_score_300k",
    icon: "🪐",
    title: "Galaktikus Maghasadás",
    desc: "Lépd át a 300 000 pontos mítikus rekordot!",
  },
  {
    id: "ach_score_500k",
    icon: "✨",
    title: "Félmilliós Isten",
    desc: "Érj el félelmetes 500 000 pontot egy menetben!",
  },
  {
    id: "ach_total_score_50k",
    icon: "🗡️",
    title: "Lovagi Kezdet",
    desc: "Gyűjts össze összesen legalább 50 000 összpontszámot!",
  },
  {
    id: "ach_total_score_100k",
    icon: "💎",
    title: "Pontgyűjtő Titán",
    desc: "Gyűjts össze összesen legalább 100 000 pontot a profilodon!",
  },
  {
    id: "ach_total_score_250k",
    icon: "🔮",
    title: "Lila Varázsló",
    desc: "Érj el legalább 250 000 összesített összpontszámot!",
  },
  {
    id: "ach_total_score_500k",
    icon: "✨",
    title: "Félmilliós Legenda",
    desc: "Érj el legalább 500 000 összpontszámot a profilodon!",
  },
  {
    id: "ach_total_score_1m",
    icon: "👑",
    title: "Pontmilliomos",
    desc: "Lépd át az 1 000 000 összesített rekord pontszámot!",
  },
  {
    id: "ach_total_score_2m",
    icon: "🟣",
    title: "Ametiszt Uralkodó",
    desc: "Gyűjts össze legalább 2 000 000 összesített pontot!",
  },
  {
    id: "ach_total_score_5m",
    icon: "💎",
    title: "Multimilliomos Rekorder",
    desc: "Lépd át az 5 000 000 összesített összpontszámot!",
  },
  {
    id: "ach_total_score_10m",
    icon: "👑",
    title: "Tízmilliós Birodalom",
    desc: "Érd el a felfoghatatlan 10 000 000 összesített összpontot!",
  },
  {
    id: "ach_matches_3",
    icon: "🎮",
    title: "Bemelegítő Háromság",
    desc: "Játssz le legalább 3 teljes meccset az arénában!",
  },
  {
    id: "ach_matches_5",
    icon: "🎮",
    title: "Gyakori Vendég",
    desc: "Játssz le legalább 5 teljes mérkőzést!",
  },
  {
    id: "ach_matches_10",
    icon: "⚔️",
    title: "Harcedzett Zúzó",
    desc: "Játssz le legalább 10 teljes mérkőzést!",
  },
  {
    id: "ach_matches_15",
    icon: "⏳",
    title: "Gyakorlott Játékos",
    desc: "Játssz le legalább 15 teljes mérkőzést!",
  },
  {
    id: "ach_matches_20",
    icon: "🔥",
    title: "Elhivatott Zúzó",
    desc: "Játssz le legalább 20 teljes mérkőzést!",
  },
  {
    id: "ach_matches_50",
    icon: "🎖️",
    title: "Crashdown Veterán",
    desc: "Játssz le legalább 50 teljes mérkőzést!",
  },
  {
    id: "ach_matches_75",
    icon: "🛡️",
    title: "Gyémánt Harcos",
    desc: "Játssz le legalább 75 teljes mérkőzést!",
  },
  {
    id: "ach_matches_100",
    icon: "🎖️",
    title: "Százados Veterán",
    desc: "Játssz le legalább 100 teljes mérkőzést!",
  },
  {
    id: "ach_matches_250",
    icon: "⚔️",
    title: "Crashdown Örökös",
    desc: "Játssz le legalább 250 mérkőzést az arénában!",
  },
  {
    id: "ach_matches_500",
    icon: "👑",
    title: "Örökös Legenda",
    desc: "Játssz le félelmetes 500 teljes mérkőzést!",
  },
  {
    id: "ach_matches_750",
    icon: "🌈",
    title: "Prizma Lovag",
    desc: "Játssz le félelmetes 750 teljes mérkőzést!",
  },
  {
    id: "ach_matches_1000",
    icon: "👑",
    title: "Eredendő Császár",
    desc: "Lépd át az 1 000 lejátszott mérkőzés álomhatárát!",
  },
  {
    id: "ach_play_time_1m",
    icon: "🌲",
    title: "Zöld Kezdet",
    desc: "Játssz összesen legalább 1 percet a játékban!",
  },
  {
    id: "ach_play_time_3m",
    icon: "⏱️",
    title: "Három Perces Zúzó",
    desc: "Tölts el legalább 3 percet játékkal!",
  },
  {
    id: "ach_play_time_5m",
    icon: "⏳",
    title: "Kitartó Blokkozó",
    desc: "Játssz összesen legalább 5 percet!",
  },
  {
    id: "ach_play_time_10m",
    icon: "🌅",
    title: "Naplemente Vándor",
    desc: "Érj el legalább 10 perc összesített játékidőt!",
  },
  {
    id: "ach_play_time_15m",
    icon: "⌛",
    title: "Időmester",
    desc: "Érj el legalább 15 perc összesített játékidőt!",
  },
  {
    id: "ach_play_time_20m",
    icon: "🔥",
    title: "Lángoló Idő",
    desc: "Érj el legalább 20 perc összesített játékidőt!",
  },
  {
    id: "ach_play_time_30m",
    icon: "🌌",
    title: "Crashdown Fanatikus",
    desc: "Tölts el legalább 30 percet a játékban!",
  },
  {
    id: "ach_play_time_45m",
    icon: "🌊",
    title: "Mélytengeri Merülés",
    desc: "Érj el legalább 45 perc összesített játékidőt!",
  },
  {
    id: "ach_play_time_1h",
    icon: "⌛",
    title: "Időutazó Mester",
    desc: "Érj el legalább 1 óra (60 perc) játékidőt!",
  },
  {
    id: "ach_play_time_90m",
    icon: "🪐",
    title: "Időhajlító Mester",
    desc: "Érj el legalább 90 perc összesített játékidőt!",
  },
  {
    id: "ach_play_time_2h",
    icon: "🪐",
    title: "Megállíthatatlan",
    desc: "Tölts el legalább 2 órát (120 perc) az arénában!",
  },
  {
    id: "ach_play_time_3h",
    icon: "⚡",
    title: "Három Órás Titán",
    desc: "Érj el félelmetes 3 óra összesített játékidőt!",
  },
  {
    id: "ach_combo_x4",
    icon: "🔥",
    title: "Lángoló Kezek",
    desc: "Érj el legalább 4×-es kombó szorzót játék közben!",
  },
  {
    id: "ach_combo_x5",
    icon: "🔥",
    title: "Kombó Isten",
    desc: "Érd el a maximális 5×-ös kombó csúcsot!",
  },
  {
    id: "ach_lightning_combo_6",
    icon: "⚡",
    title: "Szuperszonikus Kombó",
    desc: "Pörgesd fel a szorzót 6×-os szuperszonikus kombóig!",
  },
  {
    id: "ach_combo_x7",
    icon: "💥",
    title: "Pokoli Láncreakció",
    desc: "Érj el elképesztő 7×-es kombó szorzót!",
  },
  {
    id: "ach_combo_x8",
    icon: "🔥",
    title: "Főnix Kataklizma",
    desc: "Pörgesd fel a szorzót félelmetes 8×-os kombóig!",
  },
  {
    id: "ach_mega_clear_8",
    icon: "💥",
    title: "Mega Törlés",
    desc: "Takaríts el egyetlen kattintással legalább 8 blokkot!",
  },
  {
    id: "ach_hyper_clear_12",
    icon: "⚡",
    title: "Kolosszus Törlés",
    desc: "Takaríts el legalább 12 blokkot egyetlen kattintással!",
  },
  {
    id: "ach_massive_clear_16",
    icon: "💥",
    title: "Kolosszális Pusztítás",
    desc: "Törölj el legalább 16 blokkot egyetlen kattintással!",
  },
  {
    id: "ach_massive_clear_20",
    icon: "⚡",
    title: "Titán Kataklizma",
    desc: "Törölj el legalább 20 blokkot egyetlen kattintással!",
  },
  {
    id: "ach_perfect_clear_board",
    icon: "✨",
    title: "Tiszta Pálya",
    desc: "Pucold le az utolsó szálig az egész táblát (0 blokk)!",
  },
  {
    id: "ach_speed_demon_8",
    icon: "🐆",
    title: "Villám Kéz",
    desc: "Kattints legalább 8 sikeres csoportra 10 másodpercen belül!",
  },
  {
    id: "ach_mode_chaos_win",
    icon: "🌀",
    title: "Káosz Túlélő",
    desc: "Érj el legalább 5 000 pontot a Káosz módban!",
  },
  {
    id: "ach_mode_bomb_win",
    icon: "💣",
    title: "Bombaszakértő",
    desc: "Érj el legalább 5 000 pontot a Robbanás Mániában!",
  },
  {
    id: "ach_mode_time_win",
    icon: "⏳",
    title: "Időfutam Bajnok",
    desc: "Érj el legalább 5 000 pontot az Időhajsza módban!",
  },
  {
    id: "ach_mode_raw_win",
    icon: "🧱",
    title: "Tisztakezű Zseni",
    desc: "Érj el legalább 3 000 pontot a Nyers módban!",
  },
  {
    id: "ach_marathon_15k",
    icon: "🏃",
    title: "Maratonista Zseni",
    desc: "Érj el legalább 15 000 pontot a 3 perces maratoni módban!",
  },
  {
    id: "ach_sprint_5k",
    icon: "🐆",
    title: "Villámfutó Titán",
    desc: "Érj el legalább 5 000 pontot a 30 másodperces módban!",
  },
  {
    id: "ach_sprint_8k",
    icon: "⚡",
    title: "Fénysebességű Sprint",
    desc: "Érj el legalább 8 000 pontot a 30 másodperces módban!",
  },
  {
    id: "ach_all_modes_played",
    icon: "🎯",
    title: "Minden Mód Vándora",
    desc: "Játssz legalább egy meccset mind az 5 játékmódban!",
  },
  {
    id: "ach_all_durations_played",
    icon: "⏱️",
    title: "Időfutár Mester",
    desc: "Játssz legalább egy meccset mind a 4 időkeretben!",
  },
  {
    id: "ach_all_colors_played",
    icon: "🌈",
    title: "Színkavalkád Felfedező",
    desc: "Játssz meccset a 2, 3, 4 és 5 színű beállításban is!",
  },
  {
    id: "ach_master_5_color",
    icon: "🌈",
    title: "Színkavalkád Mester",
    desc: "Érj el legalább 2 000 pontot az 5 színű módban!",
  },
  {
    id: "ach_powerup_tnt_first",
    icon: "💣",
    title: "TNT Beavatás",
    desc: "Robbants fel egy TNT blokkot a pályán!",
  },
  {
    id: "ach_powerup_freeze_first",
    icon: "❄️",
    title: "Jégvarázs Beavatás",
    desc: "Fagyaszd be az időt az Időfagyasztó Jégkockával!",
  },
  {
    id: "ach_powerup_magnet_first",
    icon: "🧲",
    title: "Mágnes Beavatás",
    desc: "Ránts össze egy egész színt a Szuper Mágnessel!",
  },
  {
    id: "ach_powerup_colorbomb_first",
    icon: "✦",
    title: "Szín-kataklizma Beavatás",
    desc: "Tisztíts le egy teljes színt a Szín-bomba használatával!",
  },
  {
    id: "ach_powerup_5",
    icon: "⚡",
    title: "Power-up Kezdő",
    desc: "Aktiválj összesen legalább 5 db power-upot!",
  },
  {
    id: "ach_powerup_10",
    icon: "✨",
    title: "Power-up Gyűjtő",
    desc: "Aktiválj összesen legalább 10 db power-upot!",
  },
  {
    id: "ach_powerup_25",
    icon: "💥",
    title: "Power-up Mester",
    desc: "Aktiválj összesen legalább 25 db power-upot!",
  },
  {
    id: "ach_powerup_total_35",
    icon: "🔮",
    title: "Energia Mágus",
    desc: "Aktiválj összesen legalább 35 db power-upot!",
  },
  {
    id: "ach_powerup_50",
    icon: "👑",
    title: "Power-up Titán",
    desc: "Aktiválj összesen legalább 50 db power-upot!",
  },
  {
    id: "ach_powerup_75",
    icon: "⚡",
    title: "Energia Vihar",
    desc: "Aktiválj összesen legalább 75 db power-upot!",
  },
  {
    id: "ach_powerup_100",
    icon: "🌌",
    title: "Power-up Fanatikus",
    desc: "Aktiválj összesen legalább 100 db power-upot!",
  },
  {
    id: "ach_powerup_150",
    icon: "💥",
    title: "Erőforrás Császár",
    desc: "Aktiválj összesen legalább 150 db power-upot!",
  },
  {
    id: "ach_powerup_250",
    icon: "🌌",
    title: "Power-up Vihar",
    desc: "Aktiválj összesen legalább 250 db power-upot!",
  },
  {
    id: "ach_powerup_500",
    icon: "🌟",
    title: "Power-up Istenség",
    desc: "Aktiválj félelmetes 500 db power-upot!",
  },
  {
    id: "ach_tnt_collector_25",
    icon: "💣",
    title: "TNT Mester",
    desc: "Robbants fel legalább 25 db TNT blokkot a meccseid során!",
  },
  {
    id: "ach_tnt_collector_50",
    icon: "💣",
    title: "Robbantó Hadúr",
    desc: "Robbants fel legalább 50 db TNT blokkot a meccseid során!",
  },
  {
    id: "ach_magnet_collector_25",
    icon: "🧲",
    title: "Mágnes Bűvész",
    desc: "Használj fel legalább 25 db mágnes power-upot!",
  },
  {
    id: "ach_freeze_collector_25",
    icon: "❄️",
    title: "Jégvarázs Mester",
    desc: "Fagyaszd be az időt legalább 25 alkalommal!",
  },
  {
    id: "ach_freeze_collector_50",
    icon: "❄️",
    title: "Abszolút Nulla Fagyasztó",
    desc: "Fagyaszd be az időt legalább 50 alkalommal!",
  },
  {
    id: "ach_doubler_collector_25",
    icon: "⚡",
    title: "Duplázó Szenzáció",
    desc: "Aktiválj legalább 25 db 2× pontduplázó Frenzy-t!",
  },
  {
    id: "ach_colorbomb_collector_25",
    icon: "✦",
    title: "Szín-Kataklizma Bajnok",
    desc: "Tisztíts le pályát 25 db szín-bomba segítségével!",
  },
  {
    id: "ach_inspect_first",
    icon: "🔍",
    title: "Kíváncsi Szemek",
    desc: "Nézd meg egy másik játékos profilját a ranglistán!",
  },
  {
    id: "ach_inspect_profile",
    icon: "🕵️",
    title: "Éjféli Detektív",
    desc: "Böngéssz mások eredményei és trófeái között!",
  },
  {
    id: "ach_inspect_profile_5",
    icon: "🕵️",
    title: "Mester Nyomozó",
    desc: "Tekints meg legalább 5 különböző játékos profilt!",
  },
];



// ==================== PROFILKÉPEK (AVATARS) RENDSZER ====================
// ==================== PROFILKÉPEK (AVATARS) RENDSZER ====================
const PROFILE_AVATARS = [
  { id: "avatar_default", symbol: "👤", name: "Alapértelmezett", achId: null },
  { id: "avatar_ice", symbol: "🧊", name: "Jégkristály", achId: "ach_powerup_freeze_first" },
  { id: "avatar_fire", symbol: "🔥", name: "Főnix Láng", achId: "ach_matches_20" },
  { id: "avatar_bomb", symbol: "💣", name: "Robbanófej", achId: "ach_powerup_tnt_first" },
  { id: "avatar_lightning", symbol: "⚡", name: "Neon Villám", achId: "ach_massive_clear_20" },
  { id: "avatar_magnet", symbol: "🧲", name: "Mágnes", achId: "ach_powerup_magnet_first" },
  { id: "avatar_crown", symbol: "👑", name: "Arany Korona", achId: "ach_score_7500" },
  { id: "avatar_diamond", symbol: "💎", name: "Kozmikus Gyémánt", achId: "ach_score_60k" },
  { id: "avatar_star", symbol: "✨", name: "Szupernóva", achId: "ach_powerup_colorbomb_first" },
  { id: "avatar_rainbow", symbol: "🌈", name: "Szivárvány Prizma", achId: "ach_all_colors_played" },
  { id: "avatar_speed", symbol: "🐆", name: "Villám Párduc", achId: "ach_mega_clear_8" },
  { id: "avatar_galaxy", symbol: "🌌", name: "Kozmosz", achId: "ach_score_35k" },
  { id: "avatar_sunset", symbol: "🌅", name: "Naplemente", achId: "ach_play_time_10m" },
  { id: "avatar_detective", symbol: "🕵️", name: "Detektív", achId: "ach_inspect_profile_5" },
  { id: "avatar_hourglass", symbol: "⏳", name: "Homokóra", achId: "ach_matches_15" },
  { id: "avatar_sword", symbol: "⚔️", name: "Lovagkard", achId: "ach_total_score_50k" },
  { id: "avatar_flame_hand", symbol: "💥", name: "Plazmagömb", achId: "ach_total_score_100k" },
  { id: "avatar_aurora", symbol: "🌌", name: "Sarki Fény", achId: "ach_powerup_250" },
  { id: "avatar_void", symbol: "🔮", name: "Misztikus Void", achId: "ach_score_90k" },
  { id: "avatar_gold_emperor", symbol: "👑", name: "Császári Arany", achId: "ach_score_125k", isSpecial: true },
  { id: "avatar_clock", symbol: "⌛", name: "Örökkévalóság", achId: "ach_play_time_2h" },
  { id: "avatar_century", symbol: "🎖️", name: "Százados", achId: "ach_matches_75" },
  { id: "avatar_meteor", symbol: "🌠", name: "Hullócsillag", achId: "ach_score_200k", isSpecial: true },
  { id: "avatar_galaxy_core", symbol: "🪐", name: "Galaxis Mag", achId: "ach_score_500k", isSpecial: true },
  { id: "avatar_flame_phoenix", symbol: "🔥", name: "Főnix", achId: "ach_combo_x8", isSpecial: true },
  { id: "avatar_legend_crown", symbol: "👑", name: "Örök Korona", achId: "ach_matches_1000", isSpecial: true },
  { id: "avatar_speed_lightning", symbol: "⚡", name: "Villámfutó", achId: "ach_sprint_8k" }
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
// ==================== RANGCÍMEK (TITLES) RENDSZER ====================
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
    isUnlocked: (stats, achSet) => stats.bestScore >= 1500 || stats.totalMatches >= 3,
  },
  {
    id: "title_veteran",
    name: "Veterán Blokktörő",
    desc: "Lépd át az 1 000 pontot egy menetben",
    achId: "ach_score_1000",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_1000"),
  },
  {
    id: "title_champion",
    name: "Crashdown Bajnok",
    desc: "Érj el legalább 5 000 pontot egy meccsben",
    achId: "ach_score_5000",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_5000"),
  },
  {
    id: "title_grandmaster",
    name: "Crashdown Nagymester",
    desc: "Lépd át a 10 000 pontos álomhatárt",
    achId: "ach_score_10k",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_10k"),
  },
  {
    id: "title_legend",
    name: "Galaktikus Legenda",
    desc: "Érj el szédítő 25 000 pontot",
    achId: "ach_score_25k",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_25k"),
  },
  {
    id: "title_cosmic",
    name: "Kozmikus Rekorder",
    desc: "Lépd át az 50 000 pontos csúcsot",
    achId: "ach_score_50k",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_50k"),
  },
  {
    id: "title_combo_x4",
    name: "Lángoló Kezek",
    desc: "Érj el legalább 4×-es kombó szorzót",
    achId: "ach_combo_x4",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_combo_x4"),
  },
  {
    id: "title_combo_mage",
    name: "Kombó Mágus",
    desc: "Érd el a maximális 5×-ös kombó szorzót",
    achId: "ach_combo_x5",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_combo_x5"),
  },
  {
    id: "title_titan",
    name: "Titán Zúzó",
    desc: "Takaríts el legalább 12 blokkot egyetlen kattintással",
    achId: "ach_hyper_clear_12",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_hyper_clear_12"),
  },
  {
    id: "title_speed",
    name: "Villámkezű",
    desc: "Kattints legalább 8 sikeres csoportra 10 másodpercen belül",
    achId: "ach_speed_demon_8",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_speed_demon_8"),
  },
  {
    id: "title_color_master",
    name: "Színmester",
    desc: "Érj el legalább 2 000 pontot az 5 színű mester módban",
    achId: "ach_master_5_color",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_master_5_color"),
  },
  {
    id: "title_demolition",
    name: "Robbantómester",
    desc: "Tisztíts le pályát 25 db szín-bomba segítségével",
    achId: "ach_colorbomb_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_colorbomb_collector_25"),
  },
  {
    id: "title_ice_lord",
    name: "Jégkirály",
    desc: "Fagyaszd be az időt legalább 50 alkalommal",
    achId: "ach_freeze_collector_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_freeze_collector_50"),
  },
  {
    id: "title_magnet_force",
    name: "Mágneses Erőmű",
    desc: "Robbants fel legalább 50 db TNT blokkot",
    achId: "ach_tnt_collector_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_tnt_collector_50"),
  },
  {
    id: "title_perfectionist",
    name: "Tökéletesség Híve",
    desc: "Takarítsd le a teljes táblát 0 blokkra",
    achId: "ach_perfect_clear_board",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_perfect_clear_board"),
  },
  {
    id: "title_time_bender",
    name: "Időhajlító",
    desc: "Játssz legalább 3 percet a játékban",
    achId: "ach_play_time_3m",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_play_time_3m"),
  },
  {
    id: "title_devoted",
    name: "Zúzó Legenda",
    desc: "Érj el legalább 500 000 összpontszámot a profilodon",
    achId: "ach_total_score_500k",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_total_score_500k"),
  },
  {
    id: "title_power_novice",
    name: "Energikus Zúzó",
    desc: "Aktiválj legalább 5 power-upot",
    achId: "ach_powerup_5",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_5"),
  },
  {
    id: "title_power_collector",
    name: "Power-up Mágus",
    desc: "Aktiválj legalább 35 power-upot",
    achId: "ach_powerup_total_35",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_total_35"),
  },
  {
    id: "title_power_master",
    name: "Power-up Varázsló",
    desc: "Aktiválj legalább 50 power-upot",
    achId: "ach_powerup_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_50"),
  },
  {
    id: "title_power_titan",
    name: "Power-up Titán",
    desc: "Aktiválj legalább 75 power-upot",
    achId: "ach_powerup_75",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_75"),
  },
  {
    id: "title_powerup_100",
    name: "Power-up Fanatikus",
    desc: "Aktiválj legalább 150 db power-upot",
    achId: "ach_powerup_150",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_150"),
  },
  {
    id: "title_inspector",
    name: "Profil Kutató",
    desc: "Nézd meg egy másik játékos profilját a ranglistán",
    achId: "ach_inspect_first",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_inspect_first"),
  },
  {
    id: "title_time_1m",
    name: "Bemelegítő Bajnok",
    desc: "Játssz le legalább 3 teljes meccset az arénában",
    achId: "ach_matches_3",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_3"),
  },
  {
    id: "title_time_5m",
    name: "Kitartó Blokkozó",
    desc: "Játssz le legalább 5 teljes mérkőzést",
    achId: "ach_matches_5",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_5"),
  },
  {
    id: "title_time_15m",
    name: "Időúr",
    desc: "Érj el legalább 15 perc összesített játékidőt",
    achId: "ach_play_time_15m",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_play_time_15m"),
  },
  {
    id: "title_time_30m",
    name: "Crashdown Fanatikus",
    desc: "Érj el legalább 30 perc összesített játékidőt",
    achId: "ach_play_time_30m",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_play_time_30m"),
  },
  {
    id: "title_matches_10",
    name: "Harcedzett Zúzó",
    desc: "Játssz le legalább 10 teljes mérkőzést",
    achId: "ach_matches_10",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_10"),
  },
  {
    id: "title_matches_50",
    name: "Crashdown Veterán",
    desc: "Játssz le legalább 50 teljes mérkőzést",
    achId: "ach_matches_50",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_50"),
  },
  {
    id: "title_matches_100",
    name: "Százados Zúzó",
    desc: "Játssz le legalább 100 teljes mérkőzést",
    achId: "ach_matches_100",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_100"),
  },
  {
    id: "title_play_1h",
    name: "Időutazó Mester",
    desc: "Érj el legalább 90 perc összesített játékidőt",
    achId: "ach_play_time_90m",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_play_time_90m"),
  },
  {
    id: "title_chaos_lord",
    name: "Káosz Ura",
    desc: "Érj el legalább 5 000 pontot a Káosz módban",
    achId: "ach_mode_chaos_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_mode_chaos_win"),
  },
  {
    id: "title_bomb_master",
    name: "Mesterbombázó",
    desc: "Érj el legalább 5 000 pontot a Robbanás Mániában",
    achId: "ach_mode_bomb_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_mode_bomb_win"),
  },
  {
    id: "title_time_master",
    name: "Időhajhász",
    desc: "Érj el legalább 5 000 pontot az Időhajsza módban",
    achId: "ach_mode_time_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_mode_time_win"),
  },
  {
    id: "title_purist",
    name: "Tisztakezű Zseni",
    desc: "Érj el legalább 3 000 pontot a Nyers módban",
    achId: "ach_mode_raw_win",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_mode_raw_win"),
  },
  {
    id: "title_tnt_master",
    name: "Bomba Szakértő",
    desc: "Robbants fel legalább 25 db TNT blokkot",
    achId: "ach_tnt_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_tnt_collector_25"),
  },
  {
    id: "title_magnet_expert",
    name: "Mágnes Mester",
    desc: "Használj fel legalább 25 db mágnes power-upot",
    achId: "ach_magnet_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_magnet_collector_25"),
  },
  {
    id: "title_freeze_lord",
    name: "Fagyasztó Úr",
    desc: "Fagyaszd be az időt legalább 25 alkalommal",
    achId: "ach_freeze_collector_25",
    isSpecial: false,
    isUnlocked: (stats, achSet) => achSet.has("ach_freeze_collector_25"),
  },
  {
    id: "title_cosmic_destroyer",
    name: "Kozmikus Pusztító",
    desc: "Érj el legalább 85 000 pontot egy meccsben",
    achId: "ach_score_85k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_85k"),
  },
  {
    id: "title_golden_emperor",
    name: "Halhatatlan Blokkuralkodó",
    desc: "Lépd át a 110 000 pontos álomhatárt egy menetben!",
    achId: "ach_score_110k",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_110k"),
  },
  {
    id: "title_firestorm_god",
    name: "Tűzvihar Istenség",
    desc: "Aktiválj legalább 500 db power-upot!",
    achId: "ach_powerup_500",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_powerup_500"),
  },
  {
    id: "title_infinite_legend",
    name: "Végtelen Krónikás",
    desc: "Játssz le legalább 250 mérkőzést az arénában!",
    achId: "ach_matches_250",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_250"),
  },
  {
    id: "title_millionaire",
    name: "Pontmilliomos",
    desc: "Gyűjts össze összesen legalább 1 000 000 pontot a profilodon!",
    achId: "ach_total_score_1m",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_total_score_1m"),
  },
  {
    id: "title_peak_breaker",
    name: "Abszolút Csúcsdöntő",
    desc: "Érj el legalább 150 000 pontot egy menetben!",
    achId: "ach_score_150k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_150k"),
  },
  {
    id: "title_cosmic_majesty",
    name: "Kozmikus Fenség",
    desc: "Érj el legalább 250 000 pontot egy meccsben!",
    achId: "ach_score_250k",
    specialClass: "title-special-cosmic",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_score_250k"),
  },
  {
    id: "title_supersonic_combo",
    name: "Szuperszonikus Kombó",
    desc: "Pörgesd fel a kombó szorzót legalább 6×-os kombóig!",
    achId: "ach_lightning_combo_6",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_lightning_combo_6"),
  },
  {
    id: "title_colossus_destroyer",
    name: "Kolosszális Pusztító",
    desc: "Törölj el legalább 16 blokkot egyetlen kattintással!",
    achId: "ach_massive_clear_16",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_massive_clear_16"),
  },
  {
    id: "title_mythic_legend",
    name: "Örökös Crashdown Legenda",
    desc: "Játssz le legalább 500 mérkőzést az arénában!",
    achId: "ach_matches_500",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_matches_500"),
  },
  {
    id: "title_multimillionaire",
    name: "Multimilliomos Rekorder",
    desc: "Lépd át az 5 000 000 összesített pontszámot!",
    achId: "ach_total_score_5m",
    specialClass: "title-special-gold",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_total_score_5m"),
  },
  {
    id: "title_sprint_titan",
    name: "Villámfutó Titán",
    desc: "Érj el legalább 5 000 pontot a 30 másodperces villámmódban!",
    achId: "ach_sprint_5k",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_sprint_5k"),
  },
];



let recentSuccessfulClicks = [];
let currentAchievementFilter = "all";

function getUnlockedAchievements(username = null) {
  try {
    const user = username || window.authService?.getCurrentUser()?.displayName;
    if (user) {
      const uKey = "crashdown_achievements_" + user.trim().toLowerCase();
      const userRaw = localStorage.getItem(uKey);
      if (userRaw) return JSON.parse(userRaw);
    }
    const raw = localStorage.getItem("crashdown_achievements");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUserAchievementToProfile(username, achId) {
  if (!username || !achId) return;
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

    if (!p.achievements) p.achievements = [];
    if (!p.achievements.includes(achId)) {
      p.achievements.push(achId);
    }

    if (!Array.isArray(p.unlockedTitles)) p.unlockedTitles = ["title_beginner"];
    if (!Array.isArray(p.unlockedColors)) p.unlockedColors = ["name_white"];
    if (!Array.isArray(p.unlockedAvatars)) p.unlockedAvatars = ["avatar_default"];
    if (!Array.isArray(p.unlockedThemes)) p.unlockedThemes = ["retro", "cyber"];

    if (typeof PROFILE_TITLES !== "undefined") {
      const matchTitle = PROFILE_TITLES.find((t) => t.achId === achId);
      if (matchTitle && !p.unlockedTitles.includes(matchTitle.id)) {
        p.unlockedTitles.push(matchTitle.id);
      }
    }

    const nColorCat = typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];
    const matchColor = nColorCat.find((c) => c.achId === achId);
    if (matchColor && !p.unlockedColors.includes(matchColor.id)) {
      p.unlockedColors.push(matchColor.id);
    }

    if (typeof PROFILE_AVATARS !== "undefined") {
      const matchAvatar = PROFILE_AVATARS.find((a) => a.achId === achId);
      if (matchAvatar && !p.unlockedAvatars.includes(matchAvatar.id)) {
        p.unlockedAvatars.push(matchAvatar.id);
      }
    }

    if (typeof THEMES_CATALOG !== "undefined") {
      const matchTheme = THEMES_CATALOG.find((th) => th.achId === achId);
      if (matchTheme && !p.unlockedThemes.includes(matchTheme.id)) {
        p.unlockedThemes.push(matchTheme.id);
      }
    }

    profiles[username] = p;
    localStorage.setItem(key, JSON.stringify(profiles));

    if (
      window.leaderboardService &&
      typeof window.leaderboardService.savePlayerProfile === "function"
    ) {
      window.leaderboardService.savePlayerProfile(username, p).catch(() => {});
    } else if (
      window.databaseService &&
      typeof window.databaseService.savePlayerProfile === "function"
    ) {
      window.databaseService.savePlayerProfile(username, p).catch(() => {});
    }
  } catch (e) {
    console.error("Hiba az elért mérföldkő mentésekor:", e);
  }
}

function checkAchievement(id) {
  const currentUser = window.authService?.getCurrentUser();
  const username = currentUser?.displayName;
  const list = getUnlockedAchievements(username);
  const set = new Set(list);
  if (set.has(id)) return;

  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (!ach) return;

  set.add(id);
  const updatedList = [...set];

  if (username) {
    const uKey = "crashdown_achievements_" + username.trim().toLowerCase();
    localStorage.setItem(uKey, JSON.stringify(updatedList));
  }
  localStorage.setItem("crashdown_achievements", JSON.stringify(updatedList));

  // Kizárólag az elért mérföldkövet mentjük le, nem generálunk ál-mérkőzést és ál-játékidőt!
  if (username) {
    saveUserAchievementToProfile(username, id);
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
    const durSec = durationSeconds !== undefined && durationSeconds !== null ? parseInt(durationSeconds, 10) : 0;
    const modKey = modifier || "normal";
    const cKey = String(colorCount || "3");

    // Kizárólag valódi lezárult meccs esetén (durSec > 0) rögzítünk statisztikát!
    if (durSec > 0) {
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
      p.achievements = getUnlockedAchievements(username);
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

    // Mérföldkő ellenőrzések CSAKIS valódi lefutott meccs esetén (durSec > 0)
    if (durSec > 0) {
      // Mérkőzésszám mérföldkövek
      if (p.totalMatches >= 1) { checkAchievement("ach_matches_1"); }
      if (p.totalMatches >= 3) { checkAchievement("ach_matches_3"); }
      if (p.totalMatches >= 5) { checkAchievement("ach_matches_5"); checkAchievement("play_5_matches"); }
      if (p.totalMatches >= 10) { checkAchievement("ach_matches_10"); checkAchievement("matches_10"); }
      if (p.totalMatches >= 15) { checkAchievement("ach_matches_15"); }
      if (p.totalMatches >= 20) { checkAchievement("ach_matches_20"); checkAchievement("play_20_matches"); }
      if (p.totalMatches >= 50) { checkAchievement("ach_matches_50"); checkAchievement("matches_50"); }
      if (p.totalMatches >= 75) { checkAchievement("ach_matches_75"); }
      if (p.totalMatches >= 100) { checkAchievement("ach_matches_100"); checkAchievement("matches_100"); }
      if (p.totalMatches >= 250) { checkAchievement("ach_matches_250"); checkAchievement("matches_250"); }
      if (p.totalMatches >= 500) { checkAchievement("ach_matches_500"); checkAchievement("matches_500"); }
      if (p.totalMatches >= 750) { checkAchievement("ach_matches_750"); }
      if (p.totalMatches >= 1000) { checkAchievement("ach_matches_1000"); }

      // Játékidő mérföldkövek
      if (p.totalPlaytimeSeconds >= 15) { checkAchievement("ach_play_time_15s"); }
      if (p.totalPlaytimeSeconds >= 60) { checkAchievement("ach_play_time_1m"); checkAchievement("play_time_1m"); }
      if (p.totalPlaytimeSeconds >= 180) { checkAchievement("ach_play_time_3m"); }
      if (p.totalPlaytimeSeconds >= 300) { checkAchievement("ach_play_time_5m"); checkAchievement("play_time_5m"); }
      if (p.totalPlaytimeSeconds >= 600) { checkAchievement("ach_play_time_10m"); }
      if (p.totalPlaytimeSeconds >= 900) { checkAchievement("ach_play_time_15m"); checkAchievement("play_time_15m"); }
      if (p.totalPlaytimeSeconds >= 1200) { checkAchievement("ach_play_time_20m"); }
      if (p.totalPlaytimeSeconds >= 1800) { checkAchievement("ach_play_time_30m"); checkAchievement("play_time_30m"); }
      if (p.totalPlaytimeSeconds >= 2700) { checkAchievement("ach_play_time_45m"); }
      if (p.totalPlaytimeSeconds >= 3600) { checkAchievement("ach_play_time_1h"); checkAchievement("play_time_1h"); }
      if (p.totalPlaytimeSeconds >= 5400) { checkAchievement("ach_play_time_90m"); }
      if (p.totalPlaytimeSeconds >= 7200) { checkAchievement("ach_play_time_2h"); checkAchievement("play_time_2h"); }
      if (p.totalPlaytimeSeconds >= 10800) { checkAchievement("ach_play_time_3h"); }

      // Összesített pontszám mérföldkövek
      if (p.totalScore >= 50000) { checkAchievement("ach_total_score_50k"); }
      if (p.totalScore >= 100000) { checkAchievement("ach_total_score_100k"); checkAchievement("total_score_100k"); }
      if (p.totalScore >= 250000) { checkAchievement("ach_total_score_250k"); }
      if (p.totalScore >= 500000) { checkAchievement("ach_total_score_500k"); checkAchievement("total_score_500k"); }
      if (p.totalScore >= 1000000) { checkAchievement("ach_total_score_1m"); checkAchievement("total_score_1m"); }
      if (p.totalScore >= 2000000) { checkAchievement("ach_total_score_2m"); }
      if (p.totalScore >= 5000000) { checkAchievement("ach_total_score_5m"); checkAchievement("total_score_5m"); }
      if (p.totalScore >= 10000000) { checkAchievement("ach_total_score_10m"); }

      // Pontszám rekord mérföldkövek
      if (numericScore >= 200) { checkAchievement("ach_score_200"); }
      if (numericScore >= 500) { checkAchievement("ach_score_500"); checkAchievement("first_500"); }
      if (numericScore >= 800) { checkAchievement("ach_score_800"); }
      if (numericScore >= 1000) { checkAchievement("ach_score_1000"); }
      if (numericScore >= 1500) { checkAchievement("ach_score_1500"); checkAchievement("score_1500"); }
      if (numericScore >= 5000) { checkAchievement("ach_score_5000"); checkAchievement("score_5000"); }
      if (numericScore >= 7500) { checkAchievement("ach_score_7500"); }
      if (numericScore >= 10000) { checkAchievement("ach_score_10k"); checkAchievement("score_10k"); }
      if (numericScore >= 15000) { checkAchievement("ach_score_15k"); }
      if (numericScore >= 25000) { checkAchievement("ach_score_25k"); checkAchievement("score_25k"); }
      if (numericScore >= 35000) { checkAchievement("ach_score_35k"); }
      if (numericScore >= 50000) { checkAchievement("ach_score_50k"); checkAchievement("score_50k"); }
      if (numericScore >= 60000) { checkAchievement("ach_score_60k"); }
      if (numericScore >= 75000) { checkAchievement("ach_score_75k"); checkAchievement("score_75k"); }
      if (numericScore >= 85000) { checkAchievement("ach_score_85k"); }
      if (numericScore >= 90000) { checkAchievement("ach_score_90k"); }
      if (numericScore >= 100000) { checkAchievement("ach_score_100k"); checkAchievement("score_100k"); }
      if (numericScore >= 110000) { checkAchievement("ach_score_110k"); }
      if (numericScore >= 125000) { checkAchievement("ach_score_125k"); }
      if (numericScore >= 150000) { checkAchievement("ach_score_150k"); checkAchievement("score_150k"); }
      if (numericScore >= 200000) { checkAchievement("ach_score_200k"); }
      if (numericScore >= 250000) { checkAchievement("ach_score_250k"); checkAchievement("score_250k"); }
      if (numericScore >= 300000) { checkAchievement("ach_score_300k"); }
      if (numericScore >= 500000) { checkAchievement("ach_score_500k"); }

      // Mód szerinti győzelmek
      if (modKey === "chaos" && numericScore >= 5000) {
        checkAchievement("ach_mode_chaos_win");
        checkAchievement("mode_chaos_win");
      }
      if (modKey === "bomb_frenzy" && numericScore >= 5000) {
        checkAchievement("ach_mode_bomb_win");
        checkAchievement("mode_bomb_win");
      }
      if (modKey === "time_rush" && numericScore >= 5000) {
        checkAchievement("ach_mode_time_win");
        checkAchievement("mode_time_win");
      }
      if (modKey === "no_powerups" && numericScore >= 3000) {
        checkAchievement("ach_mode_raw_win");
        checkAchievement("mode_raw_win");
      }

      // Időtartam rekordok
      if (durSec === 30 && numericScore >= 5000) {
        checkAchievement("ach_sprint_5k");
        checkAchievement("sprint_5k");
      }
      if (durSec === 30 && numericScore >= 8000) {
        checkAchievement("ach_sprint_8k");
      }
      if (durSec === 180 && numericScore >= 15000) {
        checkAchievement("ach_marathon_15k");
        checkAchievement("marathon_15k");
      }

      // Változatosság mérföldkövek
      const all5Modes = ["normal", "chaos", "bomb_frenzy", "time_rush", "no_powerups"];
      if (all5Modes.every((m) => p.modifierStats[m] && p.modifierStats[m].matches > 0)) {
        checkAchievement("ach_all_modes_played");
        checkAchievement("all_modes_played");
      }
      const allDurations = ["30", "60", "90", "180"];
      if (allDurations.every((d) => p.durationStats[d] && p.durationStats[d].matches > 0)) {
        checkAchievement("ach_all_durations_played");
        checkAchievement("all_durations_played");
      }
      const allColors = ["2", "3", "4", "5"];
      if (allColors.every((c) => p.modes[c] && p.modes[c].matches > 0)) {
        checkAchievement("ach_all_colors_played");
        checkAchievement("all_colors_played");
      }
      if (cKey === "5" && numericScore >= 2000) {
        checkAchievement("ach_master_5_color");
        checkAchievement("master_5_color");
      }
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

  checkAchievement("ach_powerup_first_any");
  if (count >= 5) { checkAchievement("ach_powerup_5"); checkAchievement("powerup_5"); }
  if (count >= 10) { checkAchievement("ach_powerup_10"); checkAchievement("powerup_10"); }
  if (count >= 25) { checkAchievement("ach_powerup_25"); checkAchievement("powerup_25"); }
  if (count >= 35) { checkAchievement("ach_powerup_total_35"); }
  if (count >= 50) { checkAchievement("ach_powerup_50"); checkAchievement("powerup_50"); }
  if (count >= 75) { checkAchievement("ach_powerup_75"); }
  if (count >= 100) { checkAchievement("ach_powerup_100"); checkAchievement("powerup_100"); }
  if (count >= 150) { checkAchievement("ach_powerup_150"); }
  if (count >= 250) { checkAchievement("ach_powerup_250"); checkAchievement("powerup_250"); }
  if (count >= 500) { checkAchievement("ach_powerup_500"); checkAchievement("powerup_500"); }

  if (type) {
    const key = `crashdown_powerup_${type}_count`;
    let tCount = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, tCount);
    if (type === "tnt") {
      checkAchievement("ach_powerup_tnt_first");
      if (tCount >= 25) { checkAchievement("ach_tnt_collector_25"); checkAchievement("tnt_collector_25"); }
      if (tCount >= 50) { checkAchievement("ach_tnt_collector_50"); }
    }
    if (type === "magnet") {
      checkAchievement("ach_powerup_magnet_first");
      if (tCount >= 25) { checkAchievement("ach_magnet_collector_25"); checkAchievement("magnet_collector_25"); }
    }
    if (type === "freeze") {
      checkAchievement("ach_powerup_freeze_first");
      if (tCount >= 25) { checkAchievement("ach_freeze_collector_25"); checkAchievement("freeze_collector_25"); }
      if (tCount >= 50) { checkAchievement("ach_freeze_collector_50"); }
    }
    if (type === "doubler") {
      if (tCount >= 25) { checkAchievement("ach_doubler_collector_25"); checkAchievement("doubler_collector_25"); }
    }
    if (type === "colorbomb") {
      checkAchievement("ach_powerup_colorbomb_first");
      if (tCount >= 25) { checkAchievement("ach_colorbomb_collector_25"); checkAchievement("colorbomb_collector_25"); }
    }
  }
}

function ensureArray(val, fallback = []) {
  if (!val) return [...fallback];
  if (Array.isArray(val)) return [...val];
  if (typeof val === "object") return Object.values(val);
  return [...fallback];
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
      Array.isArray(onlineProfile.achievements)
    ) {
      profile.achievements = [...onlineProfile.achievements];
    }
    if (onlineProfile.unlockedTitles !== undefined && onlineProfile.unlockedTitles !== null) {
      profile.unlockedTitles = ensureArray(onlineProfile.unlockedTitles, ["title_beginner"]);
    }
    if (onlineProfile.unlockedColors !== undefined && onlineProfile.unlockedColors !== null) {
      profile.unlockedColors = ensureArray(onlineProfile.unlockedColors, ["name_white"]);
    }
    if (onlineProfile.unlockedAvatars !== undefined && onlineProfile.unlockedAvatars !== null) {
      profile.unlockedAvatars = ensureArray(onlineProfile.unlockedAvatars, ["avatar_default"]);
    }
    if (onlineProfile.unlockedThemes !== undefined && onlineProfile.unlockedThemes !== null) {
      profile.unlockedThemes = ensureArray(onlineProfile.unlockedThemes, ["retro", "cyber"]);
    }
    if (onlineProfile.chosenTitle)
      profile.chosenTitle = onlineProfile.chosenTitle;
    if (onlineProfile.chosenAvatar)
      profile.chosenAvatar = onlineProfile.chosenAvatar;
    if (onlineProfile.chosenNameColor)
      profile.chosenNameColor = onlineProfile.chosenNameColor;
    if (onlineProfile.chosenTheme)
      profile.chosenTheme = onlineProfile.chosenTheme;
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

  // Ha nincsenek szinkronizált mérföldkövei, a statisztikái alapján következtessük ki (CSAK HA MÁR JÁTSZOTT!)
  if ((!profile.achievements || profile.achievements.length === 0) && (profile.bestScore > 0 || profile.totalMatches > 0)) {
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
    profile.achievements = getUnlockedAchievements(username);
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

  const nameColorCatalog =
    typeof NAME_COLORS_CATALOG !== "undefined" ? NAME_COLORS_CATALOG : [];

  // Független feloldási listák inicializálása ha még nincsenek definiálva
  if (profile.unlockedTitles === undefined || profile.unlockedTitles === null) {
    const initTitles = ["title_beginner"];
    PROFILE_TITLES.forEach((t) => {
      if (t.id === "title_beginner") return;
      if (t.achId && achSet.has(t.achId)) {
        initTitles.push(t.id);
      } else if (typeof t.isUnlocked === "function" && t.isUnlocked(profile, achSet)) {
        initTitles.push(t.id);
      }
    });
    profile.unlockedTitles = Array.from(new Set(initTitles));
  } else {
    profile.unlockedTitles = ensureArray(profile.unlockedTitles, ["title_beginner"]);
  }
  if (!profile.unlockedTitles.includes("title_beginner")) {
    profile.unlockedTitles.unshift("title_beginner");
  }

  if (profile.unlockedColors === undefined || profile.unlockedColors === null) {
    const initColors = ["name_white"];
    nameColorCatalog.forEach((col) => {
      if (col.id === "name_white") return;
      if (!col.achId || achSet.has(col.achId)) {
        initColors.push(col.id);
      }
    });
    profile.unlockedColors = Array.from(new Set(initColors));
  } else {
    profile.unlockedColors = ensureArray(profile.unlockedColors, ["name_white"]);
  }
  if (!profile.unlockedColors.includes("name_white")) {
    profile.unlockedColors.unshift("name_white");
  }

  if (profile.unlockedAvatars === undefined || profile.unlockedAvatars === null) {
    const initAvatars = ["avatar_default"];
    PROFILE_AVATARS.forEach((av) => {
      if (av.id === "avatar_default") return;
      if (!av.achId || achSet.has(av.achId)) {
        initAvatars.push(av.id);
      }
    });
    profile.unlockedAvatars = Array.from(new Set(initAvatars));
  } else {
    profile.unlockedAvatars = ensureArray(profile.unlockedAvatars, ["avatar_default"]);
  }
  if (!profile.unlockedAvatars.includes("avatar_default")) {
    profile.unlockedAvatars.unshift("avatar_default");
  }

  const themesCatalog = typeof THEMES_CATALOG !== "undefined" ? THEMES_CATALOG : [];
  if (profile.unlockedThemes === undefined || profile.unlockedThemes === null) {
    const initThemes = ["retro", "cyber"];
    themesCatalog.forEach((th) => {
      if (th.id === "retro" || th.id === "cyber") return;
      if (!th.achId || achSet.has(th.achId)) {
        initThemes.push(th.id);
      }
    });
    profile.unlockedThemes = Array.from(new Set(initThemes));
  } else {
    profile.unlockedThemes = ensureArray(profile.unlockedThemes, ["retro", "cyber"]);
  }
  if (!profile.unlockedThemes.includes("retro")) {
    profile.unlockedThemes.unshift("retro");
  }
  if (!profile.unlockedThemes.includes("cyber")) {
    profile.unlockedThemes.push("cyber");
  }

  // Aktív téma
  profile.activeTheme = profile.chosenTheme || (typeof currentTheme !== "undefined" ? currentTheme : "retro");
  if (!profile.unlockedThemes.includes(profile.activeTheme)) {
    profile.activeTheme = "retro";
  }

  // Rangcím meghatározása: kizárólag a független unlockedTitles listától függ
  let activeTitle = null;
  if (profile.chosenTitle && profile.unlockedTitles.includes(profile.chosenTitle)) {
    const foundTitle = PROFILE_TITLES.find((t) => t.id === profile.chosenTitle);
    if (foundTitle) {
      activeTitle = foundTitle;
    }
  }
  profile.activeTitle = activeTitle || PROFILE_TITLES[0];

  // Profilkép (Avatar) meghatározása: kizárólag az unlockedAvatars listától függ
  let activeAvatar = null;
  if (profile.chosenAvatar && profile.unlockedAvatars.includes(profile.chosenAvatar)) {
    const foundAv = PROFILE_AVATARS.find((a) => a.id === profile.chosenAvatar);
    if (foundAv) {
      activeAvatar = foundAv;
    }
  }
  profile.activeAvatar = activeAvatar || PROFILE_AVATARS[0];

  // Név szín meghatározása: kizárólag az unlockedColors listától függ
  let activeNameColor = null;
  if (profile.chosenNameColor && profile.unlockedColors.includes(profile.chosenNameColor)) {
    const foundCol = nameColorCatalog.find(
      (c) => c.id === profile.chosenNameColor,
    );
    if (foundCol) {
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
