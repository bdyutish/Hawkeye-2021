FROM nginx:alpine

COPY  ./build /usr/share/nginx/html 

CMD /bin/sh -c "cat /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
