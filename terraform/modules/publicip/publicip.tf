resource "azurerm_public_ip" "test" {
  name                = "${var.application_type}-${var.resource_type}-pubip"
  location            = var.location
  resource_group_name = var.resource_group
  allocation_method   = "Static"  # Must be Static for Standard SKU
  sku                  = "Standard"  # Ensure Standard SKU is used

  tags = {
    environment = "testing"
  }
}
