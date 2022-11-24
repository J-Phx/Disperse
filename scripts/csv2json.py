import json
import os
import pandas as pd
from collections import Counter


basePath = os.path.dirname(__file__)
csvFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "LetsGoDay-AMA.csv")
print(csvFilePath)
outFilePath = os.path.join(os.path.dirname(
    __file__), "utils", "airdrop_address_info.json")
print(outFilePath)

form_dataframe = pd.read_csv(csvFilePath, header=None).dropna()
form_result = form_dataframe.values.tolist()

# print(form_result[1])
# result = list(form_emails & user_emails)

# result_emails = []

# for key in result:
#     if user_email_dict.get(key):
#         result_emails.append(user_email_dict.get(key))

# pd.DataFrame(result_emails, columns=column_names).to_csv(
#     outFilePath, index=False, encoding='utf-8')
dict_form_result = []
for data in form_result:
    if len(data[1]) != 42:
        continue
    dict_form_result.append(data[1])
# genesis_nft_holders = {}
# bre_holders = {}
# for data in form_result[1:]:
#     if len(data[6]) == 42:
#         genesis_nft_holders[data[6]] = data
#     if len(data[7]) == 42:
#         bre_holders[data[7]] = {"data": data, "balance": 0}

# print(f"The number of nft holder: {len(genesis_nft_holders.keys())}")
# print(f"The number of bre holder: {len(bre_holders.keys())}")

# with open(nftHolderFilePath, 'w', encoding='utf-8') as wf:
#     json.dump(genesis_nft_holders, wf, ensure_ascii=False)
# votes = [item[-1] for item in dict_form_result]
# print(Counter(votes))
with open(outFilePath, 'w', encoding='utf-8') as wf:
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
