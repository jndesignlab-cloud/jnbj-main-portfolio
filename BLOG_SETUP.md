# Studio Notes Publishing Workflow

This version already contains three static, SEO-ready articles.

## First setup

1. Upload all files from this package to the GitHub repository.
2. Confirm that `insights.html` opens correctly.
3. Open each article under the `insights/` folder.
4. Submit the updated `sitemap.xml` in Google Search Console after deployment.

## Spreadsheet structure

Import `blog-posts.csv` into Google Sheets. Keep these column names unchanged:

- title
- slug
- category
- excerpt
- meta_title
- meta_description
- published_date
- reading_time
- featured
- status
- cover_image
- body

Write the article body in simple Markdown. Use `##` for section headings and `-` for bullet points.

## Future publishing workflow

1. Create or edit the post in Google Sheets.
2. Set Status to `Published`.
3. Export the tab as CSV, replacing `blog-posts.csv`.
4. Regenerate the static article files.
5. Upload the generated files to GitHub Pages.

A future version can automate step 4 through GitHub Actions after you publish the Google Sheet as CSV.

## Existing articles

1. How I Built an Internal Creative Request System with Google Apps Script
2. From Personal Tool to Digital Product: Building My Daily Task Tracker
3. What 60 Days of Consistent Design Content Taught Me
