import requests
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors
from datetime import datetime, timedelta

# Fetch data from the API
url = "https://github-contributions.vercel.app/api/v1/nick2bad4u"
response = requests.get(url)
data = response.json()

# Extract contribution data
contributions = data.get('contributions', [])
years_data = data.get('years', [])

# Check if 'years_data' is empty
if not years_data:
    print("No years data available.")
    exit()  # Exit if no data is found

# Sort the years data by start date
years_data.sort(key=lambda x: datetime.strptime(x['range']['start'], "%Y-%m-%d"))

# Calculate the total date range
start_date = datetime.strptime(years_data[0]['range']['start'], "%Y-%m-%d")
end_date = datetime.strptime(years_data[-1]['range']['end'], "%Y-%m-%d")

# Validate the date range
if end_date < start_date:
    raise ValueError(f"Invalid date range: Start date {start_date} is after end date {end_date}.")

# Calculate total days in the date range
total_days = (end_date - start_date).days + 1

# Create the matrix for the heatmap (7 rows for days of the week, total columns for days in range)
heatmap_matrix = np.zeros((7, total_days // 7 + 1))  # Adjust columns based on number of weeks
date_dict = {entry['date']: entry['intensity'] for entry in contributions}

# Populate the heatmap matrix
current_date = start_date
valid_dates = []  # List to store dates with contributions
while current_date <= end_date:
    day_of_week = current_date.weekday()  # Get the weekday (0 = Monday, 6 = Sunday)
    week_of_year = (current_date - start_date).days // 7  # Week number from start date
    date_str = current_date.strftime("%Y-%m-%d")
    intensity = int(date_dict.get(date_str, 0))  # Default to 0 if no contributions

    if intensity > 0:
        heatmap_matrix[day_of_week, week_of_year] = intensity
        valid_dates.append(current_date)  # Add the date to valid_dates if there's a contribution

    current_date += timedelta(days=1)  # Move to the next day

# Remove empty weeks (columns where all days are 0)
non_empty_columns = [i for i in range(heatmap_matrix.shape[1]) if np.any(heatmap_matrix[:, i] > 0)]
filtered_matrix = heatmap_matrix[:, non_empty_columns]

# Create the heatmap
fig, ax = plt.subplots(figsize=(10, 7))  # Adjust figure size to match GitHub's grid

# Define the colormap and normalize intensity values to match GitHub's contribution graph
norm = mcolors.Normalize(vmin=0, vmax=5)  # Adjust to match the intensity scale (0 to 5)
cmap = mcolors.LinearSegmentedColormap.from_list("github", ["#E6E6E6", "#1D76D2"])  # Light gray to dark blue

# Plot the filtered heatmap
im = ax.imshow(filtered_matrix, cmap=cmap, norm=norm, aspect='auto')

# Configure the x-axis labels to show only weeks with contributions
tick_interval = 4  # Label every 4th week (adjust based on your dataset)
tick_positions = np.arange(0, filtered_matrix.shape[1], step=tick_interval)

# Set ticks and labels on the x-axis, showing only valid weeks with contributions
tick_labels = [
    (start_date + timedelta(weeks=i * tick_interval)).strftime("%b %d, %Y")
    for i in range(len(tick_positions))
]
ax.set_xticks(tick_positions)
ax.set_xticklabels(tick_labels, rotation=45, ha="right")  # Rotate for better readability

# Set y-ticks to represent days of the week (Mon-Sun)
ax.set_yticks(np.arange(7))
ax.set_yticklabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])

# Remove gridlines (GitHub doesn't have them)
ax.grid(False)

# Add title and axis labels (Optional)
ax.set_title("GitHub Contributions Heatmap", fontsize=16)
ax.set_xlabel("Weeks", fontsize=12)
ax.set_ylabel("Days of the Week", fontsize=12)

# Add a color bar to represent contribution intensity
cbar = plt.colorbar(im, ax=ax, orientation="vertical")
cbar.set_label("Contribution Intensity", fontsize=12)

# Show the plot
plt.tight_layout()
plt.savefig("contributions_chart_github_style_filtered.png", dpi=300)
plt.show()
