#Problem

This repo is an attempt to demonstrate some odd behaviour I'm seeing in node-proxy.

Try this.

Run ```npm i```

Run ```node proxy.js```, this will start a server on port 8000 that proxies requests to port 3000.

In another console, start up a server of any kind on port 3000. I'm using a small rails app, though I've also confirmed the issue with sinatra and python's flask.  There's a server.py checked in if you want to try it with flask on your own.

In a third console, try ```curl http://localhost:8000/```, also try ```curl -d foo=bar http://localhost:8000/post_something```
(Also, confirm that your requests work without a proxy by trying the same commands on port 3000).

Note that the HTTP GET succeeds, but the POST times out.

If I run lsof while the timeout is occurring I see this:

    ~ $ sudo lsof -nNPi @127.0.0.1
    COMMAND    PID      USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
    launchd      1      root   28u  IPv4 0x55d89a057bc8f601      0t0  TCP 127.0.0.1:631 (LISTEN)
    ntpd        87      root   23u  IPv4 0x55d89a057ac88929      0t0  UDP 127.0.0.1:123
    ruby      1519 kbaribeau    9u  IPv4 0x55d89a058835e059      0t0  TCP 127.0.0.1:3000->127.0.0.1:51898 (ESTABLISHED)
    Skype     1765 kbaribeau   10u  IPv4 0x55d89a057c365569      0t0  UDP 127.0.0.1:62076
    node      2183 kbaribeau    9u  IPv4 0x55d89a058099f379      0t0  TCP 127.0.0.1:8000->127.0.0.1:51897 (ESTABLISHED)
    node      2183 kbaribeau   12u  IPv4 0x55d89a05888a7dd1      0t0  TCP 127.0.0.1:51898->127.0.0.1:3000 (ESTABLISHED)
    curl      2184 kbaribeau    5u  IPv4 0x55d89a057bf851e9      0t0  TCP 127.0.0.1:51897->127.0.0.1:8000 (ESTABLISHED)

It appears that node has successfully connected to ruby, but ruby isn't responding. However, these requests seem to work without a proxy. What's the missing secret sauce here?

#Solution

I found the issue (sort of). The bodyParser middleware does three things, it's equivalent to this:

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.multipart());
    
The urlencoded() middleware breaks POSTS. Removing it solves the issue.
