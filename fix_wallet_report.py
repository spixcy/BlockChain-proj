import os

filepath = 'api/src/main/java/com/sih/api/entity/WalletReport.java'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add getId method if not present
if 'public Long getId()' not in content:
    content = content.replace('public void setInvestigationCase', 'public Long getId() { return id; }\n    public void setInvestigationCase')
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed WalletReport.java!")
