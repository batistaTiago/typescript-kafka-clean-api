* Comandos uteis
  * docker compose up --scale worker_events=4 -d
  * (dentro do container do kafka) /bin/kafka-topics --alter --topic=events --bootstrap-server=kafka:9092 --partitions=4
  * build for local/testing: 
    * docker build . -t ekyidag/mfa-app:dev
    * docker push ekyidag/mfa-app:dev
  * build for production: 
    * tsc -p tsconfig.prod.json
    * docker build . -t ekyidag/mfa-app:beta -f devops/docker/Dockerfile
    * docker push ekyidag/mfa-app:beta