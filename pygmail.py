import imaplib, email
import csv

user = 'tushar.baheti28@gmail.com'
password = 'ramalalaa'
imap_url = 'imap.gmail.com'

def get_body(msg):
    if msg.is_multipart():
        return get_body(msg.get_payload(0))
    else:
        return msg.get_payload(None,True)


def search(key, value, con):
    result, data = con.search(None, key, '"{}"'.format(value))
    return data


def get_emails(result_bytes):
    msgs = []
    for num in result_bytes[0].split():
        typ, data = con.fetch(num, '(RFC822)')
        msgs.append(data)
    return msgs




con = imaplib.IMAP4_SSL(imap_url)
con.login(user, password)
con.select('Amazon')

result, data = con.fetch(b'25','(RFC822)')
# row = email.message_from_bytes(data[0][1])
# print(row)

msgs = get_emails(search('FROM', 'in-gc-orders@gc.email.amazon.in', con))

# print(msgs)
#print(get_body(email.message_from_bytes(msg[0][1])))
arr = []
file = open("MyFile2.txt", "w")
amount_of_gift_card = 0
for msg in msgs[::-1]:
    for sent in msg:
        if type(sent) is tuple:
            # for elem in sent:
            #     print(elem)
            #     print()
            # print(sent[1])
            #     print()
            content = str(sent[1], 'utf-8')
            # str = sent[1].encode()
            amt_idx = content.find("You\'ve received a")
            amount = content[amt_idx + 26: amt_idx+31]
            amount_of_gift_card = float(amount)
            amount_of_gift_card = int(amount_of_gift_card)
            # print(amount_of_gift_card)
            idx = content.find("Gift Card Code:")
            ans  = content[idx:idx+167]
            gift_card_code = ans[len(ans)-16: len(ans)]
            arr.append(gift_card_code)
        else:
            continue
    # break
    # file.write(msg)

csv_file = open("test.csv", 'w')
csv_writer = csv.writer(csv_file)

print("Gift card is of :", amount_of_gift_card)
print(len(arr))
for elem in arr: 
    print(elem)
    csv_writer.writerow([elem])

csv_file.close()

filename = str(amount_of_gift_card)+".csv"

import pandas as pd
df = pd.read_csv('test.csv')
df.to_csv(filename, index=False)

# msgarea = get_body(email.message_from_bytes(msg[0][1]))

# d = get_body(row).decode('ASCII') 
# file = open("MyFile.txt","w")
# file.write(d)
# file.close()

# print('done')
