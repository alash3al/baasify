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

You can set the configurations in the `.env` file.

Notes
======
> You can use `pm2` workers to utilize the full power of your CPUs.

Author
======
Mohamed Al Ashaal :)