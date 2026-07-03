# run_annual_report.py
import os
import subprocess
import sys

# Clemons serials
clemons_serials = [
    'B8A44F59727B', 'B8A44F5972AC', 'ACCC8EF00E27', 'ACCC8EF03363',
    'ACCC8EF03315', 'ACCC8EF02852', 'ACCC8EF031BC', 'B8A44F10A1F7',
    'ACCC8EF032BF', 'ACCC8EF00DA0', 'B8A44F07125E', 'ACCC8EF00E06',
    'ACCC8EF02A0E', 'b8:a4:4f:5d:31:54'
]

# Shannon serials
shannon_serials = [
    'b8:a4:4f:5d:31:21', 'b8:a4:4f:5d:31:75', 'b8:a4:4f:5d:32:c6',
    'b8:a4:4f:5d:59:61', 'b8:a4:4f:5d:59:76', 'b8:a4:4f:5d:59:79', 'b8:a4:4f:5d:59:7b',
    'b8:a4:4f:5d:59:8c', 'b8:a4:4f:5d:59:90', 'b8:a4:4f:5d:59:94', 'b8:a4:4f:5d:59:9e',
    'b8:a4:4f:5d:59:d4', 'b8:a4:4f:5d:5a:00'
]

python_path = '/opt/homebrew/Cellar/python@3.10/3.10.18/Frameworks/Python.framework/Versions/3.10/Resources/Python.app/Contents/MacOS/Python'

def run_pipeline(name, serials):
    print(f"\n==================================================")
    print(f"PROCESSING ANNUAL TRAFFIC FOR: {name.upper()}")
    print(f"==================================================")
    
    # Comma-separated serials
    serial_str = ",".join(serials)
    
    # 1. Run process-occupancy.py
    print(f"Running process-occupancy.py for {name}...")
    env = os.environ.copy()
    env['SERIAL_NO'] = serial_str
    
    p = subprocess.Popen(
        [python_path, 'process-occupancy.py'],
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = p.communicate()
    
    if p.returncode != 0:
        print(f"Error running process-occupancy.py for {name}:")
        print(stderr)
        return None
    print(stdout.strip())
    
    # 2. Run report.py
    print(f"Generating report.py for {name}...")
    p_rep = subprocess.Popen(
        [python_path, 'report.py'],
        env=env,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    # Inputs: start_date, end_date, start_time, end_time
    report_inputs = "2025-07-01\n2026-06-30\n00:00\n24:00\n"
    stdout_rep, stderr_rep = p_rep.communicate(input=report_inputs)
    
    if p_rep.returncode != 0:
        print(f"Error running report.py for {name}:")
        print(stderr_rep)
        return None
        
    return stdout_rep

def main():
    # Run Clemons
    clemons_output = run_pipeline("Clemons Library", clemons_serials)
    if clemons_output is None:
        print("Clemons processing failed.")
        sys.exit(1)
        
    # Run Shannon
    shannon_output = run_pipeline("Shannon Library", shannon_serials)
    if shannon_output is None:
        print("Shannon processing failed.")
        sys.exit(1)
        
    # Save the reports to files
    with open("report_clemons_annual.txt", "w") as f:
        f.write(clemons_output)
    with open("report_shannon_annual.txt", "w") as f:
        f.write(shannon_output)
        
    print("\n\n==================================================")
    print("CONSOLIDATED ANNUAL FOOT TRAFFIC SUMMARY")
    print("(Period: July 1, 2025 - June 30, 2026)")
    print("==================================================")
    
    def extract_totals(output_text):
        # Look for "Total for building over the period: in X, out Y, combined Z"
        for line in output_text.split('\n'):
            if "Total for building over the period:" in line:
                return line.strip()
        return "Totals not found in report output."
        
    clemons_totals = extract_totals(clemons_output)
    shannon_totals = extract_totals(shannon_output)
    
    print(f"CLEMONS LIBRARY:\n  {clemons_totals}\n")
    print(f"SHANNON LIBRARY:\n  {shannon_totals}\n")
    print("Full report logs saved to: report_clemons_annual.txt and report_shannon_annual.txt")
    print("==================================================")

if __name__ == '__main__':
    main()
