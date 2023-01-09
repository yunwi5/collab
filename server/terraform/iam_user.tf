resource "aws_iam_user" "collab_user" {
  name = var.iam_user_name
  path = "/system/"

  tags = {
    Name        = "Collab"
    Description = "Collab web application user"
  }
}

resource "aws_iam_access_key" "collab_access_key" {
  user = aws_iam_user.collab_user.name
}

resource "aws_iam_user_policy_attachment" "collab_policy_attachment" {
  user       = aws_iam_user.collab_user.name
  policy_arn = aws_iam_policy.collab_policy.arn
}


resource "aws_iam_policy" "collab_policy" {
  name        = "collab_policy"
  path        = "/"
  description = "Collab application policy"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutObjectTagging",
        ]
        Effect   = "Allow"
        Resource = "arn:aws:s3:::collab-image-bucket/*"
      },
      {
        Action = [
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
        Effect   = "Allow"
        Resource = "arn:aws:dynamodb:ap-southeast-2:765411096544:table/*"
      }
    ]
  })
}
