variable "gcp_project_id" {
  type        = string
  default     = "dssa-ifs-97001"
  description = "GCP project ID"
}

variable "gcp_region" {
  type        = string
  default     = "us-central1"
  description = "GCP region"
}

variable "gcp_credentials_file" {
  description = "Path to the GCP credentials JSON file"
  type        = string
  default     = "dssa-ifs-97001-af312c2770cc.json"
}

variable "ext_app_name" {
  type        = string
  default     = "serhii-test-ext-app-data-io"
  description = "Extension app name"
}

variable "terraform_service_account" {
  type        = string
  default     = "terraform-serhii@dssa-ifs-97001.iam.gserviceaccount.com"
  description = "Terraform service account name"
}

variable "node_port" {
  type        = number
  default     = 80 # 3000
  description = "Node port"
}

variable "environment_variables" {
  type = map(string)
  default = {
    AUTHORIZATION_CODE  = ""
    JWT_SECRET_KEY      = ""
    OAUTH_CLIENT_ID     = ""
    OAUTH_CLIENT_SECRET = ""
    NODE_ENV            = "production"
    NODE_PORT           = "80"
  }
}
