import json
import os
import pandas as pd


basePath = os.path.dirname(__file__)
csvFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "Cyberpop.csv")
print(csvFilePath)
jsonFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "participate_users.json")
print(jsonFilePath)

form_dataframe = pd.read_csv(csvFilePath, header=None).dropna()
form_result = form_dataframe.values.tolist()
column_names = form_result[0]
# dict_form_result = {}
# for data in form_result[1:]:
#     if len(data[-1]) != 44:
#         continue
#     dict_form_result[data[-1]] = {"data": data}
dict_form_result = {}
for data in form_result[1:]:
    if len(data[4]) != 42:
        continue
    dict_form_result[data[4]] = data

with open(jsonFilePath, 'w', encoding='utf-8') as wf:
    json.dump(dict_form_result, wf, ensure_ascii=False)

# jsonFile = open(jsonFilePath, 'w', encoding='utf-8')

# fieldNames = ("Email Address", "Twitter ID", "Discord ID", "Wallet Address (SOL)")
# reader = csv.DictReader(csvFile, fieldNames)

# jsonFile.write('[')
# for row in reader:
#     json.dump(row, jsonFile)
#     jsonFile.write(',')
# jsonFile.write(']')

# csvFile.close()
# jsonFile.close()
