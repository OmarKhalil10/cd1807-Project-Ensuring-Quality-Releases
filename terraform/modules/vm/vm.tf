resource "azurerm_network_interface" "example_nic" {
  name                = "example-nic"
  location            = "East US"  # Change to your preferred location
  resource_group_name = "example-resource-group"  # Change to your resource group name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.example_subnet.id  # Reference to your subnet
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.example_public_ip.id  # Reference to your public IP
  }
}

resource "azurerm_linux_virtual_machine" "example_vm" {
  name                = "example-vm"
  location            = "East US"  # Change to your preferred location
  resource_group_name = "example-resource-group"  # Change to your resource group name
  size                = "Standard_DS2_v2"
  admin_username      = "adminuser"
  
  network_interface_ids = [
    azurerm_network_interface.example_nic.id  # Reference to the network interface
  ]

  admin_ssh_key {
    username   = "adminuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCs5/rSO8eBEPKz7YI8VCxsJuXy94gUD/NCDeagK2uOgC1MvCSEGiz82xe+u1FQxGhtWTeR0HaUYo++A5sJ/PoeJarh3QQX6A8JVFbninhvzCWU9jgFt91c+tLJF/pvkL+v+rDXGZB/ZU2uIai5+W+7xCLS2rq4r4MByB93EqpJRSQyB1p6BtIaLnXF3zVV5kBAKaGXh6x7oIiuEUwla0THiL6i270RrDrAFw37Uyz9RFXGS7VhdiThpXt9n7C5ZvanrXmPWjPy0MzN/FdMRftQFFWmzWDaZEf+ofqramTSQk5/p38hJ6r9LepBpSrJtZjkyjORjYotrcqkdPlN+c+L3Aiwl/awrlacyOI2r3tQz23n71yUbe5/3yda+gMu+xZQhOsNulWdd+AmOaCHHyID+oCLKD5FYBM5y67j0n0s6zwCm9lunmbyYrIWGJbc9H1K6QNtGqNOm9cz4DeA5+kQ6FWjlCwbnMXFeaS9AVZFWrSwJoQti2imy8HIvXjBpPM= WW930+a923717@DESKTOP-6PQM6SL"
  }

  os_disk {
    caching                = "ReadWrite"
    storage_account_type   = "Standard_LRS"
    disk_size_gb          = 30  # Specify the disk size
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}