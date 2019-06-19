

import os

# print(os.listdir('.'))


def ext3(url):
    index = url.find(".png")
    current_url = ""
    current_url = url[index:]
    return current_url  



for i in os.listdir('.'):
    if ext3(i) == '.png':
        print(i)
        os.remove(i)
    

# import shutil

# source_file = open('AMAZONIDLIST.txt', 'r')
# source_file.readline()
# # this will truncate the file, so need to use a different file name:
# target_file = open('AMAZONIDLIST.txt', 'w')

# shutil.copyfileobj(source_file, target_file)
# print('File data also updated')

