default() {
    start
}
install(){
    cd api && npm install && cd ../client && npm install --force
}
design(){
      xdg-open "https://www.figma.com/file/yWcCtKMwOyzlXqPlREdynT/Hawkeye'21?node-id=0%3A1"
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
    deleteData()
    cd api && npx ts-node seeder.ts -i
}
"${@:-default}"