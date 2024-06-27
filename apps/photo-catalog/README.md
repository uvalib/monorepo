# Photo Catalog Metadata Generator

This project is designed to process a directory of image files, extract their metadata, generate additional contextual metadata using an AI model, and save the resulting information in JSON-LD format. It utilizes the Ollama API for generating descriptive metadata and embeddings, and integrates with various libraries for image processing and metadata extraction.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Directory Structure](#directory-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/uvalib/monorepo.git
   cd monorepo/apps/photo-catalog
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

## Usage

To start processing images, run the following command:

```bash
node index.js -c path/to/context.txt -o output_directory path/to/images
```

### Options

- `-c, --context`: Path to a plain text file containing the collection context.
- `-o, --out`: Directory to store generated metadata files. Default is the current working directory.
- The last argument is the root directory to start processing.

### Example

```bash
node index.js -c context.txt -o metadata_output /Volumes/lib_content107/Addison_2018
```

## Directory Structure

The project directory structure is as follows:

```
photo-catalog/
├── index.js
├── metadata.js
├── imageProcessing.js
├── ollamaApi.js
├── location.js
├── package.json
└── README.md
```

## Configuration

Ensure you have the necessary environment variables set up for the Ollama API and other services you are using. You can add these variables in a `.env` file in the root directory of the project.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes.

## License

This project is licensed under the MIT License.
