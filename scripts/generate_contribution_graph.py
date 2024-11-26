import requests
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors
from datetime import datetime, timedelta

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

# Create the figure and the subplots
fig, axes = plt.subplots(len(years_data), 1, figsize=(10, 7 * len(years_data)))
fig.tight_layout(pad=1.0)  # Add some padding between subplots

# Loop over each year in the response to create a separate graph for each
for i, year_data in enumerate(years_data):
    year = year_data['year']
    start_date = datetime.strptime(year_data['range']['start'], "%Y-%m-%d")
    end_date = datetime.strptime(year_data['range']['end'], "%Y-%m-%d")
    
    # Generate the matrix for plotting
    date_matrix = np.zeros((7, 53))  # 7 rows for days of the week, 53 columns for weeks in a year
    date_dict = {entry['date']: entry['intensity'] for entry in contributions}

    # Fill the matrix with contribution intensities for this year
    current_date = start_date
    while current_date <= end_date:
        day_of_week = current_date.weekday()  # Monday=0, Sunday=6
        week_of_year = current_date.isocalendar()[1]  # Week number (1-53)
        date_str = current_date.strftime("%Y-%m-%d")
        intensity = int(date_dict.get(date_str, 0))  # 0 if no contributions for that day

        # Put the intensity in the correct spot in the matrix
        date_matrix[day_of_week, week_of_year - 1] = intensity

        current_date = current_date + timedelta(days=1)  # Add one day to current_date

    # Create a color map for the graph
    norm = mcolors.Normalize(vmin=0, vmax=5)
    cmap = mcolors.LinearSegmentedColormap.from_list("github", ["#f6f8fa", "#0366d6"])

    ax = axes[i] if len(years_data) > 1 else axes  # If multiple years, select the appropriate axis
    im = ax.imshow(date_matrix, cmap=cmap, norm=norm)

    # Disable color bar by not creating one explicitly

    # Configure the calendar grid and labels
    ax.set_xticks(np.arange(53))
    ax.set_yticks(np.arange(7))
    ax.set_xticklabels([f"Week {i+1}" for i in range(53)], rotation=90)
    ax.set_yticklabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])

    # Title for the current year
    ax.set_title(f"GitHub Contributions for {year}", fontsize=14)

# Save the figure as a PNG file
plt.savefig("scripts/contributions_chart.png", bbox_inches='tight', dpi=300)  # 'bbox_inches=tight' ensures no clipping of labels



