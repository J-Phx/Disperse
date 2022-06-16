import json
import os
import pandas as pd


basePath = os.path.dirname(__file__)
csvFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "cyberpop-giveaway.csv")
print(csvFilePath)
nftHolderFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "genesis_nft_holders_info.json")
print(nftHolderFilePath)
breHolderFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "bre_holders_info.json")
print(breHolderFilePath)

form_dataframe = pd.read_csv(csvFilePath, header=None).dropna()
form_result = form_dataframe.values.tolist()
column_names = form_result[0]
# dict_form_result = {}
# for data in form_result[1:]:
#     if len(data[-1]) != 44:
#         continue
#     dict_form_result[data[-1]] = {"data": data}
genesis_nft_holders = {}
bre_holders = {}
for data in form_result[1:]:
    if len(data[6]) == 42:
        genesis_nft_holders[data[6]] = data
    if len(data[7]) == 42:
        bre_holders[data[7]] = {"data": data, "balance": 0}

print(f"The number of nft holder: {len(genesis_nft_holders.keys())}")
print(f"The number of bre holder: {len(bre_holders.keys())}")

with open(nftHolderFilePath, 'w', encoding='utf-8') as wf:
    json.dump(genesis_nft_holders, wf, ensure_ascii=False)
with open(breHolderFilePath, 'w', encoding='utf-8') as wf:
    json.dump(bre_holders, wf, ensure_ascii=False)

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
