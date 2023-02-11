resource "aws_dynamodb_table" "article_group_table" {
  name         = "${var.app_name}-${var.article_group_table_name}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "groupId"

  attribute {
    name = "creatorId"
    type = "S"
  }

  attribute {
    name = "groupId"
    type = "S"
  }

  global_secondary_index {
    name            = var.article_group_creator_index
    hash_key        = "creatorId"
    range_key       = "groupId"
    write_capacity  = 2
    read_capacity   = 2
    projection_type = "ALL"
  }

  tags = {
    Name        = var.article_group_table_name
    Environment = var.environment
  }
}
