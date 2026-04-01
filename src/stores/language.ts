import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type TranslationMap = {
  home: string; seller: string; help: string; cart: string; login: string; logout: string; search: string; saveApp: string; downloadApp: string;
  flashSale: string; endingIn: string; showLess: string; shopAll: string; off: string; saveMore: string; exclusiveDeals: string;
  newUserBonus: string; firstOrderDiscount: string; claimNow: string; minSpend: string; copy: string;
  techCombo: string; fashion: string; beauty: string; homeLiving: string; limitedTimeOffer: string;
  realSale: string; isFinallyHere: string; shopNow: string; justForYou: string; resultsFor: string; noProductsFound: string;
  addToCart: string; rating: string;
}

const DICTIONARY: Record<string, TranslationMap> = {
  EN: {
    home: 'Home', seller: 'Become a Seller', help: 'Help & Support', cart: 'My Cart', login: 'LOGIN', logout: 'LOGOUT', search: 'Search in OMAX...', saveApp: 'Save More on App', downloadApp: 'Download the App',
    flashSale: 'Flash Sale', endingIn: 'Ending in', showLess: 'Show Less', shopAll: 'Shop All', off: 'OFF', saveMore: 'Save More', exclusiveDeals: 'Exclusive Deals',
    newUserBonus: 'New User Bonus', firstOrderDiscount: 'Get $10 OFF your first order', claimNow: 'Claim Now', minSpend: 'Min. spend', copy: 'Copy',
    techCombo: 'Tech Combo', fashion: 'Fashion', beauty: 'Beauty', homeLiving: 'Home', limitedTimeOffer: 'Limited Time Offer',
    realSale: 'THE REAL SALE', isFinallyHere: 'IS FINALLY HERE', shopNow: 'SHOP NOW', justForYou: 'Just For You', resultsFor: 'Results for', noProductsFound: 'No products found',
    addToCart: 'Add to Cart', rating: 'Rating'
  },
  SI: {
    home: 'මුල් පිටුව', seller: 'විකුණුම්කරුවෙකු වන්න', help: 'සහාය', cart: 'මගේ කරත්තය', login: 'ඇතුල් වන්න', logout: 'පිටවෙන්න', search: 'OMAX හි සොයන්න...', saveApp: 'යෙදුමෙන් තවත් සුරකින්න', downloadApp: 'යෙදුම බාගන්න',
    flashSale: 'ක්ෂණික විකුණුම්', endingIn: 'අවසන් වන්නේ', showLess: 'අඩුවෙන් පෙන්වන්න', shopAll: 'සියල්ල සාදන්න', off: 'වට්ටමක්', saveMore: 'තවත් සුරකින්න', exclusiveDeals: 'විශේෂ දීමනා',
    newUserBonus: 'නව පරිශීලක ප්‍රසාද දීමනාව', firstOrderDiscount: 'පළමු ඇණවුමට $10 ක වට්ටමක්', claimNow: 'දැන් ලබා ගන්න', minSpend: 'අවම වියදම', copy: 'පිටපත්',
    techCombo: 'තාක්ෂණික එකතුව', fashion: 'විලාසිතා', beauty: 'රූපලාවන්‍ය', homeLiving: 'නිවස', limitedTimeOffer: 'සීමිත කාලීන දීමනාව',
    realSale: 'සැබෑ විකුණුම', isFinallyHere: 'මෙන්න ඇවිත්', shopNow: 'දැන් සාප්පු යන්න', justForYou: 'ඔබ වෙනුවෙන්ම', resultsFor: 'සඳහා ප්‍රතිඵල', noProductsFound: 'නිෂ්පාදන හමු නොවීය',
    addToCart: 'කරත්තයට එක් කරන්න', rating: 'ශ්‍රේණිගත කිරීම'
  },
  TA: {
    home: 'முகப்பு', seller: 'விற்பனையாளர் ஆக', help: 'உதவி', cart: 'என் வண்டி', login: 'உள்நுழைய', logout: 'வெளியேறு', search: 'OMAX இல் தேடுக...', saveApp: 'பயன்பாட்டில் மேலும் சேமிக்கவும்', downloadApp: 'பயன்பாட்டை பதிவிறக்குக',
    flashSale: 'திடீர் விற்பனை', endingIn: 'முடிவடைகிறது', showLess: 'குறைவாகக் காட்டு', shopAll: 'வாங்கு', off: 'தள்ளுபடி', saveMore: 'மேலும் சேமிக்க', exclusiveDeals: 'சிறப்பு சலுகைகள்',
    newUserBonus: 'புதிய பயனர் போனஸ்', firstOrderDiscount: 'முதல் ஆர்டருக்கு $10 தள்ளுபடி', claimNow: 'இப்போதே பெறுங்கள்', minSpend: 'குறைந்தபட்ச செலவு', copy: 'நகலெடு',
    techCombo: 'தொழில்நுட்ப சேர்க்கை', fashion: 'ஃபேஷன்', beauty: 'அழகு', homeLiving: 'வீடு', limitedTimeOffer: 'நேர சலுகை',
    realSale: 'உண்மையான விற்பனை', isFinallyHere: 'இறுதியாக வந்துவிட்டது', shopNow: 'இப்போதே வாங்குங்கள்', justForYou: 'உங்களுக்காக மட்டும்', resultsFor: 'முடிவுகள்', noProductsFound: 'தயாரிப்புகள் கிடைக்கவில்லை',
    addToCart: 'வண்டியில் சேர்க்க', rating: 'மதிப்பீடு'
  }
};

