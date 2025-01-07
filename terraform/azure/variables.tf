variable "subscription_id" {
  type        = string
  default     = "befc01f6-e6cb-492e-9210-04c1ce2011f1"
  description = "Azure subscription ID"
}

variable "rg_region" {
  type        = string
  default     = "West Europe"
  description = "Resource group region"
}

variable "ext_app_name" {
  type        = string
  default     = "ext-app-data-io"
  description = "Extension app name"
}

variable "asp_os_type" {
  type        = string
  default     = "Linux"
  description = "App service plan type"
}

variable "asp_sku_name" {
  type        = string
  default     = "F1"
  description = "App service plan SKU name"
}

variable "acr_sku" {
  type        = string
  default     = "Basic"
  description = "Container registry SKU type"
}

variable "node_env" {
  type        = string
  default     = "production"
  description = "Node environment"
}

variable "node_port" {
  type        = number
  default     = 3000
  description = "Node port"
}
