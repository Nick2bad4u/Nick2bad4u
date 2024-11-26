import requests
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Step 1: Fetch Data
username = "nick2bad4u"
url = f"https://github-contributions.vercel.app/api/v1/{username}"
response = requests.get(url)
data = response.json()

# Step 2: Parse Contributions
contributions = data["contributions"]
dates = [datetime.strptime(entry["date"], "%Y-%m-%d") for entry in contributions]
counts = [entry["count"] for entry in contributions]

# Debugging: Log contribution data to verify correct parsing
for i in range(5):  # Print first 5 entries for debugging
    print(f"Date: {dates[i]}, Count: {counts[i]}")

# Prepare heatmap grid (12 months x 7 days)
heatmap_data = np.zeros((7, 12))  # 7 rows (days), 12 columns (months)

# Log monthly contribution counts
monthly_contribs = {i: 0 for i in range(12)}  # To count contributions for each month

# Ensure contributions are correctly mapped to the right month and day
for date, count in zip(dates, counts):
    if count > 0:  # Only process contributions with count > 0
        month = date.month - 1  # Month of the year (1-12, adjust to 0-indexed)
        day = date.weekday()  # Day of the week (Monday=0, Sunday=6)
        
        # Ensure valid months and days
        if month < 12:  # Ensure valid months
            heatmap_data[day, month] += count
            monthly_contribs[month] += count

# Debugging: Print the monthly contributions summary
print("Monthly Contributions Summary:")
for month, total in monthly_contribs.items():
    print(f"Month {month + 1}: {total} contributions")

# Step 3: Create Heatmap with better scaling
plt.figure(figsize=(20, 5))
plt.imshow(
    heatmap_data,
    cmap="Greens",
    interpolation="nearest",
    aspect="auto",
    origin="lower",
    vmin=0,  # Set minimum value for color scale
    vmax=np.max(heatmap_data) if np.max(heatmap_data) > 0 else 1  # Ensure the scale covers all data
)

# Add labels and titles
plt.colorbar(label="Contribution Count")
plt.yticks(ticks=range(7), labels=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
plt.xticks(ticks=range(0, 12), labels=[f"Month {i+1}" for i in range(12)], rotation=45)
plt.title(f"GitHub Contributions for {username} (2024) - Grouped by Month")
plt.tight_layout()

# Save the graph as an image
plt.savefig("contributions_heatmap_monthly.png")
print("Graph saved as 'contributions_heatmap_monthly.png'")

# Display the graph
plt.show()
