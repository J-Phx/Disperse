"""
100  (end: 5/19 17:00)
discord  neopets   &&   twitter bobabrewery & neopets
retweet & like  -> https://twitter.com/boba_brewery/status/1526126721182797824

balance top 100 SOL Address (sort)
"""
import os
import json
import pandas as pd


if __name__ == "__main__":
    cyberpop_followers_file = os.path.join(os.path.dirname(
        __file__), "cyberpop_followers.json")
    brewery_followers_file = os.path.join(os.path.dirname(
        __file__), "brewery_followers.json")
    rt_and_like_users_file = os.path.join(os.path.dirname(
        __file__), "rt_and_like_users.json")
    participate_users_file = os.path.join(os.path.dirname(
        __file__), "participate_users.json")
    users_balance_file = os.path.join(os.path.dirname(
        __file__), "BNB_Holder.json")
    outFilePath = os.path.join(os.path.dirname(
        __file__), "TW_Active_Result.csv")

    # discord_members_infos = pd.read_csv(discord_member_file).values.tolist()
    # discord_members = set([info[0] for info in discord_members_infos])
    # print(f"Neopets discord members: {len(discord_members)}")

    brewery_followers = set(json.load(open(brewery_followers_file, 'r', encoding='utf-8')).values())
    print(f"Brewery twitter followers: {len(brewery_followers)}")

    cyberpop_followers = set(json.load(open(cyberpop_followers_file, 'r', encoding='utf-8')).values())
    print(f"Neopets twitter followers: {len(cyberpop_followers)}")

    rt_and_like_users = set(json.load(open(rt_and_like_users_file, 'r', encoding='utf-8')).values())
    print(f"RT and Like users: {len(rt_and_like_users)}")

    participate_user_infos = json.load(open(participate_users_file, 'r', encoding='utf-8'))
    print(f"Participate users: {len(participate_user_infos)}")

    users_balance_infos = json.load(open(users_balance_file, 'r', encoding='utf-8'))
    print(f"Users balance info: {len(users_balance_infos)}")

    filter_users = {}
    for address, balance in users_balance_infos.items():
        if balance == 0:
            continue
        filter_users[address] = balance
    participate_users = dict(sorted(filter_users.items(), key=lambda x: x[1], reverse=True))
    print(f"Filter participate users: {len(participate_users)}")

    result = []
    for address, balance in participate_users.items():
        data = participate_user_infos[address]
        emil = data[1]
        tw_username = data[2]
        dc_username = data[3]

        if tw_username.startswith('@'):
            tw_username = tw_username[1:]
        if tw_username.startswith('http'):
            tw_username = tw_username.split("/")[-1]
        # if dc_username.startswith('@'):
        #     dc_username = "".join(dc_username[1:].split("#"))
        # else:
        #     dc_username = "".join(dc_username.split("#"))

        if not tw_username in brewery_followers:
            continue
        if not tw_username in cyberpop_followers:
            continue
        if not tw_username in rt_and_like_users:
            continue
        # if not dc_username in discord_members:
        #     continue
        data.append(balance / 1e18)
        result.append(data)

    columns = ["Timestamp", "Email Address", "Twitter ID", "Discord ID", "Wallet Address (bep20)", "BNB Balance"]
    pd.DataFrame(result, columns=columns).to_csv(
        outFilePath, index=False, encoding='utf-8')

    # for infos in participate_users.values():
