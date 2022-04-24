import pymysql


# 打开数据库连接
db = pymysql.connect(host="8.210.210.140",user="boba",password="Boba@2022",port=3306,database="boba_prod")
 
# 使用 cursor() 方法创建一个游标对象 cursor
cursor = db.cursor(cursor=pymysql.cursors.DictCursor)


def get_deposit_info(network, block_start, block_end, index):
    if index == "0":
        sql = f"SELECT address, SUM(amount) as amount FROM airdrop_history WHERE network='{network}' AND method='Deposit' AND blockNumber BETWEEN {block_start} AND {block_end} GROUP BY address HAVING amount >= 3;"
    else:
        sql = f"SELECT address, SUM(amount) as amount FROM airdrop_history WHERE network='{network}' AND method='Deposit' AND blockNumber BETWEEN {block_start} AND {block_end} GROUP BY address;"
    cursor.execute(sql)
    result = cursor.fetchall()
    result_json = {info["address"]: info["amount"] for info in result}
    return result_json


def get_withdraw_info(network, block_start, block_end):
    sql = f"SELECT address, SUM(amount) as amount FROM airdrop_history WHERE network='{network}' AND method='Withdraw' AND blockNumber BETWEEN {block_start} AND {block_end} GROUP BY address;"
    cursor.execute(sql)
    result = cursor.fetchall()
    result_json = {info["address"]: info["amount"] for info in result}
    return result_json


"""
AirDrop requirement	LPT Balance For Day1 Participants	LPT Balance For Day2 Participants	LPT Balance For Day3 Participants	LPT Balance For Day4 Participants	LPT Balance For Last Day Participants
2022/4/11	3.00 	0.00 	0.00 	0.00 	0.00 
2022/4/12	3.00 	3.75 	0.00 	0.00 	0.00 
2022/4/13	3.00 	3.75 	5.00 	0.00 	0.00 
2022/4/14	3.00 	3.75 	5.00 	7.50 	0.00 
2022/4/15	3.00 	3.75 	5.00 	7.50 	15.00 
"""
def calculate_eligible_addresses(network, deposit_infos, withdraw_infos, index):
    eligible_address_infos = all_eligible_address_infos[network]

    for daddress, damount in deposit_infos.items():
        if eligible_address_infos.get(daddress):
            eligible_address_infos[daddress]["amount"] = eligible_address_infos[daddress]["amount"] + damount
        else:
            if damount >= amount_limit_info[index]:
                eligible_address_infos[daddress] = {"amount": damount, "index": index}
    print(f"Before calculating withdraw, the eligible addresses are <{len(eligible_address_infos)}>")
    
    for waddress, wamount in withdraw_infos.items():
        if eligible_address_infos.get(waddress):
            current_address_amount = eligible_address_infos[waddress]["amount"] - wamount
            if current_address_amount >= amount_limit_info[eligible_address_infos[waddress]["index"]]:
                eligible_address_infos[waddress]["amount"] = current_address_amount
            else:
                del eligible_address_infos[waddress]
    print(f"After calculating withdraw, the eligible addresses are <{len(eligible_address_infos)}>")
        # if deposit_infos.get(waddress):
        #     deposit_infos[waddress] = deposit_infos[waddress] - wamount
    all_eligible_address_infos[network] = eligible_address_infos


def calculate_airdrop_amount():
    bsc_address_infos = all_eligible_address_infos["bsc_mainnet"]
    boba_address_infos = all_eligible_address_infos["boba_mainnet"]
    total_stake_amount = sum([info["amount"] for info in bsc_address_infos.values()]) + sum([info["amount"] for info in boba_address_infos.values()])
    print(f"A total of < {total_stake_amount} > LPTs were staked on both chains.")

    share_per_share = BRE_airdrop_amount / total_stake_amount
    print(f"< {share_per_share} > BRE for every 1 LPT staked.")

    for network, address_infos in all_eligible_address_infos.items():
        infos = []
        for address, info in address_infos.items():
            bre_amount = info["amount"] * share_per_share
            infos.append(f"('{address}', {bre_amount}, '{network}')")
        
        sql = f"INSERT INTO airdrop_addresses (address, amount, network) VALUES {','.join(infos)};"
        cursor.execute(sql)
        db.commit()
        print(f"The data on the {network} chain has been successfully inserted into the database.")



if __name__ == "__main__":

    BRE_airdrop_amount = 20000

    amount_limit_info = {
        "0": 3,
        "1": 3,
        "2": 3.75,
        "3": 5,
        "4": 7.5,
        "5": 15,
    }
    base_info = {
        "bsc_mainnet": [16674629, 16848378, 16877147, 16905784, 16934550, 16963292, 16991858],  
        "boba_mainnet": [444606, 464995, 468180, 471104, 473946, 476180, 477899]
    }

    all_eligible_address_infos = {"bsc_mainnet": {}, "boba_mainnet": {}}

    for network, blockNumbers in base_info.items():
        for index in range(len(blockNumbers)-1):
            daily_deposit_infos = get_deposit_info(network=network, block_start=blockNumbers[index], block_end=blockNumbers[index+1], index=str(index+1))
            daily_withdraw_infos = get_withdraw_info(network=network, block_start=blockNumbers[index], block_end=blockNumbers[index+1])
            calculate_eligible_addresses(network, daily_deposit_infos, daily_withdraw_infos, str(index))
    
    print("="*20)
    print(f"The total number of eligible addresses on the BSC chain is {len(all_eligible_address_infos['bsc_mainnet'])}")
    print(f"The total number of eligible addresses on the Boba chain is {len(all_eligible_address_infos['boba_mainnet'])}")
    calculate_airdrop_amount()