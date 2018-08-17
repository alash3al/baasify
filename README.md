BaaSify
========
> a Backend-as-a-Service based on `ParsePlatform` with the abbility of multi-tenant "multi-apps" in the same server.

Why
====
> I wanted to manage multiple parse apps on the same instance.

How it works
============
> `BaaSify` uses `redis` to load the applications, you can add application using redis:

```bash
$ redis-cli hset apps app1 '{"appId": "app1", "appSecret": "app1-secret-string"}'
```

You can set the configurations using the ENV vars

- `HTTP_PORT`: the port to listen on, default is `7000`
- `MONGO_DSN`: the mongodb uri, default is `mongodb://localhost:27017`
- `REDIS_DSN`: the redis uri, default is `redis://localhost/1`
- `BASE_URL`: the base server url, default is `http://localhost:7000`

Notes
======
> You can use `pm2` workers to utilize the full power of your CPUs.

Author
======
Mohamed Al Ashaal :)