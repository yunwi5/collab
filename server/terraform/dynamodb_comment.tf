resource "aws_dynamodb_table" "comment_table" {
  name         = "${var.app_name}-${var.comment_table_name}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "parentId"
  range_key    = "commentId"

  attribute {
    name = "parentId"
    type = "S"
  }

  attribute {
    name = "commentId"
    type = "S"
  }

  tags = {
    Name        = var.comment_table_name
    Environment = var.environment
  }
}
