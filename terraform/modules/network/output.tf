output "subnet_id_test" {
  description = "The ID of the subnet created."
  value       = azurerm_subnet.test.id  # Use the resource reference directly
}

output "subnet_name_test" {
  description = "The name of the subnet created."
  value       = azurerm_subnet.test.name  # Optional: Output the name of the subnet
}