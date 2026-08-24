import os
import codecs

api_dir = 'api/src/main/java'

for root, _, files in os.walk(api_dir):
    for file in files:
        if file.endswith('.java'):
            filepath = os.path.join(root, file)
            
            # Read with utf-8-sig to automatically remove BOM if it exists
            with codecs.open(filepath, 'r', 'utf-8-sig') as f:
                content = f.read()
            
            # Fix the literal backtick 'n' that PowerShell accidentally inserted
            # We search for backtick followed by n
            content = content.replace('`' + 'n', '\n')
            
            # Write back as standard utf-8 (without BOM)
            with codecs.open(filepath, 'w', 'utf-8') as f:
                f.write(content)

print("Fixed Java file encodings and syntax!")
