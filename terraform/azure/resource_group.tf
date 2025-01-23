locals {
  resource_group_name = coalesce(
    var.resource_group_name,
    lower(join(local.resource_name_separator, compact(["rg", var.application_name])))
  )

  created_resource_group_id       = azurerm_resource_group.this.id
  created_resource_group_name     = azurerm_resource_group.this.name
  created_resource_group_location = azurerm_resource_group.this.location
}

resource "azurerm_resource_group" "this" {
  name = local.resource_group_name

  location = var.location

  tags = local.tags
}
