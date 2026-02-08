# Changelog

All notable changes to @rendervid/cloud-rendering will be documented in this file.

## [Unreleased]

### Added (Docker Backend) ✅ NEW
- Docker backend implementation (DockerBackend class)
- Local filesystem storage (LocalStorage class)
- Job queue with priority support and concurrency limits
- Worker container (Chromium + FFmpeg + rendering logic)
- Merger container (FFmpeg concatenation)
- Docker Compose configuration
- Build scripts for container images
- Docker deployment guide
- Queue statistics API
- Automatic job cleanup
- Resource limits configuration
- Docker usage examples

### Added (Phase 1: Foundation) ✅
- Core package structure and TypeScript configuration
- `CloudBackend` interface for provider abstraction
- `CloudRenderer` main API class with multi-cloud support
- Type definitions for all data structures (RenderOptions, JobStatus, etc.)
- Chunking algorithm for optimal frame distribution
- Job polling utilities with progress tracking
- S3-compatible state manager for job management
- Shared utilities:
  - Frame renderer interface
  - FFmpeg encoder wrapper
  - FFmpeg merger for chunk concatenation
  - Configuration loader from environment variables
- Comprehensive documentation:
  - README with quick start guide
  - API documentation
  - Examples directory
  - .env.example template
- Unit tests for chunking algorithm
- Jest configuration

### Added (Phase 2: AWS Lambda) ✅
- AWS S3 storage client with S3CompatibleStorage interface
- AWS Lambda backend implementation (AWSBackend class)
- Main coordinator Lambda function
  - Template validation (fail fast)
  - Chunk calculation and job orchestration
  - Parallel worker invocation
- Worker rendering Lambda function
  - Chromium-based frame rendering
  - FFmpeg chunk encoding
  - S3 progress tracking
- Merger concatenation Lambda function
  - FFmpeg chunk concatenation with copy codec
  - Final video upload to S3
  - Completion marker writing
- CDK deployment infrastructure
  - Storage stack (S3 bucket with lifecycle policies)
  - Functions stack (Main, Worker, Merger Lambdas)
  - IAM roles and permissions
  - Chromium layer integration
- Comprehensive AWS deployment guide
- Background merger monitoring in AWSBackend

### Added (Phase 3: Azure Functions) ✅
- Azure Blob Storage client
- Azure Functions backend (AzureBackend)
- HTTP-triggered Azure Functions (Main, Worker, Merger)
- Blob Storage state management

### Added (Phase 4: Google Cloud Functions) ✅
- Google Cloud Storage client
- GCP Cloud Functions backend (GCPBackend)
- HTTP-triggered Cloud Functions
- Cloud Storage state management

### Added (Phase 5: Error Handling & Reliability) ✅
- Retry handler with exponential backoff
- Retryable error detection
- Structured logging system (JSON format)
- Log levels and context-aware logging

### Added (Phase 6: Testing & Quality Assurance) ✅
- Integration tests for all providers (AWS, Azure, GCP)
- Video quality validation utilities
- FFmpeg-based metrics extraction
- Quality validation (duration, FPS, resolution)

### Added (Phase 7: Documentation) ✅
- Complete AWS deployment guide
- API documentation in README
- Troubleshooting guides
- Cost optimization tips

### Added (Phase 8: Integration Examples) ✅
- MCP server integration example (3 tools)
- REST API server example (Express.js)
- CLI tool example (full-featured)
- Environment-based provider selection

## [0.1.0] - 2026-02-06

### Added
- Initial package setup
- Phase 1 foundation complete
- Core interfaces and utilities
- Multi-cloud architecture design

---

**Legend**:
- ✅ Complete
- 🚧 In Progress
- 📋 Planned
