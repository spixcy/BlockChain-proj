import os

filepath = 'api/src/main/java/com/sih/api/entity/AuditLogEntry.java'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add getId method if not present
if 'public Long getId()' not in content:
    content = content.replace('public void setUsername', 'public Long getId() { return id; }\n    public void setUsername')
    
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed AuditLogEntry.java!")
