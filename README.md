* Comandos uteis
  * docker compose up --scale worker_events=4 -d
  * (dentro do container do kafka) /bin/kafka-topics --alter --topic=events --bootstrap-server=kafka:9092 --partitions=4