resource "aws_dynamodb_table" "user_table" {
  name           = "${var.app_name}-${var.user_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  global_secondary_index {
    name               = var.user_table_name_index
    hash_key           = "username"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "INCLUDE"
    non_key_attributes = ["email", "picture", "password", "createdAt"]
  }

  tags = {
    Name        = var.user_table_name
    Environment = var.environment
  }
}