resource "aws_dynamodb_table" "program_collaborator_table" {
  name         = "${var.app_name}-${var.program_collaborator_table_name}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "programId"
  range_key    = "userId"

  attribute {
    name = "programId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = var.program_collaborator_table_index
    hash_key        = "userId"
    range_key       = "programId"
    projection_type = "ALL"
  }

  tags = {
    Name        = var.program_collaborator_table_name
    Environment = var.environment
  }
}
