BuildGuard
Intelligent Construction Material Allocation & Transfer Control

A domain-inspired construction inventory workflow that validates material requests against stock, project budgets and transferable inventory while maintaining an auditable decision trail.


Problem

Construction projects frequently need materials at one site while usable stock may exist at another project location. Poor coordination can lead to stock shortages, unnecessary procurement and weak inventory traceability.

Solution

BuildGuard provides a focused workflow for:
Material Request
       ↓
Validation
       ↓
Stock + Budget Check
       ↓
 ┌─────┴──────┐
 ↓            ↓
Approve      Reject
 ↓
Inventory Update
 ↓
Audit Log

And:

Insufficient local stock
          ↓
Search other projects
          ↓
Transfer opportunity


Disclaimer: BuildGuard is an independently developed prototype inspired by publicly observable construction ERP workflows. It is not affiliated with, endorsed by, or a reproduction of any proprietary Tactive software.


## Technology

- Next.js
- TypeScript
- SQLite
- Playwright
- Git/GitHub


Core functionality

Material Request & Allocation

A site engineer can request material for a construction project. BuildGuard validates the request against available inventory and project budget. When local inventory is insufficient, the system identifies transferable stock from another project.

BR-01: Quantity must be positive.

BR-02: Quantity must be an integer.

BR-03: Material cannot be issued beyond available stock.

BR-04: Project budget cannot be exceeded.

BR-05: Unauthorized users cannot approve requests.

BR-06: Successful approval updates inventory.

BR-07: Rejected requests do not modify inventory.

BR-08: Every inventory-changing action creates an audit record.

BR-09: Insufficient local stock triggers a transfer recommendation
       when another project has transferable inventory.

BR-10: Inventory must never become negative.
