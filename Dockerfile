FROM node:18

COPY package.json /res/package.json
RUN  cd /res; npm install

COPY . /res
EXPOSE 3000
WORKDIR /res

CMD npm run start
