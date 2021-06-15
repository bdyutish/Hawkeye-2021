echo "Pulling latest client image..."
sudo docker pull registry.gitlab.com/iecse-manipal/board-20/prometheus-21/hawkeye-2021/hawk-client:latest

apiState=$(docker ps -a -f name=Hawk-client | grep -w Hawk-client)
if [[ ! -z $apiState ]]
then

echo "removing Hawk-client container"
sudo docker rm -f Hawk-client

fi

echo "Restarting client"
sudo docker-compose -f /root/hawkeye-2021/docker/docker-compose.prod.yml up -d