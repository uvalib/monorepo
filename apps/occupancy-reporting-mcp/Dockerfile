# Dockerfile for occupancy-reporting MCP server
# Deploys to AWS AgentCore Runtime (listens on 0.0.0.0:8000/mcp)

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies needed by cryptography / PyMySQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (layer-cached unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY server.py .
COPY db_helper.py .
COPY hours_helper.py .
COPY processing.py .
COPY report_generator.py .

# AgentCore expects the server on 0.0.0.0:8000
EXPOSE 8000

# Pass --http so server.py selects the streamable-http transport
CMD ["python", "server.py", "--http"]
