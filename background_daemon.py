import time
import subprocess
import os

def run_scraper_daemon():
    print("[Background Daemon] Bot active hoyeche. Protidin background-e live sync cholbe...")
    
    while True:
        try:
            print("[Background Daemon] Live e-commerce site theke data fetch kora shuru hocche...")
            # Run the scraper script automatically
            subprocess.run(["python3", "scraper.py"], check=True)
            print("[Background Daemon] Data sync successful! Poroborti update-er jonno 6 ghanta ghumabe.")
        except Exception as e:
            print(f"[Background Daemon Error] Sync-e somoshya hoyeche: {e}")
            
        # 6 ghanta por por auto update korbe (6 * 3600 seconds)
        time.sleep(21600)

if __name__ == "__main__":
    run_scraper_daemon()