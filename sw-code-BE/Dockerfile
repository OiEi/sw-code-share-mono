FROM golang:1.21 as build

WORKDIR /build
COPY . .

# Копируем файлы, которые нужны в рантайме
RUN mkdir out

RUN go mod tidy && go mod vendor

#RUN apt-get update && apt-get install -y gcc

# Билдим гошечку из вендора в бинарник out/app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -x -mod vendor -o out/app

# Все что выше можно унести в jenkins pipeline
FROM alpine:latest

EXPOSE 8080

WORKDIR /app

COPY --from=build /build/out ./
COPY --from=build /build/index.html ./

RUN chmod +x ./app

ENTRYPOINT ./app