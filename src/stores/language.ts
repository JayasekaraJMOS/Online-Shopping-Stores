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
  // Product Words (General)
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
  // Seller & Support Phrases
  'Seller Programme': { SI: 'විකුණුම්කරු වැඩසටහන', TA: 'விற்பனையாளர் திட்டம்' },
  'Grow Your Business': { SI: 'ඔබේ ව්‍යාපාරය දියුණු කරන්න', TA: 'உங்கள் வணிகத்தை வளர்க்கவும்' },
  'With OMAX': { SI: 'OMAX සමඟ', TA: 'OMAX உடன்' },
  'Join thousands of sellers already earning on OMAX. Zero setup costs, powerful tools, and millions of waiting customers.': { SI: 'OMAX හි දැනටමත් උපයන දහස් ගණනක් විකුණුම්කරුවන් සමඟ එක්වන්න.', TA: 'OMAX இல் ஏற்கனவே சம்பாதிக்கும் ஆயிரக்கணக்கான விற்பனையாளர்களுடன் சேரவும்.' },
  'Register as Seller': { SI: 'විකුණුම්කරුවෙකු ලෙස ලියාපදිංචි වන්න', TA: 'விற்பனையாளராக பதிவு செய்யவும்' },
  'Learn More': { SI: 'තවත් දැනගන්න', TA: 'மேலும் அறிய' },
  'Active Sellers': { SI: 'සක්‍රිය විකුණුම්කරුවන්', TA: 'செயலில் உள்ள விற்பனையாளர்கள்' },
  'Customers': { SI: 'ගනුදෙනුකරුවන්', TA: 'வாடிக்கையாளர்கள்' },
  'Paid Out': { SI: 'ගෙවා ඇත', TA: 'செலுத்தப்பட்டது' },
  'How It Works': { SI: 'එය ක්‍රියා කරන ආකාරය', TA: 'இது எப்படி வேலை செய்கிறது' },
  'Register': { SI: 'ලියාපදිංචි වන්න', TA: 'பதிவு செய்' },
  'List Products': { SI: 'නිෂ්පාදන ලැයිස්තුගත කරන්න', TA: 'தயாரிப்புகளை பட்டியலிடவும்' },
  'Start Selling': { SI: 'විකිණීම ආරම්භ කරන්න', TA: 'விற்பனையைத் தொடங்கு' },
  'Get Paid': { SI: 'මුදල් ලබා ගන්න', TA: 'பணம் பெறுங்கள்' },
  'Create your seller account with basic business details in minutes.': { SI: 'මිනිත්තු කිහිපයකින් ඔබේ වෙළඳ ගිණුම සාදන්න.', TA: 'சில நிமிடங்களில் உங்கள் கணக்கை உருவாக்கவும்.' },
  'Upload your inventory with photos, descriptions, and pricing.': { SI: 'ඡායාරූප, විස්තර සහ මිල ගණන් සමඟ ඔබේ ඉන්වෙන්ටරි උඩුගත කරන්න.', TA: 'புகைப்படங்கள், விளக்கங்கள் மற்றும் விலையுடன் ஏற்றவும்.' },
  'Go live and start receiving orders from customers nationwide.': { SI: 'සජීවීව ගොස් දිවයින පුරා පාරිභෝගිකයින්ගෙන් ඇණවුම් ලබා ගැනීම ආරම්භ කරන්න.', TA: 'வாடிக்கையாளர்களிடம் இருந்து ஆர்டர்களைப் பெறத் தொடங்குங்கள்.' },
  'Receive weekly automated payouts directly to your bank account.': { SI: 'ඔබේ බැංකු ගිණුමට සෘජුවම සතිපතා ස්වයංක්‍රීය ගෙවීම් ලබා ගන්න.', TA: 'உங்கள் வங்கிக் கணக்கில் நேரடியாக தானியங்கி பேஅவுட்களைப் பெறுங்கள்.' },
  'Seller Benefits': { SI: 'විකුණුම්කරුවන්ගේ ප්‍රතිලාභ', TA: 'விற்பனையாளர் நன்மைகள்' },
  'Zero Listing Fees': { SI: 'ලැයිස්තුගත කිරීමේ ගාස්තු නොමැත', TA: 'பட்டியலிடல் கட்டணம் இல்லை' },
  'Reach Millions': { SI: 'මිලියන ගණනක් වෙත ළඟා වන්න', TA: 'மில்லியன் கணக்கானவர்களை அடையுங்கள்' },
  'Seller Dashboard': { SI: 'විකුණුම්කරු උපකරණ පුවරුව', TA: 'விற்பனையாளர் டேஷ்போர்டு' },
  'Seller Protection': { SI: 'විකුණුම්කරු ආරක්ෂාව', TA: 'விற்பனையாளர் பாதுகாப்பு' },
  'Logistics Support': { SI: 'ලොජිස්ටික්ස් සහාය', TA: 'தளவாடங்கள் ஆதரவு' },
  'Marketing Tools': { SI: 'අලෙවිකරණ මෙවලම්', TA: 'சந்தைப்படுத்தல் கருவிகள்' },
  'List your first 100 products for free. No upfront costs, no hidden charges.': { SI: 'ඔබේ පළමු නිෂ්පාදන 100 නොමිලේ ලැයිස්තුගත කරන්න.', TA: 'உங்கள் முதல் 100 தயாரிப்புகளை இலவசமாக பட்டியலிடுங்கள்.' },
  'Tap into OMAX\'s growing customer base across the country.': { SI: 'OMAX හි වර්ධනය වන පාරිභෝගික පදනමට තට්ටු කරන්න.', TA: 'OMAX இன் வளர்ந்து வரும் வாடிக்கையாளர் தளத்தைப் பயன்படுத்தவும்.' },
  'Real-time analytics, inventory management, and revenue tracking in one place.': { SI: 'තත්‍ය කාලීන විශ්ලේෂණ, ඉන්වෙන්ටරි කළමනාකරණය.', TA: 'நிகழ்நேர பகுப்பாய்வு, சரக்கு மேலாண்மை.' },
  'Secure payouts, fraud prevention, and dedicated dispute resolution support.': { SI: 'ආරක්ෂිත ගෙවීම්, වංචා වැළැක්වීම.', TA: 'பாதுகாப்பான பணம் செலுத்துதல், மோசடி தடுப்பு.' },
  'Integrated shipping partners with discounted rates for OMAX sellers.': { SI: 'OMAX විකුණුම්කරුවන් සඳහා වට්ටම් සහිත ඒකාබද්ධ නැව් හවුල්කරුවන්.', TA: 'ஒருங்கிணைந்த கப்பல் கூட்டாளர்கள்.' },
  'Run voucher campaigns, sponsored listings, and flash sale slots.': { SI: 'වවුචර් ව්‍යාපාර, අනුග්‍රහය දක්වන ලැයිස්තු කිරීම් ධාවනය කරන්න.', TA: 'வவுச்சர் பிரச்சாரங்களை இயக்கவும்.' },
  'Seller Plans': { SI: 'විකුණුම්කරු සැලසුම්', TA: 'விற்பனையாளர் திட்டங்கள்' },
  'Free': { SI: 'නොමිලේ', TA: 'இலவசம்' },
  'Custom': { SI: 'අභිරුචි', TA: 'தனிப்பயன்' },
  'Popular': { SI: 'ජනප්‍රිය', TA: 'பிரபலமான' },
  'Get Started': { SI: 'ආරම්භ කරන්න', TA: 'தொடங்கவும்' },
  'Starter': { SI: 'ආරම්භක', TA: 'ஸ்டார்டர்' },
  'Enterprise': { SI: 'ව්‍යවසාය', TA: 'நிறுவன' },
  'Live Chat': { SI: 'සජීවී කතාබස්', TA: 'நேரடி அரட்டை' },
  'Start Chat': { SI: 'කතාබස් ආරම්භ කරන්න', TA: 'அரட்டையைத் தொடங்கு' },
  'Email Support': { SI: 'විද්‍යුත් තැපෑල සහාය', TA: 'மின்னஞ்சல் ஆதரவு' },
  'Send Email': { SI: 'විද්‍යුත් තැපෑල යවන්න', TA: 'மின்னஞ்சல் அனுப்பவும்' },
  'Ask Bot': { SI: 'බොට්ගෙන් අසන්න', TA: 'பாட்டிடம் கேளுங்கள்' },
  'Message Sent!': { SI: 'පණිවිඩය යවන ලදි!', TA: 'செய்தி அனுப்பப்பட்டது!' },
  'Our support team will get back to you within 24 hours.': { SI: 'අපගේ සහායක කණ්ඩායම පැය 24ක් ඇතුළත ඔබව සම්බන්ධ කර ගනු ඇත.', TA: '24 மணி நேரத்திற்குள் உங்களை தொடர்புகொள்வார்கள்.' },
  'Send Another': { SI: 'තවත් එකක් යවන්න', TA: 'இன்னொன்றை அனுப்பு' },
  'How do I track my order?': { SI: 'මගේ ඇණවුම නිරීක්ෂණය කරන්නේ කෙසේද?', TA: 'என் ஆர்டரை எப்படி கண்காணிப்பது?' },
  'What is the return policy?': { SI: 'ආපසු ගෙවීමේ ප්‍රතිපත්තිය කුමක්ද?', TA: 'திரும்பப் பெறும் கொள்கை என்ன?' },
  'How long does delivery take?': { SI: 'බෙදා හැරීමට කොපමණ කාලයක් ගතවේද?', TA: 'டெலிவரிக்கு எவ்வளவு நேரம் ஆகும்?' },
  'Can I change or cancel my order?': { SI: 'මට මගේ ඇණවුම වෙනස් කිරීමට හෝ අවලංගු කිරීමට හැකිද?', TA: 'ஆர்டரை மாற்ற அல்லது ரத்து செய்ய முடியுமா?' },
  'What payment methods are accepted?': { SI: 'මොනවාද පිළිගන්නා ගෙවීම් ක්‍රම?', TA: 'எந்த கட்டண முறைகள் ஏற்றுக்கொள்ளப்படுகின்றன?' },
  'How do I contact a seller directly?': { SI: 'විකුණුම්කරුවෙකු සෘජුවම සම්බන්ධ කර ගන්නේ කෙසේද?', TA: 'விற்பனையாளரை நேரடியாக தொடர்புகொள்வது எப்படி?' },
  'Chat with a support agent in real time.': { SI: 'සජීවීව සහාය නියෝජිතයෙකු සමඟ කතාබස් කරන්න.', TA: 'நிகழ்நேரத்தில் ஒரு ஆதரவு முகவருடன் அரட்டையடிக்கவும்.' },
  'support@omax.store · Reply within 24h': { SI: 'support@omax.store · පැය 24ක් ඇතුළත පිළිතුර', TA: 'support@omax.store · 24 மணி நேரத்திற்குள் பதிலளிக்கவும்' },
  '+1 234 567 890 · Mon–Fri, 9am–6pm': { SI: '+1 234 567 890 · සඳුදා-සිකුරාදා', TA: '+1 234 567 890 · திங்கள்-வெள்ளி' },
  'Get instant answers 24/7 from our bot.': { SI: 'අපගේ බොට් වෙතින් 24/7 ක්ෂණික පිළිතුරු ලබා ගන්න.', TA: 'எங்கள் போட்டில் இருந்து 24/7 உடனடி பதில்களைப் பெறுங்கள்.' },

  // Extra generic words to catch more product names
  'Laptop': { SI: 'ලැප්ටොප්', TA: 'மடிக்கணினி' },
  'Shirt': { SI: 'කමිසය', TA: 'சட்டை' },
  'Shoes': { SI: 'සපත්තු', TA: 'காலணிகள்' },
  'Bag': { SI: 'බෑගය', TA: 'பை' },
  'Dress': { SI: 'ඇඳුම', TA: 'உடை' },
  'Ring': { SI: 'මුද්ද', TA: 'மோதிரம்' },
  'Food': { SI: 'ආහාර', TA: 'உணவு' },
  'Toy': { SI: 'සෙල්ලම් බඩු', TA: 'பொம்மை' },
  'Game': { SI: 'ක්‍රීඩාව', TA: 'விளையாட்டு' },
  'Console': { SI: 'කොන්සෝලය', TA: 'கன்சோல்' },
  'Camera': { SI: 'කැමරාව', TA: 'கேமரா' },
  'Mouse': { SI: 'මූසිකය', TA: 'சுட்டி' },
  'Keyboard': { SI: 'යතුරු පුවරුව', TA: 'விசைப்பலகை' },
  'Monitor': { SI: 'මොනිටරය', TA: 'மானிட்டர்' },
  'Desk': { SI: 'මේසය', TA: 'மேஜை' },
  'Bike': { SI: 'බයිසිකලය', TA: 'பைக்' },
  'Motor': { SI: 'මෝටර්', TA: 'மோட்டார்' },
  'Car': { SI: 'මෝටර් රථය', TA: 'கார்' },
  'Oil': { SI: 'තෙල්', TA: 'எண்ணெய்' },
  'Steak': { SI: 'ස්ටීක්', TA: 'ஸ்டீக்' },
  'Beef': { SI: 'හරක් මස්', TA: 'மாட்டிறைச்சி' },
  'Chicken': { SI: 'කුකුළු මස්', TA: 'கோழி இறைச்சி' },
  'Fish': { SI: 'මාළු', TA: 'மீன்' },

  // Exact Dump API Product Titles
  'Essence Mascara Lash Princess': { SI: 'එසෙන්ස් මස්කාරා', TA: 'எசன்ஸ் மஸ்காரா லாஷ் பிரின்சஸ்' },
  'Eyeshadow Palette with Mirror': { SI: 'කැඩපත සහිත අයිෂැඩෝ', TA: 'கண்ணாடி மூலம் ஐ ஷேடோ' },
  'Powder Canister': { SI: 'පවුඩර් කැනිස්ටර්', TA: 'பவுடர் கேனிஸ்டர்' },
  'Red Lipstick': { SI: 'රතු තොල් ආලේපන', TA: 'சிவப்பு லிப்ஸ்டிக்' },
  'Calvin Klein CK One': { SI: 'කැල්වින් ක්ලයින් සීකේ වන්', TA: 'கால்வின் க்ளீன் பர்பியூம்' },
  'Chanel Coco Noir Eau De': { SI: 'චැනල් කොකෝ නොයර්', TA: 'சேனல் கோகோ நாய்ர்' },
  'Dior J\'adore': { SI: 'ඩියෝර් ජඩෝර්', TA: 'டியோர் ஜேடோர்' },
  'Dolce Shine Eau de': { SI: 'ඩොල්චේ ෂයින්', TA: 'டோல்ஸ் ஷைன்' },
  'Gucci Bloom Eau de': { SI: 'ගුචි බ්ලූම්', TA: 'குஸ்ஸி ப்ளூம்' },
  'Annibale Colombo Bed': { SI: 'ඇනිබේල් කොලොම්බෝ ඇඳ', TA: 'படுக்கை' },
  'Annibale Colombo Sofa': { SI: 'ඇනිබේල් කොලොම්බෝ සෝෆා', TA: 'சோபா' },
  'Bedside Table African Cherry': { SI: 'ඇඳ අසල මේසය', TA: 'படுக்கை அட்டவணை' },
  'KNOSPE Cherry Wood Bed': { SI: 'චෙරි ලී ඇඳ', TA: 'செர்ரி மர படுக்கை' },
  'Wooden Bathroom Sink With Mirror': { SI: 'ලී නාන කාමර සින්ක්', TA: 'மர குளியலறை சிங்க்' },
  'Beef Steak': { SI: 'හරක් මස්', TA: 'மாட்டிறைச்சி ஸ்டீக்' },
  'Cat Food': { SI: 'බළල් කෑම', TA: 'பூனை உணவு' },
  'Chicken Meat': { SI: 'කුකුළු මස්', TA: 'கோழி இறைச்சி' },
  'Cooking Oil': { SI: 'ඉවුම් පිහුම් තෙල්', TA: 'சமையல் எண்ணெய்' },
  'Cucumber': { SI: 'පිපිඤ්ඤා', TA: 'வெள்ளரி' },
  'Dog Food': { SI: 'සුනඛ ආහාර', TA: 'நாய் உணவு' },
  'Eggs': { SI: 'බිත්තර', TA: 'முட்டைகள்' },
  'Fish Steak': { SI: 'මාළු පෙති', TA: 'மீன் ஸ்டீக்' },
  'Green Bell Pepper': { SI: 'කොළ බෙල් පෙපර්', TA: 'பச்சை குடை மிளகாய்' },
  'Green Chili Pepper': { SI: 'අමු මිරිස්', TA: 'பச்சை மிளகாய்' },
  'Honey Jar': { SI: 'මී පැණි බෝතලය', TA: 'தேன் ஜாடி' },
  'Ice Cream': { SI: 'අයිස්ක්‍රීම්', TA: 'ஐஸ்கிரீம்' },
  'Kiwi': { SI: 'කිවි', TA: 'கிவி' },
  'MacBook Pro': { SI: 'මැක්බුක් ප්‍රෝ', TA: 'மேக்புக் ப்ரோ' },
  'Samsung Galaxy S23': { SI: 'සැම්සුන් ගැලැක්සි', TA: 'சாம்சங் கேலக்ஸி' },
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

  // Pre-build regex map once — avoids re-creating RegExps on every call
  const _regexCache = new Map<string, RegExp>()
  function _getRegex(enWord: string): RegExp {
    if (!_regexCache.has(enWord)) {
      // Escape special regex chars in the key before building regex
      const escaped = enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      _regexCache.set(enWord, new RegExp(`\\b${escaped}\\b`, 'gi'))
    }
    return _regexCache.get(enWord)!
  }

  // Translation memo cache: { [lang]: { [originalText]: translatedText } }
  const _translationCache = ref<Record<string, Record<string, string>>>({ EN: {}, SI: {}, TA: {} })

  function setLanguage(code: string) {
    if (LANGUAGES.some(l => l.code === code)) {
      selectedCode.value = code
      localStorage.setItem('language', code)
      // Clear cache for this language so stale entries don't persist
      _translationCache.value[code] = {}
    }
  }

  // Plain method (not a computed) — reactive because it reads selectedCode.value
  function translateDynamic(text: string): string {
    if (!text) return text
    const lang = selectedCode.value
    if (lang === 'EN') return text

    // Return from cache if already translated
    const cache = _translationCache.value[lang] ??= {}
    if (Object.prototype.hasOwnProperty.call(cache, text)) return cache[text] as string

    // Exact match first
    for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
      if (text.toLowerCase() === enWord.toLowerCase()) {
        const result = (translations as Record<string, string>)[lang] || text
        cache[text] = result
        return result
      }
    }

    // Partial word-boundary replacement
    let translated = text
    for (const [enWord, translations] of Object.entries(WORDS_DICT)) {
      const transStr = (translations as Record<string, string>)[lang]
      if (transStr) {
        translated = translated.replace(_getRegex(enWord), transStr)
      }
    }

    cache[text] = translated
    return translated
  }

  const t = computed(() => (DICTIONARY[selectedCode.value] || DICTIONARY['EN']) as TranslationMap)

  return { selectedCode, selectedTitle, LANGUAGES, setLanguage, t, translateDynamic }
})
