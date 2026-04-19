import sys

file_path = r'c:\Users\omind\OneDrive\Desktop\Anti\Online-Shopping-Stores\src\components\NavBar.vue'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update ribbon
old_ribbon = 'py-2 md:py-1.5 border-b border-white/10"'
new_ribbon = 'border-b border-white/10 transition-all duration-300" :class="isScrolled ? \'py-0.5 md:py-1\' : \'py-2 md:py-1.5\'"'
content = content.replace(old_ribbon, new_ribbon)

# 2. Update header padding
old_header = ":class=\"isScrolled ? 'py-1 md:py-1.5' : 'py-1.5 md:py-4'\""
new_header = ":class=\"isScrolled ? 'py-0.5 md:py-0.5' : 'py-1.5 md:py-4'\""
content = content.replace(old_header, new_header)

# 3. Update logo size
old_logo = ":class=\"isScrolled ? 'sm:h-12 sm:w-36 md:h-16 md:w-[220px]' : 'sm:h-14 sm:w-44 md:h-28 md:w-[320px]'\""
new_logo = ":class=\"isScrolled ? 'sm:h-10 sm:w-30 md:h-10 md:w-[150px]' : 'sm:h-14 sm:w-44 md:h-28 md:w-[320px]'\""
content = content.replace(old_logo, new_logo)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated NavBar.vue")
