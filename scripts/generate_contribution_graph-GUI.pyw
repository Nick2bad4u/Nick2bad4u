import tkinter as tk
from tkinter import colorchooser, ttk
import requests
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.colors as mcolors
from datetime import datetime, timedelta
import json

# Initialize global variables for selected colors and other settings
config_file = 'config.json'
default_settings = {
    "start_color": "#E6E6E6",
    "end_color": "#1D76D2",
    "bg_color": "#FFFFFF",
    "title_color": "#000000",
    "label_color": "#000000",
    "font_size": 12,
    "graph_width": 10,
    "graph_height": 7,
    "show_legend": True,
    "show_gridlines": True,
    "custom_title": "GitHub Contributions Heatmap",
}

# Load settings from the configuration file
try:
    with open(config_file, 'r') as f:
        settings = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    settings = default_settings

# Function to save settings to the configuration file
def save_settings():
    with open(config_file, 'w') as f:
        json.dump(settings, f)

# Function to open a color picker dialog and update the selected color
def choose_color(color_type):
    color_code = colorchooser.askcolor(title="Choose Color")[1]
    if color_code:
        settings[color_type + "_color"] = color_code
        save_settings()

# Function to create and show the heatmap
def plot_heatmap():
    settings["font_size"] = int(font_size_entry.get())
    graph_size_str = graph_size_entry.get().split("x")
    settings["graph_width"] = int(graph_size_str[0].strip())
    settings["graph_height"] = int(graph_size_str[1].strip())
    settings["custom_title"] = title_entry.get().strip()
    settings["show_legend"] = legend_var.get() == 1
    settings["show_gridlines"] = gridlines_var.get() == 1
    save_settings()

    # Fetch data from the API
    url = "https://github-contributions.vercel.app/api/v1/nick2bad4u"
    response = requests.get(url)
    data = response.json()
    contributions = data.get('contributions', [])
    years_data = data.get('years', [])
    if not years_data:
        print("No years data available.")
        return
    years_data.sort(key=lambda x: datetime.strptime(x['range']['start'], "%Y-%m-%d"))
    start_date = datetime.strptime(years_data[0]['range']['start'], "%Y-%m-%d")
    end_date = datetime.strptime(years_data[-1]['range']['end'], "%Y-%m-%d")
    total_days = (end_date - start_date).days + 1
    heatmap_matrix = np.zeros((7, total_days // 7 + 1))
    date_dict = {entry['date']: entry['intensity'] for entry in contributions}
    current_date = start_date
    valid_dates = []  # List to store dates with contributions
    while current_date <= end_date:
        day_of_week = current_date.weekday()
        week_of_year = (current_date - start_date).days // 7
        date_str = current_date.strftime("%Y-%m-%d")
        intensity = int(date_dict.get(date_str, 0))
        if intensity > 0:
            heatmap_matrix[day_of_week, week_of_year] = intensity
            valid_dates.append(current_date)
        current_date += timedelta(days=1)
    non_empty_columns = [i for i in range(heatmap_matrix.shape[1]) if np.any(heatmap_matrix[:, i] > 0)]
    filtered_matrix = heatmap_matrix[:, non_empty_columns]
    fig, ax = plt.subplots(figsize=(settings["graph_width"], settings["graph_height"]))
    norm = mcolors.Normalize(vmin=0, vmax=5)
    cmap = mcolors.LinearSegmentedColormap.from_list("custom", [settings["start_color"], settings["end_color"]])
    ax.imshow(filtered_matrix, cmap=cmap, norm=norm, aspect='auto')

    tick_interval = 1
    tick_positions = np.arange(0, filtered_matrix.shape[1], step=tick_interval)
    tick_labels = [
        (start_date + timedelta(weeks=i * tick_interval)).strftime("%b %d, %Y")
        for i in range(len(tick_positions))
    ]
    ax.set_xticks(tick_positions)
    ax.set_xticklabels([])
    ax.set_yticks(np.arange(7))
    ax.set_yticklabels(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], fontsize=settings["font_size"])
    ax.set_facecolor(settings["bg_color"])
    ax.set_title(settings["custom_title"], fontsize=settings["font_size"] + 4, color=settings["title_color"])
    ax.set_xlabel("Over the Years", fontsize=settings["font_size"], color=settings["label_color"])
    ax.set_ylabel("Days of the Week", fontsize=settings["font_size"], color=settings["label_color"])
    if settings["show_gridlines"]:
        ax.grid(True, which='both', axis='both', color='gray', linestyle='--', linewidth=0.5)
    if settings["show_legend"]:
        cbar = plt.colorbar(ax.imshow(filtered_matrix, cmap=cmap, norm=norm, aspect='auto'), ax=ax, orientation="vertical")
        cbar.set_label("Contribution Intensity", fontsize=settings["font_size"], color=settings["label_color"])
    plt.tight_layout()
    plt.savefig("contributions_chart_customized.png", dpi=300)
    plt.show()

# Main UI window
root = tk.Tk()
root.title("Customize Heatmap")

style = ttk.Style()
style.configure('TButton', font=('Helvetica', 10))
style.configure('TLabel', font=('Helvetica', 10))
style.configure('TEntry', font=('Helvetica', 10))

# Labels and Buttons for UI
label_start_color = ttk.Label(root, text="Select Start Color:")
label_start_color.pack()
button_start_color = ttk.Button(root, text="Choose Start Color", command=lambda: choose_color("start"))
button_start_color.pack()

label_end_color = ttk.Label(root, text="Select End Color:")
label_end_color.pack()
button_end_color = ttk.Button(root, text="Choose End Color", command=lambda: choose_color("end"))
button_end_color.pack()

label_bg_color = ttk.Label(root, text="Select Background Color:")
label_bg_color.pack()
button_bg_color = ttk.Button(root, text="Choose Background Color", command=lambda: choose_color("bg"))
button_bg_color.pack()

label_title_color = ttk.Label(root, text="Select Title Color:")
label_title_color.pack()
button_title_color = ttk.Button(root, text="Choose Title Color", command=lambda: choose_color("title"))
button_title_color.pack()

label_label_color = ttk.Label(root, text="Select Label Color:")
label_label_color.pack()
button_label_color = ttk.Button(root, text="Choose Label Color", command=lambda: choose_color("label"))
button_label_color.pack()

label_font_size = ttk.Label(root, text="Select Font Size:")
label_font_size.pack()
font_size_entry = ttk.Entry(root)
font_size_entry.insert(0, str(settings["font_size"]))
font_size_entry.pack()

label_graph_size = ttk.Label(root, text="Select Graph Size (Width x Height):")
label_graph_size.pack()
graph_size_entry = ttk.Entry(root)
graph_size_entry.insert(0, f'{settings["graph_width"]} x {settings["graph_height"]}')
graph_size_entry.pack()

label_title = ttk.Label(root, text="Customize Heatmap Title:")
label_title.pack()
title_entry = ttk.Entry(root)
title_entry.insert(0, settings["custom_title"])
title_entry.pack()

label_legend = ttk.Label(root, text="Show Legend:")
label_legend.pack()
legend_var = tk.IntVar(value=int(settings["show_legend"]))
check_legend = ttk.Checkbutton(root, variable=legend_var)
check_legend.pack()

label_gridlines = ttk.Label(root, text="Show Gridlines:")
label_gridlines.pack()
gridlines_var = tk.IntVar(value=int(settings["show_gridlines"]))
check_gridlines = ttk.Checkbutton(root, variable=gridlines_var)
check_gridlines.pack()

plot_button = ttk.Button(root, text="Plot Heatmap", command=plot_heatmap)
plot_button.pack()

root.mainloop()
