import cloudscraper
import requests

session = requests.session()
scraper = cloudscraper.create_scraper(sess=session, browser={
        'browser': 'chrome',
        'platform': 'windows',
        'mobile': False
    })
resp = scraper.get("https://bscscan.com/gastracker").text
print(resp)