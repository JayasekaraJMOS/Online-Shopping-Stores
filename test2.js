const WORDS_DICT = {
  'Mascara': { SI: 'මස්කාරා', TA: 'மஸ்காரா' },
  'Essence': { SI: 'එසෙන්ස්', TA: 'எசன்ஸ்' }
};

function translateDynamic(text, selectedCode) {
  let translated = text;
  for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
    const transStr = translations[selectedCode];
    if (transStr) {
      translated = translated.replace(new RegExp(`\\b${enWord}\\b`, 'gi'), transStr);
    }
  }
  return translated;
}

console.log(translateDynamic('My Essence Mascara', 'SI'));
