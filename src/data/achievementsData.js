/**
 * CRASHDOWN ARCADE - ACHIEVEMENTS & MILESTONES DATA
 * Mérföldkövek és kitüntetések teljes adatbázisa
 */

export const MATCHES_MILESTONES = [
  { count: 1, achId: "ach_matches_1", title: "Első Arénázó", icon: "🎮" },
  { count: 3, achId: "ach_matches_3", title: "Próbázó Arénázó", icon: "🎮" },
  { count: 5, achId: "ach_matches_5", title: "Lelkes Arénázó", icon: "🎮" },
  { count: 10, achId: "ach_matches_10", title: "Rendszeres Arénázó", icon: "⚔️" },
  { count: 15, achId: "ach_matches_15", title: "Állhatatos Arénázó", icon: "⏳" },
  { count: 20, achId: "ach_matches_20", title: "Elszánt Arénázó", icon: "🔥" },
  { count: 30, achId: "ach_matches_30", title: "Törzstag Arénázó", icon: "🛡️" },
  { count: 50, achId: "ach_matches_50", title: "Függő Arénázó", icon: "🎖️" },
  { count: 75, achId: "ach_matches_75", title: "Megtörhetetlen Arénázó", icon: "🛡️" },
  { count: 100, achId: "ach_matches_100", title: "Százados Arénázó", icon: "🎖️" },
  { count: 150, achId: "ach_matches_150", title: "Oszlopos Arénázó", icon: "🏛️" },
  { count: 225, achId: "ach_matches_225", title: "Rendíthetetlen Arénázó", icon: "⚔️" },
  { count: 300, achId: "ach_matches_300", title: "Megállíthatatlan Arénázó", icon: "💥" },
  { count: 400, achId: "ach_matches_400", title: "Eredendő Arénázó", icon: "👑" },
  { count: 500, achId: "ach_matches_500", title: "Végtelen Arénázó", icon: "🌌" },
];

