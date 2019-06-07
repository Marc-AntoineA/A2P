#!/bin/bash
# Author: Marc-Antoine Augé
# Usage. ./deploy.sh -l ftpPath -u ftpUser

while getopts l:u: option
do
case "${option}"
in
l) FTP=${OPTARG};;
u) USER=${OPTARG};;
esac
done

read -sp 'Password: ' PASSWORD

echo $PASSWORD
echo ""

echo "Step 1. Updating the source code"
#git pull
if [ $? -eq 1 ]; then
    echo ">>> ERROR: error while executing 'git pull'.
    You're build may be outdated. Please solve this git problem."
fi

echo "Step 2. Install the dependencies"
#npm run install

echo "Step 3. Build the frontends (applicant and superviser)"
npm run build

echo "Step 4. Send the source code to the website through ftp"
echo "Step 4.1. Sending applicant-frontend"
ncftpput -R -v -u "$USER" -p "$PASSWORD" $FTP "applicant-frontend" ./applicant-frontend/build/

echo "Step 4.2. Sending superviser-frontend"
ncftpput -R -v -u "$USER" -p "$PASSWORD" $FTP "superviser-frontend" ./superviser-frontend/dist/

echo "Step 4.3. Sending backend"
rm -r backend/node_modules
#ncftpput -R -v -u "$USER" -p "$PASSWORD" $FTP "." ./backend/
