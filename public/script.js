/* ================================================================
   CRASHDOWN ARCADE - MODULAR ARCHITECTURE NOTICE
   ================================================================
   A korábbi monolitikus script.js kódbázis fel lett osztva
   tiszta, átlátható és gyorsan betöltődő modulokra a /js/ mappában:

   - js/config.js       : Konfigurációk, színek, témák, modifierek
   - js/audio.js        : Hangok, effektek, hangerő, haptikus visszajelzés
   - js/achievements.js : Mérföldkövek, rangcímek, profilképek, profil statisztikák
   - js/ui.js           : UI vezérlés, modális ablakok, toastok, ranglista nézet
   - js/game.js         : Játékmotor, blokktörés, kombók, animációk, részecskék
   - js/main.js         : Eseménykezelők, inicializálás, fő játékciklus

   Az index.html közvetlenül ezeket a modulokat használja.
   Ez a fájl a redundancia megszüntetése érdekében fenntartva referenciaként.
   ================================================================ */
