---
title: Submitting to Library
---

In order to add your Card to the [Library](https://uniflow.io/library), you need to :

1. Publish a package to npm (learn how on the [npm
docs](https://docs.npmjs.com/getting-started/publishing-npm-packages)).
2. Include `uniflow-flow` or `uniflow-client` as  **keywords** field in you Flow or Client
`package.json`
3. Document your Card with a `README.md`

After doing so, Algolia will take up to 12 hours to add it to the
library search index (the exact time necessary is still unknown), and
wait for the rebuild of [uniflow.io](https://uniflow.io) to automatically include your
client page to the website.
