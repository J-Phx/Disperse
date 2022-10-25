import requests


headers = {
    "Host": "api2.services.joinfire.xyz",
    "Connection": "keep-alive",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Origin": "https://app.joinfire.xyz",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
    "Referer": "https://app.joinfire.xyz/",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}

data = {
    "network": "0x1", "data": "0x1249c58b", "from": "0x24e1ae757ca647101b0e7614217b7ae26338f578",
    "to": "0x3dbb10bde369a8272f7106d88c510829af49c813", "value": "0", "gas": "0xdd77", "fakeTransaction": None,
    "fakeTransactionType": None}

url = "https://api2.services.joinfire.xyz/simulator/transaction"
response = requests.post(url=url, json=data, headers=headers)
print(response.text)
