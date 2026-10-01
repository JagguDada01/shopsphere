# Contributing Guide

Thanks for wanting to contribute! 🎉 This project is used to teach open-source contribution, so every step below matters.

## 1. Pick an issue

1. Browse the [Issues](../../issues) tab. Beginners should start with `good first issue`.
2. **Comment on the issue** asking to be assigned (e.g. _"I'd like to work on this"_).
3. **Wait until a maintainer assigns you.** Don't start work on an issue someone else is assigned to.
4. One issue at a time per person, please.

## 2. Set up your fork

```bash
# Fork the repo on GitHub (Fork button, top right), then:
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
git remote add upstream https://github.com/vikas0799/<repo-name>.git
```

Follow the setup steps in the README to run the app locally.

## 3. Create a branch

Never work directly on `main`.

```bash
git checkout main
git pull upstream main
git checkout -b feat/12-add-pagination      # type/issue-number-short-name
```

Branch prefixes: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `style/`.

## 4. Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(products): add pagination to product list
fix(cart): prevent quantity going below 1
docs(readme): add screenshots section
```

Keep commits small and focused. One logical change per commit.

## 5. Open a Pull Request

```bash
git push origin feat/12-add-pagination
```

Then open a PR from your fork to `vikas0799/<repo-name>:main` and:

- Write `Closes #<issue-number>` in the description so the issue links automatically.
- Explain **what** you changed and **why**.
- Add screenshots / GIFs for any UI change.
- Fill in the PR template checklist.

## 6. Code review

- A maintainer will review your PR and may request changes. **This is normal and a big part of learning!**
- Push new commits to the same branch to update the PR.
- If `main` moved ahead, sync your branch:

```bash
git fetch upstream
git rebase upstream/main     # resolve conflicts if any
git push --force-with-lease
```

## ✅ Do's and ❌ Don'ts

- ✅ Read the existing code style and match it.
- ✅ Test your change locally before opening the PR.
- ✅ Ask questions in the issue comments if you are stuck.
- ❌ Don't open PRs for issues you were not assigned.
- ❌ Don't submit AI-generated code you don't understand — you must be able to explain every line in review.
- ❌ Don't make unrelated changes (formatting the whole file, renaming things) in the same PR.
- ❌ Don't commit `.env` files or `node_modules`.

## Code of Conduct

Be kind, be patient and help each other. Harassment of any kind is not tolerated.
