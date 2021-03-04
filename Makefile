.PHONY: clean
clean:
	@rm -rf lib 

.PHONY: build
build:
	yarn build

.PHONY: publish
publish: build
	cp package.json lib/
	cd lib && yarn pack 

.PHONY: pack 
pack: build
	cp package.json lib/
	cp LICENSE lib/
	cp README.md lib/
	cd lib && yarn pack 

.PHONY: lint
lint:
	yarn lint

.PHONY: fmt
fmt:
	yarn lint:fix

.PHONY: test
test:
	yarn test