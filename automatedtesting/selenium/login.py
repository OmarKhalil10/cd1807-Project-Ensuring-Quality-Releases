#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Start the browser and navigate to https://www.saucedemo.com/
print("Initializing the Chrome browser...")
driver = webdriver.Chrome()

try:
    print("Navigating to Sauce Demo website...")
    driver.get('https://www.saucedemo.com/')

    # Log in to the website
    print("Entering username...")
    username_input = driver.find_element(By.ID, 'user-name')
    username_input.send_keys('standard_user')  # Use a valid username

    print("Entering password...")
    password_input = driver.find_element(By.ID, 'password')
    password_input.send_keys('secret_sauce')  # Use a valid password

    print("Clicking the login button...")
    login_button = driver.find_element(By.CSS_SELECTOR, 'input[type="submit"]')
    login_button.click()

    # Wait for the page to load
    time.sleep(2)

    # Check if login was successful
    if "Swag Labs" in driver.title:
        print("Login successful!")
    else:
        print("Login failed! Exiting test.")
        driver.quit()
        exit(1)

    # Find the "Add to cart" button for the first product displayed
    print("Finding the 'Add to cart' button for the first product...")
    add_to_cart_button = driver.find_element(By.CSS_SELECTOR, '.btn_primary.btn_inventory')
    add_to_cart_button.click()
    print("Product added to cart.")

    # Locate the cart icon using `By.CSS_SELECTOR`.
    print("Locating the cart icon...")
    cart_icon = driver.find_element(By.CSS_SELECTOR, '.shopping_cart_link')

    # Validate that the product is added to the cart by checking the cart icon
    cart_count = cart_icon.text  # This should show the number of items in the cart
    print(f'Number of items in the cart: {cart_count}')

    # Assert that the cart count is correct
    assert cart_count == '1', "Test failed: The cart count is not 1."

    print("Test successful: The product was added to the cart successfully!")

except Exception as e:
    print(f"An error occurred: {e}")
    print("Test failed.")

finally:
    # Optional: Add some wait time to see the results before the browser closes
    time.sleep(5)  # Wait for 5 seconds
    print("Closing the browser...")
    driver.quit()