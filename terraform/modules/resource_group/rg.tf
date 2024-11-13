variable "create" {
  type    = bool
  default = true
}

resource "azurerm_resource_group" "test" {
  count    = var.create ? 1 : 0
  name     = var.resource_group
  location = var.location
}
