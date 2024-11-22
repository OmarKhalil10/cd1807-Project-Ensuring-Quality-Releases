resource "azurerm_service_plan" "test" {
  name                = "${var.application_type}-${var.resource_type}"
  location            = var.location
  resource_group_name = var.resource_group
  os_type             = "Windows" # Updated to Windows for ASP.NET runtime
  sku_name            = "F1"
}

resource "azurerm_windows_web_app" "test" {
  name                = "${var.application_type}-${var.resource_type}"
  location            = var.location
  resource_group_name = var.resource_group
  service_plan_id     = azurerm_service_plan.test.id

  site_config {
    always_on = false
    ftps_state = "Disabled"

    # Set the .NET Framework runtime
    windows_fx_version = "ASPNet|V4.8" # Runtime for ASP.NET Framework 4.8
  }

  app_settings = {
    "WEBSITE_RUN_FROM_PACKAGE" = "1" # Set app setting separately
  }
}
