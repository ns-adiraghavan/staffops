# Netscribes JD Format Guide
*Reference for generating DOCX job descriptions in the NS house style.*

---

## 1. Two Distinct Format Families

NS uses two JD templates depending on the audience and purpose.

### Format A — Branded External JD (PDF/DOCX for job boards and candidates)
Used for roles NS is hiring into its own practice. Clean, multi-page, Netscribes-branded layout. Examples: Lead AI/ML Engineer, Senior Multi-Cloud Solution Architect.

### Format B — Hiring Mandate / Agency-Ready Pack (DOCX, confidential)
Used when NS is sourcing for a client engagement and the client name is confidential. More functional, table-heavy, client details redacted. Examples: Platform Engineering & DevSecOps Pack, Workday L1/L2, Salesforce Practice Lead.

The correct format is determined by the use case:
- Posting on job boards or sharing with candidates → **Format A**
- Sharing with recruitment agencies on a confidential mandate → **Format B**

---

## 2. Format A — Branded External JD

### 2.1 Page Layout
- Paper: A4
- Margins: ~1.5 cm all sides (generous whitespace)
- Font: Custom branded font in PDF exports; use **Arial** when generating DOCX
- Header: Full-width navy/dark-teal block (`#1A3C5E` or close) with white text — "JOB DESCRIPTION" as small caps label above the role title
- Footer: Netscribes logo tagline left, "Page N of N" right; thin horizontal rule separating footer

### 2.2 Colour Palette
| Element | Colour |
|---|---|
| Header background | Dark navy `#1A3C5E` (approx) |
| Section heading text | Teal/green `#2E7D5E` (approx) |
| Section heading underline | Thin rule in same teal |
| Body text | Black `#000000` |
| Table header row fill | Light grey `#F2F2F2` or no fill — bold text only |

### 2.3 Fixed Section Order
Every Format A JD contains these sections, in this order:

1. **Role Snapshot** — metadata table (see §2.4)
2. **About Netscribes** — standard boilerplate (see §2.5)
3. **Role Overview** — 2–3 prose paragraphs, no bullets
4. **Key Responsibilities** — bulleted list with bold lead-in phrase per bullet
5. **Required Qualifications** — bulleted list, no lead-in bolding
6. **Preferred Qualifications** — bulleted list
7. **What We Offer** — bulleted list
8. **Equal Opportunity & How to Apply** — standard boilerplate (see §2.6)

### 2.4 Role Snapshot Table
Two-column table, no outer border, light inner borders or borderless. Left column bold label, right column plain value.

Standard rows:
| Label | Notes |
|---|---|
| JOB TITLE | Full title as appears in header |
| FUNCTION / PILLAR | e.g. "Engineering & Innovation – Data Science & AI" |
| LOCATION | e.g. "Hybrid – Mumbai / Bengaluru, India" |
| EXPERIENCE | e.g. "8–12 years overall, including 5+ years in ML and 2+ years leading teams" |
| EMPLOYMENT TYPE | Always "Full-time, Permanent" unless otherwise specified |
| TEAM / TRAVEL | Optional row — add TEAM if team composition is relevant; TRAVEL if travel is expected |

### 2.5 About Netscribes Boilerplate
Use verbatim or close paraphrase:

> Netscribes is a global data and insights firm that helps the world's leading organizations stay ahead of disruption. For over 20 years we have partnered with more than 544 brands across automotive and manufacturing, retail and logistics, life sciences and healthcare, ICT and media, and banking and insurance — delivering more than 3,500 projects through our three integrated pillars of Insights, Engineering, and Innovation.
>
> Our Engineering practice builds the data platforms, cloud foundations, and AI systems that turn research and analytics into production-grade products for our clients. As an ISO 9001 and ISO 27001 certified organization, we pair deep domain expertise with modern engineering to help firms reinvent their future.

Adjust the second paragraph if the role is in Insights or Innovation rather than Engineering.

