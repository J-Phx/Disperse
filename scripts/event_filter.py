import argparse
import json
import os
import sys
import pandas as pd
from web3 import Web3
from web3.middleware import geth_poa_middleware


def get_event():
    w3 = Web3(Web3.HTTPProvider(default_config["rpc"]))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    contract_instance = w3.eth.contract(address=default_config["contract_address"], abi=default_config["contract_abi"])
    print(contract_instance.events._events)

    fromBlock = args.start if args.start else default_config["start_blockNumber"]
    toBlock = args.end if args.end else default_config["end_blockNumber"]
    toBlock = toBlock if toBlock else "latest"

    all_datas = []
    while fromBlock < toBlock:
        _start = fromBlock
        fromBlock = _start + args.batchNumber
        if fromBlock > toBlock:
            _end = toBlock
        else:
            _end = fromBlock - 1
        print(f"==============> current start block number is {_start}, end block number is {_end}")
        event_filter_str = f"contract_instance.events.{args.eventName}.createFilter(fromBlock={_start}, toBlock={_end})"
        # print(event_filter_str)
        event_filter = eval(event_filter_str)
        all_events = event_filter.get_all_entries()
        for event in all_events:
            data_dict = {}
            data = dict(event)
            data_dict["transactionHash"] = data["transactionHash"].hex()
            data_dict["blockNumber"] = data["blockNumber"]
            data_dict["event"] = data["event"]
            data_dict.update(dict(data["args"]))

            all_datas.append(data_dict)

    print(f'All transactions have been pulled, for a total of {len(all_datas)} items.')
    return all_datas


def data_persistence(data, filename):
    if not data:
        raise "No data can be persisted"

    columns_names = list(data[0].keys())
    # rows = [list(info.values()) for info in data]
    dataFrame_data = {}
    for column_name in columns_names:
        dataFrame_data[column_name] = [info.get(column_name) for info in data]

    dataFrame = pd.DataFrame(dataFrame_data)
    dataFrame.to_csv(filename, index=False, encoding='utf_8_sig')


parser = argparse.ArgumentParser(usage=f"{sys.executable} [ script.py ] [ option ] [ arg ] ...")
parser.add_argument('-nw', '--network', metavar="",
                    help=': boba_mainnet|boba_rinkeby|bsc_mainnet|bsc_testnet|rinkeby|ethereum', type=str,
                    required=True)
parser.add_argument('-s', '--start', metavar="", help=': start block number', type=int, required=True)
parser.add_argument('-e', '--end', metavar="", help=': end of block number', type=int)
parser.add_argument('-en', '--eventName', metavar="",
                    help=': event name (Please note the case of the first letter)', type=str, required=True)
parser.add_argument('-bn', '--batchNumber', metavar="",
                    help=': number of blocks per query (Maximum 5000, default 2000)', type=int, default=2000)
parser.add_argument('-o', '--outfile', metavar="", help=': output file (Must be a .csv file)', type=str)
args = parser.parse_args()

if __name__ == '__main__':
    print(args)
    default_config = json.load(open(os.path.join(os.path.dirname(
        __file__), "configs", "UniversalEventFilter.json")), encoding="utf-8")[args.network]

    # Processing output file
    if args.outfile:
        if args.outfile.endswith(".csv"):
            out_file = args.outfile
        else:
            out_file = os.path.join(os.path.dirname(
                args.outfile), f"{args.network}_{args.eventName}_{args.start}_to_{args.end}.csv")

    else:
        out_file = f"{args.network}_{args.eventName}_{args.start}_to_{args.end}.csv"
    print(f"=====outfile=====> {out_file}")

    # Processing event
    try:
        all_datas = get_event()
        data_persistence(all_datas, out_file)
    except Exception as e:
        print(e)
