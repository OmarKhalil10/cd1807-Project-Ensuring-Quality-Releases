output "resource_group_name" {
  value = length(azurerm_resource_group.test) > 0 ? azurerm_resource_group.test[0].name : var.resource_group
}
