resource "aws_dynamodb_table" "program_table" {
  name         = "${var.app_name}-${var.program_table_name}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "creatorId"
  range_key    = "programId"

  attribute {
    name = "creatorId"
    type = "S"
  }

  attribute {
    name = "programId"
    type = "S"
  }

  tags = {
    Name        = var.program_table_name
    Environment = var.environment
  }
}
