resource "azurerm_service_plan" "test" {
  name                = "${var.application_type}-${var.resource_type}-${random_id.unique_id.hex}"  # Unique name for the service plan
  location            = var.location
  resource_group_name = var.resource_group
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "test" {
  name                = "${var.application_type}-${var.resource_type}-${random_id.unique_id.hex}"  # Unique name for the web app
  location            = var.location
  resource_group_name = var.resource_group
  service_plan_id     = azurerm_service_plan.test.id

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = 0
  }

  site_config {
    always_on = false
  }
}

resource "random_id" "unique_id" {
  byte_length = 8
}
