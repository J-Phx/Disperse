import json
import os
import pandas as pd


if __name__ == "__main__":
    basePath = os.path.dirname(__file__)
    BRE_Holder_Forms_file = os.path.join(os.path.dirname(
        __file__), "BRE_Holder_Forms.csv")
    print(BRE_Holder_Forms_file)
    jsonFilePath = os.path.join(os.path.dirname(
        __file__), "BRE_Holder_Forms.json")
    print(jsonFilePath)
    outFilePath = os.path.join(os.path.dirname(
        __file__), "BRE_Holder_Result.csv")
    print(outFilePath)

    with open(jsonFilePath, 'r', encoding='utf-8') as rf:
        bre_balance_infos = json.load(rf)

    bre_balance_infos = dict(sorted(bre_balance_infos.items(), key=lambda x: x[1], reverse=True))

    form_dataframe = pd.read_csv(BRE_Holder_Forms_file, header=None).dropna()
    form_result = form_dataframe.values.tolist()
    column_names = form_result[0]
    # dict_form_result = {}
    # for data in form_result[1:]:
    #     if len(data[-1]) != 44:
    #         continue
    #     dict_form_result[data[-1]] = {"data": data}
    dict_form_result = {}
    for data in form_result[1:]:
        if len(data[1]) != 42:
            continue
        if len(data[-1]) != 44:
            continue
        dict_form_result[data[1]] = data

    result = []
    for address, balance in bre_balance_infos.items():
        if balance == 0:
            continue
        if not dict_form_result.get(address):
            continue
        dict_form_result[address].append(balance / 1e18)
        result.append(dict_form_result[address])

    column_names.append("BRE Balance")
    pd.DataFrame(result, columns=column_names).to_csv(
        outFilePath, index=False, encoding='utf-8')
