
from pprint import pprint


def calculate_total_stake_tier(user_id, stake):
    key = ""

    for _key, _value in tier_mul.items():
        if _value["max"] >= stake:
            key = _key
            break
    tier_stake_totle[key] = tier_stake_totle.get(key, 0) + stake
    user_stake_tier[user_id] = key


def calculate_W_total():
    global W_total
    for _key, _value in tier_stake_totle.items():
        W_total += _value * tier_mul[_key]["mul"]


def calculate_amount_new(Z, W_total, user_infos):
    print("====== recur ======")
    pprint(user_infos)
    rest_token = 0
    W_overflow = 0
    for user_id in user_infos.keys():
        print(user_infos.keys())
        if user_infos[user_id]['alloc'] < Y:
            print("processing :", user_id, user_infos[user_id]['alloc'])
            mul = tier_mul[user_stake_tier[user_id]]["mul"]
            user_stake = user_infos[user_id]["stake"]
            amount = Z * (user_stake * mul)
            user_infos[user_id]['alloc'] += amount
            new_amount = user_infos[user_id]['alloc']
            if(new_amount > Y):
                rest_token += new_amount - Y
                W_overflow += user_stake * mul
                user_infos[user_id]['alloc'] = Y

    if rest_token > 0:
        print("------ before recur ---")
        print("rest_token:", rest_token)
        print("max reached")
        pprint(user_infos)
        W_left = W_total - W_overflow
        if W_left > 0:
            Z2 = rest_token / W_left
            calculate_amount_new(Z2, W_left, user_infos)


def calculate_amount(user_id):
    global rest_token, W_overflow
    Z = X / W_total
    mul = tier_mul[user_stake_tier[user_id]]["mul"]
    user_stake = user_infos[user_id]["stake"]
    amount = Z * (user_stake * mul)

    if amount > Y:
        rest_token += amount - Y
        W_overflow -= (user_stake * mul)
        return Y

    if rest_token > 0:
        Z2 = rest_token / (W_total + W_overflow)
        amount += Z2 * (user_stake * mul)

    if amount > Y:
        rest_token += amount - Y
        W_overflow -= (user_stake * mul)
        return Y

    return amount*1.25


if __name__ == "__main__":
    tier_mul = {
        "t1": {"max": 5000, "mul": 1},
        "t2": {"max": 25000, "mul": 2},
        "t3": {"max": 50000, "mul": 3},
        "t4": {"max": 100000, "mul": 4},
        "t5": {"max": float("inf"), "mul": 5},
    }
    tier_stake_totle = {}
    user_stake_tier = {}
    X = 1000000  # 预售token个数
    Y = 100000   # 硬封顶
    rest_token = 0
    W_total = 0
    W_overflow = 0

    user_infos = {
        "0": {"stake": 10, "alloc": 0},  # tier1
        "1": {"stake": 8, "alloc": 0},  # tier1
        "8": {"stake": 2, "alloc": 0},  # tier1
        "2": {"stake": 25000, "alloc": 0},  # tier2
        "3": {"stake": 20000, "alloc": 0},  # tier2
        "4": {"stake": 32000, "alloc": 0},  # tier3
        "5": {"stake": 60000, "alloc": 0},  # tier4
        "6": {"stake": 80000, "alloc": 0},  # tier4
        "7": {"stake": 200000, "alloc": 0},  # tier5
    }

    for key, value in user_infos.items():
        calculate_total_stake_tier(
            user_id=key, stake=value["stake"])
    print(f"{tier_stake_totle}")

    calculate_W_total()
    print(f"总权重: {W_total}")

    Z = X / W_total
    calculate_amount_new(Z, W_total, user_infos)
    print("-------final in recur ------")
    pprint(user_infos)
    total = 0
    for user_id in user_infos.keys():
        total += user_infos[user_id]['alloc']
    print("total:", total)

    # amount = calculate_amount(user_id="0")
    # print(f"用户0可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="1")
    # print(f"用户1可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="2")
    # print(f"用户2可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="3")
    # print(f"用户3可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="4")
    # print(f"用户4可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="5")
    # print(f"用户5可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="6")
    # print(f"用户6可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="7")
    # print(f"用户7可分配的额度为: {amount}")
    # amount = calculate_amount(user_id="8")
    # print(f"用户8可分配的额度为: {amount}")
