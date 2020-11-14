FROM node:latest as builder
ADD . /app
WORKDIR /app
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=builder /app/build/ /usr/share/nginx/html/
