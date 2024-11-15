# login.py
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import datetime

def login(driver, user, password):
    try:
        print(timestamp() + 'Navigating to the demo page to login.')
        driver.get('https://www.saucedemo.com/')

        print(timestamp() + 'Entering username...')
        driver.find_element(By.CSS_SELECTOR, "input[id='user-name']").send_keys(user)

        print(timestamp() + 'Entering password...')
        driver.find_element(By.CSS_SELECTOR, "input[id='password']").send_keys(password)

        print(timestamp() + 'Clicking login button...')
        driver.find_element(By.CSS_SELECTOR, "input[id='login-button']").click()

        # Wait for the logo to be present
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".app_logo")))
        print(timestamp() + 'Login successful.')
        return True

    except Exception as e:
        print(timestamp() + f'Error during login: {e}')
        return False

def timestamp():
    ts = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    return (ts + ' ')