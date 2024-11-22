#!/bin/bash

# Define variables
RESOURCE_GROUP="Azuredevops"
VM_NAME="VM-myApplication"

echo "Starting deletion of VM: $VM_NAME in Resource Group: $RESOURCE_GROUP"

# Delete the VM
echo "Deleting the Virtual Machine..."
az vm delete --resource-group "$RESOURCE_GROUP" --name "$VM_NAME" --yes
if [ $? -eq 0 ]; then
    echo "Virtual Machine deleted successfully."
else
    echo "Failed to delete the Virtual Machine."
    exit 1
fi

# Delete associated disks
echo "Fetching associated disks..."
DISKS=$(az disk list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, '$VM_NAME')].id" -o tsv)
if [ -n "$DISKS" ]; then
    echo "Deleting disks..."
    az disk delete --ids $DISKS --yes
    echo "Disks deleted successfully."
else
    echo "No disks found for VM: $VM_NAME."
fi

# Delete associated network interfaces
echo "Fetching associated network interfaces..."
NICS=$(az network nic list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, '$VM_NAME')].id" -o tsv)
if [ -n "$NICS" ]; then
    echo "Deleting network interfaces..."
    az network nic delete --ids $NICS
    echo "Network interfaces deleted successfully."
else
    echo "No network interfaces found for VM: $VM_NAME."
fi

# Delete associated public IP addresses
echo "Fetching associated public IP addresses..."
PUBLIC_IPS=$(az network public-ip list --resource-group "$RESOURCE_GROUP" --query "[?contains(name, '$VM_NAME')].id" -o tsv)
if [ -n "$PUBLIC_IPS" ]; then
    echo "Deleting public IP addresses..."
    az network public-ip delete --ids $PUBLIC_IPS
    echo "Public IP addresses deleted successfully."
else
    echo "No public IP addresses found for VM: $VM_NAME."
fi

echo "Deletion process completed for VM: $VM_NAME and its resources."
