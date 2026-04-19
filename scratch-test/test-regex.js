const text = 'Essence Mascara Lash Princess';
const enWord = 'Mascara';
const out = text.replace(new RegExp('\\b' + enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi'), 'මස්කාරා');
console.log("OUT:", out);
