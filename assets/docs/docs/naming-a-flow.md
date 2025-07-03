---
title: Naming a Flow
---

A Flow can be anything representing your top layer interface you will interact with.

So it's chosen name must fit what the Flow does.

As each Flow is implemented for any language, only `package.json` file
is required at root of the project Flow directory.

This will identify the Flow by specifying a **name** field in you
Flow's `package.json`

A **uniflow** field in `package.json` will have the properties :
- `name`: display name of the flow
- `tags`: tags that are relevant to characterise the flow
- `client`: list of clients that are allowed to work with the flow
