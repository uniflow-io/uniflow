---
title: Docker
date: 2021-10-02
author: Mathieu Ledru
cover: images/cover.svg
coverSeo: images/cover.png
coverAuthor: Docker
coverOriginalUrl: https://www.docker.com
tags: ["blog"]
---

You can self host Uniflow 💧 on Docker 🐳  
For this, just run the command below to spin up a basic container.

```
docker run -it --rm \
    --name uniflow \
    -p 8016:8016 \
    uniflowio/uniflow
```

You can try loggin with the default admin account  

- email : `admin@uniflow.io`
- password: `admin`

Happy flowing. 🎉
