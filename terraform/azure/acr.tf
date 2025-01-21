locals {
  container_registry_name = coalesce(
    var.container_registry_name,
    replace(lower(join(local.resource_name_separator, compact(["cr", var.application_name]))), "-", "")
  )

  created_container_registry_id                  = azurerm_container_registry.this.id
  created_container_registry_name                = azurerm_container_registry.this.name
  created_container_registry_resource_group_name = azurerm_container_registry.this.resource_group_name
  created_container_registry_login_server        = azurerm_container_registry.this.login_server

  container_registry_protocol = "https"
  created_container_registry_url = join("://", compact([
    local.container_registry_protocol,
    local.created_container_registry_login_server
  ]))
}

resource "azurerm_container_registry" "this" {
  name = local.container_registry_name

  resource_group_name = local.created_resource_group_name
  location            = local.created_resource_group_location

  sku           = var.container_registry_sku
  admin_enabled = var.do_enable_admin_access

  tags = local.tags
}
