resource "aws_dax_cluster" "collab_dax" {
  cluster_name       = lower("${var.app_name}-dax-cluster")
  node_type          = "dax.r4.large"
  replication_factor = 1 // no read replicas for now
  iam_role_arn       = aws_iam_role.dax_role.arn

  subnet_group_name  = aws_dax_subnet_group.collab_dax_subnet_group.name
  security_group_ids = ["${aws_security_group.collab_dax_security_group.id}"]

  description = "${var.app_name} dax cluster"

  server_side_encryption {
    enabled = true
  }
}

resource "aws_dax_subnet_group" "collab_dax_subnet_group" {
  name       = "collab-dax-subnet-group"
  subnet_ids = [aws_subnet.collab_subnet[0].id, aws_subnet.collab_subnet[1].id]
}

resource "aws_security_group" "collab_dax_security_group" {
  name = "collab-dax-security-group"
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
