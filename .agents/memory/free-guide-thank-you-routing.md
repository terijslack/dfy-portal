---
name: Free guide thank-you routing
description: Routing and redirect constraints for the free-guide download confirmation page.
---

Keep the free-guide download confirmation separate from the existing general thank-you page, and do not configure the embedded form redirect unless the user explicitly requests it later.

**Why:** The existing thank-you page supports the Google Business Profile audit flow, and the user approved website integration of the free-guide confirmation while specifically excluding form redirect changes.

**How to apply:** Treat the free-guide confirmation as its own public route and preserve the audit thank-you flow. If redirect wiring is requested later, confirm the intended LeadConnector behavior before changing it.