# Nex Checkout Automation

A Node.js-based automation tool for testing and validating Stripe checkout flows using Puppeteer. This tool allows you to automate the process of testing checkout experiences with multiple user configurations.

## Features

- Automated Stripe checkout testing
- Support for multiple user groups and configurations
- Configurable test scenarios via YAML
- Headless browser automation with Puppeteer
- Screenshot capture capability
- Customizable delay settings

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A valid Stripe checkout configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/nex-checkout-automation.git
cd nex-checkout-automation
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

## Configuration

The project uses a `config.yaml` file to manage test configurations. The file should include:

- User groups
- Payment links
- Test scenarios
- Delay settings
- Browser configurations

Example configuration structure:
```yaml
headless: false
delay: 1000
groups:
  - name: "Group Name"
    paymentLink: "https://checkout.stripe.com/..."
    users:
      - email: "user@example.com"
        # Additional user details
```

## Usage

1. Update the `config.yaml` file with your test configurations
2. Run the automation script:
```bash
yarn dev
# or
npm run dev
```

The script will:
- Launch a browser instance (headless or visible based on configuration)
- Process each group and user configuration
- Execute the checkout flow
- Capture screenshots (if configured)
- Log results and any errors

## Project Structure

```
.
├── index.js           # Main automation script
├── config.yaml        # Configuration file
├── screenshots/       # Screenshot output directory
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## Dependencies

- `puppeteer`: Web browser automation
- `js-yaml`: YAML file parsing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For support, please open an issue in the repository.
