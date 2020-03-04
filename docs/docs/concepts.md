---
title: Concepts
---

## What is a Flow ?

[Flow-Based Programming](https://jpaulm.github.io/fbp/index.html)
is a data-centered approach for designing program. This is a paradigm that
defines an application as a network of independent processes exchanging
data via message passing.

A Flow here is viewed as :
- a component that is a part of communication logic of the application
at top layer.
- an isolated implemented process for business-logic at bottom layer.

## What is a Rail ?

[Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
pattern in functional programming presents a program, or its part, as a
pipeline of functions : output of one function is an input for another.

A Rail is then a representation of the Flows that will be executed.

## What is a Program ?

A Program is globally use for naming and identifying a Rail and it's Flows.
As a shortcut, we when talking about Flows, we are talking about Programs.

## What is a Client ?

A Client is a running a Program that depends on it's environment. It
must implement it's own Rail logic and link to Uniflow.

## What is a Bridge ?

A Bridge is a part of implementation of the environment that will be
linked to the Flow bottom layer.
