from audioop import add
import json
import os
from collections import Counter



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
    safepal_wt_addresses = allAddressses
    max_airdrop_amount = max([info["amount"] for info in safepal_wt_address_infos])
    print(f"The maximum number of airdrops is {max_airdrop_amount}")
    print("Safepal addresses check over.")


def checkChainAddress(filePath):
    global chain_all_addresses, chain_duplicate_addresses
    with open(filePath, 'r', encoding='utf-8') as fp:
        # print(fp.read())
        infos = json.load(fp)
    
    chain_all_addresses = [info["from"].lower() for info in list(infos.values())]
    init_len = len(chain_all_addresses)
    print(f"The number of addresses on the chain is {init_len}")

    result = dict(Counter(chain_all_addresses))
    chain_duplicate_addresses = {key:value for key,value in result.items()if value > 1}
    print(f"The duplicate addresses in the chain are {chain_duplicate_addresses}")
    


if __name__ == "__main__":
    basePath = os.path.dirname(__file__)
    safepalFilePath = os.path.join(basePath) + '\\utils\\safepal_wt.json'
    chainFilePath = os.path.join(basePath) + '\\utils\\allTx.json'
    refundFilePath = os.path.join(basePath) + '\\utils\\refund_address.json'
    idoFilePath = os.path.join(basePath) + '\\utils\\ido_address.json'
    airdropFilePath = os.path.join(basePath) + '\\utils\\airdrop_address_info.json'
    refundTestFilePath = os.path.join(basePath) + '\\utils\\refund_test_address.json'


    safepal_wt_address_infos = []
    safepal_wt_addresses = []
    chain_duplicate_addresses = {}
    chain_all_addresses = []
    special_addresses = ["0x54BA2FB5C14caF2D9BB319dC1A78b781E521CAfA", "0x1031049C47a0fC94082AEAA1089e0152A642e12a", "0xaA985A84848813D41aAc58A532d786812F4800dE"]
    navy_address_infos = [{"address": "0x87992c972bD8a32e281E32eB42f99A262FC55738", "amount": "259.6791"}]


    checkSafepalWt(safepalFilePath)
    checkChainAddress(chainFilePath)

    # Handling special addresses
    for address in special_addresses:
        address = address.lower()
        if not address in safepal_wt_addresses:
            safepal_wt_addresses.append(address)
    safepal_wt_address_infos.extend(navy_address_infos)
    
    # refund addresses
    refunded_addresses = list(set(chain_all_addresses).difference(set(safepal_wt_addresses)))
    for address, count in chain_duplicate_addresses.items():
        refunded_addresses.extend([address]*(count-1))
    
    print(f"The address that needs to be refunded is {len(refunded_addresses)}")
    with open(refundFilePath, 'w', encoding='utf-8') as wf:
        json.dump(refunded_addresses, wf)
    
    with open(refundTestFilePath, 'w', encoding='utf-8') as wf:
        json.dump(refunded_addresses[:100], wf)

    # IDO addresses
    with open(idoFilePath, 'w', encoding='utf-8') as wf:
        json.dump(safepal_wt_addresses, wf)
    
    # Airdrop address infos
    with open(airdropFilePath, 'w', encoding='utf-8') as wf:
        json.dump(safepal_wt_address_infos, wf)


    