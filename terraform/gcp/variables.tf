variable "project" {
  description = "The default project project to manage resources in. If another project is specified on a resource, it will take precedence. This can also be specified using the `GOOGLE_PROJECT` environment variable"
  type        = string
  nullable    = true
  default     = null
}

variable "region" {
  description = " The default region to manage resources in. If another region is specified on a regional resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_REGION` environment variable"
  type        = string
  nullable    = true
  default     = null
}

variable "zone" {
  description = "The default zone to manage resources in. Generally, this zone should be within the default region you specified. If another zone is specified on a zonal resource, it will take precedence. Alternatively, this can be specified using the `GOOGLE_ZONE` environment variable"
  type        = string
  nullable    = true
  default     = null
}

variable "credentials" {
  description = "The credentials to use to authenticate against Google Cloud Platform. This can be a path to a file which contains service account key file in JSON format, or the credentials themselves. You can alternatively use the `GOOGLE_CREDENTIALS` environment variable"
  type        = any
  default     = null
}

variable "docker_host" {
  description = "The Docker host (e.g. 'tcp://127.0.0.1:2376' or 'unix:///var/run/docker.sock') to connect to. If empty, the default Docker host will be used"
  type        = string
  nullable    = true
  default     = null
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
    "src/**",
    "views/**",
    "package.json",
    "Dockerfile",
    ".dockerignore"
  ]
}

variable "application_build_target_stage" {
  description = "The target build stage for the application"
  type        = string
  nullable    = true
  default     = "production"
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

variable "application_service_account_name" {
  description = "The name of the application service account. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "application_service_account_key_rotation_days" {
  description = "The number of days after which the application service account key should be rotated"
  type        = number
  nullable    = false
  default     = 30
}

variable "application_cloud_run_service_name" {
  description = "The name of the Cloud Run service. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "application_jwt_secret_key" {
  description = "The secret key to use for signing JWT tokens. If empty, a random key will be generated."
  type        = string
  nullable    = false
  default     = ""
}

variable "application_oauth_client_id" {
  description = "The OAuth client ID for the application. If empty, a random client ID will be generated."
  type        = string
  nullable    = false
  default     = ""
}

variable "application_oauth_client_secret" {
  description = "The OAuth client secret for the application. If empty, a random client secret will be generated."
  type        = string
  nullable    = false
  default     = ""
}

variable "application_authorization_code" {
  description = "The authorization code for the application. If empty, a random code will be generated."
  type        = string
  nullable    = false
  default     = ""
}

variable "manifest_files_paths" {
  description = "The list of manifest files relative paths to generate"
  type        = list(string)
  default = [
    "../../ReadOnlyManifest.json",
    "../../ReadWriteManifest.json",
  ]
}

variable "output_manifest_files_directory" {
  description = "The directory to output the generated manifest files"
  type        = string
  nullable    = false
  default     = ".terraform"
}

variable "application_repository_name" {
  description = "The name of the Google Artifact Registry repository. If it is not defined, the prefixed application name will be used"
  type        = string
  nullable    = true
  default     = null
}

variable "are_image_tags_mutable" {
  description = "The image tag mutability setting for the Google Artifact Registry repository"
  type        = bool
  nullable    = true
  default     = false
}

variable "do_scan_images" {
  description = "Whether images are scanned after being pushed to the Google Artifact Registry repository"
  type        = bool
  default     = true
}

variable "labels" {
  description = "A set of key/value label pairs to assign to the resources"
  type        = map(string)
  default     = {}
}
