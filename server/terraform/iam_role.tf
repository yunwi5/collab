resource "aws_iam_role" "dax_role" {
  name = "dax_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "dax.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "dax_policy" {
  name   = "dax_policy"
  policy = data.aws_iam_policy_document.dax_policy.json
}

data "aws_iam_policy_document" "dax_policy" {
  statement {
    actions = [
      "dax:*",
      "ec2:DescribeSubnets",
      "ec2:DescribeVpcs",
      "ec2:DescribeSecurityGroups",
      "ec2:CreateSecurityGroup",
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:CreateTags",
      "iam:PassRole"
    ]
    effect    = "Allow"
    resources = ["*"]
  }
}

resource "aws_iam_role_policy_attachment" "dax_role_policy_attachment" {
  policy_arn = aws_iam_policy.dax_policy.arn
  role       = aws_iam_role.dax_role.name
}
