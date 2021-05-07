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
"${@:-default}"