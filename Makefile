rigby-backend-id=$(shell docker ps -a -q -f "name=rigby-backend")

magic: build-all run

clean:
	rm -rf node_modules
	rm -rf built

# ==================================== BUILDING IMAGES ====================================== #

build-all:
	@docker-compose -f docker-compose.dev.yaml -p rigby-backend build

# ==================================== BUILDING IMAGES ====================================== #

run:
	@docker-compose -f docker-compose.dev.yaml -p rigby-backend up -d

# =================================== STOPPING IMAGES ======================================= #

stop:
	@docker-compose -f docker-compose.dev.yaml -p rigby-backend stop

# ================================= RESTARTING ALL SERVICES ================================= #

restart: stop run

# ========================= CLEAN DEV DOCKER ENVIRONMENT (PURGE DB) ========================= #

clean-dev:
	docker-compose -f ./docker-compose.dev.yaml -p rigby-backend rm

# =========================== RUN APP IN A DEV DOCKER ENVIRONMENT =========================== #

dev:
	docker-compose -f ./docker-compose.dev.yaml -p rigby-backend up

# ========================================= LOGS ============================================ #

attach-console:
	@docker-compose -f docker-compose.dev.yaml -p rigby-backend logs --follow backend

logs: attach-console

logs-back:
	docker-compose -f docker-compose.dev.yaml -p rigby-backend logs --follow backend

# =================================== REMOVING CONTAINERS =================================== #

rm-back:
	docker rm $(rigby-backend-id)

rm-all: rm-back

# =================================== STOPING CONTAINERS ==================================== #

stop-back:
	@docker stop $(rigby-backend-id)

stop-all: stop-back

# ======================================== REBUILDING ======================================= #

rebuild: stop-all rm-all build-all run

# ==================================== OPTING INTO SHELL ==================================== #

sh-backend:
	docker-compose -f ./docker-compose.dev.yaml -p rigby-backend