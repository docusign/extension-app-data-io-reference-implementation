output "random_bytes" {
  description = "The generated random bytes"
  value       = local.random_bytes[var.random_bytes_type]
}
