# Shared reusable module for generating secret values

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.0.0, < 2.0.0 |
| <a name="requirement_random"></a> [random](#requirement\_random) | ~> 3.6 |
| <a name="requirement_time"></a> [time](#requirement\_time) | ~> 0.12 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_random"></a> [random](#provider\_random) | ~> 3.6 |
| <a name="provider_time"></a> [time](#provider\_time) | ~> 0.12 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [random_bytes.this](https://registry.terraform.io/providers/hashicorp/random/latest/docs/resources/bytes) | resource |
| [time_rotating.this](https://registry.terraform.io/providers/hashicorp/time/latest/docs/resources/rotating) | resource |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_do_rotate"></a> [do\_rotate](#input\_do\_rotate) | Whether to rotate the random bytes | `bool` | `true` | no |
| <a name="input_random_bytes_length"></a> [random\_bytes\_length](#input\_random\_bytes\_length) | The length of the random bytes | `number` | `64` | no |
| <a name="input_random_bytes_type"></a> [random\_bytes\_type](#input\_random\_bytes\_type) | The type of the random bytes | `string` | `"hex"` | no |
| <a name="input_rotation_days"></a> [rotation\_days](#input\_rotation\_days) | The number of days after which the random bytes should be rotated | `number` | `30` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_random_bytes"></a> [random\_bytes](#output\_random\_bytes) | The generated random bytes |
<!-- END_TF_DOCS -->
