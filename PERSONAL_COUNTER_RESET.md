# Personal Portfolio Counter Reset — v1.14.0

The personal portfolio now uses these separate actions:

- `recordSiteVisit`
- `getSiteVisitCount`
- `site=jann-portfolio`

It no longer calls DesignLab's existing `recordVisit` and `getVisitCount`
actions. This prevents the personal site from displaying or incrementing the
main studio counter.

## Required one-time Apps Script deployment

1. Open the Apps Script project currently deployed at the configured API URL.
2. Replace its existing `Code.gs` with the `Code.gs` included in this package.
3. Save the project.
4. Run `resetJannPortfolioVisitCount` once from the Apps Script editor.
5. Approve permissions if Google asks.
6. Go to **Deploy → Manage deployments**.
7. Edit the active web-app deployment.
8. Choose **New version**, then deploy.
9. Keep the existing web-app URL.

The main DesignLab total remains in `Site Analytics!B2`.

The personal portfolio total is stored separately in:

- `Site Analytics!B4` — total visits
- `Site Analytics!B5` — last visit

After the deployment, clear the old browser session record once:

```javascript
sessionStorage.removeItem("visit-recorded:jann-portfolio:v2");
```

Then refresh the personal portfolio. Your own next recorded session will make
the new total display `1`.
