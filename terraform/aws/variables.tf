variable "region" {
  description = "The AWS region"
  type        = string
  nullable    = true
  default     = "us-east-1"
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
  default     = "ext-app-data-io-clientcreds"

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

variable "application_instance_cpu" {
  description = "The number of CPU units to allocate to the application instance"
  type        = string
  nullable    = false
  default     = "256"

  validation {
    condition = contains(
      [
        "256",
        "512",
        "1024",
        "2048",
        "4096",
        "0.25 vCPU",
        "0.5 vCPU",
        "1 vCPU",
        "2 vCPU",
        "4 vCPU",
    ], var.application_instance_cpu)
    error_message = "The number of CPU units must be one of '256', '512', '1024', '2048', '4096', '0.25 vCPU', '0.5 vCPU', '1 vCPU', '2 vCPU', or '4 vCPU'"
  }
}

variable "application_instance_memory" {
  description = "The amount of memory to allocate to the application instance"
  type        = string
  nullable    = false
  default     = "512"

  validation {
    condition = contains(
      [
        "512",
        "1024",
        "2048",
        "3072",
        "4096",
        "6144",
        "8192",
        "10240",
        "12288",
        "0.5 GB",
        "1 GB",
        "2 GB",
        "3 GB",
        "4 GB",
        "6 GB",
        "8 GB",
        "10 GB",
        "12 GB",
    ], var.application_instance_memory)
    error_message = "The amount of memory must be one of '512', '1024', '2048', '3072', '4096', '6144', '8192', '10240', '12288', '0.5 GB', '1 GB', '2 GB', '3 GB', '4 GB', '6 GB', '8 GB', '10 GB', or '12 GB'"
  }
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
    "../../manifests/aauthorizationCode/ReadOnlyManifest.json",
    "../../manifests/authorizationCode/ReadWriteManifest.json",
    "../../manifests/clientCredentials/ReadOnlyManifest.json",
    "../../manifests/clientCredentials/ReadWriteManifest.json",
  ]
}

variable "output_manifest_files_directory" {
  description = "The directory to output the generated manifest files"
  type        = string
  nullable    = false
  default     = ".terraform"
}

variable "do_force_delete_repository" {
  description = "Whether to delete the ECR repository even if it contains images"
  type        = bool
  default     = true
}

variable "repository_image_tag_mutability" {
  description = "The image tag mutability setting for the ECR repository"
  type        = string
  nullable    = false
  default     = "MUTABLE"

  validation {
    condition     = contains(["IMMUTABLE", "MUTABLE"], var.repository_image_tag_mutability)
    error_message = "The image tag mutability setting must be either 'IMMUTABLE' or 'MUTABLE'"
  }
}

variable "do_scan_images" {
  description = "Whether images are scanned after being pushed to the ECR repository"
  type        = bool
  default     = true
}

variable "tags" {
  type        = map(string)
  description = "A map of the tags to apply to various resources"
  default     = {}
}
