---
title: "Deploying and Configuring MongoDB on EC2 with AWS CDK"
description: "Discover which cloud skills are becoming outdated and which ones you need to master to stay competitive in 2025 and beyond."
publishedAt: "2024-07-24"
author: "David J Nsoesie"
category: "Cloud Computing"
tags: ["AWS", "Cloud Skills", "Career Development", "Infrastructure as Code", "Automation"]
featured: false
slug: "cloud-skills-future-proof-career"
---
# Deploying and Configuring MongoDB on EC2 with AWS CDK  

---

## Introduction  
Recently, I had a friend give me a call asking for some help with MongoDB in EC2. The first question I asked of course was:  

> “Why on earth would you do that… just use Atlas.”  

And then I discovered that every now and then, some architects and engineers decide MongoDB needs to be run on EC2s.  

Here’s a guide for some of the work we did setting up MongoDB on AWS EC2s with **TypeScript CDK** as our chosen IaC tool.  

In this article, we’ll walk through how to use AWS CDK to deploy a MongoDB instance on EC2, configure it securely, and verify its operation.  

⚠️ **Note:** This article does not go in depth with best practices for data replication, multi-AZ deployments, and backups. These topics will be covered further in a series of posts when exploring **DocumentDB** and **MongoDB**.  

---

## Prerequisites  

- Basic understanding of AWS services (EC2, IAM, VPC).  
- Familiarity with MongoDB and its configuration.  
- Knowledge of TypeScript and the AWS CDK.  
- AWS CLI and CDK installed and configured.  

---

## Notes on Prompting  

Here are some prompts you can plug into ChatGPT to assist with code generation for this endeavor.  

⚠️ Please note: some responses given by GPT will be incorrect (particularly EC2 configurations and user scripts). The scripts provided in this article have been validated extensively and **will work** for your needs.  

**Prompt 1:**  
```text
Assume you are an expert level database admin and solutions architect. Write the code for an EC2 instance with MongoDB deployed on the instance with security group configurations behind a private subnet. This EC2 and MongoDB instance should only be accessible from resources like ECS clusters or Lambdas which will be provisioned in the future. Write the TypeScript CDK for this infrastructure along with any scripts.
````

---

## Step 1: Setting Up Your CDK Project

```bash
mkdir mongodb-cdk-project
cd mongodb-cdk-project
cdk init app --language typescript
```

---

## Step 2: Creating an EC2 Instance

In your CDK stack (e.g., `lib/mongodb-cdk-project-stack.ts`), create an EC2 instance that will host the MongoDB server.

**EC2 Instance Setup:**

```ts
import * as ec2 from '@aws-cdk/aws-ec2';

const instance = new ec2.Instance(this, 'MongoDBInstance', {
  vpc,
  instanceName: ec2Name,
  instanceType: new ec2.InstanceType("t3.micro"), // Adjust as needed
  machineImage: ec2.MachineImage.latestAmazonLinux2(),
  vpcSubnets: selectedSubnets,
  securityGroup: securityGroup,
  role: role,
  keyName: keyPair.keyName,
  blockDevices: [
    {
      deviceName: "/dev/xvda",
      volume: ec2.BlockDeviceVolume.ebs(100),
    },
  ],
});
```

---

## Configuring a Database User

One best practice when provisioning a database with CDK (or any IaC tool) is to generate credentials with **AWS Secrets Manager** and pass them to the EC2 startup script.

```ts
const mongoDbCredentials = new secretsmanager.Secret(this, "MongoDBCredentials", {
  secretName: "SECRET_NAME",
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: "GENERIC_USERNAME" }),
    generateStringKey: "password",
    excludePunctuation: true,
    includeSpace: false,
  },
});

