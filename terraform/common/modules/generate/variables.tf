variable "random_bytes_length" {
  description = "The length of the random bytes"
  type        = number
  nullable    = false
  default     = 64
}

variable "random_bytes_type" {
  description = "The type of the random bytes"
  type        = string
  nullable    = false
  default     = "hex"

  validation {
    condition = contains(
      [
        "hex",
        "base64",
    ], var.random_bytes_type)
    error_message = "The type of the random bytes must be one of 'hex' or 'base64'"
  }
}

variable "do_rotate" {
  description = "Whether to rotate the random bytes"
  type        = bool
  nullable    = false
  default     = true
}

variable "rotation_days" {
  description = "The number of days after which the random bytes should be rotated"
  type        = number
  nullable    = false
  default     = 30
}
