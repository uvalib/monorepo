# Developer Guide: Refreshing Annual occupancy Reports

This document provides instructions on how to regenerate the annual foot traffic report for Shannon and Clemons libraries once new database records are populated.

---

## Prerequisite: Database Credentials

Ensure you have access to the occupancy database:
* **Host**: `rds-mysql8-production.internal.lib.virginia.edu`
* **Username**: `occupancy_ro`
* **Password**: `Kagaim3CaiXie1`
* **Database**: `occupancy`

---

## Step 1: Export Updated TSV Data

Run the following command using the `mysql` client to export the range beginning from **June 29, 2025** (incorporating buffers to ensure exact results on July 1).

```bash
/opt/homebrew/opt/mysql-client@8.4/bin/mysql -h rds-mysql8-production.internal.lib.virginia.edu -u occupancy_ro -pKagaim3CaiXie1 occupancy --batch --raw -e "
SELECT serial_no, count_in, count_out, created_at
FROM rawmetrics
WHERE id >= 37920506
  AND source='sum'
  AND serial_no IN ('b8:a4:4f:5d:31:21','b8:a4:4f:5d:31:75','b8:a4:4f:5d:32:c6','b8:a4:4f:5d:59:61','b8:a4:4f:5d:59:76','b8:a4:4f:5d:59:79','b8:a4:4f:5d:59:7b','b8:a4:4f:5d:59:8c','b8:a4:4f:5d:59:90','b8:a4:4f:5d:59:94','b8:a4:4f:5d:59:9e','b8:a4:4f:5d:59:d4','b8:a4:4f:5d:5a:00',
                    'B8A44F59727B','B8A44F5972AC','ACCC8EF00E27','ACCC8EF03363','ACCC8EF03315','ACCC8EF02852','ACCC8EF031BC','B8A44F10A1F7','ACCC8EF032BF','ACCC8EF00DA0','B8A44F07125E','ACCC8EF00E06','ACCC8EF02A0E','b8:a4:4f:5d:31:54')
ORDER BY id ASC
" > counts.tsv
```

---

## Step 2: Run processing and Reporting

Execute the custom runner script which automatically partitions the `counts.tsv` data, fetches LibCal staffing calendars (using the optimized in-memory cache), and pipes the inputs into `report.py`:

```bash
/opt/homebrew/Cellar/python@3.10/3.10.18/Frameworks/Python.framework/Versions/3.10/Resources/Python.app/Contents/MacOS/Python run_annual_report.py
```

This will write individual, detailed reports to `report_clemons_annual.txt` and `report_shannon_annual.txt`.
