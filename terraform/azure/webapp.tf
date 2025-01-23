locals {
  application_service_plan_name = coalesce(
    var.application_service_plan_name,
    lower(join(local.resource_name_separator, compact(["asp", var.application_name])))
  )

  application_service_plan_os_type = "Linux"

  created_application_service_plan_id = azurerm_service_plan.this.id

  application_webapp_name = coalesce(
    var.application_webapp_name,
    lower(join(local.resource_name_separator, compact(["app", var.application_name, one(random_id.web_app[*].hex)])))
  )

  application_webapp_system_settings = {
    DOCKER_ENABLE_CI                    = true
    WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
    WEBSITES_PORT                       = var.application_port
  }

  application_webapp_container_settings = {
    JWT_SECRET_KEY      = local.application_jwt_secret_key
    OAUTH_CLIENT_ID     = local.application_oauth_client_id
    OAUTH_CLIENT_SECRET = local.application_oauth_client_secret
    AUTHORIZATION_CODE  = local.application_authorization_code
  }

  application_webapp_settings = merge(
    local.application_webapp_system_settings,
    local.application_webapp_container_settings
  )

  created_application_webapp_principal_id = one(azurerm_linux_web_app.this.identity[*].principal_id)

  application_service_protocol = "https"
  application_service_url      = join("://", [local.application_service_protocol, azurerm_linux_web_app.this.default_hostname])
}

resource "azurerm_service_plan" "this" {
  name = local.application_service_plan_name

  resource_group_name = local.created_resource_group_name
  location            = local.created_resource_group_location

  os_type  = local.application_service_plan_os_type
  sku_name = var.application_service_plan_sku_name

  worker_count = var.application_service_plan_worker_count

  tags = local.tags
}

resource "random_id" "web_app" {
  count = var.do_randomize_resource_names ? 1 : 0

  byte_length = 2

  keepers = {
    resource_group_id = local.created_resource_group_id
  }
}

resource "azurerm_linux_web_app" "this" {
  name = local.application_webapp_name

  resource_group_name = local.created_resource_group_name
  location            = local.created_resource_group_location

  service_plan_id = local.created_application_service_plan_id

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_stack {
      docker_image_name   = terraform_data.push_docker_image.output.application_image_name_without_registry
      docker_registry_url = local.created_container_registry_url
    }
    always_on                               = var.is_application_webapp_always_on
    container_registry_use_managed_identity = true
  }

  app_settings = local.application_webapp_settings

  tags = local.tags
}

resource "azurerm_role_assignment" "pull_image" {
  role_definition_name = "AcrPull"
  scope                = local.created_container_registry_id
  principal_id         = local.created_application_webapp_principal_id
}


