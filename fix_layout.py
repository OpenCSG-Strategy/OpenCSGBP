import re

files = [
    'index.html',
    'assets/deck-refine.css',
    'assets/deck-appendix.css'
]

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # In index.html, remove the 01 reference system block completely
    if file_path == 'index.html':
        content = re.sub(r'/\* 01 reference system:.*?\*/.*?@media\(max-width:900px\)', '@media(max-width:900px)', content, flags=re.DOTALL)
        
    # Replace compact margins with elegant margins
    content = re.sub(r'left:\s*28px\s*;', 'left:78px;', content)
    content = re.sub(r'right:\s*28px\s*;', 'right:78px;', content)
    content = re.sub(r'top:\s*14[45]px\s*;', 'top:226px;', content)
    content = re.sub(r'top:\s*13[78]px\s*;', 'top:228px;', content)
    
    # Heights
    content = re.sub(r'height:\s*68[08]px\s*;', 'height:575px;', content)
    content = re.sub(r'height:\s*69[067]px\s*;', 'height:575px;', content)
    
    # Some specific fixes
    content = re.sub(r'top:\s*61px\s*;', 'top:136px;', content)  # .title
    content = re.sub(r'top:\s*22px\s*;', 'top:104px;', content)  # .section
    content = re.sub(r'bottom:\s*11px\s*;', 'bottom:26px;', content) # .foot
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

for file in files:
    replace_in_file(file)

print("Layout optimized!")
