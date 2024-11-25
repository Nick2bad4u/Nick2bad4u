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
# Extract contributions for a specific year (e.g., 2024)
year = "2024"
contributions = [c for c in data["contributions"] if c["date"].startswith(year)]

# Create a grid for heatmap (7 rows for days of the week, 53 columns for weeks in a year)
weeks = 53
days = 7
heatmap_data = np.zeros((days, weeks))

# Populate heatmap data
for contribution in contributions:
    date = datetime.strptime(contribution["date"], "%Y-%m-%d")
    week_index = date.isocalendar()[1] - 1  # Week number (1-based)
    day_index = date.weekday()  # Day of the week (0=Monday, 6=Sunday)
    heatmap_data[day_index, week_index] = contribution["count"]

# Step 3: Create Heatmap
plt.figure(figsize=(20, 5))
plt.imshow(
    heatmap_data, 
    cmap="Greens", 
    interpolation="nearest", 
    aspect="auto", 
    origin="lower"
)

# Add labels and titles
plt.colorbar(label="Contribution Count")
plt.yticks(ticks=range(7), labels=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
plt.xticks(ticks=range(0, weeks, 4), labels=[f"Week {i}" for i in range(0, weeks, 4)], rotation=45)
plt.title(f"GitHub Contributions for {username} ({year})")
plt.tight_layout()

# Save the graph as an image
plt.savefig("contributions_heatmap.png")
print("Graph saved as 'contributions_heatmap.png'")

# Display the graph
plt.show()
