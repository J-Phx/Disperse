import os
import json

workspace_path = "D:\Code\chainhop-contracts"
print(workspace_path)
contract_build_files = os.path.join(workspace_path, "build"+os.sep+"contracts")
print(contract_build_files)
output_file_path = os.path.join(workspace_path, "SigHash.json")
print(output_file_path)
print('='*20)
print(os.listdir(contract_build_files))

file_names = os.listdir(contract_build_files)

signMapping = {}

for file_name in file_names:
    path = os.path.join(contract_build_files, file_name)
    rf = open(path, "r", encoding="utf-8")
    compile_data = json.load(rf)
    rf.close()
    ast = compile_data.get("ast")
    if ast is None:
        raise ValueError("The ast node was not fetched.")
    contract_nodes = ast["nodes"]
    for contract_node in contract_nodes:
        if contract_node["nodeType"] == "ContractDefinition":
            nodes = contract_node["nodes"]
            for node in nodes:
                if node["nodeType"] == "FunctionDefinition":
                    if not node.get("functionSelector") is None:
                        signMapping[node["functionSelector"]] = node["name"]

wf = open(output_file_path, "w", encoding="utf-8")
json.dump(signMapping, wf)
wf.close()
