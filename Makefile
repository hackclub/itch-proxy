all:
	-rm -rf dist
	mkdir dist
	cp public/* dist/
	cp -r node_modules/@mercuryworkshop/scramjet/dist dist/scram
	cp -r node_modules/@mercuryworkshop/epoxy-transport/dist dist/epoxy
	cp -r node_modules/@mercuryworkshop/bare-mux/dist dist/baremux
