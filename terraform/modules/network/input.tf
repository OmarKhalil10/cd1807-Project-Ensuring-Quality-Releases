# Resource Group/Location
variable "resource_group" {
  description = "The name of the resource group where resources will be created."
  type        = string
}

variable "location" {
  description = "The Azure region where resources will be created."
  type        = string
}

# Network
variable "virtual_network_name" {
  description = "The name of the virtual network."
  type        = string
}

variable "address_space" {
  description = "The address space for the virtual network (e.g., ['10.0.0.0/16'])."
  type        = list(string)  # Ensure this is a list
}

variable "application_type" {
  description = "The type of application (e.g., 'Web', 'API')."
  type        = string
}

variable "resource_type" {
  description = "The type of resource (e.g., 'VNet')."
  type        = string
}

variable "address_prefix_test" {
  description = "The address prefix for the subnet (e.g., '10.0.1.0/24')."
  type        = string
}