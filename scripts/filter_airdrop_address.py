import pymysql


# 打开数据库连接
db = pymysql.connect(host="8.210.210.140",user="boba",password="Boba@2022",port=3306,database="boba_prod")
 
# 使用 cursor() 方法创建一个游标对象 cursor
cursor = db.cursor(cursor=pymysql.cursors.DictCursor)


def get_deposit_info(network, block_start, block_end, index):
    if index == "1":
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


def calculate_compliant_addresses(deposit_infos, withdraw_infos, index):
    for waddress, wamount in withdraw_infos.items():
        if compliant_address_infos.get(waddress):
            current_address_amount = compliant_address_infos[waddress]["amount"] - wamount
            if current_address_amount >= amount_limit_info[compliant_address_infos[waddress]["index"]]:
                compliant_address_infos[waddress]["amount"] = current_address_amount
            else:
                del compliant_address_infos[waddress]
        
        if deposit_infos.get(waddress):
            deposit_infos[waddress] = deposit_infos[waddress] - wamount
    
    for daddress, damount in deposit_infos.items():
        if compliant_address_infos.get(daddress):
            compliant_address_infos[daddress]["amount"] = compliant_address_infos[daddress]["amount"] + damount
        else:
            if damount >= amount_limit_info[index]:
                compliant_address_infos[daddress] = {"amount": damount, "index": index}


if __name__ == "__main__":

    amount_limit_info = {
        "1": 3,
        "2": 3.75,
        "3": 5,
        "4": 7.5,
        "5": 15,
    }
    base_info = {
        "bsc_mainnet": [16848378, 16877147, 16905784],  
        "boba_mainnet": [464995, 468180, 471104]
    }

    compliant_address_infos = {}

    for network, blockNumbers in base_info.items():
        for index in range(len(blockNumbers)-1):
            daily_deposit_infos = get_deposit_info(network=network, block_start=blockNumbers[index], block_end=blockNumbers[index+1], index=str(index+1))
            daily_withdraw_infos = get_withdraw_info(network=network, block_start=blockNumbers[index], block_end=blockNumbers[index+1])
            calculate_compliant_addresses(daily_deposit_infos, daily_withdraw_infos, str(index+1))