default() {
    start
}
install(){
    cd api && npm install && cd ../client && npm install --force
}
start(){
    cd docker && sudo docker-compose -f docker-compose.dev.yml up
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
"${@:-default}"