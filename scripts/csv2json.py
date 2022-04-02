import csv
import json
import os


basePath = os.path.dirname(__file__)
print(basePath)
csvFilePath = os.path.join(basePath) + '\\utils\\BRE_address.csv'
print(csvFilePath)
jsonFilePath = os.path.join(basePath) + '\\utils\\safepal_wt.json'
print(jsonFilePath)

csvFile = open(csvFilePath, 'r', encoding='utf-8')
jsonFile = open(jsonFilePath, 'w', encoding='utf-8')

fieldNames = ("address", "amount")
reader = csv.DictReader(csvFile, fieldNames)

jsonFile.write('[')
for row in reader:
    json.dump(row, jsonFile)
    jsonFile.write(',')
jsonFile.write(']')

csvFile.close()
jsonFile.close()
