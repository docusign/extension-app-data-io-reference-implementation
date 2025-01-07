variable "ext_app_name" {
  type        = string
  description = "Extension app name"
}

variable "acr_location" {
  type        = string
  description = "Azure container registry location"
}

variable "acr_name" {
  type        = string
  description = "Azure container registry name"
}

variable "acr_rg_name" {
  type        = string
  description = "Azure container registry resource group name"
}

variable "acr_sku" {
  type        = string
  description = "Azure container registry SKU"
}
