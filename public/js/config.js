/* ================================================================
   CRASHDOWN ARCADE - CONFIGURATION & CONSTANTS
   ================================================================ */

const LOGICAL_SIZE = 440;
const sorok = 10;
const oszlopok = 10;
const negyzetMeret = LOGICAL_SIZE / oszlopok; // 44px

// 9 Színtéma palettái
const THEME_PALETTES = {
    retro:  ['#ef4444', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'],
    cyber:  ['#FF2E4C', '#22C55E', '#FACC15', '#3B82F6', '#D946EF'],
    candy:  ['#fb7185', '#34d399', '#fde047', '#38bdf8', '#c084fc'],
    space:  ['#f43f5e', '#10b981', '#eab308', '#4f46e5', '#ec4899'],
    sunset: ['#f43f5e', '#fb923c', '#facc15', '#a855f7', '#6366f1'],
    forest: ['#10b981', '#84cc16', '#14b8a6', '#059669', '#0284c7'],
    lava:   ['#dc2626', '#ea580c', '#f59e0b', '#7f1d1d', '#f97316'],
    noir:   ['#e2e8f0', '#94a3b8', '#64748b', '#475569', '#334155'],
    ocean:  ['#06b6d4', '#0284c7', '#3b82f6', '#0d9488', '#6366f1']
};

// Téma katalógus az unlockoláshoz (Magyarosított elnevezésekkel)
const THEMES_CATALOG = [
    { id: 'retro', name: 'Retro Játékterem', achId: null },
    { id: 'cyber', name: 'Kiber Neon', achId: null },
    { id: 'candy', name: 'Cukorka Pop', achId: 'first_500' },
    { id: 'space', name: 'Mélyűr Odüsszeia', achId: 'score_1500' },
    { id: 'sunset', name: 'Naplemente Szintetizátor', achId: 'powerup_10' },
    { id: 'forest', name: 'Smaragd Vadon', achId: 'play_time_5m' },
    { id: 'lava', name: 'Tűzhányó Láva', achId: 'powerup_25' },
    { id: 'noir', name: 'Éjféli Noir', achId: 'inspect_profile' },
    { id: 'ocean', name: 'Mélytengeri Misztikum', achId: 'score_5000' }
];

// Játékmódok / Modifierek definíciói
const GAME_MODIFIERS = {
    normal: { id: 'normal', name: 'Normál', badge: 'Normál', desc: 'Klasszikus Crashdown szabályok kiegyensúlyozott power-upokkal' },
    no_powerups: { id: 'no_powerups', name: 'Nyers Mód', badge: 'Nyers', desc: 'Csak színtiszta blokktörés, power-upok nélkül' },
    chaos: { id: 'chaos', name: 'Káosz Mód', badge: 'Káosz', desc: 'A power-upok sokkal gyakrabban bukkannak fel a pályán' },
    time_rush: { id: 'time_rush', name: 'Időhajsza', badge: 'Időhajsza', desc: 'Gyakori +Időbónusz és 2× Duplázó blokkok a maximális tempóért' },
    bomb_frenzy: { id: 'bomb_frenzy', name: 'Robbanás Mánia', badge: 'Robbanás', desc: 'Több TNT robbanófej, szuper mágnes és szín-bomba a hatalmas pusztításért' }
};

// 3D plasztikus színek és árnyalatok a vászon kirajzolásához
const COLOR_STYLES = {
    // Cyber & Standard
    '#FF2E4C': { top: '#f87171', bottom: '#dc2626', border: '#fca5a5' },
    '#22C55E': { top: '#34d399', bottom: '#059669', border: '#86efac' },
    '#FACC15': { top: '#fbbf24', bottom: '#d97706', border: '#fde68a' },
    '#3B82F6': { top: '#60a5fa', bottom: '#2563eb', border: '#bfdbfe' },
    '#D946EF': { top: '#c084fc', bottom: '#7c3aed', border: '#e9d5ff' },

    // Candy Pop & Retro & Space extra színek
    '#fb7185': { top: '#fda4af', bottom: '#e11d48', border: '#ffe4e6' },
    '#34d399': { top: '#6ee7b7', bottom: '#059669', border: '#a7f3d0' },
    '#fde047': { top: '#fef08a', bottom: '#eab308', border: '#fef9c3' },
    '#38bdf8': { top: '#7dd3fc', bottom: '#0284c7', border: '#e0f2fe' },
    '#c084fc': { top: '#d8b4fe', bottom: '#9333ea', border: '#f3e8ff' },
    '#ef4444': { top: '#f87171', bottom: '#dc2626', border: '#fca5a5' },
    '#10b981': { top: '#34d399', bottom: '#047857', border: '#a7f3d0' },
    '#f59e0b': { top: '#fbbf24', bottom: '#d97706', border: '#fde68a' },
    '#06b6d4': { top: '#22d3ee', bottom: '#0891b2', border: '#a5f3fc' },
    '#8b5cf6': { top: '#a78bfa', bottom: '#6d28d9', border: '#ddd6fe' },
    '#f43f5e': { top: '#fb7185', bottom: '#be123c', border: '#ffe4e6' },
    '#eab308': { top: '#fde047', bottom: '#ca8a04', border: '#fef08a' },
    '#4f46e5': { top: '#818cf8', bottom: '#3730a3', border: '#c7d2fe' },
    '#ec4899': { top: '#f472b6', bottom: '#be185d', border: '#fbcfe8' },

    // Sunset, Forest, Lava, Noir, Ocean új színek
    '#fb923c': { top: '#fdba74', bottom: '#ea580c', border: '#ffedd5' },
    '#facc15': { top: '#fde047', bottom: '#ca8a04', border: '#fef08a' },
    '#a855f7': { top: '#c084fc', bottom: '#7e22ce', border: '#f3e8ff' },
    '#84cc16': { top: '#a3e635', bottom: '#4d7c0f', border: '#ecfccb' },
    '#059669': { top: '#10b981', bottom: '#047857', border: '#a7f3d0' },
    '#dc2626': { top: '#ef4444', bottom: '#991b1b', border: '#fecaca' },
    '#ea580c': { top: '#f97316', bottom: '#9a3412', border: '#ffedd5' },
    '#7f1d1d': { top: '#b91c1c', bottom: '#450a0a', border: '#fca5a5' },
    '#e2e8f0': { top: '#f8fafc', bottom: '#cbd5e1', border: '#ffffff' },
    '#94a3b8': { top: '#cbd5e1', bottom: '#64748b', border: '#f1f5f9' },
    '#64748b': { top: '#94a3b8', bottom: '#334155', border: '#cbd5e1' },
    '#475569': { top: '#64748b', bottom: '#1e293b', border: '#94a3b8' },
    '#334155': { top: '#475569', bottom: '#0f172a', border: '#64748b' },
    '#0d9488': { top: '#14b8a6', bottom: '#115e59', border: '#99f6e4' },

    // Power-up színek és ikonfeliratok
    'cyan':      { top: '#38bdf8', bottom: '#0284c7', border: '#bae6fd', label: '2×' },
    'pink':      { top: '#f472b6', bottom: '#db2777', border: '#fbcfe8', label: '⇄' },
    '#f97316':   { top: '#fb923c', bottom: '#ea580c', border: '#fed7aa', label: '⇅' },
    'darkgreen': { top: '#4ade80', bottom: '#15803d', border: '#bbf7d0', label: 'TNT' },
    '#14b8a6':   { top: '#2dd4bf', bottom: '#0f766e', border: '#99f6e4', label: '✦' },
    '#6366f1':   { top: '#818cf8', bottom: '#4338ca', border: '#c7d2fe', label: '⟳' },
    '#581845':   { top: '#c084fc', bottom: '#6b21a8', border: '#e9d5ff', label: '+5s' },
    '#0284c7':   { top: '#7dd3fc', bottom: '#0284c7', border: '#e0f2fe', label: '❄' },
    '#e11d48':   { top: '#fb7185', bottom: '#be123c', border: '#ffe4e6', label: '🧲' }
};

// Aktív színek és téma alapértelmezések
let currentTheme = localStorage.getItem('crashdown_theme') || 'retro';
let negyzetSzinek = THEME_PALETTES[currentTheme] || THEME_PALETTES.retro;
