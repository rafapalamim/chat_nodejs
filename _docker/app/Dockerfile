FROM node:18.14.2-alpine3.17

WORKDIR /var/www/chat

RUN apk update && apk upgrade
RUN apk add ca-certificates git

EXPOSE 3000
EXPOSE 3005

CMD ["tail","-f","/dev/null"]