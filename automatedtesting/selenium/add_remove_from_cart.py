#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.common.by import By
import time
from login import login_to_saucedemo

def main():
    print("Initializing the Chrome browser...")
    driver = webdriver.Chrome()

    try:
        # Perform login
        if not login_to_saucedemo(driver):
            print("Exiting test due to login failure.")
            driver.quit()
            return

        # Add all products to the cart
        print("Adding all products to the cart...")
        products = driver.find_elements(By.CSS_SELECTOR, '.btn_primary.btn_inventory')
        for product in products:
            product.click()
            print("Product added to cart.")

        # Validate that all products are added to the cart
        cart_icon = driver.find_element(By.CSS_SELECTOR, '.shopping_cart_link')
        cart_count = cart_icon.text
        print(f'Number of items in the cart: {cart_count}')

        # Assert that the cart count is correct
        assert cart_count == str(len(products)), "Test failed: The cart count does not match the number of products added."

        print("All products added to the cart successfully!")

        # Remove all products from the cart
        print("Navigating to the cart...")
        cart_icon.click()
        time.sleep(2)  # Wait for the cart page to load

        remove_buttons = driver.find_elements(By.CSS_SELECTOR, '.btn_secondary.btn_inventory')
        for remove_button in remove_buttons:
            remove_button.click()
            print("Product removed from cart.")

        # Validate that the cart is empty
        cart_icon.click()
        time.sleep(2)  # Wait for the cart page to load
        cart_count_after_removal = driver.find_element(By.CSS_SELECTOR, '.shopping_cart_badge').text if driver.find_elements(By.CSS_SELECTOR, '.shopping_cart_badge') else '0'
        print(f'Number of items in the cart after removal: {cart_count_after_removal}')

        assert cart_count_after_removal == '0', "Test failed: The cart is not empty after removal."

        print("All products removed from the cart successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        print("Test failed.")

    finally:
        # Optional: Add some wait time to see the results before the browser closes
        time.sleep(5)  # Wait for 5 seconds
        print("Closing the browser...")
        driver.quit()

if __name__ == "__main__":
    main()