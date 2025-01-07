resource "azurerm_linux_web_app" "web_app" {
  name                = var.app_name
  resource_group_name = var.rg_name
  location            = var.location
  service_plan_id     = var.service_plan_id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      docker_image_name   = var.docker_image_name
      docker_registry_url = "https://${var.acr_login_server}"
    }
    always_on                               = false
    container_registry_use_managed_identity = true
  }

  app_settings = {
    DOCKER_ENABLE_CI                    = true
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
    AUTHORIZATION_CODE                  = var.authorization_code
    JWT_SECRET_KEY                      = var.jwt_secret_key
    OAUTH_CLIENT_ID                     = var.oauth_client_id
    OAUTH_CLIENT_SECRET                 = var.oauth_client_secret
    NODE_ENV                            = var.node_env
    NODE_PORT                           = var.node_port
  }

  tags = {
    application = var.ext_app_name
  }
}

resource "azurerm_role_assignment" "pull_image" {
  role_definition_name = "AcrPull"
  scope                = var.acr_id
  principal_id         = azurerm_linux_web_app.web_app.identity[0].principal_id
}
