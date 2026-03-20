---
sidebar_position: 3
---

# Site Guide

## Homepage

The homepage is designed to answer three questions quickly:

1. who I am,
2. what kinds of projects I build,
3. which repositories are the best starting points.

## Projects explorer

The `/projects` page is the main portfolio view.

Use it when you want to:

- search by repository name or description,
- filter by language or category,
- hide archived repositories,
- hide forks,
- sort by featured status, recent updates, stars, or name.

## Featured repositories

Featured projects are a curated subset of repositories that are especially representative because they are:

- more polished,
- more active,
- more widely useful,
- or simply the best examples of a category.

## Live demo vs package links

If a repository homepage points to npm, the card labels it as a **Package**.
If it points elsewhere, the card labels it as a **Live demo**.
If no homepage is set, the card falls back to the GitHub repository link only.

## Snapshot + live refresh

The site includes a local snapshot of public repository metadata. In the browser it then attempts to refresh the list from the GitHub API, which keeps the project list usable even if the API is temporarily unavailable.
