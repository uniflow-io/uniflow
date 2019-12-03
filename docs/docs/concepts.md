---
title: Concepts
---

## What is a Flow ?

[Flow-Based Programming](https://en.wikipedia.org/wiki/Flow-based_programming)
is a data-centered approach for designing program. This is a paradigm that
defines an application as a network of independent processes exchanging
data via message passing.

A Flow here is viewed as :
- an isolated implemented process for business-logic at bottom layer.
- a component that is a part of communication logic of the application
at top layer.

## What is a Rail ?

[Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
pattern in functional programming presents a program, or its part, as a
pipeline of functions : output of one function is an input for another.

A rail is then a representation of the program.

## What is a Client ?

A client is a running a program that depends on it's environment. It
must implement it's own rail logic and link to uniflow.

## What is a Bridge ?

A bridge is a part of implementation of the environment that will be
linked to the flow bottom layer.
