variable "asp_name" {
  type        = string
  description = "App service plan name"
}

variable "asp_os_type" {
  type        = string
  description = "App service plan os type"
}

variable "asp_sku_name" {
  type        = string
  description = "App service plan SKU name"
}

variable "ext_app_name" {
  type        = string
  description = "Extension app name"
}

variable "location" {
  type        = string
  description = "App service plan location"
}

variable "rg_name" {
  type        = string
  description = "Resource group name"
}

variable "worker_count" {
  type        = number
  description = "App service plan worker count"
}
