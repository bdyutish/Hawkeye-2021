echo "Pulling latest api image..."
sudo docker pull registry.gitlab.com/iecse-manipal/board-20/prometheus-21/hawkeye-2021/hawk-api:latest

apiState=$(docker ps -a -f name=Hawk-api | grep -w Hawk-api)
if [[ ! -z $apiState ]]
then
echo "removing Hawk-api container"
sudo docker rm -f Hawk-api
fi

echo "restarting cluster"
sudo docker-compose -f /root/hawkeye-2021/docker/docker-compose.prod.yml up -d

# ci test