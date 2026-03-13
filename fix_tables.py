import os
import re

directoryPath = os.path.join(os.path.dirname(__file__), 'src/app')

def process_file(file_path):
    if not file_path.endswith('.js') and not file_path.endswith('.jsx'):
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content

    # 1. Add fixed: 'right' to action column
    # Look for { title: '操作', ..., key: 'action', ... }
    # Only applies if it doesn't already have fixed
    def replace_action(match):
        p1 = match.group(1)
        if 'fixed:' in p1:
            return match.group(0)
        return p1 + ", fixed: 'right' }"

    content = re.sub(r'({\s*(?:title)?[^}]*?[\'"`]操作[\'"`][^}]*?key\s*:\s*[\'"`]action[\'"`][^}]*)}', replace_action, content)

    # 2. Add scroll and rowSelection to <Table ... />
    def replace_table(match):
        p1 = match.group(1)
        new_attr = p1
        if 'scroll=' not in new_attr:
            new_attr += " scroll={{ x: 'max-content' }}"
        if 'rowSelection=' not in new_attr and 'dataSource=' in new_attr: 
            # Only add to data tables, sometimes <Table> wrapper exists without data but we want to be safe
            new_attr += " rowSelection={{ type: 'checkbox', fixed: 'left' }}"
        return f"<Table {new_attr}>"

    content = re.sub(r'<Table\s+([^>]*?)>', replace_table, content)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {file_path}")

for root, _, files in os.walk(directoryPath):
    for f in files:
        process_file(os.path.join(root, f))
print('Processing complete.')