const WORDS_DICT: Record<string, Record<string, string>> = {
  // Categories
  'Beauty': { SI: 'රූපලාවන්‍ය', TA: 'அழகு' },
  'Fragrances': { SI: 'සුවඳ විලවුන්', TA: 'வாசனை திரவியங்கள்' },
  'Furniture': { SI: 'ගෘහ භාණ්ඩ', TA: 'மரச்சாமான்கள்' },
  'Groceries': { SI: 'සිල්ලර බඩු', TA: 'மளிகை' },
  'Laptops': { SI: 'ලැප්ටොප්', TA: 'மடிக்கணினிகள்' },
  'Smartphones': { SI: 'ස්මාර්ට්ෆෝන්', TA: 'ஸ்மார்ட்போன்கள்' },
  'Tops': { SI: 'උඩු ඇඳුම්', TA: 'மேலாடைகள்' },
  'All': { SI: 'සියල්ල', TA: 'அனைத்தும்' },
  // Product Words
  'Essence': { SI: 'එසෙන්ස්', TA: 'எசன்ஸ்' },
  'Mascara': { SI: 'මස්කාරා', TA: 'மஸ்காரா' },
  'Eyeshadow': { SI: 'අයිෂැඩෝ', TA: 'ஐ ஷேடோ' },
  'Powder': { SI: 'පවුඩර්', TA: 'பவுடர்' },
  'Perfume': { SI: 'සුවඳ විලවුන්', TA: 'வாசனை திரவியம்' },
  'Apple': { SI: 'ඇපල්', TA: 'ஆப்பிள்' },
  'MacBook': { SI: 'මැක්බුක්', TA: 'மேக்புக்' },
  'Samsung': { SI: 'සැම්සුන්', TA: 'சாம்சங்' },
  'Phone': { SI: 'දුරකථනය', TA: 'தொலைபேசி' },
  'Bed': { SI: 'ඇඳ', TA: 'படுக்கை' },
  'Chair': { SI: 'පුටුව', TA: 'நாற்காலி' },
  'Meat': { SI: 'මස්', TA: 'இறைச்சி' },
  'Juice': { SI: 'යුෂ', TA: 'சாறு' },
  'Nail Polish': { SI: 'නිය ආලේපන', TA: 'நெயில் பாலிஷ்' },
  'Lipstick': { SI: 'තොල් ආලේපන', TA: 'லிப்ஸ்டிக்' },
  'Pro': { SI: 'ප්‍රෝ', TA: 'ப்ரோ' },
  'Max': { SI: 'මැක්ස්', TA: 'மேக்ஸ்' },
  'Premium': { SI: 'වාරික', TA: 'பிரீமியம்' },
  'Palette': { SI: 'පැලට්', TA: 'பாலெட்' },
  'Mirror': { SI: 'කැඩපත', TA: 'கண்ணாடி' },
  'Red': { SI: 'රතු', TA: 'சிவப்பு' },
  'Eau De': { SI: 'ඕ ද', TA: 'ஓ டி' },
  'Foldable': { SI: 'නැවිය හැකි', TA: 'மடிக்கக்கூடிய' },
  'Table': { SI: 'මේසය', TA: 'அட்டவணை' },
  'Book': { SI: 'පොත', TA: 'புத்தகம்' },
  'Watch': { SI: 'ඔරලෝසුව', TA: 'கடிகாரம்' },
  'Sunglasses': { SI: 'අව් කණ්ණාඩි', TA: 'சூரிய கண்ணாடி' },
  'Sneakers': { SI: 'ස්නීකර්ස්', TA: 'ஸ்னீக்கர்கள்' },
  // UI Phrases - Cart
  'Shopping Cart': { SI: 'සාප්පු කරත්තය', TA: 'ஷாப்பிங் கார்ட்' },
  'Your cart is empty': { SI: 'ඔබේ කරත්තය හිස් ය', TA: 'உங்கள் வண்டி காலியாக உள்ளது' },
  'Start Shopping': { SI: 'සාප්පු යෑම ආරම්භ කරන්න', TA: 'ஷாப்பிங் தொடங்கவும்' },
  'Selected': { SI: 'තෝරාගත්', TA: 'தேர்ந்தெடுக்கப்பட்ட' },
  'Select All': { SI: 'සියල්ල තෝරන්න', TA: 'அனைத்தையும் தேர்ந்தெடுக்க' },
  'Deselect All': { SI: 'සියල්ල ඉවත් කරන්න', TA: 'அனைத்தையும் நீக்கு' },
  'Clear All': { SI: 'සියල්ල මකන්න', TA: 'அனைத்தையும் அழி' },
  'Remove': { SI: 'ඉවත්කරන්න', TA: 'அகற்று' },
  'Order Summary': { SI: 'ඇණවුම් සාරාංශය', TA: 'ஆர்டர் சுருக்கம்' },
  'Subtotal': { SI: 'අනුපූරක එකතුව', TA: 'துணை மொத்தம்' },
  'Shipping': { SI: 'නැව් ගාස්තු', TA: 'கப்பல்' },
  'Free': { SI: 'නොමිලේ', TA: 'இலவசம்' },
  'Total Pay': { SI: 'මුළු ගෙවීම', TA: 'மொத்த ஊதியம்' },
  'Checkout Now': { SI: 'දැන් මිලදී ගන්න', TA: 'இப்போதே வாங்குங்கள்' },
  // UI Phrases - Checkout & Process
  'Back to Store': { SI: 'වෙළඳසැලට ආපසු', TA: 'கடைக்குத் திரும்பு' },
  'Secure Checkout': { SI: 'ආරක්ෂිත පිටවීම', TA: 'பாதுகாப்பான வெளியேற்றம்' },
  'Shipping Details': { SI: 'නැව්ගත කිරීමේ විස්තර', TA: 'கப்பல் விவரங்கள்' },
  'Full Name': { SI: 'සම්පූර්ණ නම', TA: 'முழு பெயர்' },
  'City': { SI: 'නගරය', TA: 'நகரம்' },
  'Country': { SI: 'රට', TA: 'நாடு' },
  'Payment Method': { SI: 'ගෙවීම් ක්‍රමය', TA: 'பணம் செலுத்தும் முறை' },
  'Credit Card': { SI: 'ක්‍රෙඩිට් කාඩ්', TA: 'கடன் அட்டை' },
  'Cash on Delivery': { SI: 'ලැබුණු පසු මුදල් ගෙවීම', TA: 'பணம் செலுத்துதல்' },
  'Complete Payment': { SI: 'ගෙවීම සම්පූර්ණ කරන්න', TA: 'பணம் செலுத்துதலை முடி' },
  'Purchase Details': { SI: 'මිලදී ගැනීමේ විස්තර', TA: 'கொள்முதல் விவரங்கள்' },
  'Service Tax': { SI: 'සේවා බද්ද', TA: 'சேவை வரி' },
  // Product Detail UI
  'Verified Seller': { SI: 'තහවුරු කළ විකුණුම්කරු', TA: 'சரிபார்க்கப்பட்ட விற்பனையாளர்' },
  'Buy Now': { SI: 'දැන්ම මිලදී ගන්න', TA: 'இப்போதே வாங்கு' },
  'Description': { SI: 'විස්තරය', TA: 'விளக்கம்' },
  'Condition': { SI: 'තත්වය', TA: 'நிபந்தனை' },
  'Brand New': { SI: 'අලුත්ම', TA: 'புதியது' },
  'Warranty': { SI: 'වගකීමක්', TA: 'உத்தரவாதம்' },
  // Support UI
  'Support Center': { SI: 'සහාය මධ්‍යස්ථානය', TA: 'ஆதரவு மையம்' },
  'How Can We': { SI: 'අපිට කෙසේද', TA: 'எப்படி நாங்கள்' },
  'Help You?': { SI: 'උදව් කරන්නේ?', TA: 'உதவுவது?' },
  'Contact Us': { SI: 'අප අමතන්න', TA: 'எங்களை தொடர்பு கொள்ள' },
  'Frequently Asked Questions': { SI: 'නිතර අසන ප්‍රශ්න', TA: 'அடிக்கடி கேட்கப்படும் கேள்விகள்' },
  'Send a Message': { SI: 'පණිවිඩයක් යවන්න', TA: 'ஒரு செய்தியை அனுப்பவும்' },
  'Name *': { SI: 'නම *', TA: 'பெயர் *' },
  'Email *': { SI: 'විද්‍යුත් තැපෑල *', TA: 'மின்னஞ்சல் *' },
  'Subject': { SI: 'මාතෘකාව', TA: 'பொருள்' },
  'Message *': { SI: 'පණිවිඩය *', TA: 'செய்தி *' },
  'Send Message': { SI: 'පණිවිඩය යවන්න', TA: 'செய்தி அனுப்பு' }
};

