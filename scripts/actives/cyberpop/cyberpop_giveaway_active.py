import os
import json
import pandas as pd


def process_bre_holder(dict_form_result):
    # result = []
    # result.extend([info["data"] for info in list(dict_form_result.values())])

    participate_users_infos = list(
        dict(
            sorted(
                list(dict_form_result.items()),
                key=lambda x: x[1]['balance'],
                reverse=True)).values())
    participate_users = []
    for info in participate_users_infos:
        if info["balance"] == 0:
            continue
        info["data"].append(info["balance"] / 1e18)
        participate_users.append(info["data"])
    # result.extend(participate_users)
    print(f"Result length: {len(participate_users)}")

    column_names.append("BRE Balance")
    pd.DataFrame(participate_users, columns=column_names).to_csv(
        bre_holder_output_file, index=False, encoding='utf-8')


def process_nft_holder():
    form_dataframe = pd.read_csv(nft_holder_file, header=None).dropna()
    form_result = form_dataframe.values.tolist()

    holders = {}
    # user_balance = {}
    for data in form_result[1:]:
        holders[data[5]] = data[7]


if __name__ == "__main__":
    bre_holder_output_file = os.path.join(os.path.dirname(
        __file__), "Cyberpop_BRE_Holder_Forms.csv")
    nft_holder_output_file = os.path.join(os.path.dirname(
        __file__), "Cyberpop_NFT_Holder_Forms.csv")

    nft_holder_file = os.path.join(os.path.dirname(
        __file__), "cyberpop_nft_holder.csv")
    nft_user_file = os.path.join(os.path.dirname(
        __file__), "BRE_Holder_Forms.json")
    nft_user_infos = json.load(open(nft_user_file, 'r', encoding='utf-8'))
    print(f"Users balance info: {len(nft_user_infos)}")
    bre_balance_file = os.path.join(os.path.dirname(
        __file__), "BRE_Holder_Forms.json")
    bre_balance_infos = json.load(open(bre_balance_file, 'r', encoding='utf-8'))
    print(f"Users balance info: {len(bre_balance_infos)}")

    column_names = [
        "Timestamp", "Email Address", "1. Twitter Handle (🍺：Follow Brewery + Cyberpop Twitter)",
        "2. Twitter Handle (🍺 RT+ ❤)", "3. Discord Handle (🍺 Join Brewery + Cyberpop Discord)",
        "4. Twitter Handle(🍺 Comment + @ 3 frens)",
        "5. Genesis Hero List NFT Holder Address (🍺 Own Cyberpop Genesis Hero List NFT)",
        "6. BRE Holder Address (🍺 Hold BRE(bsc or boba, both would count))"]

    # process_bre_holder(bre_balance_infos)
    process_nft_holder()
