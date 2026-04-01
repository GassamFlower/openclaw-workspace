#!/bin/bash

# 生成bcrypt密码
python3 << 'PYTHON'
import bcrypt

password = b"Admin123!@#"
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password, salt)

print(hashed.decode('utf-8'))
PYTHON