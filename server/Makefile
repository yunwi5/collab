docker-build:
	docker build . -t 938550590/collab-backend

docker-run:
	docker run -p 8080:8080 938550590/collab-backend

serverless:
	serverless offline

serverless-deploy:
	yarn build && serverless deploy --stage prod
