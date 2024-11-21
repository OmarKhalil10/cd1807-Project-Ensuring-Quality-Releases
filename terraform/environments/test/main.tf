provider "azurerm" {
  tenant_id       = var.tenant_id
  subscription_id = var.subscription_id
  client_id       = var.client_id
  client_secret   = var.client_secret
  features {}
}

terraform {
  backend "azurerm" {
    storage_account_name = "tfstate449012912"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
    access_key           = "2N5eqLdLuCgCxh0W5eQU1S80FdcUK43MOTrmYAnpyby4txd50Ppw9r0zh+Gje1jMcHLqG/MOFcui+ASt9WbhJw=="
  }
}

# Use existing resource group
module "resource_group" {
  source         = "../../modules/resource_group"
  resource_group = var.resource_group
  location       = var.location
  create         = false  # Skip creation and just reference it
}

module "network" {
  source               = "../../modules/network"
  address_space        = var.address_space
  location             = var.location
  virtual_network_name = var.virtual_network_name
  application_type     = var.application_type
  resource_type        = "NET"
  resource_group       = module.resource_group.resource_group_name  # Use the output name
  address_prefix_test  = var.address_prefix_test
}

module "nsg-test" {
  source           = "../../modules/networksecuritygroup"
  location         = var.location
  application_type = var.application_type
  resource_type    = "NSG"
  resource_group   = module.resource_group.resource_group_name  # Use the output name
  subnet_id        = module.network.subnet_id_test
  address_prefix_test = var.address_prefix_test
}

module "appservice" {
  source           = "../../modules/appservice"
  location         = var.location
  application_type = var.application_type
  resource_type    = "AppService"
  resource_group   = module.resource_group.resource_group_name  # Use the output name
}

module "publicip" {
  source           = "../../modules/publicip"
  location         = var.location
  application_type = var.application_type
  resource_type    = "publicip"
  resource_group   = module.resource_group.resource_group_name  # Use the output name
}

module "virtual_machine" {
  source               = "../../modules/vm"
  location             = var.location
  resource_group       = module.resource_group.resource_group_name
  application_type     = var.application_type
  resource_type        = "VM"

  public_ip_address_id = module.publicip.public_ip_address_id
  public_subnet_id     = module.network.subnet_id_test
  admin_username       = "azureuser"
}