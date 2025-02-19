start-env:
	docker compose -f ./docker/docker-compose.yml up -d
start-env-debug:
	docker compose -f ./docker/docker-compose.yml up
stop-env:
	docker compose -f ./docker/docker-compose.yml down
