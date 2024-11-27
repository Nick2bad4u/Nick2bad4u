from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os
import tkinter as tk
from tkinter import colorchooser
import threading

# Path to your chromedriver (replace with the correct path)
CHROMEDRIVER_PATH = r"C:\Users\Nick\AppData\Local\Programs\Python\Python311\Lib\site-packages\chromedriver_py\chromedriver_win64.exe"  # Adjust to your chromedriver path
CHROME_BINARY_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"  # Adjust to your chrome path

# Initialize driver as a global variable
driver = None

# Flag to track if the color selection is done
color_selection_done = False

# Fix to handle rgba colors for Tkinter GUI compatibility
def rgba_to_rgb(rgba):
    r, g, b, a = rgba
    return f"rgb({r}, {g}, {b})"  # Tkinter supports RGB, not RGBA
	
# Function to convert RGBA to Hex format for Tkinter
def rgba_to_hex(rgba):
    r, g, b, a = rgba
    return f"#{r:02x}{g:02x}{b:02x}"  # Convert RGB to Hex


# Function to select color and update GUI
def choose_color(color_type):
    color_code = colorchooser.askcolor()[1]
    if color_code:
        color_labels[color_type].config(bg=color_code)
        selected_colors[color_type] = color_code
        update_styles()

# Function to update the styles in the browser using JavaScript
def update_styles():
    if driver is None:
        return

    background_color = selected_colors.get('background', '#000000')
    foreground_color = selected_colors.get('foreground', '#9278f7')
    outline_color = selected_colors.get('outline', '#8270df')  # Use a valid color for outline

    # New CSS variables
    calendar_day_bg = selected_colors.get('calendar_day_bg', '#ebedf0')
    calendar_day_border = selected_colors.get('calendar_day_border', 'rgba(27, 31, 35, 0.06)')
    calendar_L1_bg = selected_colors.get('calendar_L1_bg', '#9be9a8')
    calendar_L2_bg = selected_colors.get('calendar_L2_bg', '#40c463')
    calendar_L3_bg = selected_colors.get('calendar_L3_bg', '#30a14e')
    calendar_L4_bg = selected_colors.get('calendar_L4_bg', '#216e39')

    # Convert RGBA outline color to RGB for use in Tkinter (just in case, but this may not be necessary here)
    outline_rgb = rgba_to_rgb([130, 80, 223, 0.5])  # Using approximate RGB value for outline

    driver.execute_script(f"document.querySelector('*').style.color = '{foreground_color}';")
    driver.execute_script(f"document.querySelector('*').style.background = '{background_color}';")
    driver.execute_script(f"""
        document.querySelectorAll('tool-tip[data-type="label"]').forEach(toolTipElement => {{ 
            if (toolTipElement.shadowRoot) {{ 
                toolTipElement.shadowRoot.host.style.setProperty('--tooltip-bgColor', '{background_color}'); 
            }} 
        }});
    """)
    driver.execute_script(f"""
        document.querySelectorAll('tool-tip[data-type="label"]').forEach(toolTipElement => {{ 
            if (toolTipElement.shadowRoot) {{ 
                toolTipElement.shadowRoot.host.style.setProperty('--tooltip-fgColor', '{foreground_color}'); 
            }} 
        }});
    """)
    driver.execute_script(f"""
        document.querySelectorAll('.ContributionCalendar-day[data-level="0"]').forEach(element => {{
            element.style.background = '{background_color}';
            element.style.outline = '1px solid {outline_color}';  // Apply the correct outline color
        }});
    """)

    # Inject new custom properties for the calendar graph
    driver.execute_script(f"""
        document.documentElement.style.setProperty('--color-calendar-graph-day-bg', '{calendar_day_bg}');
        document.documentElement.style.setProperty('--color-calendar-graph-day-border', '{calendar_day_border}');
        document.documentElement.style.setProperty('--color-calendar-graph-day-L1-bg', '{calendar_L1_bg}');
        document.documentElement.style.setProperty('--color-calendar-graph-day-L2-bg', '{calendar_L2_bg}');
        document.documentElement.style.setProperty('--color-calendar-graph-day-L3-bg', '{calendar_L3_bg}');
        document.documentElement.style.setProperty('--color-calendar-graph-day-L4-bg', '{calendar_L4_bg}');
    """)
    
