import requests
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

# Step 1: Fetch Data
username = "nick2bad4u"
url = f"https://github-contributions.vercel.app/api/v1/{username}"
response = requests.get(url)
data = response.json()

# Step 2: Parse Data
# Initialize a grid for contributions
weeks = len(data["contributions"])  # Number of weeks
days = 7  # Days in a week
heatmap_data = np.zeros((days, weeks))

# Populate heatmap data
for week_index, week in enumerate(data["contributions"]):
    for day_data in week["days"]:
        day_index = datetime.strptime(day_data["date"], "%Y-%m-%d").weekday()
        heatmap_data[day_index][week_index] = day_data["count"]

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
plt.title(f"GitHub Contributions for {username}")
plt.tight_layout()

# Save the graph as an image
plt.savefig("contributions_heatmap.png")
print("Graph saved as 'contributions_heatmap.png'")

# Display the graph
plt.show()
