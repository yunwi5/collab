resource "aws_dynamodb_table" "quiz_table" {
  name           = "${var.app_name}-${var.quiz_table_name}"
  billing_mode   = "PROVISIONED"
  read_capacity  = 10
  write_capacity = 10
  hash_key       = "creatorId"
  range_key      = "quizId"

  attribute {
    name = "creatorId"
    type = "S"
  }

  attribute {
    name = "quizId"
    type = "S"
  }

  tags = {
    Name        = var.quiz_table_name
    Environment = var.environment
  }
}
