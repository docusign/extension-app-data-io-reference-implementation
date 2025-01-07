resource "azurerm_resource_group" "rg" {
  location = var.rg_region
  name     = var.rg_name

  tags = {
    application = var.ext_app_name
  }

}
