const WORDS_DICT = {
  'Beauty': { SI: 'රූපලාවන්‍ය', TA: 'அழகு' },
  'Essence Mascara Lash Princess': { SI: 'එසෙන්ස් මස්කාරා', TA: 'எசன்ஸ் மஸ்காரா லாஷ் பிரின்சஸ்' },
'Apple MacBook Pro 14': { SI: 'ඇපල් මැක්බුක් ප්‍රෝ 14', TA: 'ஆப்பிள் மேக்புக் ப்ரோ 14' }
};

function translateDynamic(text, selectedCode) {
  if (!text) return text;
  if (selectedCode === 'EN') return text;
  
  for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
    if (text.toLowerCase() === enWord.toLowerCase()) {
      return translations[selectedCode] || text;
    }
  }

  let translated = text;
  for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
    const transStr = translations[selectedCode];
    if (transStr) {
      translated = translated.replace(new RegExp(`\\b${enWord}\\b`, 'gi'), transStr);
    }
  }
  return translated;
}

console.log(translateDynamic('Essence Mascara Lash Princess', 'SI'));
console.log(translateDynamic('Apple MacBook Pro 14', 'SI'));
