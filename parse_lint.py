import json
import sys

try:
    with open('c:/Users/Manish.g/PlacementPro/frontend/lint_json.txt', 'r', encoding='utf-16') as f:
        data = f.read()
except:
    with open('c:/Users/Manish.g/PlacementPro/frontend/lint_json.txt', 'r', encoding='utf-8') as f:
        data = f.read()

try:
    results = json.loads(data)
    for file_res in results:
        if file_res['errorCount'] > 0:
            print(f"File: {file_res['filePath']}")
            for msg in file_res['messages']:
                if msg['severity'] == 2:
                    print(f"  Line {msg['line']}: {msg['ruleId']} - {msg['message']}")
except Exception as e:
    print(f"Error parsing JSON: {e}")
