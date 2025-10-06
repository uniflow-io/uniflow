---
title: HTML Flow Component
date: 2025-10-06
author: Mathieu Ledru
cover: images/cover.png
coverSeo: images/cover.png
coverAuthor: Html
coverOriginalUrl: https://www.w3schools.com/html
tags: ["blog", "components", "html"]
---

Introducing HTML Flow: Safe HTML Rendering in Your Automation Flows! 🎨  
We're excited to announce the new HTML Flow component for Uniflow. This powerful addition allows you to safely render HTML content stored in variables directly within your automation flows.

The HTML Flow component provides secure HTML rendering with built-in sanitization, making it perfect for displaying dynamic content, embedded media, or custom layouts in your automation interfaces.

### Key Features

- **Safe HTML Rendering**: The component automatically sanitizes HTML content, removing potentially dangerous elements like scripts, forms, and malicious attributes while preserving safe content like iframes with proper restrictions.
- **Variable Integration**: Simply specify a variable name that contains your HTML content, and the component will automatically fetch and display it from the runner context.
- **Real-time Preview**: See your HTML content rendered live as you build your flows, with immediate visual feedback.
- **Iframe Support**: Safely embed external content through iframes with automatic URL validation and attribute filtering.

### How It Works

The HTML Flow component takes a single input - the name of a variable containing HTML content. It then:

1. Fetches the HTML from the runner context
2. Sanitizes the content using custom DOM filtering
3. Renders the safe HTML directly in the preview pane
4. Updates automatically when the variable content changes

Perfect for creating rich, interactive automation interfaces that can display dynamic content, embedded media, or custom layouts while maintaining security and performance.

Let's make your flows not just functional, but visually engaging! 🚀
