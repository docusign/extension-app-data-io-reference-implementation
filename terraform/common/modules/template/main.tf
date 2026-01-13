locals {
  enabled = alltrue([
    fileexists(var.input_file_path),
    var.client_id != "",
    var.client_secret != "",
    var.base_url != "",
    var.output_file_path != "",
  ])

  input_file_content = local.enabled ? file(var.input_file_path) : ""

  template_variables = {
    CLIENT_ID      = var.client_id
    CLIENT_SECRET  = var.client_secret
    PROXY_BASE_URL = var.base_url
  }

  output_file_content = join("\n", [
    for line in split("\n", local.input_file_content) :
    format(
      replace(line, "/<(${join("|", keys(local.template_variables))})>/", "%s"),
      [
        for value in flatten(regexall("<(${join("|", keys(local.template_variables))})>", line)) :
        local.template_variables[value]
      ]...
    )
  ])
}

resource "local_sensitive_file" "this" {
  count    = var.execution_mode == "local" ? 1 : 0
  content  = local.output_file_content
  filename = local.enabled ? var.output_file_path : "/dev/null"
}

output "manifest_file_path" {
  description = "The intended output file path"
  value       = var.output_file_path
}