import os
import json
import pymysql


# 打开数据库连接
db = pymysql.connect(host="8.210.210.140",user="boba", password="Boba@2022",port=3306,database="boba_prod")
 
# 使用 cursor() 方法创建一个游标对象 cursor
cursor = db.cursor()
 
# SQL 插入语句
sql = "INSERT INTO ido_addresses(address, amount) VALUES (%s, %s)"

# IDO可分配BRE的额度
IDO_AMOUNT = 525


def checkSafepalWt(filePath):
    global safepal_wt_address_infos, safepal_wt_addresses
    with open(filePath, 'r', encoding='utf-8') as fp:
        # print(fp.read())
        infos = json.load(fp)

    allAddressses = [info["address"].lower() for info in infos]
    init_len = len(allAddressses)
    print(f"The initial number of SafePal whitelist addresses is {init_len}")
    filter_len = len(list(set(allAddressses)))
    print(f"The number of SafePal whitelisted addresses after filtering is {filter_len}")

    assert init_len == filter_len, "Duplicate addresses exist."

    safepal_wt_address_infos = infos
    print("Safepal addresses check over.")



if __name__ == "__main__":
    basePath = os.path.dirname(__file__)
    safepalFilePath = os.path.join(basePath) + '\\utils\\safepal_wt.json'

    safepal_wt_address_infos = []
    checkSafepalWt(safepalFilePath)

    special_addresses = ["0x54BA2FB5C14caF2D9BB319dC1A78b781E521CAfA", "0x1031049C47a0fC94082AEAA1089e0152A642e12a", "0xaA985A84848813D41aAc58A532d786812F4800dE"]
    navy_address_infos = [{"address": "0x87992c972bD8a32e281E32eB42f99A262FC55738", "amount": "259.6791"}]
    safepal_wt_address_infos.extend(navy_address_infos)
    safepal_wt_address_infos.extend([{"address": address, "amount": "0"} for address in special_addresses])

    datas = []
    for address_infos in safepal_wt_address_infos:
        address = address_infos["address"]
        amount = '%.4f' % (float(address_infos["amount"]) + IDO_AMOUNT)
        # cursor.execute(sql, (address, str(amount)))
        datas.append((address, amount))
    
    try:
        cursor.executemany(sql, datas)
        db.commit()
        print("全部插入成功!")
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
    
    db.close()