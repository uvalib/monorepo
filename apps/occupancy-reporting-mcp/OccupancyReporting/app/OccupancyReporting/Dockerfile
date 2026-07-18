FROM --platform=linux/arm64 python:3.10-slim

WORKDIR /app

# System deps required by cryptography and PyMySQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies from pyproject.toml
COPY pyproject.toml .
RUN pip install --no-cache-dir \
    "mcp>=1.19.0" \
    uvicorn \
    pandas \
    numpy \
    sqlalchemy \
    pymysql \
    requests \
    python-dotenv \
    cryptography

# Copy application source (explicit list so tests / local artifacts stay out of the image)
COPY main.py .
COPY db_helper.py .
COPY hours_helper.py .
COPY processing.py .
COPY report_generator.py .
COPY camera_quirks.py .

# AgentCore expects the MCP server on 0.0.0.0:8000/mcp
EXPOSE 8000

CMD ["python", "main.py"]