export const useLanguageStore = defineStore('language', () => {
  const selectedCode = ref<string>(localStorage.getItem('language') ?? 'EN')

  const LANGUAGES = [
    { code: 'EN', name: 'English' },
    { code: 'SI', name: 'Sinhala' },
    { code: 'TA', name: 'Tamil' }
  ]

  const selectedTitle = computed(() => {
    const found = LANGUAGES.find(l => l.code === selectedCode.value)
    return found ? found.name : 'English'
  })

  function setLanguage(code: string) {
    if (LANGUAGES.some(l => l.code === code)) {
      selectedCode.value = code
      localStorage.setItem('language', code)
    }
  }

  function translateDynamic(text: string): string {
    if (!text) return text;
    if (selectedCode.value === 'EN') return text;
    
    // First try an exact match (useful for single word categories)
    for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
      if (text.toLowerCase() === enWord.toLowerCase()) {
        return (translations as Record<string, string>)[selectedCode.value] || text;
      }
    }

    // Then try partial replacement for product titles (case-insensitive replace)
    let translated = text;
    for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
      const transStr = (translations as Record<string, string>)[selectedCode.value];
      if (transStr) {
        translated = translated.replace(new RegExp(`\\b${enWord}\\b`, 'gi'), transStr);
      }
    }
    return translated;
  }

  const t = computed(() => (DICTIONARY[selectedCode.value] || DICTIONARY['EN']) as TranslationMap)

  return { selectedCode, selectedTitle, LANGUAGES, setLanguage, t, translateDynamic }
})
