#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def login_to_saucedemo(driver, username='standard_user', password='secret_sauce'):
    print("Navigating to Sauce Demo website...")
    driver.get('https://www.saucedemo.com/')

    print("Entering username...")
    username_input = driver.find_element(By.ID, 'user-name')
    username_input.send_keys(username)

    print("Entering password...")
    password_input = driver.find_element(By.ID, 'password')
    password_input.send_keys(password)

    print("Clicking the login button...")
    login_button = driver.find_element(By.CSS_SELECTOR, 'input[type="submit"]')
    login_button.click()

    # Wait for the page to load
    time.sleep(2)

    # Check if login was successful
    if "Swag Labs" in driver.title:
        print("Login successful!")
        return True
    else:
        print("Login failed!")
        return False