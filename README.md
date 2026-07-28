# Jann Jaravata Personal Portfolio v1.14.1

Custom domain:

`jannjaravata.madebydesignlab.com`

## v1.14.1 changes

- Added footer versioning across the homepage, Projects, Project Gallery, and Online CV.
- Added the GitHub Pages `CNAME` file.
- Added page-specific titles and descriptions.
- Added canonical URLs.
- Added Open Graph and Twitter social sharing metadata.
- Added a 1200×630 social preview image.
- Added Person, Website, ProfilePage, CollectionPage, and CreativeWork structured data.
- Added dynamic project-page SEO updates.
- Added `robots.txt` and `sitemap.xml`.
- Added favicon and application icons.
- Added `site.webmanifest`.
- Added image dimensions and loading hints to reduce layout shifting.

## Required DNS

Create this record with your DNS provider:

- Type: `CNAME`
- Host/Name: `jannjaravata`
- Target/Value: `jndesignlab-cloud.github.io`

Do not include `https://` in the DNS target.

After uploading the extracted files to the repository root, open GitHub:

**Repository Settings → Pages → Custom domain**

Enter:

`jannjaravata.madebydesignlab.com`

Then enable **Enforce HTTPS** after GitHub finishes issuing the certificate.


## v1.14.1 interface refinement

- Simplified the homepage capability categories to six clear choices.
- Centered the category icons and labels.
- Added numbered categories and an explicit “View details” hint.
- Reduced the Personal Record number size and spacing to prevent overlap.
- Preserved the shared DesignLab project archive, SEO files, and custom domain configuration.


## v1.14.1 refinements

- Converted the About My Practice section into one reading column.
- Moved the personal portfolio visit counter to the lower-left corner.
- Added floating LinkedIn, DesignLab Facebook, and madebydesignlab.com links on the lower-right.
- Added previous/next image controls and keyboard arrow navigation to project galleries.
- Removed the CV statistics section.
- Moved Professional Experience directly below the Online CV introduction.
- Rewrote CV responsibilities as action-led sentences that explain the task and resulting output.
- Forced capability, project-preview, and CV-detail modals into clear one-column layouts.


## v1.14.1 corrections

- Re-aligned the About My Practice and final contact sections within the site shell.
- Reduced headline widths and added responsive wrapping to stop horizontal clipping.
- Switched the personal portfolio to separate visitor-counter API actions.
- Added the complete updated `Code.gs` backend.
- Added a manual `resetJannPortfolioVisitCount` function.
- Preserved the main DesignLab counter and its existing total.


## v1.14.1 bug fix

- Removed capability modal state from the page URL.
- Disabled automatic modal reopening after refresh.
- Automatically clears old `?skill=` parameters left by previous versions.
- Capability modals now open only after a visitor deliberately clicks a category.
