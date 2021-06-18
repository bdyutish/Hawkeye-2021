default() {
    start
}
install(){
    cd api && npm install && cd ../client && npm install --force
}
design(){
      xdg-open "https://www.figma.com/file/yWcCtKMwOyzlXqPlREdynT/Hawkeye'21?node-id=0%3A1"
}
push(){
    cd client && npm run build && cd ..
    git add .
    git commit -m $2
    git push origin $1
}
start(){
    sudo docker-compose -f docker/docker-compose.dev.yml up && sudo docker-compose -f docker/docker-compose.dev.yml down
}
stop(){
    cd docker && sudo docker-compose -f docker-compose.dev.yml down -v
}
mongo() {
    docker exec -it DevOps_DB mongo
}
redis() {
    docker exec -it DevOps_REDIS redis-cli
}
deleteData(){
    cd api && npx ts-node seeder.ts -d
}
importData(){
    cd api && npx ts-node seeder.ts -i
}
deploy()
{
    sudo apt get update
    sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release -y
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io -y
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
}
"${@:-default}"