"""
100  (end: 5/19 17:00)
discord  neopets   &&   twitter bobabrewery & neopets
retweet & like  -> https://twitter.com/boba_brewery/status/1526126721182797824

balance top 100 SOL Address (sort)
"""
import os
import json
from tkinter.tix import Tree
import pandas as pd


if __name__ == "__main__":
    discord_member_file = os.path.join(os.path.dirname(
        __file__), "discord_members.csv")
    neopets_followers_file = os.path.join(os.path.dirname(
        __file__), "neopets_followers.json")
    brewery_followers_file = os.path.join(os.path.dirname(
        __file__), "brewery_followers.json")
    rt_and_like_users_file = os.path.join(os.path.dirname(
        __file__), "rt_and_like_users.json")
    participate_users_file = os.path.join(os.path.dirname(
        __file__), "participate_users.json")
    outFilePath = os.path.join(os.path.dirname(
        __file__), "TW_Active_Result.csv")

    discord_members_infos = pd.read_csv(discord_member_file).values.tolist()
    discord_members = set([info[0] for info in discord_members_infos])
    print(f"Neopets discord members: {len(discord_members)}")

    brewery_followers = set(json.load(open(brewery_followers_file, 'r', encoding='utf-8')).values())
    print(f"Brewery twitter followers: {len(brewery_followers)}")

    neopets_followers = set(json.load(open(neopets_followers_file, 'r', encoding='utf-8')).values())
    print(f"Neopets twitter followers: {len(neopets_followers)}")

    rt_and_like_users = set(json.load(open(rt_and_like_users_file, 'r', encoding='utf-8')).values())
    print(f"RT and Like users: {len(rt_and_like_users)}")

    participate_users = json.load(open(participate_users_file, 'r', encoding='utf-8'))
    print(f"Participate users: {len(participate_users)}")

    filter_users = {}
    for address, data in participate_users.items():
        if data.get("balance") is None:
            continue
        if data["balance"] == 0:
            continue
        filter_users[address] = data
    participate_users_infos = dict(sorted(filter_users.items(), key=lambda x: x[1]['balance'], reverse=True))
    print(f"Filter participate users: {len(participate_users_infos)}")

    result = []
    for infos in participate_users_infos.values():
        data = infos["data"]
        balance = infos["balance"]
        emil = data[0]
        tw_username = data[1]
        dc_username = data[2]
        sol_address = data[3]

        if tw_username.startswith('@'):
            tw_username = tw_username[1:]
        if dc_username.startswith('@'):
            dc_username = "".join(dc_username[1:].split("#"))
        else:
            dc_username = "".join(dc_username.split("#"))

        if not tw_username in brewery_followers:
            continue
        if not tw_username in neopets_followers:
            continue
        if not tw_username in rt_and_like_users:
            continue
        # if not dc_username in discord_members:
        #     continue
        data.append(balance / 1e9)
        result.append(data)

    columns = ["Email Address", "Twitter ID", "Discord ID", "Wallet Address (SOL)", "SOL Balance"]
    pd.DataFrame(result, columns=columns).to_csv(
        outFilePath, index=False, encoding='utf-8')

    # for infos in participate_users.values():
