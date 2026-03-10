import os

files = [
    'submodule1.html',
    'submodule2.html',
    'submodule3.html',
    'submodule4.html'
]

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r') as file:
        content = file.read()
    
    # Target specific hidden display style on globalNotes
    target_str = 'z-index: 100; display: none;"'
    replace_str = 'z-index: 100;"'

    if target_str in content:
        content = content.replace(target_str, replace_str)
        with open(f, 'w') as file:
            file.write(content)
        print(f"Fixed {f}")
