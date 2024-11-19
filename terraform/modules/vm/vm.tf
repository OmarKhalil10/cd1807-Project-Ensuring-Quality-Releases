resource "azurerm_network_interface" "test" {
  name                = "NIC-${var.resource_type}-${var.application_type}"
  location            = var.location
  resource_group_name = var.resource_group

  ip_configuration {
    name                          = "internal"
    subnet_id                     = var.public_subnet_id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.public_ip_address_id
  }
}

resource "azurerm_linux_virtual_machine" "test" {
  name                  = "test-vm"
  location              = var.location
  resource_group_name   = var.resource_group
  size                  = "Standard_DS2_v2"
  admin_username        = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.test.id
  ]
  
  admin_ssh_key {
    username   = "azureuser"
    public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCs5/rSO8eBEPKz7YI8VCxsJuXy94gUD/NCDeagK2uOgC1MvCSEGiz82xe+u1FQxGhtWTeR0HaUYo++A5sJ/PoeJarh3QQX6A8JVFbninhvzCWU9jgFt91c+tLJF/pvkL+v+rDXGZB/ZU2uIai5+W+7xCLS2rq4r4MByB93EqpJRSQyB1p6BtIaLnXF3zVV5kBAKaGXh6x7oIiuEUwla0THiL6i270RrDrAFw37Uyz9RFXGS7VhdiThpXt9n7C5ZvanrXmPWjPy0MzN/FdMRftQFFWmzWDaZEf+ofqramTSQk5/p38hJ6r9LepBpSrJtZjkyjORjYotrcqkdPlN+c+L3Aiwl/awrlacyOI2r3tQz23n71yUbe5/3yda+gMu+xZQhOsNulWdd+AmOaCHHyID+oCLKD5FYBM5y67j0n0s6zwCm9lunmbyYrIWGJbc9H1K6QNtGqNOm9cz4DeA5+kQ6FWjlCwbnMXFeaS9AVZFWrSwJoQti2imy8HIvXjBpPM= WW930+a923717@DESKTOP-6PQM6SL"
  }
  
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  
  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}