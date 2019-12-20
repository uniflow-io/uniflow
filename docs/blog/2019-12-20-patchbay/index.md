---
title: Patchbay
date: 2019-12-20
author: Mathieu Ledru
cover: images/cover.svg
coverSeo: images/cover.png
coverAuthor: Patchbay
coverOriginalUrl: https://patchbay.pub
tags: ["case-study"]
---

[Patchbay](https://patchbay.pub) is stripped-down service that includes the
 MPMC functionality. This is the Poor man's replacement for services such as
  ngrok, IFTTT, serverless applications.

Here, we will see how to implement a simple consumer producer, to reflect
 Patchbay philosophy.

As example here, we will run two consumer that will display the message
 returned by one consumer.

You can go to [simple-patchbay-consumer](https://uniflow.io/public/feed/simple-patchbay-consumer)

Run one Uniflow consumer by clicking on play button to run the flow.

![play](images/play.png)

Run one Node consumer by executing

```bash
$ node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api
-key} simple-patchbay-consumer
```

The two running consumers will wait for the consumer to be executed.

You can go to [simple-patchbay-producer](https://uniflow.io/public/feed/simple-patchbay-producer)

Run Node consumer by executing

```bash
$ node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key={your-api
                              -key} simple-patchbay-producer
```

It will then unlock the two previously consumers. On Uniflow and Node
 consumers, you should then see the delivered message from the producer. 🎉