// Grant EC2 instance access
mongoDbCredentials.grantRead(role);
```

---

## Methods for Accessing EC2

Because the EC2 instance is in a **private subnet**, direct SSH access isn’t possible. Instead, configure **Key Pairs** and **SSM Session Manager**:

```ts
const keyName = "NAME_OF_PAIR";
const cfnKeyPair = new ec2.CfnKeyPair(this, "mongodbCFNKeyPair", {
  keyName: keyName,
  keyFormat: "pem",
  keyType: "rsa",
  tags: [{ key: "Name", value: keyName }],
});
```

Attach an IAM policy for SSM access:

```ts
const ssmPolicyDoc = new iam.PolicyDocument({
  statements: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "ssm:UpdateInstanceInformation",
        "ssmmessages:CreateControlChannel",
        "ssmmessages:CreateDataChannel",
        "ssmmessages:OpenControlChannel",
        "ssmmessages:OpenDataChannel"
      ],
      resources: ["*"]
    })
  ]
});

const ssmPolicy = new iam.Policy(this, "ssmPolicy", {
  document: ssmPolicyDoc
});

role.attachInlinePolicy(ssmPolicy);
```

---

## Step 3: Installing MongoDB

Use **User Data Scripts** to automate MongoDB installation:

```bash
#!/bin/bash
export AWS_DEFAULT_REGION=us-east-1

# Add MongoDB repository
echo "[mongodb-org-4.4]
name=MongoDBRepository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc" | sudo tee /etc/yum.repos.d/mongodb-org-4.4.repo

# Install MongoDB, AWS CLI, jq
sudo yum update -y
sudo yum install -y mongodb-org aws-cli jq

# Start MongoDB
sudo service mongod start
sudo chkconfig mongod on
sleep 20

# Retrieve credentials
MONGO_CREDENTIALS=$(aws secretsmanager get-secret-value --secret-id mongodb/credentials --query SecretString --output text)
MONGO_USERNAME=$(echo $MONGO_CREDENTIALS | jq -r .username)
MONGO_PASSWORD=$(echo $MONGO_CREDENTIALS | jq -r .password)

# MongoDB setup
mongo <<EOF
use MY_DB
db.createCollection("COLLECTION_NAME")
db.createUser({ user: '$MONGO_USERNAME', pwd: '$MONGO_PASSWORD', roles: [{ role: 'readWrite', db: 'yourDatabaseName' }]})
EOF
```

---

## Step 4: Configuring MongoDB

You can embed configuration commands directly:

```ts
instance.addUserData(`
// MongoDB configuration commands
`);
```

---

## Step 5: Securing the Setup

Add strict security group rules. Example:

```ts
mongoDbSecurityGroup.addIngressRule(
  ec2.Peer.anyIpv4(),
  ec2.Port.tcp(27017),
  'Allow MongoDB traffic'
);
```

(Additional security patterns will be covered in future guides.)

---

## Step 6: Deploying the Stack

Run:

```bash
cdk deploy
```

This provisions all AWS resources.

---

## Step 7: Verifying the Setup

1. Log into the AWS Console, find your instance, and click **Connect**.
2. Use **Session Manager** to start a session.
3. Run basic MongoDB commands:

```bash
show dbs
use yourDatabaseName
show collections
```

---

## Conclusion

Using AWS CDK to deploy and configure MongoDB on EC2 provides a **scalable, repeatable, and efficient method** to manage database infrastructure.

With CDK, you can **codify your entire MongoDB environment**, making it easier to version control, audit, and replicate.

👉 The full GitHub repo with all code samples can be found here:
[MongoDB Standalone Stack on GitHub](https://github.com/codex-core/typescript-cdk-db-samples/blob/main/mongo-standalone/lib/mongodb-standalone-stack.ts)

---

## Next Steps

* Explore advanced MongoDB configurations and optimizations.
* Implement monitoring and logging with **AWS CloudWatch**.
* Investigate scaling and high availability for MongoDB on AWS.

By following these steps, you can leverage **AWS CDK** to manage MongoDB deployments effectively, ensuring a **robust and secure database environment** for your applications.
