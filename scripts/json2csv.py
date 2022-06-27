import json
import os
import pandas as pd


basePath = os.path.dirname(__file__)
jsonFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "move_matedata.json")
print(jsonFilePath)
csvFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "Move_Matedata.csv")
print(csvFilePath)

rf = open(jsonFilePath, 'r', encoding="utf-8")
data = json.load(rf)
print(data)
rf.close()

result = []
for key, value in data.items():
    result.append([key, value])

column_names = ["TokenID", "Rarity"]
pd.DataFrame(result, columns=column_names).to_csv(
    csvFilePath, index=False, encoding='utf-8')
