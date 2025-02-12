variable "input_file_path" {
  description = "The absolute path to the input file. If it doesn't exist, the module will not do anything"
  type        = string
  nullable    = false
  default     = ""
}

variable "client_id" {
  description = "The OAuth client ID. If it is not provided, the module will not do anything"
  type        = string
  nullable    = false
  default     = ""
}

variable "client_secret" {
  description = "The OAuth client secret. If it is not provided, the module will not do anything"
  type        = string
  nullable    = false
  default     = ""
}

variable "base_url" {
  description = "The base URL. If it is not provided, the module will not do anything"
  type        = string
  nullable    = false
  default     = ""
}

variable "output_file_path" {
  description = "The absolute path to the output file. If it is not provided, the module will not do anything"
  type        = string
  nullable    = false
  default     = ""
}
