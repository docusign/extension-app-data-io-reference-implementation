resource "azurerm_service_plan" "asp" {
  location            = var.location
  name                = var.asp_name
  os_type             = var.asp_os_type
  resource_group_name = var.rg_name
  sku_name            = var.asp_sku_name
  worker_count        = var.worker_count

  tags = {
    application = var.ext_app_name
  }

}
