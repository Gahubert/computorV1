NAME = computorV1

init:
	npm ci

all: $(NAME)

$(NAME):
	tsc -p ./src/
	nexe ./src/computorV1.js

clean:
	rm ./src/*.js

fclean: clean
	rm ./computorV1.exe

re: fclean all