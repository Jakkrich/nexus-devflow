# 🧪 Test Generation and Execution

## Usage: `/13-Test [target]`

Generates missing tests, runs existing test suites, or checks test coverage for the project.

---

## 🛠️ Sub-commands

- `/13-Test`                - Run all tests
- `/13-Test [file/feature]` - Generate tests for a specific target
- `/13-Test coverage`       - Show test coverage report
- `/13-Test watch`          - Run tests in watch mode

---

## 🚦 Internal Process

### Scenario A: Generate Tests
If the user requests tests for a target:
1. **Analyze**: Identify functions, edge cases, and external dependencies.
2. **Generate Cases**: Develop Happy path, Error cases, Edge cases.
3. **Write**: Implement the tests using the project's testing framework (Pytest, Jest, Vitest, etc.). Follow the `Arrange-Act-Assert` pattern and mock external dependencies.

### Scenario B: Execute Tests
Use the project's native command (e.g., `npm test`, `pytest`) to run the tests and format the output clearly for the user. Highlight any failed tests with expected vs received values.

---

## 🛡️ Key Principles
- **Test behavior, not implementation.**
- **One assertion per test** (when practical).
- **Descriptive test names.**
- **Arrange-Act-Assert pattern.**

## 📝 Output Formats

### For Test Generation
Generate a summary indicating:
- **Test Plan**: Table of Test Case, Type, Coverage (Happy path, error case, validation)
- **Generated Tests**: File path and the code block
- **Run command**: e.g. `npm test`

### For Test Execution
Display an organized output listing Passed/Failed files, and explicitly show the expectation vs received outcome for failed assertions.
