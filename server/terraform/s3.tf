locals {
  image_s3_bucket = "${lower(var.app_name)}-${var.image_s3_name}"
}

resource "aws_s3_bucket" "image_s3" {
  bucket = local.image_s3_bucket

  tags = {
    Name        = "${var.app_name} S3 bucket"
    Description = "${var.app_name} S3 bucket for storing user uploaded images"
    Environment = "Dev"
  }
}

resource "aws_s3_bucket_acl" "image_s3_acl" {
  bucket = aws_s3_bucket.image_s3.id
  acl    = "public-read"
}

resource "aws_s3_bucket_policy" "allow_access_from_public" {
  bucket = aws_s3_bucket.image_s3.id
  policy = data.aws_iam_policy_document.allow_access_from_public_document.json
}

data "aws_iam_policy_document" "allow_access_from_public_document" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      aws_s3_bucket.image_s3.arn,
      "${aws_s3_bucket.image_s3.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_cors_configuration" "image_s3_cors" {
  bucket = aws_s3_bucket.image_s3.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = []
    max_age_seconds = 3000
  }
}
