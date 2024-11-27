from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os

# Path to your chromedriver (replace with the correct path)
CHROMEDRIVER_PATH = r"C:\Users\Nick\AppData\Local\Programs\Python\Python311\Lib\site-packages\chromedriver_py\chromedriver_win64.exe"  # Adjust to your chromedriver path
CHROME_BINARY_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"  # Adjust to your chrome path

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

# Change the background color using JavaScript (for example, to light gray)
driver.execute_script("document.querySelector('*').style.color = '#9278f7';")
driver.execute_script("document.querySelector('*').style.background = '#000000';")
driver.execute_script("""
    document.querySelectorAll('tool-tip[data-type="label"]').forEach(toolTipElement => { 
        if (toolTipElement.shadowRoot) { 
            toolTipElement.shadowRoot.host.style.setProperty('--tooltip-bgColor', 'black'); 
        } 
    });
""")

driver.execute_script("""
    document.querySelectorAll('tool-tip[data-type="label"]').forEach(toolTipElement => { 
        if (toolTipElement.shadowRoot) { 
            toolTipElement.shadowRoot.host.style.setProperty('--tooltip-fgColor', '#9278f7'); 
        } 
    });
""")

driver.execute_script("""
    document.querySelectorAll('.ContributionCalendar-day[data-level="0"]').forEach(element => {
        element.style.background = '#000000';
    });
""")

driver.execute_script("""
    document.querySelectorAll('.ContributionCalendar-day[data-level="0"]').forEach(element => {
        element.style.outline = '1px solid rgba(130, 80, 223, 0.5)';
    });
""")


# Get the height of the page content (without the extra whitespace)
page_height = driver.execute_script("return document.body.scrollHeight")

# Resize the window to fit the content height (this removes extra whitespace)
driver.set_window_size(800, 400)  # Set the width to 1920 or your preferred value

# Take a screenshot of the HTML page
screenshot_path = "github_profile_data_screenshot.png"
driver.save_screenshot(screenshot_path)

# Close the browser
driver.quit()

print(f"GitHub profile data saved as '{html_file_path}' and screenshot saved as '{screenshot_path}'")
