<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_local"></a> [local](#requirement\_local) | ~> 2.5 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_local"></a> [local](#provider\_local) | ~> 2.5 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [local_sensitive_file.this](https://registry.terraform.io/providers/hashicorp/local/latest/docs/resources/sensitive_file) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_base_url"></a> [base\_url](#input\_base\_url) | The base URL. If it is not provided, the module will not do anything | `string` | `""` | no |
| <a name="input_client_id"></a> [client\_id](#input\_client\_id) | The OAuth client ID. If it is not provided, the module will not do anything | `string` | `""` | no |
| <a name="input_client_secret"></a> [client\_secret](#input\_client\_secret) | The OAuth client secret. If it is not provided, the module will not do anything | `string` | `""` | no |
| <a name="input_input_file_path"></a> [input\_file\_path](#input\_input\_file\_path) | The absolute path to the input file. If it doesn't exist, the module will not do anything | `string` | `""` | no |
| <a name="input_output_file_path"></a> [output\_file\_path](#input\_output\_file\_path) | The absolute path to the output file. If it is not provided, the module will not do anything | `string` | `""` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_output_file_path"></a> [output\_file\_path](#output\_output\_file\_path) | The absolute path to the output file |
<!-- END_TF_DOCS -->
