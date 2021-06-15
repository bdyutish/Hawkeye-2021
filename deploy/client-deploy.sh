sudo docker pull registry.gitlab.com/iecse-manipal/board-20/prometheus-21/hawkeye-2021/hawk-client:latest
sudo docker-compose -f /root/hawkeye-2021/docker/docker-compose.prod.yml down
sudo docker-compose -f /root/hawkeye-2021/docker/docker-compose.prod.yml up -d

