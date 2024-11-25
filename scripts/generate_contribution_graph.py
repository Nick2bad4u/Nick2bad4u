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
# Filter contributions by year (optional, use the latest year with contributions)
contributions = data["contributions"]
dates = [datetime.strptime(entry["date"], "%Y-%m-%d") for entry in contributions]
counts = [entry["count"] for entry in contributions]

# Debugging: Log contribution data to verify correct parsing
for i in range(5):  # Print first 5 entries for debugging
    print(f"Date: {dates[i]}, Count: {counts[i]}")

# Prepare heatmap grid (52 weeks x 7 days)
heatmap_data = np.zeros((7, 52))  # 7 rows (days), 52 columns (weeks)

# Log weekly contribution counts
weekly_contribs = {i: 0 for i in range(52)}  # To count contributions for each week
for date, count in zip(dates, counts):
    week = date.isocalendar()[1] - 1  # Week of the year (1-52, adjust to 0-indexed)
    day = date.weekday()  # Day of the week (Monday=0, Sunday=6)
    if week < 52:  # Ensure valid weeks
        heatmap_data[day, week] += count
        weekly_contribs[week] += count

# Debugging: Print the weekly contributions summary
print("Weekly Contributions Summary:")
for week, total in weekly_contribs.items():
    print(f"Week {week + 1}: {total} contributions")

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
plt.xticks(ticks=range(0, 52, 4), labels=[f"Week {i}" for i in range(1, 53, 4)], rotation=45)
plt.title(f"GitHub Contributions for {username} (2024)")
plt.tight_layout()

# Save the graph as an image
plt.savefig("contributions_heatmap.png")
print("Graph saved as 'contributions_heatmap.png'")

# Display the graph
plt.show()
