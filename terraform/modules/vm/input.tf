
variable "resource_group_name" {
  description = "The name of the resource group."
  type        = string
  default     = "example-resource-group"
}

variable "location" {
  description = "The Azure region where resources will be created."
  type        = string
  default     = "East US"  # Change to your preferred location
}

variable "vnet_name" {
  description = "The name of the virtual network."
  type        = string
  default     = "example-vnet"
}

variable "subnet_name" {
  description = "The name of the subnet."
  type        = string
  default     = "example-subnet"
}

variable "public_ip_name" {
  description = "The name of the public IP."
  type        = string
  default     = "example-public-ip"
}

variable "network_interface_name" {
  description = "The name of the network interface."
  type        = string
  default     = "example-nic"
}

variable "vm_name" {
  description = "The name of the virtual machine."
  type        = string
  default     = "example-vm"
}

variable "admin_username" {
  description = "The admin username for the virtual machine."
  type        = string
  default     = "adminuser"
}

variable "ssh_public_key_path" {
  description = "The path to the SSH public key."
  type        = string
  default     = "/c/Users/a923717/.ssh/id_rsa.pub"  # Ensure this path is correct
}

variable "vm_size" {
  description = "The size of the virtual machine."
  type        = string
  default     = "Standard_DS2_v2"
}

variable "os_disk_size_gb" {
  description = "The size of the OS disk in GB."
  type        = number
  default     = 30  # Specify the disk size
}