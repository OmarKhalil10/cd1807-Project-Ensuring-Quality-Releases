# main.py
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import datetime
from login import login

# Start the browser and perform the test
def start():
    print(timestamp() + 'Starting Chrome...')
    
    # Options for headless execution
    options = ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-sandbox")
    options.add_argument("--remote-debugging-port=9222")
    
    driver = webdriver.Chrome(options=options)

    # Perform login
    if login(driver, 'standard_user', 'secret_sauce'):
        # Add items to the cart
        add_cart(driver)
        
        # Remove items from the cart
        remove_cart(driver)

    driver.quit()
    print(timestamp() + 'Browser closed.')

# Add items to the cart
def add_cart(driver):
    try:
        print(timestamp() + 'Adding products to the cart...')
        product_elements = driver.find_elements(By.CSS_SELECTOR, ".inventory_item")

        for product in product_elements:
            product_name = product.find_element(By.CSS_SELECTOR, ".inventory_item_name").text
            product.find_element(By.CSS_SELECTOR, ".btn_inventory").click()
            print(timestamp() + "Product '{}' added to the cart.".format(product_name))

        cart_count = int(driver.find_element(By.CSS_SELECTOR, ".shopping_cart_badge").text)
        assert cart_count == len(product_elements), 'The cart count is incorrect.'
        print(timestamp() + 'All products added successfully. Cart count = ' + str(cart_count))
    
    except Exception as e:
        print(timestamp() + 'Error while adding products: {}'.format(e))

# Remove items from the cart
def remove_cart(driver):
    try:
        print(timestamp() + 'Navigating to the cart page...')
        driver.find_element(By.CSS_SELECTOR, ".shopping_cart_link").click()

        print(timestamp() + 'Removing all products from the cart...')
        remove_buttons = driver.find_elements(By.CSS_SELECTOR, ".cart_button")

        for remove in remove_buttons:
            remove.click()
            print(timestamp() + 'Product removed.')

        cart_count_element = driver.find_elements(By.CSS_SELECTOR, ".shopping_cart_badge")
        assert len(cart_count_element) == 0, "Cart is not empty after removal."
        print(timestamp() + 'All products removed successfully.')

    except Exception as e:
        print(timestamp() + f'Error while removing products: {e}')

# Timestamp function
def timestamp():
    ts = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
    return (ts + ' ')

if __name__ == "__main__":
    start()
