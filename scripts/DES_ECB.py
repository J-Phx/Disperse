from Crypto.Cipher import DES
import base64

key = b""
text = """"""


def pad(text):
    while len(text) % 8 != 0:
        text += ' '
    return text


des = DES.new(key, DES.MODE_ECB)
padded_text = pad(text)

encrypted_text = des.encrypt(padded_text.encode('utf-8'))
encrypted_text = base64.encodebytes(encrypted_text).decode()
print(encrypted_text)

plain_text = des.decrypt(base64.decodebytes(encrypted_text.encode())).decode().rstrip(' ')
print(plain_text)
