from ast import alias
from collections import Counter
import json
import os
import pandas as pd


def getDepositedUser(base_data):
    boba_mainnet_data = base_data["boba_mainnet"]
    bsc_mainnet_data = base_data["bsc_mainnet"]

    target_dict = dict(Counter(boba_mainnet_data) + Counter(bsc_mainnet_data))
    result = dict(sorted(target_dict.items(), key=lambda x: x[1], reverse=True))
    result = {key.lower(): value for key, value in result.items()}

    return result


def getFormUser(file_path):
    form_result = pd.read_csv(file_path, header=None).values.tolist()
    column_names = form_result[0]
    dict_form_result = {}
    for data in form_result[1:]:
        dict_form_result[data[1].lower()] = data
    return column_names, dict_form_result


if __name__ == "__main__":
    base_data = json.load(open(os.path.join(os.path.dirname(
        __file__), "utils", "now_deposited_user.json")), encoding="utf-8")
    forms_file = os.path.join(os.path.dirname(
        __file__), "utils", "LPLottery.csv")
    result_file = os.path.join(os.path.dirname(
        __file__), "utils", "LP Lottery Result.csv")

    deposited_result = getDepositedUser(base_data)
    # print(deposited_result)

    column_names, form_result = getFormUser(forms_file)
    # print(form_result)

    result = []
    deposited_addresses = set(deposited_result.keys())
    for address in form_result.keys():
        if address in deposited_addresses:
            result.append(form_result[address])

    # for address in deposited_result.keys():
    #     if address in set(form_result.keys()):
    #         result.append([address, deposited_result[address], form_result[address]])

        if len(result) >= 100:
            break

    # allies
    allies = [["f871465811@gmail.com", "0x8A9800738483e9D42CA377D8F95cc5960e6912d1",
               "8iDapeTgZ51atdZwsKYQM8QGQqYfW3MS2ELzVNvBfzcY"],
              ["zhhd1102@gmail.com", "0xb092f99caF9c0Cf7e82d08330AcCa8cC56699999",
               "8QvEPZ5rWb5QaciJGKb7JhcF5Hx12mjP62UHzQpVpmY1"],
              ["daqingchong0809@gmail.com", "0xa24846D2dC7c9B0618E12F4a8026237856D08888",
               "Gs6M1Ab4QUZvHedpUqEUbRwFXUJCZAdnMMTAWgvNKHD8"]]
    result.extend(allies)

    dataframe = pd.DataFrame(result, columns=column_names)
    dataframe.to_csv(result_file, index=False)
