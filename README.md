# Test Engineer Code Challenge - UI & API Automation

## Overview

This project automates **UI and API testing** for:

- **Saucedemo UI** ([https://www.saucedemo.com/](https://www.saucedemo.com/))
- **Petstore API** ([Swagger Petstore API](https://petstore.swagger.io/))

The framework is built using:

- **UI Testing**: Playwright
- **API Testing**: Mocha, Chai, Axios
- **CI/CD**: GitHub Actions for automated test execution

## Folder Structure

```
GS1/
 ├── .github/workflows/       # CI/CD pipeline (GitHub Actions)
 ├── api/                     # API-related files
 │   ├── tests/               # API test cases
 │   │   ├── petstore/        # API test suite for petstore
 │   │   │   ├── pet-create.test.ts
 │   │   │   ├── pet-delete.test.ts
 │   │   │   ├── pet-negative.test.ts
 │   │   │   ├── pet-read.test.ts
 │   │   │   ├── pet-update.test.ts
 │   ├── utils/               # API utilities
 │   │   ├── request.ts       # API request wrapper (GET, POST, PUT, DELETE)
 │   ├── .env                 # API environment variables
 │   ├── .mocharc.js          # Mocha configuration
 │   ├── api-config.ts        # API settings (BASE_URL, API_KEY, etc.)
 ├── ui/                      # UI-related files
 │   ├── pages/               # Page Object Model (POM) for UI tests
 │   │   ├── base.page.ts
 │   │   ├── cart.page.ts
 │   │   ├── login.page.ts
 │   │   ├── product.page.ts
 │   ├── tests/               # UI test cases
 │   │   ├── cart-checkout-negative.test.ts
 │   │   ├── cart-checkout.test.ts
 │   │   ├── login.test.ts
 │   │   ├── product-filter.test.ts
 │   ├── utils/               # UI utilities
 │   │   ├── credentials.ts
 │   │   ├── filters.ts
 │   │   ├── messages.ts
 │   │   ├── urls.ts
 │   ├── .env                 # UI environment variables
 │   ├── ui-config.ts         # UI settings (LOG_LEVEL, etc.)
 ├── reports/                 # Test reports (UI & API)
 ├── playwright-report/       # UI test reports (HTML, Traces)
 ├── .gitignore               # Git ignore settings
 ├── package-lock.json        # Lock file for dependencies
 ├── package.json             # Project dependencies and scripts
 ├── playwright.config.ts     # Playwright configuration
 ├── tsconfig.json            # TypeScript configuration
 ├── README.md                # Documentation
```

---

## Prerequisites

Before running the tests, ensure the following:

- **Node.js 18+** installed  
- **Git** installed and configured  
- API and UI environment variables properly set in `.env` files  

---

## Setup Instructions

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Ensure `.env` files are set up properly.

#### API Environment Variables (`api/.env`)

```env
LOG_LEVEL=info
BASE_URL=https://petstore.swagger.io/v2
API_KEY=special-key
API_TIMEOUT=10000
```

#### UI Environment Variables (`ui/.env`)

```env
LOG_LEVEL=info
```

---

## Running Tests

### Run All Tests (UI & API)

```bash
npm test
```

### Run Only API Tests

```bash
npm run test:api
```

### Run Only UI Tests

```bash
npm run test:ui
```

### Run a Specific Test File

```bash
npx playwright test ui/tests/login.test.ts
npx mocha api/tests/petstore/pet-create.test.ts
```

### Run Tests in Debug Mode

```bash
LOG_LEVEL=debug npm test
```

Logging is controlled by `LOG_LEVEL` to minimize unnecessary logs in CI/CD.

---

## Test Scenarios Covered

### UI Tests (Saucedemo)

The Playwright UI tests automate **user interactions and validations** for:
- **Login Functionality**: Valid and invalid login cases.
- **Product Filtering**: Sort products by price.
- **Cart & Checkout**:
  - Add products to cart
  - Complete checkout
  - Handle missing checkout fields

### API Tests (Petstore)

The API tests automate **CRUD operations** on pets:
- **Create a Pet**: Add a pet with valid data.
- **Read a Pet**: Retrieve pet details.
- **Update a Pet**: Modify pet information.
- **Delete a Pet**: Remove pet and verify deletion.
- **Negative Scenarios**:
  - Handle invalid API requests.
  - Validate error responses for incorrect inputs.

---

## Checking Test Reports

### UI Test Reports (Playwright)

After UI tests, reports are available at:
- **HTML Report**: `playwright-report/index.html`
- **Traces (Failures Only)**: `playwright-report/trace/`

To view the HTML report:
```bash
npx playwright show-report
```

### API Test Reports (Mocha)

After API tests, reports are stored in `reports/api/`:
- **JSON Report**: `reports/api/api-report.json`
- **HTML Report**: `reports/api/api-report.html`

To open the HTML report:
```bash
npx mochawesome-report-generator reports/api/api-report.json
```

---

## CI/CD (GitHub Actions)

- Tests run automatically on every push.
- Artifacts are uploaded, including Playwright reports and traces.
- Failures are captured in CI logs for debugging.

---

## Debugging Failed Tests

If a test fails:

1. **Check the logs**: CI/CD will display error messages.
2. **View Reports**:
   - Open `playwright-report/index.html` for UI tests.
   - Open `reports/api/api-report.html` for API test failures.
3. **Re-run tests locally**:
   ```bash
   LOG_LEVEL=debug npm test
   ```
4. **Check API responses**: Ensure the API is returning expected data.

---

## Contributing

1. Clone the repository:
   ```bash
   git clone https://github.com/mozn51/GS1.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
4. Make changes and run tests.
5. Push the branch and create a pull request.

