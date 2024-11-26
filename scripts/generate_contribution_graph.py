import requests
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Step 1: Fetch Data
username = "nick2bad4u"
url = f"https://github-contributions.vercel.app/api/v1/{username}"
response = requests.get(url)
data = response.json()

# Debugging: Check API response
if "contributions" not in data:
    print("Invalid API response. No 'contributions' key found.")
    exit()

contributions = data["contributions"]

# Step 2: Parse Contributions
dates = [datetime.strptime(entry["date"], "%Y-%m-%d") for entry in contributions]
counts = [entry["count"] for entry in contributions]

# Guard against empty data
if not dates or not counts:
    print("No contributions data available. Exiting...")
    exit()

# Debugging: Log the first few parsed contributions
for i in range(min(5, len(dates))):  # Avoid out-of-range error
    print(f"Parsed Date: {dates[i]}, Count: {counts[i]}")

# Rest of the script...
# Prepare heatmap grid (12 months x 7 days)
heatmap_data = np.zeros((7, 12))  # 7 rows (days), 12 columns (months)
monthly_contribs = {i: 0 for i in range(12)}  # To count contributions for each month

for date, count in zip(dates, counts):
    if count > 0:  # Only process contributions with count > 0
        month = date.month - 1  # Month of the year (1-12, adjust to 0-indexed)
        day = date.weekday()  # Day of the week (Monday=0, Sunday=6)

        # Ensure valid months and days
        if 0 <= month < 12:
            heatmap_data[day, month] += count
            monthly_contribs[month] += count

# Debugging: Print the monthly contributions summary
print("Monthly Contributions Summary:")
for month, total in monthly_contribs.items():
    print(f"Month {month + 1}: {total} contributions")

# Create and save the heatmap
plt.figure(figsize=(20, 5))
plt.imshow(
    heatmap_data,
    cmap="Greens",
    interpolation="nearest",
    aspect="auto",
    origin="lower",
    vmin=0,
    vmax=np.max(heatmap_data) if np.max(heatmap_data) > 0 else 1
)
plt.colorbar(label="Contribution Count")
plt.yticks(ticks=range(7), labels=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
plt.xticks(ticks=range(12), labels=[f"Month {i+1}" for i in range(12)], rotation=45)
plt.title(f"GitHub Contributions for {username} (2024) - Grouped by Month")
plt.tight_layout()
plt.savefig("contributions_heatmap_monthly.png")
print("Graph saved as 'contributions_heatmap_monthly.png'")
plt.show()
