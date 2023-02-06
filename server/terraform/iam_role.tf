resource "aws_iam_role" "collab_db_role" {
  name               = "collab_db_role"
  assume_role_policy = data.aws_iam_policy_document.collab_db_assume_role_policy.json # (not shown)


  inline_policy {
    name   = "collab-db-policy"
    policy = data.aws_iam_policy_document.collab_db_inline_policy.json
  }

  tags = {
    Name        = "${var.app_name}-db-role"
    Description = "IAM Role for ${var.app_name} DB access"
  }
}

data "aws_iam_policy_document" "collab_db_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "collab_db_inline_policy" {
  statement {
    actions = [
      "dynamodb:CreateTable",
      "dynamodb:DescribeTable",
      "dynamodb:ListTables",
      "dynamodb:Get*",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
    ]
    effect    = "Allow"
    resources = ["arn:aws:dynamodb:ap-southeast-2:765411096544:table/*"]
  }
}