export const ACHIEVEMENTS = [
  {
    id: "ach_first_click",
    icon: "🎯",
    title: "Első Kattintás",
    desc: "Töröld el az első érvényes blokkcsoportodat a pályán!",
  },
  {
    id: "ach_matches_1",
    icon: "🎮",
    title: "Első Arénázó",
    desc: "Játssz le legalább 1 teljes mérkőzést!",
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

  // ==================== PONTSZÁM (EGY MENETBEN) ====================
  { id: "ach_score_500", icon: "🌱", title: "Újonc", desc: "Érj el legalább 500 pontot egy menetben!" },
  { id: "ach_score_1000", icon: "⭐", title: "Kezdő", desc: "Érj el legalább 1 000 pontot egy menetben!" },
  { id: "ach_score_2500", icon: "🥉", title: "Tapasztalt", desc: "Érj el legalább 2 500 pontot egy menetben!" },
  { id: "ach_score_5000", icon: "🥈", title: "Gyakorlott", desc: "Érj el legalább 5 000 pontot egy menetben!" },
  { id: "ach_score_7500", icon: "🥇", title: "Ügyes", desc: "Érj el legalább 7 500 pontot egy menetben!" },
  { id: "ach_score_10k", icon: "⚔️", title: "Harcedzett", desc: "Érj el legalább 10 000 pontot egy menetben!" },
  { id: "ach_score_15k", icon: "🎖️", title: "Veterán", desc: "Érj el legalább 15 000 pontot egy menetben!" },
  { id: "ach_score_20k", icon: "✨", title: "Kiemelkedő", desc: "Érj el legalább 20 000 pontot egy menetben!" },
  { id: "ach_score_25k", icon: "💎", title: "Elit", desc: "Érj el legalább 25 000 pontot egy menetben!" },
  { id: "ach_score_30k", icon: "🏆", title: "Bajnok", desc: "Érj el legalább 30 000 pontot egy menetben!" },
  { id: "ach_score_40k", icon: "🔷", title: "Mester", desc: "Érj el legalább 40 000 pontot egy menetben!" },
  { id: "ach_score_50k", icon: "🔮", title: "Főmester", desc: "Érj el legalább 50 000 pontot egy menetben!" },
  { id: "ach_score_60k", icon: "🛡️", title: "Lovag", desc: "Érj el legalább 60 000 pontot egy menetben!" },
  { id: "ach_score_70k", icon: "🎖️", title: "Parancsnok", desc: "Érj el legalább 70 000 pontot egy menetben!" },
  { id: "ach_score_80k", icon: "👑", title: "Uralkodó", desc: "Érj el legalább 80 000 pontot egy menetben!" },
  { id: "ach_score_90k", icon: "🔱", title: "Császár", desc: "Érj el legalább 90 000 pontot egy menetben!" },
  { id: "ach_score_100k", icon: "⚡", title: "Titán", desc: "Érj el legalább 100 000 pontot egy menetben!" },
  { id: "ach_score_115k", icon: "🗡️", title: "Hős", desc: "Érj el legalább 115 000 pontot egy menetben!" },
  { id: "ach_score_130k", icon: "🪄", title: "Mágus", desc: "Érj el legalább 130 000 pontot egy menetben!" },
  { id: "ach_score_145k", icon: "🛡️", title: "Őrző", desc: "Érj el legalább 145 000 pontot egy menetben!" },
  { id: "ach_score_160k", icon: "🔥", title: "Főnix", desc: "Érj el legalább 160 000 pontot egy menetben!" },
  { id: "ach_score_180k", icon: "🌟", title: "Legenda", desc: "Érj el legalább 180 000 pontot egy menetben!" },
  { id: "ach_score_200k", icon: "🕸️", title: "Sorsszövő", desc: "Érj el legalább 200 000 pontot egy menetben!" },
  { id: "ach_score_225k", icon: "🌌", title: "Kozmikus", desc: "Érj el legalább 225 000 pontot egy menetben!" },
  { id: "ach_score_250k", icon: "🪐", title: "Halhatatlan", desc: "Érj el legalább 250 000 pontot egy menetben!" },
  { id: "ach_score_275k", icon: "☀️", title: "Isten", desc: "Érj el legalább 275 000 pontot egy menetben!" },
  { id: "ach_score_300k", icon: "🗿", title: "Kolosszus", desc: "Érj el legalább 300 000 pontot egy menetben!" },
  { id: "ach_score_350k", icon: "⏳", title: "Korszakalkotó", desc: "Érj el legalább 350 000 pontot egy menetben!" },
  { id: "ach_score_450k", icon: "💥", title: "Világpusztító", desc: "Érj el legalább 450 000 pontot egy menetben!" },
  { id: "ach_score_550k", icon: "♾️", title: "Öröklétű", desc: "Érj el legalább 550 000 pontot egy menetben!" },
  { id: "ach_score_650k", icon: "☄️", title: "Csillaghasító", desc: "Érj el legalább 650 000 pontot egy menetben!" },
  { id: "ach_score_800k", icon: "🌀", title: "Dimenziótörő", desc: "Érj el legalább 800 000 pontot egy menetben!" },
  { id: "ach_score_1m", icon: "👑", title: "Omnipotens", desc: "Érj el legalább 1 000 000 pontot egy menetben!" },

  // ==================== TOTAL SCORE ====================
  { id: "ach_total_score_25k", icon: "🥉", title: "Réz Rekorder", desc: "Gyűjts össze legalább 25 000 pontot a játékaid során!" },
  { id: "ach_total_score_50k", icon: "🥉", title: "Bronz Rekorder", desc: "Gyűjts össze legalább 50 000 pontot a játékaid során!" },
  { id: "ach_total_score_100k", icon: "⛏️", title: "Vas Rekorder", desc: "Gyűjts össze legalább 100 000 pontot a játékaid során!" },
  { id: "ach_total_score_250k", icon: "🥈", title: "Ezüst Rekorder", desc: "Gyűjts össze legalább 250 000 pontot a játékaid során!" },
  { id: "ach_total_score_350k", icon: "🔸", title: "Topáz Rekorder", desc: "Gyűjts össze legalább 350 000 pontot a játékaid során!" },
  { id: "ach_total_score_500k", icon: "🥇", title: "Arany Rekorder", desc: "Gyűjts össze legalább 500 000 pontot a játékaid során!" },
  { id: "ach_total_score_750k", icon: "🟣", title: "Ametiszt Rekorder", desc: "Gyűjts össze legalább 750 000 pontot a játékaid során!" },
  { id: "ach_total_score_1m", icon: "💠", title: "Platina Rekorder", desc: "Gyűjts össze legalább 1 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_1_5m", icon: "🛡️", title: "Titán Rekorder", desc: "Gyűjts össze legalább 1 500 000 pontot a játékaid során!" },
  { id: "ach_total_score_2m", icon: "💎", title: "Gyémánt Rekorder", desc: "Gyűjts össze legalább 2 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_3m", icon: "🟢", title: "Smaragd Rekorder", desc: "Gyűjts össze legalább 3 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_4m", icon: "⚙️", title: "Volfrám Rekorder", desc: "Gyűjts össze legalább 4 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_5m", icon: "🖤", title: "Obszidián Rekorder", desc: "Gyűjts össze legalább 5 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_7_5m", icon: "🔮", title: "Káoszkő Rekorder", desc: "Gyűjts össze legalább 7 500 000 pontot a játékaid során!" },
  { id: "ach_total_score_10m", icon: "☄️", title: "Meteorit Rekorder", desc: "Gyűjts össze legalább 10 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_12_5m", icon: "🌠", title: "Csillagvas Rekorder", desc: "Gyűjts össze legalább 12 500 000 pontot a játékaid során!" },
  { id: "ach_total_score_15m", icon: "⚛️", title: "Kvantumanyag Rekorder", desc: "Gyűjts össze legalább 15 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_20m", icon: "🌌", title: "Sötétanyag Rekorder", desc: "Gyűjts össze legalább 20 000 000 pontot a játékaid során!" },
  { id: "ach_total_score_25m", icon: "💥", title: "Antianyag Rekorder", desc: "Gyűjts össze legalább 25 000 000 pontot a játékaid során!" },

  // ==================== MÉRKŐZÉSSZÁM (MATCHES) ====================
  { id: "ach_matches_3", icon: "🎮", title: "Próbázó Arénázó", desc: "Játssz le legalább 3 teljes mérkőzést!" },
  { id: "ach_matches_5", icon: "🎮", title: "Lelkes Arénázó", desc: "Játssz le legalább 5 teljes mérkőzést!" },
  { id: "ach_matches_10", icon: "⚔️", title: "Rendszeres Arénázó", desc: "Játssz le legalább 10 teljes mérkőzést!" },
  { id: "ach_matches_15", icon: "⏳", title: "Állhatatos Arénázó", desc: "Játssz le legalább 15 teljes mérkőzést!" },
  { id: "ach_matches_20", icon: "🔥", title: "Elszánt Arénázó", desc: "Játssz le legalább 20 teljes mérkőzést!" },
  { id: "ach_matches_30", icon: "🛡️", title: "Törzstag Arénázó", desc: "Játssz le legalább 30 teljes mérkőzést!" },
  { id: "ach_matches_50", icon: "🎖️", title: "Függő Arénázó", desc: "Játssz le legalább 50 teljes mérkőzést!" },
  { id: "ach_matches_75", icon: "🛡️", title: "Megtörhetetlen Arénázó", desc: "Játssz le legalább 75 teljes mérkőzést!" },
  { id: "ach_matches_100", icon: "🎖️", title: "Százados Arénázó", desc: "Játssz le legalább 100 teljes mérkőzést!" },
  { id: "ach_matches_150", icon: "🏛️", title: "Oszlopos Arénázó", desc: "Játssz le legalább 150 teljes mérkőzést!" },
  { id: "ach_matches_225", icon: "⚔️", title: "Rendíthetetlen Arénázó", desc: "Játssz le legalább 225 teljes mérkőzést!" },
  { id: "ach_matches_300", icon: "💥", title: "Megállíthatatlan Arénázó", desc: "Játssz le legalább 300 teljes mérkőzést!" },
  { id: "ach_matches_400", icon: "👑", title: "Eredendő Arénázó", desc: "Játssz le legalább 400 teljes mérkőzést!" },
  { id: "ach_matches_500", icon: "🌌", title: "Végtelen Arénázó", desc: "Játssz le legalább 500 teljes mérkőzést!" },

  // ==================== JÁTÉKIDŐ ====================
  { id: "ach_play_time_1m", icon: "🌲", title: "Zöld Kezdet", desc: "Játssz összesen legalább 1 percet a játékban!" },
  { id: "ach_play_time_3m", icon: "⏱️", title: "Három Perces Zúzó", desc: "Tölts el legalább 3 percet játékkal!" },
  { id: "ach_play_time_5m", icon: "⏳", title: "Kitartó Blokkozó", desc: "Játssz összesen legalább 5 percet!" },
  { id: "ach_play_time_10m", icon: "🌅", title: "Naplemente Vándor", desc: "Érj el legalább 10 perc összesített játékidőt!" },
  { id: "ach_play_time_15m", icon: "⌛", title: "Időmester", desc: "Érj el legalább 15 perc összesített játékidőt!" },
  { id: "ach_play_time_20m", icon: "🔥", title: "Lángoló Idő", desc: "Érj el legalább 20 perc összesített játékidőt!" },
  { id: "ach_play_time_30m", icon: "🌌", title: "Crashdown Fanatikus", desc: "Tölts el legalább 30 percet a játékban!" },
  { id: "ach_play_time_45m", icon: "🌊", title: "Mélytengeri Merülés", desc: "Érj el legalább 45 perc összesített játékidőt!" },
  { id: "ach_play_time_1h", icon: "⌛", title: "Időutazó Mester", desc: "Érj el legalább 1 óra (60 perc) játékidőt!" },
  { id: "ach_play_time_90m", icon: "🪐", title: "Időhajlító Mester", desc: "Érj el legalább 90 perc összesített játékidőt!" },
  { id: "ach_play_time_2h", icon: "🪐", title: "Megállíthatatlan", desc: "Tölts el legalább 2 órát (120 perc) az arénában!" },
  { id: "ach_play_time_3h", icon: "⚡", title: "Három Órás Titán", desc: "Érj el félelmetes 3 óra összesített játékidőt!" },

  // ==================== KOMBÓK & BLOKKTÖRLÉS ====================
  { id: "ach_combo_x4", icon: "🔥", title: "Lángoló Kezek", desc: "Érj el legalább 4×-es kombó szorzót játék közben!" },
  { id: "ach_combo_x5", icon: "🔥", title: "Kombó Isten", desc: "Érd el a maximális 5×-ös kombó csúcsot!" },
  { id: "ach_lightning_combo_6", icon: "⚡", title: "Szuperszonikus Kombó", desc: "Pörgesd fel a szorzót 6×-os szuperszonikus kombóig!" },
  { id: "ach_combo_x7", icon: "💥", title: "Pokoli Láncreakció", desc: "Érj el elképesztő 7×-es kombó szorzót!" },
  { id: "ach_combo_x8", icon: "🔥", title: "Főnix Kataklizma", desc: "Pörgesd fel a szorzót félelmetes 8×-os kombóig!" },
  { id: "ach_mega_clear_8", icon: "💥", title: "Mega Törlés", desc: "Takaríts el egyetlen kattintással legalább 8 blokkot!" },
  { id: "ach_hyper_clear_12", icon: "⚡", title: "Kolosszus Törlés", desc: "Takaríts el legalább 12 blokkot egyetlen kattintással!" },
  { id: "ach_massive_clear_16", icon: "💥", title: "Kolosszális Pusztítás", desc: "Törölj el legalább 16 blokkot egyetlen kattintással!" },
  { id: "ach_massive_clear_20", icon: "⚡", title: "Titán Kataklizma", desc: "Törölj el legalább 20 blokkot egyetlen kattintással!" },
  { id: "ach_perfect_clear_board", icon: "✨", title: "Tiszta Pálya", desc: "Pucold le az utolsó szálig az egész táblát (0 blokk)!" },
  { id: "ach_speed_demon_8", icon: "🐆", title: "Villám Kéz", desc: "Kattints legalább 8 sikeres csoportra 10 másodpercen belül!" },

  // ==================== MÓDOK & BEÁLLÍTÁSOK ====================
  { id: "ach_mode_chaos_win", icon: "🌀", title: "Káosz Túlélő", desc: "Érj el legalább 5 000 pontot a Káosz módban!" },
  { id: "ach_mode_bomb_win", icon: "💣", title: "Bombaszakértő", desc: "Érj el legalább 5 000 pontot a Robbanás Mániában!" },
  { id: "ach_mode_time_win", icon: "⏳", title: "Időfutam Bajnok", desc: "Érj el legalább 5 000 pontot az Időhajsza módban!" },
  { id: "ach_mode_raw_win", icon: "🧱", title: "Tisztakezű Zseni", desc: "Érj el legalább 3 000 pontot a Nyers módban!" },
  { id: "ach_marathon_15k", icon: "🏃", title: "Maratonista Zseni", desc: "Érj el legalább 15 000 pontot a 3 perces maratoni módban!" },
  { id: "ach_sprint_5k", icon: "🐆", title: "Villámfutó Titán", desc: "Érj el legalább 5 000 pontot a 30 másodperces módban!" },
  { id: "ach_sprint_8k", icon: "⚡", title: "Fénysebességű Sprint", desc: "Érj el legalább 8 000 pontot a 30 másodperces módban!" },
  { id: "ach_all_modes_played", icon: "🎯", title: "Minden Mód Vándora", desc: "Játssz legalább egy meccset mind az 5 játékmódban!" },
  { id: "ach_all_durations_played", icon: "⏱️", title: "Időfutár Mester", desc: "Játssz legalább egy meccset mind a 4 időkeretben!" },
  { id: "ach_all_colors_played", icon: "🌈", title: "Színkavalkád Felfedező", desc: "Játssz meccset a 2, 3, 4 és 5 színű beállításban is!" },
  { id: "ach_master_5_color", icon: "🌈", title: "Színkavalkád Mester", desc: "Érj el legalább 2 000 pontot az 5 színű módban!" },

  // ==================== POWER-UPOK ====================
  { id: "ach_powerup_tnt_first", icon: "💣", title: "TNT Beavatás", desc: "Robbants fel egy TNT blokkot a pályán!" },
  { id: "ach_powerup_freeze_first", icon: "❄️", title: "Jégvarázs Beavatás", desc: "Fagyaszd be az időt az Időfagyasztó Jégkockával!" },
  { id: "ach_powerup_magnet_first", icon: "🧲", title: "Mágnes Beavatás", desc: "Ránts össze egy egész színt a Szuper Mágnessel!" },
  { id: "ach_powerup_colorbomb_first", icon: "✦", title: "Szín-kataklizma Beavatás", desc: "Tisztíts le egy teljes színt a Szín-bomba használatával!" },
  { id: "ach_powerup_5", icon: "⚡", title: "Power-up Kezdő", desc: "Aktiválj összesen legalább 5 db power-upot!" },
  { id: "ach_powerup_10", icon: "✨", title: "Power-up Gyűjtő", desc: "Aktiválj összesen legalább 10 db power-upot!" },
  { id: "ach_powerup_25", icon: "💥", title: "Power-up Mester", desc: "Aktiválj összesen legalább 25 db power-upot!" },
  { id: "ach_powerup_total_35", icon: "🔮", title: "Energia Mágus", desc: "Aktiválj összesen legalább 35 db power-upot!" },
  { id: "ach_powerup_50", icon: "👑", title: "Power-up Titán", desc: "Aktiválj összesen legalább 50 db power-upot!" },
  { id: "ach_powerup_75", icon: "⚡", title: "Energia Vihar", desc: "Aktiválj összesen legalább 75 db power-upot!" },
  { id: "ach_powerup_100", icon: "🌌", title: "Power-up Fanatikus", desc: "Aktiválj összesen legalább 100 db power-upot!" },
  { id: "ach_powerup_150", icon: "💥", title: "Erőforrás Császár", desc: "Aktiválj összesen legalább 150 db power-upot!" },
  { id: "ach_powerup_250", icon: "🌌", title: "Power-up Vihar", desc: "Aktiválj összesen legalább 250 db power-upot!" },
  { id: "ach_powerup_500", icon: "🌟", title: "Power-up Istenség", desc: "Aktiválj félelmetes 500 db power-upot!" },

  { id: "ach_tnt_collector_25", icon: "💣", title: "TNT Mester", desc: "Robbants fel legalább 25 db TNT blokkot a meccseid során!" },
  { id: "ach_tnt_collector_50", icon: "💣", title: "Robbantó Hadúr", desc: "Robbants fel legalább 50 db TNT blokkot a meccseid során!" },
  { id: "ach_magnet_collector_25", icon: "🧲", title: "Mágnes Bűvész", desc: "Használj fel legalább 25 db mágnes power-upot!" },
  { id: "ach_freeze_collector_25", icon: "❄️", title: "Jégvarázs Mester", desc: "Fagyaszd be az időt legalább 25 alkalommal!" },
  { id: "ach_freeze_collector_50", icon: "❄️", title: "Abszolút Nulla Fagyasztó", desc: "Fagyaszd be az időt legalább 50 alkalommal!" },
  { id: "ach_doubler_collector_25", icon: "⚡", title: "Duplázó Szenzáció", desc: "Aktiválj legalább 25 db 2× pontduplázó Frenzy-t!" },
  { id: "ach_colorbomb_collector_25", icon: "✦", title: "Szín-Kataklizma Bajnok", desc: "Tisztíts le pályát 25 db szín-bomba segítségével!" },

  // ==================== KÖZÖSSÉG ====================
  { id: "ach_inspect_first", icon: "🔍", title: "Kíváncsi Szemek", desc: "Nézd meg egy másik játékos profilját a ranglistán!" },
  { id: "ach_inspect_profile", icon: "🕵️", title: "Éjféli Detektív", desc: "Böngéssz mások eredményei és trófeái között!" },
  { id: "ach_inspect_profile_5", icon: "🕵️", title: "Mester Nyomozó", desc: "Tekints meg legalább 5 különböző játékos profilt!" },
];

export function cleanSymbolText(str) {
  if (!str) return "";
  return str
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/gu,
      "",
    )
    .replace(/\[speciális\]/gi, "")
    .replace(/\(speciális\)/gi, "")
    .replace(
      /✨|🌟|👑|⚡|🔥|💥|🌌|🌈|💎|🔰|⭐|🏆|🌋|🐆|❄️|🧲|✦|⏱️|⏳|⌛|🎖️|⚔️|🛡️|🔍|🎮|📈|🎯|💣|🌀|🧱|🏃|🪐|🌠|🏛️/g,
      "",
    )
    .trim();
}

