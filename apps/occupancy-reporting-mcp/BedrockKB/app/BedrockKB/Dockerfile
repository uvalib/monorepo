FROM --platform=linux/arm64 python:3.10-slim

WORKDIR /app

# System deps required by cryptography and boto3
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies from pyproject.toml
COPY pyproject.toml .
RUN pip install --no-cache-dir \
    "mcp>=1.19.0,<2" \
    uvicorn \
    boto3 \
    requests \
    python-dotenv \
    cryptography

# Copy application source
COPY main.py .
COPY kb_helper.py .

# AgentCore expects the MCP server on 0.0.0.0:8000/mcp
EXPOSE 8000

CMD ["python", "main.py"]
