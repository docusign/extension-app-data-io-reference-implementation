variable "subscription_id" {
  description = "The Azure subscription ID"
  type        = string
  nullable    = true
  default     = null
}

variable "tenant_id" {
  description = "The Azure tenant ID"
  type        = string
  nullable    = true
  default     = null
}

variable "location" {
  description = "The location/region where the resources will be created"
  type        = string
  nullable    = false
  default     = "West Europe"
}

variable "docker_host" {
  description = "The Docker host (e.g. 'tcp://127.0.0.1:2376' or 'unix:///var/run/docker.sock') to connect to. If empty, the default Docker host will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "container_tool" {
  description = "The container tool to use for building and pushing images"
  type        = string
  nullable    = false
  default     = "docker"

  validation {
    condition     = contains(["docker", "podman"], var.container_tool)
    error_message = "The container tool must be one of 'docker' or 'podman'"
  }
}

variable "application_name" {
  description = "The name of the application"
  type        = string
  nullable    = false
  default     = "extension-app-data-io"

  validation {
    condition     = can(regex("^[a-zA-Z0-9-]+$", var.application_name)) && length(var.application_name) <= 32
    error_message = "The application name must contain only alphanumeric characters and hyphens and be at most 32 characters long"
  }
}

variable "application_port" {
  description = "The port the application listens on"
  type        = number
  nullable    = false
  default     = 3000
}

variable "application_build_base_image_name" {
  description = "The name of the base image to use for the application build"
  type        = string
  nullable    = false
  default     = "node:lts-alpine"
}

variable "application_build_image_tag" {
  description = "The tag to apply to the application build image. If empty the timestamp tag will be used."
  type        = string
  nullable    = false
  default     = ""
}

variable "application_build_context" {
  description = "The relative path to the build context for the application. The build context is the directory from which the Dockerfile is read. If it is empty the current working directory will be used."
  type        = string
  nullable    = false
  default     = "../.."
}

variable "application_build_paths" {
  description = "Paths of files relative to the build context, changes to which lead to a rebuild of the image. Supported pattern matches are the same as for the `fileset` Terraform function (https://developer.hashicorp.com/terraform/language/functions/fileset)."
  type        = list(string)
  default = [
    "public/**",
    "src/**",
    "views/**",
    "package.json",
    "tsconfig.json",
    "Dockerfile",
    ".dockerignore"
  ]
}

variable "application_environment_mode" {
  description = "The environment mode for the application"
  type        = string
  nullable    = true
  default     = "production"

  validation {
    condition     = contains(["development", "production"], var.application_environment_mode)
    error_message = "The environment mode must be one of 'development' or 'production'"
  }
}

variable "application_build_labels" {
  description = "The labels to apply to the application build image"
  type        = map(string)
  default = {
    "org.opencontainers.image.title"       = "Data IO Extension App Reference Implementation"
    "org.opencontainers.image.description" = "This reference implementation models the implementation of data input and output functionalities in an extension app."
    "org.opencontainers.image.source"      = "https://github.com/docusign/extension-app-data-io-reference-implementation-private"
    "org.opencontainers.image.licenses"    = "MIT"
    "org.opencontainers.image.authors"     = "DocuSign Inc."
    "org.opencontainers.image.vendor"      = "DocuSign Inc."
  }
}

variable "do_randomize_resource_names" {
  description = "Whether to randomize the resource names that should be globally unique"
  type        = bool
  nullable    = false
  default     = true
}

variable "resource_group_name" {
  description = "The name of the resource group. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "container_registry_name" {
  description = "The name of the container registry. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null

  validation {
    condition     = can(regex("^[a-zA-Z0-9]+$", coalesce(var.container_registry_name, "cr")))
    error_message = "The container registry name must contain only alphanumeric characters"
  }
}

variable "container_registry_sku" {
  description = "The SKU of the container registry"
  type        = string
  nullable    = false
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.container_registry_sku)
    error_message = "The container registry SKU must be one of 'Basic', 'Standard', or 'Premium'"
  }
}

variable "do_enable_admin_access" {
  description = "Whether to enable admin access to the container registry"
  type        = bool
  default     = true
}

variable "application_service_plan_name" {
  description = "The name of the application service plan. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "application_service_plan_sku_name" {
  description = "The SKU name of the application service plan"
  type        = string
  nullable    = false
  default     = "F1"

  validation {
    condition = contains([
      "F1",
      "B1",
      "B2",
      "B3",
      "S1",
      "S2",
      "S3",
      "P1v2",
      "P2v2",
      "P3v2",
      "P0v3",
      "P1v3",
      "P2v3",
      "P3v3",
      "P1mv3",
      "P2mv3",
      "P3mv3",
      "P4mv3",
      "P5mv3",
    ], var.application_service_plan_sku_name)
    error_message = "The application service plan SKU name must be one of 'F1', 'B1', 'B2', 'B3', 'S1', 'S2', 'S3', 'P1v2', 'P2v2', 'P3v2', 'P0v3', 'P1v3', 'P2v3', 'P3v3', 'P1mv3', 'P2mv3', 'P3mv3', 'P4mv3', or 'P5mv3'"
  }
}

variable "application_service_plan_worker_count" {
  description = "The number of workers to allocate for the application service plan"
  type        = number
  nullable    = false
  default     = 1
}

variable "application_webapp_name" {
  description = "The name of the application web app. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "is_application_webapp_always_on" {
  description = "Whether the application web app should always be on"
  type        = bool
  nullable    = false
  default     = false
}

variable "application_jwt_secret_key" {
  description = "The secret key to use for signing JWT tokens. If empty, a random key will be generated."
  type        = string
  sensitive   = true
  nullable    = false
  default     = ""
}

variable "application_oauth_client_id" {
  description = "The OAuth client ID for the application. If empty, a random client ID will be generated."
  type        = string
  sensitive   = true
  nullable    = false
  default     = ""
}

variable "application_oauth_client_secret" {
  description = "The OAuth client secret for the application. If empty, a random client secret will be generated."
  type        = string
  sensitive   = true
  nullable    = false
  default     = ""
}

variable "application_authorization_code" {
  description = "The authorization code for the application. If empty, a random code will be generated."
  type        = string
  sensitive   = true
  nullable    = false
  default     = ""
}

variable "manifest_files_paths" {
  description = "The list of manifest files relative paths to generate"
  type        = list(string)
  default = [
    "../../manifests/auth-code/ReadOnlyManifest.json",
    "../../manifests/auth-code/ReadWriteManifest.json",
    "../../manifests/client-credentials/ReadOnlyManifest.json",
    "../../manifests/client-credentials/ReadWriteManifest.json",
  ]
}

variable "output_manifest_files_directory" {
  description = "The directory to output the generated manifest files"
  type        = string
  nullable    = false
  default     = ".terraform"
}

variable "tags" {
  type        = map(string)
  description = "A map of the tags to apply to various resources"
  default     = {}
}
