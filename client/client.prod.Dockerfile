FROM nginx:alpine

COPY  ./build /usr/share/nginx/html
# t

CMD /bin/sh -c "cat /etc/nginx/conf.d/nginx.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
