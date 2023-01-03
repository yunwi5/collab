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
    name = "userName"
    type = "S"
  }

  global_secondary_index {
    name               = var.user_table_index_name
    hash_key           = "userName"
    # range_key          = "TopScore"
    write_capacity     = 2
    read_capacity      = 2
    projection_type    = "INCLUDE"
    non_key_attributes = ["email", "picture", "password"]
  }

  tags = {
    Name        = var.user_table_name
    Environment = var.environment
  }
}