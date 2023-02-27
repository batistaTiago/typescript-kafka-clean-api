* Useful Commands
  * (get commit tag) git rev-parse --short HEAD
  * (scale a docker compose service) docker compose up --scale worker_events=4 -d
  * (change kafka topic partition count - from inside container) /bin/kafka-topics --alter --topic=events --bootstrap-server=kafka:9092 --partitions=4
  * (restart a deployment) kubectl rollout restart deployments/{name}
  * (get all logs from deployment) kubectl logs -f deployment/{name}

* build for local/testing: 
  * docker build . -t ekyidag/mfa-app:dev
  * docker push ekyidag/mfa-app:dev

* build for production: 
  * tsc -p tsconfig.prod.json
  * COMMIT_TAG=$(git rev-parse --short HEAD); docker build . -t ekyidag/mfa-app:$COMMIT_TAG -f devops/docker/Dockerfile;
  * docker push ekyidag/mfa-app:beta
