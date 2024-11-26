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

# Calculate the total date range
start_date = datetime.strptime(years_data[0]['range']['start'], "%Y-%m-%d")
end_date = datetime.strptime(years_data[-1]['range']['end'], "%Y-%m-%d")

# Debugging: Print the date range
print("Start date:", start_date)
print("End date:", end_date)

# Validate the date range
if end_date < start_date:
    raise ValueError(f"Invalid date range: Start date {start_date} is after end date {end_date}.")

total_weeks = (end_date - start_date).days // 7 + 1
if total_weeks <= 0:
    raise ValueError(f"Calculated total_weeks is invalid: {total_weeks}. Check date range.")


# Create a unified matrix for all years
date_matrix = np.zeros((7, total_weeks))  # 7 rows for days of the week, total_weeks for the timeline
date_dict = {entry['date']: entry['intensity'] for entry in contributions}

# Fill the matrix with contributions data
current_date = start_date
while current_date <= end_date:
    day_of_week = current_date.weekday()  # Monday=0, Sunday=6
    week_of_year = (current_date - start_date).days // 7  # Week index in the unified matrix
    date_str = current_date.strftime("%Y-%m-%d")
    intensity = int(date_dict.get(date_str, 0))  # Default to 0 if no contributions

    date_matrix[day_of_week, week_of_year] = intensity
    current_date += timedelta(days=1)

# Plot the unified matrix
fig, ax = plt.subplots(figsize=(15, 7))
norm = mcolors.Normalize(vmin=0, vmax=5)
cmap = mcolors.LinearSegmentedColormap.from_list("github", ["#f6f8fa", "#0366d6"])
im = ax.imshow(date_matrix, cmap=cmap, norm=norm, aspect='auto')

# Add year separators
year_starts = [datetime.strptime(year['range']['start'], "%Y-%m-%d") for year in years_data]
year_labels = [year['year'] for year in years_data]
for start in year_starts:
    week_index = (start - start_date).days // 7
    ax.axvline(x=week_index, color='black', linestyle='--', linewidth=0.8)  # Separator line

# Configure axes
ax.set_xticks(np.arange(0, total_weeks, 52))  # Tick every 52 weeks (approx a year)
ax.set_xticklabels([(start_date + timedelta(weeks=i)).strftime("%Y-%m-%d") for i in range(0, total_weeks, 52)])
ax.set_yticks(np.arange(7))
ax.set_yticklabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
ax.set_title("GitHub Contributions Over the Years", fontsize=16)

# Add year annotations
for i, year in enumerate(year_labels):
    week_index = (year_starts[i] - start_date).days // 7
    ax.text(week_index + 1, -0.5, str(year), color='black', fontsize=12, ha='center')

# Save the figure as a PNG file
plt.savefig("scripts/unified_contributions_chart.png", bbox_inches='tight', dpi=300)