export function getAchievementRewards(achId, catalogs = {}) {
  const { avatars = [], titles = [], themes = [], nameColors = [] } = catalogs;
  const rewList = [];

  const linkedAv = avatars.find((av) => av.achId === achId);
  const linkedTitle = titles.find((t) => t.achId === achId);
  const linkedTheme = themes.find((th) => th.achId === achId);
  const linkedColor = nameColors.find((c) => c.achId === achId);

  if (linkedAv) {
    rewList.push({
      type: "avatar",
      symbol: linkedAv.symbol,
      name: linkedAv.name,
      text: `Profilkép: ${linkedAv.symbol}`,
    });
  }
  if (linkedTitle) {
    const cleanTitle = cleanSymbolText(linkedTitle.name);
    const spec = linkedTitle.isMythic
      ? " (mítikus)"
      : linkedTitle.isSpecial
        ? " (speciális)"
        : "";
    rewList.push({
      type: "title",
      titleName: cleanTitle,
      specialClass: linkedTitle.specialClass || "",
      isSpecial: linkedTitle.isSpecial,
      isMythic: linkedTitle.isMythic,
      text: `Rangcím: ${cleanTitle}${spec}`,
    });
  }
  if (linkedTheme) {
    const cleanTheme = cleanSymbolText(linkedTheme.name);
    const spec = linkedTheme.isSpecial ? " (speciális)" : "";
    rewList.push({
      type: "theme",
      themeName: cleanTheme,
      isSpecial: linkedTheme.isSpecial,
      text: `Téma: ${cleanTheme}${spec}`,
    });
  }
  if (linkedColor) {
    const cleanColor = cleanSymbolText(linkedColor.name);
    const spec = linkedColor.isSpecial ? " (speciális)" : "";
    rewList.push({
      type: "color",
      colorName: cleanColor,
      className: linkedColor.className,
      isSpecial: linkedColor.isSpecial,
      text: `Név szín: ${cleanColor}${spec}`,
    });
  }

  return rewList;
}
