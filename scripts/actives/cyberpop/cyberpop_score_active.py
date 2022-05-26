"""
100  (end: 5/19 17:00)
discord  neopets   &&   twitter bobabrewery & neopets
retweet & like  -> https://twitter.com/boba_brewery/status/1526126721182797824

balance top 100 SOL Address (sort)
"""
from cmath import inf
import os
import json
from tkinter.tix import Tree
import pandas as pd


if __name__ == "__main__":
    score_file = os.path.join(os.path.dirname(
        __file__), "Cyberpop_score.csv")
    score_output_file = os.path.join(os.path.dirname(
        __file__), "Cyberpop_score_result.csv")
    # users_balance_file = os.path.join(os.path.dirname(
    #     __file__), "BNB_Holder.json")
    score_users_balance_file = os.path.join(os.path.dirname(
        __file__), "Score_BNB_Holder.json")
    users_balance_infos = json.load(open(score_users_balance_file, 'r', encoding='utf-8'))
    print(f"Users balance info: {len(users_balance_infos)}")
    form_dataframe = pd.read_csv(score_file, header=None).dropna()
    form_result = form_dataframe.values.tolist()
    column_names = form_result[0]
    # dict_form_result = {}
    # for data in form_result[1:]:
    #     if len(data[-1]) != 44:
    #         continue
    #     dict_form_result[data[-1]] = {"data": data}
    dict_form_result = {}
    # user_balance = {}
    for data in form_result[1:]:
        if data[2] != "5 / 5":
            continue
        if len(data[8]) != 42:
            continue
        if not data[8].startswith("0x"):
            continue
        balance = users_balance_infos[data[8]] if users_balance_infos.get(data[8]) else 0
        dict_form_result[data[8]] = {"data": data, "balance": balance}
    #     user_balance[data[8]] = balance
    # with open(score_users_balance_file, 'w', encoding='utf-8') as wf:
    #     json.dump(user_balance, wf, ensure_ascii=False)

    result = []
    result.extend([info["data"] for info in list(dict_form_result.values())[:200]])

    participate_users_infos = list(
        dict(
            sorted(
                list(dict_form_result.items())[200:],
                key=lambda x: x[1]['balance'],
                reverse=True)).values())[:500]
    participate_users = []
    for index, info in enumerate(participate_users_infos):
        if index > 299:
            if info["balance"] == 0:
                continue
        participate_users.append(info["data"])
    result.extend(participate_users)
    print(f"Result length: {len(result)}")

    pd.DataFrame(result, columns=column_names).to_csv(
        score_output_file, index=False, encoding='utf-8')

    # for infos in participate_users.values():
