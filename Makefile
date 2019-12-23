NAME = computorV1

init:
	npm ci

all: $(NAME)

$(NAME):
	tsc -p ./src/

clean:
	rm ./src/*.js

re: clean all