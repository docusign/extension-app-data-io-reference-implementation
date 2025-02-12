variable "enabled" {
  description = "Whether the module should be enabled. If it is false, the module will not do anything."
  type        = bool
  default     = true
}

variable "do_pull_base_image" {
  description = "Whether to pull the base image."
  type        = bool
  default     = true
}

variable "do_build_app_image" {
  description = "Whether to build the application image."
  type        = bool
  default     = true
}

variable "do_push_app_image" {
  description = "Whether to push the application image."
  type        = bool
  default     = true
}

variable "do_force_remove_images" {
  description = "Whether to force remove images when the Terrafrom resources are destroyed."
  type        = bool
  default     = false
}

variable "do_keep_images_locally" {
  description = "Whether to keep images locally after destroy operation."
  type        = bool
  default     = true
}

variable "do_keep_images_remotely" {
  description = "Whether to keep images remotely after destroy operation."
  type        = bool
  default     = true
}

variable "base_image_name" {
  description = "The name of the base image to use. If it is empty, the base image will not be pulled."
  type        = string
  nullable    = false
  default     = ""
}

variable "app_image_name" {
  description = "The name of the application image to build. If it is empty, the application image will not be built."
  type        = string
  nullable    = false
  default     = ""
}

variable "app_image_build_context" {
  description = "The absolute path to the build context. If it is empty, the application image will not be built."
  type        = string
  nullable    = false
  default     = ""
}

variable "app_image_build_dockerfile" {
  description = "The path to the Dockerfile to use for building the image."
  type        = string
  nullable    = true
  default     = null
}

variable "app_image_build_platform" {
  description = "The platform to build the image for."
  type        = string
  nullable    = false
  default     = "linux/amd64"

  validation {
    condition     = can(regex("^[a-z0-9]+/[a-z0-9]+$", var.app_image_build_platform))
    error_message = "The platform must be in the format 'os/arch'."
  }
}

variable "app_image_build_target_stage" {
  description = "The target build stage."
  type        = string
  nullable    = true
  default     = null
}

variable "app_image_build_args" {
  description = "The build arguments to pass to the build process."
  type        = map(string)
  default     = {}
}

variable "app_image_build_labels" {
  description = "The labels to apply to the image."
  type        = map(string)
  default     = {}
}

variable "app_image_build_tags" {
  description = "The tags to apply to the image."
  type        = list(string)
  default     = []
}

variable "do_use_timestamp_tag" {
  description = "Whether to add a timestamp tag to the image."
  type        = bool
  default     = true
}

variable "app_image_build_paths" {
  description = "Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset)."
  type        = list(string)
  default     = []
}

variable "do_use_build_cache" {
  description = "Whether to use the build cache."
  type        = bool
  default     = true
}