# Initialize Tkinter window for color selection
root = tk.Tk()
root.title("Color Customizer")

selected_colors = {
    'background': '#000000',
    'foreground': '#9278f7',
    'outline': rgba_to_hex([130, 80, 223, 0.5]),  # Convert rgba to hex format
    'calendar_day_bg': '#ebedf0',
    'calendar_day_border': '#1b1f23',  # Converted rgb(27, 31, 35) to hex format
    'calendar_L1_bg': '#9be9a8',
    'calendar_L2_bg': '#40c463',
    'calendar_L3_bg': '#30a14e',
    'calendar_L4_bg': '#216e39'
}

color_labels = {}
for color_type in selected_colors:
    frame = tk.Frame(root)
    frame.pack(pady=5)

    label = tk.Label(frame, text=f"{color_type.replace('_', ' ').capitalize()} color:")
    label.pack(side="left", padx=10)

    color_label = tk.Label(frame, width=10, height=1, bg=selected_colors[color_type])
    color_label.pack(side="left", padx=10)
    color_labels[color_type] = color_label

    button = tk.Button(frame, text="Choose", command=lambda color=color_type: choose_color(color))
    button.pack(side="left", padx=10)

# Function to run Selenium in a background thread
def run_selenium():
    global driver  # Ensure we use the global driver variable

    # Initialize the WebDriver
    options = Options()
    options.headless = True  # Run in headless mode
    options.binary_location = CHROME_BINARY_PATH  # Specify the Chrome binary location

    service = Service(CHROMEDRIVER_PATH)
    driver = webdriver.Chrome(service=service, options=options)

    # Open the GitHub profile page
    GITHUB_URL = "https://github.com/Nick2bad4u"
    driver.get(GITHUB_URL)
    time.sleep(5)  # Wait for the page to load

    # Extract styles from the <head> element
    head = driver.find_element(By.TAG_NAME, "head")
    head_styles = head.get_attribute("innerHTML")

    # Extract the contents of the yearly contributions graph
    contribution_graph = driver.find_element(By.CSS_SELECTOR, "#user-profile-frame > div > div:nth-child(3) > div > div.col-12.col-lg-10 > div.js-yearly-contributions > div:nth-child(1)")
    graph_html = contribution_graph.get_attribute("outerHTML")

    # Combine the extracted data into an HTML document
    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Profile Data</title>
        {head_styles}  <!-- Insert the styles from the head -->
    </head>
    <body>
        <h1>GitHub Profile: Yearly Contributions</h1>
        <div>{graph_html}</div>  <!-- Insert the contribution graph HTML -->
    </body>
    </html>
    """

    # Save the HTML content to a file
    html_file_path = "github_profile_data.html"
    with open(html_file_path, "w", encoding="utf-8") as file:
        file.write(html_content)

    # Load the saved HTML file in the browser
    driver.get(f"file:///{os.path.abspath(html_file_path)}")
    time.sleep(2)  # Wait for the page to load

    # Update styles after the page is loaded
    update_styles()

    # Wait until the color selection is done before taking the screenshot
    while not color_selection_done:
        time.sleep(1)

    # Get the height of the page content (without the extra whitespace)
    page_height = driver.execute_script("return document.body.scrollHeight")

    # Resize the window to fit the content height (this removes extra whitespace)
    driver.set_window_size(800, 400)  # Set the width to 1920 or your preferred value

    # Take a screenshot of the HTML page
    screenshot_path = "github_profile_data_screenshot.png"
    driver.save_screenshot(screenshot_path)

    # Close the browser
    driver.quit()

    print(f"GitHub profile data saved to {html_file_path} and screenshot saved to {screenshot_path}")

# Start Selenium in a separate thread
selenium_thread = threading.Thread(target=run_selenium)
selenium_thread.start()

# Start Tkinter GUI event loop
root.mainloop()

# Set the flag to True once the color selection is done
color_selection_done = True
