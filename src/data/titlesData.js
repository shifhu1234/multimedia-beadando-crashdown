/**
 * CRASHDOWN ARCADE - TITLES DATA CATALOG
 * Rangcímek teljes katalógusa (Egy meccses pontszám, Total score, Mérkőzésszám és Különleges címek)
 */

export const PROFILE_TITLES = [
  {
    id: "title_none",
    name: "Nincs (Alapértelmezett)",
    desc: "Ne jelenjen meg semmilyen rangcím a neved mellett",
    achId: null,
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) => true,
  },
  {
    id: "title_beginner",
    name: "Kezdő Blokktörő",
    desc: "Alapértelmezett kezdő rangcím minden játékosnak",
    achId: null,
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) => true,
  },

  // ==================== PONTSZÁM RANGCÍMEK (EGY MENETBEN) ====================
  // 500 - 30 000: Normál rangcímek
  {
    id: "title_ujonc",
    name: "Újonc",
    desc: "Érj el legalább 500 pontot egy menetben!",
    achId: "ach_score_500",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_500") || Number(stats?.bestScore) >= 500,
  },
  {
    id: "title_kezdo",
    name: "Kezdő",
    desc: "Érj el legalább 1 000 pontot egy menetben!",
    achId: "ach_score_1000",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_1000") || Number(stats?.bestScore) >= 1000,
  },
  {
    id: "title_tapasztalt",
    name: "Tapasztalt",
    desc: "Érj el legalább 2 500 pontot egy menetben!",
    achId: "ach_score_2500",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_2500") || Number(stats?.bestScore) >= 2500,
  },
  {
    id: "title_gyakorlott",
    name: "Gyakorlott",
    desc: "Érj el legalább 5 000 pontot egy menetben!",
    achId: "ach_score_5000",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_5000") || Number(stats?.bestScore) >= 5000,
  },
  {
    id: "title_ugyes",
    name: "Ügyes",
    desc: "Érj el legalább 7 500 pontot egy menetben!",
    achId: "ach_score_7500",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_7500") || Number(stats?.bestScore) >= 7500,
  },
  {
    id: "title_harcedzett",
    name: "Harcedzett",
    desc: "Érj el legalább 10 000 pontot egy menetben!",
    achId: "ach_score_10k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_10k") || Number(stats?.bestScore) >= 10000,
  },
  {
    id: "title_veteran",
    name: "Veterán",
    desc: "Érj el legalább 15 000 pontot egy menetben!",
    achId: "ach_score_15k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_15k") || Number(stats?.bestScore) >= 15000,
  },
  {
    id: "title_kiemelkedo",
    name: "Kiemelkedő",
    desc: "Érj el legalább 20 000 pontot egy menetben!",
    achId: "ach_score_20k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_20k") || Number(stats?.bestScore) >= 2000,
  },
  {
    id: "title_elit",
    name: "Elit",
    desc: "Érj el legalább 25 000 pontot egy menetben!",
    achId: "ach_score_25k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_25k") || Number(stats?.bestScore) >= 25000,
  },
  {
    id: "title_bajnok",
    name: "Bajnok",
    desc: "Érj el legalább 30 000 pontot egy menetben!",
    achId: "ach_score_30k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_30k") || Number(stats?.bestScore) >= 30000,
  },

  // 40 000 - 90 000: Mestertől felfelé egyszínű színek
  {
    id: "title_mester",
    name: "Mester",
    desc: "Érj el legalább 40 000 pontot egy menetben!",
    achId: "ach_score_40k",
    specialClass: "title-solid-master",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_40k") || Number(stats?.bestScore) >= 40000,
  },
  {
    id: "title_fomester",
    name: "Főmester",
    desc: "Érj el legalább 50 000 pontot egy menetben!",
    achId: "ach_score_50k",
    specialClass: "title-solid-grandmaster",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_50k") || Number(stats?.bestScore) >= 50000,
  },
  {
    id: "title_lovag",
    name: "Lovag",
    desc: "Érj el legalább 60 000 pontot egy menetben!",
    achId: "ach_score_60k",
    specialClass: "title-solid-knight",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_60k") || Number(stats?.bestScore) >= 60000,
  },
  {
    id: "title_parancsnok",
    name: "Parancsnok",
    desc: "Érj el legalább 70 000 pontot egy menetben!",
    achId: "ach_score_70k",
    specialClass: "title-solid-commander",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_70k") || Number(stats?.bestScore) >= 70000,
  },
  {
    id: "title_uralkodo",
    name: "Uralkodó",
    desc: "Érj el legalább 80 000 pontot egy menetben!",
    achId: "ach_score_80k",
    specialClass: "title-solid-ruler",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_80k") || Number(stats?.bestScore) >= 80000,
  },
  {
    id: "title_csaszar",
    name: "Császár",
    desc: "Érj el legalább 90 000 pontot egy menetben!",
    achId: "ach_score_90k",
    specialClass: "title-solid-emperor",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_90k") || Number(stats?.bestScore) >= 90000,
  },

  // 100 000 - 350 000: Titántól felfelé speciális 2 színű gradientek
  {
    id: "title_titan",
    name: "Titán",
    desc: "Érj el legalább 100 000 pontot egy menetben!",
    achId: "ach_score_100k",
    specialClass: "title-gradient-titan",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_100k") || Number(stats?.bestScore) >= 100000,
  },
  {
    id: "title_hos",
    name: "Hős",
    desc: "Érj el legalább 115 000 pontot egy menetben!",
    achId: "ach_score_115k",
    specialClass: "title-gradient-hero",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_115k") || Number(stats?.bestScore) >= 115000,
  },
  {
    id: "title_magus",
    name: "Mágus",
    desc: "Érj el legalább 130 000 pontot egy menetben!",
    achId: "ach_score_130k",
    specialClass: "title-gradient-mage",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_130k") || Number(stats?.bestScore) >= 130000,
  },
  {
    id: "title_orzo",
    name: "Őrző",
    desc: "Érj el legalább 145 000 pontot egy menetben!",
    achId: "ach_score_145k",
    specialClass: "title-gradient-guardian",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_145k") || Number(stats?.bestScore) >= 145000,
  },
  {
    id: "title_fonix",
    name: "Főnix",
    desc: "Érj el legalább 160 000 pontot egy menetben!",
    achId: "ach_score_160k",
    specialClass: "title-gradient-phoenix",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_160k") || Number(stats?.bestScore) >= 160000,
  },
  {
    id: "title_legenda",
    name: "Legenda",
    desc: "Érj el legalább 180 000 pontot egy menetben!",
    achId: "ach_score_180k",
    specialClass: "title-gradient-legend",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_180k") || Number(stats?.bestScore) >= 180000,
  },
  {
    id: "title_sorsszovo",
    name: "Sorsszövő",
    desc: "Érj el legalább 200 000 pontot egy menetben!",
    achId: "ach_score_200k",
    specialClass: "title-gradient-fateweaver",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_200k") || Number(stats?.bestScore) >= 200000,
  },
  {
    id: "title_kozmikus",
    name: "Kozmikus",
    desc: "Érj el legalább 225 000 pontot egy menetben!",
    achId: "ach_score_225k",
    specialClass: "title-gradient-cosmic",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_225k") || Number(stats?.bestScore) >= 225000,
  },
  {
    id: "title_halhatatlan",
    name: "Halhatatlan",
    desc: "Érj el legalább 250 000 pontot egy menetben!",
    achId: "ach_score_250k",
    specialClass: "title-gradient-immortal",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_250k") || Number(stats?.bestScore) >= 250000,
  },
  {
    id: "title_isten",
    name: "Isten",
    desc: "Érj el legalább 275 000 pontot egy menetben!",
    achId: "ach_score_275k",
    specialClass: "title-gradient-god",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_275k") || Number(stats?.bestScore) >= 275000,
  },
  {
    id: "title_kolosszus",
    name: "Kolosszus",
    desc: "Érj el legalább 300 000 pontot egy menetben!",
    achId: "ach_score_300k",
    specialClass: "title-gradient-colossus",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_300k") || Number(stats?.bestScore) >= 300000,
  },
  {
    id: "title_korszakalkoto",
    name: "Korszakalkotó",
    desc: "Érj el legalább 350 000 pontot egy menetben!",
    achId: "ach_score_350k",
    specialClass: "title-gradient-epoch",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_350k") || Number(stats?.bestScore) >= 350000,
  },

  // 450 000 - 1 000 000: Világpusztítótól felfelé MÍTIKUS többszínű gradiens
  {
    id: "title_worldbreaker",
    name: "Világpusztító",
    desc: "Érj el legalább 450 000 pontot egy menetben!",
    achId: "ach_score_450k",
    specialClass: "title-mythic-worldbreaker",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_450k") || Number(stats?.bestScore) >= 450000,
  },
  {
    id: "title_eternal",
    name: "Öröklétű",
    desc: "Érj el legalább 550 000 pontot egy menetben!",
    achId: "ach_score_550k",
    specialClass: "title-mythic-eternal",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_550k") || Number(stats?.bestScore) >= 550000,
  },
  {
    id: "title_starcleaver",
    name: "Csillaghasító",
    desc: "Érj el legalább 650 000 pontot egy menetben!",
    achId: "ach_score_650k",
    specialClass: "title-mythic-starcleaver",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_650k") || Number(stats?.bestScore) >= 650000,
  },
  {
    id: "title_dimension",
    name: "Dimenziótörő",
    desc: "Érj el legalább 800 000 pontot egy menetben!",
    achId: "ach_score_800k",
    specialClass: "title-mythic-dimension",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_800k") || Number(stats?.bestScore) >= 80000,
  },
  {
    id: "title_omnipotent",
    name: "Omnipotens",
    desc: "Érj el legalább 1 000 000 pontot egy menetben!",
    achId: "ach_score_1m",
    specialClass: "title-mythic-omnipotent",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_score_1m") || Number(stats?.bestScore) >= 1000000,
  },

  // ==================== TOTAL SCORE RANGCÍMEK ====================
  // 25k - 100k: Normál
  {
    id: "title_copper_rec",
    name: "Réz Rekorder",
    desc: "Gyűjts össze legalább 25 000 pontot a játékaid során!",
    achId: "ach_total_score_25k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_25k") || Number(stats?.totalScore) >= 25000,
  },
  {
    id: "title_bronze_rec",
    name: "Bronz Rekorder",
    desc: "Gyűjts össze legalább 50 000 pontot a játékaid során!",
    achId: "ach_total_score_50k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_50k") || Number(stats?.totalScore) >= 50000,
  },
  {
    id: "title_iron_rec",
    name: "Vas Rekorder",
    desc: "Gyűjts össze legalább 100 000 pontot a játékaid során!",
    achId: "ach_total_score_100k",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_100k") || Number(stats?.totalScore) >= 100000,
  },

  // 250k - 1M: Egyszínű színek
  {
    id: "title_silver_rec",
    name: "Ezüst Rekorder",
    desc: "Gyűjts össze legalább 250 000 pontot a játékaid során!",
    achId: "ach_total_score_250k",
    specialClass: "title-solid-silver",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_250k") || Number(stats?.totalScore) >= 250000,
  },
  {
    id: "title_topaz_rec",
    name: "Topáz Rekorder",
    desc: "Gyűjts össze legalább 350 000 pontot a játékaid során!",
    achId: "ach_total_score_350k",
    specialClass: "title-solid-topaz",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_350k") || Number(stats?.totalScore) >= 350000,
  },
  {
    id: "title_gold_rec",
    name: "Arany Rekorder",
    desc: "Gyűjts össze legalább 500 000 pontot a játékaid során!",
    achId: "ach_total_score_500k",
    specialClass: "title-solid-gold-rec",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_500k") || Number(stats?.totalScore) >= 500000,
  },
  {
    id: "title_amethyst_rec",
    name: "Ametiszt Rekorder",
    desc: "Gyűjts össze legalább 750 000 pontot a játékaid során!",
    achId: "ach_total_score_750k",
    specialClass: "title-solid-amethyst",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_750k") || Number(stats?.totalScore) >= 750000,
  },
  {
    id: "title_platinum_rec",
    name: "Platina Rekorder",
    desc: "Gyűjts össze legalább 1 000 000 pontot a játékaid során!",
    achId: "ach_total_score_1m",
    specialClass: "title-solid-platinum",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_1m") || Number(stats?.totalScore) >= 1000000,
  },

  // 1.5M - 7.5M: Speciális 2 színű gradientek
  {
    id: "title_titan_rec",
    name: "Titán Rekorder",
    desc: "Gyűjts össze legalább 1 500 000 pontot a játékaid során!",
    achId: "ach_total_score_1_5m",
    specialClass: "title-gradient-titan-rec",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_1_5m") ||
      Number(stats?.totalScore) >= 1500000,
  },
  {
    id: "title_diamond_rec",
    name: "Gyémánt Rekorder",
    desc: "Gyűjts össze legalább 2 000 000 pontot a játékaid során!",
    achId: "ach_total_score_2m",
    specialClass: "title-gradient-diamond",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_2m") || Number(stats?.totalScore) >= 2000000,
  },
  {
    id: "title_emerald_rec",
    name: "Smaragd Rekorder",
    desc: "Gyűjts össze legalább 3 000 000 pontot a játékaid során!",
    achId: "ach_total_score_3m",
    specialClass: "title-gradient-emerald",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_3m") || Number(stats?.totalScore) >= 3000000,
  },
  {
    id: "title_tungsten_rec",
    name: "Volfrám Rekorder",
    desc: "Gyűjts össze legalább 4 000 000 pontot a játékaid során!",
    achId: "ach_total_score_4m",
    specialClass: "title-gradient-tungsten",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_4m") || Number(stats?.totalScore) >= 4000000,
  },
  {
    id: "title_obsidian_rec",
    name: "Obszidián Rekorder",
    desc: "Gyűjts össze legalább 5 000 000 pontot a játékaid során!",
    achId: "ach_total_score_5m",
    specialClass: "title-gradient-obsidian",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_5m") || Number(stats?.totalScore) >= 5000000,
  },
  {
    id: "title_chaosstone_rec",
    name: "Káoszkő Rekorder",
    desc: "Gyűjts össze legalább 7 500 000 pontot a játékaid során!",
    achId: "ach_total_score_7_5m",
    specialClass: "title-gradient-chaosstone",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_7_5m") ||
      Number(stats?.totalScore) >= 7500000,
  },

  // 10M - 25M: Mítikus többszínű gradientek
  {
    id: "title_meteorite",
    name: "Meteorit Rekorder",
    desc: "Gyűjts össze legalább 10 000 000 pontot a játékaid során!",
    achId: "ach_total_score_10m",
    specialClass: "title-mythic-meteorite",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_10m") ||
      Number(stats?.totalScore) >= 10000000,
  },
  {
    id: "title_stariron",
    name: "Csillagvas Rekorder",
    desc: "Gyűjts össze legalább 12 500 000 pontot a játékaid során!",
    achId: "ach_total_score_12_5m",
    specialClass: "title-mythic-stariron",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_12_5m") ||
      Number(stats?.totalScore) >= 12500000,
  },
  {
    id: "title_quantum",
    name: "Kvantumanyag Rekorder",
    desc: "Gyűjts össze legalább 15 000 000 pontot a játékaid során!",
    achId: "ach_total_score_15m",
    specialClass: "title-mythic-quantum",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_15m") ||
      Number(stats?.totalScore) >= 15000000,
  },
  {
    id: "title_darkmatter",
    name: "Sötétanyag Rekorder",
    desc: "Gyűjts össze legalább 20 000 000 pontot a játékaid során!",
    achId: "ach_total_score_20m",
    specialClass: "title-mythic-darkmatter",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_20m") ||
      Number(stats?.totalScore) >= 20000000,
  },
  {
    id: "title_antimatter",
    name: "Antianyag Rekorder",
    desc: "Gyűjts össze legalább 25 000 000 pontot a játékaid során!",
    achId: "ach_total_score_25m",
    specialClass: "title-mythic-antimatter",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_total_score_25m") ||
      Number(stats?.totalScore) >= 25000000,
  },

  // ==================== MÉRKŐZÉSSZÁM (MATCHES) RANGCÍMEK ====================
  // 1 - 5 meccs: Normál
  {
    id: "title_match_1",
    name: "Első Arénázó",
    desc: "Játssz le legalább 1 teljes mérkőzést!",
    achId: "ach_matches_1",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_1") || Number(stats?.totalMatches) >= 1,
  },
  {
    id: "title_match_3",
    name: "Próbázó Arénázó",
    desc: "Játssz le legalább 3 teljes mérkőzést!",
    achId: "ach_matches_3",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_3") || Number(stats?.totalMatches) >= 3,
  },
  {
    id: "title_match_5",
    name: "Lelkes Arénázó",
    desc: "Játssz le legalább 5 teljes mérkőzést!",
    achId: "ach_matches_5",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_5") || Number(stats?.totalMatches) >= 5,
  },

  // 10 - 30 meccs: Rendszeressel kezdve sima színek
  {
    id: "title_match_10",
    name: "Rendszeres Arénázó",
    desc: "Játssz le legalább 10 teljes mérkőzést!",
    achId: "ach_matches_10",
    specialClass: "title-solid-regular-arena",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_10") || Number(stats?.totalMatches) >= 10,
  },
  {
    id: "title_match_15",
    name: "Állhatatos Arénázó",
    desc: "Játssz le legalább 15 teljes mérkőzést!",
    achId: "ach_matches_15",
    specialClass: "title-solid-steadfast-arena",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_15") || Number(stats?.totalMatches) >= 15,
  },
  {
    id: "title_match_20",
    name: "Elszánt Arénázó",
    desc: "Játssz le legalább 20 teljes mérkőzést!",
    achId: "ach_matches_20",
    specialClass: "title-solid-resolute-arena",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_20") || Number(stats?.totalMatches) >= 20,
  },
  {
    id: "title_match_30",
    name: "Törzstag Arénázó",
    desc: "Játssz le legalább 30 teljes mérkőzést!",
    achId: "ach_matches_30",
    specialClass: "title-solid-core-arena",
    isSpecial: false,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_30") || Number(stats?.totalMatches) >= 30,
  },

  // 50 - 150 meccs: Függővel kezdve speciális
  {
    id: "title_match_50",
    name: "Függő Arénázó",
    desc: "Játssz le legalább 50 teljes mérkőzést!",
    achId: "ach_matches_50",
    specialClass: "title-gradient-addict-arena",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_50") || Number(stats?.totalMatches) >= 50,
  },
  {
    id: "title_match_75",
    name: "Megtörhetetlen Arénázó",
    desc: "Játssz le legalább 75 teljes mérkőzést!",
    achId: "ach_matches_75",
    specialClass: "title-gradient-unbreakable-arena",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_75") || Number(stats?.totalMatches) >= 75,
  },
  {
    id: "title_match_100",
    name: "Százados Arénázó",
    desc: "Játssz le legalább 100 teljes mérkőzést!",
    achId: "ach_matches_100",
    specialClass: "title-gradient-centurion-arena",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_100") || Number(stats?.totalMatches) >= 100,
  },
  {
    id: "title_match_150",
    name: "Oszlopos Arénázó",
    desc: "Játssz le legalább 150 teljes mérkőzést!",
    achId: "ach_matches_150",
    specialClass: "title-gradient-pillar-arena",
    isSpecial: true,
    isMythic: false,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_150") || Number(stats?.totalMatches) >= 150,
  },

  // 225 - 500 meccs: Rendíthetetlennel indítva MÍTIKUS
  {
    id: "title_match_225",
    name: "Rendíthetetlen Arénázó",
    desc: "Játssz le legalább 225 teljes mérkőzést!",
    achId: "ach_matches_225",
    specialClass: "title-mythic-unwavering-arena",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_225") || Number(stats?.totalMatches) >= 225,
  },
  {
    id: "title_match_300",
    name: "Megállíthatatlan Arénázó",
    desc: "Játssz le legalább 300 teljes mérkőzést!",
    achId: "ach_matches_300",
    specialClass: "title-mythic-unstoppable-arena",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_300") || Number(stats?.totalMatches) >= 300,
  },
  {
    id: "title_match_400",
    name: "Eredendő Arénázó",
    desc: "Játssz le legalább 400 teljes mérkőzést!",
    achId: "ach_matches_400",
    specialClass: "title-mythic-primordial-arena",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_400") || Number(stats?.totalMatches) >= 400,
  },
  {
    id: "title_match_500",
    name: "Végtelen Arénázó",
    desc: "Játssz le legalább 500 teljes mérkőzést!",
    achId: "ach_matches_500",
    specialClass: "title-mythic-infinite-arena",
    isSpecial: true,
    isMythic: true,
    isUnlocked: (stats, achSet) =>
      achSet.has("ach_matches_500") || Number(stats?.totalMatches) >= 500,
  },

  // ==================== KÜLÖNLEGES JÁTÉKMÓD ÉS KOMBÓ RANGCÍMEK ====================
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
    desc: "Érj el legalább 5 000 pontot a Káosz módban!",
    achId: "ach_chaos_5k",
    specialClass: "title-theme-chaos",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_chaos_5k"),
  },
  {
    id: "title_bomb_master",
    name: "Mesterbombázó",
    desc: "Érj el legalább 5 000 pontot a Robbanás Mánia módban!",
    achId: "ach_bomb_5k",
    specialClass: "title-theme-blast",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_bomb_5k"),
  },
  {
    id: "title_time_master",
    name: "Időhajhász",
    desc: "Érj el legalább 5 000 pontot az Időhajsza módban!",
    achId: "ach_timerush_5k",
    specialClass: "title-theme-electric",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_timerush_5k"),
  },
  {
    id: "title_purist",
    name: "Tisztakezű Zseni",
    desc: "Érj el legalább 5 000 pontot a Nyers módban!",
    achId: "ach_raw_5k",
    specialClass: "title-theme-emerald",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_raw_5k"),
  },
  {
    id: "title_tnt_master",
    name: "Bomba Szakértő",
    desc: "Robbants fel legalább 25 db TNT blokkot",
    achId: "ach_tnt_collector_25",
    specialClass: "title-theme-blast",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_tnt_collector_25"),
  },
  {
    id: "title_magnet_expert",
    name: "Mágnes Mester",
    desc: "Használj fel legalább 25 db mágnes power-upot",
    achId: "ach_magnet_collector_25",
    specialClass: "title-theme-magnet",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_magnet_collector_25"),
  },
  {
    id: "title_freeze_lord",
    name: "Fagyasztó Úr",
    desc: "Fagyaszd be az időt legalább 25 alkalommal",
    achId: "ach_freeze_collector_25",
    specialClass: "title-theme-frost",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_freeze_collector_25"),
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
    id: "title_supersonic_combo",
    name: "Szuperszonikus Zúzó",
    desc: "Törölj el legalább 18 blokkot egyetlen kattintással!",
    achId: "ach_clear_blocks_18",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_clear_blocks_18"),
  },
  {
    id: "title_colossus_destroyer",
    name: "Kolosszális Pusztító",
    desc: "Törölj el legalább 16 blokkot egyetlen kattintással!",
    achId: "ach_clear_blocks_16",
    specialClass: "title-special-rainbow",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_clear_blocks_16"),
  },
  {
    id: "title_sprint_titan",
    name: "Villám Kéz Mester",
    desc: "Kattints legalább 12 sikeres blokkcsoportra 10 másodpercen belül!",
    achId: "ach_speed_demon_12",
    specialClass: "title-special-flame",
    isSpecial: true,
    isUnlocked: (stats, achSet) => achSet.has("ach_speed_demon_12"),
  },
];
