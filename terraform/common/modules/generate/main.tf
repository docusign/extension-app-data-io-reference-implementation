locals {
  random_bytes = {
    "hex"    = one(random_bytes.this[*].hex)
    "base64" = one(random_bytes.this[*].base64)
  }
}

resource "time_rotating" "this" {
  count = var.do_rotate ? 1 : 0

  rotation_days = var.rotation_days
}

resource "random_bytes" "this" {
  length = var.random_bytes_length

  keepers = {
    rotation = one(time_rotating.this[*].id)
  }
}
