# QuickDataProcessor (QDP) Project

## Overview
QuickDataProcessor (QDP) is a serverless data processing platform designed to handle file processing, user interactions, and real-time communication efficiently. It integrates multiple cloud services, including AWS, GCP, and Firebase, to deliver scalable, reliable, and secure solutions.

## Deployed URL
[QuickDataProcessor Frontend
](https://frontend-service-791648625124.us-central1.run.app)
# Features
## Data Processing:

JSON to CSV Conversion: Powered by AWS Glue.
Named Entity Extraction: Uses AWS Lambda for TXT file processing.
Word Cloud Generation: Utilizes GCP Looker Studio for TXT visualization.

## User Management:

Authentication with AWS Cognito.
Multi-factor authentication (2FA/3FA) for enhanced security.

## Real-time Communication:

Customer concerns managed using GCP Pub/Sub.
Automated concern assignments to QDP Agents.

## Notifications:

Event-driven notifications (registration, file processing status) via AWS SNS.

## Feedback and Analytics:

Sentiment analysis using GCP Natural Language API.
User activity and statistics visualized with GCP Looker Studio.

## System Architecture

![System Architecture Diagram](https://github.com/user-attachments/assets/be48dc45-4d34-400d-85d4-e92208810ea8)

## The architecture includes:

Frontend: React-based interface hosted on Google Cloud Run.
Backend Services: Serverless logic implemented with AWS Lambda and GCP Functions.
Databases:
DynamoDB for processed file metadata.
Firestore for user interactions, feedback, and analytics.
Messaging and Notifications:
GCP Pub/Sub for real-time messaging.
AWS SNS and SQS for event-based notifications.

## Modules

### Module 1: User Management

Authentication and authorization using AWS Cognito.
Multi-factor authentication (MFA) to ensure security.

### Module 2: Virtual Assistant
Dialogflow-powered chatbot for navigation, file queries, and concern submissions.
Stores customer concerns in Firebase for agent resolution.

### Module 3: Real-time Messaging
GCP Pub/Sub for concern handling and assignment.
Assigns concerns to QDP Agents automatically using Cloud Functions.

### Module 4: Notifications
Event-based notifications via AWS SNS and SQS.
Logs notifications in DynamoDB for auditing and analytics.

### Module 5: Data Processing
File uploads with validation for TXT, JSON, and CSV formats.
Serverless data processing pipelines:
JSON to CSV conversion using AWS Glue.
Named Entity Extraction using AWS Lambda.
Word Cloud Generation using GCP Looker Studio.
Results stored in DynamoDB and GCP buckets.

### Module 6: Feedback System
Feedback submission linked to processing reference codes.
Sentiment analysis powered by GCP Natural Language API.
Feedback records stored in Firestore for visualization and reporting.

### Module 7: Web application building and deployment
CICD pipeline
Cloud build


## Functional Testing
The project has been rigorously tested for:

User Flows: File uploads, chatbot interactions, and notification triggers.
Scalability: Ensuring the system handles concurrent users and high-volume data processing.
Error Handling: Validating edge cases for robust system reliability.
