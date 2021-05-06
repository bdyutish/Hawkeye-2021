default() {
    start
}
start(){
    cd docker && sudo docker-compose -f docker-compose.dev.yml up -d
}
stop(){
    cd docker && sudo docker-compose -f docker-compose.dev.yml down -v
}
"${@:-default}"