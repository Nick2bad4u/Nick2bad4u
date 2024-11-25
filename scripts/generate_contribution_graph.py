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

# Debugging: Print out a few entries to verify
for i in range(5):
    print(f"Date: {dates[i]}, Count: {counts[i]}")

# Prepare heatmap grid (52 weeks x 7 days)
heatmap_data = np.zeros((7, 52))  # 7 rows (days), 52 columns (weeks)

for date, count in zip(dates, counts):
    week = date.isocalendar()[1] - 1  # Week of the year (1-52, adjust to 0-indexed)
    day = date.weekday()  # Day of the week (Monday=0, Sunday=6)
    if week < 52:  # Ensure valid weeks
        heatmap_data[day, week] += count

# Debugging: Print the heatmap data to check
print("Heatmap data array:")
print(heatmap_data)

# Step 3: Create Heatmap
plt.figure(figsize=(20, 5))
plt.imshow(
    heatmap_data,
    cmap="Greens",
    interpolation="nearest",
    aspect="auto",
    origin="lower",
    vmin=0,  # Set minimum value for color scale
    vmax=np.max(counts) if counts else 1  # Set maximum value for color scale
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
