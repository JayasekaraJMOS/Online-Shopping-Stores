import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

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
    home: 'Home', seller: 'Become a Seller', help: 'Help & Support', cart: 'My Cart', login: 'LOGIN', logout: 'LOGOUT',
    search: 'Search in OMAX...', saveApp: 'Save More on App', downloadApp: 'Download the App',
    flashSale: 'Flash Sale', endingIn: 'Ending in', showLess: 'Show Less', shopAll: 'Shop All', off: 'OFF',
    saveMore: 'Save More', exclusiveDeals: 'Exclusive Deals',
    newUserBonus: 'New User Bonus', firstOrderDiscount: 'Get $10 OFF your first order', claimNow: 'Claim Now', minSpend: 'Min. spend', copy: 'Copy',
    techCombo: 'Tech Combo', fashion: 'Fashion', beauty: 'Beauty', homeLiving: 'Home', limitedTimeOffer: 'Limited Time Offer',
    realSale: 'THE REAL SALE', isFinallyHere: 'IS FINALLY HERE', shopNow: 'SHOP NOW', justForYou: 'Just For You',
    resultsFor: 'Results for', noProductsFound: 'No products found',
    addToCart: 'Add to Cart', rating: 'Rating'
  },
  SI: {
    home: 'මුල් පිටුව', seller: 'විකුණුම්කරුවෙකු වන්න', help: 'සහාය', cart: 'මගේ කරත්තය', login: 'ඇතුල් වන්න', logout: 'පිටවෙන්න',
    search: 'OMAX හි සොයන්න...', saveApp: 'යෙදුමෙන් තවත් සුරකින්න', downloadApp: 'යෙදුම බාගන්න',
    flashSale: 'ක්ෂණික විකුණුම්', endingIn: 'අවසන් වන්නේ', showLess: 'අඩුවෙන් පෙන්වන්න', shopAll: 'සියල්ල සාදන්න', off: 'වට්ටමක්',
    saveMore: 'තවත් සුරකින්න', exclusiveDeals: 'විශේෂ දීමනා',
    newUserBonus: 'නව පරිශීලක ප්‍රසාද දීමනාව', firstOrderDiscount: 'පලමු ඇණවුමට $10 ක වට්ටමක්', claimNow: 'දැන් ලබා ගන්න', minSpend: 'අවම වියදම', copy: 'පිටපත්',
    techCombo: 'තාක්ෂණික එකතුව', fashion: 'විලාසිතා', beauty: 'රූපලාවන්‍ය', homeLiving: 'නිවස', limitedTimeOffer: 'සීමිත කාලීන දීමනාව',
    realSale: 'සැබෑ විකුණුම', isFinallyHere: 'මෙන්න ඇවිත්', shopNow: 'දැන් සාප්පු යන්න', justForYou: 'ඔබ වෙනුවෙන්ම',
    resultsFor: 'සඳහා ප්‍රතිඵල', noProductsFound: 'නිෂ්පාදන හමු නොවීය',
    addToCart: 'කරත්තයට එක් කරන්න', rating: 'ශ්‍රේණිගත කිරීම'
  },
  TA: {
    home: 'முகப்பு', seller: 'விற்பனையாளர் ஆக', help: 'உதவி', cart: 'என் வண்டி', login: 'உள்நுழைய', logout: 'வெளியேறு',
    search: 'OMAX இல் தேடுக...', saveApp: 'பயன்பாட்டில் மேலும் சேமிக்கவும்', downloadApp: 'பயன்பாட்டை பதிவிறக்குக',
    flashSale: 'திடீர் விற்பனை', endingIn: 'முடிவடைகிறது', showLess: 'குறைவாகக் காட்டு', shopAll: 'வாங்கு', off: 'தள்ளுபடி',
    saveMore: 'மேலும் சேமிக்க', exclusiveDeals: 'சிறப்பு சலுகைகள்',
    newUserBonus: 'புதிய பயனர் போனஸ்', firstOrderDiscount: 'முதல் ஆர்டருக்கு $10 தள்ளுபடி', claimNow: 'இப்போதே பெறுங்கள்', minSpend: 'குறைந்தபட்ச செலவு', copy: 'நகலெடு',
    techCombo: 'தொழில்நுட்ப சேர்க்கை', fashion: 'ஃபேஷன்', beauty: 'அழகு', homeLiving: 'வீடு', limitedTimeOffer: 'நேர சலுகை',
    realSale: 'உண்மையான விற்பனை', isFinallyHere: 'இறுதியாக வந்துவிட்டது', shopNow: 'இப்போதே வாங்குங்கள்', justForYou: 'உங்களுக்காக மட்டும்',
    resultsFor: 'முடிவுகள்', noProductsFound: 'தயாரிப்புகள் கிடைக்கவில்லை',
    addToCart: 'வண்டியில் சேர்க்க', rating: 'மதிப்பீடு'
  }
}

