from collections import Counter
import json
import os
import pandas as pd


def getDepositedUser(base_data):
    boba_mainnet_data = base_data["boba_mainnet"]
    bsc_mainnet_data = base_data["bsc_mainnet"]

    target_dict = dict(Counter(boba_mainnet_data) + Counter(bsc_mainnet_data))
    result = dict(sorted(target_dict.items(), key=lambda x: x[1], reverse=True))

    return result


def getFormUser(file_path):
    form_result = pd.read_csv(file_path, header=None, skiprows=1).values.tolist()
    return dict(form_result)


if __name__ == "__main__":
    base_data = json.load(open(os.path.join(os.path.dirname(
        __file__), "utils", "now_deposited_user.json")), encoding="utf-8")
    forms_file = os.path.join(os.path.dirname(
        __file__), "utils", "test_forms.csv")
    result_file = os.path.join(os.path.dirname(
        __file__), "utils", "result.csv")

    deposited_result = getDepositedUser(base_data)
    # print(deposited_result)

    form_result = getFormUser(forms_file)
    # print(form_result)

    result = []
    for address in deposited_result.keys():
        if address in set(form_result.keys()):
            result.append([address, deposited_result[address], form_result[address]])

        if len(result) >= 100:
            break

    dataframe = pd.DataFrame(result, columns=['BRE Address', 'Deposited Value', 'Solana Address'])
    dataframe.to_csv(result_file, index=False)
