# Dataset Schema Documentation

## Purpose

This document defines the **column structure, data types, and validation rules** for the datasets distributed with this project.

The schema applies identically across the following files:

- `dataset.csv` – Canonical machine-readable dataset used by ML pipelines
- `dataset.xlsx` – Human-readable dataset for clinical and governance review
- `schema.md` – Authoritative schema definition

The dataset supports **clinical triage classification, urgency assessment, and request routing**, without providing medical diagnosis.

---

## File Overview

| File Name | Purpose |
|---------|--------|
| `dataset.csv` | Primary dataset used by ML pipelines and automated systems |
| `dataset.xlsx` | Clinician-reviewable format for validation and governance |
| `schema.md` | Column definitions, data types, and validation rules |

---

## Dataset Schema

### Column Definitions

| Column Name | Data Type | Required | Description |
|------------|----------|----------|-------------|
| `SYMPTOMS/DISEASES` | string | Yes | Reported symptom or disease name expressed in plain language |
| `CLASSIFICATION` | enum | Yes | Triage routing decision (`999`, `111`, `GP`, `GP_NON_CLINICAL`) |
| `EMERGENCY INTENSITY` | integer | Yes | Urgency score ranging from 1 to 100 |
| `CLINICAL/NON CLINICAL` | enum | Yes | Indicates whether the request is clinical or administrative |
| `CATEGORY` | string | Yes | High-level grouping of the symptom or request |

---

## Field Constraints and Validation Rules

### CLASSIFICATION
Allowed values:
- `999` – Life-threatening emergency
- `111` – Urgent but non-emergency
- `GP` – Clinical GP review required
- `GP_NON_CLINICAL` – Administrative or non-clinical request

### EMERGENCY INTENSITY
- Must be an integer between **1 and 100**
- General guidance:
  - `999` → typically ≥ 90
  - `111` → typically 50–89
  - `GP` → typically 20–60
  - `GP_NON_CLINICAL` → typically ≤ 30

### CLINICAL/NON CLINICAL
Allowed values:
- `CLINICAL`
- `NON_CLINICAL`

This field must align logically with `CLASSIFICATION`.

---

## Schema Consistency Rules

- Column names and column order **must remain identical** across:
  - `dataset.csv`
  - `dataset.xlsx`
- Any schema change requires:
  - Update to `schema.md`
  - Dataset version increment

---

## Governance and Usage Notes

- This dataset is intended for **triage support and request routing only**
- It **does not provide diagnosis or treatment advice**
- Suitable for:
  - AI-assisted GP receptionist systems
  - Non-clinical call handling
  - Safe triage classification research
- Must be used within appropriate clinical governance frameworks

---

## Versioning

| Version | Date | Description |
|--------|------|-------------|
| 1.0 | YYYY-MM-DD | Initial schema definition based on Dataset.xlsx |

---