// ---------------------------------------------------------------------------
// WORDS_DICT — sorted longest-first at build time so phrase matching wins.
// Keys must be lowercase for the case-insensitive lookup below.
// ---------------------------------------------------------------------------
const WORDS_DICT_RAW: Array<[string, Record<string, string>]> = [
  // ── Long exact UI phrases (must come first so they win over sub-words) ──
  ['Your cart is empty', { SI: 'ඔබේ කරත්තය හිස් ය', TA: 'உங்கள் வண்டி காலியாக உள்ளது' }],
  ['Checking out this item only — your cart is unchanged', { SI: 'මෙම අයිතමය පමණක් පරීක්ෂා කරයි', TA: 'இந்த உருப்படியை மட்டும் பார்க்கிறது' }],
  ['The smarter way to shop. Millions of products, unbeatable prices, delivered fast.', { SI: 'මුදල් ඉතිරි කරමින් බුද්ධිමත්ව සාප්පු සවාරි යන්න.', TA: 'ஷாப்பிங் செய்ய சிறந்த வழி.' }],
  ['Our team is here 24/7 to make sure your OMAX experience is seamless.', { SI: 'අඛණ්ඩ සේවාවක් සැපයීමට අපේ කණ්ඩායම සූදානම්.', TA: 'எங்கள் குழு 24/7 உங்களுக்காக இங்கே உள்ளது.' }],
  ['Limited duration offer. Price includes VAT.', { SI: 'සීමිත කාල දීමනාව. බදු ඇතුළත් කර ඇත.', TA: 'குறுகிய கால சலுகை. வரி உட்பட.' }],
  ['Safe & Secure Payment', { SI: 'ආරක්ෂිත ගෙවීම', TA: 'பாதுகாப்பான கட்டணம்' }],
  ['Secure Payment 🔒', { SI: 'ආරක්ෂිත ගෙවීම 🔒', TA: 'பாதுகாப்பான கட்டணம் 🔒' }],
  ['One-click experience', { SI: 'එක් ක්ලික් අත්දැකීමක්', TA: 'ஒரே கிளிக்கில் அனுபவம்' }],
  ['Pay at your doorstep', { SI: 'දෙපසදීම ගෙවන්න', TA: 'உங்கள் வீட்டு வாசலில் பணம் செலுத்துங்கள்' }],
  ['Cash on Delivery', { SI: 'භාණ්ඩ ලැබුණු පසු ගෙවන්න', TA: 'டெலிவரி போது பணம்' }],
  ['Complete Payment', { SI: 'ගෙවීම සම්පූර්ණ කරන්න', TA: 'கட்டணத்தை முடிக்கவும்' }],
  ['Purchase Details', { SI: 'මිලදී ගැනීමේ විස්තර', TA: 'கொள்முதல் விவரங்கள்' }],
  ['Select your country', { SI: 'රට තෝරන්න', TA: 'உங்கள் நாட்டைத் தேர்ந்தெடுக்கவும்' }],
  ['Shipping Details', { SI: 'නැව්ගත කිරීමේ විස්තර', TA: 'கப்பல் விவரங்கள்' }],
  ['Shipping Address', { SI: 'ලිපිනය', TA: 'கப்பல் முகவரி' }],
  ['Secure Checkout', { SI: 'ආරක්ෂිත පරීක්ෂාව', TA: 'பாதுகாப்பான செக்அவுட்' }],
  ['Back to Store', { SI: 'පසුපසට', TA: 'கடைக்குத் திரும்பு' }],
  ['Checkout Now', { SI: 'දැන් මිලදී ගන්න', TA: 'இப்போதே வாங்குங்கள்' }],
  ['Order Summary', { SI: 'ඇණවුම් සාරාංශය', TA: 'ஆர்டர் சுருக்கம்' }],
  ['Shopping Cart', { SI: 'සාප්පු කරත්තය', TA: 'ஷாப்பிங் கார்ட்' }],
  ['Express Buy Now', { SI: 'ක්ෂණිකව මිලදී ගන්න', TA: 'எக்ஸ்பிரஸ் இப்போது வாங்குங்கள்' }],
  ['Standard Manufacturer', { SI: 'සම්මත නිෂ්පාදකයා', TA: 'நிலையான உற்பத்தியாளர்' }],
  ['Limited Edition', { SI: 'සීමිත සංස්කරණය', TA: 'லிமிடெட் எடிஷன்' }],
  ['Apply Coupon', { SI: 'කූපනය යොදන්න', TA: 'கூப்பனைப் பயன்படுத்துங்கள்' }],
  ['Payment Method', { SI: 'ගෙවීම් ක්‍රමය', TA: 'கட்டண முறை' }],
  ['Service Tax', { SI: 'සේවා බදු', TA: 'சேவை வரி' }],
  ['Credit Card', { SI: 'ක්‍රෙඩිට් කාඩ්', TA: 'கடன் அட்டை' }],
  ['Verified Seller', { SI: 'සත්‍යාපිත විකුණුම්කරු', TA: 'சரிபார்க்கப்பட்ட விற்பனையாளர்' }],
  ['Customer Care', { SI: 'පාරිභෝගික සේවය', TA: 'வாடிக்கையாளர் பராமரிப்பு' }],
  ['Help Center', { SI: 'සහය මධ්‍යස්ථානය', TA: 'உதவி மையம்' }],
  ['How to Buy', { SI: 'මිලදී ගන්නේ කෙසේද', TA: 'எப்படி வாங்குவது' }],
  ['Returns & Refunds', { SI: 'ආපසු ලබා දීම සහ මුදල් ගෙවීම්', TA: 'திரும்புதல் மற்றும் பணத்தை திரும்பப் பெறுதல்' }],
  ['Track Your Order', { SI: 'ඇණවුම නිරීක්ෂණය කරන්න', TA: 'உங்கள் ஆர்டரைக் கண்காணிக்கவும்' }],
  ['About OMAX', { SI: 'OMAX ගැන', TA: 'OMAX பற்றி' }],
  ['About Us', { SI: 'අපි ගැන', TA: 'எங்களைப் பற்றி' }],
  ['Become a Seller', { SI: 'විකුණුම්කරුවෙකු වන්න', TA: 'விற்பனையாளர் ஆக' }],
  ['Privacy Policy', { SI: 'පෞද්ගලිකත්ව ප්‍රතිපත්තිය', TA: 'தனியுரிமைக் கொள்கை' }],
  ['Terms of Use', { SI: 'භාවිත නියමයන්', TA: 'பயன்பாட்டு விதிமுறைகள்' }],
  ['Get in Touch', { SI: 'සම්බන්ධ වන්න', TA: 'தொடர்பு கொள்ளுங்கள்' }],
  ['UP TO 50% OFF', { SI: '50% දක්වා වට්ටම්', TA: '50% வரை தள்ளுபடி' }],
  ['products found', { SI: 'නිෂ්පාදන හමු විය', TA: 'தயாரிப்புகள் கிடைத்தன' }],
  ['Clear All', { SI: 'සියල්ල ඉවත් කරන්න', TA: 'அனைத்தையும் அழி' }],
  ['Brand New', { SI: 'අලුත්ම', TA: 'புத்தம் புதியது' }],
  ['Buy Now', { SI: 'දැන් මිලදී ගන්න', TA: 'இப்போதே வாங்குங்கள்' }],
  ['Zip Code', { SI: 'තැපැල් කේතය', TA: 'அஞ்சல் குறியீடு' }],
  ['Full Name', { SI: 'සම්පූර්ණ නම', TA: 'முழு பெயர்' }],
  ['Total Pay', { SI: 'මුළු ගෙවීම', TA: 'மொத்த ஊதியம்' }],
  ['Send Message', { SI: 'පණිවිඩය යවන්න', TA: 'செய்தியை அனுப்பவும்' }],
  ['Quick View', { SI: 'ඉක්මන් බැල්ම', TA: 'விரைவான பார்வை' }],
  ['App Store', { SI: 'ඇප් ස්ටෝර්', TA: 'ஆப் ஸ்டோர்' }],
  ['Google Play', { SI: 'ගූගල් ප්ලේ', TA: 'கூகிள் பிளே' }],
  ['My Profile', { SI: 'මගේ පැතිකඩ', TA: 'என் சுயவிவரம்' }],
  ['✅ Claimed!', { SI: '✅ ලබා ගත්තා!', TA: '✅ பெறப்பட்டது!' }],
  ['✓ Copied', { SI: '✓ පිටපත් කළා', TA: '✓ நகலெடுக்கப்பட்டது' }],
  ['Register Now', { SI: 'දැන් ලියාපදිංචි වන්න', TA: 'இப்போதே பதிவு செய்யுங்கள்' }],
  ['Login Here', { SI: 'ඇතුල් වන්න', TA: 'இங்கே உள்நுழைந்து' }],
  ['Already have an account?', { SI: 'දැනටමත් ගිණුමක් තිබේද?', TA: 'ஏற்கனவே கணக்கு உள்ளதா?' }],
  ["Don't have an account?", { SI: 'ගිණුමක් නැද්ද?', TA: 'கணக்கு இல்லையா?' }],
  ['Instant Demo Access', { SI: 'ක්ෂණික ආදර්ශ ප්‍රවේශය', TA: 'உடனடி டெமோ அணுகல்' }],
  ['Account Help?', { SI: 'ගිණුම් සහාය?', TA: 'கணக்கு உதவியா?' }],
  ['Verifying...', { SI: 'සත්‍යාපනය කරනවා...', TA: 'சரிபார்க்கிறது...' }],
  ['Sending...', { SI: 'යවනවා...', TA: 'அனுப்புகிறது...' }],
  ['Creating...', { SI: 'සාදනවා...', TA: 'உருவாக்குகிறது...' }],
  ['Sign Up', { SI: 'ලියාපදිංචි වන්න', TA: 'பதிவு செய்யுங்கள்' }],
  ['Join the community today', { SI: 'අද ප්‍රජාවට එකතු වන්න', TA: 'இன்றே சமூகத்தில் சேருங்கள்' }],
  ['Enter your credentials to continue', { SI: 'ඉදිරියට යාමට ඔබේ ලොගිං විස්තර ඇතුළු කරන්න', TA: 'தொடர உங்கள் நற்சான்றிதழ்களை உள்ளிடவும்' }],
  ['You are not logged in.', { SI: 'ඔබ ලොගිං වී නැත.', TA: 'நீங்கள் உள்நுழையவில்லை.' }],
  ['Use in app at checkout', { SI: 'ගෙවීමේදී යෙදුම භාවිතා කරන්න', TA: 'செக்அவுட்டில் ஆப்பில் பயன்படுத்துங்கள்' }],
  ['Scan to Download', { SI: 'බෑගිමට QR ස්කෑන් කරන්න', TA: 'பதிவிறக்க ஸ்கேன் செய்யுங்கள்' }],
  ['Point your camera at the code', { SI: 'කේතය කෙරෙහි ඔබේ කැමරාව යොමු කරන්න', TA: 'குறியீட்டில் உங்கள் கேமராவை சுட்டுங்கள்' }],
  ['Free — No ads', { SI: 'නිදහස් — දැන්වීම් නැත', TA: 'இலவசம் — விளம்பரங்கள் இல்லை' }],
  ['Mobile Exclusive', { SI: 'ජංගම දුරකථන සඳහා', TA: 'மொபைல் மட்டும்' }],
  ['On The App', { SI: 'යෙදුමෙන්', TA: 'ஆப்பில்' }],
  ['Save More', { SI: 'තවත් සුරකින්න', TA: 'மேலும் சேமிக்க' }],
  ['Available on the', { SI: 'இங்கே கிடைக்கிறது', TA: 'இங்கே கிடைக்கிறது' }],
  ['Get it on', { SI: 'ලබා ගන්න', TA: 'பெறுங்கள்' }],
  ['Search help articles...', { SI: 'සහාය ලිපි සොයන්න...', TA: 'உதவி கட்டுரைகளைத் தேடுங்கள்...' }],
  ['Your email', { SI: 'ඔබේ විද්‍යුත් තැපෑල', TA: 'உங்கள் மின்னஞ்சல்' }],

  // ── Seller / Help page phrases ──
  ['Grow Your Business', { SI: 'ඔබේ ව්‍යාපාරය වර්ධනය කරන්න', TA: 'உங்கள் வணிகத்தை வளர்க்கவும்' }],
  ['With OMAX', { SI: 'OMAX සමඟ', TA: 'OMAX உடன்' }],
  ['Register as Seller', { SI: 'විකුණුම්කරු ලෙස ලියාපදිංචි වන්න', TA: 'விற்பனையாளராக பதிவு செய்யுங்கள்' }],
  ['Learn More', { SI: 'තව දැනගන්න', TA: 'மேலும் அறிக' }],
  ['Active Sellers', { SI: 'ක්‍රිය විකුණුම්කරුවන්', TA: 'செயலில் உள்ள விற்பனையாளர்கள்' }],
  ['Paid Out', { SI: 'ගෙවූ ප්‍රමාණය', TA: 'செலுத்தப்பட்ட தொகை' }],
  ['How It Works', { SI: 'එය ක්‍රියා කරන ආකාරය', TA: 'இது எப்படி வேலை செய்கிறது' }],
  ['Seller Benefits', { SI: 'විකුණුම්කරු ප්‍රතිලාභ', TA: 'விற்பனையாளர் நலன்கள்' }],
  ['Seller Plans', { SI: 'විකුණුම්කරු සැලසුම්', TA: 'விற்பனையாளர் திட்டங்கள்' }],
  ['Seller Programme', { SI: 'විකුණුම්කරු වැඩ සටහන', TA: 'விற்பனையாளர் திட்டம்' }],
  ['Get Started', { SI: 'ආරම්භ කරන්න', TA: 'தொடங்குங்கள்' }],
  ['Support Center', { SI: 'සහාය මධ්‍යස්ථානය', TA: 'ஆதரவு மையம்' }],
  ['How Can We', { SI: 'අපට හැකිද', TA: 'நாங்கள் எப்படி' }],
  ['Help You?', { SI: 'ඔබට සේවය කරන්න?', TA: 'உங்களுக்கு உதவ?' }],
  ['Contact Us', { SI: 'අප හා සම්බන්ධ වන්න', TA: 'எங்களை தொடர்பு கொள்ளுங்கள்' }],
  ['Frequently Asked Questions', { SI: 'නිතර අසන ප්‍රශ්න', TA: 'அடிக்கடி கேட்கப்படும் கேள்விகள்' }],
  ['Message Sent!', { SI: 'පණිවිඩය යවා ඇත!', TA: 'செய்தி அனுப்பப்பட்டது!' }],
  ['Our support team will get back to you within 24 hours.', { SI: 'අපේ සහාය කණ්ඩායම පැය 24 ක් ඇතුළත ඔබ වෙත ළඟා වනු ඇත.', TA: 'எங்கள் ஆதரவு குழு 24 மணி நேரத்திற்குள் உங்களை தொடர்பு கொள்ளும்.' }],
  ['Send Another', { SI: 'තවත් යවන්න', TA: 'இன்னொன்று அனுப்புங்கள்' }],
  ['Live Chat', { SI: 'සජීවී කතාබස', TA: 'நேரடி அரட்டை' }],
  ['Email Support', { SI: 'ඊමේල් සහාය', TA: 'மின்னஞ்சல் ஆதரவு' }],
  ['Start Chat', { SI: 'කතාබස ආරම්භ කරන්න', TA: 'அரட்டையை தொடங்குங்கள்' }],
  ['Send Email', { SI: 'ඊමේල් යවන්න', TA: 'மின்னஞ்சல் அனுப்புங்கள்' }],
  ['Call Now', { SI: 'දැන් ඇමතුම් ගන්න', TA: 'இப்போதே அழையுங்கள்' }],
  ['AI Assistant', { SI: 'AI සහකරු', TA: 'AI உதவியாளர்' }],
  ['Ask Bot', { SI: 'Bot ගෙන් අහන්න', TA: 'போட்டிடம் கேளுங்கள்' }],

  // ── FAQ full sentences ──
  ['How do I track my order?', { SI: 'මගේ ඇණවුම නිරීක්ෂණය කරන්නේ කෙසේද?', TA: 'என் ஆர்டரை எவ்வாறு கண்காணிப்பது?' }],
  ['What is the return policy?', { SI: 'ආපසු ලබා දීමේ ප්‍රතිපත්තිය කුමක්ද?', TA: 'திரும்பும் கொள்கை என்ன?' }],
  ['How long does delivery take?', { SI: 'බෙදාහැරීමට කොපමණ කාලයක් ගතවේද?', TA: 'டெலிவரிக்கு எவ்வளவு நேரம் ஆகும்?' }],
  ['Can I change or cancel my order?', { SI: 'ඇණවුම වෙනස් කිරීමට හෝ අවලංගු කිරීමට හැකිද?', TA: 'என் ஆர்டரை மாற்ற அல்லது ரத்து செய்ய முடியுமா?' }],
  ['What payment methods are accepted?', { SI: 'ගෙවීම් ක්‍රම මොනවාද?', TA: 'எந்த கட்டண முறைகள் ஏற்றுக்கொள்ளப்படுகின்றன?' }],
  ['How do I contact a seller directly?', { SI: 'විකුණුම්කරු සම්බන්ධ කරගන්නේ කෙසේද?', TA: 'விற்பனையாளரை நேரடியாக தொடர்பு கொள்வது எப்படி?' }],
  ['Go to your profile and click "My Orders". Each order shows a real-time tracking status. You\'ll also receive email updates at each stage of delivery.', { SI: 'ඔබේ පැතිකඩ වෙත ගොස් "මගේ ඇණවුම්" ක්ලික් කරන්න. ඊළඟ ඊමේල් යාවත්කාලීනද ලැබෙනු ඇත.', TA: 'உங்கள் சுயவிவரத்திற்கு சென்று "என் ஆர்டர்கள்" என்பதை கிளிக் செய்யவும்.' }],
  ['We offer a 15-day hassle-free return policy on most items. The product must be unused, in its original packaging. Initiate returns from your order history.', { SI: 'බොහෝ භාණ්ඩ සඳහා දින 15ක ආපසු ලබා දීමේ ප්‍රතිපත්තියක් ඇත. නිෂ්පාදිතය භාවිතා නොකළ විය යුතුය.', TA: 'பெரும்பாலான பொருட்களுக்கு 15 நாள் திரும்பல் கொள்கை உள்ளது.' }],
  ['Standard delivery takes 3–7 business days. Express delivery (available at checkout) delivers within 1–2 business days for most locations.', { SI: 'සාමාන්‍ය බෙදාහැරීමට කාර්‍ය දින 3-7 ගතවේ. ශීඝ්‍ර බෙදාහැරීම 1-2 දිනකින් ලැබේ.', TA: 'நிலையான டெலிவரி 3-7 நாட்கள் ஆகும். விரைவு டெலிவரி 1-2 நாட்களில் கிடைக்கும்.' }],
  ['Yes, you can cancel or modify orders within 1 hour of placing them. After that, please contact our support team for assistance.', { SI: 'ඔව්, ඇණවුම ලබා දී පැය 1ක් ඇතුළත අවලංගු කිරීමට හෝ වෙනස් කිරීමට හැකිය.', TA: 'ஆம், ஆர்டர் செய்த 1 மணி நேரத்திற்குள் ரத்து செய்யலாம்.' }],
  ['We accept all major credit/debit cards, PayPal, bank transfers, and OMAX Wallet. Cash on delivery is available in select regions.', { SI: 'ප්‍රධාන ක්‍රෙඩිට්/ඩෙබිට් කාඩ්, පේපෑල් සහ OMAXවොලට් ගෙවීම් ක්‍රම ලෙස පිළිගනී.', TA: 'அனைத்து முக்கிய கடன்/டெபிட் கார்டுகள், பேபால் மற்றும் OMAX வாலட் ஏற்றுக்கொள்ளப்படுகின்றன.' }],
  ['On any product page, scroll down to find the "Contact Seller" button. Messages are responded to within 24 hours.', { SI: 'ඕනෑම නිෂ්පාදිත පිටුවක "Contact Seller" බොත්තම සොයන්න. පැය 24 ඇතුළත හරිත ලැබෙනු ඇත.', TA: 'எந்த தயாரிப்பு பக்கத்திலும் "Contact Seller" பொத்தானைக் கண்டுபிடிக்கவும்.' }],
  ['Chat with a support agent in real time.', { SI: 'සජීවීව සහාය නියෝජිතයෙකු සමඟ කතාබස් කරන්න.', TA: 'ஆதரவு முகவருடன் நேரடியாக அரட்டையிடுங்கள்.' }],
  ['Get instant answers 24/7 from our bot.', { SI: 'AI bot ගෙන් ක්ෂණික පිළිතුරු ලබා ගන්න.', TA: 'எங்கள் போட்டிடம் உடனடி பதில்கள் பெறுங்கள்.' }],

  // ── Seller page descriptions ──
  ['List your first 100 products for free. No upfront costs, no hidden charges.', { SI: 'ඔබේ මුල් නිෂ්පාදන 100 නොමිලේ ලැයිස්තු කරන්න. සඟවා ඇති ගාස්තු නැත.', TA: 'முதல் 100 தயாரிப்புகளை இலவசமாக பட்டியலிடுங்கள்.' }],
  ["Tap into OMAX's growing customer base across the country.", { SI: 'රට පුරා OMAX හි වර්ධනය වන ගනුදෙනුකරු පදනමට ළඟා වන්න.', TA: 'நாடு முழுவதும் OMAX இன் வளரும் வாடிக்கையாளர் தளத்தை அடையுங்கள்.' }],
  ['Real-time analytics, inventory management, and revenue tracking in one place.', { SI: 'තථ්‍ය කාල විශ්ලේෂණ, ගබඩා කළමනාකරණ, සහ ආදායම් නිරීක්ෂණ එක් තැනෙකින්.', TA: 'நிகழ்நேர ஆய்வுகள், சரக்கு மேலாண்மை, மற்றும் வருவாய் கண்காணிப்பு.' }],
  ['Secure payouts, fraud prevention, and dedicated dispute resolution support.', { SI: 'ආරක්ෂිත ගෙවීම්, වංචා වැළැක්වීම, සහ ගැටලු නිරාකරණ සහාය.', TA: 'பாதுகாப்பான பணம், மோசடி தடுப்பு மற்றும் சர்ச்சை தீர்வு ஆதரவு.' }],
  ['Integrated shipping partners with discounted rates for OMAX sellers.', { SI: 'OMAX විකුණුම්කරුවන් සඳහා වට්ටම් ගාස්තු සමඟ ඒකාබද්ධ නැව්ගත කිරීමේ හවුල්කරුවන්.', TA: 'OMAX விற்பனையாளர்களுக்கு தள்ளுபடி விலையில் ஒருங்கிணைந்த கப்பல் பங்காளிகள்.' }],
  ['Run voucher campaigns, sponsored listings, and flash sale slots.', { SI: 'කූපන් ව්‍යාපාර, අනුග්‍රාහිත ලැයිස්තු, සහ ක්ෂණික විකුණු ස්ථාන ක්‍රියාත්මක කරන්න.', TA: 'வவுச்சர் பிரச்சாரங்கள், நிதியளிக்கப்பட்ட பட்டியல்கள் மற்றும் ஃபிளாஷ் சேல் ஸ்லாட்கள் இயக்குங்கள்.' }],
  ['Create your seller account with basic business details in minutes.', { SI: 'විනාඩි කිහිපයකින් ඔබේ විකුණුම්කරු ගිණුම සාදන්න.', TA: 'சில நிமிடங்களில் உங்கள் விற்பனையாளர் கணக்கை உருவாக்குங்கள்.' }],
  ['Upload your inventory with photos, descriptions, and pricing.', { SI: 'ඡායාරූප, විස්තර සහ මිගණන් සමඟ ඔබේ ගබඩාව උඩුගත කරන්න.', TA: 'புகைப்படங்கள், விளக்கங்கள் மற்றும் விலைகளுடன் உங்கள் சரக்கை பதிவேற்றுங்கள்.' }],
  ['Go live and start receiving orders from customers nationwide.', { SI: 'සජීවී ශාලාවේ ජාතිය පුරා ගනුදෙනුකරුවන්ගෙන් ඇණවුම් ලැබෙන්නට ආරම්භ කරන්න.', TA: 'நேரடியாக சென்று நாடு முழுவதும் வாடிக்கையாளர்களிடமிருந்து ஆர்டர்களைப் பெறுங்கள்.' }],
  ['Receive weekly automated payouts directly to your bank account.', { SI: 'ඔබේ බැංකු ගිණුමට සතිපතා ස්වත: ගෙවීම් ලබා ගන්න.', TA: 'உங்கள் வங்கி கணக்கில் வாராந்திர தானியங்கு பணம் பெறுங்கள்.' }],
  ['Join thousands of sellers already earning on OMAX. Zero setup costs, powerful tools, and millions of waiting customers.', { SI: 'දැනටමත් OMAX හි ඉපැයිය ලබන දහස් ගණනක් විකුණුම්කරුවන්ට සම්බන්ධ වන්න.', TA: 'OMAX இல் ஏற்கனவே சம்பாதிக்கும் ஆயிரக்கணக்கான விற்பனையாளர்களுடன் இணையுங்கள்.' }],

  // ── SaveMore page ──
  ['Flash Deals First', { SI: 'ක්ෂණික ගනුදෙනු ප්‍රථමයෙන්', TA: 'ஃபிளாஷ் டீல்கள் முதலில்' }],
  ['Instant Alerts', { SI: 'ක්ෂණික ඇඟවීම්', TA: 'உடனடி எச்சரிக்கைகள்' }],
  ['App-Only Coupons', { SI: 'යෙදුම් විශේෂ කූපන්', TA: 'ஆப் மட்டும் கூப்பன்கள்' }],
  ['Faster Checkout', { SI: 'ශීඝ්‍ර ගෙවීමේ ක්‍රමය', TA: 'வேகமான செக்அவுட்' }],
  ['Live Order Tracking', { SI: 'සජීවී ඇණවුම් නිරීක්ෂණ', TA: 'நேரடி ஆர்டர் கண்காணிப்பு' }],
  ['Coins & Rewards', { SI: 'කාසි සහ ත්‍යාග', TA: 'நாணயங்கள் & வெகுமதிகள்' }],
  ['App users get 30-min early access to all Flash Sale items before anyone else.', { SI: 'යෙදුම් පරිශීලකයන්ට ක්ෂණික විකුණු ආරම්භයට පෙර මිනිත්තු 30ක් ඉදිරියෙන් ප්‍රවේශ වීමට හැකිය.', TA: 'ஆப் பயனர்கள் ஃபிளாஷ் சேலுக்கு 30 நிமிடம் முன்பாக அணுகலாம்.' }],
  ['Push notifications for price drops on your wishlist and restocked favourites.', { SI: 'ඔබේ ප්‍රියතම ලැයිස්තුවේ නිෂ්පාදන මිල පහත වැටීම් නිවේදන ලබා ගන්න.', TA: 'உங்கள் விருப்பப்பட்டியலில் விலை குறைவுகளுக்கான அறிவிப்புகள் பெறுங்கள்.' }],
  ['Exclusive discount codes only redeemable through the mobile app.', { SI: 'ජංගම යෙදුම හරහා පමණක් භාවිතා කළ හැකි වට්ටම් කේත.', TA: 'மொபைல் ஆப் மூலம் மட்டும் பயன்படுத்தக்கூடிய தனிப்பட்ட தள்ளுபடி குறியீடுகள்.' }],
  ['One-tap checkout with saved addresses and payment methods.', { SI: 'සුරැකි ලිපින සහ ගෙවීම් ක්‍රම සමඟ එක් ස්පර්ශ ගෙවීම.', TA: 'சேமித்த முகவரிகள் மற்றும் கட்டண முறைகளுடன் ஒரே-தொட்டு செக்அவுட்.' }],
  ['Real-time parcel updates and live map tracking right in the app.', { SI: 'යෙදුම තුළ තථ්‍ය කාල මගී යාවත්කාලීන සහ සජීවී සිතියම් නිරීක්ෂණ.', TA: 'ஆப்பிலேயே நிகழ்நேர பார்சல் புதுப்பிப்புகள் மற்றும் நேரடி வரைபட கண்காணிப்பு.' }],
  ['Earn OMAX Coins on every purchase and redeem them for free shipping.', { SI: 'සෑම මිලදී ගැනීමකදීම OMAX කාසි ලබා ගෙන නොමිලේ නැව්ගත කිරීම සඳහා භාවිතා කරන්න.', TA: 'ஒவ்வொரு வாங்குதலிலும் OMAX நாணயங்கள் சம்பாதித்து இலவச கப்பலுக்கு பயன்படுத்துங்கள்.' }],
  ['Shop smarter with exclusive app-only deals, early Flash Sale access, and real-time alerts.', { SI: 'ජංගම යෙදුම හරහා ඒකාන්ත ගනුදෙනු, ක්ෂණික විකුණු ප්‍රවේශ සහ ඇඟවීම් ලගා කරගන්න.', TA: 'பிரத்யேக ஆப் சலுகைகள் மற்றும் விரைவான ஃபிளாஷ் சேல் அணுகலுடன் புத்திசாலித்தனமாக வாங்குங்கள்.' }],

  // ── Extra product vocabulary ──
  ['Galaxy', { SI: 'ගැලැක්සි', TA: 'கேலக்ஸி' }],
  ['Surface', { SI: 'සර්ෆස්', TA: 'சர்ஃபேஸ்' }],
  ['AirPods', { SI: 'ඒර්පොඩ්ස්', TA: 'ஏர்போட்ஸ்' }],
  ['Palette', { SI: 'වර්ණ සමූහය', TA: 'பாலட்' }],
  ['Serum', { SI: 'සිරම්', TA: 'சீரம்' }],
  ['Toner', { SI: 'ටෝනර්', TA: 'டோனர்' }],
  ['Blush', { SI: 'රතු මේකප්', TA: 'ப்ளஷ்' }],
  ['Nail', { SI: 'නියපොතු', TA: 'நகம்' }],
  ['Face', { SI: 'මුහුණ', TA: 'முகம்' }],
  ['Lash', { SI: 'කිරිල', TA: 'இமை' }],
  ['Effect', { SI: 'බලපෑම', TA: 'விளைவு' }],
  ['False', { SI: 'ව්‍යාජ', TA: 'போலி' }],
  ['Princess', { SI: 'කුමාරිකා', TA: 'இளவரசி' }],
  ['Essence', { SI: 'සාරය', TA: 'சாரம்' }],
  ['Annibale', { SI: 'ඇනිබල්', TA: 'அனிபாலே' }],
  ['Colombo', { SI: 'කොලොම්බෝ', TA: 'கொலம்போ' }],
  ['Curology', { SI: 'කියුරොලජි', TA: 'கியூரோலஜி' }],
  ['Calvin', { SI: 'කැල්වින්', TA: 'கால்வின்' }],
  ['Klein', { SI: 'ක්ලේන්', TA: 'க்ளைன்' }],
  ['Chanel', { SI: 'ෂැනල්', TA: 'சேனல்' }],
  ['Gucci', { SI: 'ගුච්චි', TA: 'குச்சி' }],
  ['Dior', { SI: 'ඩියෝ', TA: 'டியோர்' }],
  ['Knoll', { SI: 'නොල්', TA: 'நோல்' }],
  ['Storage', { SI: 'ගබඩාව', TA: 'சேமிப்பிடம்' }],
  ['Display', { SI: 'සංදර්ශකය', TA: 'திரை' }],
  ['Screen', { SI: 'තිරය', TA: 'திரை' }],
  ['Battery', { SI: 'බැටරිය', TA: 'பேட்டரி' }],
  ['Memory', { SI: 'මතකය', TA: 'நினைவகம்' }],
  ['Processor', { SI: 'ප්‍රොසෙසරය', TA: 'செயலி' }],
  ['Gaming', { SI: 'ක්‍රීඩා', TA: 'கேமிங்' }],
  ['Smart', { SI: 'ස්මාර්ට්', TA: 'ஸ்மார்ட்' }],
  ['Digital', { SI: 'ඩිජිටල්', TA: 'டிஜிட்டல்' }],
  ['Portable', { SI: 'ජංගම', TA: 'கைக்கு வசதியான' }],

  // ── Product Detail strings ──
  ['Description', { SI: 'විස්තරය', TA: 'விளக்கம்' }],
  ['Condition', { SI: 'තත්ත්වය', TA: 'நிலை' }],
  ['Warranty', { SI: 'වගකීම', TA: 'உத்தரவாதம்' }],
  ['SAVE', { SI: 'ඉතිරිය', TA: 'சேமிக்க' }],

  // ── Categories ──
  ['Fragrances', { SI: 'සුවඳ විලවුන්', TA: 'வாசனை திரவியங்கள்' }],
  ['Furniture', { SI: 'ගෘහ භාණ්ඩ', TA: 'மரச்சாமான்கள்' }],
  ['Groceries', { SI: 'සිල්ලර බඩු', TA: 'மளிகை' }],
  ['Smartphones', { SI: 'ස්මාර්ට්ෆොන්', TA: 'ஸ்மார்ட்போன்கள்' }],
  ['Laptops', { SI: 'ලැප්ටොප්', TA: 'மடிக்கணினிகள்' }],
  ['Beauty', { SI: 'රූපලාවන්‍ය', TA: 'அழகு' }],
  ['Tops', { SI: 'උඩු ඇඳුම්', TA: 'மேலாடைகள்' }],

  // ── Brands (kept in English for recognition but transliterated) ──
  ['Microsoft', { SI: 'මයික්‍රොසොෆ්ට්', TA: 'மைக்ரோசாஃப்ட்' }],
  ['Samsung', { SI: 'සැම්සුන්', TA: 'சாம்சங்' }],
  ['iPhone', { SI: 'අයිෆෝන්', TA: 'ஐபோன்' }],
  ['MacBook', { SI: 'මැක්බුක්', TA: 'மேக்புக்' }],
  ['Huawei', { SI: 'හුවාවෙයි', TA: 'ஹுவாய்' }],
  ['Logitech', { SI: 'ලොජිටෙක්', TA: 'லாஜிடெக்' }],
  ['Lenovo', { SI: 'ලෙනොවෝ', TA: 'லெனோவோ' }],
  ['Apple', { SI: 'ඇපල්', TA: 'ஆப்பிள்' }],
  ['ASUS', { SI: 'ඒසූස්', TA: 'ஆசஸ்' }],
  ['Dell', { SI: 'ඩෙල්', TA: 'டெல்' }],
  ['HP', { SI: 'එච්පී', TA: 'எச்பி' }],

  // ── Product types ──
  ['Headphones', { SI: 'හෙඩ්ෆෝන්', TA: 'ஹெட்போன்கள்' }],
  ['Sneakers', { SI: 'ස්නීකර්ස්', TA: 'ஸ்னீக்கர்கள்' }],
  ['Wardrobe', { SI: 'අල්මාරිය', TA: 'அலமாரி' }],
  ['Eyeshadow', { SI: 'අයිෂැඩෝ', TA: 'ஐஷேடோ' }],
  ['Perfume', { SI: 'සුවඳ විලවුන්', TA: 'வாசனை திரவியம்' }],
  ['Lipstick', { SI: 'තොල් ආලේපන', TA: 'லிப்ஸ்டிக்' }],
  ['Mascara', { SI: 'මස්කාරා', TA: 'மஸ்காரா' }],
  ['Wireless', { SI: 'රැහැන් රහිත', TA: 'வயர்லெஸ்' }],
  ['Bluetooth', { SI: 'බ්ලූටූත්', TA: 'புளூடூத்' }],
  ['Keyboard', { SI: 'යතුරු පුවරුව', TA: 'விசைப்பலகை' }],
  ['Monitor', { SI: 'මොනිටරය', TA: 'மானிட்டர்' }],
  ['Cabinet', { SI: 'කැබිනට්', TA: 'அலமாரி' }],
  ['Essence', { SI: 'එසෙන්ස්', TA: 'எசன்ஸ்' }],
  ['Charger', { SI: 'චාජරය', TA: 'சார்ஜர்' }],
  ['Jacket', { SI: 'ජැකට්', TA: 'ஜாக்கெட்' }],
  ['Laptop', { SI: 'ලැප්ටොප්', TA: 'மடிக்கணினி' }],
  ['Tablet', { SI: 'ටැබ්ලටය', TA: 'டேப்லெட்' }],
  ['Camera', { SI: 'කැමරාව', TA: 'கேமரா' }],
  ['Mirror', { SI: 'කැඩපත', TA: 'கண்ணாடி' }],
  ['Cotton', { SI: 'පුළුන්', TA: 'பருத்தி' }],
  ['Powder', { SI: 'පවුඩර්', TA: 'பவுடர்' }],
  ['Cable', { SI: 'කේබල්', TA: 'கேபிள்' }],
  ['Mouse', { SI: 'මූසිකය', TA: 'சுட்டி' }],
  ['Watch', { SI: 'ඔරලෝසුව', TA: 'கடிகாரம்' }],
  ['Phone', { SI: 'දුරකථනය', TA: 'தொலைபேசி' }],
  ['Cream', { SI: 'ක්‍රීම්', TA: 'கிரீம்' }],
  ['Dress', { SI: 'ඇඳුම', TA: 'உடை' }],
  ['Shirt', { SI: 'කමිසය', TA: 'சட்டை' }],
  ['Shoes', { SI: 'සපත්තු', TA: 'காலணிகள்' }],
  ['Jeans', { SI: 'ජීන්ස්', TA: 'ஜீன்ஸ்' }],
  ['Socks', { SI: 'මේස්', TA: 'சாக்ஸ்' }],
  ['Lamp', { SI: 'ලාම්පුව', TA: 'விளக்கு' }],
  ['Desk', { SI: 'මේසය', TA: 'மேசை' }],
  ['Belt', { SI: 'බෙල්ට්', TA: 'பெல்ட்' }],
  ['Silk', { SI: 'සේද', TA: 'பட்டு' }],
  ['Bag', { SI: 'බෑගය', TA: 'பை' }],
  ['Bed', { SI: 'ඇඳ', TA: 'படுக்கை' }],
  ['Oil', { SI: 'තෙල්', TA: 'எண்ணெய்' }],

  // ── Food ──
  ['Vegetable', { SI: 'එළවළු', TA: 'காய்கறி' }],
  ['Butter', { SI: 'බටර්', TA: 'வெண்ணெய்' }],
  ['Cheese', { SI: 'චීස්', TA: 'சீஸ்' }],
  ['Bread', { SI: 'පාන්', TA: 'ரொட்டி' }],
  ['Fruit', { SI: 'පලතුරු', TA: 'பழம்' }],
  ['Water', { SI: 'වතුර', TA: 'தண்ணீர்' }],
  ['Juice', { SI: 'යුෂ', TA: 'சாறு' }],
  ['Meat', { SI: 'මස්', TA: 'இறைச்சி' }],
  ['Milk', { SI: 'කිරි', TA: 'பால்' }],
  ['Egg', { SI: 'බිත්තර', TA: 'முட்டை' }],

  // ── Modifier words ──
  ['Organic', { SI: 'කාබනික', TA: 'ஆர்கானிக்' }],
  ['Natural', { SI: 'ස්වාභාවික', TA: 'இயற்கை' }],
  ['Premium', { SI: 'වාරික', TA: 'பிரீமியம்' }],
  ['Original', { SI: 'මුල්', TA: 'அசல்' }],
  ['Luxury', { SI: 'සුඛෝපභෝගී', TA: 'சொகுசு' }],
  ['Ultra', { SI: 'අල්ට්‍රා', TA: 'அல்ட்ரா' }],
  ['Table', { SI: 'මේසය', TA: 'அட்டவணை' }],
  ['Chair', { SI: 'පුටුව', TA: 'நாற்காலி' }],

  // ── Seller page ──
  ['Zero Listing Fees', { SI: 'ලැයිස්තු ගාස්තු නොමිලේ', TA: 'பட்டியல் கட்டணம் இல்லை' }],
  ['Reach Millions', { SI: 'මිලියන ගනනකට ළඟා වන්න', TA: 'மில்லியன் கணக்கானோரை எட்டுங்கள்' }],
  ['Seller Dashboard', { SI: 'විකුණුම්කරු ඩෑෂ්බෝඩ්', TA: 'விற்பனையாளர் டாஷ்போர்டு' }],
  ['Seller Protection', { SI: 'විකුණුම්කරු ආරක්ෂාව', TA: 'விற்பனையாளர் பாதுகாப்பு' }],
  ['Logistics Support', { SI: 'සැපයුම් දාම සහාය', TA: 'தளவாட ஆதரவு' }],
  ['Marketing Tools', { SI: 'අලෙවිකරණ මෙවලම්', TA: 'சந்தைப்படுத்தல் கருவிகள்' }],
  ['Register', { SI: 'ලියාපදිංචි වන්න', TA: 'பதிவு செய்யுங்கள்' }],
  ['List Products', { SI: 'නිෂ්පාදන ලැයිස්තු කරන්න', TA: 'தயாரிப்புகளை பட்டியலிடுங்கள்' }],
  ['Start Selling', { SI: 'විකිණීම ආරම්භ කරන්න', TA: 'விற்பனையை தொடங்குங்கள்' }],
  ['Get Paid', { SI: 'ගෙවීම ලබා ගන්න', TA: 'கட்டணம் பெறுங்கள்' }],
  ['Popular', { SI: 'ජනප්‍රිය', TA: 'பிரபலம்' }],
  ['Customers', { SI: 'ගනුදෙනුකරුවන්', TA: 'வாடிக்கையாளர்கள்' }],

  // ── Common UI ──
  ['Apply', { SI: 'අදාළ කරන්න', TA: 'விண்ணப்பிக்கவும்' }],
  ['Remove', { SI: 'ඉවත් කරන්න', TA: 'அகற்று' }],
  ['Clear?', { SI: 'ඉවත් කරන්න?', TA: 'அழிக்கவா?' }],
  ['Search', { SI: 'සොයන්න', TA: 'தேடல்' }],
  ['Login', { SI: 'ඇතුල් වන්න', TA: 'உள்நுழைய' }],
  ['Logout', { SI: 'පිටවෙන්න', TA: 'வெளியேறு' }],
  ['Welcome', { SI: 'සාදරයෙන් පිළිගනිමු', TA: 'வரவேற்கிறோம்' }],
  ['Username', { SI: 'පරිශීලක නාමය', TA: 'பயனர்பெயர்' }],
  ['Password', { SI: 'මුරපදය', TA: 'கடவுச்சொல்' }],
  ['First Name', { SI: 'මුල් නම', TA: 'முதல் பெயர்' }],
  ['Last Name', { SI: 'අවසාන නම', TA: 'கடைசி பெயர்' }],
  ['Email', { SI: 'විද්‍යුත් තැපෑල', TA: 'மின்னஞ்சல்' }],
  ['Name', { SI: 'නම', TA: 'பெயர்' }],
  ['Country', { SI: 'රට', TA: 'நாடு' }],
  ['City', { SI: 'නගරය', TA: 'நகரம்' }],
  ['Subtotal', { SI: 'අනුපූරක එකතුව', TA: 'துணை மொத்தம்' }],
  ['Shipping', { SI: 'නැව් ගාස්තු', TA: 'கப்பல்' }],
  ['Coupon', { SI: 'කූපන්', TA: 'கூப்பன்' }],
  ['PayPal', { SI: 'පේපෑල්', TA: 'பேபால்' }],
  ['Light', { SI: 'ආලෝකය', TA: 'ஒளி' }],
  ['Dark', { SI: 'අඳුරු', TA: 'இருள்' }],
  ['YES', { SI: 'ඔව්', TA: 'ஆம்' }],
  ['NO', { SI: 'නැත', TA: 'இல்லை' }],
  ['OMAX', { SI: 'OMAX', TA: 'OMAX' }],
  ['Pro', { SI: 'ප්‍රෝ', TA: 'ப்ரோ' }],
  ['Max', { SI: 'මැක்ස்', TA: 'மேக்ஸ்' }],
  ['All', { SI: 'සියල්ල', TA: 'அனைத்தும்' }],
  ['Fashion', { SI: 'විලාසිතා', TA: 'ஃபேஷன்' }],

  // ── Profile labels ──
  ['My Profile', { SI: 'මගේ පැතිකඩ', TA: 'என் சுயவிவரம்' }],
]