### 2.6 Equal Opportunity & How to Apply Boilerplate
Use verbatim:

> Netscribes is an equal opportunity employer. We celebrate diversity and are committed to building an inclusive workplace where talented people can do their best work, regardless of gender, age, ethnicity, religion, disability, or background.
>
> **To apply:** Share your updated CV with sandhya.ramchandran@netscribes.com.

### 2.7 Bullet Formatting Rules
- Each bullet: bold lead-in phrase (e.g. **Technical leadership:**) followed by plain-text description. Lead-in ends with a colon.
- Exception: Required/Preferred Qualifications bullets have no bold lead-in — plain text only.
- Bullet character: standard round bullet (•), rendered via LevelFormat.BULLET in docx-js — never unicode pasted directly.
- No sub-bullets in Format A.

### 2.8 Technical Skills Table (Format A)
Not always present. If included (e.g. Salesforce Practice Lead style), use a two-column table:
- Column 1 header: **Skill Area**
- Column 2 header: **Tools / Platforms**
- Bold header row with light fill; plain rows below.

---

## 3. Format B — Hiring Mandate / Agency Pack

### 3.1 Page Layout
- Plain DOCX, no branded header block
- Standard A4 margins (~2.5 cm)
- Font: Arial or Calibri
- Confidentiality notice at top and/or bottom: *"Netscribes — Hiring Mandate (Confidential)"* and *"Recruitment-ready. Client details are confidential. For internal distribution only."*

### 3.2 Document-Level Header (for multi-role packs)
When multiple roles are in one document, open with:
- Document title: **Job Description Pack — [Practice/Team Name]**
- Role count, location, employment type summary line
- A numbered summary table of all roles (Role | Openings | Min. Experience)
- A **Common Requirements** section covering shared filters (qualification, NDA, compliance knowledge, platform stack)

### 3.3 Per-Role Structure (Format B)
Each role in a mandate pack uses this order:

1. **Role metadata table** — compact, same two-column style as Format A Role Snapshot but simpler labels (Role, Openings, Minimum Experience, Qualification, Employment Type, Location)
2. **Role Summary** — 2–4 sentences, no bold lead-ins
3. **Key Responsibilities** — plain bullets (no bold lead-ins unless the JD was drafted in Format A style)
4. **Required Technical Skill-set** — either a dense comma-separated skills paragraph, or a two-column table (Skill Area | Tools/Platforms)
5. **Preferred Certifications** — plain bullets or inline list
6. *(Optional)* **Nice to Have** — plain bullets
7. *(Optional)* **What Success Looks Like** — 3 plain bullets summarising outcomes

### 3.4 Standalone Single-Role Mandate (Format B lite)
When a single role is shared as a standalone mandate (e.g. Workday L1/L2, Salesforce Practice Lead):
- Header is a single-row table containing role title and key metadata inline (role, experience, location, type, openings)
- Sections: About the Role → Key Responsibilities → Required Skills & Experience → Nice to Have → Education → (What Success Looks Like)
- Footer: *"Netscribes – Confidential | [Context Name] Hiring"* + page number

---

## 4. Writing Style Rules (Both Formats)

- Plain, accessible English. No em-dashes (use — only as range separator where needed, or rewrite).
- Sentences in bullets start with a verb where possible ("Build and maintain…", "Define the end-to-end…").
- Experience ranges: use en-dash without spaces (8–12 years), not hyphen.
- Module names, tool names, and certifications always capitalised correctly (Workday, GitLab CE, Kubernetes, Terraform, PyTorch, Hugging Face, etc.).
- "Full-time, Permanent" — comma-separated, not slash.
- Location: city names Title Case, slash-separated if multiple ("Mumbai / Bengaluru").
- Do not invent section names not in the template (e.g. "What Good Looks Like" is wrong; use "What Success Looks Like" only in Format B).
- Keep "About Netscribes" and "Equal Opportunity" boilerplate verbatim — do not rephrase.

