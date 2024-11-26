import requests
import plotly.graph_objects as go
import numpy as np
from datetime import datetime, timedelta
import plotly.io as pio

# Fetch data from the API
url = "https://github-contributions.vercel.app/api/v1/nick2bad4u"
response = requests.get(url)
data = response.json()

# Extract contribution data
contributions = data['contributions']
years_data = data['years']

# Create a figure to plot multiple years
fig = go.Figure()

# Loop over each year in the response to create a separate graph for each
for year_data in years_data:
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

    # Add this year's contribution matrix to the Plotly figure
    fig.add_trace(go.Heatmap(
        z=date_matrix,
        colorscale='Blues',  # Default color scale (you can change this dynamically)
        colorbar=dict(title='Contributions'),
        zmin=0, zmax=5,  # Set intensity limits (adjust as needed)
        showscale=True,
        name=f'GitHub Contributions {year}'
    ))

# Update layout for interactivity and scrolling
fig.update_layout(
    title="GitHub Contributions Over Multiple Years",
    xaxis=dict(
        title="Weeks of the Year",
        tickmode="array",
        tickvals=np.arange(53),
        ticktext=[f"Week {i+1}" for i in range(53)],
        rangeslider=dict(
            visible=True  # Add the slider for the x-axis
        )
    ),
    yaxis=dict(
        title="Days of the Week",
        tickmode="array",
        tickvals=np.arange(7),
        ticktext=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    ),
    height=800,  # Make the graph large enough to show all years
    showlegend=True
)

# Save the plot as a PNG file
pio.write_image(fig, 'contributions_chart.png')
