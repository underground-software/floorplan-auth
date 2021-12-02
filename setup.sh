#!/bin/sh

command -v node >/dev/null 2>&1 || { echo >&2 "nodejs (node) is not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo >&2 "node package manager (npm) is not installed. Aborting."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo >&2 "openssl is not installed. Aborting."; exit 1; }

test -f ".env" && { echo >&2 "file \".env\" already exists. Aborting"; exit 1; }

read -e -p "What file should be used for the user database? " -i "users.db" database_file

test -f "$database_file" && { echo >&2 "file \"$database_file\" already exists. Aborting"; exit 1; }

read -e -p "Where should the RSA keypair be stored? " -i "auth_key" key_path

test -f "$key_path" && { echo >&2 "file \"$key_path\" already exists. Aborting"; exit 1; }

test -f "$key_path.pub" && { echo >&2 "file \"$key_path.pub\" already exists. Aborting"; exit 1; }

read -e -p "Which port should the server listen on? " -i "8000" port

read -e -p "How many rounds of hashing should be used for the passwords? " -i "10" hash_rounds

read -e -p "How long should the issued tokens last? " -i "12h" expiry_time

echo "Generating private key"
openssl genrsa -out "$key_path" 2048 2>/dev/null

echo "Generating public key"
openssl rsa -in "$key_path" -pubout -out "$key_path.pub" 2>/dev/null

echo "DATABASE_FILE=$database_file" >> ".env"
echo "PRIVATE_KEY_FILE=$key_path" >> ".env"
echo "PUBLIC_KEY_FILE=$key_path.pub" >> ".env"
echo "PORT=$port" >> ".env"
echo "HASH_ROUNDS=$hash_rounds" >> ".env"
echo "EXPIRY_TIME=$expiry_time" >> ".env"

echo "installing node package dependencies"
npm install

echo "Adding database and keypair files to .gitignore. You should commit these changes so that the database and keypair are not leaked"
echo >> .gitignore
echo "$database_file" >> .gitignore
echo "$key_path" >> .gitignore
echo "$key_path.pub" >> .gitignore
