# Releasing Splunk OpenTelemetry Node


This document explains the steps required to publish a new release of splunk-opentelemetry Node package to NPM.

Release process:

1. [Checkout a release branch](#step-1)
2. [Update version number and changelog](#step-2)
3. [Submit PR for review and merge to main](#step-3)
4. [Create a new Github Release](#step-4)
5. [Create and push tag](#step-5)
6. [Verify CircleCI and PYPI](#step-6)


## 1. Checkout a release branch <a href="step-1"></a>

Checkout a new branch from main with name equal to `release/v<VERSION_NUMBER>`.
So if you intent to release `1.2.0`, create a branch named `release/v1.2.0`

## 2. Update version number <a href="step-2"></a>

Update version in `package.json` and `src/version.ts`.

In CHANGELOG.md, rename `Unreleased` header with the new version and today's date.
Add a new empty `Unreleased` section at top.

## 3. Submit changes for review <a href="step-3"></a>

Commit the changes and submit them for review.
The commit title should be `Release v<VERSION_NUMBER>` and the description should be all the changes,
additions and deletions this versions will ship. This can be copied as is from the CHANGELOG file.
Merge the PR back to main once it is approved. 

## 4.Create a draft Github Release <a href="step-4"></a>

Go to the (project on Github)[https://github.com/signalfx/splunk-otel-js] and create a new release.
On top of the release notes mention the version of OpenTelemetry API and other packages this
version depends on. Do this for every release, even if the OpenTelemetry version has not changed.

Next copy the changes, additions and deletions this version contains from the CHANGELOG file.

Release name should be exact version number without the prefix `v` we use elsewhere.

Save the release as a draft.


## 5. Create and publish version git tag <a href="step-5"></a>

Switch to `main` branch and pull the latest changes. Make sure your git head is on the release commit.
Switch to the commit if it is not. 

Create a new git tag for the release with the `v` prefix. For example, if you're releasing `1.2.0`:

```
git tag v1.2.0
git push origin v1.2.0
```

## 6. Verify CircleCI job and NPM package <a href="step-6"></a>

Go to (the CircleCI project)[https://app.circleci.com/pipelines/github/signalfx/splunk-otel-js] and verify the build for your new version was successful.

Go to (https://www.npmjs.com/package/@splunk/otel)[https://www.npmjs.com/package/@splunk/otel] and verify the new package was published. It may take a few minutes for the npmjs.org web interface to reflect the new package but it should be installable instantly. 

Navigate to examples/express, upgrade `@splunk/otel` package to the new version and at least verify it is working as expected. If you're feeling like doing some more work, commit the changes to the example express app and submit a PR.

## 7. Publish the draft Github Release

Pull up the draft Github Release you created earlier in step 4 and publish it. 