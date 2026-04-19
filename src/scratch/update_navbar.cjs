const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../src/components/NavBar.vue');

try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // 1. Update ribbon
    const oldRibbon = 'py-2 md:py-1.5 border-b border-white/10"';
    const newRibbon = 'border-b border-white/10 transition-all duration-300" :class="isScrolled ? \'py-0.5 md:py-1\' : \'py-2 md:py-1.5\'"';
    if (content.includes(oldRibbon)) {
        content = content.replace(oldRibbon, newRibbon);
    }

    // 2. Update header padding
    const oldHeader = ":class=\"isScrolled ? 'py-1 md:py-1.5' : 'py-1.5 md:py-4'\"";
    const newHeader = ":class=\"isScrolled ? 'py-0.5 md:py-0.5' : 'py-1.5 md:py-4'\"";
    if (content.includes(oldHeader)) {
        content = content.replace(oldHeader, newHeader);
    }

    // 3. Update logo size
    const oldLogo = ":class=\"isScrolled ? 'sm:h-12 sm:w-36 md:h-16 md:w-[220px]' : 'sm:h-14 sm:w-44 md:h-28 md:w-[320px]'\"";
    const newLogo = ":class=\"isScrolled ? 'sm:h-10 sm:w-30 md:h-10 md:w-[150px]' : 'sm:h-14 sm:w-44 md:h-28 md:w-[320px]'\"";
    if (content.includes(oldLogo)) {
        content = content.replace(oldLogo, newLogo);
    }

    if (content === originalContent) {
        console.error("No strings were replaced! Please check the search patterns.");
        process.exit(1);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully updated NavBar.vue");
} catch (err) {
    console.error("Error updating file:", err);
    process.exit(1);
}
