"""
100  (end: 7/23 17:00)
discord  neopets   &&   twitter bobabrewery & neopets
retweet & like  -> https://twitter.com/boba_brewery/status/1549318741691105280

"""
import os
import json
import pandas as pd


if __name__ == "__main__":
    # metaderby_followers_file = os.path.join(os.path.dirname(
    #     __file__), "metaderby_followers.json")
    brewery_followers_file = os.path.join(os.path.dirname(
        __file__), "boba_brewery_followers.json")
    rt_and_like_users_file = os.path.join(os.path.dirname(
        __file__), "rt_and_like_users.json")
    # participate_users_file = os.path.join(os.path.dirname(
    #     __file__), "participate_users.json")
    outFilePath = os.path.join(os.path.dirname(
        __file__), "Metaderby_Ticket_Result.csv")

    # discord_members_infos = pd.read_csv(discord_member_file).values.tolist()
    # discord_members = set([info[0] for info in discord_members_infos])
    # print(f"Neopets discord members: {len(discord_members)}")

    brewery_followers = set(json.load(open(brewery_followers_file, 'r', encoding='utf-8')).keys())
    print(f"Brewery twitter followers: {len(brewery_followers)}")

    # metaderby_followers = set(json.load(open(metaderby_followers_file, 'r', encoding='utf-8')).keys())
    # print(f"EternalWorld twitter followers: {len(metaderby_followers)}")

    rt_and_like_users = json.load(open(rt_and_like_users_file, 'r', encoding='utf-8'))
    rt_and_like_user_ids = set(rt_and_like_users.keys())
    print(f"RT and Like users: {len(rt_and_like_user_ids)}")

    # winner_ids = rt_and_like_user_ids & metaderby_followers & brewery_followers
    winner_ids = rt_and_like_user_ids & brewery_followers

    result = []
    for user_id in list(winner_ids):
        result.append([str(user_id)+'\t', rt_and_like_users[user_id]])

    columns = ["Twitter User Id", "Twitter Handle"]
    pd.DataFrame(result, columns=columns).to_csv(
        outFilePath, index=False, encoding='utf-8')

    # for infos in participate_users.values():