// Pre-sort by key length descending once (phrases beat single words).
const WORDS_DICT = WORDS_DICT_RAW.sort((a, b) => b[0].length - a[0].length)

// ---------------------------------------------------------------------------
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

  // Simple translation cache — cleared when language changes.
  const _cache: Record<string, Record<string, string>> = { EN: {}, SI: {}, TA: {} }

  function setLanguage(code: string) {
    if (LANGUAGES.some(l => l.code === code)) {
      selectedCode.value = code
      localStorage.setItem('language', code)
      _cache[code] = {}
    }
  }

  function translateDynamic(text: string): string {
    if (!text) return text
    const lang = selectedCode.value
    if (lang === 'EN') return text

    if (_cache[lang]?.[text] !== undefined) return _cache[lang]![text]!

    // 1. Full exact match (case-insensitive).
    for (const [enWord, translations] of WORDS_DICT) {
      if (text.trim().toLowerCase() === enWord.toLowerCase()) {
        const result = translations[lang] ?? text
        if (!_cache[lang]) _cache[lang] = {}
        _cache[lang]![text] = result
        return result
      }
    }

    // 2. Word-by-word substitution using simple case-insensitive global replace.
    //    We use \b only for ASCII words; for multi-word phrases we use a plain
    //    case-insensitive string replace which is far more reliable.
    let out = text
    for (const [enWord, translations] of WORDS_DICT) {
      const trans = translations[lang]
      if (!trans) continue
      // Build a regex: word boundary aware for single words, plain for phrases
      const isPhrase = enWord.includes(' ') || enWord.includes('-')
      const pattern = isPhrase
        ? new RegExp(enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        : new RegExp(`(?<![\\w\\u0D80-\\u0DFF\\u0B80-\\u0BFF])${enWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w\\u0D80-\\u0DFF\\u0B80-\\u0BFF])`, 'gi')
      out = out.replace(pattern, trans)
    }

    if (!_cache[lang]) _cache[lang] = {}
    _cache[lang]![text] = out
    return out
  }

  const t = computed(() => (DICTIONARY[selectedCode.value] || DICTIONARY['EN']) as TranslationMap)

  async function translateWithAPI(text: string): Promise<string> {
    if (!text || selectedCode.value === 'EN') return text

    // First try the existing dictionary
    const dictTranslation = translateDynamic(text)
    if (dictTranslation !== text) return dictTranslation

    // If not found, use MyMemory API for translation (free, no key required)
    try {
      const targetLang = selectedCode.value === 'SI' ? 'si' : selectedCode.value === 'TA' ? 'ta' : 'en'
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `en|${targetLang}`
        }
      })
      
      const translated = response.data.responseData.translatedText
      
      // MyMemory sometimes returns the original if no translation found
      if (translated && translated !== text && translated.trim() !== '') {
        // Cache it
        if (!_cache[selectedCode.value]) _cache[selectedCode.value] = {}
        _cache[selectedCode.value]![text] = translated
        return translated
      } else {
        // If no translation, return original
        return text
      }
    } catch (error) {
      console.error('Translation API error:', error)
      return text // fallback to original
    }
  }

  return { selectedCode, selectedTitle, LANGUAGES, setLanguage, t, translateDynamic, translateWithAPI }
})
