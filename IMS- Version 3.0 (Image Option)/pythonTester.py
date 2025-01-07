import random
original_id = 'abcd1234'
id_list = list(original_id)
random.shuffle(id_list)
print(id_list)
for item in id_list:
    print(item)