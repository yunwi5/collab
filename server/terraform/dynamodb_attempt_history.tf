# Quiz attempt history
resource "aws_dynamodb_table" "attempt_history_table" {
  name           = "${var.app_name}-${var.attempt_history_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 5
  write_capacity = 5
  hash_key       = "quizId"
  range_key      = "userId"

  attribute {
    name = "quizId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = var.attempt_history_table_user_index
    hash_key        = "userId"
    range_key       = "timestamp"
    write_capacity  = 2
    read_capacity   = 2
    projection_type = "ALL"
  }

  tags = {
    Name        = var.attempt_history_table_name
    Environment = var.environment
    Description = "Table for storing users attempt results for each quiz"
  }
}
