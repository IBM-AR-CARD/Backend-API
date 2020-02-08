echo "Pulling from Master" 

git pull origin master

echo "Pulled successfully from master"

echo "Stopping server..."

pm2 stop server.js

echo "Restarting server..."

pm2 start server.js

echo "Server restarted Successfully"