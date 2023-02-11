resource "aws_vpc" "collab_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "${var.app_name} VPC"
  }
}

resource "aws_subnet" "collab_subnet" {
  count = 2

  cidr_block = cidrsubnet(aws_vpc.collab_vpc.cidr_block, 8, count.index)
  vpc_id     = aws_vpc.collab_vpc.id
}