---

## 5. Content Patterns by Role Type

### Engineering / Technical IC Roles (Lead, Senior, Principal)
- Role Snapshot always includes TEAM row if the person leads a pod.
- Key Responsibilities: 8–10 bullets, bold lead-in style.
- Required: 7–10 bullets covering degree, years experience, language/framework depth, specific tool proof points, and communication skills.
- Preferred: 4–6 bullets — research output, scale/enterprise experience, domain verticals.

### Support / AMS Roles (Workday, Salesforce AMS)
- Use Format B lite.
- Required section titled "Required Skills & Experience" (not "Required Qualifications").
- Add "Nice to Have" section (not "Preferred Qualifications").
- Add "What Success Looks Like" section — 3 outcome bullets max.
- Always state support model explicitly (24/5, shift coverage, time zones).

### Practice Lead / BD-Facing Roles
- Can be either format depending on whether the JD is for external posting or agency mandate.
- Pre-sales and client-facing responsibilities must be explicitly called out.
- Certifications listed separately from technical skills.

### Multi-Role Pack (Platform Engineering / DevSecOps style)
- Single DOCX containing team overview + all individual role JDs.
- Numbered sections (2.1, 2.2 …) for each role.
- Each role self-contained — a recruiter should be able to extract one section and send it independently.

---

## 6. DOCX Generation Checklist

When generating a Format A JD as DOCX using docx-js:

- [ ] Page size: A4 (`width: 11906, height: 16838` in DXA)
- [ ] Margins: 1440 DXA top/bottom (1 inch), 1080 DXA left/right (~0.75 inch) — adjust to match visual
- [ ] Header block: full-width navy `TableCell` spanning page width, white bold text, "JOB DESCRIPTION" small label + role title — use shading `ShadingType.CLEAR` with fill `#1A3C5E`
- [ ] Section headings: teal `#2E7D5E`, bold, font size 24pt (48 half-points), with bottom border rule in same colour
- [ ] Body font: Arial 11pt (22 half-points)
- [ ] Bullets: `LevelFormat.BULLET` via numbering config — never unicode
- [ ] Bold lead-ins in Key Responsibilities: `TextRun({ text: "Lead phrase:", bold: true })` followed by `TextRun({ text: " rest of sentence" })`
- [ ] Role Snapshot table: `ShadingType.CLEAR`, light border `#CCCCCC`, left column bold
- [ ] Footer: two-column via tab stops — tagline left, "Page N of N" right — no table in footer
- [ ] Validate with `python scripts/office/validate.py` after generation

---

## 7. Quick Reference — Sections by Format

| Section | Format A | Format B (pack) | Format B (standalone) |
|---|---|---|---|
| Branded header block | ✓ | ✗ | ✗ |
| Confidentiality notice | ✗ | ✓ | ✓ |
| Team overview / common requirements | ✗ | ✓ (multi-role only) | ✗ |
| Role Snapshot table | ✓ | ✓ (compact) | ✓ (inline header table) |
| About Netscribes boilerplate | ✓ | ✗ | ✗ (sometimes 1 sentence) |
| Role Overview | ✓ (2–3 paras) | Role Summary (2–4 sentences) | About the Role (prose) |
| Key Responsibilities | ✓ bold lead-ins | ✓ plain bullets | ✓ plain bullets |
| Technical Skills table | Optional | ✓ (required) | Optional |
| Required Qualifications | ✓ | ✓ as "Required Technical Skill-set" | ✓ as "Required Skills & Experience" |
| Preferred Qualifications | ✓ | ✓ as "Preferred Certifications" | ✓ as "Nice to Have" |
| What We Offer | ✓ | ✗ | ✗ |
| What Success Looks Like | ✗ | ✗ | ✓ (AMS/support roles) |
| Equal Opportunity & How to Apply | ✓ (full boilerplate) | ✗ | ✗ |
| Footer page number | ✓ | ✓ | ✓ |
