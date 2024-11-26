import requests
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors
from datetime import datetime, timedelta
from matplotlib.gridspec import GridSpec

# Fetch data from the API
url = "https://github-contributions.vercel.app/api/v1/nick2bad4u"
response = requests.get(url)
data = response.json()

# Debugging: Check the response to ensure 'years' data is available
print("Response data:", data)

# Extract contribution data
contributions = data.get('contributions', [])
years_data = data.get('years', [])

# Check if 'years_data' is empty
if not years_data:
    print("No years data available.")
    exit()  # Exit if no data is found

# Create the figure and GridSpec
fig = plt.figure(figsize=(10, 6 * len(years_data)))
grid = GridSpec(len(years_data), 1, hspace=0.1)  # Reduced hspace for tighter vertical spacing

# Loop over each year in the response to create a separate graph for each
for i, year_data in enumerate(years_data):
    year = year_data['year']
    start_date = datetime.strptime(year_data['range']['start'], "%Y-%m-%d")
    end_date = datetime.strptime(year_data['range']['end'], "%Y-%m-%d")
    
    # Generate the matrix for plotting
    num_weeks = (end_date - start_date).days // 7 + 1
    date_matrix = np.zeros((7, num_weeks))  # Adjust number of weeks dynamically
    date_dict = {entry['date']: entry['intensity'] for entry in contributions}

    current_date = start_date
    while current_date <= end_date:
        day_of_week = current_date.weekday()  # Monday=0, Sunday=6
        week_of_year = (current_date - start_date).days // 7  # Week index in the matrix
        date_str = current_date.strftime("%Y-%m-%d")
        intensity = int(date_dict.get(date_str, 0))  # Default to 0 if no contributions

        date_matrix[day_of_week, week_of_year] = intensity
        current_date += timedelta(days=1)

    # Add subplot to GridSpec
    ax = fig.add_subplot(grid[i])
    norm = mcolors.Normalize(vmin=0, vmax=5)
    cmap = mcolors.LinearSegmentedColormap.from_list("github", ["#f6f8fa", "#0366d6"])
    im = ax.imshow(date_matrix, cmap=cmap, norm=norm, aspect='auto')  # Force aspect ratio

    # Configure calendar grid and labels
    ax.set_xticks(np.arange(num_weeks))
    ax.set_yticks(np.arange(7))
    ax.set_xticklabels([f"Week {i+1}" for i in range(num_weeks)], rotation=90)
    ax.set_yticklabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    ax.set_title(f"GitHub Contributions for {year}", fontsize=14, pad=10)  # Reduce title padding

# Save the figure as a PNG file
plt.savefig("scripts/contributions_chart.png", bbox_inches='tight', dpi=300)


