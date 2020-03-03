---
title: Customizing a Flow
---

A Flow at it's minimum UI level is a [React](https://fr.reactjs.org) function component.

This component can be anything, the minimum code to implement :

```jsx
import React from 'react'

export default function JavascriptFlow() {
    return <div>My flow component</div>
}
```

A Flow is an interface element that will basically store it's data to the Program and generate appropriate code.

It's then recommended to :
- implement `serialize` and `deserialize` methods to store and load Flow data.
- implement `onCode` method that will generate code specific logic when executing the Flow on it's Client.
- implement `onDelete` method to pop the Flow on the current Rail.

Have a look at [javascript-flow](https://uniflow.io/library/uniflow-io-javascript-flow) is the most basic Flow you can implement.
